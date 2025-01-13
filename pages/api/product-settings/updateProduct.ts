import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'PUT') {
        try {
            const { ProductKey, translations, badges, ...productData } = req.body;

            if (!ProductKey) {
                return res.status(400).json({ error: 'Product key is required' });
            }

            // Update product main data
            await db.executeQuery(`
                UPDATE "Products"
                SET
                    "CategoryID" = COALESCE($1, "CategoryID"),
                    "TaxPercent" = COALESCE($2, "TaxPercent"),
                    "OrderByWeight" = COALESCE($3, "OrderByWeight"),
                    "UpdatedAt" = CURRENT_TIMESTAMP
                WHERE "ProductKey" = $4
            `, [
                productData.CategoryID,
                productData.TaxPercent,
                productData.OrderByWeight,
                ProductKey
            ]);

            // Update translations if provided
            if (translations && translations.length > 0) {
                // Delete existing translations
                await db.executeQuery(`
                    DELETE FROM "ProductsTranslations"
                    WHERE "ProductKey" = $1
                `, [ProductKey]);

                // Insert new translations
                const values = translations.map((t: any, i: number) => 
                    `($1, $${i * 2 + 2}, $${i * 2 + 3})`
                ).join(',');
                
                const params = [ProductKey];
                translations.forEach((t: any) => {
                    params.push(t.languageKey, t.name);
                });

                await db.executeQuery(`
                    INSERT INTO "ProductsTranslations" ("ProductKey", "LanguageKey", "Name")
                    VALUES ${values}
                `, params);
            }

            // Update badges if provided
            if (badges && badges.length > 0) {
                // Delete existing badge associations
                await db.executeQuery(`
                    DELETE FROM "ProductBadges"
                    WHERE "ProductKey" = $1
                `, [ProductKey]);

                // Insert new badge associations
                const values = badges.map((b: any, i: number) => 
                    `($1, $${i + 2})`
                ).join(',');
                
                const params = [ProductKey, ...badges.map((b: any) => b.badgeKey)];

                await db.executeQuery(`
                    INSERT INTO "ProductBadges" ("ProductKey", "BadgeKey")
                    VALUES ${values}
                `, params);
            }

            // Return updated product
            const updatedProduct = await db.executeQuery(`
                SELECT 
                    p.*,
                    json_agg(DISTINCT jsonb_build_object(
                        'languageKey', pt."LanguageKey",
                        'name', pt."Name",
                        'description', pt."Description"
                    )) as translations,
                    json_agg(DISTINCT jsonb_build_object(
                        'badgeKey', pb."BadgeKey",
                        'badge', json_build_object(
                            'code', b."Code",
                            'translations', (
                                SELECT json_agg(jsonb_build_object(
                                    'languageKey', bt."LanguageKey",
                                    'name', bt."Name"
                                ))
                                FROM "BadgesTranslations" bt
                                WHERE bt."BadgeKey" = b."BadgeKey"
                            )
                        )
                    )) as badges
                FROM "Products" p
                LEFT JOIN "ProductsTranslations" pt ON p."ProductKey" = pt."ProductKey"
                LEFT JOIN "ProductBadges" pb ON p."ProductKey" = pb."ProductKey"
                LEFT JOIN "Badges" b ON pb."BadgeKey" = b."BadgeKey"
                WHERE p."ProductKey" = $1
                GROUP BY p."ProductKey"
            `, [ProductKey]);

            res.status(200).json(updatedProduct[0]);
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({ error: 'Failed to update product' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'PUT') {
        try {
            const { ProductKey, Translations, badges, Weight, PreparationTime, GroupID, ProductCode, CategoryID, Rating, Calories } = req.body;

            if (!ProductKey) {
                return res.status(400).json({ error: 'Product key is required' });
            }

            // Update or Insert ProductsExtends
            if (GroupID && ProductCode && CategoryID) {
                await db.executeQuery(`
                    INSERT INTO "ProductsExtends" 
                    ("ProductKey", "GroupID", "CategoryID", "ProductCode", "PreparationTime", "Weight", "Rating", "Calories")
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    ON CONFLICT ("ProductKey", "GroupID", "CategoryID", "ProductCode") 
                    DO UPDATE SET 
                        "PreparationTime" = EXCLUDED."PreparationTime",
                        "Weight" = EXCLUDED."Weight",
                        "Rating" = EXCLUDED."Rating",
                        "Calories" = EXCLUDED."Calories",
                        "UpdatedAt" = CURRENT_TIMESTAMP
                `, [ProductKey, GroupID, CategoryID, ProductCode, PreparationTime, Weight, Rating, Calories]);
            }

            // Update translations if provided
            if (Translations) {
                // Delete existing translations
                await db.executeQuery(`
                    DELETE FROM "ProductsTranslations"
                    WHERE "ProductKey" = $1
                `, [ProductKey]);

                // Insert new translations
                const translationEntries = Object.entries(Translations);
                const values = translationEntries.map((_, i) => 
                    `($1, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4}, $${i * 4 + 5})`
                ).join(',');
                
                const params = [ProductKey];
                translationEntries.forEach(([langKey, translation]: [string, any]) => {
                    params.push(
                        langKey,
                        translation.Name,
                        translation.Description,
                        translation.ImageUrl
                    );
                });

                await db.executeQuery(`
                    INSERT INTO "ProductsTranslations" 
                    ("ProductKey", "LanguageKey", "Name", "Description", "ImageUrl")
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
                const values = badges.map((_, i) => 
                    `($1, $${i * 2 + 2}, $${i * 2 + 3})`
                ).join(',');
                
                const params = [ProductKey];
                badges.forEach((b: any) => {
                    params.push(b.BadgeKey, b.IsActive);
                });

                await db.executeQuery(`
                    INSERT INTO "ProductBadges" ("ProductKey", "BadgeKey", "IsActive")
                    VALUES ${values}
                `, params);
            }

            // Return updated product
            const updatedProduct = await db.executeQuery(`
                SELECT 
                    p.*,
                    pe."PreparationTime",
                    pe."Weight",
                    pe."Rating",
                    pe."Calories",
                    (
                        SELECT jsonb_object_agg(
                            pt."LanguageKey",
                            jsonb_build_object(
                                'languageKey', pt."LanguageKey",
                                'name', pt."Name",
                                'description', pt."Description",
                                'ImageUrl', pt."ImageUrl"
                            )
                        )
                        FROM "ProductsTranslations" pt
                        WHERE pt."ProductKey" = p."ProductKey"
                    ) as "Translations",
                    COALESCE(
                        (
                            SELECT json_agg(DISTINCT jsonb_build_object(
                                'BadgeKey', pb."BadgeKey",
                                'IsActive', pb."IsActive",
                                'Badge', json_build_object(
                                    'BadgeKey', b."BadgeKey",
                                    'Code', b."Code",
                                    'Translations', (
                                        SELECT jsonb_object_agg(
                                            bt."LanguageKey",
                                            jsonb_build_object(
                                                'languageKey', bt."LanguageKey",
                                                'name', bt."Name"
                                            )
                                        )
                                        FROM "BadgesTranslations" bt
                                        WHERE bt."BadgeKey" = b."BadgeKey"
                                    )
                                )
                            ))
                            FROM "ProductBadges" pb
                            LEFT JOIN "Badges" b ON pb."BadgeKey" = b."BadgeKey"
                            WHERE pb."ProductKey" = p."ProductKey"
                        ),
                        '[]'::json
                    ) as "activeBadges"
                FROM "Products" p
                LEFT JOIN "ProductsExtends" pe ON p."ProductKey" = pe."ProductKey" 
                    AND pe."GroupID" = $2 
                    AND pe."CategoryID" = $3 
                    AND pe."ProductCode" = $4
                WHERE p."ProductKey" = $1
                GROUP BY p."ProductKey", pe."PreparationTime", pe."Weight", pe."Rating", pe."Calories"
            `, [ProductKey, GroupID, CategoryID, ProductCode]);

            res.status(200).json(updatedProduct[0]);
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({ error: 'Failed to update product' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

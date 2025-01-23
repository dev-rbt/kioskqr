import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';
import { Product } from '@/types/settings';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        try {
            // Ürünleri, çevirileri ve aktif rozetleri ile birlikte getir
            const products = await db.executeQuery<Product[]>(`
                SELECT
                    mil."TemplateKey",
                    mil."DisplayIndex", 
                    p."ProductName" as "OriginalName",
                    p."ProductKey" as "ProductID",
                    p.*,
                    pe."Weight",
                    pe."PreparationTime",
                    pe."Rating",
                    pe."Calories",
                    COALESCE(
                        (
                            SELECT jsonb_object_agg(
                                pt."LanguageKey",
                                jsonb_build_object(
                                    'LanguageKey', pt."LanguageKey",
                                    'Name', pt."Name",
                                    'Description', pt."Description",
                                    'ImageUrl', pt."ImageUrl"
                                )
                            )
                            FROM "ProductsTranslations" pt
                            WHERE pt."ProductKey" = p."ProductKey"
                        ),
                        '{}'::jsonb
                    ) as "Translations",
                    COALESCE(
                        (
                            SELECT json_agg(
                                jsonb_build_object(
                                    'BadgeKey', b."BadgeKey",
                                    'Code', b."Code",
                                    'IsActive', pb."IsActive",
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
                            )
                            FROM "ProductBadges" pb
                            LEFT JOIN "Badges" b ON pb."BadgeKey" = b."BadgeKey"
                            WHERE pb."ProductKey" = p."ProductKey"
                            AND b."IsActive" = true
                        ),
                        '[]'::json
                    ) as "activeBadges"
                FROM "Products" p
                LEFT JOIN "MenuItemLayout" mil ON p."ProductKey"=mil."MenuItemKey"
                LEFT JOIN "ProductsExtends" pe ON p."ProductKey" = pe."ProductKey"
                    AND pe."GroupID" = p."GroupID"
                    AND pe."CategoryID" = p."CategoryID"
                    AND pe."ProductCode" = p."ProductCode"

                WHERE p."IsActive" = true AND  p."IsSaleProduct" = true
                ORDER BY p."ProductName"
            `);

            res.status(200).json(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ error: 'Failed to fetch products' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

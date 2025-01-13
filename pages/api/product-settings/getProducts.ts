import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        try {
            // Ürünleri, çevirileri ve aktif rozetleri ile birlikte getir
            const products = await db.executeQuery(`
                SELECT 
                    p.*,
                    json_agg(DISTINCT jsonb_build_object(
                        'languageKey', pt."LanguageKey",
                        'name', pt."Name",
                        'description', pt."Description"
                    )) as translations,
                    COALESCE(
                        (
                            SELECT json_agg(DISTINCT jsonb_build_object(
                                'badgeKey', pb."BadgeKey",
                                'badge', json_build_object(
                                    'code', b."Code",
                                    'translations', (
                                        SELECT json_agg(jsonb_build_object(
                                            'languageKey', bt."LanguageKey",
                                            'name', bt."Name"
                                        ))
                                        FROM "BadgesTranslations" bt
                                        WHERE bt."BadgeKey" = b."BadgeKey" AND b."IsActive" = true
                                    )
                                )
                            ))
                            FROM "ProductBadges" pb
                            LEFT JOIN "Badges" b ON pb."BadgeKey" = b."BadgeKey"
                            WHERE pb."ProductKey" = p."ProductKey" AND b."IsActive" = true
                        ),
                        '[]'::json
                    ) as activeBadges
                FROM "Products" p
                LEFT JOIN "ProductsTranslations" pt ON p."ProductKey" = pt."ProductKey"
                WHERE p."IsActive" = true
                GROUP BY p."ProductKey"
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

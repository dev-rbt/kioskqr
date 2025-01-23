import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';
import { Badge } from '@/types/settings';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        try {
            const { productKey } = req.query;
            console.log(productKey);
            // Tüm rozetleri ve çevirilerini getir
            const badges = await db.executeQuery<Badge[]>(`
                            SELECT 
                                b."BadgeKey",                   
                                b."Code",
                                COALESCE(pb."IsActive", false) as "IsActive",
                                (
                                    SELECT jsonb_object_agg(
                                        bt."LanguageKey",
                                        jsonb_build_object(
                                            'languageKey', bt."LanguageKey",
                                            'name', bt."Name"
                                        )
                                    )
                                    FROM "BadgesTranslations" bt
                                    WHERE bt."BadgeKey" = b."BadgeKey"
                                ) as "translations"
                            FROM "Badges" b
                            LEFT JOIN "ProductBadges" pb ON b."BadgeKey" = pb."BadgeKey" 
                                AND pb."ProductKey" = $1
                            WHERE b."IsActive" = true
                            ORDER BY b."Code"
            `, [productKey]);

            res.status(200).json(badges);
        } catch (error) {
            console.error('Error fetching badges:', error);
            res.status(500).json({ error: 'Failed to fetch badges' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

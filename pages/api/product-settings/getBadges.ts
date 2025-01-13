import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        try {
            // Tüm rozetleri ve çevirilerini getir
            const badges = await db.executeQuery(`
                SELECT 
                    b.*,
                    json_agg(DISTINCT jsonb_build_object(
                        'languageKey', bt."LanguageKey",
                        'name', bt."Name"
                    )) as translations
                FROM "Badges" b
                LEFT JOIN "BadgesTranslations" bt ON b."BadgeKey" = bt."BadgeKey"
                WHERE b."IsActive" = true
                GROUP BY b."BadgeKey"
                ORDER BY b."Code"
            `);

            res.status(200).json(badges);
        } catch (error) {
            console.error('Error fetching badges:', error);
            res.status(500).json({ error: 'Failed to fetch badges' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

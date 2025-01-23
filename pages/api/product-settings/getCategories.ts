import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        try {
            const categories = await db.executeQuery<{id: string, name: string}>(`
                SELECT DISTINCT "CategoryID" as id, "CategoryName" as name
                FROM "Products"
                WHERE "CategoryID" IS NOT NULL AND "CategoryName" IS NOT NULL
                ORDER BY "CategoryName"
            `);

            res.status(200).json(categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
            res.status(500).json({ error: 'Failed to fetch categories' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

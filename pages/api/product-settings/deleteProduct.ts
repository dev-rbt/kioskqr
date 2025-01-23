import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'DELETE') {
        try {
            const { id } = req.query;

            if (!id) {
                return res.status(400).json({ error: 'Product ID is required' });
            }

            // Delete product translations
            await db.executeQuery(`
                DELETE FROM "ProductsTranslations"
                WHERE "ProductKey" = $1
            `, [id]);

            // Delete product badge associations
            await db.executeQuery(`
                DELETE FROM "ProductBadges"
                WHERE "ProductKey" = $1
            `, [id]);

            // Delete product
            await db.executeQuery(`
                DELETE FROM "Products"
                WHERE "ProductKey" = $1
            `, [id]);

            res.status(204).end();
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).json({ error: 'Failed to delete product' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';
import { PriceTemplate } from '@/types/template';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        try {
            const templates = await db.executeQuery<PriceTemplate>(`
                SELECT 
                    "PriceTemplateKey",
                    "PriceTemplateName",
                    "IsActive",
                    "UpdatedAt"
                FROM 
                    "PriceTemplates"
                WHERE 
                    "IsActive" = true
                ORDER BY 
                    "PriceTemplateName" ASC
            `);

            res.status(200).json(templates);
        } catch (error) {
            console.error('Error fetching price templates:', error);
            res.status(500).json({ error: 'Failed to fetch price templates' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

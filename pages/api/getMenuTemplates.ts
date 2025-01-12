import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';

interface MenuTemplate {
    TemplateKey: string;
    TemplateName: string;
    TemplateMode: number;
    IsActive: boolean;
    UpdatedAt?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        try {
            const templates = await db.executeQuery<MenuTemplate>(`
                SELECT 
                    "TemplateKey",
                    "TemplateName",
                    "TemplateMode",
                    "IsActive",
                    "UpdatedAt"
                FROM 
                    "MenuTemplates"
                WHERE 
                    "IsActive" = true
                ORDER BY 
                    "TemplateName" ASC
            `);

            res.status(200).json(templates);
        } catch (error) {
            console.error('Error fetching menu templates:', error);
            res.status(500).json({ error: 'Failed to fetch menu templates' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

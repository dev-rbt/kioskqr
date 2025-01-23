import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';
import { Branch, BranchResponse } from '@/types/branch';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        try {
            // Get branches with template information
            const branches = await db.executeQuery<Branch>(`
                SELECT 
                    b."BranchID",
                    b."BranchName",
                    b."KioskMenuTemplateKey",
                    b."PriceTemplateKey",
                    b."IsActive",
                    b."UpdatedAt",
                    mt."TemplateName" as "MenuTemplateName",
                    pt."PriceTemplateName" as "PriceTemplateName",
                    bst."TemplateKey" as "SettingsTemplateKey",
                    st."TemplateName" as "SettingsTemplateName",
                    st."MainColor",
                    st."SecondColor",
                    st."AccentColor",
                    st."DefaultLanguageKey",
                    st."LogoUrl"
                FROM 
                    "Branches" b
                LEFT JOIN 
                    "MenuTemplates" mt ON b."KioskMenuTemplateKey" = mt."TemplateKey"
                LEFT JOIN 
                    "PriceTemplates" pt ON b."PriceTemplateKey" = pt."PriceTemplateKey"
                LEFT JOIN 
                    "BranchSettingsTemplates" bst ON b."BranchID" = bst."BranchID" AND bst."IsActive" = true
                LEFT JOIN 
                    "SettingsTemplates" st ON bst."TemplateKey" = st."TemplateKey"
                WHERE 
                    b."IsActive" = true
                ORDER BY 
                    b."BranchName" ASC
            `);


            res.status(200).json(branches);
        } catch (error) {
            console.error('Error fetching branches:', error);
            res.status(500).json({ error: 'Failed to fetch branches' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
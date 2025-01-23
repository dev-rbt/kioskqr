import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';
import { SettingsTemplate, Branch, Language, Banner } from '@/types/template';

/**
 * API endpoint to retrieve settings templates.
 *
 * @param {NextApiRequest} req - The incoming request.
 * @param {NextApiResponse} res - The outgoing response.
 */
async function getTemplates() {
    return await db.executeQuery<SettingsTemplate>(`
        SELECT 
            "TemplateKey",
            "TemplateName",
            "MainColor",
            "SecondColor",
            "AccentColor",
            "DefaultLanguageKey",
            "LogoUrl",
            "IsActive",
            "UpdatedAt"
        FROM 
            "SettingsTemplates"
        WHERE 
            "IsActive" = true
    `);
}

async function getTemplateBranches(templateKey: string) {
    return await db.executeQuery<Branch>(`
        SELECT 
            b."BranchID",
            b."BranchName"
        FROM "BranchSettingsTemplates" bt
        JOIN "Branches" b ON b."BranchID" = bt."BranchID"
        WHERE bt."TemplateKey" = $1
    `, [templateKey]);
}

async function getTemplateLanguages(templateKey: string) {
    return await db.executeQuery<Language>(`
        SELECT 
            l."Key" as "LanguageKey",
            l."Name" as "LanguageName"
        FROM "SettingsTemplateLanguages" tl
        JOIN "Languages" l ON l."Key" = tl."LanguageKey"
        WHERE tl."TemplateKey" = $1
    `, [templateKey]);
}

async function getTemplateBanners(templateKey: string) {
    return await db.executeQuery<Banner>(`
        SELECT 
            "BannerID",
            "BannerUrl",
            "DisplayOrder"
        FROM "SettingsTemplateBanners"
        WHERE "TemplateKey" = $1
        ORDER BY "DisplayOrder"
    `, [templateKey]);
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        try {
            const templates = await getTemplates();

            // Fetch related data for each template
            const templatesWithData = await Promise.all(
                templates.map(async (template) => {
                    const [branches, languages, banners] = await Promise.all([
                        getTemplateBranches(template.TemplateKey),
                        getTemplateLanguages(template.TemplateKey),
                        getTemplateBanners(template.TemplateKey)
                    ]);

                    return {
                        ...template,
                        Branches: branches,
                        Languages: languages,
                        Banners: banners
                    };
                })
            );

            res.status(200).json(templatesWithData);
        } catch (error) {
            console.error('Error fetching templates:', error);
            res.status(500).json({ error: 'Failed to fetch templates' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

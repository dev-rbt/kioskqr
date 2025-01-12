import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';

interface Branch {
    BranchID: number;
    BranchName: string;
    KioskMenuTemplateKey: string;
    PriceTemplateKey: string;
    SettingsTemplateKey: string;
    IsActive: boolean;
    MenuTemplateName?: string;
    PriceTemplateName?: string;
    SettingsTemplateName?: string;
    UpdatedAt?: string;
}

interface BranchTemplate {
    TemplateKey: string;
    TemplateName: string;
    MainColor: string;
    SecondColor: string;
    AccentColor: string;
    DefaultLanguageKey: string;
    LogoUrl: string;
    IsActive: boolean;
}

interface TemplateLanguage {
    TemplateKey: string;
    LanguageKey: string;
    IsActive: boolean;
}

interface TemplateBanner {
    BannerID: number;
    TemplateKey: string;
    BannerUrl: string;
    DisplayOrder: number;
    IsActive: boolean;
}

interface BranchResponse {
    branches: Branch[];
    settings: Record<string, BranchTemplate>;
    languages: Record<string, TemplateLanguage[]>;
    banners: Record<string, TemplateBanner[]>;
}

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
                    b."SettingsTemplateKey",
                    b."IsActive",
                    mt."TemplateName" as "MenuTemplateName",
                    pt."PriceTemplateName" as "PriceTemplateName",
                    bt."TemplateName" as "SettingsTemplateName",
                    b."UpdatedAt"
                FROM 
                    "Branches" b
                LEFT JOIN 
                    "MenuTemplates" mt ON b."KioskMenuTemplateKey" = mt."TemplateKey"
                LEFT JOIN 
                    "PriceTemplates" pt ON b."PriceTemplateKey" = pt."PriceTemplateKey"
                LEFT JOIN 
                    "BranchTemplates" bt ON b."SettingsTemplateKey" = bt."TemplateKey"
                WHERE 
                    b."IsActive" = true
                ORDER BY 
                    b."BranchName" ASC
            `);

            // Get all settings templates used by the branches
            const settingsTemplateKeys = branches
                .map(b => b.SettingsTemplateKey)
                .filter(key => key != null);

            // Get settings templates
            const settings = await db.executeQuery<BranchTemplate>(`
                SELECT 
                    "TemplateKey",
                    "TemplateName",
                    "MainColor",
                    "SecondColor",
                    "AccentColor",
                    "DefaultLanguageKey",
                    "LogoUrl",
                    "IsActive"
                FROM 
                    "BranchTemplates"
                WHERE 
                    "TemplateKey" = ANY($1)
                    AND "IsActive" = true
            `, [settingsTemplateKeys]);

            // Get languages for all templates
            const languages = await db.executeQuery<TemplateLanguage>(`
                SELECT 
                    "TemplateKey",
                    "LanguageKey",
                    "IsActive"
                FROM 
                    "BranchTemplateLanguages"
                WHERE 
                    "TemplateKey" = ANY($1)
            `, [settingsTemplateKeys]);

            // Get banners for all templates
            const banners = await db.executeQuery<TemplateBanner>(`
                SELECT 
                    "BannerID",
                    "TemplateKey",
                    "BannerUrl",
                    "DisplayOrder",
                    "IsActive"
                FROM 
                    "BranchTemplateBanners"
                WHERE 
                    "TemplateKey" = ANY($1)
                    AND "IsActive" = true
                ORDER BY 
                    "DisplayOrder" ASC
            `, [settingsTemplateKeys]);

            // Convert arrays to objects keyed by TemplateKey
            const settingsMap = settings.reduce((acc, setting) => {
                acc[setting.TemplateKey] = setting;
                return acc;
            }, {} as Record<string, BranchTemplate>);

            const languagesMap = languages.reduce((acc, lang) => {
                if (!acc[lang.TemplateKey]) {
                    acc[lang.TemplateKey] = [];
                }
                acc[lang.TemplateKey].push(lang);
                return acc;
            }, {} as Record<string, TemplateLanguage[]>);

            const bannersMap = banners.reduce((acc, banner) => {
                if (!acc[banner.TemplateKey]) {
                    acc[banner.TemplateKey] = [];
                }
                acc[banner.TemplateKey].push(banner);
                return acc;
            }, {} as Record<string, TemplateBanner[]>);

            const response: BranchResponse = {
                branches,
                settings: settingsMap,
                languages: languagesMap,
                banners: bannersMap
            };

            res.status(200).json(response);
        } catch (error) {
            console.error('Error fetching branches:', error);
            res.status(500).json({ error: 'Failed to fetch branches' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
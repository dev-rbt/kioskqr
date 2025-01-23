import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

interface UpdateSettingsTemplateRequest {
    TemplateKey: string;
    TemplateName: string;
    MainColor: string;
    SecondColor: string;
    AccentColor: string;
    DefaultLanguageKey: string;
    LogoUrl: string;
    Languages: Array<{ LanguageKey: string; IsActive: boolean }>;
    Banners: Array<{ BannerUrl: string }>;
    BranchIDs: string[];
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        try {
            const {
                TemplateKey,
                TemplateName,
                MainColor,
                SecondColor,
                AccentColor,
                DefaultLanguageKey,
                LogoUrl,
                Languages,
                Banners,
                BranchIDs
            } = req.body as UpdateSettingsTemplateRequest;

            console.log('Checking template existence for:', TemplateKey);
            const template = await db.findOne('SettingsTemplates', {
                TemplateKey
            });
            
            if (template) {
                console.log('Updating existing template');
                const updateData = {
                    TemplateName,
                    MainColor,
                    SecondColor,
                    AccentColor,
                    DefaultLanguageKey,
                    LogoUrl,
                    UpdatedAt: new Date().toISOString()
                };
                console.log('Update data:', updateData);
                
                await db.update('SettingsTemplates', {
                    TemplateKey
                }, updateData);
            } else {
                console.log('Creating new template');
                await db.insert('SettingsTemplates', {
                    TemplateKey,
                    TemplateName,
                    MainColor,
                    SecondColor,
                    AccentColor,
                    DefaultLanguageKey,
                    LogoUrl,
                    IsActive: true,
                    CreatedAt: new Date().toISOString(),
                    UpdatedAt: new Date().toISOString()
                });
            }

            // Dil bilgilerini güncelle
            if (Languages && Languages.length > 0) {
                console.log('Processing languages:', Languages);
                // Önce mevcut dilleri sil
                await db.delete('SettingsTemplateLanguages', {
                    TemplateKey
                });

                // Yeni dilleri ekle
                if (Languages.length > 0) {
                    const now = new Date().toISOString();
                    const columns = ['TemplateKey', 'LanguageKey', 'IsActive', 'CreatedAt', 'UpdatedAt'];
                    const values = Languages.map(lang => [
                        TemplateKey,
                        lang.LanguageKey,
                        lang.IsActive,
                        now,
                        now
                    ]).flat();

                    const placeholders = Languages.map((_, i) => 
                        `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})`
                    ).join(', ');

                    const insertQuery = `
                        INSERT INTO "SettingsTemplateLanguages" (${columns.map(col => `"${col}"`).join(', ')})
                        VALUES ${placeholders}
                    `;

                    await db.executeQuery(insertQuery, values);
                }
            }

            // Banner bilgilerini güncelle
            if (Banners && Banners.length > 0) {
                console.log('Processing banners:', Banners);
                // Tüm banner'ları sil
                await db.delete('SettingsTemplateBanners', {
                    TemplateKey
                });

                // Yeni banner'ları ekle
                if (Banners.length > 0) {
                    const now = new Date().toISOString();
                    const columns = ['TemplateKey', 'BannerUrl', 'DisplayOrder', 'IsActive', 'CreatedAt', 'UpdatedAt'];
                    const values = Banners.map((banner, index) => [
                        TemplateKey,
                        banner.BannerUrl,
                        index + 1,
                        true,
                        now,
                        now
                    ]).flat();

                    const placeholders = Banners.map((_, i) => 
                        `($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, $${i * 6 + 6})`
                    ).join(', ');

                    const insertQuery = `
                        INSERT INTO "SettingsTemplateBanners" (${columns.map(col => `"${col}"`).join(', ')})
                        VALUES ${placeholders}
                    `;

                    await db.executeQuery(insertQuery, values);
                }
            }

            // Şube bilgilerini güncelle
            if (BranchIDs && BranchIDs.length > 0) {
                console.log('Processing branches:', BranchIDs);
                const branchIds = BranchIDs.map(id => parseInt(id));
                
                // Sadece gelen branch ID'lere ait kayıtları sil
                const deleteQuery = `
                    DELETE FROM "BranchSettingsTemplates"
                    WHERE "BranchID" = ANY($1)
                `;
                await db.executeQuery(deleteQuery, [branchIds]);

                // Yeni şubeleri ekle
                const now = new Date().toISOString();
                const columns = ['BranchID', 'TemplateKey', 'IsActive', 'CreatedAt', 'UpdatedAt'];
                const values = branchIds.map(branchId => [
                    branchId,
                    TemplateKey,
                    true,
                    now,
                    now
                ]).flat();

                const placeholders = branchIds.map((_, i) => 
                    `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})`
                ).join(', ');

                const insertQuery = `
                    INSERT INTO "BranchSettingsTemplates" (${columns.map(col => `"${col}"`).join(', ')})
                    VALUES ${placeholders}
                `;

                await db.executeQuery(insertQuery, values);
            }

            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error updating settings template:', error);
            return res.status(500).json({ error: 'Failed to update settings template' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

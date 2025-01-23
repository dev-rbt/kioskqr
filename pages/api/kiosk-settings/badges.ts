import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        switch (req.method) {
            case 'GET':
                const badges = await db.executeQuery(`
                    SELECT b.*, json_agg(json_build_object(
                        'BadgeKey', bt."BadgeKey",
                        'LanguageKey', bt."LanguageKey",
                        'Name', bt."Name"
                    )) as translations
                    FROM "Badges" b
                    LEFT JOIN "BadgesTranslations" bt ON b."BadgeKey" = bt."BadgeKey"
                    GROUP BY b."BadgeKey", b."Code", b."IsActive", b."CreatedAt", b."UpdatedAt"
                `);
                return res.status(200).json(badges);

            case 'POST':
                const { Code: newCode, translations: newTranslations } = req.body;
                if (!newCode || !newTranslations || !Array.isArray(newTranslations)) {
                    return res.status(400).json({ error: 'Code and translations array are required' });
                }

                const badgeKey = crypto.randomUUID();

                // Önce badge'i ekle
                await db.executeQuery(`
                    INSERT INTO "Badges" ("BadgeKey", "Code", "IsActive")
                    VALUES ($1, $2, true)
                `, [badgeKey, newCode]);

                // Sonra translations'ları ekle
                if (newTranslations.length > 0) {
                    const values = newTranslations.map((t, i) => 
                        `($1, $${i * 2 + 2}, $${i * 2 + 3})`
                    ).join(',');
                    
                    const params = [badgeKey];
                    newTranslations.forEach(t => {
                        params.push(t.LanguageKey, t.Name);
                    });

                    await db.executeQuery(`
                        INSERT INTO "BadgesTranslations" ("BadgeKey", "LanguageKey", "Name")
                        VALUES ${values}
                    `, params);
                }

                const newBadge = await db.executeQuery(`
                    SELECT b.*, json_agg(json_build_object(
                        'BadgeKey', bt."BadgeKey",
                        'LanguageKey', bt."LanguageKey",
                        'Name', bt."Name"
                    )) as translations
                    FROM "Badges" b
                    LEFT JOIN "BadgesTranslations" bt ON b."BadgeKey" = bt."BadgeKey"
                    WHERE b."BadgeKey" = $1
                    GROUP BY b."BadgeKey", b."Code", b."IsActive", b."CreatedAt", b."UpdatedAt"
                `, [badgeKey]);

                return res.status(201).json(newBadge[0]);

            case 'PUT':
                const { BadgeKey, Code: updatedCode, IsActive, translations: updatedTranslations } = req.body;
                if (!BadgeKey) {
                    return res.status(400).json({ error: 'Badge Key is required' });
                }

                // Önce badge'i güncelle
                if (updatedCode !== undefined || IsActive !== undefined) {
                    await db.executeQuery(`
                        UPDATE "Badges" 
                        SET "Code" = COALESCE($1, "Code"),
                            "IsActive" = COALESCE($2, "IsActive")
                        WHERE "BadgeKey" = $3
                    `, [updatedCode, IsActive, BadgeKey]);
                }

                // Eğer translations varsa, önce eskileri sil sonra yenilerini ekle
                if (updatedTranslations && updatedTranslations.length > 0) {
                    // Önce mevcut çevirileri sil
                    await db.executeQuery(`
                        DELETE FROM "BadgesTranslations"
                        WHERE "BadgeKey" = $1
                    `, [BadgeKey]);

                    // Sonra yeni çevirileri ekle
                    const values = updatedTranslations.map((t, i) => 
                        `($1, $${i * 2 + 2}, $${i * 2 + 3})`
                    ).join(',');
                    
                    const params = [BadgeKey];
                    updatedTranslations.forEach(t => {
                        params.push(t.LanguageKey, t.Name);
                    });

                    await db.executeQuery(`
                        INSERT INTO "BadgesTranslations" ("BadgeKey", "LanguageKey", "Name")
                        VALUES ${values}
                    `, params);
                }

                // Güncellenmiş rozeti getir
                const updatedBadge = await db.executeQuery(`
                    SELECT b.*, json_agg(json_build_object(
                        'BadgeKey', bt."BadgeKey",
                        'LanguageKey', bt."LanguageKey",
                        'Name', bt."Name"
                    )) as translations
                    FROM "Badges" b
                    LEFT JOIN "BadgesTranslations" bt ON b."BadgeKey" = bt."BadgeKey"
                    WHERE b."BadgeKey" = $1
                    GROUP BY b."BadgeKey", b."Code", b."IsActive", b."CreatedAt", b."UpdatedAt"
                `, [BadgeKey]);

                return res.status(200).json(updatedBadge[0]);

            case 'DELETE':
                const { key } = req.query;
                if (!key) {
                    return res.status(400).json({ error: 'Badge Key is required' });
                }

                // Önce translations'ları sil
                await db.executeQuery(`
                    DELETE FROM "BadgesTranslations"
                    WHERE "BadgeKey" = $1
                `, [key]);

                // Sonra badge'i sil
                await db.executeQuery(`
                    DELETE FROM "Badges"
                    WHERE "BadgeKey" = $1
                `, [key]);

                return res.status(204).end();

            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                return res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error: any) {
        console.error('Badges API Error:', error);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}

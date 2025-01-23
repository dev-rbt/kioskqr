import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        switch (req.method) {
            case 'GET':
                const languages = await db.executeQuery(`
                    SELECT "Key", "Code", "Name", "IsActive", "DisplayOrderId"
                    FROM "Languages"
                    ORDER BY "DisplayOrderId" ASC
                `);
                return res.status(200).json(languages);

            case 'POST':
                const { Code, Name } = req.body;
                if (!Code || !Name) {
                    return res.status(400).json({ error: 'Code and Name are required' });
                }

                const newLanguage = await db.insert('Languages', {
                    Key: crypto.randomUUID(),
                    Code,
                    Name,
                    IsActive: true,
                    DisplayOrderId: (await db.executeQuery('SELECT MAX("DisplayOrderId") as max FROM "Languages"'))[0].max + 1 || 1
                });
                return res.status(201).json(newLanguage);

            case 'PUT':
                const { Key, ...updateData } = req.body;
                if (!Key) {
                    return res.status(400).json({ error: 'Language Key is required' });
                }

                await db.update('Languages', { Key }, updateData);
                
                // Güncellenmiş dil verisini getir
                const updatedLanguage = await db.executeQuery(`
                    SELECT "Key", "Code", "Name", "IsActive", "DisplayOrderId"
                    FROM "Languages"
                    WHERE "Key" = $1
                `, [Key]);

                return res.status(200).json(updatedLanguage[0]);

            case 'DELETE':
                const { key } = req.query;
                if (!key) {
                    return res.status(400).json({ error: 'Language Key is required' });
                }

                // Önce bu dile ait rozet çevirilerini sil
                await db.delete('BadgesTranslations', { LanguageKey: key });
                
                // Sonra dili sil
                await db.delete('Languages', { Key: key });
                return res.status(204).end();

            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                return res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error: any) {
        console.error('Languages API Error:', error);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}

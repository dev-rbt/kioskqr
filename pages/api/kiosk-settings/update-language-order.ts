import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        res.setHeader('Allow', ['PUT']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { languages } = req.body;

        if (!Array.isArray(languages)) {
            return res.status(400).json({ error: 'Languages array is required' });
        }

        // Her dil için DisplayOrderId güncelle
        await Promise.all(languages.map((lang, index) =>
            db.update('Languages', { Key: lang.Key }, { DisplayOrderId: index + 1 })
        ));

        // Güncellenmiş dilleri getir
        const updatedLanguages = await db.findMany('Languages', {}, ['Key', 'Code', 'Name', 'IsActive', 'DisplayOrderId']);
        return res.status(200).json(updatedLanguages);

    } catch (error: any) {
        console.error('Update Language Order API Error:', error);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}

import { NextApiRequest, NextApiResponse } from 'next';
import { saveFile } from '@/lib/uploadFile';
import { IncomingForm } from 'formidable';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        try {
            const form = new IncomingForm();
            
            const [fields, files] = await new Promise((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    if (err) reject(err);
                    resolve([fields, files]);
                });
            });

            const file = files.file[0];
            const templateKey = fields.templateKey[0];
            const type = fields.type[0] as 'logo' | 'banner';

            if (!file || !templateKey || !type) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const imagePath = await saveFile(file, templateKey, type);

            return res.status(200).json({ 
                success: true, 
                imagePath 
            });
        } catch (error) {
            console.error('Error uploading image:', error);
            return res.status(500).json({ error: 'Failed to upload image' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

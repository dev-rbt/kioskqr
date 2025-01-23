import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { imagePath } = req.body;

        if (!imagePath) {
            return res.status(400).json({ error: 'Image path is required' });
        }

        // Get the absolute path to the public directory
        const publicDir = path.join(process.env.FILE_UPLOAD_DIR || process.cwd());
        
        // Convert URL path to file system path
        const relativePath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
        const absolutePath = path.join(publicDir, relativePath);

        // Check if file exists
        if (fs.existsSync(absolutePath)) {
            // Delete the file
            fs.unlinkSync(absolutePath);
            return res.status(200).json({ success: true });
        } else {
            return res.status(404).json({ error: 'File not found' });
        }
    } catch (error) {
        console.error('Error deleting image:', error);
        return res.status(500).json({ error: 'Failed to delete image' });
    }
}

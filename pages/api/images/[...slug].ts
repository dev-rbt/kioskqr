import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { slug } = req.query;
    const filePath = path.join(process.env.FILE_UPLOAD_DIR || process.cwd(), ...slug as string[]);
    const extension = path.extname(filePath).toLowerCase().substr(1);

    // Güvenlik kontrolleri
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return res.status(400).json({ error: 'Invalid file type' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const stats = fs.statSync(filePath);
    if (stats.size > MAX_FILE_SIZE) {
      return res.status(400).json({ error: 'File too large' });
    }

    // Cache headers
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Content-Type', `image/${extension}`);
    
    // Stream the file
    const stream = fs.createReadStream(filePath);
    return stream.pipe(res);

  } catch (error) {
    console.error('Image handling error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
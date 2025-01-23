import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { filePath } = req.body;

    if (!filePath) {
      return res.status(400).json({ message: 'File path is required' });
    }

    // Güvenlik kontrolü: filePath'in public/uploads dizini içinde olduğundan emin olun
    const absolutePath = path.join(process.env.FILE_UPLOAD_DIR || process.cwd(), filePath);
    const normalizedPath = path.normalize(absolutePath);
    
    if (!normalizedPath.startsWith(path.join(process.env.FILE_UPLOAD_DIR || process.cwd()))) {
      return res.status(403).json({ message: 'Invalid file path' });
    }

    // Dosya var mı kontrol et
    if (fs.existsSync(normalizedPath)) {
      // Dosyayı sil
      fs.unlinkSync(normalizedPath);
      return res.status(200).json({ message: 'File deleted successfully' });
    } else {
      return res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    return res.status(500).json({ message: 'Error deleting file' });
  }
}

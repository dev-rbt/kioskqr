import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const form = formidable({});
    const [fields, files] = await form.parse(req);
    const branchId = fields.branchId?.[0];

    if (!branchId) {
      return res.status(400).json({ message: 'Branch ID is required' });
    }

    // Create directories if they don't exist
    const publicDir = path.join(process.env.FILE_UPLOAD_DIR || process.cwd());
    const branchDir = path.join(publicDir, branchId);
    const bannersDir = path.join(branchDir, 'banners');

    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }
    if (!fs.existsSync(branchDir)) {
      fs.mkdirSync(branchDir);
    }
    if (!fs.existsSync(bannersDir)) {
      fs.mkdirSync(bannersDir);
    } else {
      // Banners klasörü varsa içini temizle
      const existingFiles = fs.readdirSync(bannersDir);
      existingFiles.forEach(file => {
        const filePath = path.join(bannersDir, file);
        fs.unlinkSync(filePath);
      });
    }

    let logoPath = '';
    const bannerPaths: string[] = [];

    // Logo dosyasını işle
    if (files.logo) {
      const file = files.logo[0];
      const ext = path.extname(file.originalFilename || '');
      const logoFilename = 'logo' + ext;
      const newPath = path.join(branchDir, logoFilename);
      await fs.promises.copyFile(file.filepath, newPath);
      logoPath = `/${branchId}/${logoFilename}`;
    }

    // Banner dosyalarını işle
    for (const [key, value] of Object.entries(files)) {
      if (key.startsWith('banner')) {
        const file = value[0];
        const ext = path.extname(file.originalFilename || '');
        const bannerFilename = `${uuidv4()}${ext}`;
        const newPath = path.join(bannersDir, bannerFilename);
        await fs.promises.copyFile(file.filepath, newPath);
        bannerPaths.push(`/${branchId}/banners/${bannerFilename}`);
      }
    }

    return res.status(200).json({
      logoPath,
      bannerPaths
    });

  } catch (error) {
    console.error('Error handling file upload:', error);
    return res.status(500).json({ message: 'Error uploading file' });
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const form = formidable({});
    const [fields, files] = await form.parse(req);

    const file = files.file?.[0];
    const productKey = fields.productKey?.[0];
    const langKey = fields.langKey?.[0];

    if (!file || !productKey || !langKey) {
      return res.status(400).json({ success: false, message: 'File, productKey and langKey are required' });
    }

    // Create directory structure
    const publicDir = path.join(process.env.FILE_UPLOAD_DIR || process.cwd());
    const productsDir = path.join(publicDir, 'products');
    const imageDir = path.join(productsDir, productKey);

    // Create directories if they don't exist
    [publicDir, productsDir, imageDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Remove old image with same language code if exists
    const existingFiles = fs.readdirSync(imageDir);
    existingFiles
      .filter(file => file.startsWith(`${langKey}_`))
      .forEach(file => {
        const filePath = path.join(imageDir, file);
        fs.unlinkSync(filePath);
      });

    // Generate unique filename
    const filename = `${langKey}_${uuidv4()}.webp`;
    const newPath = path.join(imageDir, filename);

    // Optimize and save image
    await sharp(file.filepath)
      .resize(800, 600, { 
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ 
        quality: 100,
        effort: 6
      })
      .toFile(newPath);

    // Return the relative path to be stored in database
    const relativePath = `/uploads/products/${productKey}/${filename}`;
    return res.status(200).json({ success: true, imagePath: relativePath });

  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({ success: false, message: 'Error uploading file' });
  }
}

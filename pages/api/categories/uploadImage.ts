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
    
    const templateKey = fields.templateKey?.[0];
    const menuGroupKey = fields.menuGroupKey?.[0];
    const menuGroupText = fields.menuGroupText?.[0];
    const langCode = fields.langCode?.[0];

    if (!templateKey || !menuGroupKey || !menuGroupText || !langCode) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    // Create directory structure
    const publicDir = path.join(process.cwd(), 'public');
    const categoryDir = path.join(publicDir, 'category');
    const imageDir = path.join(categoryDir, `${templateKey}_${menuGroupKey}_${menuGroupText}`);

    // Create directories if they don't exist
    [publicDir, categoryDir, imageDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    let imagePath = '';

    // Process the image file
    if (files.file) {
      const file = files.file[0];
      const ext = path.extname(file.originalFilename || '');
      const filename = `${langCode}_${uuidv4()}${ext}`;
      const newPath = path.join(imageDir, filename);

      // Remove old image with same language code if exists
      const existingFiles = fs.readdirSync(imageDir);
      existingFiles
        .filter(file => file.startsWith(`${langCode}_`))
        .forEach(file => {
          const filePath = path.join(imageDir, file);
          fs.unlinkSync(filePath);
        });

      // Copy new image
      await fs.promises.copyFile(file.filepath, newPath);
      imagePath = `/category/${templateKey}_${menuGroupKey}_${menuGroupText}/${filename}`;
    }

    return res.status(200).json({
      success: true,
      imagePath
    });

  } catch (error) {
    console.error('Error handling category image upload:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error uploading category image' 
    });
  }
}

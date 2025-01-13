import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

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

    if (!file || !productKey) {
      return res.status(400).json({ success: false, message: 'File and productKey are required' });
    }

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const extension = path.extname(file.originalFilename || '');
    const filename = `${productKey}-${Date.now()}${extension}`;
    const newPath = path.join(uploadsDir, filename);

    // Copy file to uploads directory
    const data = fs.readFileSync(file.filepath);
    fs.writeFileSync(newPath, data);
    fs.unlinkSync(file.filepath); // Clean up temp file

    // Return the relative path to be stored in database
    const relativePath = `/uploads/products/${filename}`;
    return res.status(200).json({ success: true, imagePath: relativePath });

  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({ success: false, message: 'Error uploading file' });
  }
}

import fs from 'fs';
import path from 'path';
import { File } from 'formidable';

export async function saveFile(file: File, templateKey: string, type: 'logo' | 'banner'): Promise<string> {
  const uploadDir = path.join(process.env.FILE_UPLOAD_DIR || process.cwd(), 'settings-template', templateKey);
  
  // Create directories if they don't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fileName = `${type}-${Date.now()}${path.extname(file.originalFilename || '')}`;
  const filePath = path.join(uploadDir, fileName);

  // Read the temporary file
  const data = fs.readFileSync(file.filepath);
  
  // Write to the target location
  fs.writeFileSync(filePath, data);
  
  // Delete the temporary file
  fs.unlinkSync(file.filepath);

  // Return relative path from public directory
  return `/uploads/settings-template/${templateKey}/${fileName}`;
}

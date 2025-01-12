"use client";

export const IMAGE_SIZES = {
  category: {
    width: 800,
    height: 450,
    aspectRatio: "16:9",
    maxSize: 500 * 1024, // 500KB
    formats: ["image/jpeg", "image/png", "image/webp"],
  },
  product: {
    width: 600,
    height: 600,
    aspectRatio: "1:1",
    maxSize: 300 * 1024, // 300KB
    formats: ["image/jpeg", "image/png", "image/webp"],
  },
  logo: {
    width: 400,
    height: 200,
    aspectRatio: "2:1",
    maxSize: 200 * 1024, // 200KB
    formats: ["image/png", "image/svg+xml"],
  },
  banner: {
    width: 1920,
    height: 600,
    aspectRatio: "3.2:1",
    maxSize: 800 * 1024, // 800KB
    formats: ["image/jpeg", "image/png", "image/webp"],
  }
};

export async function optimizeImage(
  file: File,
  type: keyof typeof IMAGE_SIZES
): Promise<{ optimizedFile: Blob; dataUrl: string }> {
  const config = IMAGE_SIZES[type];
  
  // Validate file type
  if (!config.formats.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed types: ${config.formats.join(", ")}`);
  }

  // Validate file size
  if (file.size > config.maxSize) {
    throw new Error(`File size too large. Maximum size: ${config.maxSize / 1024}KB`);
  }

  // Create canvas for resizing
  const img = new Image();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Load image
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });

  // Calculate dimensions while maintaining aspect ratio
  let { width, height } = calculateDimensions(
    img.width,
    img.height,
    config.width,
    config.height
  );

  // Set canvas size
  canvas.width = width;
  canvas.height = height;

  // Draw image
  ctx.drawImage(img, 0, 0, width, height);

  // Convert to blob
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob!),
      file.type,
      0.85 // quality
    );
  });

  // Generate data URL for preview
  const dataUrl = canvas.toDataURL(file.type);

  return { optimizedFile: blob, dataUrl };
}

function calculateDimensions(
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  return {
    width: Math.round(srcWidth * ratio),
    height: Math.round(srcHeight * ratio)
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
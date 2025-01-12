import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';

interface Language {
  Key: string;
  Code: string;
  Name: string;
  IsActive: boolean;
  DisplayOrderId: number;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Language[]>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    const languages = await query(
      `SELECT "Key", "Code", "Name", "IsActive", "DisplayOrderId", "CreatedAt", "UpdatedAt"
       FROM "Languages"
       WHERE "IsActive" = true
       ORDER BY "DisplayOrderId" ASC`
    );

    res.status(200).json(languages);
  } catch (error) {
    console.error('Error fetching active languages:', error);
    res.status(500).json([]);
  }
}

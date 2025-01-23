import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';
import { Category } from '@/types/category';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const category: Category = req.body;

    // 1. Get all active languages
    const languagesResult = await db.executeQuery<{Key: string; Code: string}>(
      'SELECT "Key", "Code" FROM "Languages" WHERE "IsActive" = true',
      [],
      false
    );

    // 2. Update translations for each language
    for (const language of languagesResult) {
      const translation = category.Translations[language.Key] || {};

      await db.executeQuery(
        `INSERT INTO "MenuGroupsTranslations" (
          "MenuGroupKey",
          "LanguageKey",
          "Name",
          "Description",
          "ImageUrl",
          "DisplayIndex",
          "IsActive",
          "UpdatedAt"
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          CURRENT_TIMESTAMP
        )
        ON CONFLICT ("MenuGroupKey", "LanguageKey")
        DO UPDATE SET
          "Name" = EXCLUDED."Name",
          "Description" = EXCLUDED."Description",
          "ImageUrl" = EXCLUDED."ImageUrl",
          "DisplayIndex" = EXCLUDED."DisplayIndex",
          "IsActive" = EXCLUDED."IsActive",
          "UpdatedAt" = CURRENT_TIMESTAMP`,
        [
          category.MenuGroupKey,
          language.Key,
          translation.Name || '',
          translation.Description || '',
          translation.ImageUrl || '',
          translation.DisplayIndex || 0,
          translation.IsActive === undefined ? true : translation.IsActive
        ],
        true
      );
    }

    res.status(200).json({ 
      success: true,
      message: 'Category translations updated successfully'
    });

  } catch (error) {
    console.error('Error updating category translations:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error updating category translations',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

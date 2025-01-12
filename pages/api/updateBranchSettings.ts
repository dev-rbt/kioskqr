import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

interface Language {
  LanguageKey: string;
  IsActive: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      branchId,
      defaultLanguageKey,
      activeLanguages,
      themeColors,
      logoUrl,
      banners
    } = req.body;

    if (!branchId) {
      return res.status(400).json({ error: 'Branch ID is required' });
    }

    // Update branch settings
    await db.executeQuery(
      `INSERT INTO "BranchesSettings" (
        "BranchID",
        "MainColor",
        "SecondColor",
        "AccentColor",
        "DefaultLanguageKey",
        "LogoUrl"
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT ("BranchID")
      DO UPDATE SET
        "MainColor" = EXCLUDED."MainColor",
        "SecondColor" = EXCLUDED."SecondColor",
        "AccentColor" = EXCLUDED."AccentColor",
        "DefaultLanguageKey" = EXCLUDED."DefaultLanguageKey",
        "LogoUrl" = EXCLUDED."LogoUrl",
        "UpdatedAt" = CURRENT_TIMESTAMP`,
      [
        branchId,
        themeColors.primary,
        themeColors.secondary,
        themeColors.accent,
        defaultLanguageKey,
        logoUrl
      ],
      true
    );

    // Update languages
    for (const language of activeLanguages) {
      await db.executeQuery(
        `INSERT INTO "BranchLanguages" (
          "BranchID",
          "LanguageKey",
          "IsActive"
        )
        VALUES ($1, $2, $3)
        ON CONFLICT ("BranchID", "LanguageKey")
        DO UPDATE SET
          "IsActive" = EXCLUDED."IsActive",
          "UpdatedAt" = CURRENT_TIMESTAMP`,
        [branchId, language.LanguageKey, language.IsActive],
        true
      );
    }

    // Delete existing banners
    await db.executeQuery(
      `DELETE FROM "BranchesBanners"
      WHERE "BranchID" = $1`,
      [branchId],
      true
    );

    // Insert new banners
    for (let i = 0; i < banners.length; i++) {
      await db.executeQuery(
        `INSERT INTO "BranchesBanners" (
          "BranchID",
          "BannerUrl",
          "DisplayOrder",
          "IsActive"
        )
        VALUES ($1, $2, $3, true)`,
        [branchId, banners[i].BannerUrl, i + 1],
        true
      );
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating branch settings:', error);
    return res.status(500).json({ error: 'Failed to update branch settings' });
  }
}

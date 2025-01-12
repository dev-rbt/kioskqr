import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';

interface Category {
  MenuGroupKey: string;
  TemplateKey: string;
  MenuGroupText: string;
  DisplayIndex: number;
  IsActive: boolean;
  ProductCount: number;
  Translations: {
    [key: string]: {
      Name: string;
      Description: string | null;
      ImageUrl: string | null;
      DisplayIndex: number;
      IsActive: boolean;
    };
  };
}

interface Language {
  Key: string;
  Code: string;
}

interface Translation {
  MenuGroupKey: string;
  LanguageKey: string;
  Name: string | null;
  Description: string | null;
  ImageUrl: string | null;
  DisplayIndex: number;
  IsActive: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // 1. Get base categories with product count
    const categories = await query(
      `SELECT 
        mg."MenuGroupKey",
        mg."TemplateKey",
        mg."MenuGroupText",
        COALESCE(mg."DisplayIndex", 0) as "DisplayIndex",
        COALESCE(mg."MenuGroupActive", true) as "IsActive",
        COALESCE(COUNT(CASE WHEN mil."MenuItemKey" IS NOT NULL THEN 1 END), 0) as "ProductCount"
      FROM "MenuGroups" mg
      LEFT JOIN "MenuItemLayout" mil ON mil."MenuGroupKey" = mg."MenuGroupKey"
      GROUP BY mg."MenuGroupKey", mg."TemplateKey", mg."MenuGroupText", mg."DisplayIndex", mg."MenuGroupActive"
      ORDER BY "DisplayIndex" ASC, "MenuGroupText"`
    );

    console.log('Categories with product count:', categories?.map(cat => ({
      MenuGroupKey: cat.MenuGroupKey,
      ProductCount: cat.ProductCount,
      rawProductCount: cat.ProductCount,
      typeofProductCount: typeof cat.ProductCount
    })));

    if (!categories?.length) {
      return res.status(200).json([]);
    }

    // 2. Get all languages
    const languages = await query(
      `SELECT "Key", "Code"
       FROM "Languages"
       WHERE "IsActive" = true`
    );

    console.log('Languages Result:', languages?.length, languages);

    if (!languages?.length) {
      return res.status(200).json([]);
    }

    // 3. Get all translations
    const translations = await query(
      `SELECT 
        mgt."MenuGroupKey",
        mgt."LanguageKey",
        mgt."Name",
        mgt."Description",
        mgt."ImageUrl",
        COALESCE(mgt."DisplayIndex", mg."DisplayIndex", 0) as "DisplayIndex",
        CASE 
          WHEN mgt."IsActive" IS NOT NULL THEN mgt."IsActive"
          WHEN mg."MenuGroupActive" IS NOT NULL THEN mg."MenuGroupActive"
          ELSE true
        END as "IsActive"
      FROM "MenuGroupsTranslations" mgt
      LEFT JOIN "MenuGroups" mg ON mg."MenuGroupKey" = mgt."MenuGroupKey"`
    );

    console.log('Translations Result:', translations?.length, translations);

    // Create a map of language keys to codes
    const languageMap = (languages || []).reduce<{ [key: string]: string }>((acc, lang) => {
      if (lang?.Key && lang?.Code) {
        acc[lang.Key] = lang.Code;
      }
      return acc;
    }, {});

    // Group translations by MenuGroupKey
    const translationsByGroup = (translations || []).reduce<{ [key: string]: Category['Translations'] }>((acc, trans) => {
      if (!trans?.MenuGroupKey) return acc;

      if (!acc[trans.MenuGroupKey]) {
        acc[trans.MenuGroupKey] = {};
      }

      const langCode = trans.LanguageKey ? languageMap[trans.LanguageKey] : null;
      if (langCode) {
        acc[trans.MenuGroupKey][langCode] = {
          Name: trans.Name || '',
          Description: trans.Description,
          ImageUrl: trans.ImageUrl,
          DisplayIndex: typeof trans.DisplayIndex === 'number' ? trans.DisplayIndex : 0,
          IsActive: typeof trans.IsActive === 'boolean' ? trans.IsActive : true
        };
      }

      return acc;
    }, {});

    // Combine all data
    const result = categories.map(category => ({
      MenuGroupKey: category.MenuGroupKey || '',
      TemplateKey: category.TemplateKey || '',
      MenuGroupText: category.MenuGroupText || '',
      DisplayIndex: typeof category.DisplayIndex === 'number' ? category.DisplayIndex : 0,
      IsActive: typeof category.IsActive === 'boolean' ? category.IsActive : true,
      ProductCount: parseInt(category.ProductCount) || 0,
      Translations: translationsByGroup[category.MenuGroupKey] || {}
    }));

    return res.status(200).json(result);

  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ 
      message: 'Error fetching categories',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

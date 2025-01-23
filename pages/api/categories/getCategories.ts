import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';
import { Category, Language, Translation } from '@/types/category';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // 1. Get base categories
    const categories = await query<Partial<Category>>(
      `SELECT 
        mg."MenuGroupKey",
        mg."TemplateKey",
        mg."MenuGroupText",
        COALESCE(mg."DisplayIndex", 0) as "DisplayIndex",
        COALESCE(mg."MenuGroupActive", true) as "IsActive"
      FROM "MenuGroups" mg
      ORDER BY "DisplayIndex" ASC, "MenuGroupText"`
    );

    if (!categories?.length) {
      return res.status(200).json([]);
    }

    // 2. Get product counts for all categories
    const productCounts = await query<{ MenuGroupKey: string; ProductCount: number }>(
      `SELECT "MenuGroupKey", COUNT("MenuItemKey") as "ProductCount" 
       FROM "MenuItemLayout" 
       GROUP BY "MenuGroupKey"`
    );

    console.log("Raw Product Counts:", productCounts);

    // Create a map of product counts
    const productCountMap = (productCounts || []).reduce<{ [key: string]: number }>((acc, item) => {
      if (item?.MenuGroupKey) {
        acc[item.MenuGroupKey] = Number(item.ProductCount) || 0;
      }
      return acc;
    }, {});

    console.log("Final Product Count Map:", productCountMap);

    console.log("Product Count Map:", productCountMap);
    // 3. Get all languages
    const languages = await query<Language>(
      `SELECT "Key", "Code"
       FROM "Languages"
       WHERE "IsActive" = true`
    );

    if (!languages?.length) {
      return res.status(200).json([]);
    }

    // 4. Get all translations
    const translations = await query<Translation>(
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

      if (trans.LanguageKey) {
        acc[trans.MenuGroupKey][trans.LanguageKey] = {
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
      ProductCount: productCountMap[category.MenuGroupKey || ''] || 0,
      Translations: translationsByGroup[category.MenuGroupKey || ''] || {}
    })) as Category[];

    return res.status(200).json(result);

  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({
      message: 'Error fetching categories',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

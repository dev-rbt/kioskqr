import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        try {
            const combosWithDetails = await db.executeQuery(`
                WITH ComboData AS (
                    SELECT 
                        ch."ComboKey",
                        ch."ComboName",
                        json_agg(
                            DISTINCT jsonb_build_object(
                                'ComboKey', cht."ComboKey",
                                'LanguageKey', cht."LanguageKey",
                                'Name', cht."Name",
                                'Description', cht."Description",
                                'ImageUrl', cht."ImageUrl"
                            )
                        ) FILTER (WHERE cht."ComboKey" IS NOT NULL) as translations,
                        (
                            SELECT json_agg(groups)
                            FROM (
                                SELECT jsonb_build_object(
                                    'groupName', cg."GroupName",
                                    'maxQuantity', cg."MaxQuantity",
                                    'forcedQuantity', cg."ForcedQuantity",
                                    'IsForcedGroup', cg."IsForcedGroup",
                                    'groupOrderId', cg."GroupOrderID",
                                    'items', (
                                        SELECT json_agg(items ORDER BY items->>'screenOrderId')
                                        FROM (
                                            SELECT jsonb_build_object(
                                                'productKey', cd."ProductKey",
                                                'defaultQuantity', cd."DefaultQuantity",
                                                'extraPriceTakeOut_TL', cd."ExtraPriceTakeOut_TL",
                                                'isDefault', cd."IsDefault",
                                                'screenOrderId', cd."ScreenOrderID",
                                                'product', jsonb_build_object(
                                                    'ProductKey', p."ProductKey",
                                                    'ProductName', p."ProductName",
                                                    'ImageUrl', p."ImageUrl",
                                                    'translations', (
                                                        SELECT json_agg(
                                                            jsonb_build_object(
                                                                'languageKey', pt."LanguageKey",
                                                                'name', pt."Name",
                                                                'description', pt."Description",
                                                                'imageUrl', pt."ImageUrl"
                                                            )
                                                        )
                                                        FROM "ProductsTranslations" pt
                                                        WHERE pt."ProductKey" = p."ProductKey"
                                                    )
                                                )
                                            ) as items
                                            FROM "ComboDetails" cd
                                            JOIN "Products" p ON p."ProductKey" = cd."ProductKey"
                                            WHERE cd."ComboKey" = ch."ComboKey"
                                            AND cd."GroupName" = cg."GroupName"
                                            AND cd."BranchID" = 0
                                        ) subq
                                    )
                                ) as groups
                                FROM "ComboGroups" cg
                                WHERE cg."ComboKey" = ch."ComboKey"
                                AND cg."BranchID" = 0
                                ORDER BY cg."GroupOrderID"
                            ) ordered_groups
                        ) as comboGroups
                    FROM "ComboHeaders" ch
                    LEFT JOIN "ComboTranslations" cht ON cht."ComboKey" = ch."ComboKey"
                    WHERE ch."BranchID" = 0
                    GROUP BY ch."ComboKey", ch."ComboName"
                    ORDER BY ch."ComboName"
                )
                SELECT 
                    "ComboKey",
                    "ComboName",
                    COALESCE(translations, '[]'::json) as "translations",
                    COALESCE(comboGroups, '[]'::json) as "comboGroups"
                FROM ComboData;
            `);

            res.status(200).json(combosWithDetails);
        } catch (error) {
            console.error('Error fetching combo menus:', error);
            res.status(500).json({ error: 'Failed to fetch combo menus' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

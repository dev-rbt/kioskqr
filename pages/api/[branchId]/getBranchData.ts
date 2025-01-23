import db from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        try {
            const { branchId } = req.query;
            if (!branchId || typeof branchId !== 'string') {
                return res.status(400).json({ error: 'Branch ID is required' });
            }
            const data = await db.executeQuery(`
                SELECT 
                    b."BranchID", 
                    b."BranchName", 
                    st."DefaultLanguageKey", 
                    st."LogoUrl", 
                    st."MainColor",
                    st."SecondColor",
                    st."AccentColor",
                    bs."TemplateKey" as "SettingsTemplateKey",
                    (
                        SELECT json_agg(pm.*)
                        FROM "PaymentMethods" pm 
                    ) as "PaymentMethods",
                    (
                        SELECT json_agg(l.*)
                        FROM "Languages" l 
                        WHERE l."Key" IN (
                            SELECT stl."LanguageKey" 
                            FROM "SettingsTemplateLanguages" stl
                            WHERE stl."TemplateKey" = bs."TemplateKey" 
                            AND stl."IsActive" = true
                        )
                        AND l."IsActive" = true
                    ) as "Languages",
                    (
                        SELECT json_agg(
                            json_build_object(
                                'BannerID', stb."BannerID",
                                'BannerUrl', stb."BannerUrl"
                            )
                            ORDER BY stb."DisplayOrder" ASC
                        )
                        FROM "SettingsTemplateBanners" stb 
                        WHERE stb."TemplateKey" = bs."TemplateKey" 
                        AND stb."IsActive" = true
                    ) as "Banners",
                    (
                        SELECT json_agg(
                            json_build_object(
                                'CategoryID', mg."MenuGroupKey",
                                'OriginalName', mg."MenuGroupText",
                                'Translations', (
                                    SELECT json_object_agg(
                                        mgt."LanguageKey",
                                        json_build_object(
                                            'Name', mgt."Name",
                                            'Description', mgt."Description",
                                            'ImageUrl', mgt."ImageUrl"
                                        )
                                    ) FROM "MenuGroupsTranslations" mgt
                                    WHERE mgt."MenuGroupKey" = mg."MenuGroupKey"
                                    AND mgt."IsActive" = true
                                ),
                                'Products', (
                                    SELECT json_agg(
                                        json_build_object(
                                            'ProductID', mil."MenuItemKey",
                                            'OriginalName', milp."ProductName",
                                            'Translations', (
                                                SELECT json_object_agg(
                                                    pt."LanguageKey",
                                                    json_build_object(
                                                        'Name', pt."Name",
                                                        'Description', pt."Description",
                                                        'ImageUrl', pt."ImageUrl"
                                                    )
                                                ) FROM "ProductsTranslations" pt
                                                WHERE mil."MenuItemKey" = pt."ProductKey"
                                            ),
                                            'TakeOutPrice', milmip."TakeOutPrice_TL",
                                            'DeliveryPrice', milmip."DeliveryPrice_TL",
                                            'Weight', milpe."Weight",
                                            'Rating', milpe."Rating",
                                            'Calories', milpe."Calories",
                                            'PreperationTime', milpe."PreparationTime",
                                            'IsCombo', CASE WHEN mil."ComboKey" IS NOT NULL THEN true ELSE false END,
                                            'Combo', (
                                                SELECT json_agg(
                                                    json_build_object(
                                                            'ForcedQuantity', cg."ForcedQuantity",
                                                            'MaxQuantity', cg."MaxQuantity",
                                                            'IsForcedGroup', cg."IsForcedGroup",
                                                            'OriginalName', cg."GroupName",
                                                            'ComboKey', cg."ComboKey",
                                                            'Translations', (
                                                                SELECT json_object_agg(
                                                                    cgt."LanguageKey",
                                                                    json_build_object(
                                                                        'Name', cgt."Name",
                                                                        'GroupName', cgt."GroupName",
                                                                        'Description', cgt."Description",
                                                                        'ImageUrl', cgt."ImageUrl"
                                                                    )
                                                                ) FROM "ComboTranslations" cgt
                                                                WHERE cgt."ComboKey" = cg."ComboKey"
                                                            
                                                            ),
                                                            'Items', (
                                                                SELECT json_agg(
                                                                    json_build_object(
                                                                        'OriginalName', cgcdp."ProductName",
                                                                        'ExtraPriceTakeOut', cgcd."ExtraPriceTakeOut_TL",
                                                                        'ExtraPriceDelivery', cgcd."ExtraPriceDelivery_TL",
                                                                        'IsDefault', cgcd."IsDefault",
                                                                        'DefaultQuantity', cgcd."DefaultQuantity",
                                                                        'MenuItemKey', cgcdp."ProductKey",
                                                                        'Translations', (
                                                                            SELECT json_object_agg(
                                                                                cgcdppt."LanguageKey",
                                                                                json_build_object(
                                                                                    'Name', cgcdppt."Name",
                                                                                    'Description', cgcdppt."Description",
                                                                                    'ImageUrl', cgcdppt."ImageUrl"
                                                                                )
                                                                            ) FROM "ProductsTranslations" cgcdppt
                                                                            WHERE cgcdp."ProductKey" = cgcdppt."ProductKey"
                                                                        
                                                                        )
                                                                    ) ORDER BY cgcd."ScreenOrderID" ASC 
                                                                ) FROM "ComboDetails" cgcd 
                                                                LEFT JOIN "Products" cgcdp ON cgcd."ProductKey" = cgcdp."ProductKey"
                                                                WHERE cgcd."ComboKey" = cg."ComboKey" AND (cgcd."BranchID" = 0 or cgcd."BranchID" = $1)  AND cgcd."GroupName" = cg."GroupName"
                                                            )
                                                    ) ORDER BY cg."GroupOrderID" ASC
                                                ) FROM "ComboGroups" cg WHERE (cg."BranchID" = 0 or cg."BranchID" = $1) AND cg."ComboKey" = mil."ComboKey"
                                            )
                                        )
                                        ORDER BY mil."DisplayIndex" ASC
                                    ) FROM "MenuItemLayout" mil
                                    LEFT JOIN "Products" milp ON milp."ProductKey" = mil."MenuItemKey"
                                    LEFT JOIN "ProductsExtends" milpe ON milpe."ProductKey" = milp."ProductKey" 
                                    AND milpe."CategoryID" = milp."CategoryID" AND milpe."GroupID" = milp."GroupID" AND milpe."ProductCode" = milp."ProductCode"
                                    LEFT JOIN "MenuItemPrices" milmip ON milmip."MenuItemKey" = mil."MenuItemKey" AND milmip."PriceTemplateKey" = b."PriceTemplateKey"
                                    WHERE mil."MenuGroupKey" = mg."MenuGroupKey" AND mil."TemplateKey" = mg."TemplateKey"
                                )
                            )
                            ORDER BY mg."DisplayIndex" ASC
                        )
                        FROM "MenuGroups" mg
                        WHERE mg."TemplateKey" = b."KioskMenuTemplateKey"
                        AND mg."MenuGroupActive" = true
                    ) as "Categories"
                FROM "Branches" b
                LEFT JOIN "BranchSettingsTemplates" bs ON b."BranchID" = bs."BranchID"
                LEFT JOIN "SettingsTemplates" st ON st."TemplateKey" = bs."TemplateKey"
                WHERE b."BranchID" = $1`, [branchId])
            res.status(200).json(data);
        } catch (error) {
            console.error('Error fetching menu:', error);
            res.status(500).json({ error: 'Failed to fetch menu' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

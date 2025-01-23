import { NextApiRequest, NextApiResponse } from 'next';
import { dataset } from '@/lib/realtimeapi';
import db from '@/lib/db';

interface Branch {
    BranchID?: number;
    BranchName?: string;
    KioskMenuTemplateKey?: number;
    PriceTemplateKey?: number;
    IsActive?: boolean;
}

interface MenuTemplate {
    TemplateKey?: string; // UUID
    TemplateName?: string;
    TemplateMode?: number;
    IsActive?: boolean;
}

interface MenuItemLayout {
    TemplateKey?: string; // UUID
    MenuGroupKey?: string; // UUID
    MainMenuItemKey?: string; // UUID
    MenuItemKey?: string; // UUID
    ComboKey?: string; // UUID
    IsTopMenu?: boolean;
    DisplayIndex?: number;
}

interface Products {
    ProductKey?: number;
    ProductCode?: string;
    ExternalCode?: string;
    ProductName?: string;
    CategoryName?: string;
    IsSaleProduct?: boolean;
    GroupName?: string;
    TaxPercent?: number;
    Barcode?: string;
    Barcode2?: string;
    Barcode3?: string;
    Barcode4?: string;
    Barcode5?: string;
    Barcode6?: string;
    Barcode7?: string;
    Barcode8?: string;
    Barcode9?: string;
    Barcode10?: string;
    CategoryID?: string;
    GroupID?: string;
    OrderByWeight?: number;
    ComboKey?: string;
    IsCombo?: boolean;
}

interface PriceTemplates {
    PriceTemplateKey?: string; // UUID
    PriceTemplateName?: string;
}

interface MenuGroups {
    TemplateKey?: string; // UUID
    MenuGroupKey?: string; // UUID
    MenuGroupText?: string;
    DisplayIndex?: number;
    MenuGroupActive?: boolean;
}

interface ComboHeaders {
    ComboKey?: string;
    ComboName?: string;
    BranchID?: number;
}

interface ComboGroups {
    ComboKey?: string;
    BranchID?: number;
    GroupName?: string;
    SubGroupName?: string;
    GroupOrderID?: number;
    ForcedQuantity?: number;
    MaxQuantity?: number;
    IsForcedGroup?: boolean;
}

interface ComboDetails {
    ComboKey?: string;
    BranchID?: number;
    GroupName?: string;
    SubGroupName?: string;
    Quantity?: number;
    ProductKey?: number;
    DefaultQuantity?: number;
    ExtraPriceTakeOut_TL?: number;
    ExtraPriceTakeOut_USD?: number;
    ExtraPriceTakeOut_EUR?: number;
    ExtraPriceTakeOut_GBP?: number;
    ExtraPriceDelivery_TL?: number;
    ExtraPriceDelivery_USD?: number;
    ExtraPriceDelivery_EUR?: number;
    ExtraPriceDelivery_GBP?: number;
    IsDefault?: boolean;
    ScreenOrderID?: number;
}

interface PaymentMethods {
    PaymentMethodKey?: string;
    PaymentMethodID?: string;
    PaymentName?: string;
    Type?: string;
    Name?: string;
}

interface MenuItemPrices {
    PriceTemplateKey?: string;
    MenuItemKey?: string;
    TakeOutPrice_TL?: number;
    TakeOutPrice_USD?: number;
    TakeOutPrice_EUR?: number;
    TakeOutPrice_GBP?: number;
    DeliveryPrice_TL?: number;
    DeliveryPrice_USD?: number;
    DeliveryPrice_EUR?: number;
    DeliveryPrice_GBP?: number;
}

async function syncData<T extends Record<string, any>>({
    query,
    targetTable,
    transformData
}: {
    query: string;
    targetTable?: string;
    transformData?: (rows: any[]) => Promise<any[]>
}): Promise<T[]> {
    let data = await dataset.executeQuery<T[]>({ query });
    if (transformData) {
        data = await transformData(data);
    }
    if (targetTable) {
        await db.bulkInsert(targetTable, data);
    }
    return data;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        try {
            // 1. Sync price templates first
            const priceTemplatesData = await syncData<PriceTemplates>({
                query: `
                        SELECT
                            pt.PriceTemplateKey,
                            pt.PriceTemplateName
                        FROM
                            NewGlobalPriceTemplates pt WITH (NOLOCK) 
                        WHERE
                            1 = 1 
                            AND ISNULL(pt.IsPassive, 0) = 0
                    `,
                targetTable: 'PriceTemplates'
            });

            // 2. Sync menu templates
            const menuTemplatesData = await syncData<MenuTemplate>({
                query: `
                        SELECT
                            mt.TemplateKey,
                            mt.TemplateName,
                            mt.TemplateMode
                        FROM
                            NewGlobalMenuTemplates mt
                        WHERE
                            1=1
                            AND ISNULL(mt.IsPassive, 0) = 0
                            AND mt.TemplateMode = 2
                    `,
                targetTable: 'MenuTemplates'
            });

            // 3. Sync menu groups
            const menuGroupsData = await syncData<MenuGroups>({
                query: `SELECT
                            mg.TemplateKey,
                            mg.MenuGroupKey,
                            mg.MenuGroupText,
                            mg.DisplayIndex,
                            CAST(ISNULL(mg.MenuGroupActive, 1) AS BIT) AS MenuGroupActive
                            FROM
                            NewGlobalMenuGroups mg WITH (NOLOCK)
                            INNER JOIN NewGlobalMenuTemplates mt WITH (NOLOCK) ON mt.TemplateKey = mg.TemplateKey AND mt.TemplateMode = 2
                            ORDER BY
                            mg.TemplateKey ASC,
                            mg.DisplayIndex ASC`,
                targetTable: 'MenuGroups'
            });

            // 4. Sync products
            const productsData = await syncData<Products>({
                query: `SELECT 
                            p.ProductKey AS [ProductKey],
                            p.ProductCode AS [ProductCode],
                            p.IsSaleProduct AS [IsSaleProduct],
                            p.ExternalCode AS [ExternalCode],
                            ISNULL(p.ECommerceProductName1, p.ProductName) AS [ProductName],
                            plc.PickValue AS [CategoryName],
                            plg.PickValue AS [GroupName],									  
                            ISNULL(tg.TaxRate, 8) AS [TaxPercent],
                            p.Barcode,
                            p.Barcode2,
                            p.Barcode3,
                            p.Barcode4,
                            p.Barcode5,
                            p.Barcode6,
                            p.Barcode7,
                            p.Barcode8,
                            p.Barcode9,
                            p.Barcode10,
                            p.GroupID,
                            p.CategoryID,
                            ISNULL(nm.OrderByWeight,0) AS [OrderByWeight],
                            nm.ComboKey AS [ComboKey],
                            CAST(IIF(nm.ComboKey IS NULL, 0, 1) AS BIT) AS [IsCombo]
                            FROM
                                posProducts p
                            LEFT JOIN NewGlobalMenuItems nm ON p.ProductKey = nm.MenuItemKey
                            LEFT JOIN TaxGroups tg ON nm.TaxGroupID = tg.TaxGroupID
                            LEFT JOIN posPickList plg ON plg.ListID = p.GroupID
                            LEFT JOIN posPickList plc ON plc.ListID = p.CategoryID
                            WHERE
                            1=1
                            AND ISNULL(p.IsActive, 0) = 1
                            --AND ISNULL(p.IsSaleProduct,0) = 1`,
                targetTable: 'Products'
            });

            // 5. Sync menu item prices
            const menuItemPricesData = await syncData<MenuItemPrices>({
                query: `
                    SELECT
                        mp.PriceTemplateKey,
                        mp.MenuItemKey,
                        ISNULL(NULLIF(mp.TakeOutPrice, 0), mp.DefaultUnitPrice) AS [TakeOutPrice_TL],
                        ISNULL(NULLIF(mp.TakeOutPrice_USD, 0), mp.DefaultUnitPrice_USD) AS [TakeOutPrice_USD],
                        ISNULL(NULLIF(mp.TakeOutPrice_EUR, 0), mp.DefaultUnitPrice_EUR) AS [TakeOutPrice_EUR],
                        ISNULL(NULLIF(mp.TakeOutPrice_GBP, 0), mp.DefaultUnitPrice_GBP) AS [TakeOutPrice_GBP],
                        ISNULL(NULLIF(mp.DeliveryPrice, 0), mp.DefaultUnitPrice) AS [DeliveryPrice_TL],
                        ISNULL(NULLIF(mp.DeliveryPrice_USD, 0), mp.DefaultUnitPrice_USD) AS [DeliveryPrice_USD],
                        ISNULL(NULLIF(mp.DeliveryPrice_EUR, 0), mp.DefaultUnitPrice_EUR) AS [DeliveryPrice_EUR],
                        ISNULL(NULLIF(mp.DeliveryPrice_GBP, 0), mp.DefaultUnitPrice_GBP) AS [DeliveryPrice_GBP]
                    FROM
                        NewGlobalMenuItemPrices mp WITH (NOLOCK)
                    INNER JOIN NewGlobalPriceTemplates t WITH (NOLOCK) ON t.PriceTemplateKey = mp.PriceTemplateKey AND ISNULL(t.IsPassive, 0) = 0
                    INNER JOIN posProducts p WITH (NOLOCK) ON p.ProductKey = mp.MenuItemKey AND p.IsActive = 1
                `,
                targetTable: 'MenuItemPrices'
            });

            // 6. Sync menu item layout
            const menuLayoutData = await syncData<MenuItemLayout>({
                query: `
                        SELECT
                            ml.TemplateKey,
                            ml.MenuGroupKey,
                            ml.MainMenuItemKey,
                            ml.MenuItemKey,
                            ml.IsTopMenu,
                            m.ComboKey,
                            ml.DisplayIndex
                        FROM
                            NewGlobalMenuItemLayout ml
                        INNER JOIN NewGlobalMenuTemplates mt WITH (NOLOCK) ON mt.TemplateKey = ml.TemplateKey AND mt.TemplateMode = 2
                        INNER JOIN NewGlobalMenuItems m WITH (NOLOCK) ON m.MenuItemKey = ml.MenuItemKey
                        INNER JOIN posProducts p WITH (NOLOCK) ON p.ProductKey = m.MenuItemKey AND ISNULL(p.IsActive, 0) = 1
                        ORDER BY
                            ml.TemplateKey ASC,
                            ml.MenuGroupKey ASC,
                            ml.DisplayIndex ASC
                    `,
                targetTable: 'MenuItemLayout'
            });

            // 7. Sync branches
            const branchData = await syncData<Branch>({
                query: `
                        SELECT
                            br.BranchID,
                            br.BranchName,
                            ISNULL(br.KioskMenuTemplateKey, 'BFEFD58F-1731-4A7A-8404-B4BC36F00D6E') AS KioskMenuTemplateKey,
                            br.PriceTemplateKey,
                            br.IsActive
                        FROM
                            posBranchs br WITH (NOLOCK)
                        WHERE br.IsActive = 1
                    `,
                targetTable: 'Branches'
            });

            // 8. Sync payment methods
            const paymentMethodData = await syncData<PaymentMethods>({
                query: `
                    SELECT
                        n.[PaymentMethodKey],
                        n.[PaymentMethodID],
                        n.[PaymentName],
                        n.[Type],
                        n.[Name]
                    FROM
                    (
                        SELECT
                            k.[PaymentMethodKey],
                            k.[PaymentMethodID],
                            k.[Name] AS [PaymentName],
                            k.[Type],
                            (
                            CASE k.[Type]
                                WHEN 'CREDIT_CARD' THEN k.[Type]
                                WHEN 'MEAL_CARD' THEN k.[Name]
                            ELSE
                                'UNKNOWN'
                            END
                            ) AS [Name]
                        FROM
                        (
                            SELECT TOP 1000
                                p.PaymentMethodKey AS [PaymentMethodKey],
                                p.PaymentMethodID AS [PaymentMethodID],
                                p.PaymentName AS [Name],
                                (
                                CASE 
                                    WHEN p.PaymentName = 'KREDİ KARTI' THEN 'CREDIT_CARD'
                                    WHEN p.PaymentName IN(
                                    'MULTINET',
                                    'TICKET',
                                    'SODEXO',
                                    'METROPOLCARD',
                                    'PAYEKART',
                                    'SETCARD',
                                    'TOKENFLEX',
                                    'GASTROPAY'
                                    ) THEN 'MEAL_CARD'
                                ELSE 'UNKNOWN'
                                END) AS [Type]
                            FROM
                                NewGlobalPaymentMethodPool p WITH (NOLOCK)
                            WHERE
                                p.PaymentMethodActive = 1
                            ORDER BY
                                p.PaymentName ASC
                        ) AS k
                    ) AS n
                    WHERE
                        1=1
                        AND n.Type <> 'UNKNOWN'
                        AND n.Name <> 'UNKNOWN'
                `,
                targetTable: 'PaymentMethods'
            });

            // 9. Sync Combo Menus
            const comboData = await syncData({
                query: `
                    SELECT
                        d.ComboKey,
                        cm.ComboName,
                        ISNULL(d.BranchID, 0) AS BranchID,
                    
                        ISNULL(d.GroupName, '') AS GroupName,
                        ISNULL(d.SubGroupName, '') AS SubGroupName,
                        d.GroupOrderID,
                        ISNULL(d.ForcedQuantity, 0) AS ForcedQuantity,
                        ISNULL(d.MaxQuantity, 0) AS MaxQuantity,
                        d.IsForcedGroup,
                    
                        d.MenuItemKey AS ProductKey,
                        ISNULL(d.DefaultQuantity, 0) AS DefaultQuantity,
                        ISNULL(NULLIF(d.ExtraPriceTakeOut, 0), d.ExtraPrice) AS [ExtraPriceTakeOut_TL],
                        ISNULL(NULLIF(d.ExtraPriceTakeOut_USD, 0), d.ExtraPriceDefault_USD) AS [ExtraPriceTakeOut_USD],
                        ISNULL(NULLIF(d.ExtraPriceTakeOut_EUR, 0), d.ExtraPriceDefault_EUR) AS [ExtraPriceTakeOut_EUR],
                        ISNULL(NULLIF(d.ExtraPriceTakeOut_GBP, 0), d.ExtraPriceDefault_GBP) AS [ExtraPriceTakeOut_GBP],
                        ISNULL(NULLIF(d.ExtraPriceDelivery, 0), d.ExtraPrice) AS [ExtraPriceDelivery_TL],
                        ISNULL(NULLIF(d.ExtraPriceDelivery_USD, 0), d.ExtraPriceDefault_USD) AS [ExtraPriceDelivery_USD],
                        ISNULL(NULLIF(d.ExtraPriceDelivery_EUR, 0), d.ExtraPriceDefault_EUR) AS [ExtraPriceDelivery_EUR],
                        ISNULL(NULLIF(d.ExtraPriceDelivery_GBP, 0), d.ExtraPriceDefault_GBP) AS [ExtraPriceDelivery_GBP],
                        d.IsDefault,
                        d.ScreenOrderID
                    FROM
                        NewGlobalComboMenuDetails AS d WITH (NOLOCK)
                        INNER JOIN NewGlobalComboMenus AS cm WITH (NOLOCK) ON cm.ComboKey = d.ComboKey
                        INNER JOIN posProducts p WITH (NOLOCK) ON p.ProductKey = d.MenuItemKey AND ISNULL(p.IsActive, 0) = 1
                        INNER JOIN (
                        SELECT
                            m.ComboKey
                        FROM
                            NewGlobalMenuItems m WITH (NOLOCK)
                        WHERE
                            m.ComboKey IS NOT NULL
                        GROUP BY
                            m.ComboKey
                        ) AS m  ON m.ComboKey = d.ComboKey
                        LEFT JOIN posBranchs br WITH (NOLOCK) ON br.BranchID = ISNULL(d.BranchID, 0)
                    WHERE
                        1=1
                        AND (ISNULL(d.BranchID, 0) = 0 OR br.IsActive = 1)
                    ORDER BY
                        d.ComboKey,
                        cm.ComboName,
                        ISNULL(d.BranchID, 0),
                        d.GroupOrderID,
                        d.ScreenOrderID
                    `,
                transformData: async (rows: any[]) => {
                    // Transform data for each table
                    const headers = new Map<string, ComboHeaders>();
                    const groups = new Map<string, ComboGroups>();
                    const details = new Array<ComboDetails>();

                    for (const row of rows) {
                        // ComboHeaders
                        const headerKey = `${row.ComboKey}_${row.BranchID}`;
                        if (!headers.has(headerKey)) {
                            headers.set(headerKey, {
                                ComboKey: row.ComboKey,
                                ComboName: row.ComboName,
                                BranchID: row.BranchID,
                            });
                        }

                        // ComboGroups
                        const groupKey = `${row.ComboKey}_${row.BranchID}_${row.GroupName}_${row.SubGroupName}_${row.GroupOrderID}_${row.ForcedQuantity}_${row.MaxQuantity}_${row.IsForcedGroup}`;
                        if (!groups.has(groupKey)) {
                            groups.set(groupKey, {
                                ComboKey: row.ComboKey,
                                BranchID: row.BranchID,
                                GroupName: row.GroupName,
                                SubGroupName: row.SubGroupName,
                                GroupOrderID: row.GroupOrderID,
                                ForcedQuantity: row.ForcedQuantity,
                                MaxQuantity: row.MaxQuantity,
                                IsForcedGroup: row.IsForcedGroup
                            });
                        }

                        details.push({
                            ComboKey: row.ComboKey,
                            BranchID: row.BranchID,
                            GroupName: row.GroupName,
                            SubGroupName: row.SubGroupName,
                            ProductKey: row.ProductKey,
                            DefaultQuantity: row.DefaultQuantity,
                            ExtraPriceTakeOut_TL: row.ExtraPriceTakeOut_TL,
                            ExtraPriceTakeOut_USD: row.ExtraPriceTakeOut_USD,
                            ExtraPriceTakeOut_EUR: row.ExtraPriceTakeOut_EUR,
                            ExtraPriceTakeOut_GBP: row.ExtraPriceTakeOut_GBP,
                            ExtraPriceDelivery_TL: row.ExtraPriceDelivery_TL,
                            ExtraPriceDelivery_USD: row.ExtraPriceDelivery_USD,
                            ExtraPriceDelivery_EUR: row.ExtraPriceDelivery_EUR,
                            ExtraPriceDelivery_GBP: row.ExtraPriceDelivery_GBP,
                            IsDefault: row.IsDefault,
                            ScreenOrderID: row.ScreenOrderID
                        });
                    }

                    // Bulk insert for each table
                    await db.bulkInsert('ComboHeaders', Array.from(headers.values()));
                    await db.bulkInsert('ComboGroups', Array.from(groups.values()));
                    await db.bulkInsert('ComboDetails', Array.from(details.values()));

                    return rows;
                },
            });

            return res.status(200).json({
                message: 'Data sync completed successfully',
                affectedRows: {
                    priceTemplates: priceTemplatesData.length,
                    menuTemplates: menuTemplatesData.length,
                    menuGroups: menuGroupsData.length,
                    products: productsData.length,
                    menuItemPrices: menuItemPricesData.length,
                    menuLayout: menuLayoutData.length,
                    branches: branchData.length,
                    paymentMethods: paymentMethodData.length,
                    comboMenus: comboData.length,
                    total: priceTemplatesData.length +
                        menuTemplatesData.length +
                        menuGroupsData.length +
                        productsData.length +
                        menuItemPricesData.length +
                        menuLayoutData.length +
                        branchData.length +
                        paymentMethodData.length +
                        comboData.length
                }
            });

        } catch (error) {
            console.error('Error updating data:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

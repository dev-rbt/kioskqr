import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';

interface MenuItem {
    MenuItemKey: string;
    ProductKey: string;
    ProductName: string;
    CategoryName: string;
    GroupName: string;
    TakeOutPrice_TL: number;
    TakeOutPrice_USD: number;
    DeliveryPrice_TL: number;
    DeliveryPrice_USD: number;
    TaxPercent: number;
    IsActive: boolean;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        try {
            const { 
                branchId, 
                categoryId, 
                groupId,
                isActive = true 
            } = req.query;

            // Build the query parameters object
            const params: Record<string, any> = {
                isActive: isActive === 'true'
            };

            // Start building the WHERE clause
            const conditions: string[] = [];
            
            if (branchId) {
                conditions.push(`b."BranchID" = :branchId`);
                params.branchId = branchId;
            }

            if (categoryId) {
                conditions.push(`p."CategoryID" = :categoryId`);
                params.categoryId = categoryId;
            }

            if (groupId) {
                conditions.push(`p."GroupID" = :groupId`);
                params.groupId = groupId;
            }

            // Always include isActive condition
            conditions.push(`p."IsActive" = :isActive`);

            const whereClause = conditions.length > 0 
                ? 'WHERE ' + conditions.join(' AND ')
                : '';

            const menuItems = await db.executeQuery<MenuItem>(`
                SELECT 
                    nm."MenuItemKey",
                    p."ProductKey",
                    p."ProductName",
                    plc."PickValue" as "CategoryName",
                    plg."PickValue" as "GroupName",
                    COALESCE(mp."TakeOutPrice_TL", 0) as "TakeOutPrice_TL",
                    COALESCE(mp."TakeOutPrice_USD", 0) as "TakeOutPrice_USD",
                    COALESCE(mp."DeliveryPrice_TL", 0) as "DeliveryPrice_TL",
                    COALESCE(mp."DeliveryPrice_USD", 0) as "DeliveryPrice_USD",
                    COALESCE(tg."TaxRate", 8) as "TaxPercent",
                    p."IsActive"
                FROM 
                    "Products" p
                INNER JOIN 
                    "MenuItemLayout" nm ON p."ProductKey" = nm."MenuItemKey"
                LEFT JOIN 
                    "MenuItemPrices" mp ON p."ProductKey" = mp."MenuItemKey"
                LEFT JOIN 
                    "Branches" b ON b."PriceTemplateKey" = mp."PriceTemplateKey"
                LEFT JOIN 
                    "posPickList" plg ON plg."ListID" = p."GroupID"
                LEFT JOIN 
                    "posPickList" plc ON plc."ListID" = p."CategoryID"
                ${whereClause}
                ORDER BY 
                    p."ProductName" ASC
            `, params);

            res.status(200).json(menuItems);
        } catch (error) {
            console.error('Error fetching menu items:', error);
            res.status(500).json({ error: 'Failed to fetch menu items' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

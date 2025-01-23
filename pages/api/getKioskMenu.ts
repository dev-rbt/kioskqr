import { NextApiRequest, NextApiResponse } from 'next';


export interface MenuApiResponse {
    Menu: ApiCategory[];
    MenuLastUpdateDateTime: string;
}
export interface ApiCategory {
    MenuGroupKey: string;
    MenuGroupText: string;
    Items: ApiMenuItem[];
}

export interface ApiMenuItem {
    MenuItemKey: string;
    MenuItemText: string;
    Description?: string;
    TakeOutPrice_TL: number;
    DeliveryPrice_TL: number;
    Badges?: string[];
    IsMainCombo?: boolean;
    Combo?: ComboGroup[];
}

export interface ComboGroup {
    GroupName: string;
    IsForcedGroup: boolean;
    MaxQuantity: number;
    ForcedQuantity: number;
    Items: ComboItem[];
}

export interface ComboItem {
    MenuItemKey: string;
    MenuItemText: string;
    DefaultQuantity: number;
    IsDefault: boolean;
    ExtraPriceTakeOut_TL: number;
    ExtraPriceDelivery_TL: number;
    Description?: string;
    Badges?: string[];
}



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        try {
            const { languageKey } = req.query;

            res.status(200).json(data);
        } catch (error) {
            console.error('Error fetching badges:', error);
            res.status(500).json({ error: 'Failed to fetch badges' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

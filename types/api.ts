export interface MenuApiResponse {
  d: {
    Menu: ApiCategory[];
    MenuLastUpdateDateTime: string;
  }
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

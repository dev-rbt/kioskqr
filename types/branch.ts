
export enum OrderType {
    DELIVERY = 'DELIVERY',
    TAKEOUT = 'TAKEOUT'
}

export interface Language {
    Key: string;
    Code: string;
    Dir: string;
    Name: string;
    IsActive: boolean;
}

export interface Banner {
    BannerID: string;
    BannerUrl: string;
}

export interface ThemeSettings {
    mainColor: string;
    accentColor: string;
    secondaryColor: string;
}

export interface Badge {
    badgeKey: string;
    badgeName: string;
}

export interface Translation {
    Name: string;
    Description: string;
    ImageUrl: string;
    badges?: Badge[];
}

export interface ComboItemTranslation {
    Name: string;
    GroupName?: string;
    Description?: string;
    ImageUrl: string;
}

export interface ComboItem {
    MenuItemKey: string;
    OriginalName: string;
    ExtraPriceTakeOut: number;
    ExtraPriceDelivery: number;
    IsDefault: boolean;
    DefaultQuantity: number;
    Translations: {
        [key: string]: ComboItemTranslation;
    };
}

export interface ComboGroup {
    ForcedQuantity: number;
    MaxQuantity: number;
    IsForcedGroup: boolean;
    OriginalName: string;
    ComboKey: string;
    Translations: {
        [key: string]: ComboItemTranslation;
    };
    Items: ComboItem[];
}

export interface Product {
    ProductID: string;
    OriginalName: string;
    TemplateKey: string;
    DisplayIndex: number;
    Translations: {
        [key: string]: Translation;
    };
    TakeOutPrice: number;
    DeliveryPrice: number;
    Weight: number;
    Rating: number;
    Calories: number;
    TaxPercent: number;
    OrderByWeight: boolean;
    PreperationTime: number;
    IsCombo: boolean;
    Combo?: ComboGroup[];
}

export interface Category {
    CategoryID: string;
    OriginalName: string;
    Translations: {
        [key: string]: Translation;
    };
    Products: Product[];
}

export interface PaymentMethod {
    PaymentMethodKey: string;
    PaymentMethodID: number;
    PaymentName: string;
    Type: string;
    Name: string;
}

export interface BranchData {
    BranchID: number;
    BranchName: string;
    DefaultLanguageKey: string;
    PaymentMethods: PaymentMethod[];
    LogoUrl: string;
    MainColor: string;
    SecondColor: string;
    AccentColor: string;
    SettingsTemplateKey: string;
    Languages: Language[];
    Banners: Banner[];
    Categories: Category[];
}
export interface Branch {
    BranchID: number;
    BranchName: string;
    KioskMenuTemplateKey: string;
    PriceTemplateKey: string;
    SettingsTemplateKey?: string;
    IsActive: boolean;
    MenuTemplateName?: string;
    PriceTemplateName?: string;
    SettingsTemplateName?: string;
    UpdatedAt?: string;
}
export interface BranchTemplate {
    TemplateKey: string;
    TemplateName: string;
    MainColor: string;
    SecondColor: string;
    AccentColor: string;
    DefaultLanguageKey: string;
    LogoUrl: string;
    IsActive: boolean;
}
export interface TemplateLanguage {
    TemplateKey: string;
    LanguageKey: string;
    IsActive: boolean;
}
export interface TemplateBanner {
    BannerID: number;
    TemplateKey: string;
    BannerUrl: string;
    DisplayOrder: number;
    IsActive: boolean;
}
export interface BranchResponse {
    branches: Branch[];
}
export interface Language {
    Code: string;
    Key: string;
    Name: string;
    IsActive?: boolean;
    DisplayOrderId?: number;
    CreatedAt?: Date;
    UpdatedAt?: Date;
}
export interface Template {
    TemplateName: string;
    TemplateKey: string;
    IsActive: boolean;
    UpdatedAt?: string;
}
export interface PriceTemplate {
    PriceTemplateKey: string;
    PriceTemplateName: string;
    IsActive: boolean;
    UpdatedAt?: string;
}
export interface Banner {
    BannerId: number;
    ImageUrl: string;
    Order: number;
}
export interface SettingsTemplate extends Template {
    MainColor?: string;
    SecondColor?: string;
    AccentColor?: string;
    DefaultLanguageKey?: string;
    LogoUrl?: string;
    Languages?: Language[];
    Branches?: Branch[];
    Banners?: Banner[];
}
export interface CategoryTranslation {
    Name: string;
    Description: string | null;
    ImageUrl: string | null;
    DisplayIndex: number;
    IsActive: boolean;
}
export interface Category {
    MenuGroupKey: string;
    TemplateKey: string;
    MenuGroupText: string;
    DisplayIndex: number;
    IsActive: boolean;
    ProductCount: number;
    CreatedAt?: Date;
    UpdatedAt?: Date;
    Translations: {
        [key: string]: CategoryTranslation;
    };
}
export interface Translation {
    MenuGroupKey?: string;
    LanguageKey?: string;
    Name?: string | null;
    Description?: string | null;
    ImageUrl?: string | null;
    DisplayIndex?: number;
    IsActive?: boolean;
}
export interface CategoryResponse {
    categories: Category[];
    languages: Language[];
}
export interface ComboProduct {
    ComboKey: string;
    ComboName: string;
    comboGroups: {
        groupName: string;
        groupOrderId: number;
        items: {
            defaultQuantity: number;
            extraPriceTakeOut_TL: number;
            isDefault: boolean;
            product: {
                ImageUrl: string;
                ProductKey: string;
                ProductName: string;
                translations: {
                    languageKey: string;
                    ImageUrl: string;
                    name: string;
                    description: string;
                }[];
            };
            productKey: string;
            screenOrderId: number;
        }[];
        maxQuantity: number;
        IsForcedGroup: boolean;
        forcedQuantity: number;
    }[];
    translations: {
        languageKey: string;
        ImageUrl?: string | undefined | null;
        name?: string | undefined;
        description?: string | undefined;
    }[];
}
export interface BadgeTranslation {
    languageKey: string;
    name: string;
}
export interface Badge {
    BadgeKey: string;
    Code: string;
    IsActive: boolean;
    translations: {
        [key: string]: BadgeTranslation;
    };
}
export interface Product {
    ProductID: string;
    ProductCode: string;
    OriginalName: string;
    PreparationTime: number;
    GroupID: number;
    CategoryID: number;
    CategoryName: string;
    OrderByWeight: boolean;
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
    PreperationTime: number;
    IsCombo: boolean;
    activeBadges: Badge[];
}

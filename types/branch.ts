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

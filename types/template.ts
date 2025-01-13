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

export interface Branch {
  BranchId: number;
  BranchName: string;
}

export interface Language {
  LanguageKey: string;
  LanguageName: string;
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

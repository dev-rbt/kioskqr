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

export interface Language {
    Key: string;
    Code: string;
}

export interface Translation {
    MenuGroupKey: string;
    LanguageKey: string;
    Name: string | null;
    Description: string | null;
    ImageUrl: string | null;
    DisplayIndex: number;
    IsActive: boolean;
}

export interface CategoryResponse {
    categories: Category[];
    languages: Language[];
}

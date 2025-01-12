export interface Category {
  MenuGroupKey: string;
  MenuGroupText: string;
  TemplateKey: string;
  DisplayIndex: number;
  IsActive: boolean;
  ProductCount: number;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  Translations: {
    [key: string]: {
      Name: string;
      Description: string | null;
      ImageUrl: string | null;
      DisplayIndex: number;
      IsActive: boolean;
    };
  };
}

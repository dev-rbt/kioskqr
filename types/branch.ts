export interface Branch {
  BranchID: number;
  BranchName: string;
  IsActive: boolean;
  KioskMenuTemplateKey: string;
  PriceTemplateKey: string;
  MenuTemplateName?: string;
  PriceTemplateName?: string;
  UpdatedAt?: string;
}

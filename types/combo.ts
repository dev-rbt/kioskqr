import { ComboItem as ApiComboItem } from './api';

export interface ComboSelection {
  groupName: string;
  item: ApiComboItem;
  quantity: number;
}

export interface ComboSelections {
  [groupName: string]: ComboSelection[];
}

export interface ComboValidation {
  isValid: boolean;
  errors: { [groupName: string]: string };
}

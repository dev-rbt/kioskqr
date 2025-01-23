import { ComboItem } from './branch';

export interface ComboSelection {
  GroupName: string;
  Item: ComboItem;
  Quantity: number;
}

export interface ComboSelections {
  [groupName: string]: ComboSelection[];
}

export interface ComboValidation {
  isValid: boolean;
  errors: { [groupName: string]: string };
}

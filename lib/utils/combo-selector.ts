"use client";

import { ComboGroup, ComboItem } from '@/types/api';
import { ComboSelections } from '@/types/combo';

export function calculateGroupProgress(
  group: ComboGroup,
  selections: ComboSelections
): number {
  const groupSelections = selections[group.GroupName] || [];
  const totalQuantity = groupSelections.reduce((sum, s) => sum + s.quantity, 0);

  if (group.IsForcedGroup) {
    return Math.min((totalQuantity / group.ForcedQuantity) * 100, 100);
  }

  if (group.MaxQuantity > 0) {
    return Math.min((totalQuantity / group.MaxQuantity) * 100, 100);
  }

  return totalQuantity > 0 ? 100 : 0;
}

export function calculateTotalPrice(
  basePrice: number,
  selections: ComboSelections
): number {
  const extraPrice = Object.values(selections)
    .flat()
    .reduce((total, selection) => 
      total + (selection.item.ExtraPriceTakeOut_TL * selection.quantity), 0);

  return basePrice + extraPrice;
}

export function validateComboSelections(
  groups: ComboGroup[],
  selections: ComboSelections
): { isValid: boolean; error?: string } {
  for (const group of groups) {
    const groupSelections = selections[group.GroupName] || [];
    const totalQuantity = groupSelections.reduce((sum, s) => sum + s.quantity, 0);

    if (group.IsForcedGroup && totalQuantity < group.ForcedQuantity) {
      return {
        isValid: false,
        error: `${group.GroupName} için ${group.ForcedQuantity} adet seçim yapmalısınız`
      };
    }

    if (group.MaxQuantity > 0 && totalQuantity > group.MaxQuantity) {
      return {
        isValid: false,
        error: `${group.GroupName} için en fazla ${group.MaxQuantity} adet seçebilirsiniz`
      };
    }
  }

  return { isValid: true };
}

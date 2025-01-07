import { ComboGroup } from '@/types/api';

export function processComboGroups(groups: ComboGroup[]): ComboGroup[] {
  return groups
    .filter(group => group.Items?.length > 0)
    .map(group => ({
      ...group,
      Items: group.Items.map(item => ({
        ...item,
        MenuItemKey: item.MenuItemKey,
        MenuItemText: item.MenuItemText,
        ExtraPriceTakeOut_TL: item.ExtraPriceTakeOut_TL || 0,
        ExtraPriceDelivery_TL: item.ExtraPriceDelivery_TL || 0,
        DefaultQuantity: item.DefaultQuantity || 0,
        IsDefault: item.IsDefault || false,
        Description: item.Description || '',
        Badges: item.Badges || []
      }))
    }));
}

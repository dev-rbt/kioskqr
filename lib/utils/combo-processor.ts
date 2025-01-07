import { ComboGroup, ComboItem } from '@/types/api';

export function processComboGroups(groups: ComboGroup[]): ComboGroup[] {
  return groups
    .filter(group => group.Items?.length > 0)
    .map(group => ({
      ...group,
      Items: (group.Items || []).map(item => ({
        MenuItemKey: item.MenuItemKey,
        MenuItemText: item.MenuItemText,
        Description: item.Description || '',
        ExtraPriceTakeOut_TL: item.ExtraPriceTakeOut_TL || 0,
        ExtraPriceDelivery_TL: item.ExtraPriceDelivery_TL || 0,
        DefaultQuantity: item.DefaultQuantity || 0,
        IsDefault: item.IsDefault || false,
        Badges: item.Badges || []
      }))
    }));
}

# Menu API Documentation

## Overview
This document describes how to integrate with the menu data API to build applications that display restaurant menu items, categories, and combo deals.

## Base URL
```
https://srv7.robotpos.com/kiosk2025/kioskService.asmx
```

## Menu Data Structure

### Categories
Categories organize menu items into logical groups like "Pideler", "Lahmacunlar", etc.

Example category structure:
```json
{
  "MenuGroupKey": "PIDELER",
  "MenuGroupText": "Pideler",
  "Items": [...]
}
```

### Products
Individual menu items with pricing, descriptions and badges.

Example product structure:
```json
{
  "MenuItemKey": "P001",
  "MenuItemText": "Karışık Pide",
  "Description": "Kıyma, peynir ve kuşbaşı etle hazırlanan enfes pide",
  "TakeOutPrice_TL": 129.90,
  "DeliveryPrice_TL": 139.90,
  "Badges": ["Popüler"]
}
```

### Combos/Menus
Special deals that combine multiple items with optional selections.

Example combo structure:
```json
{
  "MenuItemKey": "M001",
  "MenuItemText": "Pide Menü",
  "Description": "1 Adet Pide + 1 İçecek + 1 Tatlı",
  "TakeOutPrice_TL": 169.90,
  "DeliveryPrice_TL": 179.90,
  "Badges": ["Fırsat", "Popüler"],
  "Combo": [
    {
      "GroupName": "Pide Seçimi",
      "IsForcedGroup": true,
      "MaxQuantity": 1,
      "ForcedQuantity": 1,
      "Items": [...]
    }
  ]
}
```

## API Endpoints

### Get Menu Data

**Endpoint:** `POST /getKioskMenu`

**Request:**
```json
{
  "currentMenuLastUpdateDateTime": "2000-01-01"
}
```

**Response:**
```json
{
  "d": {
    "Menu": [...],
    "MenuLastUpdateDateTime": "2024-01-10"
  }
}
```

## Implementation Guide

### 1. Fetching Menu Data

```typescript
async function fetchMenu() {
  try {
    const response = await fetch('https://srv7.robotpos.com/kiosk2025/kioskService.asmx/getKioskMenu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        currentMenuLastUpdateDateTime: "2000-01-01"
      })
    });

    const data = await response.json();
    return data.d.Menu;
  } catch (error) {
    console.error('Error fetching menu:', error);
    throw error;
  }
}
```

### 2. Data Models

```typescript
interface Category {
  MenuGroupKey: string;
  MenuGroupText: string;
  Items: MenuItem[];
}

interface MenuItem {
  MenuItemKey: string;
  MenuItemText: string;
  Description: string;
  TakeOutPrice_TL: number;
  DeliveryPrice_TL: number;
  Badges?: string[];
  Combo?: ComboGroup[];
}

interface ComboGroup {
  GroupName: string;
  IsForcedGroup: boolean;
  MaxQuantity: number;
  ForcedQuantity: number;
  Items: ComboItem[];
}

interface ComboItem {
  MenuItemKey: string;
  MenuItemText: string;
  ExtraPriceTakeOut_TL: number;
  ExtraPriceDelivery_TL: number;
  IsDefault?: boolean;
  DefaultQuantity?: number;
}
```

### 3. Processing Menu Data

```typescript
function processMenuData(menu: Category[]) {
  // Group items by category
  const categorizedItems = menu.reduce((acc, category) => {
    acc[category.MenuGroupKey] = category.Items;
    return acc;
  }, {});

  // Extract combos/deals
  const deals = menu
    .flatMap(category => category.Items)
    .filter(item => item.Combo);

  return {
    categories: categorizedItems,
    deals
  };
}
```

### 4. Handling Prices

```typescript
function getItemPrice(item: MenuItem, orderType: 'takeout' | 'delivery') {
  return orderType === 'takeout' 
    ? item.TakeOutPrice_TL 
    : item.DeliveryPrice_TL;
}

function calculateComboPrice(combo: MenuItem, selections: ComboItem[], orderType: 'takeout' | 'delivery') {
  const basePrice = getItemPrice(combo, orderType);
  
  const extraPrice = selections.reduce((total, item) => {
    const extra = orderType === 'takeout' 
      ? item.ExtraPriceTakeOut_TL 
      : item.ExtraPriceDelivery_TL;
    return total + extra;
  }, 0);

  return basePrice + extraPrice;
}
```

### 5. Validating Combo Selections

```typescript
function validateComboSelections(combo: MenuItem, selections: Record<string, ComboItem[]>) {
  return combo.Combo?.every(group => {
    const groupSelections = selections[group.GroupName] || [];
    
    if (group.IsForcedGroup && groupSelections.length < group.ForcedQuantity) {
      return false;
    }
    
    if (group.MaxQuantity > 0 && groupSelections.length > group.MaxQuantity) {
      return false;
    }
    
    return true;
  });
}
```

## Best Practices

1. **Caching**
   - Cache menu data locally
   - Store last update timestamp
   - Implement periodic updates

2. **Error Handling**
   - Handle network errors gracefully
   - Provide fallback content
   - Show user-friendly error messages

3. **Performance**
   - Implement lazy loading for images
   - Cache processed data
   - Minimize unnecessary data processing

4. **Validation**
   - Validate combo selections
   - Check price calculations
   - Verify required fields

5. **UI/UX**
   - Show loading states
   - Handle empty states
   - Provide clear error messages
   - Implement smooth transitions

## Image Assets
Product images follow the pattern:
```
assets/products/{MenuItemKey}.jpg
```

Category images follow the pattern:
```
assets/groups/{MenuGroupKey}.jpg
```

## Example Usage

```typescript
// Fetch and process menu
const menu = await fetchMenu();
const { categories, deals } = processMenuData(menu);

// Get item price
const pide = categories.PIDELER[0];
const takeoutPrice = getItemPrice(pide, 'takeout');

// Calculate combo price
const combo = deals[0];
const selections = [
  { MenuItemKey: 'P001', ExtraPriceTakeOut_TL: 10 },
  { MenuItemKey: 'D001', ExtraPriceTakeOut_TL: 0 }
];
const totalPrice = calculateComboPrice(combo, selections, 'takeout');

// Validate selections
const isValid = validateComboSelections(combo, {
  'Pide Seçimi': [selections[0]],
  'İçecek Seçimi': [selections[1]]
});
```

2. Combo UI Implementation
Combo menü seçim ekranı şu özellikleri içermelidir:

Grup Başlıkları

Her grup için başlık (GroupName)
Zorunlu/Opsiyonel bilgisi
Maksimum seçim adedi
Ürün Seçimleri

Ürün görseli
Ürün adı
Varsa ekstra ücret
Seçim durumu (checkbox/radio)
Adet kontrolü (+/-)
Validasyon Kontrolleri

Zorunlu gruplar için minimum seçim kontrolü
Maksimum adet kontrolü
Varsayılan seçimlerin otomatik eklenmesi
3. Örnek UI Akışı

// Combo seçim durumu
interface ComboSelections {
  [groupName: string]: {
    item: ComboItem;
    quantity: number;
  }[];
}

// Seçim yönetimi
function handleItemSelection(group: ComboGroup, item: ComboItem) {
  // Tek seçim için
  if (group.MaxQuantity === 1) {
    selections[group.GroupName] = [{
      item,
      quantity: 1
    }];
  }
  // Çoklu seçim için
  else {
    const currentSelections = selections[group.GroupName] || [];
    
    if (canIncreaseQuantity(group)) {
      currentSelections.push({
        item,
        quantity: 1
      });
    }
  }
}

// Adet kontrolü
function canIncreaseQuantity(group: ComboGroup): boolean {
  const currentQuantity = getTotalQuantity(group.GroupName);
  return group.MaxQuantity === 0 || currentQuantity < group.MaxQuantity;
}

// Zorunlu seçim kontrolü
function validateRequiredSelections(): boolean {
  return combo.Combo.every(group => {
    if (group.IsForcedGroup) {
      const quantity = getTotalQuantity(group.GroupName);
      return quantity >= group.ForcedQuantity;
    }
    return true;
  });
}
4. Önemli Noktalar
Varsayılan Seçimler

IsDefault: true olan ürünler otomatik seçili gelmeli
DefaultQuantity kadar adet eklenmiş olmalı
Zorunlu Seçimler

IsForcedGroup: true olan gruplarda seçim yapılmadan ilerlenmemeli
ForcedQuantity kadar seçim yapılması zorunlu
Adet Kontrolleri

MaxQuantity > 0 olan gruplarda bu sayı aşılmamalı
MaxQuantity = 0 sınırsız seçime izin verir
Fiyat Hesaplama

Temel fiyat + seçilen ürünlerin ekstra ücretleri
Adet ile çarpılarak hesaplanmalı
UI/UX

Seçim limitleri kullanıcıya gösterilmeli
Hata mesajları açık olmalı
Seçim değişikliklerinde fiyat anında güncellenmeli

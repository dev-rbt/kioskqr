
export interface CartProduct {
    TransactionKey?: string;
    MenuItemKey?: string;
    MenuItemText?: string;
    Quantity?: number;
    Price?: number;
    Notes?: string;
    IsMainCombo?: boolean;
    DiscountLineAmount?: number;
    DiscountOrderAmount?: number;
    TaxPercent?: number;
    OrderByWeight?: boolean;
    DiscountCashAmount?: number;
    Items?: CartProduct[];
}

export interface PaymentMethod {
    Key: string;
    PaymentMethodID: number;
    PaymentName: string;
    Name: string;
    Type: string;
}

export type OrderType = 'Delivery' | 'TakeOut';
export type PaymentType = 'CREDIT_CARD' | 'MEAL_CARD';

export interface Cart {
    AmountDue: number;
    SubTotal?: number;
    DiscountLineAmount?:number;
    DiscountOrderAmount?: number;
    Notes?: string;
    CallNumber?: string;
    Items?: CartProduct[];
    OrderType?: OrderType;
    PaymentType?: PaymentType;
    PaymentMethod?: PaymentMethod;
}
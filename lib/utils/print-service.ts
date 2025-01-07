'use client';

import { CartItem } from '../../types/cart';
import { isElastic } from './elastic';

class PrintService {
  generateReceipt(items: CartItem[], total: number): {
    orderId: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    total: number;
  } {
    // Generate a random order ID (you might want to get this from your backend)
    const orderId = Math.floor(100000 + Math.random() * 900000).toString();

    // Format items according to Elastic print format
    const formattedItems = items.map(item => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price
    }));

    return {
      orderId,
      items: formattedItems,
      total
    };
  }

  async print(receiptData: ReturnType<typeof this.generateReceipt>): Promise<boolean> {
    // Check if we're in Elastic environment
    if (!isElastic()) {
      console.warn('Not in Elastic environment');
      return false;
    }

    // Check if elasticPrint is available
    if (!window.elasticPrint) {
      console.warn('elasticPrint not available');
      return false;
    }

    try {
      // Send print request to Elastic
      window.elasticPrint(receiptData);
      return true;
    } catch (error) {
      console.warn('Print failed:', error);
      return false;
    }
  }
}

export const printService = new PrintService();

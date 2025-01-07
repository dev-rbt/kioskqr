declare global {
  interface Window {
    elasticPrint: (data: {
      orderId: string;
      items: Array<{
        name: string;
        quantity: number;
        price: number;
      }>;
      total: number;
      notes?: string;
    }) => void;
  }
}

export {};

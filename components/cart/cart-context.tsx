"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type CartContextType = {
  footerHeight: number;
  setFooterHeight: (height: number) => void;
};

const CartContext = createContext<CartContextType>({
  footerHeight: 0,
  setFooterHeight: () => {},
});

export const CartContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [footerHeight, setFooterHeight] = useState(0);

  return (
    <CartContext.Provider value={{ footerHeight, setFooterHeight }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);

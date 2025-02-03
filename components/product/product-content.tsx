"use client";

import { ProductImage } from '@/components/product/product-image';
import { ProductInfo } from '@/components/product/product-info';
import { ComboSelector } from '@/components/combo/combo-selector';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { notFound } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { useRouter } from 'next/navigation';
import { ComboSelections } from '@/types/combo';
import { ShoppingCart, Check, UtensilsCrossed, ArrowLeft } from 'lucide-react';
import { containerVariants, itemVariants } from './animations';
import { useState } from 'react';
import useBranchStore from '@/store/branch';
import { calculateTotalPrice } from '@/lib/utils/combo-selector';
import { OrderType } from '@/types/branch';
import { v4 as uuidv4 } from 'uuid';
import { useSearchParams } from 'next/navigation';

export default function ProductContent({ params }: { params: { id: string, categoryId: string, branchId: string } }) {
  const { branchData, selectedLanguage, selectedOrderType } = useBranchStore();
  const { addCartProduct, updateCartProductTransactionKey, cart } = useCartStore();
  const searchParams = useSearchParams();
  const transactionKey = searchParams.get('transactionKey');
  const existingItem = transactionKey ? cart.Items.find(item => item.TransactionKey === transactionKey) : null;
  const { t } = useBranchStore();
  const router = useRouter();
  const [showAddedAnimation, setShowAddedAnimation] = useState(false);

  const product = branchData?.Categories.find((c) => c.CategoryID === params.categoryId)?.Products.find((p) => p.ProductID === params.id);
  const productTranslation = product?.Translations?.[selectedLanguage?.Key || 'en-US'];
  const turkishTranslation = product?.Translations?.[branchData?.Languages.find(language => language.Code.toLowerCase() === 'tr')?.Key || 'en-US'];

  if (!product) {
    notFound();
  }

  const handleComboAddToCart = (selections: ComboSelections, note: string) => {
    console.log("Received note in ProductContent:", note);
    setShowAddedAnimation(true);

    const totalPrice = product.Combo ? calculateTotalPrice((selectedOrderType == OrderType.DELIVERY) ? product.DeliveryPrice : product.TakeOutPrice, selections) : (selectedOrderType == OrderType.DELIVERY) ? product.DeliveryPrice : product.TakeOutPrice;

    // Combo seçimlerini SelectedItems formatına dönüştür
    const selectedItems = Object.entries(selections).flatMap(([groupName, groupSelections]) => 
      groupSelections.map(selection => ({
        TransactionKey: uuidv4(),
        DiscountLineAmount: 0,
        DiscountCashAmount: 0,
        DiscountOrderAmount: 0,
        TaxPercent: selection.Item.TaxPercent,
        OrderByWeight: selection.Item.OrderByWeight,
        MenuItemKey: selection.Item.MenuItemKey,
        MenuItemText: selection.Item.OriginalName,
        Price: selectedOrderType == OrderType.DELIVERY ? selection.Item.ExtraPriceDelivery : selection.Item.ExtraPriceTakeOut || 0,
        Quantity: selection.Quantity,
        IsMainCombo: false,
        Items: [],
        Notes: ''
      }))
    );
  
    const cartProduct = {
      TransactionKey: transactionKey || uuidv4(),
      MenuItemKey: product.ProductID,
      MenuItemText: product.OriginalName,
      Price: totalPrice,
      Quantity: existingItem?.Quantity || 1,
      IsMainCombo: true,
      DiscountLineAmount: 0,
      DiscountCashAmount: 0,
      DiscountOrderAmount: 0,
      TaxPercent: product.TaxPercent,
      OrderByWeight: product.OrderByWeight,
      Items: selectedItems,
      Notes: note
    };
    console.log("Cart product with note:", cartProduct);

    setTimeout(() => {
      if (transactionKey) {
        // If transactionKey exists, update the existing cart item
        updateCartProductTransactionKey(transactionKey, cartProduct);
      } else {
        // If no transactionKey, add as new item
        addCartProduct(cartProduct);
      }
      router.push(`/${params.branchId}/menu/category/${params.categoryId}`);
    }, 700);
  };

  const handleAddToCart = () => {
    setShowAddedAnimation(true);

    const cartProduct = {
      TransactionKey: transactionKey || uuidv4(),
      MenuItemKey: product.ProductID,
      MenuItemText: product.OriginalName,
      Price: (selectedOrderType == OrderType.DELIVERY) ? product.DeliveryPrice : product.TakeOutPrice,
      Quantity: existingItem?.Quantity || 1,
      IsMainCombo: false,
      Items: [],
      Notes: ''
    };

    setTimeout(() => {
      if (transactionKey) {
        // If transactionKey exists, update the existing cart item
        updateCartProductTransactionKey(transactionKey, cartProduct);
      } else {
        // If no transactionKey, add as new item
        addCartProduct(cartProduct);
      }
      router.push(`/${params.branchId}/menu/category/${params.categoryId}`);
    }, 700);
  };

  return (
    <motion.main
      className="px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Added to Cart Animation */}
      <AnimatePresence>
        {showAddedAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-primary/95 text-primary-foreground p-8 rounded-2xl flex flex-col items-center gap-4 max-w-sm mx-4"
            >
              <div className="rounded-full bg-white/20 p-4">
                {product.IsCombo ? (
                  <UtensilsCrossed className="w-12 h-12" />
                ) : (
                  <Check className="w-12 h-12" />
                )}
              </div>
              <h3 className="text-2xl font-bold text-center">{product.OriginalName}</h3>
              <p className="text-lg text-center text-primary-foreground/90">
                {product.IsCombo
                  ? t.common.addToCartSuccess
                  : t.common.productAddToCartSuccess}
              </p>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <ShoppingCart className="w-4 h-4" />
                <span>{t.common.addedToCart}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        variant="outline"
        className="mt-6 flex items-center gap-2 hover:bg-secondary/20"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-4 h-4" />
        {t.common.goBack}
      </Button>

      <div className="mx-auto">
        <div className="space-y-8">
          <motion.div variants={itemVariants}>
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-8 items-start p-6">
                <div className="relative">
                  <ProductImage src={productTranslation?.ImageUrl || turkishTranslation?.ImageUrl || ''} alt={product.OriginalName || ''} />
                  <div className="absolute top-4 right-4 bg-primary/90 text-primary-foreground px-4 py-2 rounded-full font-bold shadow-lg">
                    {(selectedOrderType == OrderType.DELIVERY) ? product.DeliveryPrice : product.TakeOutPrice} ₺
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h1 className="text-4xl font-bold">{product.OriginalName}</h1>
                    <p className="text-lg text-muted-foreground">
                      {productTranslation?.Description || turkishTranslation?.Description || ''}
                    </p>
                  </div>

                  <ProductInfo product={product} />

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* {product.ingredients && (
                      <div className="bg-secondary/10 rounded-xl p-4">
                        <ProductIngredients ingredients={product.ingredients} />
                      </div>
                    )}
                    {product.allergens && (
                      <div className="bg-secondary/10 rounded-xl p-4">
                        <ProductAllergens allergens={product.allergens} />
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {product.IsCombo && product.Combo?.length ? (
            <motion.div variants={itemVariants}>
                <ComboSelector
                  groups={product.Combo}
                  basePrice={(selectedOrderType == OrderType.DELIVERY) ? product.DeliveryPrice : product.TakeOutPrice}
                  onAddToCart={handleComboAddToCart}
                  existingTransactionKey={transactionKey || undefined}
                />
            </motion.div>
          ) : (
            <motion.div variants={itemVariants} className="sticky bottom-0 backdrop-blur-lg border-t p-4 z-50">
              <Button
                className="w-full gap-2"
                size="lg"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4" />
                {t.common.addToCart} ({(selectedOrderType == OrderType.DELIVERY) ? product.DeliveryPrice : product.TakeOutPrice} ₺)
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.main>
  );
}

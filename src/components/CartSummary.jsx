import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

const CartSummary = () => {
  const { cartItems } = useCart();

  // تصفية العناصر غير الصالحة
  const validItems = cartItems.filter(item => item.price >= 0 && item.quantity > 0);

  const subtotal = validItems.reduce(
    (total, item) => total + item.price * item.quantity, 
    0
  );

  const shipping = subtotal > 0 ? 15 : 0;
  const total = subtotal + shipping;

  // تنسيق العملة
  const formatCurrency = (value) =>
    new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(value);

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">ملخص الطلب</h3>

      {validItems.length === 0 ? (
        <p className="text-center text-gray-500 mb-4">عربة التسوق فارغة</p>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">المجموع الفرعي</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">الشحن</span>
              <span>{formatCurrency(shipping)}</span>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between font-semibold">
                <span>الإجمالي</span>
                <span className="text-primary">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </>
      )}

      <Button 
        asChild
        className="w-full"
        disabled={validItems.length === 0}
      >
        <Link to={validItems.length > 0 ? "/checkout" : "#"}>
          متابعة الدفع
        </Link>
      </Button>

      <div className="mt-4 text-center">
        <Link 
          to="/products" 
          className="text-primary hover:underline text-sm"
        >
          أو متابعة التسوق
        </Link>
      </div>
    </div>
  );
};

export default CartSummary;
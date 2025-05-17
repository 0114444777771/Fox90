import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { db } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import emailjs from '@emailjs/browser';

const ReviewOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const { formData, cartItems } = location.state || {};
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!formData || !cartItems) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">لا توجد بيانات للمراجعة. يرجى العودة إلى صفحة الدفع.</p>
        <Button onClick={() => navigate('/checkout')} className="mt-4">
          العودة إلى الدفع
        </Button>
      </div>
    );
  }

  const shipping = 15;
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const grandTotal = total + shipping;

  const confirmOrder = async () => {
    // تحقق من وجود البيانات المطلوبة
    if (!formData.firstName || !formData.email || cartItems.length === 0) {
      alert('هناك بيانات ناقصة، يرجى العودة وإكمال النموذج.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        ...formData,
        cartItems,
        total: grandTotal,
        shipping,
        status: 'pending',
        createdAt: serverTimestamp(),
      };

      // إضافة الطلب إلى Firestore
      const docRef = await addDoc(collection(db, 'orders'), orderData);

      // إرسال بريد إلكتروني عبر EmailJS
      await emailjs.send(
        'service_pllfmfx',
        'template_z9q8e8p',
        {
          to_email: formData.email,
          to_name: `${formData.firstName} ${formData.lastName}`,
          orderId: docRef.id,
          cartItems: cartItems.map(item => `${item.name} × ${item.quantity}`).join('\n'),
          total: grandTotal.toLocaleString(),
          address: `${formData.address}, ${formData.city} - ${formData.postalCode}`,
        },
        'xpSKf6d4h11LzEOLz'
      );

      clearCart();

      alert(`تم تأكيد الطلب! رقم الطلب: ${docRef.id}`);
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء تأكيد الطلب، حاول مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">مراجعة الطلب</h2>

      <div className="border p-4 rounded">
        <h3 className="font-semibold">معلومات العميل:</h3>
        <p>الاسم: {formData.firstName} {formData.lastName}</p>
        <p>البريد: {formData.email}</p>
        <p>الهاتف: {formData.phone}</p>
        <p>العنوان: {formData.address}, {formData.city} - {formData.postalCode}</p>
        <p>طريقة الدفع: {formData.paymentMethod === 'cod' ? 'عند الاستلام' : 'تحويل بنكي'}</p>
      </div>

      <div className="border p-4 rounded">
        <h3 className="font-semibold">محتويات السلة:</h3>
        <ul className="list-disc pl-5">
          {cartItems.map((item, i) => (
            <li key={i}>
              {item.name} × {item.quantity} = {(item.price * item.quantity).toLocaleString()} جنيه
            </li>
          ))}
        </ul>
        <p>الشحن: {shipping.toLocaleString()} جنيه</p>
        <p className="font-bold">الإجمالي: {grandTotal.toLocaleString()} جنيه</p>
      </div>

      <Button onClick={confirmOrder} className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'جاري تأكيد الطلب...' : 'تأكيد الطلب وإرسال البريد'}
      </Button>
    </div>
  );
};

export default ReviewOrder;

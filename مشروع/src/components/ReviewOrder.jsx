// src/pages/ReviewOrder.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import emailjs from '@emailjs/browser';

const ReviewOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, cartItems } = location.state || {};

  if (!formData || !cartItems) return <div>لا توجد بيانات</div>;

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 15;
  const grandTotal = total + shipping;

  const confirmOrder = () => {
    const order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      items: cartItems,
      total: grandTotal,
      shipping,
      customer: formData,
      status: 'pending'
    };

    // إرسال بريد إلكتروني
    emailjs.send('service_xxx', 'template_xxx', {
      to_name: `${formData.firstName} ${formData.lastName}`,
      to_email: formData.email,
      order_id: order.id,
      total: grandTotal,
      address: formData.address,
    }, 'user_xxx')
    .then(() => {
      // نجاح
      alert("تم إرسال الطلب وتأكيده عبر البريد الإلكتروني.");
      navigate('/');
    })
    .catch((err) => {
      console.error(err);
      alert("حدث خطأ أثناء إرسال البريد.");
    });
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
              {item.name} × {item.quantity} = {item.price * item.quantity} جنيه
            </li>
          ))}
        </ul>
        <p>الشحن: {shipping} جنيه</p>
        <p className="font-bold">الإجمالي: {grandTotal} جنيه</p>
      </div>

      <Button onClick={confirmOrder} className="w-full">
        تأكيد الطلب وإرسال البريد
      </Button>
    </div>
  );
};

export default ReviewOrder;
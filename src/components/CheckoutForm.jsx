import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { db } from '@/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import emailjs from '@emailjs/browser'; // استيراد EmailJS

const CheckoutForm = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cod'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const order = {
        ...formData,
        cartItems,
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, 'orders'), order);

      // إرسال بريد إلكتروني عبر EmailJS
      await emailjs.send(
        'service_pllfmfx',     // استبدله بـ ID الخدمة من EmailJS
        'template_z9q8e8p',    // استبدله بـ ID القالب من EmailJS
        {
          ...formData,
          orderId: docRef.id,
          cartItems: cartItems.map(item => `${item.name} x${item.quantity}`).join(', ')
        },
        'xpSKf6d4h11LzEOLz'      // استبدله بـ المفتاح العام من EmailJS
      );

      clearCart();

      toast({
        title: "تم إرسال الطلب بنجاح!",
        description: `رقم الطلب: ${docRef.id}`,
        duration: 5000,
      });

      navigate('/');
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "لم يتم إرسال الطلب. حاول مرة أخرى.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium mb-1">الاسم الأول</label>
          <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium mb-1">الاسم الأخير</label>
          <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">رقم الهاتف</label>
          <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium mb-1">العنوان</label>
        <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium mb-1">المدينة</label>
          <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium mb-1">الرمز البريدي</label>
          <Input id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} required />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">طريقة الدفع</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <input id="cod" name="paymentMethod" type="radio" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} className="h-4 w-4 text-primary border-gray-300 focus:ring-primary" />
            <label htmlFor="cod" className="mr-2 block text-sm">الدفع عند الاستلام</label>
          </div>
          <div className="flex items-center">
            <input id="bank" name="paymentMethod" type="radio" value="bank" checked={formData.paymentMethod === 'bank'} onChange={handleChange} className="h-4 w-4 text-primary border-gray-300 focus:ring-primary" />
            <label htmlFor="bank" className="mr-2 block text-sm">تحويل بنكي</label>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'جاري إرسال الطلب...' : 'إرسال الطلب'}
      </Button>
    </form>
  );
};

export default CheckoutForm;

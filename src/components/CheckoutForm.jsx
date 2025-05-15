 import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { db } from '@/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import emailjs from '@emailjs/browser';

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

      await emailjs.send(
        'service_pllfmfx',     
        'template_z9q8e8p',    
        {
          ...formData,
          orderId: docRef.id,
          cartItems: cartItems.map(item => `${item.name} x${item.quantity}`).join(', ')
        },
        'xpSKf6d4h11LzEOLz'    
      );

      clearCart();

      toast({
        title: "تم إرسال الطلب بنجاح!",
        description: `رقم الطلب: ${docRef.id}`,
        duration: 5000,
      });

      navigate('/');
    } catch (error) {
      console.error("خطأ أثناء إرسال الطلب:", error);

      toast({
        title: "حدث خطأ",
        description: `الخطأ: ${error.message || error}`,
        duration: 7000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* نفس عناصر النموذج السابقة */}
      {/* ... */}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'جاري إرسال الطلب...' : 'إرسال الطلب'}
      </Button>
    </form>
  );
};

export default CheckoutForm;

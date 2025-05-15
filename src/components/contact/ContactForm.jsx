import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const ContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'الاسم مطلوب';
    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'صيغة البريد غير صحيحة';
    }
    if (!formData.message.trim()) newErrors.message = 'الرسالة مطلوبة';

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch('https://formspree.io/f/xvgpydyg', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: new FormData(e.target)
      });

      if (response.ok) {
        toast({
          title: "تم الإرسال",
          description: "تم إرسال رسالتك بنجاح",
          duration: 5000
        });

        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
      } else {
        toast({
          title: "فشل في الإرسال",
          description: "حدث خطأ أثناء الإرسال، حاول مرة أخرى.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "خطأ في الاتصال",
        description: "يرجى المحاولة لاحقًا.",
        variant: "destructive"
      });
    }

    setIsSubmitting(false);
  };

  const renderError = (field) => {
    return errors[field] && (
      <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">الاسم الكامل</label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {renderError('name')}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {renderError('email')}
        </div>
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1">رقم الهاتف (اختياري)</label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">الرسالة</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          required
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        {renderError('message')}
      </div>
      <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
        {isSubmitting ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            جاري الإرسال...
          </span>
        ) : (
          <span className="flex items-center">
            <Send className="ml-2 h-4 w-4" />
            إرسال الرسالة
          </span>
        )}
      </Button>
    </form>
  );
};

export default ContactForm;
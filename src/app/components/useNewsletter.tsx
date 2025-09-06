// hooks/useNewsletter.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newsletterSchema, type NewsletterFormData } from '../../utils/validation';

export const useNewsletter = () => {
  const form = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    mode: 'onChange',
    defaultValues: {
      email: ''
    }
  });

  const submitNewsletter = async (data: NewsletterFormData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "https://techblog-backend-w6kj.onrender.com"}/api/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      });

      const responseData = await response.json();

      if (response.ok) {
        return { success: true, data: responseData };
      } else {
        return { 
          success: false, 
          error: responseData.message || 'Subscription failed',
          status: response.status
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to connect to the server' 
      };
    }
  };

  return {
    form,
    submitNewsletter
  };
};
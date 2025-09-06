// components/Newsletter.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import ConfirmationModal from './ConfirmationModal';
import { newsletterSchema, type NewsletterFormData } from '../../utils/validation';

export default function Newsletter() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState('');

  const form = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    mode: 'onChange',
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data: NewsletterFormData) => {
    try {
      const response = await fetch('http://localhost:4001/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setSubscribedEmail(data.email);
        setIsModalOpen(true);
        form.reset();
      } else {
        if (response.status === 409) {
          form.setError('email', {
            type: 'manual',
            message: 'This email is already subscribed to our newsletter'
          });
        } else if (response.status === 400) {
          form.setError('email', {
            type: 'manual',
            message: responseData.message || 'Invalid email address'
          });
        } else {
          form.setError('root', {
            type: 'manual',
            message: responseData.message || 'Subscription failed. Please try again.'
          });
        }
      }
    } catch (error) {
      form.setError('root', {
        type: 'manual',
        message: 'Failed to connect to the server. Please try again later.'
      });
    }
  };

  const isSubmitting = form.formState.isSubmitting;
  const isValid = form.formState.isValid;

  return (
    <>
      <div className="p-6 border rounded-lg border-border bg-card shadow-sm max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold text-card-foreground mb-2">
            Stay Updated
          </h2>
          <p className="text-muted-foreground">
            Get notified when we publish new articles. No spam, unsubscribe anytime.
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="email" className="sr-only">
                    Email address
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your email address"
                      type="email"
                      disabled={isSubmitting}
                      className="h-12 text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="w-full h-12 text-base font-medium"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subscribing...
                </>
              ) : (
                'Subscribe Now'
              )}
            </Button>

            {form.formState.errors.root && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}
          </form>
        </Form>

        <p className="mt-4 text-xs text-muted-foreground text-center">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>

      <ConfirmationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        email={subscribedEmail} 
      />
    </>
  );
}
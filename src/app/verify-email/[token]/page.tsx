// app/verify-email/[token]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function VerifyEmail() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const response = await fetch(`http://localhost:4001/api/verify/${token}`);
        const data = await response.json();
        
        if (data.success) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
          
          setTimeout(() => {
            router.push('/');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed. Please try again.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Verification failed. Please try again later.');
      }
    };

    verifyEmail();
  }, [token, router]);

  const Icon = {
    loading: Loader2,
    success: CheckCircle,
    error: XCircle,
  }[status];

  const title = {
    loading: 'Verifying Email',
    success: 'Email Verified!',
    error: 'Verification Failed',
  }[status];

  const variant = {
    loading: 'default',
    success: 'success',
    error: 'destructive',
  }[status] as 'default' | 'success' | 'destructive';

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto">
            <Icon className={`h-16 w-16 ${
              status === 'loading' ? 'text-primary animate-spin' :
              status === 'success' ? 'text-green-600' : 'text-destructive'
            }`} />
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">{message}</p>

          {status === 'success' && (
            <Alert variant="success">
              <AlertDescription>
                You will be redirected to the home page shortly...
              </AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertDescription>
                  Please check if the verification link is correct or try subscribing again.
                </AlertDescription>
              </Alert>
              
              <Button asChild className="w-full">
                <Link href="/">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          )}

          {status === 'loading' && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Please wait while we verify your email...
              </p>
            </div>
          )}

          <div className="text-center pt-4 border-t">
            <Button variant="ghost" asChild>
              <Link href="/">
                ← Return to Website
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
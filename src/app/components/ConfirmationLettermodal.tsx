// components/ConfirmationModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { X, Mail, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export default function ConfirmationModal({ isOpen, onClose, email }: ConfirmationModalProps) {
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setCountdown(30);
    setCanResend(false);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleResend = async () => {
    if (!canResend) return;

    try {
      const response = await fetch('http://localhost:4001/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setCountdown(30);
        setCanResend(false);
      }
    } catch (error) {
      console.error('Failed to resend verification email:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">
            Check Your Email
          </DialogTitle>
          <DialogDescription className="text-center">
            We've sent a verification link to
          </DialogDescription>
          <p className="text-primary font-medium text-center break-all">{email}</p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                Click the verification link in the email to complete your subscription
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              Didn't receive the email?
            </p>
            
            <Button
              onClick={handleResend}
              disabled={!canResend}
              variant="outline"
              className="w-full"
            >
              {canResend ? (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Resend Verification Email
                </>
              ) : (
                <>
                  <Clock className="mr-2 h-4 w-4" />
                  Resend in {countdown}s
                </>
              )}
            </Button>

            {!canResend && (
              <Progress value={((30 - countdown) / 30) * 100} className="w-full" />
            )}
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Check your spam folder or{' '}
              <a
                href="mailto:support@blog3d.com"
                className="text-primary hover:underline"
              >
                contact support
              </a>{' '}
              if you need help
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
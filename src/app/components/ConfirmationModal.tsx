'use client';

import { useEffect } from 'react';
import { XMarkIcon, EnvelopeIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export default function ConfirmationModal({ isOpen, onClose, email }: ConfirmationModalProps) {
  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur effect */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <EnvelopeIcon className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Check Your Email</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <CheckBadgeIcon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -inset-2 bg-green-100 rounded-full -z-10 animate-pulse"></div>
              </div>
            </div>

            <div className="text-center space-y-3">
              <h3 className="text-lg font-medium text-gray-900">Almost There!</h3>
              <p className="text-gray-600">
                We've sent a confirmation email to:
              </p>
              <p className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-2 rounded-lg inline-block">
                {email}
              </p>
              <p className="text-sm text-gray-500">
                Click the link in the email to confirm your subscription and get started.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <EnvelopeIcon className="w-4 h-4" />
              <span>Didn't receive it? Check your spam folder.</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
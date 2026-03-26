'use client';

import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export function BetaBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the banner (only in browser)
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem('betaBannerDismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    }
  }, []);

  const handleDismiss = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('betaBannerDismissed', 'true');
    }
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <span className="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white bg-opacity-20">
              BETA
            </span>
            <p className="text-sm md:text-base font-medium">
              You're using our beta platform. Features may change as we improve.{' '}
              <Link href="/beta-terms" className="underline hover:text-blue-100">
                Learn more
              </Link>
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 rounded-md hover:bg-white hover:bg-opacity-10 transition-colors"
            aria-label="Dismiss beta banner"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({
  size = 'md',
  message = 'Loading...',
  className = '',
}) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 gap-3 ${className}`}
    >
      <Loader2
        className={`animate-spin text-gold ${sizes[size] || sizes.md}`}
      />
      {message && <p className="text-xs text-navy/60 font-medium tracking-wide">{message}</p>}
    </div>
  );
}

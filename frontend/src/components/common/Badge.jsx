import React from 'react';

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) {
  const variants = {
    default: 'bg-navy/10 text-navy border-navy/10',
    gold: 'bg-gold/15 text-[#916d28] border-gold/30',
    emerald: 'bg-emerald/10 text-emerald border-emerald/20',
    navy: 'bg-navy text-white border-navy',
    danger: 'bg-rose-50 text-rose-600 border-rose-200',
    neutral: 'bg-stone-100 text-stone-700 border-stone-200',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 font-medium tracking-wide',
    md: 'text-xs px-2.5 py-1 font-semibold tracking-wide',
    lg: 'text-sm px-3 py-1.5 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full uppercase border ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
    >
      {children}
    </span>
  );
}

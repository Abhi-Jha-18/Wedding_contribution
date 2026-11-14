import React from 'react';

export default function Card({
  children,
  className = '',
  hover = false,
  padding = 'md',
  ...props
}) {
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverEffect = hover
    ? 'hover:-translate-y-1 hover:shadow-xl hover:border-gold/30 transition-all duration-300'
    : 'transition-shadow duration-200';

  return (
    <div
      className={`bg-white rounded-2xl border border-navy/5 shadow-sm overflow-hidden ${hoverEffect} ${paddings[padding] || paddings.md} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

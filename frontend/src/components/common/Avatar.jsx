import React from 'react';
import { getInitials } from '../../utils/helpers';

export default function Avatar({
  name = 'User',
  src,
  size = 'md',
  className = '',
}) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover border-2 border-gold/40 shadow-sm ${sizes[size] || sizes.md} ${className}`}
      />
    );
  }

  return (
    <div
      className={`rounded-full bg-navy text-gold font-heading font-bold flex items-center justify-center border-2 border-gold/40 shadow-sm ${sizes[size] || sizes.md} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}

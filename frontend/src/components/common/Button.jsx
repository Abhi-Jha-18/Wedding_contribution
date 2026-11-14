import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none focus:outline-none';

  const variants = {
    primary: 'bg-navy text-white hover:bg-navy/90 active:scale-[0.99] shadow-sm hover:shadow',
    secondary: 'bg-gold text-navy font-semibold hover:bg-[#b8934b] active:scale-[0.99] shadow-sm hover:shadow',
    outline: 'border border-navy/20 text-navy hover:bg-navy hover:text-white active:scale-[0.99]',
    outlineGold: 'border border-gold text-gold hover:bg-gold hover:text-navy active:scale-[0.99]',
    emerald: 'bg-emerald text-white hover:bg-[#0b8561] active:scale-[0.99] shadow-sm hover:shadow',
    ghost: 'text-navy/80 hover:text-navy hover:bg-navy/5',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 active:scale-[0.99]',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${widthStyle} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>Please wait...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
        </>
      )}
    </button>
  );
}

import React from 'react';
import Button from './Button';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white rounded-2xl border border-dashed border-navy/20 ${className}`}
    >
      {Icon && (
        <div className="w-14 h-14 rounded-full bg-ivory flex items-center justify-center text-gold mb-4 shadow-sm border border-gold/20">
          <Icon className="w-7 h-7" />
        </div>
      )}

      {title && (
        <h3 className="font-heading text-lg font-bold text-navy mb-1.5">
          {title}
        </h3>
      )}

      {description && (
        <p className="text-sm text-navy/60 max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}

      {action && (
        <Button
          variant={action.variant || 'primary'}
          onClick={action.onClick}
          icon={action.icon}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

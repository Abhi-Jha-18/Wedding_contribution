import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { calculateProgress } from '../../utils/helpers';

export default function ProgressBar({
  current = 0,
  target = 100,
  showLabel = true,
  showAmount = false,
  size = 'md',
  className = '',
}) {
  const percentage = calculateProgress(current, target);

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || showAmount) && (
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
          {showAmount ? (
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-emerald text-sm">
                {formatCurrency(current)}
              </span>
              <span className="text-navy/50">of {formatCurrency(target)}</span>
            </div>
          ) : (
            <span className="text-navy/70">Progress</span>
          )}

          {showLabel && (
            <span className="font-bold text-navy/90">{percentage}%</span>
          )}
        </div>
      )}

      {/* Progress track */}
      <div
        className={`w-full bg-navy/10 rounded-full overflow-hidden ${sizes[size] || sizes.md}`}
      >
        <div
          className="h-full bg-emerald transition-all duration-500 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

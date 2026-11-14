import React from 'react';
import Card from './Card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className = '',
}) {
  return (
    <Card hover className={`relative overflow-hidden ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider font-semibold text-navy/60 mb-1">
            {title}
          </p>
          <h4 className="text-2xl sm:text-3xl font-bold text-navy tracking-tight font-heading">
            {value}
          </h4>
          {subtitle && (
            <p className="text-xs text-navy/50 mt-1">{subtitle}</p>
          )}

          {trend && (
            <div className="flex items-center gap-1 mt-2 text-xs font-semibold">
              {trend.isPositive ? (
                <span className="text-emerald flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {trend.value}
                </span>
              ) : (
                <span className="text-rose-500 flex items-center">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  {trend.value}
                </span>
              )}
              <span className="text-navy/40 font-normal">vs last week</span>
            </div>
          )}
        </div>

        {Icon && (
          <div className="w-12 h-12 rounded-xl bg-ivory border border-gold/20 flex items-center justify-center text-gold shadow-sm shrink-0">
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {/* Decorative subtle gold bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </Card>
  );
}

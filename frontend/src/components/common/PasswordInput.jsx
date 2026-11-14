import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function PasswordInput({
  label = 'Password',
  name = 'password',
  value,
  onChange,
  onBlur,
  error,
  placeholder = '••••••••',
  required = false,
  className = '',
  helperText,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-xs font-semibold uppercase tracking-wider text-navy/70 mb-1.5"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative rounded-lg">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-navy/40">
          <Lock className="w-4 h-4" />
        </div>

        <input
          id={name}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value ?? ''}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          className={`w-full text-sm bg-white border rounded-lg pl-10 pr-10 py-2.5 transition-all text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-gold/30 ${
            error
              ? 'border-rose-400 focus:border-rose-500 ring-rose-100'
              : 'border-navy/15 focus:border-gold'
          }`}
          {...props}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-navy/40 hover:text-navy transition-colors focus:outline-none"
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {error ? (
        <p className="mt-1.5 text-xs text-rose-500 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-navy/50">{helperText}</p>
      ) : null}
    </div>
  );
}

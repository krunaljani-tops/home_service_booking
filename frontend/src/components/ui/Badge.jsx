import React from 'react';

const variants = {
  primary: 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-700/10',
  secondary: 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-600/10',
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
  warning: 'bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-600/20',
  danger: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/10',
  info: 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-700/10',
  purple: 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-700/10',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs font-medium',
  lg: 'px-3 py-1.5 text-sm font-medium',
};

export const Badge = ({
  children,
  variant = 'secondary',
  size = 'md',
  dot = false,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${variants[variant] || variants.secondary} ${sizes[size]} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            variant === 'success'
              ? 'bg-emerald-500'
              : variant === 'danger'
              ? 'bg-rose-500'
              : variant === 'warning'
              ? 'bg-amber-500'
              : variant === 'primary'
              ? 'bg-indigo-500'
              : 'bg-slate-400'
          }`}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  change,
  trend = 'up',
  changeText = 'vs last month',
  icon: Icon,
  iconColor = 'indigo',
  className = '',
}) => {
  const iconColorStyles = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
    purple: 'bg-purple-50 text-purple-600',
    sky: 'bg-sky-50 text-sky-600',
  };

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${iconColorStyles[iconColor] || iconColorStyles.indigo}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4">
        <h4 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h4>
        {change !== undefined && (
          <div className="mt-2 flex items-center text-xs gap-1.5">
            <span
              className={`inline-flex items-center font-semibold gap-0.5 ${
                trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {trend === 'up' ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {change}
            </span>
            <span className="text-slate-400">{changeText}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;

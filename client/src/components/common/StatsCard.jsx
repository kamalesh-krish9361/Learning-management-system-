import React from 'react';

export const StatsCard = ({ title, value, subtitle, icon: Icon, gradient = 'from-violet-600 to-purple-600', trend }) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-5">
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-md shrink-0`}>
        <Icon className="w-7 h-7" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 truncate">{title}</div>
        <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight my-0.5">{value}</div>
        <div className="flex items-center gap-2">
          {trend && (
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {trend}
            </span>
          )}
          {subtitle && (
            <span className="text-xs text-slate-500 truncate">{subtitle}</span>
          )}
        </div>
      </div>
    </div>
  );
};


import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, color = "blue" }) => {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 transition-all hover:shadow-md">
      <div className={`p-3 rounded-xl ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
          {trend && <span className="text-xs font-semibold text-emerald-500">{trend}</span>}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;

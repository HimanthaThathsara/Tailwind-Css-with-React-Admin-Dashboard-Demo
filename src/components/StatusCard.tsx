import React from 'react';

interface StatusCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  change?: {
    value: number;
    isPositive: boolean;
  };
}

const StatusCard: React.FC<StatusCardProps> = ({ title, value, icon, color, change }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-5 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          
          {change && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${change.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {change.isPositive ? '+' : ''}{change.value}%
              </span>
              <span className="text-gray-500 text-xs ml-1">from last week</span>
            </div>
          )}
        </div>
        
        <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          <div style={{ color }}>{icon}</div>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
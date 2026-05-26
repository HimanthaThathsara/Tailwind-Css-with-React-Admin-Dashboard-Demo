import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { Radio, Battery, Zap, AlertTriangle } from 'lucide-react';
import StatusCard from '../components/StatusCard';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { cellTowers } from '../data/mockData';

const Dashboard: React.FC = () => {
  // Calculate summary statistics
  const onlineTowers = cellTowers.filter(tower => tower.status === 'online').length;
  const offlineTowers = cellTowers.filter(tower => tower.status === 'offline').length;
  const maintenanceTowers = cellTowers.filter(tower => tower.status === 'maintenance').length;
  const avgBatteryLevel = Math.round(cellTowers.reduce((sum, tower) => sum + tower.batteryLevel, 0) / cellTowers.length);
  
  // Prepare data for charts
  const batteryData = cellTowers.map(tower => ({
    name: tower.name,
    batteryLevel: tower.batteryLevel,
    status: tower.status
  }));
  
  const uptimeData = cellTowers.map(tower => ({
    name: tower.name,
    uptime: tower.uptime
  }));

  // Table columns configuration
  const columns = [
    {
      header: 'Tower Name',
      accessor: 'name',
    },
    {
      header: 'Location',
      accessor: 'location',
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value: string) => <StatusBadge status={value as any} />,
    },
    {
      header: 'Battery Level',
      accessor: 'batteryLevel',
      cell: (value: number) => (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${
              value > 70 ? 'bg-green-600' : value > 30 ? 'bg-yellow-400' : 'bg-red-600'
            }`}
            style={{ width: `${value}%` }}
          ></div>
        </div>
      ),
    },
    {
      header: 'Power Consumption',
      accessor: 'powerConsumption',
      cell: (value: number) => `${value} W`,
    },
    {
      header: 'Uptime',
      accessor: 'uptime',
      cell: (value: number) => `${value}%`,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600">Monitor and manage your pc performance usage </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatusCard 
          title="Total Towers" 
          value={cellTowers.length} 
          icon={<Radio size={24} />} 
          color="#3b82f6" 
          change={{ value: 5, isPositive: true }}
        />
        <StatusCard 
          title="Online Towers" 
          value={onlineTowers} 
          icon={<Zap size={24} />} 
          color="#10b981" 
        />
        <StatusCard 
          title="Average Battery" 
          value={`${avgBatteryLevel}%`} 
          icon={<Battery size={24} />} 
          color="#f59e0b" 
          change={{ value: 2, isPositive: true }}
        />
        <StatusCard 
          title="Towers in Alert" 
          value={offlineTowers + maintenanceTowers} 
          icon={<AlertTriangle size={24} />} 
          color="#ef4444" 
          change={{ value: 1, isPositive: false }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Battery Levels</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={batteryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Battery Level (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="batteryLevel" 
                name="Battery Level" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Uptime Percentage</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={uptimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} label={{ value: 'Uptime (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="uptime" 
                name="Uptime" 
                stroke="#10b981" 
                strokeWidth={2} 
                dot={{ r: 4 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Towers Table */}
      <div className="mb-6">
        <DataTable 
          title="Cell Tower Status" 
          columns={columns} 
          data={cellTowers} 
        />
      </div>
    </div>
  );
};

export default Dashboard;
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
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Battery, Thermometer, Activity } from 'lucide-react';
import StatusCard from '../components/StatusCard';
import DataTable from '../components/DataTable';
import { cellTowers, batteryData } from '../data/mockData';

const BatteryMonitoring: React.FC = () => {
  // Calculate summary statistics
  const avgChargeLevel = Math.round(batteryData.reduce((sum, item) => sum + item.chargeLevel, 0) / batteryData.length);
  const avgTemperature = Math.round(batteryData.reduce((sum, item) => sum + item.temperature, 0) / batteryData.length * 10) / 10;
  const avgHealth = Math.round(batteryData.reduce((sum, item) => sum + item.health, 0) / batteryData.length);
  
  // Prepare data for charts
  const chargeLevelData = batteryData.map(item => {
    const tower = cellTowers.find(tower => tower.id === item.towerId);
    return {
      name: tower?.name || `Tower ${item.towerId}`,
      chargeLevel: item.chargeLevel
    };
  });
  
  // Health status distribution for pie chart
  const healthDistribution = [
    { name: 'Good (>80%)', value: batteryData.filter(item => item.health > 80).length },
    { name: 'Fair (60-80%)', value: batteryData.filter(item => item.health >= 60 && item.health <= 80).length },
    { name: 'Poor (<60%)', value: batteryData.filter(item => item.health < 60).length },
  ];
  
  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  // Table columns configuration
  const columns = [
    {
      header: 'Tower Name',
      accessor: 'towerName',
    },
    {
      header: 'Charge Level',
      accessor: 'chargeLevel',
      cell: (value: number) => (
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
            <div 
              className={`h-2.5 rounded-full ${
                value > 70 ? 'bg-green-600' : value > 30 ? 'bg-yellow-400' : 'bg-red-600'
              }`}
              style={{ width: `${value}%` }}
            ></div>
          </div>
          <span>{value}%</span>
        </div>
      ),
    },
    {
      header: 'Temperature',
      accessor: 'temperature',
      cell: (value: number) => (
        <span className={value > 30 ? 'text-red-600' : 'text-gray-900'}>
          {value}°C
        </span>
      ),
    },
    {
      header: 'Health',
      accessor: 'health',
      cell: (value: number) => (
        <span className={
          value > 80 ? 'text-green-600' : 
          value > 60 ? 'text-yellow-600' : 
          'text-red-600'
        }>
          {value}%
        </span>
      ),
    },
    {
      header: 'Cycles',
      accessor: 'cycles',
    },
    {
      header: 'Last Replaced',
      accessor: 'lastReplaced',
      cell: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  // Prepare table data
  const tableData = batteryData.map(item => {
    const tower = cellTowers.find(tower => tower.id === item.towerId);
    return {
      ...item,
      towerName: tower?.name || `Tower ${item.towerId}`
    };
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Battery Monitoring</h1>
        <p className="text-gray-600">Monitor battery health and performance</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatusCard 
          title="Average Charge" 
          value={`${avgChargeLevel}%`} 
          icon={<Battery size={24} />} 
          color="#3b82f6" 
          change={{ value: 2, isPositive: true }}
        />
        <StatusCard 
          title="Average Temperature" 
          value={`${avgTemperature}°C`} 
          icon={<Thermometer size={24} />} 
          color="#ef4444" 
        />
        <StatusCard 
          title="Average Health" 
          value={`${avgHealth}%`} 
          icon={<Activity size={24} />} 
          color="#10b981" 
          change={{ value: 1, isPositive: false }}
        />
        <StatusCard 
          title="Total Cycles" 
          value={batteryData.reduce((sum, item) => sum + item.cycles, 0)} 
          icon={<Battery size={24} />} 
          color="#8b5cf6" 
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Battery Charge Levels</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chargeLevelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} label={{ value: 'Charge Level (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="chargeLevel" 
                name="Charge Level" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Battery Health Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={healthDistribution}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {healthDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Battery Table */}
      <div className="mb-6">
        <DataTable 
          title="Battery Details" 
          columns={columns} 
          data={tableData} 
        />
      </div>
    </div>
  );
};

export default BatteryMonitoring;
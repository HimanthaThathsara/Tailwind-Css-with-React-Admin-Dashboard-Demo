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
import { Zap, AlertTriangle, Clock } from 'lucide-react';
import StatusCard from '../components/StatusCard';
import DataTable from '../components/DataTable';
import { cellTowers, powerSupplyData } from '../data/mockData';

const PowerSupply: React.FC = () => {
  // Calculate summary statistics
  const totalConsumption = powerSupplyData.reduce((sum, item) => sum + item.consumption, 0);
  const avgVoltage = Math.round(powerSupplyData.reduce((sum, item) => sum + item.voltage, 0) / powerSupplyData.length * 10) / 10;
  const anomaliesCount = powerSupplyData.filter(item => item.lastAnomaly !== null).length;
  
  // Prepare data for charts
  const consumptionData = powerSupplyData.map(item => {
    const tower = cellTowers.find(tower => tower.id === item.towerId);
    return {
      name: tower?.name || `Tower ${item.towerId}`,
      consumption: item.consumption
    };
  });
  
  const voltageData = powerSupplyData.map(item => {
    const tower = cellTowers.find(tower => tower.id === item.towerId);
    return {
      name: tower?.name || `Tower ${item.towerId}`,
      voltage: item.voltage
    };
  });

  // Table columns configuration
  const columns = [
    {
      header: 'Tower Name',
      accessor: 'towerName',
    },
    {
      header: 'Power Consumption',
      accessor: 'consumption',
      cell: (value: number) => `${value} W`,
    },
    {
      header: 'Voltage',
      accessor: 'voltage',
      cell: (value: number) => `${value} V`,
    },
    {
      header: 'Current',
      accessor: 'current',
      cell: (value: number) => `${value} A`,
    },
    {
      header: 'Uptime',
      accessor: 'uptime',
      cell: (value: number) => `${Math.floor(value / 24)} days ${value % 24} hrs`,
    },
    {
      header: 'Last Anomaly',
      accessor: 'lastAnomaly',
      cell: (value: string | null) => value ? new Date(value).toLocaleString() : 'None',
    },
  ];

  // Prepare table data
  const tableData = powerSupplyData.map(item => {
    const tower = cellTowers.find(tower => tower.id === item.towerId);
    return {
      ...item,
      towerName: tower?.name || `Tower ${item.towerId}`
    };
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Power Supply Monitoring</h1>
        <p className="text-gray-600">Monitor power consumption and electrical parameters</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatusCard 
          title="Total Consumption" 
          value={`${totalConsumption} W`} 
          icon={<Zap size={24} />} 
          color="#3b82f6" 
          change={{ value: 3, isPositive: false }}
        />
        <StatusCard 
          title="Average Voltage" 
          value={`${avgVoltage} V`} 
          icon={<Zap size={24} />} 
          color="#10b981" 
        />
        <StatusCard 
          title="Power Anomalies" 
          value={anomaliesCount} 
          icon={<AlertTriangle size={24} />} 
          color="#ef4444" 
        />
        <StatusCard 
          title="Avg. Uptime" 
          value={`${Math.round(powerSupplyData.reduce((sum, item) => sum + item.uptime, 0) / powerSupplyData.length)} hrs`} 
          icon={<Clock size={24} />} 
          color="#8b5cf6" 
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Power Consumption</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={consumptionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Consumption (W)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="consumption" 
                name="Power Consumption" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Voltage Levels</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={voltageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[40, 50]} label={{ value: 'Voltage (V)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="voltage" 
                name="Voltage" 
                stroke="#10b981" 
                strokeWidth={2} 
                dot={{ r: 4 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Power Supply Table */}
      <div className="mb-6">
        <DataTable 
          title="Power Supply Details" 
          columns={columns} 
          data={tableData} 
        />
      </div>
    </div>
  );
};

export default PowerSupply;
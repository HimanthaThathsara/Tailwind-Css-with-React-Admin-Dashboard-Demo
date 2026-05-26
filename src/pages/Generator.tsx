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
import { Wind, Droplet, Clock, Calendar } from 'lucide-react';
import StatusCard from '../components/StatusCard';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { cellTowers, generatorData } from '../data/mockData';

const Generator: React.FC = () => {
  // Calculate summary statistics
  const activeGenerators = generatorData.filter(item => item.status === 'active').length;
  const avgFuelLevel = Math.round(generatorData.reduce((sum, item) => sum + item.fuelLevel, 0) / generatorData.length);
  const totalRuntime = generatorData.reduce((sum, item) => sum + item.runtime, 0);
  
  // Prepare data for charts
  const fuelLevelData = generatorData.map(item => {
    const tower = cellTowers.find(tower => tower.id === item.towerId);
    return {
      name: tower?.name || `Tower ${item.towerId}`,
      fuelLevel: item.fuelLevel
    };
  });
  
  // Status distribution for pie chart
  const statusDistribution = [
    { name: 'Active', value: generatorData.filter(item => item.status === 'active').length },
    { name: 'Standby', value: generatorData.filter(item => item.status === 'standby').length },
    { name: 'Maintenance', value: generatorData.filter(item => item.status === 'maintenance').length },
    { name: 'Error', value: generatorData.filter(item => item.status === 'error').length },
  ];
  
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  // Table columns configuration
  const columns = [
    {
      header: 'Tower Name',
      accessor: 'towerName',
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value: string) => <StatusBadge status={value as any} />,
    },
    {
      header: 'Fuel Level',
      accessor: 'fuelLevel',
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
      header: 'Runtime',
      accessor: 'runtime',
      cell: (value: number) => `${value} hrs`,
    },
    {
      header: 'Last Started',
      accessor: 'lastStarted',
      cell: (value: string) => new Date(value).toLocaleString(),
    },
    {
      header: 'Maintenance Due',
      accessor: 'maintenanceDue',
      cell: (value: string) => {
        const dueDate = new Date(value);
        const today = new Date();
        const isDueSoon = (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) < 7;
        
        return (
          <span className={isDueSoon ? 'text-red-600 font-medium' : ''}>
            {dueDate.toLocaleDateString()}
          </span>
        );
      },
    },
  ];

  // Prepare table data
  const tableData = generatorData.map(item => {
    const tower = cellTowers.find(tower => tower.id === item.towerId);
    return {
      ...item,
      towerName: tower?.name || `Tower ${item.towerId}`
    };
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Generator Monitoring</h1>
        <p className="text-gray-600">Monitor backup generators status and performance</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatusCard 
          title="Active Generators" 
          value={activeGenerators} 
          icon={<Wind size={24} />} 
          color="#10b981" 
        />
        <StatusCard 
          title="Average Fuel Level" 
          value={`${avgFuelLevel}%`} 
          icon={<Droplet size={24} />} 
          color="#3b82f6" 
          change={{ value: 5, isPositive: false }}
        />
        <StatusCard 
          title="Total Runtime" 
          value={`${totalRuntime} hrs`} 
          icon={<Clock size={24} />} 
          color="#8b5cf6" 
        />
        <StatusCard 
          title="Maintenance Due" 
          value={generatorData.filter(item => {
            const dueDate = new Date(item.maintenanceDue);
            const today = new Date();
            return (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) < 7;
          }).length} 
          icon={<Calendar size={24} />} 
          color="#ef4444" 
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Fuel Levels</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fuelLevelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} label={{ value: 'Fuel Level (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="fuelLevel" 
                name="Fuel Level" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Generator Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Generator Table */}
      <div className="mb-6">
        <DataTable 
          title="Generator Details" 
          columns={columns} 
          data={tableData} 
        />
      </div>
    </div>
  );
};

export default Generator;
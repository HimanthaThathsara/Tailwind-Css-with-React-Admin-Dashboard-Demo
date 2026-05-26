export interface CellTower {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  batteryLevel: number;
  powerConsumption: number;
  uptime: number;
  lastMaintenance: string;
}

export interface PowerSupplyData {
  id: string;
  towerId: string;
  consumption: number;
  voltage: number;
  current: number;
  uptime: number;
  lastAnomaly: string | null;
}

export interface BatteryData {
  id: string;
  towerId: string;
  chargeLevel: number;
  temperature: number;
  health: number;
  cycles: number;
  lastReplaced: string;
}

export interface GeneratorData {
  id: string;
  towerId: string;
  status: 'active' | 'standby' | 'maintenance' | 'error';
  fuelLevel: number;
  runtime: number;
  lastStarted: string;
  maintenanceDue: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'technician' | 'viewer';
  avatar: string;
  lastLogin: string;
}
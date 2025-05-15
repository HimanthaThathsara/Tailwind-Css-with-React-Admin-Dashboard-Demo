import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import PowerSupply from './pages/PowerSupply';
import BatteryMonitoring from './pages/Battery';
import Generator from './pages/Generator';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/power-supply" element={<PowerSupply />} />
            <Route path="/battery" element={<BatteryMonitoring />} />
            <Route path="/generator" element={<Generator />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
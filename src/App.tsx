import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import {
  BlackCreateWalletButton,
  WalletComponents,
  metaMask
} from './exports';

import logo from '../src/resources/DALL·E 2024-10-20 18.38.38 - A creative logo for the HealthTrove project, incorporating colors from modern healthcare themes like soft blues, greens, and dark grays. The logo shou.webp'

// Import role-specific components (to be created)
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const { address } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const handleDisconnect = () => {
    disconnect();
    console.log('Wallet disconnected');
  };

  const renderLandingPage = () => (
    <div className="container mx-auto p-8">
      <header className="bg-gradient-to-r from-teal-500 to-green-600 text-white py-6 px-4 rounded-lg shadow-lg mb-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 md:mb-0 text-center md:text-left">
            Blockchain-Based Healthcare Management System
          </h1>
          <nav className="flex space-x-6">
            <a href="#about" className="text-lg font-semibold hover:text-green-200 transition-colors duration-300">About</a>
            <a href="#how-it-works" className="text-lg font-semibold hover:text-green-200 transition-colors duration-300">How It Works</a>
            <a href="#faq" className="text-lg font-semibold hover:text-green-200 transition-colors duration-300">FAQ</a>
          </nav>
        </div>
      </header>

      <main>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="border p-4 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-2 text-gray-800">Patient</h2>
            <p className="text-gray-600 mb-4">Schedule appointments and manage your health records.</p>
            <Link to="/patient" className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Go to Patient Dashboard
            </Link>
          </div>
          <div className="border p-4 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-2 text-gray-800">Doctor</h2>
            <p className="text-gray-600 mb-4">Manage appointments and update health records.</p>
            <Link to="/doctor" className="mt-4 inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Go to Doctor Dashboard
            </Link>
          </div>
          <div className="border p-4 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-2 text-gray-800">Admin</h2>
            <p className="text-gray-600 mb-4">Register doctors, manage system roles.</p>
            <Link to="/admin" className="mt-4 inline-block bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
              Go to Admin Dashboard
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center text-center my-8">
          <BlackCreateWalletButton />
          <button
            onClick={() => connect({ connector: metaMask() })}
            className="ml-4 pb-3 bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Use MetaMask
          </button>
        </div>
      </main>

      <footer className="mt-8 text-center text-sm text-gray-600">
        <p>Contact: support@healthcare-blockchain.com</p>
        <p>
          <a href="#privacy" className="mr-4">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
        </p>
      </footer>
    </div>
  );

  return (
    <Router>
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-center px-[100px] pt-[30px]">
          <div className="mb-4 sm:mb-0">
            <img src={logo} alt="Logo" className="h-8 sm:h-10 w-auto rounded-md" />
          </div>
          <div className="flex flex-col sm:flex-row items-center">
            <WalletComponents />
            {address && (
              <button
                onClick={handleDisconnect}
                className="mt-2 sm:mt-0 sm:ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm"
              >
                Disconnect Wallet
              </button>
            )}
          </div>
        </div>
        <Routes>
          <Route
            path="/"
            element={address ? renderLandingPage() : renderLandingPage()}
          />
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

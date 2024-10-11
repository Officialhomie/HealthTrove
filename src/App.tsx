// import { useAccount, useConnect, useDisconnect } from 'wagmi';
// import {
//   RegisterPatients, AddDoctors, AddHealthRecord, DeactivateRecord, UpdateHealthRecord,
//   GrantRole, RevokeRole, GiveConsent, RevokeConsent,
//   DoctorRegisteredListener, GetAllDoctors, GetAllPatients,
//   GetHealthRecord, HasPatientConsent,
//   GetRegisteredDoctor, GetRegisteredPatient, GetPatientRecords,
//   CancelAppointment, ScheduleAppointment, UpdateAppointment,
//   AppointmentCancelledListener, AppointmentUpdatedListener, AppointmentScheduledListener,
//   AdminRole, DoctorsRole, PatientRole,
//   BlackCreateWalletButton,
//   WalletComponents,
//   PatientRegisteredListener,
//   metaMask
// } from './exports';

// function App() {
//   const { address } = useAccount();
//   const { connect } = useConnect();
//   const { disconnect } = useDisconnect();

//   const handleDisconnect = () => {
//     disconnect();
//     console.log('Wallet disconnected');
//   }

//   return (
//     <div className="container mx-auto p-4">
//         <div className="flex items-center justify-end space-x-4 mb-4">
//           {/* create wallet button */}
//           <BlackCreateWalletButton />
          
//           {/* connect metamask button */}
//           <button
//             onClick={() => {
//               if (address) {
//                 handleDisconnect();
//               } else {
//                 connect({ connector: metaMask() });
//               }
//             }}
//             className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold text-lg py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
//           >
//             {address ? 'Disconnect Wallet' : 'Connect Metamask'}
//           </button>
          
//           {/* wallet components */}
//           <WalletComponents />
//         </div>

//       <div className="container mx-auto p-8 bg-gray-100 rounded-lg shadow-lg">
//         {/* Admin Controls */}
//         <div className="mb-12">
//           <h2 className="text-3xl font-extrabold mb-6 text-indigo-700 border-b-4 border-indigo-500 pb-2">Admin Controls</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             <RegisterPatients />
//             <AddDoctors />
//             <GrantRole />
//             <RevokeRole />
//           </div>
//         </div>

//         {/* Doctor and Patient Management */}
//         <div className="mb-12">
//           <h2 className="text-3xl font-extrabold mb-6 text-indigo-700 border-b-4 border-indigo-500 pb-2">Doctor and Patient Management</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             <GetAllDoctors />
//             <GetAllPatients />
//             <GetRegisteredDoctor />
//             <GetRegisteredPatient />
//           </div>
//         </div>

//         {/* Appointment Scheduling */}
//         <div className="mb-12">
//           <h2 className="text-3xl font-extrabold mb-6 text-indigo-700 border-b-4 border-indigo-500 pb-2">Appointment Scheduling</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             <ScheduleAppointment />
//             <UpdateAppointment />
//             <CancelAppointment />
//           </div>
//         </div>

//         {/* Appointment Events */}
//         <div className="mb-12">
//           <h2 className="text-3xl font-extrabold mb-6 text-indigo-700 border-b-4 border-indigo-500 pb-2">Appointment Events</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             <AppointmentScheduledListener />
//             <AppointmentUpdatedListener />
//             <AppointmentCancelledListener />
//           </div>
//         </div>

//         {/* Healthcare Records Management */}
//         <div className="mb-12">
//           <h2 className="text-3xl font-extrabold mb-6 text-indigo-700 border-b-4 border-indigo-500 pb-2">Healthcare Records Management</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             <AddHealthRecord />
//             <UpdateHealthRecord />
//             <DeactivateRecord />
//             <GetHealthRecord />
//             <GetPatientRecords />
//           </div>
//         </div>

//         {/* Consent Management */}
//         <div className="mb-12">
//           <h2 className="text-3xl font-extrabold mb-6 text-indigo-700 border-b-4 border-indigo-500 pb-2">Consent Management</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             <GiveConsent />
//             <RevokeConsent />
//             <HasPatientConsent />
//           </div>
//         </div>

//         {/* Event Listeners */}
//         <div className="mb-12">
//           <h2 className="text-3xl font-extrabold mb-6 text-indigo-700 border-b-4 border-indigo-500 pb-2">Event Listeners</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             <DoctorRegisteredListener />
//             <PatientRegisteredListener />
//           </div>
//         </div>

//         {/* Role Management */}
//         <div className="mb-12">
//           <h2 className="text-3xl font-extrabold mb-6 text-indigo-700 border-b-4 border-indigo-500 pb-2">Role Management</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             <AdminRole />
//             <DoctorsRole />
//             <PatientRole />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default App


import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import {
  BlackCreateWalletButton,
  WalletComponents,
  metaMask
} from './exports';

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

        <div className="text-center">
          <BlackCreateWalletButton />
          <button
            onClick={() => connect({ connector: metaMask() })}
            className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
        <div className="flex justify-end p-4">
          <WalletComponents />
          {address && (
            <button
              onClick={handleDisconnect}
              className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Disconnect Wallet
            </button>
          )}
        </div>
        <Routes>
          <Route path="/" element={address ? renderLandingPage() : renderLandingPage()} />
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

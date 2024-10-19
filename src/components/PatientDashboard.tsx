// import React, { useState } from 'react';
// import { Appointments, CancelAppointment, CheckTakenSlots, GetAllDoctors, GiveConsent, IsPatient, RegisterPatients, ScheduleAppointment, UpdateAppointment } from '../exports';
// import { useNavigate } from 'react-router-dom';
// import GetDoctorInfo from '../HRCReadfunctions/GetDoctorInfo';

// const PatientDashboard: React.FC = () => {
//   const [showDoctors, setShowDoctors] = useState(false);
//   const navigate = useNavigate();

//   return (
//     <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-10 px-4">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">
//           Patient Dashboard
//         </h1>

//         <RegisterPatients />

//         <IsPatient />
       
//         <div className="bg-gray-100 dark:bg-gray-900 my-10 p-10">
//           <h1 className="text-2xl font-bold mb-4">Want to see a list of Available doctors?</h1>

//           <button 
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//             onClick={() => setShowDoctors(!showDoctors)}
//           >
//             {showDoctors ? 'Hide Doctors' : 'See Doctors'}
//           </button>

//           {showDoctors && <GetAllDoctors />}
//         </div>

//         <button 
//           className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//           onClick={() => navigate('/')}
//         >
//           Go Back to Home
//         </button>



//         <div className='flex flex-col gap-8'>
//           {/* Schedule Appointment Section */}
//           <div className="lg:col-span-2">
//             <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
//               <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
//                 Book an Appointment
//               </h2>
//               <ScheduleAppointment />
//               <UpdateAppointment />
//               <CancelAppointment />
//             </div>
//           </div>

//           {/* Check Taken Slots Section */}
//           <div>
//             <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
//               <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
//                 Check Available Slots
//               </h2>
//               <CheckTakenSlots />
//             </div>
//           </div>
//         </div>

//         {/* Appointments List Section */}
//         <div className="mt-12">
//           <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg items-start">
//             <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
//               My Appointments
//             </h2>
//             <Appointments />
//           </div>
//         </div>


//         <div className="container mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
//           <h2 className="text-4xl font-black mt-[100px] mb-[50px] text-center text-gray-800 dark:text-white">Manage Your Privacy</h2>

//           <div className=" border-b-4 border-b-black py-[20px]">
//               <div className="flex flex-col lg:flex-row justify-between flex-wrap mb-8">
//                   <div className="flex-1 min-w-[250px] mb-4 lg:mb-0 lg:mr-4">
//                       <GiveConsent />
//                   </div>
//                   <div className="flex-1 min-w-[250px]">
//                       <GetDoctorInfo />
//                   </div>
//               </div>
              
//               <div className="w-full">
//                   <GetAllDoctors />
//               </div>
//           </div>

//         </div>

//       </div>

//       <button 
//           className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//           onClick={() => navigate('/')}
//         >
//           Go Back to Home
//         </button>
//       <footer className="bg-gray-200 dark:bg-gray-800 mt-10 py-6">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="flex flex-col lg:flex-row justify-between items-center">
//             {/* Copyright Section */}
//             <div className="text-center lg:text-left mb-4 lg:mb-0">
//               <p className="text-gray-700 dark:text-gray-300">
//                 &copy; {new Date().getFullYear()} Healthcare On-chain. All rights reserved.
//               </p>
//             </div>

//             {/* Navigation Links */}
//             <div className="flex space-x-4 mb-4 lg:mb-0">
//               <a href="/about" className="text-gray-700 dark:text-gray-300 hover:underline">
//                 About
//               </a>
//               <a href="/contact" className="text-gray-700 dark:text-gray-300 hover:underline">
//                 Contact
//               </a>
//               <a href="/privacy" className="text-gray-700 dark:text-gray-300 hover:underline">
//                 Privacy Policy
//               </a>
//             </div>

//             {/* Social Media Icons */}
//             <div className="flex space-x-4">
//               <a
//                 href="https://twitter.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
//               >
//                 <i className="fab fa-twitter"></i>
//               </a>
//               <a
//                 href="https://facebook.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-gray-700 dark:text-gray-300 hover:text-blue-600"
//               >
//                 <i className="fab fa-facebook"></i>
//               </a>
//               <a
//                 href="https://linkedin.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-gray-700 dark:text-gray-300 hover:text-blue-700"
//               >
//                 <i className="fab fa-linkedin"></i>
//               </a>
//             </div>
//           </div>
//         </div>
//       </footer>

//     </div>
//   );
// };

// export default PatientDashboard;

import React, { useState } from 'react';
import { Appointments, CancelAppointment, CheckTakenSlots, GetAllDoctors, GiveConsent, IsPatient, RegisterPatients, ScheduleAppointment, UpdateAppointment } from '../exports';
import { useNavigate } from 'react-router-dom';
import GetDoctorInfo from '../HRCReadfunctions/GetDoctorInfo';

const PatientDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  // const [showDoctors, setShowDoctors] = useState(false);
  const navigate = useNavigate();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'appointments':
        return (
          <div className="space-y-8">
            <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                Book an Appointment
              </h2>
              <ScheduleAppointment />
              <UpdateAppointment />
              <CancelAppointment />
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                Check Available Slots
              </h2>
              <CheckTakenSlots />
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                My Appointments
              </h2>
              <Appointments />
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Manage Your Privacy</h2>
            <div className="flex flex-col lg:flex-row justify-between flex-wrap mb-8">
              <div className="flex-1 min-w-[250px] mb-4 lg:mb-0 lg:mr-4">
                <GiveConsent />
              </div>
              <div className="flex-1 min-w-[250px]">
                <GetDoctorInfo />
              </div>
            </div>
            <div className="w-full mt-8">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Available Doctors</h3>
              <GetAllDoctors />
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-8">
            <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                Your Profile
              </h2>
              <RegisterPatients />
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                Patient Status
              </h2>
              <IsPatient />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">
          Patient Dashboard
        </h1>

        <div className="flex justify-center mb-8">
          <button
            className={`px-4 py-2 mx-2 rounded-t-lg ${activeTab === 'profile' ? 'bg-white dark:bg-gray-800 text-blue-600' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>

          <button
            className={`px-4 py-2 mx-2 rounded-t-lg ${activeTab === 'appointments' ? 'bg-white dark:bg-gray-800 text-blue-600' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}
            onClick={() => setActiveTab('appointments')}
          >
            Appointments
          </button>
          
          <button
            className={`px-4 py-2 mx-2 rounded-t-lg ${activeTab === 'privacy' ? 'bg-white dark:bg-gray-800 text-blue-600' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}
            onClick={() => setActiveTab('privacy')}
          >
            Privacy
          </button>
        </div>

        {renderTabContent()}

        <button 
          className="mt-8 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => navigate('/')}
        >
          Go Back to Home
        </button>
      </div>

      <footer className="bg-gray-200 dark:bg-gray-800 mt-10 py-6">
        {/* Footer content remains the same */}
      </footer>
    </div>
  );
};

export default PatientDashboard;

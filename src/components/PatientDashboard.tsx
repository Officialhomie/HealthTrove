import React, { useState } from 'react';
import {
  Appointments,
  CancelAppointment,
  CheckTakenSlots,
  GetAllDoctors,
  GetPatientAppointments,
  GiveConsent,
  IsPatient,
  RegisterPatients,
  RevokeConsent,
  ScheduleAppointment
} from '../exports';
import { useNavigate } from 'react-router-dom';
import GetDoctorInfo from '../HRCReadfunctions/GetDoctorInfo';
import FundAccount from './Fund';
import Footer from '../components/Footer';

const PatientDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'appointments':
        return (
          <div className="space-y-8">
            <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Book an Appointment
              </h2>
              <ScheduleAppointment />
              <CancelAppointment />
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Check Available Slots
              </h2>
              <CheckTakenSlots />
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4">
                My Appointments
              </h2>
              <GetPatientAppointments />
              <Appointments />
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg space-y-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Manage Your Privacy
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex justify-center">
                <GiveConsent />
              </div>
              <div className="flex justify-center">
                <RevokeConsent />
              </div>
            </div>
            <div className="w-full">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-4">
                Check Doctor's Info
              </h3>
              <GetDoctorInfo />
            </div>
            <div className="w-full">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-4">
                Available Doctors
              </h3>
              <GetAllDoctors />
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-8">
            <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Your Profile
              </h2>
              <RegisterPatients />
              <FundAccount />
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4">
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
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">
          Patient Dashboard
        </h1>

        <div className="flex justify-center mb-8 flex-wrap">
          <button
            className={`px-3 py-2 mx-2 mb-2 rounded-t-lg ${activeTab === 'profile' ? 'bg-white dark:bg-gray-800 text-blue-600' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>

          <button
            className={`px-3 py-2 mx-2 mb-2 rounded-t-lg ${activeTab === 'appointments' ? 'bg-white dark:bg-gray-800 text-blue-600' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}
            onClick={() => setActiveTab('appointments')}
          >
            Appointments
          </button>

          <button
            className={`px-3 py-2 mx-2 mb-2 rounded-t-lg ${activeTab === 'privacy' ? 'bg-white dark:bg-gray-800 text-blue-600' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}
            onClick={() => setActiveTab('privacy')}
          >
            Privacy
          </button>
        </div>

        {renderTabContent()}

        <div className="flex justify-center mt-8">
          <button 
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
            onClick={() => navigate('/')}
          >
            Go Back to Home
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PatientDashboard;

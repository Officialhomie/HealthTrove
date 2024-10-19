

import React, { useState } from 'react';
import { Appointments, CancelAppointment, CheckTakenSlots, GetAllDoctors, GiveConsent, IsPatient, RegisterPatients, RevokeConsent, ScheduleAppointment, UpdateAppointment } from '../exports';
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex justify-center mb-4">
                  <GiveConsent />
              </div>
              <div className="flex justify-center">
                  <RevokeConsent />
              </div>
          </div>

            <div className="w-full mt-8">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Check Doctor's Info</h3>
                <GetDoctorInfo />
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

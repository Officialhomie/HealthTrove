

import React, { useState } from 'react';
import { Appointments, CancelAppointment, CheckTakenSlots, GetAllDoctors, GetPatientAppointments, GiveConsent, IsPatient, RegisterPatients, RevokeConsent, ScheduleAppointment } from '../exports';
import { useNavigate } from 'react-router-dom';
import GetDoctorInfo from '../HRCReadfunctions/GetDoctorInfo';
import FundAccount from './Fund';
import Footer from '../components/Footer';

const PatientDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
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
              <GetPatientAppointments />
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
              <FundAccount />
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
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen pt-10">
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

      {/* <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-semibold text-white">HealthTrove</h3>
            <p className="mt-2 text-sm text-gray-400">
                Your go-to on-chain patient management and healthcare scheduling system.
            </p>
          </div>
          <div className="mb-6 md:mb-0">
            <h4 className="font-semibold text-sm uppercase mb-2 text-white">Quick Links</h4>
            <ul>
                <li>
                  <a href="#" className="text-gray-400 hover:text-gray-200 text-sm">About Us</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-gray-200 text-sm">Privacy Policy</a>
                </li>
                <li>
                   <a href="#" className="text-gray-400 hover:text-gray-200 text-sm">Terms of Service</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-gray-200 text-sm">Contact Us</a>
                </li>
            </ul>
          </div>
          <div className="mb-6 md:mb-0">
              <h4 className="font-semibold text-sm uppercase mb-2 text-white">Contact</h4>
              <p className="text-sm text-gray-400">
                  Email: <a href="mailto:support@healthtrove.com" className="hover:text-gray-200">support@healthtrove.com</a>
              </p>
              <p className="text-sm text-gray-400">Phone: +1 (234) 567-8900</p>
              <p className="text-sm text-gray-400">Address: 123 Healthcare Lane, Wellness City</p>
          </div>
          <div>
              <h4 className="font-semibold text-sm uppercase mb-2 text-white">Follow Us</h4>
              <div className="flex space-x-4">
                  <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-gray-200">
                      <i className="fab fa-facebook fa-lg"></i>
                  </a>
                  <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-gray-200">
                      <i className="fab fa-twitter fa-lg"></i>
                  </a>
                  <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-gray-200">
                      <i className="fab fa-linkedin fa-lg"></i>
                  </a>
                  <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-gray-200">
                      <i className="fab fa-instagram fa-lg"></i>
                  </a>
              </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-6 text-center">
            <p className="text-sm text-gray-500">
                &copy; 2024 HealthTrove. All rights reserved.
            </p>
        </div>
      </footer> */}
      <Footer />
    </div>
  );
};

export default PatientDashboard;

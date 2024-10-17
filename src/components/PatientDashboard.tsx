import React, { useState } from 'react';
import { Appointments, CheckTakenSlots, GetAllDoctors, IsPatient, RegisterPatients, ScheduleAppointment } from '../exports';
import { useNavigate } from 'react-router-dom';

const PatientDashboard: React.FC = () => {
  const [showDoctors, setShowDoctors] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">
          Patient Dashboard
        </h1>

        <RegisterPatients />

        <IsPatient />
       
        <div className="bg-gray-100 dark:bg-gray-900 my-10 p-10">
          <h1 className="text-2xl font-bold mb-4">Want to see a list of Available doctors?</h1>

          <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setShowDoctors(!showDoctors)}
          >
            {showDoctors ? 'Hide Doctors' : 'See Doctors'}
          </button>

          {showDoctors && <GetAllDoctors />}
        </div>

        <button 
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => navigate('/')}
        >
          Go Back to Home
        </button>

        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> */}
        <div className='flex flex-col gap-8'>
          {/* Schedule Appointment Section */}
          <div className="lg:col-span-2">
            <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                Book an Appointment
              </h2>
              <ScheduleAppointment />
            </div>
          </div>

          {/* Check Taken Slots Section */}
          <div>
            <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                Check Available Slots
              </h2>
              <CheckTakenSlots />
            </div>
          </div>
        </div>

        {/* Appointments List Section */}
        <div className="mt-12">
          <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg items-start">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              My Appointments
            </h2>
            <Appointments />
          </div>
        </div>
      </div>
      <footer className="bg-gray-200 dark:bg-gray-800 mt-10 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            {/* Copyright Section */}
            <div className="text-center lg:text-left mb-4 lg:mb-0">
              <p className="text-gray-700 dark:text-gray-300">
                &copy; {new Date().getFullYear()} Healthcare On-chain. All rights reserved.
              </p>
            </div>

            {/* Navigation Links */}
            <div className="flex space-x-4 mb-4 lg:mb-0">
              <a href="/about" className="text-gray-700 dark:text-gray-300 hover:underline">
                About
              </a>
              <a href="/contact" className="text-gray-700 dark:text-gray-300 hover:underline">
                Contact
              </a>
              <a href="/privacy" className="text-gray-700 dark:text-gray-300 hover:underline">
                Privacy Policy
              </a>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600"
              >
                <i className="fab fa-facebook"></i>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-700"
              >
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default PatientDashboard;

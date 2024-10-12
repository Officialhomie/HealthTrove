import React, { useState } from 'react';
import { Appointments, CheckTakenSlots, GetAllDoctors, IsPatient, RegisterPatients, ScheduleAppointment } from '../exports';

const PatientDashboard: React.FC = () => {
  const [showDoctors, setShowDoctors] = useState(false);

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


        {/* <GetAllDoctors /> */}







        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
          <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              My Appointments
            </h2>
            <Appointments />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;

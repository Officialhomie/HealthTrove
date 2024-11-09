import { ReactNode, useEffect, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { contractHRC } from '../contracts';
import { AddDoctors, DoctorRegisteredListener, GetAllActiveRecords, GetAllDoctors, GetAllPatients, GetAllRecordIds } from '../exports';
import ApprovePatientRegistration from '../HRCWritefunctions/ApprovePatientRegistration';
import GetDoctorInfo from '../HRCReadfunctions/GetDoctorInfo';
import Footer from './Footer';
import RegistrationRequestsListener from '@/HRCevents/RegistrationRequestListener';
import RegisteredPatientsListener from '@/HRCevents/RegisteredPatientListener';
import RegistrationFeeListener from '@/HRCevents/RegistrationFeeListener';
import PauseContract from '@/HRCWritefunctions/PauseContract';
import UnpauseContract from '@/HRCWritefunctions/UnpauseContract';
import PausedEventListener from '@/HRCevents/PauseListener';
import UnpausedEventListener from '@/HRCevents/UnpauseListener';
import DoctorRemovedListener from '@/HRCevents/DoctorRemovedListener';

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

interface EventCardProps {
  title: string;
  children: ReactNode;
}

const AdminDashboard = () => {
  const { address } = useAccount();
  const [walletAddress, setWalletAddress] = useState('');
  const [activeSection, setActiveSection] = useState('management');
  const navigate = useNavigate();

  useEffect(() => {
    if (address) {
      setWalletAddress(address);
    }
  }, [address]);

  const handleGoHome = () => {
    navigate('/');
  };

  // Authentication checks...
  if (!address) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 lg:mb-8 text-center text-gray-800 dark:text-white">
          Wallet Not Connected
        </h1>
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-md shadow-md">
          <p className="text-xl sm:text-2xl text-yellow-600 dark:text-yellow-500 font-semibold text-center mb-4">
            Connect your wallet to access the admin dashboard.
          </p>
        </div>
        {renderNavigationButtons()}
      </div>
    );
  }

  const { data: adminRole, isError: adminRoleError, isLoading: adminRoleLoading } = useReadContract({
    ...contractHRC,
    functionName: 'ADMIN_ROLE',
    address: contractHRC.address as `0x${string}`,
  });

  const { data: isAdmin, isError: isAdminError, isLoading: isAdminLoading } = useReadContract({
    ...contractHRC,
    functionName: 'hasRole',
    args: [adminRole, walletAddress],
    address: contractHRC.address as `0x${string}`,
  });

  if (adminRoleLoading || isAdminLoading) {
    return <div className="text-center p-4 sm:p-8">Loading...</div>;
  }

  if (adminRoleError || isAdminError) {
    return <div className="text-center p-4 sm:p-8 text-red-600">Error checking admin role. Please try again later.</div>;
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 lg:mb-8 text-center text-gray-800 dark:text-white">
          Access Denied
        </h1>
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-md shadow-md">
          <p className="text-xl sm:text-2xl text-red-600 font-semibold text-center mb-4">
            You do not have access to this page.
          </p>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 text-center">
            You can explore other features on our app.
          </p>
        </div>
        {renderNavigationButtons()}
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen pt-4 sm:pt-6 lg:pt-10">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-800 dark:text-white mb-4 sm:mb-6 lg:mb-8">
          Admin Dashboard
        </h1>

        {/* Navigation Tabs */}
        {/* <div className="flex justify-center mb-4 sm:mb-6 lg:mb-8 overflow-x-auto">
          <div className="flex flex-col sm:flex-row rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-1 w-full sm:w-auto">
            <TabButton
              active={activeSection === 'management'}
              onClick={() => setActiveSection('management')}
              label="User Management"
            />
            <TabButton
              active={activeSection === 'overview'}
              onClick={() => setActiveSection('overview')}
              label="User Overview"
            />
            <TabButton
              active={activeSection === 'records'}
              onClick={() => setActiveSection('records')}
              label="Records"
            />
            <TabButton
              active={activeSection === 'events'}
              onClick={() => setActiveSection('events')}
              label="Events"
            />
            <TabButton
              active={activeSection === 'contract'}
              onClick={() => setActiveSection('contract')}
              label="Contract Controls"
            />
          </div>
        </div> */}

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-4 sm:mb-6 lg:mb-8 overflow-x-auto px-2">
          <div className="flex flex-col sm:flex-row rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg w-full sm:w-auto">
            <TabButton
              active={activeSection === 'management'}
              onClick={() => setActiveSection('management')}
              label="User Management"
            />
            <TabButton
              active={activeSection === 'overview'}
              onClick={() => setActiveSection('overview')}
              label="User Overview"
            />
            <TabButton
              active={activeSection === 'records'}
              onClick={() => setActiveSection('records')}
              label="Records"
            />
            <TabButton
              active={activeSection === 'events'}
              onClick={() => setActiveSection('events')}
              label="Events"
            />
            <TabButton
              active={activeSection === 'contract'}
              onClick={() => setActiveSection('contract')}
              label="Contract Controls"
            />
          </div>
        </div>


        {/* Content Sections */}
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 lg:p-6 rounded-lg shadow-lg mb-4 sm:mb-6 lg:mb-8">
          {activeSection === 'management' && (
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">
                User Management
              </h2>
              <div className="overflow-x-auto">
                <ApprovePatientRegistration />
              </div>
              <div className="mt-4 sm:mt-6 lg:mt-8 overflow-x-auto">
                <AddDoctors />
              </div>
            </div>
          )}

          {activeSection === 'overview' && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">
                User Overview
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                <div className="overflow-x-auto">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">
                    Patients
                  </h3>
                  <GetAllPatients />
                </div>
                <div className="overflow-x-auto">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">
                    Doctors
                  </h3>
                  <GetAllDoctors />
                </div>
              </div>
              <div className="mt-4 sm:mt-6 lg:mt-8 overflow-x-auto">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">
                  Doctor Details
                </h3>
                <GetDoctorInfo />
              </div>
            </div>
          )}

          {activeSection === 'records' && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">
                Records Management
              </h2>
              <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                <div className="overflow-x-auto">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">
                    Active Records
                  </h3>
                  <GetAllActiveRecords />
                </div>
                <div className="overflow-x-auto">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">
                    Record IDs
                  </h3>
                  <GetAllRecordIds />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'events' && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">
                Event Listeners
              </h2>
              <div className="space-y-6">
                <EventCard title="Registration Requests">
                  <RegistrationRequestsListener />
                </EventCard>
                <EventCard title="Registered Patients">
                  <RegisteredPatientsListener />
                </EventCard>
                <EventCard title="Registration Fees">
                  <RegistrationFeeListener />
                </EventCard>
                <EventCard title="Doctor Registered">
                  <DoctorRegisteredListener />
                </EventCard>
                <EventCard title="Doctor Removed">
                  <DoctorRemovedListener />
                </EventCard>
                <EventCard title="Registration Fees">
                  <RegistrationFeeListener />
                </EventCard>
                <EventCard title="Pause Listener">
                  <PausedEventListener />
                </EventCard>
                <EventCard title="Unpause Listener">
                  <UnpausedEventListener />
                </EventCard>
              </div>
            </div>
          )}

          {activeSection === 'contract' && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">
                Contract Controls
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Pause Contract</h3>
                  <PauseContract />
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Unpause Contract</h3>
                  <UnpauseContract />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center mb-4 sm:mb-6 lg:mb-8">
          <button
            onClick={handleGoHome}
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Back to Home Page
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );

  function renderNavigationButtons() {
    return (
      <div className="mt-4 sm:mt-6 lg:mt-8 text-center">
        <button
          onClick={handleGoHome}
          className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Go to Home Page
        </button>
      </div>
    );
  }
};

// Reusable components
// Component definitions
const TabButton: React.FC<TabButtonProps> = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`flex-1 text-sm font-medium py-2 sm:py-3 px-4 
      ${active ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}
      hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors rounded-md sm:rounded-none sm:first:rounded-l-lg sm:last:rounded-r-lg
      focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-gray-600`}
  >
    {label}
  </button>
);

const EventCard: React.FC<EventCardProps> = ({ title, children }) => (
  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
    <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">
      {title}
    </h3>
    {children}
  </div>
);

export default AdminDashboard;

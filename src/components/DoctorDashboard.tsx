import { useEffect, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { contractHRC } from '../contracts';
import { 
  AddHealthRecord, 
  DeactivateRecord, 
  GetAllPatients, 
  GetAllDoctors, 
  UpdateHealthRecord, 
  GetAllActiveRecords, 
  UpdateAppointment 
} from '../exports';
import IPFSRetrieve from './IPFSRetrieve';
import Footer from './Footer';

const DoctorDashboard = () => {
  const { address } = useAccount();
  const [walletAddress, setWalletAddress] = useState('');
  const [hasRole, setHasRole] = useState<null | {}>(null);
  const [activeSection, setActiveSection] = useState('records');
  const navigate = useNavigate();

  useEffect(() => {
    if (address) {
      setWalletAddress(address);
    }
  }, [address]);

  const { data: doctorRole, isError: isRoleError, isLoading: isRoleLoading } = useReadContract({
    ...contractHRC,
    functionName: 'DOCTOR_ROLE',
    address: contractHRC.address as `0x${string}`,
  });

  const { data: isDoctor, isError: isCheckError, isLoading: isCheckLoading } = useReadContract({
    ...contractHRC,
    functionName: 'hasRole',
    args: [doctorRole, walletAddress],
    address: contractHRC.address as `0x${string}`,
  });

  useEffect(() => {
    if (isDoctor !== undefined) {
      setHasRole(isDoctor);
    }
  }, [isDoctor]);

  const handleGoBack = () => {
    navigate('/');
  };

  if (!address) {
    return (
      <div className="container mx-auto p-4 sm:p-8 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg">
        <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-8 text-center text-gray-800 dark:text-white">
          Wallet Not Connected
        </h1>
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-md shadow-md">
          <p className="text-lg sm:text-2xl text-yellow-600 dark:text-yellow-500 font-semibold text-center mb-2 sm:mb-4">
            Please connect your wallet to access the doctor dashboard.
          </p>
        </div>
        <div className="mt-4 sm:mt-8 text-center">
          <button onClick={handleGoBack} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
            Go to Home Page
          </button>
        </div>
      </div>
    );
  }

  if (isRoleLoading || isCheckLoading) {
    return <div className="text-center p-4 sm:p-8 text-gray-800 dark:text-white">Loading...</div>;
  }

  if (isRoleError || isCheckError) {
    return <div className="text-center p-4 sm:p-8 text-red-600">Error checking doctor role. Please try again later.</div>;
  }

  if (!hasRole) {
    return (
      <div className="container mx-auto p-4 sm:p-8 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg">
        <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-8 text-center text-gray-800 dark:text-white">
          Access Denied
        </h1>
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-md shadow-md">
          <p className="text-lg sm:text-2xl text-red-600 font-semibold text-center mb-2 sm:mb-4">
            You do not have access to this page.
          </p>
          <p className="text-sm sm:text-lg text-gray-700 dark:text-gray-300 text-center">
            Please make sure you have the Doctor role or contact the admin.
          </p>
        </div>
        <div className="mt-4 sm:mt-8 text-center">
          <button onClick={handleGoBack} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
            Go to Home Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen pt-6 sm:pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-center text-gray-800 dark:text-white mb-6 sm:mb-8">
          Doctor Dashboard
        </h1>
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="inline-flex flex-wrap rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-1">
            {['records', 'users', 'appointments'].map(section => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-4 py-2 rounded-md text-sm sm:text-base ${
                  activeSection === section
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg mb-6 sm:mb-8">
          {activeSection === 'records' && (
            <div className="space-y-4 sm:space-y-8">
              <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 text-gray-800 dark:text-white">
                Health Records Management
              </h2>
              <AddHealthRecord />
              <GetAllActiveRecords />
              <UpdateHealthRecord />
              <DeactivateRecord />
              <IPFSRetrieve />
            </div>
          )}

          {activeSection === 'users' && (
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 text-gray-800 dark:text-white">
                User Management
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-gray-800 dark:text-white">
                    Patients
                  </h3>
                  <GetAllPatients />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-gray-800 dark:text-white">
                    Doctors
                  </h3>
                  <GetAllDoctors />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'appointments' && (
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 text-gray-800 dark:text-white">
                Appointment Management
              </h2>
              <UpdateAppointment />
            </div>
          )}
        </div>

        <div className="flex justify-center mb-4 sm:mb-8">
          <button
            onClick={handleGoBack}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Back to Home Page
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DoctorDashboard;

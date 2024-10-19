import { useEffect, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { contractHRC } from '../contracts';
import { AddHealthRecord, DeactivateRecord, GetAllPatients, GetAllDoctors, UpdateHealthRecord, GetAllActiveRecords } from '../exports';
import IPFSRetrieve from './IPFSRetrieve';

const DoctorDashboard = () => {
  const { address } = useAccount();
  const [walletAddress, setWalletAddress] = useState('');
  const [hasRole, setHasRole] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (address) {
      setWalletAddress(address);
    }
  }, [address]);

  // Fetch the DOCTOR_ROLE constant from the contract
  const { data: doctorRole, isError: isRoleError, isLoading: isRoleLoading } = useReadContract({
    ...contractHRC,
    functionName: 'DOCTOR_ROLE',
    address: contractHRC.address as `0x${string}`,
  });

  // Check if the given wallet address has the DOCTOR_ROLE
  const { data: isDoctor, isError: isCheckError, isLoading: isCheckLoading } = useReadContract({
    ...contractHRC,
    functionName: 'hasRole',
    args: [doctorRole, walletAddress],
    address: contractHRC.address as `0x${string}`,
  });

  useEffect(() => {
    if (isDoctor !== undefined) {
      setHasRole(isDoctor as boolean);
    }
  }, [isDoctor]);

  const handleGoBack = () => {
    navigate('/');
  };

  // If wallet is not connected
  if (!address) {
    return (
      <div className="container mx-auto p-8 bg-gradient-to-r from-blue-100 to-teal-100 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Wallet Not Connected</h1>
        <div className="bg-white p-6 rounded-md shadow-md">
          <p className="text-2xl text-yellow-600 font-semibold text-center mb-4">
            Please connect your wallet to access the doctor dashboard.
          </p>
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={handleGoBack}
            className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
          >
            Go to Home Page
          </button>
        </div>
      </div>
    );
  }

  // Display loading state while checking role
  if (isRoleLoading || isCheckLoading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  // Display error message if there was an issue fetching role data
  if (isRoleError || isCheckError) {
    return <div className="text-center p-8 text-red-600">Error checking doctor role. Please try again later.</div>;
  }

  // Display access denied message if the wallet does not have the Doctor role
  if (!hasRole) {
    return (
      <div className="container mx-auto p-8 bg-gradient-to-r from-blue-100 to-teal-100 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Access Denied</h1>
        <div className="bg-white p-6 rounded-md shadow-md">
          <p className="text-2xl text-red-600 font-semibold text-center mb-4">
            You do not have access to this page.
          </p>
          <p className="text-lg text-gray-700 text-center">
            Please make sure you have the Doctor role or contact the admin.
          </p>
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={handleGoBack}
            className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
          >
            Go to Home Page
          </button>
        </div>
      </div>
    );
  }

  // Render the doctor dashboard content
  return (
    <div className="container mx-auto p-8 bg-gradient-to-r from-blue-100 to-teal-100 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Doctor Dashboard
      </h1>
      
      {/* Doctor Actions */}
      <div className="bg-white p-6 rounded-md shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Doctor Actions</h2>
        <p className="mb-4">As a doctor, you can perform the following actions:</p>
        <ul className="list-disc list-inside mb-4">
          <li>View patient records</li>
          <li>Update patient information</li>
          <li>Schedule appointments</li>
        </ul>

        <AddHealthRecord />

        <h2 className="text-4xl font-black mt-[100px] mb-[50px] text-center text-gray-800">Manage Users</h2>
        <div className="flex flex-col lg:flex-row justify-between border-b-4 border-b-black py-[20px] mb-[100px]">
          <div className="flex-1">
            <GetAllPatients />
          </div>
          <div className="flex-1 lg:ml-4">
            <GetAllDoctors />
          </div>
        </div>

        <div className='mt-[70px]'>
          <GetAllActiveRecords />
        </div>

        <div>
          <UpdateHealthRecord />
        </div>
        
        <div className='mt-[70px]'>
          <DeactivateRecord />
        </div>

        <div className='mt-[70px]'>
          <IPFSRetrieve  />
        </div>


        {/* Add doctor-specific functionality here */}
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleGoBack}
          className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
        >
          Back to Home Page
        </button>
      </div>
    </div>
  );
};

export default DoctorDashboard;

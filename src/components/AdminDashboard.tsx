import { useEffect, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { contractHRC } from '../contracts';
import { AddDoctors, GetAllActiveRecords, GetAllDoctors, GetAllPatients, GetAllRecordIds } from '../exports';
import ApprovePatientRegistration from '../HRCWritefunctions/ApprovePatientRegistration';
import GetDoctorInfo from '../HRCReadfunctions/GetDoctorInfo';

const AdminDashboard = () => {
  const { address } = useAccount();
  const [walletAddress, setWalletAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (address) {
      setWalletAddress(address);
    }
  }, [address]);


  const handleGoHome = () => {
    navigate('/');
  };

  // Check if wallet is connected
  if (!address) {
    return (
      <div className="container mx-auto p-8 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Wallet Not Connected</h1>
        <div className="bg-white p-6 rounded-md shadow-md">
          <p className="text-2xl text-yellow-600 font-semibold text-center mb-4">
            Connect your wallet to access the admin dashboard.
          </p>
        </div>
        {renderNavigationButtons()}
      </div>
    );
  }

  // Fetch the ADMIN_ROLE constant from the contract
  const { data: adminRole, isError: adminRoleError, isLoading: adminRoleLoading } = useReadContract({
    ...contractHRC,
    functionName: 'ADMIN_ROLE',
    address: contractHRC.address as `0x${string}`,
  });

  // Check if the given wallet address has the ADMIN_ROLE
  const { data: isAdmin, isError: isAdminError, isLoading: isAdminLoading } = useReadContract({
    ...contractHRC,
    functionName: 'hasRole',
    args: [adminRole, walletAddress],
    address: contractHRC.address as `0x${string}`,
  });

  if (adminRoleLoading || isAdminLoading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (adminRoleError || isAdminError) {
    return <div className="text-center p-8 text-red-600">Error checking admin role. Please try again later.</div>;
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto p-8 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Access Denied</h1>
        <div className="bg-white p-6 rounded-md shadow-md">
          <p className="text-2xl text-red-600 font-semibold text-center mb-4">
            You do not have access to this page.
          </p>
          <p className="text-lg text-gray-700 text-center">
            You can explore other features on our app.
          </p>
        </div>
        {renderNavigationButtons()}
      </div>
    );
  }

  // Render the admin dashboard content
  return (
    <div className="container mx-auto p-8 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Welcome, Administrator
      </h1>
      <ApprovePatientRegistration />
      <AddDoctors />

      
      <h2 className="text-4xl font-black mt-[100px] mb-[50px] text-center text-gray-800">Manage Users</h2>
      <div className="flex flex-col lg:flex-row justify-between border border-b-4 border-b-black py-[20px]">
        <div className="flex-1">
          <GetAllPatients />
        </div>
        <div className="flex-1 lg:ml-4">
          <GetAllDoctors />
        </div>
      </div>

      <div className='mt-[50px]'>
        <GetDoctorInfo />
      </div>

      {/* <div className='mt-[70px]'>
        <AddHealthRecord />
      </div> */}

      <div className='mt-[70px]'>
        <GetAllActiveRecords />
      </div>

      <div className='mt-[70px]'>
        <GetAllRecordIds />
      </div>
  

      {/* ... rest of the admin dashboard content ... */}
      {renderNavigationButtons()}
    </div>
  );

  function renderNavigationButtons() {
    return (
      <div className="mt-8 text-center">
        <button
          onClick={handleGoHome}
          className="inline-block bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
        >
          Go to Home Page
        </button>
      </div>
    );
  }
}

export default AdminDashboard;
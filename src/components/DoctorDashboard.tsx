import { useEffect, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import {
 
} from '../exports';
import { contractHRC } from '../contracts';
import { Link } from 'react-router-dom';

const DoctorDashboard = () => {
  const { address } = useAccount();

  const [walletAddress, setWalletAddress] = useState('');
  const [hasDoctorRole, setHasDoctorRole] = useState(false);
  const [hasRole, setHasRole] = useState<boolean | null>(null);


  useEffect(() => {
    if(address) {
        setWalletAddress(address);
    }
  }, [address]);

  // Fetch the DOCTOR_ROLE constant from the contract
  const { data: doctorRole, isError, isLoading } = useReadContract({
    ...contractHRC,
    functionName: 'DOCTOR_ROLE',
    address: contractHRC.address as `0x${string}`,
  });

  // Check if the given wallet address has the DOCTOR_ROLE
  const { data: isDoctor } = useReadContract({
    ...contractHRC,
    functionName: 'hasRole',
    args: [doctorRole, walletAddress],
    address: contractHRC.address as `0x${string}`,
  });

  const handleCheckRole = () => {
    if (isDoctor !== undefined) {
      setHasRole(isDoctor as boolean);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching doctor role</div>;



  return (
    <div className="container mx-auto p-8 bg-gradient-to-r from-blue-100 to-teal-100 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Welcome, Doctor
      </h1>

      <div className="bg-white p-6 rounded-md shadow-md">
        {!hasRole ? (
          <p className="text-2xl text-red-600 font-semibold text-center">
            You do not have access to this page
          </p>
        ) : (
          <p className="text-2xl text-green-600 font-semibold text-center">
            You have access to this page
          </p>
        )}
      </div>

        <div className="flex flex-col md:flex-row items-center justify-between mt-8 text-center">
            <p className="text-lg text-gray-700 mb-4 md:mb-0 md:mr-4 w-full md:w-2/3">
            You can return to the main page to access other features or contact the administrator to apply for the doctor role.
            </p>
            <Link
            to="/"
            className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out w-full md:w-auto transform hover:scale-105"
            >
            Go Back
            </Link>
        </div>
    </div>
  );
}



export default DoctorDashboard;
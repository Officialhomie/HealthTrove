import { useEffect, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import {
 
} from '../exports';
import { contractHRC } from '../contracts';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { address } = useAccount();

  const [walletAddress, setWalletAddress] = useState('');
  const [hasAdminRole, setHasAdminRole] = useState(false);
  const [hasRole, setHasRole] = useState<boolean | null>(null);


  useEffect(() => {
    if(address) {
        setWalletAddress(address);
    }
  }, [address]);

  // Fetch the ADMIN_ROLE constant from the contract
  const { data: adminRole, isError, isLoading } = useReadContract({
    ...contractHRC,
    functionName: 'ADMIN_ROLE',
    address: contractHRC.address as `0x${string}`,
  });

  // Check if the given wallet address has the ADMIN_ROLE
  const { data: isAdmin } = useReadContract({
    ...contractHRC,
    functionName: 'hasRole',
    args: [adminRole, walletAddress],
    address: contractHRC.address as `0x${string}`,
  });

  const handleCheckRole = () => {
    if (isAdmin !== undefined) {
      setHasRole(isAdmin as boolean);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching admin role</div>;



  return (
    <div className="container mx-auto p-8 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Welcome, Administrator
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
            You can return to the main page to access other features or manage system roles and permissions.
            </p>
            <Link
            to="/"
            className="inline-block bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out w-full md:w-auto transform hover:scale-105"
            >
            Go Back
            </Link>
        </div>
    </div>
  );
}



export default AdminDashboard;
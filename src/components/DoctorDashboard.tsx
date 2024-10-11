import { useEffect, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { contractHRC } from '../contracts';
import { Link } from 'react-router-dom';

const DoctorDashboard = () => {
  const { address } = useAccount();
  const [walletAddress, setWalletAddress] = useState('');
  const [hasRole, setHasRole] = useState<boolean | null>(null);

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
  const { data: isDoctor, isError: isCheckError, isLoading: isCheckLoading, refetch } = useReadContract({
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

  const handleCheckRole = async () => {
    await refetch();
  };

  if (isRoleLoading || isCheckLoading) return <div>Loading...</div>;
  if (isRoleError || isCheckError) return <div>Error checking doctor role</div>;

  return (
    <div className="container mx-auto p-8 bg-gradient-to-r from-blue-100 to-teal-100 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Doctor Dashboard
      </h1>

      <div className="bg-white p-6 rounded-md shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Role Check</h2>
        <p className="mb-4">Your wallet address: {walletAddress}</p>
        <button
          onClick={handleCheckRole}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
        >
          Check Doctor Role
        </button>
        {hasRole !== null && (
          <p className={`mt-4 text-lg ${hasRole ? 'text-green-600' : 'text-red-600'} font-semibold`}>
            {hasRole ? 'You have the Doctor role' : 'You do not have the Doctor role'}
          </p>
        )}
      </div>

      {hasRole && (
        <div className="bg-white p-6 rounded-md shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Doctor Actions</h2>
          <p className="mb-4">As a doctor, you can perform the following actions:</p>
          <ul className="list-disc list-inside mb-4">
            <li>View patient records</li>
            <li>Update patient information</li>
            <li>Schedule appointments</li>
          </ul>
          {/* Add doctor-specific functionality here */}
        </div>
      )}

      <div className="flex justify-center">
        <Link
          to="/"
          className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default DoctorDashboard;
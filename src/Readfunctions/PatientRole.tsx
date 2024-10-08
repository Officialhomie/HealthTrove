import { useState } from 'react';
import { useReadContract } from 'wagmi';
import contract from '../contracts';

const PatientRole = () => {
    const [walletAddress, setWalletAddress] = useState('');
    const [hasPatientRole, setHasPatientRole] = useState(false);

    // Fetch the PATIENT_ROLE constant from the contract
    const { data: patientRole, isError, isLoading } = useReadContract({
        ...contract,
        functionName: 'PATIENT_ROLE',
        address: contract.address as `0x${string}`,
    });

    // Check if the given wallet address has the PATIENT_ROLE
    const { data: isPatient } = useReadContract({
        ...contract,
        functionName: 'hasRole',
        args: [patientRole, walletAddress],
        address: contract.address as `0x${string}`,
    });

    const handleCheckRole = () => {
        if (isPatient !== undefined) {
            setHasPatientRole(!!isPatient);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching patient role</div>;

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Check Patient Role</h2>
            <div className="mb-4">
                <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="Enter wallet address"
                    className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
            </div>
            <button 
                onClick={handleCheckRole}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300"
            >
                Check Role
            </button>
            {walletAddress && (
                <p className={`mt-4 text-lg ${hasPatientRole ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {hasPatientRole
                        ? `${walletAddress} has patient role.`
                        : `${walletAddress} does not have patient role.`}
                </p>
            )}
        </div>
    );
}

export default PatientRole;

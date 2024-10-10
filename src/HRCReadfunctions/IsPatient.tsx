import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { contractHRC } from '../contracts';

const IsPatient = () => {
    const [address, setAddress] = useState('');
    const [isPatient, setIsPatient] = useState<boolean | null>(null);
    const [fetchStatus, setFetchStatus] = useState('');

    const { data, isError, isLoading } = useReadContract({
        ...contractHRC,
        functionName: 'isPatient',
        args: [address],
        address: contractHRC.address as `0x${string}`,
    });

    const handleCheckPatient = () => {
        if (data !== undefined) {
            setIsPatient(data as boolean);
            setFetchStatus(`Patient status check completed for Address: ${address}`);
        } else {
            setFetchStatus(`Failed to check patient status for Address: ${address}`);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching patient status</div>;

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Check Patient Status</h2>
            <div className="mb-4">
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter address"
                    className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
            </div>
            <button
                onClick={handleCheckPatient}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300"
            >
                Check Patient Status
            </button>
            {fetchStatus && <p className="mt-4 text-lg text-center">{fetchStatus}</p>}
            {isPatient !== null && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Patient Status:</h3>
                    <p className={`text-lg ${isPatient ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {isPatient ? `Address ${address} is a registered patient.` : `Address ${address} is not a registered patient.`}
                    </p>
                </div>
            )}
        </div>
    );
}

export default IsPatient;

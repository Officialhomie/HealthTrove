import { useState } from 'react';
import { useReadContract } from 'wagmi';
import contractHRC from '../contracts';

const RegisteredDoctor = () => {
    const [index, setIndex] = useState('');
    const [doctorAddress, setDoctorAddress] = useState<string | null>(null);
    const [fetchStatus, setFetchStatus] = useState('');

    const { data, isError, isLoading } = useReadContract({
        ...contractHRC,
        functionName: 'registeredDoctors',
        args: [index ? parseInt(index) : 0], // convert to integer if index is provided
        address: contractHRC.address as `0x${string}`,
    });

    const handleFetchDoctor = () => {
        if (data) {
            setDoctorAddress(data as string);
            setFetchStatus(`Doctor address fetched successfully for index: ${index}`);
        } else {
            setFetchStatus(`Failed to fetch doctor address for index: ${index}`);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching doctor address</div>;

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Get Registered Doctor Address</h2>
            <div className="mb-4">
                <input
                    type="number"
                    value={index}
                    onChange={(e) => setIndex(e.target.value)}
                    placeholder="Enter doctor index"
                    className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
            </div>
            <button
                onClick={handleFetchDoctor}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300"
            >
                Get Doctor Address
            </button>
            {fetchStatus && <p className="mt-4 text-lg text-center">{fetchStatus}</p>}
            {doctorAddress && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Doctor Address:</h3>
                    <p className="text-lg text-gray-800 dark:text-white">{doctorAddress}</p>
                </div>
            )}
        </div>
    );
}

export default RegisteredDoctor;

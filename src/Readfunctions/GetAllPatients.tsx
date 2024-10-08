import { useState } from 'react';
import { useReadContract } from 'wagmi';
import contract from '../contracts';

const GetAllPatients = () => {
    const [patients, setPatients] = useState<string[]>([]);
    const [fetchStatus, setFetchStatus] = useState('');

    const { data, isError, isLoading } = useReadContract({
        ...contract,
        functionName: 'getAllPatients',
        address: contract.address as `0x${string}`,
    });

    const handleFetchPatients = () => {
        if (data) {
            setPatients(data as string[]);
            setFetchStatus('Patients fetched successfully');
        } else {
            setFetchStatus('No patients found or error fetching patients');
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching patients</div>;

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Get All Patients</h2>
            <button
                onClick={handleFetchPatients}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300"
            >
                Fetch Patients
            </button>
            {fetchStatus && <p className="mt-4 text-lg text-center">{fetchStatus}</p>}
            <div className="mt-6">
                {patients.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Patients List:</h3>
                        <ul>
                            {patients.map((patient, index) => (
                                <li key={index} className="mb-2">
                                    {patient}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GetAllPatients;

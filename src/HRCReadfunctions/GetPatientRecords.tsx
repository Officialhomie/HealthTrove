import { useState } from 'react';
import { useReadContract } from 'wagmi';
import contractHRC from '../contracts';

const GetPatientRecords = () => {
    const [patientAddress, setPatientAddress] = useState('');
    const [recordIds, setRecordIds] = useState<bigint[]>([]);
    const [fetchStatus, setFetchStatus] = useState('');

    const { data, isError, isLoading } = useReadContract({
        ...contractHRC,
        functionName: 'getPatientRecords',
        args: [patientAddress],
        address: contractHRC.address as `0x${string}`,
    });

    const handleFetchPatientRecords = () => {
        if (data) {
            setRecordIds(data as bigint[]);
            setFetchStatus('Patient records fetched successfully');
        } else {
            setFetchStatus('No records found for this patient or error fetching records');
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching patient records</div>;

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Get Patient Records</h2>
            <div className="mb-4">
                <input
                    type="text"
                    value={patientAddress}
                    onChange={(e) => setPatientAddress(e.target.value)}
                    placeholder="Enter patient address"
                    className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
            </div>
            <button
                onClick={handleFetchPatientRecords}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300"
            >
                Fetch Patient Records
            </button>
            {fetchStatus && <p className="mt-4 text-lg text-center">{fetchStatus}</p>}
            {recordIds.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Record IDs:</h3>
                    <ul>
                        {recordIds.map((id) => (
                            <li key={id.toString()} className="text-gray-700 dark:text-gray-300">
                                {id.toString()}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default GetPatientRecords;

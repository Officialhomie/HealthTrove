import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { contractHRC } from '../contracts';

const GetAllRecordIds = () => {
    const [patientAddress, setPatientAddress] = useState('');
    const [recordIds, setRecordIds] = useState<number[]>([]);
    const [fetchStatus, setFetchStatus] = useState('');

    const { data } = useReadContract({
        ...contractHRC,
        functionName: 'getAllRecordIds',
        args: [patientAddress],
        address: contractHRC.address as `0x${string}`,
    });

    useEffect(() => {
        if (data) {
            setRecordIds(data as number[]);
            setFetchStatus('Record IDs fetched successfully');
        } else {
            setFetchStatus('No record IDs found or error fetching record IDs');
        }
    }, [data]);

    const handleFetchRecordIds = () => {
        setFetchStatus('Fetching record IDs...');
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full mx-auto md:max-w-full lg:max-w-full xl:max-w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Get All Record IDs for Patient</h2>
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
                onClick={handleFetchRecordIds}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300"
            >
                Fetch Record IDs
            </button>
            {fetchStatus && <p className="mt-4 text-lg text-center">{fetchStatus}</p>}
            <div className="mt-6">
                {recordIds.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Record IDs List:</h3>
                        <ul>
                            {recordIds.map((id, index) => (
                                <li key={index} className="mb-2">
                                    {id.toString()}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GetAllRecordIds;

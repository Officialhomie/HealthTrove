import { useState } from 'react';
import { useReadContract } from 'wagmi';
import contract from '../contracts';

interface HealthRecord {
    id: bigint;
    patient: string;
    ipfsHash: string;
    timestamp: bigint;
    doctor: string;
    isActive: boolean;
}

const GetActiveRecords = () => {
    const [patientAddress, setPatientAddress] = useState('');
    const [activeRecords, setActiveRecords] = useState<HealthRecord[]>([]);
    const [fetchStatus, setFetchStatus] = useState('');

    const { data, isError, isLoading } = useReadContract({
        ...contract,
        functionName: 'getActiveRecords',
        args: [patientAddress],
        address: contract.address as `0x${string}`,
    });

    const handleFetchActiveRecords = () => {
        if (data) {
            setActiveRecords(data as HealthRecord[]);
            setFetchStatus('Active records fetched successfully');
        } else {
            setFetchStatus('No active records found for this patient or error fetching records');
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching active records</div>;

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Get Active Records</h2>
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
                onClick={handleFetchActiveRecords}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300"
            >
                Fetch Active Records
            </button>
            {fetchStatus && <p className="mt-4 text-lg text-center">{fetchStatus}</p>}
            {activeRecords.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Active Records:</h3>
                    <ul>
                        {activeRecords.map((record, index) => (
                            <li key={index} className="mb-2">
                                <div className="p-3 border border-gray-300 rounded-md dark:border-gray-600">
                                    <p className="text-gray-700 dark:text-gray-300"><strong>Record ID:</strong> {record.id.toString()}</p>
                                    <p className="text-gray-700 dark:text-gray-300"><strong>Patient:</strong> {record.patient}</p>
                                    <p className="text-gray-700 dark:text-gray-300"><strong>IPFS Hash:</strong> {record.ipfsHash}</p>
                                    <p className="text-gray-700 dark:text-gray-300"><strong>Timestamp:</strong> {new Date(Number(record.timestamp) * 1000).toLocaleString()}</p>
                                    <p className="text-gray-700 dark:text-gray-300"><strong>Doctor:</strong> {record.doctor}</p>
                                    <p className="text-gray-700 dark:text-gray-300"><strong>Active:</strong> {record.isActive ? 'Yes' : 'No'}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default GetActiveRecords;

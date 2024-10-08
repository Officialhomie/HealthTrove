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

const GetHealthRecord = () => {
    const [recordId, setRecordId] = useState('');
    const [healthRecord, setHealthRecord] = useState<HealthRecord | null>(null);
    const [fetchStatus, setFetchStatus] = useState('');

    const { data, isError, isLoading } = useReadContract({
        ...contract,
        functionName: 'getHealthRecord',
        args: [BigInt(recordId || '0')],
        address: contract.address as `0x${string}`,
    });

    const handleFetchHealthRecord = () => {
        if (data) {
            setHealthRecord(data as HealthRecord);
            setFetchStatus('Health record fetched successfully');
        } else {
            setFetchStatus('No health record found or error fetching record');
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching health record</div>;

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Get Health Record by ID</h2>
            <div className="mb-4">
                <input
                    type="number"
                    value={recordId}
                    onChange={(e) => setRecordId(e.target.value)}
                    placeholder="Enter record ID"
                    className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
            </div>
            <button
                onClick={handleFetchHealthRecord}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300"
            >
                Fetch Health Record
            </button>
            {fetchStatus && <p className="mt-4 text-lg text-center">{fetchStatus}</p>}
            {healthRecord && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Health Record Details:</h3>
                    <ul>
                        <li><strong>ID:</strong> {healthRecord.id.toString()}</li>
                        <li><strong>Patient:</strong> {healthRecord.patient}</li>
                        <li><strong>IPFS Hash:</strong> {healthRecord.ipfsHash}</li>
                        <li><strong>Timestamp:</strong> {new Date(Number(healthRecord.timestamp) * 1000).toLocaleString()}</li>
                        <li><strong>Doctor:</strong> {healthRecord.doctor}</li>
                        <li><strong>Active:</strong> {healthRecord.isActive ? 'Yes' : 'No'}</li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default GetHealthRecord;

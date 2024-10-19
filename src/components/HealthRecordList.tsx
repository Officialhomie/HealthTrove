import React, { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { contractHRC } from '../contracts';

interface HealthRecord {
  patientAddress: string;
  ipfsHash: string;
}

const HealthRecordsList: React.FC = () => {
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);

  const { data: recordCount } = useReadContract({
    address: contractHRC.address as `0x${string}`,
    abi: contractHRC.abi,
    functionName: 'getHealthRecordCount',
  });

  const { data: records, isError, isLoading } = useReadContract({
    address: contractHRC.address as `0x${string}`,
    abi: contractHRC.abi,
    functionName: 'getAllHealthRecords',
  });

  useEffect(() => {
    if (records && Array.isArray(records)) {
      setHealthRecords(records as HealthRecord[]);
    }
  }, [records]);

  if (isLoading) return <div>Loading health records...</div>;
  if (isError) return <div>Error fetching health records</div>;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mt-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Health Records</h2>
      <p className="mb-4">Total Records: {recordCount?.toString() || '0'}</p>
      <ul className="space-y-2">
        {healthRecords.map((record, index) => (
          <li key={index} className="border p-2 rounded-md">
            <p className="text-sm text-gray-600 dark:text-gray-300">Patient: {record.patientAddress}</p>
            <p className="text-sm">IPFS Hash: {record.ipfsHash}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HealthRecordsList;
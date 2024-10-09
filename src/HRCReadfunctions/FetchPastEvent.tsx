import React, { useState, useEffect } from 'react';
import { watchContractEvent, getPublicClient } from '@wagmi/core';
import contract from '../contracts';
import { config } from '../wagmi';

const FetchPastEvent: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchPastEvents = async () => {
      const publicClient = getPublicClient(config);
      const pastLogs = await publicClient.getContractEvents({
        address: contract.address as `0x${string}`,
        abi: contract.abi,
        eventName: 'DoctorRegistered',
        fromBlock: 0n,
        toBlock: 'latest'
      });
      setLogs(pastLogs);
    };

    fetchPastEvents();

    const unwatch = watchContractEvent(config, {
      address: contract.address as `0x${string}`,
      abi: contract.abi,
      eventName: 'DoctorRegistered',
      onLogs(newLogs) {
        setLogs(prevLogs => [...prevLogs, ...newLogs]);
      },
    });

    return () => unwatch();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Doctor Registered Events</h2>
      {logs.length === 0 ? (
        <p className="text-lg text-gray-600 dark:text-gray-400">No events yet</p>
      ) : (
        <ul className="space-y-2">
          {logs.map((log, index) => (
            <li key={index} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Doctor Address:</span>
              <span className="ml-2 text-gray-800 dark:text-gray-200 break-all">{log.args.doctorAddress}</span>
              {/* Add more event data as needed */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FetchPastEvent;
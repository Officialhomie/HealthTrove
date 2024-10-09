import { useState } from 'react';
import { useWatchContractEvent } from 'wagmi';
import contractHRC from '../contracts';

import { Log } from 'viem';

interface PatientRegisteredLog extends Log {
    args: {
        patient: `0x${string}`;
    };
}

const PatientRegisteredListener = () => {
    const [patients, setPatients] = useState<`0x${string}`[]>([]);

    useWatchContractEvent({
        address: contractHRC.address as `0x${string}`,
        abi: contractHRC.abi,
        eventName: 'PatientRegistered',
        onLogs(logs) {
            logs.forEach((log) => {
                const typedLog = log as PatientRegisteredLog;
                if (typedLog.args && typedLog.args.patient) {
                    setPatients((prevPatients) => [...prevPatients, typedLog.args.patient]);
                }
            });
        },
    });


    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Registered Patients</h2>
            {patients.length > 0 ? (
                <ul className="list-disc pl-5">
                    {patients.map((patient, index) => (
                        <li key={index} className="text-lg text-gray-800 dark:text-white">
                            {patient}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-lg text-gray-800 dark:text-white">No patients registered yet.</p>
            )}
        </div>
    );
}

export default PatientRegisteredListener;

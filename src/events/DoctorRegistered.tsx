import { useState } from 'react';
import { useWatchContractEvent } from 'wagmi';
import contractHRC from '../contracts';

import { Log } from 'viem';

interface DoctorRegisteredLog extends Log {
    args: {
        doctor: `0x${string}`;
    };
}

const DoctorRegisteredListener = () => {
    const [doctors, setDoctors] = useState<`0x${string}`[]>([]);

    useWatchContractEvent({
        address: contractHRC.address as `0x${string}`,
        abi: contractHRC.abi,
        eventName: 'DoctorRegistered',
        onLogs(logs) {
            logs.forEach((log) => {
                const typedLog = log as DoctorRegisteredLog;
                if (typedLog.args && typedLog.args.doctor) {
                    setDoctors((prevDoctors) => [...prevDoctors, typedLog.args.doctor]);
                }
            });
        },
    });


    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Registered Doctors</h2>
            {doctors.length > 0 ? (
                <ul className="list-disc pl-5">
                    {doctors.map((doctor, index) => (
                        <li key={index} className="text-lg text-gray-800 dark:text-white">
                            {doctor}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-lg text-gray-800 dark:text-white">No doctors registered yet.</p>
            )}
        </div>
    );
}

export default DoctorRegisteredListener;

import { useEffect, useState } from 'react';
import { useWatchContractEvent } from 'wagmi';
import { contractHRC } from '../contracts';
import { Log } from 'viem';

interface DoctorRegisteredLog extends Log {
    args: {
        doctor: `0x${string}`;
        transactionHash: string;
        timestamp: number;
    };
}

const DoctorRegisteredListener = () => {
    const [doctors, setDoctors] = useState<Array<{ doctor: `0x${string}`; transactionHash: string; timestamp: number }>>(() => {
        const storedDoctors = localStorage.getItem('registeredDoctors');
        return storedDoctors ? JSON.parse(storedDoctors) : [];
    });

    useEffect(() => {
        localStorage.setItem('registeredDoctors', JSON.stringify(doctors));
    }, [doctors]);

    useWatchContractEvent({
        address: contractHRC.address as `0x${string}`,
        abi: contractHRC.abi,
        eventName: 'DoctorRegistered',
        onLogs(logs) {
            logs.forEach((log) => {
                const typedLog = log as DoctorRegisteredLog;
                if (typedLog.args && typedLog.args.doctor) {
                    setDoctors((prevDoctors) => {
                        if (!prevDoctors.find(d => d.doctor === typedLog.args.doctor)) {
                            return [
                                ...prevDoctors,
                                {
                                    doctor: typedLog.args.doctor,
                                    transactionHash: typedLog.transactionHash!,
                                    timestamp: typedLog.args.timestamp,
                                }
                            ];
                        }
                        return prevDoctors;
                    });
                }
            });
        },
    });

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
        return date.toLocaleString();
    };

    const truncateHash = (hash: string) => `${hash.slice(0, 6)}...${hash.slice(-4)}`;
    const getExplorerUrl = (hash: string) => `https://sepolia.basescan.org/tx/${hash}`;

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Registered Doctors</h2>
            
            {doctors.length > 0 ? (
                <ul className="space-y-4">
                    {doctors.map((doctor, index) => (
                        <li key={`${doctor.doctor}-${index}`} className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-gray-800 dark:text-white">
                            <p><strong>Doctor:</strong> {doctor.doctor}</p>
                            <p><strong>Transaction:</strong> 
                                <a 
                                    href={getExplorerUrl(doctor.transactionHash)} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400"
                                >
                                    {truncateHash(doctor.transactionHash)}
                                </a>
                            </p>
                            <p><strong>Timestamp:</strong> {formatDate(doctor.timestamp)}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-lg text-gray-600 dark:text-gray-300">No doctors registered yet.</p>
            )}
        </div>
    );
};

export default DoctorRegisteredListener;

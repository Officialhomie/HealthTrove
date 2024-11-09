import { useState } from 'react';
import { useWatchContractEvent } from 'wagmi';
import { contractHRC } from '../contracts';
import { Log } from 'viem';

interface DoctorRemovedLog extends Log {
    args: {
        doctor: `0x${string}`;
    };
}

const DoctorRemovedListener = () => {
    const [removedDoctors, setRemovedDoctors] = useState<Array<{ doctor: `0x${string}`; transactionHash: string }>>([]);

    useWatchContractEvent({
        address: contractHRC.address as `0x${string}`,
        abi: contractHRC.abi,
        eventName: 'DoctorRemoved',
        onLogs(logs) {
            logs.forEach((log) => {
                const typedLog = log as DoctorRemovedLog;
                if (typedLog.args) {
                    setRemovedDoctors((prevDoctors) => [
                        ...prevDoctors,
                        { doctor: typedLog.args.doctor, transactionHash: log.transactionHash! },
                    ]);
                }
            });
        },
    });

    const truncateHash = (hash: string) => `${hash.slice(0, 6)}...${hash.slice(-4)}`;
    const getExplorerUrl = (hash: string) => `https://sepolia.basescan.org/tx/${hash}`;

    return (
        <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Removed Doctors</h3>
            {removedDoctors.length > 0 ? (
                <ul className="space-y-2">
                    {removedDoctors.map((doctor, index) => (
                        <li key={`${doctor.doctor}-${index}`} className="text-gray-800 dark:text-white break-all bg-gray-50 dark:bg-gray-700 p-3 rounded">
                            <p>
                                <strong>Doctor:</strong> {doctor.doctor}
                            </p>
                            <p>
                                <strong>Transaction:</strong> 
                                <a 
                                    href={getExplorerUrl(doctor.transactionHash)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400"
                                >
                                    {truncateHash(doctor.transactionHash)}
                                </a>
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-lg text-gray-600 dark:text-gray-300">No doctors removed yet.</p>
            )}
        </div>
    );
};

export default DoctorRemovedListener;

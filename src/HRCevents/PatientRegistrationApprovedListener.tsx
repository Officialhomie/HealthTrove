import { useState } from 'react';
import { useWatchContractEvent } from 'wagmi';
import { contractHRC } from '../contracts';
import { Log } from 'viem';

interface PatientRegistrationApprovedLog extends Log {
    args: {
        patient: `0x${string}`;
    };
}

const PatientRegistrationApprovedListener = () => {
    const [approvedPatients, setApprovedPatients] = useState<Array<{ patient: `0x${string}`; transactionHash: string }>>([]);

    useWatchContractEvent({
        address: contractHRC.address as `0x${string}`,
        abi: contractHRC.abi,
        eventName: 'PatientRegistrationApproved',
        onLogs(logs) {
            logs.forEach((log) => {
                const typedLog = log as PatientRegistrationApprovedLog;
                if (typedLog.args) {
                    setApprovedPatients((prevPatients) => [
                        ...prevPatients,
                        { patient: typedLog.args.patient, transactionHash: log.transactionHash! },
                    ]);
                }
            });
        },
    });

    const truncateHash = (hash: string) => `${hash.slice(0, 6)}...${hash.slice(-4)}`;
    const getExplorerUrl = (hash: string) => `https://sepolia.basescan.org/tx/${hash}`;

    return (
        <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Approved Patient Registrations</h3>
            {approvedPatients.length > 0 ? (
                <ul className="space-y-2">
                    {approvedPatients.map((patient, index) => (
                        <li key={`${patient.patient}-${index}`} className="text-gray-800 dark:text-white break-all bg-gray-50 dark:bg-gray-700 p-3 rounded">
                            <p>
                                <strong>Patient:</strong> {patient.patient}
                            </p>
                            <p>
                                <strong>Transaction:</strong> 
                                <a 
                                    href={getExplorerUrl(patient.transactionHash)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400"
                                >
                                    {truncateHash(patient.transactionHash)}
                                </a>
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-lg text-gray-600 dark:text-gray-300">No approved patient registrations yet.</p>
            )}
        </div>
    );
};

export default PatientRegistrationApprovedListener;

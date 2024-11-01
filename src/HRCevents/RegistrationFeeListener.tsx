import { useState } from 'react';
import { useWatchContractEvent } from 'wagmi';
import { contractHRC } from '../contracts';
import { Log } from 'viem';

interface RegistrationFeePaidLog extends Log {
    args: {
        patient: `0x${string}`;
        amount: bigint;
    };
}

const RegistrationFeeListener = () => {
    const [registrationFees, setRegistrationFees] = useState<Array<{ patient: `0x${string}`; amount: bigint; transactionHash: string }>>([]);

    useWatchContractEvent({
        address: contractHRC.address as `0x${string}`,
        abi: contractHRC.abi,
        eventName: 'RegistrationFeePaid',
        onLogs(logs) {
            logs.forEach((log) => {
                const typedLog = log as RegistrationFeePaidLog;
                if (typedLog.args) {
                    setRegistrationFees((prevFees) => [
                        ...prevFees,
                        { patient: typedLog.args.patient, amount: typedLog.args.amount, transactionHash: log.transactionHash! },
                    ]);
                }
            });
        },
    });

    const truncateHash = (hash: string) => `${hash.slice(0, 6)}...${hash.slice(-4)}`;
    const getExplorerUrl = (hash: string) => `https://sepolia.basescan.org/tx/${hash}`;

    return (
        <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Registration Fees</h3>
            {registrationFees.length > 0 ? (
                <ul className="space-y-2">
                    {registrationFees.map((fee, index) => (
                        <li key={`${fee.patient}-${index}`} className="text-gray-800 dark:text-white break-all bg-gray-50 dark:bg-gray-700 p-3 rounded">
                            <p>
                                <strong>Patient:</strong> {fee.patient} | <strong>Amount:</strong> {fee.amount.toString()} wei
                            </p>
                            <p>
                                <strong>Transaction:</strong> 
                                <a 
                                    href={getExplorerUrl(fee.transactionHash)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400"
                                >
                                    {truncateHash(fee.transactionHash)}
                                </a>
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-lg text-gray-600 dark:text-gray-300">No registration fees recorded yet.</p>
            )}
        </div>
    );
};

export default RegistrationFeeListener;

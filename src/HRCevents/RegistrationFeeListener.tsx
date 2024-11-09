import { useState } from 'react';
import { usePublicClient, useWatchContractEvent } from 'wagmi';
import { contractHRC } from '../contracts';
import { Log, decodeEventLog } from 'viem';

interface RegistrationFeePaidEvent {
    patient: `0x${string}`;
    amount: bigint;
    transactionHash: `0x${string}`;
    blockNumber: bigint;
    timestamp?: number;
}

const RegistrationFeeListener = () => {
    const [registrationFees, setRegistrationFees] = useState<RegistrationFeePaidEvent[]>([]);
    const publicClient = usePublicClient();

    const processLogs = async (logs: Log[]) => {
        for (const log of logs) {
            const decodedLog = decodeEventLog({
                abi: contractHRC.abi,
                data: log.data,
                topics: log.topics,
            });

            // Type assertion with type guard
            if (!decodedLog.args || !Array.isArray(decodedLog.args) || decodedLog.args.length < 2) {
                continue;
            }

            const patient = decodedLog.args[0] as `0x${string}`;
            const amount = decodedLog.args[1] as bigint;

            if (log.transactionHash && log.blockNumber !== null) {
                const block = await publicClient.getBlock({ blockHash: log.blockHash! });
                setRegistrationFees((prevFees) => [
                    ...prevFees,
                    {
                        patient,
                        amount,
                        transactionHash: log.transactionHash!,
                        blockNumber: log.blockNumber!,
                        timestamp: Number(block.timestamp),
                    },
                ]);
            }
        }
    };

    useWatchContractEvent({
        address: contractHRC.address as `0x${string}`,
        abi: contractHRC.abi,
        eventName: 'RegistrationFeePaid',
        onLogs: processLogs,
    });

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full max-w-full mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Registration Fees</h2>
            {registrationFees.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto text-sm">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700">
                                <th>Time</th>
                                <th>Patient</th>
                                <th>Amount (wei)</th>
                                <th>Transaction</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrationFees.map((fee) => (
                                <tr key={fee.transactionHash} className="border-b dark:border-gray-700">
                                    <td>{fee.timestamp ? new Date(fee.timestamp * 1000).toLocaleString() : 'Processing...'}</td>
                                    <td>{fee.patient}</td>
                                    <td>{fee.amount.toString()}</td>
                                    <td>
                                        <a href={`https://sepolia.basescan.org/tx/${fee.transactionHash}`} target="_blank" rel="noopener noreferrer">
                                            {fee.transactionHash.slice(0, 6)}...{fee.transactionHash.slice(-4)}
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No registration fees recorded yet.</p>
            )}
        </div>
    );
};

export default RegistrationFeeListener;

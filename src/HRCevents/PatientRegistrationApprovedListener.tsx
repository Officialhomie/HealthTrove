import { useState } from 'react';
import { usePublicClient, useWatchContractEvent } from 'wagmi';
import { contractHRC } from '../contracts';
import { Log, decodeEventLog } from 'viem';

interface PatientRegistrationApprovedEvent {
    patient: `0x${string}`;
    transactionHash: `0x${string}`;
    blockNumber: bigint;
    timestamp?: number;
}

const PatientRegistrationApprovedListener = () => {
    const [approvedPatients, setApprovedPatients] = useState<PatientRegistrationApprovedEvent[]>([]);
    const publicClient = usePublicClient();

    const processLogs = async (logs: Log[]) => {
        for (const log of logs) {
            const decodedLog = decodeEventLog({
                abi: contractHRC.abi,
                data: log.data,
                topics: log.topics,
            });

            // Type guard to check if args exists and has the expected shape
            if (!decodedLog.args || typeof decodedLog.args !== 'object') continue;

            const args = decodedLog.args as unknown;
            if (!isPatientRegistrationApprovedArgs(args)) continue;

            if (log.transactionHash && log.blockNumber !== null) {
                const block = await publicClient.getBlock({ blockHash: log.blockHash! });
                setApprovedPatients((prevPatients) => [
                    ...prevPatients,
                    {
                        patient: args.patient,
                        transactionHash: log.transactionHash!,
                        blockNumber: log.blockNumber!,
                        timestamp: Number(block.timestamp),
                    },
                ]);
            }
        }
    };

    // Type guard function
    const isPatientRegistrationApprovedArgs = (args: unknown): args is { 
        patient: `0x${string}`; 
    } => {
        return (
            typeof args === 'object' && 
            args !== null &&
            'patient' in args &&
            typeof (args as any).patient === 'string'
        );
    };

    useWatchContractEvent({
        address: contractHRC.address as `0x${string}`,
        abi: contractHRC.abi,
        eventName: 'PatientRegistrationApproved',
        onLogs: processLogs,
    });

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full max-w-full mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Approved Patient Registrations</h2>
            {approvedPatients.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto text-sm">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700">
                                <th>Time</th>
                                <th>Patient</th>
                                <th>Transaction</th>
                                <th>Block</th>
                            </tr>
                        </thead>
                        <tbody>
                            {approvedPatients.map((patient) => (
                                <tr key={patient.transactionHash} className="border-b dark:border-gray-700">
                                    <td>{patient.timestamp ? new Date(patient.timestamp * 1000).toLocaleString() : 'Processing...'}</td>
                                    <td>{patient.patient}</td>
                                    <td>
                                        <a href={`https://sepolia.basescan.org/tx/${patient.transactionHash}`} target="_blank" rel="noopener noreferrer">
                                            {patient.transactionHash.slice(0, 6)}...{patient.transactionHash.slice(-4)}
                                        </a>
                                    </td>
                                    <td>{patient.blockNumber.toString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No approved registrations recorded yet.</p>
            )}
        </div>
    );
};

export default PatientRegistrationApprovedListener;

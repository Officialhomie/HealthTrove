import { useState } from 'react';
import { useWatchContractEvent, usePublicClient } from 'wagmi';
import { contractHRC } from '../contracts';
import { Log, decodeEventLog } from 'viem';

interface RecordAddedEvent {
    recordId: bigint;
    patient: `0x${string}`;
    doctor: `0x${string}`;
    ipfsHash: string;
    transactionHash: string;
    blockNumber: bigint;
    timestamp: number;
}

const RecordAddedListener = () => {
    const [recordAddedEvents, setRecordAddedEvents] = useState<RecordAddedEvent[]>([]);
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
            if (!isRecordAddedArgs(args)) continue;

            if (log.transactionHash && log.blockNumber !== null) {
                const block = await publicClient.getBlock({ blockHash: log.blockHash! });
                setRecordAddedEvents((prevEvents) => [
                    ...prevEvents,
                    {
                        recordId: args.recordId,
                        patient: args.patient,
                        doctor: args.doctor,
                        ipfsHash: args.ipfsHash,
                        transactionHash: log.transactionHash!,
                        blockNumber: log.blockNumber!,
                        timestamp: Number(args.timestamp || block.timestamp),
                    },
                ]);
            }
        }
    };

    // Type guard function
    const isRecordAddedArgs = (args: unknown): args is {
        recordId: bigint;
        patient: `0x${string}`;
        doctor: `0x${string}`;
        ipfsHash: string;
        timestamp: bigint;
    } => {
        return (
            typeof args === 'object' &&
            args !== null &&
            'recordId' in args &&
            'patient' in args &&
            'doctor' in args &&
            'ipfsHash' in args &&
            'timestamp' in args
        );
    };

    useWatchContractEvent({
        address: contractHRC.address as `0x${string}`,
        abi: contractHRC.abi,
        eventName: 'RecordAdded',
        onLogs: processLogs,
    });

    const truncateHash = (hash: string) => `${hash.slice(0, 6)}...${hash.slice(-4)}`;
    const getExplorerUrl = (hash: string) => `https://sepolia.basescan.org/tx/${hash}`;

    return (
        <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Record Added Events</h3>
            {recordAddedEvents.length > 0 ? (
                <ul className="space-y-2">
                    {recordAddedEvents.map((record, index) => (
                        <li key={`${record.recordId}-${index}`} className="text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded">
                            <p><strong>Record ID:</strong> {record.recordId.toString()}</p>
                            <p><strong>Patient:</strong> {record.patient}</p>
                            <p><strong>Doctor:</strong> {record.doctor}</p>
                            <p><strong>IPFS Hash:</strong> {record.ipfsHash}</p>
                            <p><strong>Timestamp:</strong> {new Date(record.timestamp * 1000).toLocaleString()}</p>
                            <p>
                                <strong>Transaction:</strong>
                                <a href={getExplorerUrl(record.transactionHash)} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 dark:text-blue-400">
                                    {truncateHash(record.transactionHash)}
                                </a>
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-lg text-gray-600 dark:text-gray-300">No record added events detected yet.</p>
            )}
        </div>
    );
};

export default RecordAddedListener;

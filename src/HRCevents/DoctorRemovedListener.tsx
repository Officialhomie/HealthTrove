import { useState } from 'react';
import { useWatchContractEvent, usePublicClient } from 'wagmi';
import { contractHRC } from '../contracts';
import { Log, decodeEventLog } from 'viem';

interface DoctorRemovedEvent {
    doctor: `0x${string}`;
    transactionHash: `0x${string}`;
    blockNumber: bigint;
    timestamp?: number;
}

const DoctorRemovedListener = () => {
    const [removedDoctors, setRemovedDoctors] = useState<DoctorRemovedEvent[]>([]);
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
            if (!isDoctorRemovedArgs(args)) continue;

            if (log.transactionHash && log.blockNumber !== null) {
                const block = await publicClient.getBlock({ blockHash: log.blockHash! });
                setRemovedDoctors((prevDoctors) => [
                    ...prevDoctors,
                    {
                        doctor: args.doctor,
                        transactionHash: log.transactionHash!,
                        blockNumber: log.blockNumber!,
                        timestamp: Number(block.timestamp),
                    },
                ]);
            }
        }
    };

    // Type guard function
    const isDoctorRemovedArgs = (args: unknown): args is { 
        doctor: `0x${string}`; 
    } => {
        return (
            typeof args === 'object' && 
            args !== null &&
            'doctor' in args &&
            typeof (args as any).doctor === 'string'
        );
    };

    useWatchContractEvent({
        address: contractHRC.address as `0x${string}`,
        abi: contractHRC.abi,
        eventName: 'DoctorRemoved',
        onLogs: processLogs,
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
                            <p><strong>Doctor:</strong> {doctor.doctor}</p>
                            <p>
                                <strong>Removed At:</strong> {doctor.timestamp ? new Date(doctor.timestamp * 1000).toLocaleString() : 'Processing...'}
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

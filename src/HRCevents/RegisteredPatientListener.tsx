import { useState, useEffect } from 'react';
import { usePublicClient, useWatchContractEvent } from 'wagmi';
import { contractHRC } from '../contracts';
import { Log, decodeEventLog, AbiEvent } from 'viem';

interface PatientRegisteredLog {
    patient: `0x${string}`;
    ailment: string;
    reason: string;
    transactionHash: string;
    blockNumber: bigint;
}

const POLLING_INTERVAL = 5000; // 5 seconds
const BLOCKS_TO_FETCH = 100n;

// Define the event structure
const PatientRegisteredEvent = {
    type: 'event',
    name: 'PatientRegistered',
    inputs: [
        { indexed: false, name: 'patient', type: 'address' },
        { indexed: false, name: 'ailment', type: 'string' },
        { indexed: false, name: 'reason', type: 'string' },
    ],
} as const satisfies AbiEvent;

const RegisteredPatientsListener = () => {
    const [registeredPatients, setRegisteredPatients] = useState<PatientRegisteredLog[]>([]);
    const [lastBlockChecked, setLastBlockChecked] = useState<bigint | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPolling, setIsPolling] = useState(true); // Start with polling as default
    const publicClient = usePublicClient();

    const fetchEventsForRange = async (fromBlock: bigint, toBlock: bigint) => {
        try {
            const logs = await publicClient.getLogs({
                address: contractHRC.address as `0x${string}`,
                event: PatientRegisteredEvent,
                fromBlock,
                toBlock,
            });
            return logs;
        } catch (err) {
            console.error('Error fetching patient registration events:', err);
            throw err;
        }
    };

    const processLogs = async (logs: Log[]) => {
        const newPatients: PatientRegisteredLog[] = [];
        
        for (const log of logs) {
            try {
                const decodedLog = decodeEventLog({
                    abi: [PatientRegisteredEvent],
                    data: log.data,
                    topics: log.topics,
                }) as unknown as { args: { patient: string; ailment: string; reason: string } };

                if (decodedLog.args) {
                    const { patient, ailment, reason } = decodedLog.args;
                    
                    const newEntry: PatientRegisteredLog = {
                        patient: patient as `0x${string}`,
                        ailment,
                        reason,
                        transactionHash: log.transactionHash!,
                        blockNumber: log.blockNumber!,
                    };

                    if (!registeredPatients.some(entry => entry.transactionHash === log.transactionHash)) {
                        newPatients.push(newEntry);
                    }
                }
            } catch (err) {
                console.error('Error processing log:', err);
            }
        }

        if (newPatients.length > 0) {
            setRegisteredPatients(prev => [...prev, ...newPatients]);
        }
    };

    useEffect(() => {
        const fetchPastEvents = async () => {
            try {
                const currentBlock = await publicClient.getBlockNumber();
                const fromBlock = currentBlock > BLOCKS_TO_FETCH ? currentBlock - BLOCKS_TO_FETCH : 0n;

                const logs = await fetchEventsForRange(fromBlock, currentBlock);
                await processLogs(logs);
                setLastBlockChecked(currentBlock);
                setError(null);
            } catch (err) {
                console.error('Error fetching past events:', err);
                setError(`Error fetching past events: ${err instanceof Error ? err.message : String(err)}`);
            }
        };

        fetchPastEvents();
    }, [publicClient]);

    useEffect(() => {
        if (!lastBlockChecked || !isPolling) return;

        const pollForEvents = async () => {
            try {
                const currentBlock = await publicClient.getBlockNumber();

                if (currentBlock > lastBlockChecked) {
                    const logs = await fetchEventsForRange(lastBlockChecked + 1n, currentBlock);
                    await processLogs(logs);
                    setLastBlockChecked(currentBlock);
                    setError(null);
                }
            } catch (err) {
                console.error('Error polling for events:', err);
                setError(`Error polling for events: ${err instanceof Error ? err.message : String(err)}`);
            }
        };

        const intervalId = setInterval(pollForEvents, POLLING_INTERVAL);

        return () => {
            clearInterval(intervalId);
        };
    }, [lastBlockChecked, publicClient, isPolling]);

    useWatchContractEvent({
        address: contractHRC.address as `0x${string}`,
        abi: contractHRC.abi,
        eventName: 'PatientRegistered',
        onLogs(logs) {
            setIsPolling(false); // Disable polling when websocket works
            processLogs(logs as Log[]);
        },
        onError(error) {
            console.warn('Event watching error (falling back to polling):', error);
            setIsPolling(true); // Enable polling on websocket error
        },
    });

    const truncateHash = (hash: string) => `${hash.slice(0, 6)}...${hash.slice(-4)}`;
    const getExplorerUrl = (hash: string) => `https://sepolia.basescan.org/tx/${hash}`;

    return (
        <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Registered Patients</h3>
            {error && <p className="text-red-500">Error: {error}</p>}
            {registeredPatients.length > 0 ? (
                <ul className="space-y-2">
                    {registeredPatients.map((patient, index) => (
                        <li key={`${patient.transactionHash}-${index}`} className="text-gray-800 dark:text-white break-all bg-gray-50 dark:bg-gray-700 p-3 rounded">
                            <p>
                                <strong>Patient:</strong> {patient.patient} | <strong>Ailment:</strong> {patient.ailment} | <strong>Reason:</strong> {patient.reason}
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
                                | <strong>Block:</strong> {patient.blockNumber.toString()}
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-lg text-gray-600 dark:text-gray-300">No patients registered yet.</p>
            )}
        </div>
    );
};

export default RegisteredPatientsListener;



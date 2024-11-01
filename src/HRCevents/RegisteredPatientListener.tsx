import { useState, useEffect } from 'react';
import { usePublicClient, useWatchContractEvent } from 'wagmi';
import { contractHRC } from '../contracts';
import { Log, decodeEventLog } from 'viem';

interface PatientRegisteredLog {
    patient: `0x${string}`;
    ailment: string;
    reason: string;
    transactionHash: string;
    blockNumber: bigint;
}

const POLLING_INTERVAL = 5000; // 5 seconds

const RegisteredPatientsListener = () => {
    const [registeredPatients, setRegisteredPatients] = useState<PatientRegisteredLog[]>([]);
    const [lastBlockChecked, setLastBlockChecked] = useState<bigint | null>(null);
    const [error, setError] = useState<string | null>(null);
    const publicClient = usePublicClient();

    const fetchEventsForRange = async (fromBlock: bigint, toBlock: bigint) => {
        try {
            const logs = await publicClient.getLogs({
                address: contractHRC.address as `0x${string}`,
                event: {
                    name: 'PatientRegistered',
                    type: 'event',
                    inputs: [
                        { indexed: false, name: 'patient', type: 'address' },
                        { indexed: false, name: 'ailment', type: 'string' },
                        { indexed: false, name: 'reason', type: 'string' },
                    ],
                },
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
        for (const log of logs) {
            try {
                const decodedLog = decodeEventLog({
                    abi: contractHRC.abi,
                    data: log.data,
                    topics: log.topics,
                }) as unknown as { args: { patient: string; ailment: string; reason: string } };

                if (decodedLog.args) {
                    const { patient, ailment, reason } = decodedLog.args;

                    if (!registeredPatients.some(entry => entry.transactionHash === log.transactionHash)) {
                        const newEntry: PatientRegisteredLog = {
                            patient: patient as `0x${string}`,
                            ailment,
                            reason,
                            transactionHash: log.transactionHash!,
                            blockNumber: log.blockNumber!,
                        };
                        setRegisteredPatients(prev => [...prev, newEntry]);
                    }
                }
            } catch (err) {
                console.error('Error processing log:', err);
            }
        }
    };

    useEffect(() => {
        const fetchPastEvents = async () => {
            try {
                const currentBlock = await publicClient.getBlockNumber();
                const fromBlock = currentBlock > 100n ? currentBlock - 100n : 0n;

                const logs = await fetchEventsForRange(fromBlock, currentBlock);
                await processLogs(logs);
                setLastBlockChecked(currentBlock);
            } catch (err) {
                console.error('Error fetching past events:', err);
                setError(`Error fetching past events: ${err instanceof Error ? err.message : String(err)}`);
            }
        };

        fetchPastEvents();
    }, [publicClient]);

    useEffect(() => {
        if (!lastBlockChecked) return;

        const pollForEvents = async () => {
            try {
                const currentBlock = await publicClient.getBlockNumber();

                if (currentBlock > lastBlockChecked) {
                    const logs = await fetchEventsForRange(lastBlockChecked + 1n, currentBlock);
                    await processLogs(logs);
                    setLastBlockChecked(currentBlock);
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
    }, [lastBlockChecked, publicClient]);

    useWatchContractEvent({
        address: contractHRC.address as `0x${string}`,
        abi: contractHRC.abi,
        eventName: 'PatientRegistered',
        onLogs(logs) {
            processLogs(logs as Log[]);
        },
        onError(error) {
            console.warn('Event watching error (falling back to polling):', error);
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


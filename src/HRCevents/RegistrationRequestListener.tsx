import { useState, useEffect } from 'react';
import { usePublicClient, useWatchContractEvent } from 'wagmi';
import { contractHRC } from '../contracts';
import { Log, decodeEventLog, AbiEvent } from 'viem';

// interface PatientRegistrationRequestedLog extends Log {
//     args: {
//         patient: `0x${string}`;
//         ailment: string;
//         reason: string;
//     };
// }

const POLLING_INTERVAL = 5000; // 5 seconds
const BLOCKS_TO_FETCH = 100n;

// Define the event structure
const PatientRegistrationRequestedEvent = {
    type: 'event',
    name: 'PatientRegistrationRequested',
    inputs: [
        { indexed: true, name: 'patient', type: 'address' },
        { indexed: false, name: 'ailment', type: 'string' },
        { indexed: false, name: 'reason', type: 'string' },
    ],
} as const satisfies AbiEvent;

const RegistrationRequestsListener = () => {
    const [registrationRequests, setRegistrationRequests] = useState<Array<{ patient: `0x${string}`; ailment: string; reason: string; transactionHash: string }>>([]);
    const [lastBlockChecked, setLastBlockChecked] = useState<bigint | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPolling, setIsPolling] = useState(true); // Start with polling as default
    const publicClient = usePublicClient();

    const fetchEventsForRange = async (fromBlock: bigint, toBlock: bigint) => {
        try {
            const logs = await publicClient.getLogs({
                address: contractHRC.address as `0x${string}`,
                event: PatientRegistrationRequestedEvent,
                fromBlock,
                toBlock,
            });
            return logs;
        } catch (err) {
            console.error('Error fetching registration requests events:', err);
            throw err;
        }
    };

    const processLogs = async (logs: Log[]) => {
        logs.forEach((log) => {
            try {
                const decodedLog = decodeEventLog({
                    abi: [PatientRegistrationRequestedEvent],
                    data: log.data,
                    topics: log.topics,
                }) as unknown as { args: { patient: string; ailment: string; reason: string } };

                if (decodedLog.args) {
                    const newRequest = {
                        patient: decodedLog.args.patient as `0x${string}`,
                        ailment: decodedLog.args.ailment,
                        reason: decodedLog.args.reason,
                        transactionHash: log.transactionHash!,
                    };

                    // Display as an alert
                    alert(`New Registration Request:\nPatient: ${newRequest.patient}\nAilment: ${newRequest.ailment}\nReason: ${newRequest.reason}\nTransaction: ${newRequest.transactionHash}`);

                    // Log to the console
                    console.log('New Registration Request:', newRequest);

                    // Add the new request to the state
                    setRegistrationRequests((prevRequests) => [...prevRequests, newRequest]);
                }
            } catch (err) {
                console.error('Error processing log:', err);
            }
        });
    };

    // Initial fetch of past events
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

    // Polling mechanism
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
        eventName: 'PatientRegistrationRequested',
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
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Registration Requests</h3>
            {error && <p className="text-red-500">Error: {error}</p>}
            {registrationRequests.length > 0 ? (
                <ul className="space-y-2">
                    {registrationRequests.map((request, index) => (
                        <li key={`${request.patient}-${index}`} className="text-gray-800 dark:text-white break-all bg-gray-50 dark:bg-gray-700 p-3 rounded">
                            <p>
                                <strong>Patient:</strong> {request.patient} | <strong>Ailment:</strong> {request.ailment} | <strong>Reason:</strong> {request.reason}
                            </p>
                            <p>
                                <strong>Transaction:</strong> 
                                <a 
                                    href={getExplorerUrl(request.transactionHash)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400"
                                >
                                    {truncateHash(request.transactionHash)}
                                </a>
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-lg text-gray-600 dark:text-gray-300">No registration requests yet.</p>
            )}
        </div>
    );
};

export default RegistrationRequestsListener;

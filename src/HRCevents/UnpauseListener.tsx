// UnpausedEventListener.tsx
import { useState, useEffect } from 'react';
import { usePublicClient, useWatchContractEvent } from 'wagmi';
import { contractHRC } from '../contracts';
import { Log, decodeEventLog } from 'viem';

interface UnpausedEvent {
    account: `0x${string}`;
    transactionHash: `0x${string}`;
    blockNumber: bigint;
    timestamp?: number;
}

const POLLING_INTERVAL = 5000;

const UnpausedEventListener = () => {
    const [unpausedEvents, setUnpausedEvents] = useState<UnpausedEvent[]>([]);
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastBlockChecked, setLastBlockChecked] = useState<bigint | null>(null);
    const publicClient = usePublicClient();

    const fetchEventsForRange = async (fromBlock: bigint, toBlock: bigint) => {
        try {
            const logs = await publicClient.getLogs({
                address: contractHRC.address as `0x${string}`,
                event: {
                    name: 'Unpaused',
                    type: 'event',
                    inputs: [
                        {
                            indexed: false,
                            name: 'account',
                            type: 'address',
                        },
                    ],
                },
                fromBlock,
                toBlock,
            });
            return logs;
        } catch (err) {
            console.error('Error fetching events:', err);
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
                });
                const account = (decodedLog.args && typeof decodedLog.args === 'object' && 'account' in decodedLog.args)
                    ? (decodedLog.args as { account: `0x${string}` }).account
                    : null;

                if (!account) continue;

                if (
                    log.transactionHash &&
                    log.blockNumber !== null &&
                    !unpausedEvents.some(event => event.transactionHash === log.transactionHash)
                ) {
                    const block = await publicClient.getBlock({ blockHash: log.blockHash! });
                    const newEvent: UnpausedEvent = {
                        account,
                        transactionHash: log.transactionHash!,
                        blockNumber: log.blockNumber!,
                        timestamp: Number(block.timestamp),
                    };
                    setUnpausedEvents(prevEvents => [...prevEvents, newEvent]);
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
                setIsListening(true);
            } catch (err) {
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
                setError(`Error polling for events: ${err instanceof Error ? err.message : String(err)}`);
            }
        };
        const intervalId = setInterval(pollForEvents, POLLING_INTERVAL);
        return () => clearInterval(intervalId);
    }, [lastBlockChecked, publicClient]);

    useWatchContractEvent({
        address: contractHRC.address as `0x${string}`,
        abi: contractHRC.abi,
        eventName: 'Unpaused',
        onLogs(logs) {
            processLogs(logs as Log[]);
        },
    });

    const formatTimestamp = (timestamp: number) => new Date(timestamp * 1000).toLocaleString();
    const truncateHash = (hash: string) => `${hash.slice(0, 6)}...${hash.slice(-4)}`;
    const getExplorerUrl = (hash: string) => `https://sepolia.basescan.org/tx/${hash}`;

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full max-w-full mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Unpaused Events</h2>

            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Status: {isListening ? (
                    <span className="text-green-500">Monitoring for events (Block: {lastBlockChecked?.toString()})</span>
                ) : (
                    <span className="text-yellow-500">Setting up monitoring...</span>
                )}
                <p>Contract Address: {contractHRC.address}</p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded">
                    {error}
                </div>
            )}
            
            {unpausedEvents.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto text-sm">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700">
                                <th className="px-4 py-2 text-left">Time</th>
                                <th className="px-4 py-2 text-left">Account</th>
                                <th className="px-4 py-2 text-left">Transaction</th>
                                <th className="px-4 py-2 text-left">Block</th>
                            </tr>
                        </thead>
                        <tbody>
                            {unpausedEvents.map((event, index) => (
                                <tr 
                                    key={event.transactionHash} 
                                    className={`${
                                        index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'
                                    } border-b dark:border-gray-700`}
                                >
                                    <td className="px-4 py-2 whitespace-nowrap">{event.timestamp ? formatTimestamp(event.timestamp) : 'Processing...'}</td>
                                    <td className="px-4 py-2 font-mono whitespace-nowrap">{truncateHash(event.account)}</td>
                                    <td className="px-4 py-2 font-mono whitespace-nowrap">
                                        <a 
                                            href={getExplorerUrl(event.transactionHash)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400"
                                        >
                                            {truncateHash(event.transactionHash)}
                                        </a>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">{event.blockNumber.toString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-lg text-gray-600 dark:text-gray-300">
                    No unpause events detected yet.
                </p>
            )}
        </div>
    );
};

export default UnpausedEventListener;

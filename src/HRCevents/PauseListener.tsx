// import { useState, useEffect } from 'react';
// import { usePublicClient, useWatchContractEvent } from 'wagmi';
// import { contractHRC } from '../contracts';
// import { Log, decodeEventLog } from 'viem';

// interface PausedLog extends Log {
//     args: {
//         account: `0x${string}`;
//     };
// }

// const POLLING_INTERVAL = 5000; // 5 seconds

// const PausedEventListener = () => {
//     const [pausedAccounts, setPausedAccounts] = useState<`0x${string}`[]>([]);
//     const [isListening, setIsListening] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [lastBlockChecked, setLastBlockChecked] = useState<bigint | null>(null);
//     const publicClient = usePublicClient();

//     // Function to fetch events for a block range
//     const fetchEventsForRange = async (fromBlock: bigint, toBlock: bigint) => {
//         try {
//             console.log(`Fetching events from block ${fromBlock} to ${toBlock}`);
            
//             const logs = await publicClient.getLogs({
//                 address: contractHRC.address as `0x${string}`,
//                 event: {
//                     name: 'Paused',
//                     type: 'event',
//                     inputs: [
//                         {
//                             indexed: false,
//                             name: 'account',
//                             type: 'address',
//                         },
//                     ],
//                 },
//                 fromBlock,
//                 toBlock,
//             });

//             return logs;
//         } catch (err) {
//             console.error('Error fetching events:', err);
//             throw err;
//         }
//     };

//     // Function to process logs
//     const processLogs = (logs: Log[]) => {
//         logs.forEach((log) => {
//             try {
//                 // Decode the log
//                 const decodedLog = decodeEventLog({
//                     abi: contractHRC.abi,
//                     data: log.data,
//                     topics: log.topics,
//                 });

//                 const account = decodedLog.args.account as `0x${string}`;
                
//                 if (account && !pausedAccounts.includes(account)) {
//                     console.log('New paused account detected:', account);
//                     setPausedAccounts((prevAccounts) => [...prevAccounts, account]);
//                 }
//             } catch (err) {
//                 console.error('Error processing log:', err);
//             }
//         });
//     };

//     // Initial fetch of past events
//     useEffect(() => {
//         const fetchPastEvents = async () => {
//             try {
//                 console.log('Fetching past events...');
//                 console.log('Contract Address:', contractHRC.address);

//                 const currentBlock = await publicClient.getBlockNumber();
//                 // Start from 100 blocks ago or 0
//                 const fromBlock = currentBlock > 100n ? currentBlock - 100n : 0n;
                
//                 const logs = await fetchEventsForRange(fromBlock, currentBlock);
//                 console.log('Past logs found:', logs);
                
//                 processLogs(logs);
//                 setLastBlockChecked(currentBlock);
//                 setIsListening(true);
//             } catch (err) {
//                 console.error('Error fetching past events:', err);
//                 setError(`Error fetching past events: ${err instanceof Error ? err.message : String(err)}`);
//             }
//         };

//         fetchPastEvents();
//     }, [publicClient]);

//     // Polling mechanism for new events
//     useEffect(() => {
//         if (!lastBlockChecked) return;

//         const pollForEvents = async () => {
//             try {
//                 const currentBlock = await publicClient.getBlockNumber();
                
//                 if (currentBlock > lastBlockChecked) {
//                     const logs = await fetchEventsForRange(lastBlockChecked + 1n, currentBlock);
//                     processLogs(logs);
//                     setLastBlockChecked(currentBlock);
//                 }
//             } catch (err) {
//                 console.error('Error polling for events:', err);
//                 setError(`Error polling for events: ${err instanceof Error ? err.message : String(err)}`);
//             }
//         };

//         const intervalId = setInterval(pollForEvents, POLLING_INTERVAL);

//         return () => {
//             clearInterval(intervalId);
//         };
//     }, [lastBlockChecked, publicClient]);

//     // Watch for new events as backup
//     useWatchContractEvent({
//         address: contractHRC.address as `0x${string}`,
//         abi: contractHRC.abi,
//         eventName: 'Paused',
//         onLogs(logs) {
//             console.log('New event detected via watching:', logs);
//             processLogs(logs as Log[]);
//         },
//         onError(error) {
//             console.warn('Event watching error (falling back to polling):', error);
//             // Don't set error state here as we're using polling as fallback
//         },
//     });

//     return (
//         <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
//             <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
//                 Paused Accounts
//             </h2>
            
//             {/* Status indicator */}
//             <div className="mb-4">
//                 <p className="text-sm text-gray-600 dark:text-gray-400">
//                     Status: {isListening ? (
//                         <span className="text-green-500">Monitoring for events (Block: {lastBlockChecked?.toString()})</span>
//                     ) : (
//                         <span className="text-yellow-500">Setting up monitoring...</span>
//                     )}
//                 </p>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">
//                     Contract Address: {contractHRC.address}
//                 </p>
//             </div>

//             {/* Error display */}
//             {error && (
//                 <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded">
//                     {error}
//                 </div>
//             )}
            
//             {/* Accounts list */}
//             {pausedAccounts.length > 0 ? (
//                 <ul className="space-y-2">
//                     {pausedAccounts.map((account, index) => (
//                         <li 
//                             key={`${account}-${index}`} 
//                             className="text-gray-800 dark:text-white break-all bg-gray-50 dark:bg-gray-700 p-3 rounded"
//                         >
//                             {account}
//                         </li>
//                     ))}
//                 </ul>
//             ) : (
//                 <p className="text-lg text-gray-600 dark:text-gray-300">
//                     No accounts have triggered the pause event yet.
//                 </p>
//             )}
//         </div>
//     );
// };

// export default PausedEventListener;

import { useState, useEffect } from 'react';
import { usePublicClient, useWatchContractEvent } from 'wagmi';
import { contractHRC } from '../contracts';
import { Log, decodeEventLog } from 'viem';

interface PausedEvent {
    account: `0x${string}`;
    transactionHash: `0x${string}`;
    blockNumber: bigint;
    timestamp?: number;
}

const POLLING_INTERVAL = 5000; // 5 seconds

const PausedEventListener = () => {
    const [pausedEvents, setPausedEvents] = useState<PausedEvent[]>([]);
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastBlockChecked, setLastBlockChecked] = useState<bigint | null>(null);
    const publicClient = usePublicClient();

    // Function to fetch events for a block range
    const fetchEventsForRange = async (fromBlock: bigint, toBlock: bigint) => {
        try {
            console.log(`Fetching events from block ${fromBlock} to ${toBlock}`);
            
            const logs = await publicClient.getLogs({
                address: contractHRC.address as `0x${string}`,
                event: {
                    name: 'Paused',
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
                // Decode the log
                const decodedLog = decodeEventLog({
                    abi: contractHRC.abi,
                    data: log.data,
                    topics: log.topics,
                });
    
                // Ensure that decodedLog.args is defined and has an 'account' property
                const account = (decodedLog.args && typeof decodedLog.args === 'object' && 'account' in decodedLog.args)
                    ? (decodedLog.args as { account: `0x${string}` }).account
                    : null;
    
                // Skip processing if account is not present
                if (!account) continue;
    
                // Only process if we haven't seen this transaction hash before and log values are not null
                if (
                    log.transactionHash &&
                    log.blockNumber !== null &&
                    !pausedEvents.some(event => event.transactionHash === log.transactionHash)
                ) {
                    // Get block timestamp
                    const block = await publicClient.getBlock({
                        blockHash: log.blockHash!,
                    });
    
                    const newEvent: PausedEvent = {
                        account,
                        transactionHash: log.transactionHash!,
                        blockNumber: log.blockNumber!,
                        timestamp: Number(block.timestamp),
                    };
    
                    console.log('New paused event detected:', newEvent);
                    setPausedEvents(prevEvents => [...prevEvents, newEvent]);
                }
            } catch (err) {
                console.error('Error processing log:', err);
            }
        }
    };
    
    

    // Initial fetch of past events
    useEffect(() => {
        const fetchPastEvents = async () => {
            try {
                console.log('Fetching past events...');
                console.log('Contract Address:', contractHRC.address);

                const currentBlock = await publicClient.getBlockNumber();
                // Start from 100 blocks ago or 0
                const fromBlock = currentBlock > 100n ? currentBlock - 100n : 0n;
                
                const logs = await fetchEventsForRange(fromBlock, currentBlock);
                console.log('Past logs found:', logs);
                
                await processLogs(logs);
                setLastBlockChecked(currentBlock);
                setIsListening(true);
            } catch (err) {
                console.error('Error fetching past events:', err);
                setError(`Error fetching past events: ${err instanceof Error ? err.message : String(err)}`);
            }
        };

        fetchPastEvents();
    }, [publicClient]);

    // Polling mechanism for new events
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

    // Watch for new events as backup
    useWatchContractEvent({
        address: contractHRC.address as `0x${string}`,
        abi: contractHRC.abi,
        eventName: 'Paused',
        onLogs(logs) {
            console.log('New event detected via watching:', logs);
            processLogs(logs as Log[]);
        },
        onError(error) {
            console.warn('Event watching error (falling back to polling):', error);
        },
    });

    // Function to format timestamp
    const formatTimestamp = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString();
    };

    // Function to truncate hash
    const truncateHash = (hash: string) => {
        return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
    };

    // Function to get explorer URL
    const getExplorerUrl = (hash: string) => {
        return `https://sepolia.basescan.org/tx/${hash}`;
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                Paused Events
            </h2>
            
            {/* Status indicator */}
            <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Status: {isListening ? (
                        <span className="text-green-500">Monitoring for events (Block: {lastBlockChecked?.toString()})</span>
                    ) : (
                        <span className="text-yellow-500">Setting up monitoring...</span>
                    )}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Contract Address: {contractHRC.address}
                </p>
            </div>

            {/* Error display */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded">
                    {error}
                </div>
            )}
            
            {/* Events list */}
            {pausedEvents.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700">
                                <th className="px-4 py-2 text-left">Time</th>
                                <th className="px-4 py-2 text-left">Account</th>
                                <th className="px-4 py-2 text-left">Transaction</th>
                                <th className="px-4 py-2 text-left">Block</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pausedEvents.map((event, index) => (
                                <tr 
                                    key={event.transactionHash} 
                                    className={`${
                                        index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'
                                    } border-b dark:border-gray-700`}
                                >
                                    <td className="px-4 py-2 text-sm">
                                        {event.timestamp ? formatTimestamp(event.timestamp) : 'Processing...'}
                                    </td>
                                    <td className="px-4 py-2 font-mono text-sm">
                                        {truncateHash(event.account)}
                                    </td>
                                    <td className="px-4 py-2 font-mono text-sm">
                                        <a 
                                            href={getExplorerUrl(event.transactionHash)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400"
                                        >
                                            {truncateHash(event.transactionHash)}
                                        </a>
                                    </td>
                                    <td className="px-4 py-2 text-sm">
                                        {event.blockNumber.toString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-lg text-gray-600 dark:text-gray-300">
                    No pause events detected yet.
                </p>
            )}
        </div>
    );
};

export default PausedEventListener;




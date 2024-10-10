import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { contractSS } from '../contracts';

const CheckTakenSlots = () => {
    const [slotId, setSlotId] = useState('');
    const [isTaken, setIsTaken] = useState<boolean | null>(null);
    const [fetchStatus, setFetchStatus] = useState('');

    const { data, isError, isLoading } = useReadContract({
        ...contractSS,
        functionName: 'takenSlots',
        args: [BigInt(slotId || '0')],
        address: contractSS.address as `0x${string}`,
    });

    const handleFetchSlotStatus = () => {
        if (data !== undefined) {
            setIsTaken(data as boolean);
            setFetchStatus('Slot status fetched successfully');
        } else {
            setFetchStatus('Error fetching slot status');
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching slot status</div>;

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Check Slot Status</h2>
            <div className="mb-4">
                <input
                    type="number"
                    value={slotId}
                    onChange={(e) => setSlotId(e.target.value)}
                    placeholder="Enter slot ID"
                    className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
            </div>
            <button
                onClick={handleFetchSlotStatus}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300"
            >
                Check Slot Status
            </button>
            {fetchStatus && <p className="mt-4 text-lg text-center">{fetchStatus}</p>}
            {isTaken !== null && (
                <div className="mt-6">
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                        Slot is {isTaken ? 'Taken' : 'Available'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default CheckTakenSlots;

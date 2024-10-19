import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { contractHRC } from '../contracts';

const DeactivateRecord = () => {
    const [recordId, setRecordId] = useState('');
    const [deactivationStatus, setDeactivationStatus] = useState('');

    const { writeContract, data: hash, error, isPending } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } = 
        useWaitForTransactionReceipt({
            hash,
        });

    const handleDeactivateRecord = async () => {
        if (!recordId || isNaN(Number(recordId))) {
            setDeactivationStatus('Please enter a valid record ID');
            return;
        }

        try {
            await writeContract({
                address: contractHRC.address as `0x${string}`,
                abi: contractHRC.abi,
                functionName: 'deactivateRecord',
                args: [BigInt(recordId)],
            });
            setDeactivationStatus('Record deactivation request sent');
        } catch (error) {
            console.error('Error deactivating record:', error);
            setDeactivationStatus('Error deactivating record');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full mx-auto max-w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Deactivate Health Record</h2>
            <div className="mb-4">
                <input
                    type="number"
                    value={recordId}
                    onChange={(e) => setRecordId(e.target.value)}
                    placeholder="Enter record ID"
                    className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
            </div>
            <button
                onClick={handleDeactivateRecord}
                disabled={isPending || isConfirming}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? 'Sending...' : isConfirming ? 'Confirming...' : 'Deactivate Record'}
            </button>
            {isConfirmed && <p className="mt-4 text-lg text-center text-green-600">Record deactivated successfully!</p>}
            {error && <p className="mt-4 text-lg text-center text-red-600">Error: {error.message}</p>}
            {deactivationStatus && <p className="mt-4 text-lg text-center">{deactivationStatus}</p>}
        </div>
    );
};

export default DeactivateRecord;
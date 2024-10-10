// import { useState } from 'react';
// import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
// import contract from '../contracts';

// const UpdateHealthRecord = () => {
//     const [recordId, setRecordId] = useState('');
//     const [newIpfsHash, setNewIpfsHash] = useState('');
//     const [updateStatus, setUpdateStatus] = useState('');

//     // Prepare for the transaction using the write hook
//     const { writeContract, data: transactionHash, error, isPending } = useWriteContract();

//     // Wait for the transaction confirmation
//     const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
//         hash: transactionHash,
//     });

//     // Function to handle the health record update
//     const handleUpdateHealthRecord = async () => {
//         if (!recordId || !newIpfsHash) {
//             setUpdateStatus('Please provide a valid record ID and IPFS hash.');
//             return;
//         }

//         try {
//             const result = await writeContract({
//                 address: contract.address as `0x${string}`,
//                 abi: contract.abi,
//                 functionName: 'updateHealthRecord',
//                 args: [parseInt(recordId), newIpfsHash],  // Passing the recordId as a uint256
//             });
//             console.log('Transaction hash:', result);
//             setUpdateStatus('Update request sent. Transaction hash: ' + result);
//         } catch (err) {
//             console.error('Error updating health record:', err);
//             setUpdateStatus('Error updating health record: ' + (err instanceof Error ? err.message : String(err)));
//         }
//     };

//     return (
//         <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
//             <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Update Health Record</h2>
//             <div className="mb-4">
//                 <input
//                     type="text"
//                     value={recordId}
//                     onChange={(e) => setRecordId(e.target.value)}
//                     placeholder="Enter record ID"
//                     className="w-full px-3 py-2 mb-3 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
//                 />
//                 <input
//                     type="text"
//                     value={newIpfsHash}
//                     onChange={(e) => setNewIpfsHash(e.target.value)}
//                     placeholder="Enter new IPFS hash"
//                     className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
//                 />
//             </div>
//             <button
//                 onClick={handleUpdateHealthRecord}
//                 disabled={isPending || isConfirming}
//                 className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//                 {isPending ? 'Updating...' : isConfirming ? 'Confirming...' : 'Update Health Record'}
//             </button>
//             {isConfirmed && <p className="mt-4 text-lg text-center text-green-600">Health record updated successfully!</p>}
//             {error && <p className="mt-4 text-lg text-center text-red-600">Error: {error.message}</p>}
//             {updateStatus && <p className="mt-4 text-lg text-center">{updateStatus}</p>}
//         </div>
//     );
// };

// export default UpdateHealthRecord;


import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { contractHRC } from '../contracts';

const UpdateHealthRecord = () => {
    const [recordId, setRecordId] = useState('');
    const [newIpfsHash, setNewIpfsHash] = useState('');
    const [updateStatus, setUpdateStatus] = useState('');

    // Prepare for the transaction using the write hook
    const { writeContract, data: transactionHash, error, isPending } = useWriteContract();

    // Wait for the transaction confirmation
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: transactionHash,
    });

    // Function to handle the health record update
    const handleUpdateHealthRecord = async () => {
        if (!recordId || !newIpfsHash) {
            setUpdateStatus('Please provide a valid record ID and IPFS hash.');
            return;
        }

        try {
            const result = await writeContract({
                address: contractHRC.address as `0x${string}`,
                abi: contractHRC.abi,
                functionName: 'updateHealthRecord',
                args: [parseInt(recordId), newIpfsHash],  // Passing the recordId as a uint256
            });
            console.log('Transaction hash:', result);
            setUpdateStatus('Update request sent. Transaction hash: ' + result);
        } catch (err) {
            console.error('Error updating health record:', err);
            setUpdateStatus('Error updating health record: ' + (err instanceof Error ? err.message : String(err)));
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Update Health Record</h2>
            <div className="mb-4">
                <input
                    type="text"
                    value={recordId}
                    onChange={(e) => setRecordId(e.target.value)}
                    placeholder="Enter record ID"
                    className="w-full px-3 py-2 mb-3 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
                <input
                    type="text"
                    value={newIpfsHash}
                    onChange={(e) => setNewIpfsHash(e.target.value)}
                    placeholder="Enter new IPFS hash"
                    className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
            </div>
            <button
                onClick={handleUpdateHealthRecord}
                disabled={isPending || isConfirming}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? 'Sending...' : isConfirming ? 'Confirming...' : 'Update Health Record'}
            </button>
            {isConfirmed && <p className="mt-4 text-lg text-center text-green-600">Health record updated successfully!</p>}
            {error && <p className="mt-4 text-lg text-center text-red-600">Error: {error.message}</p>}
            {updateStatus && <p className="mt-4 text-lg text-center">{updateStatus}</p>}
        </div>
    );
};

export default UpdateHealthRecord;


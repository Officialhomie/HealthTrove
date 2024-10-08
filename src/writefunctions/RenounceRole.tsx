import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { keccak256, toBytes } from 'viem';
import contract from '../contracts';

const RenounceRole = () => {
    const [roleType, setRoleType] = useState('');
    const [renounceStatus, setRenounceStatus] = useState('');

    const { address } = useAccount();
    const { writeContract, data: hash, error, isPending } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } = 
        useWaitForTransactionReceipt({
            hash,
        });

    const handleRenounceRole = async () => {
        if (!roleType) {
            setRenounceStatus('Please enter a role type');
            return;
        }

        if (!address) {
            setRenounceStatus('Please connect your wallet');
            return;
        }

        try {
            const roleHash = keccak256(toBytes(roleType));
            await writeContract({
                address: contract.address as `0x${string}`,
                abi: contract.abi,
                functionName: 'renounceRole',
                args: [roleHash, address],
            });
            setRenounceStatus('Role renounce request sent');
        } catch (error) {
            console.error('Error renouncing role:', error);
            setRenounceStatus('Error renouncing role');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Renounce Role</h2>
            <div className="mb-4">
                <input
                    type="text"
                    value={roleType}
                    onChange={(e) => setRoleType(e.target.value)}
                    placeholder="Enter role type (e.g., ADMIN_ROLE)"
                    className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
            </div>
            <button
                onClick={handleRenounceRole}
                disabled={isPending || isConfirming || !address}
                className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? 'Renouncing...' : isConfirming ? 'Confirming...' : 'Renounce Role'}
            </button>
            {isConfirmed && <p className="mt-4 text-lg text-center text-green-600">Role renounced successfully!</p>}
            {error && <p className="mt-4 text-lg text-center text-red-600">Error: {error.message}</p>}
            {renounceStatus && <p className="mt-4 text-lg text-center">{renounceStatus}</p>}
            {!address && <p className="mt-4 text-lg text-center text-yellow-600">Please connect your wallet to renounce a role.</p>}
        </div>
    );
};

export default RenounceRole;
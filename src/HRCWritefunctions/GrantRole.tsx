import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { keccak256, toBytes, stringToHex } from 'viem';
import { contractHRC } from '../contracts';

const GrantRole = () => {
    const [roleType, setRoleType] = useState('');
    const [accountAddress, setAccountAddress] = useState('');
    const [grantStatus, setGrantStatus] = useState('');

    const { writeContract, data: hash, error, isPending } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } = 
        useWaitForTransactionReceipt({
            hash,
        });

    const handleGrantRole = async () => {
        if (!roleType || !accountAddress) {
            setGrantStatus('Please enter both role type and account address');
            return;
        }

        if (!/^0x[a-fA-F0-9]{40}$/.test(accountAddress)) {
            setGrantStatus('Please enter a valid Ethereum address');
            return;
        }

        try {
            const roleHash = keccak256(toBytes(stringToHex(roleType)));
            await writeContract({
                address: contractHRC.address as `0x${string}`,
                abi: contractHRC.abi,
                functionName: 'grantRole',
                args: [roleHash, accountAddress],
            });
            setGrantStatus('Role grant request sent');
            // Clear input fields after successful query
            setRoleType('');
            setAccountAddress('');
        } catch (error) {
            console.error('Error granting role:', error);
            setGrantStatus('Error granting role');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Grant Role</h2>
            <div className="mb-4">
                <input
                    type="text"
                    value={roleType}
                    onChange={(e) => setRoleType(e.target.value)}
                    placeholder="Enter role type (e.g., ADMIN_ROLE)"
                    className="w-full px-3 py-2 mb-3 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
                <input
                    type="text"
                    value={accountAddress}
                    onChange={(e) => setAccountAddress(e.target.value)}
                    placeholder="Enter account Ethereum address"
                    className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
            </div>
            <button
                onClick={handleGrantRole}
                disabled={isPending || isConfirming}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? 'Granting...' : isConfirming ? 'Confirming...' : 'Grant Role'}
            </button>
            {isConfirmed && <p className="mt-4 text-lg text-center text-green-600">Role granted successfully!</p>}
            {error && <p className="mt-4 text-lg text-center text-red-600">Error: {error.message}</p>}
            {grantStatus && <p className="mt-4 text-lg text-center">{grantStatus}</p>}
        </div>
    );
};

export default GrantRole;

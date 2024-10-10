import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { contractHRC } from '../contracts';

const HasRole = () => {
    const [role, setRole] = useState('');
    const [account, setAccount] = useState('');
    const [hasRole, setHasRole] = useState<boolean | null>(null);
    const [fetchStatus, setFetchStatus] = useState('');

    const { data, isError, isLoading } = useReadContract({
        ...contractHRC,
        functionName: 'hasRole',
        args: [role, account],
        address: contractHRC.address as `0x${string}`,
    });

    const handleCheckRole = () => {
        if (data !== undefined) {
            setHasRole(data as boolean);
            setFetchStatus(`Role check completed for Account: ${account} with Role: ${role}`);
        } else {
            setFetchStatus(`Failed to check role for Account: ${account} with Role: ${role}`);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching role status</div>;

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Check Role</h2>
            <div className="mb-4">
                <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Enter role (bytes32)"
                    className="w-full px-3 py-2 mb-3 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
                <input
                    type="text"
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    placeholder="Enter account address"
                    className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
            </div>
            <button
                onClick={handleCheckRole}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300"
            >
                Check Role
            </button>
            {fetchStatus && <p className="mt-4 text-lg text-center">{fetchStatus}</p>}
            {hasRole !== null && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Role Status:</h3>
                    <p className={`text-lg ${hasRole ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {hasRole ? `Account ${account} has the role ${role}.` : `Account ${account} does not have the role ${role}.`}
                    </p>
                </div>
            )}
        </div>
    );
}

export default HasRole;

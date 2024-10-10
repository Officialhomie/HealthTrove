import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { contractHRC } from '../contracts';

const GetRoleAdmin = () => {
    const [role, setRole] = useState('');
    const [adminRole, setAdminRole] = useState('');
    const [fetchStatus, setFetchStatus] = useState('');

    const { data, isError, isLoading } = useReadContract({
        ...contractHRC,
        functionName: 'getRoleAdmin',
        args: [role],
        address: contractHRC.address as `0x${string}`,
    });

    const handleFetchAdminRole = () => {
        if (data) {
            setAdminRole(data as string);
            setFetchStatus(`Admin role for ${role} fetched successfully`);
        } else {
            setFetchStatus(`No admin role found for ${role}`);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching admin role</div>;

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Get Role Admin</h2>
            <div className="mb-4">
                <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Enter role (as bytes32)"
                    className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
            </div>
            <button
                onClick={handleFetchAdminRole}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300"
            >
                Fetch Admin Role
            </button>
            {fetchStatus && <p className="mt-4 text-lg text-center">{fetchStatus}</p>}
            {adminRole && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Admin Role:</h3>
                    <p className="text-gray-700 dark:text-gray-300">{adminRole}</p>
                </div>
            )}
        </div>
    );
}

export default GetRoleAdmin;

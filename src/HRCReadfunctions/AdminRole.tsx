import { useState } from 'react';
import { useReadContract } from 'wagmi';
import contractHRC from '../contracts';

const AdminRole = () => {
    const [walletAddress, setWalletAddress] = useState('');
    const [hasAdminRole, setHasAdminRole] = useState(false);

    const { data: adminRole, isError, isLoading } = useReadContract({
        ...contractHRC,
        functionName: 'ADMIN_ROLE',
        address: contractHRC.address as `0x${string}`,
    });

    const { data: isAdmin } = useReadContract({
        ...contractHRC,
        functionName: 'hasRole',
        args: [adminRole, walletAddress],
        address: contractHRC.address as `0x${string}`,
    });

    const handleCheckRole = () => {
        if (isAdmin !== undefined) {
            setHasAdminRole(!!isAdmin);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching admin role</div>;

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Check Admin Role</h2>
            <div className="mb-4">
                <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="Enter wallet address"
                    className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
            </div>
            <button 
                onClick={handleCheckRole}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300"
            >
                Check Role
            </button>
            {walletAddress && (
                <p className={`mt-4 text-lg ${hasAdminRole ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {hasAdminRole
                        ? `${walletAddress} has admin role.`
                        : `${walletAddress} does not have admin role.`}
                </p>
            )}
        </div>
    );
}

export default AdminRole;
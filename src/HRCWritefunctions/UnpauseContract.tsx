import { useState, useEffect } from 'react';
import { useWriteContract, useReadContract, useAccount } from 'wagmi';
import { contractHRC } from '../contracts';

const UnpauseContract = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [unpauseStatus, setUnpauseStatus] = useState('');

    const { address: userAddress } = useAccount();

    // Fetch the admin role
    const { data: adminRole } = useReadContract({
        address: contractHRC.address as `0x${string}`,
        abi: contractHRC.abi,
        functionName: 'ADMIN_ROLE',
    });

    // Check if the connected user has the admin role
    const { data: hasAdminRole } = useReadContract({
        address: contractHRC.address as `0x${string}`,
        abi: contractHRC.abi,
        functionName: 'hasRole',
        args: [adminRole, userAddress],
    });

    // Check if the contract is paused
    const { data: isPaused } = useReadContract({
        address: contractHRC.address as `0x${string}`,
        abi: contractHRC.abi,
        functionName: 'paused',
    });

    useEffect(() => {
        if (adminRole && hasAdminRole) {
            setIsAdmin(Boolean(hasAdminRole));
        }
    }, [adminRole, hasAdminRole]);

    // Clear messages when address changes
    useEffect(() => {
        setUnpauseStatus('');
    }, [userAddress]);

    // Auto-clear unpause status message after 7 seconds
    useEffect(() => {
        if (unpauseStatus) {
            const timeoutId = setTimeout(() => setUnpauseStatus(''), 7000);
            return () => clearTimeout(timeoutId);
        }
    }, [unpauseStatus]);

    // Unpause contract function
    const { writeContract, isPending, isError, error } = useWriteContract();

    // Handle status changes based on contract state
    useEffect(() => {
        if (isPending) {
            setUnpauseStatus('Please confirm the transaction in your wallet...');
        } else if (isError) {
            if (
                error?.message?.includes('User denied transaction signature') || 
                error?.message?.includes('User rejected the request') ||
                error?.message?.includes('MetaMask Tx Signature: User denied')
            ) {
                setUnpauseStatus('Transaction was rejected in wallet.');
            } else {
                setUnpauseStatus(`Error: ${error?.message || 'Unknown error occurred'}`);
            }
        }
    }, [isPending, isError, error]);

    const handleUnpauseContract = async () => {
        try {
            if (!userAddress) {
                setUnpauseStatus('Please connect your wallet first.');
                return;
            }

            if (!isAdmin) {
                setUnpauseStatus('You do not have the required admin role to unpause the contract.');
                return;
            }

            if (!isPaused) {
                setUnpauseStatus('The contract is already active.');
                return;
            }

            // Reset status message
            setUnpauseStatus('Unpausing contract, please wait...');
            await writeContract({
                address: contractHRC.address as `0x${string}`,
                abi: contractHRC.abi,
                functionName: 'unpause',
            });
        } catch (err) {
            console.error('Error unpausing contract:', err);
            setUnpauseStatus('Error occurred while attempting to unpause the contract.');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-4xl mx-auto w-full md:max-w-full mb-9">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Unpause Contract</h2>
            
            <button
                onClick={handleUnpauseContract}
                disabled={!isAdmin || isPending || !userAddress}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? 'Confirming Transaction...' : 'Unpause Contract'}
            </button>

            {/* Status Messages */}
            {unpauseStatus && (
                <p className={`mt-4 text-lg text-center ${
                    unpauseStatus.includes('Error') || unpauseStatus.includes('rejected') 
                        ? 'text-red-600' 
                        : 'text-gray-600'
                }`}>
                    {unpauseStatus}
                </p>
            )}
        </div>
    );
};

export default UnpauseContract;

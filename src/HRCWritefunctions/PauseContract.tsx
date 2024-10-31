import { useState, useEffect } from 'react';
import { useWriteContract, useReadContract, useAccount } from 'wagmi';
import { contractHRC } from '../contracts';

const PauseContract = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [pauseStatus, setPauseStatus] = useState('');

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
        setPauseStatus('');
    }, [userAddress]);

    // Auto-clear pause status message after 7 seconds
    useEffect(() => {
        if (pauseStatus) {
            const timeoutId = setTimeout(() => setPauseStatus(''), 7000);
            return () => clearTimeout(timeoutId);
        }
    }, [pauseStatus]);

    // Pause contract function
    const { writeContract, isPending, isError, error } = useWriteContract();

    // Handle status changes based on contract state
    useEffect(() => {
        if (isPending) {
            setPauseStatus('Please confirm the transaction in your wallet...');
        } else if (isError) {
            if (
                error?.message?.includes('User denied transaction signature') || 
                error?.message?.includes('User rejected the request') ||
                error?.message?.includes('MetaMask Tx Signature: User denied')
            ) {
                setPauseStatus('Transaction was rejected in wallet.');
            } else {
                setPauseStatus(`Error: ${error?.message || 'Unknown error occurred'}`);
            }
        }
    }, [isPending, isError, error]);

    const handlePauseContract = async () => {
        try {
            if (!userAddress) {
                setPauseStatus('Please connect your wallet first.');
                return;
            }

            if (!isAdmin) {
                setPauseStatus('You do not have the required admin role to pause the contract.');
                return;
            }

            if (isPaused) {
                setPauseStatus('The contract is already in a paused state.');
                return;
            }

            // Reset status message
            setPauseStatus('Pausing contract, please wait...');
            await writeContract({
                address: contractHRC.address as `0x${string}`,
                abi: contractHRC.abi,
                functionName: 'pause',
            });
        } catch (err) {
            console.error('Error pausing contract:', err);
            setPauseStatus('Error occurred while attempting to pause the contract.');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-4xl mx-auto w-full md:max-w-full mb-9">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Pause Contract</h2>
            
            <button
                onClick={handlePauseContract}
                disabled={!isAdmin || isPending || !userAddress}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? 'Confirming Transaction...' : 'Pause Contract'}
            </button>

            {/* Status Messages */}
            {pauseStatus && (
                <p className={`mt-4 text-lg text-center ${
                    pauseStatus.includes('Error') || pauseStatus.includes('rejected') 
                        ? 'text-red-600' 
                        : 'text-gray-600'
                }`}>
                    {pauseStatus}
                </p>
            )}
        </div>
    );
};

export default PauseContract;

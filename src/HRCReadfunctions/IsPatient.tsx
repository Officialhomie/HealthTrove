import { useState, useEffect } from 'react';
import { useReadContract, useAccount } from 'wagmi';
import { contractHRC } from '../contracts';

const IsPatient = () => {
    const [isPatient, setIsPatient] = useState<boolean | null>(null);
    const [fetchStatus, setFetchStatus] = useState('');
    const { address, isConnected } = useAccount(); // Destructure isConnected from useAccount
    const { data, isError, isLoading } = useReadContract({
        ...contractHRC,
        functionName: 'isPatient',
        args: isConnected ? [address] : undefined, // Only query if wallet is connected
        address: contractHRC.address as `0x${string}`,
    });

    useEffect(() => {
        if (!isConnected) {
            setFetchStatus('Please connect your wallet to check patient status.');
            setIsPatient(null);
        } else if (data !== undefined) {
            setIsPatient(data as boolean);
            // Truncate address for mobile screen view
            const truncatedAddress = `${address?.substring(0, 6)}...${address?.substring(address.length - 4)}`;
            setFetchStatus(`Patient status check completed for Address: ${truncatedAddress}`);
        } else if (isError) {
            // Truncate address for mobile screen view
            const truncatedAddress = `${address?.substring(0, 6)}...${address?.substring(address.length - 4)}`;
            setFetchStatus(`Failed to check patient status for Address: ${truncatedAddress}`);
        }
    }, [data, isConnected, address, isError]);

    if (isLoading) return <div>Loading...</div>;
    // Only show error if the wallet is connected and there is an error fetching data
    if (isConnected && isError) return <div>Error fetching patient status</div>;

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full mx-auto my-10">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Check Patient Status</h2>
            {fetchStatus && <p className="mt-4 text-2xl text-left border py-3 px-2 rounded-lg bg-green-300">{fetchStatus}</p>}
            {isConnected && isPatient !== null && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Patient Status:</h3>
                    <p className={`text-lg ${isPatient ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {isPatient ? 
                        (`👍 Address ${address?.substring(0, 6)}...${address?.substring(address.length - 4)} is a registered patient.`) : 
                        (`🚫 Address ${address?.substring(0, 6)}...${address?.substring(address.length - 4)} is not a registered patient.`)}
                    </p>
                </div>
            )}
        </div>
    );
}

export default IsPatient;

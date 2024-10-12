import { useState, useEffect } from 'react';
import { useReadContract, useAccount } from 'wagmi';
import { contractHRC } from '../contracts';

const IsPatient = () => {
    const [isPatient, setIsPatient] = useState<boolean | null>(null);
    const [fetchStatus, setFetchStatus] = useState('');

    const { address } = useAccount();
    const { data, isError, isLoading } = useReadContract({
        ...contractHRC,
        functionName: 'isPatient',
        args: [address],
        address: contractHRC.address as `0x${string}`,
    });

    useEffect(() => {
        if (data !== undefined) {
            setIsPatient(data as boolean);
            setFetchStatus(`Patient status check completed for Address: ${address}`);
        } else {
            setFetchStatus(`Failed to check patient status for Address: ${address}`);
        }
    }, [data, address]);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching patient status</div>;

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full mx-auto my-10">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Check Patient Status</h2>
            {fetchStatus && <p className="mt-4 text-2xl text-left border py-3 px-2 rounded-lg bg-green-300">{fetchStatus}</p>}
            {isPatient !== null && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Patient Status:</h3>
                    <p className={`text-lg ${isPatient ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {isPatient ? 
                        (`👍 Address ${address} is a registered patient.`) : 
                        (`🚫 Address ${address} is not a registered patient.`)}
                    </p>
                </div>
            )}
        </div>
    );
}

export default IsPatient;

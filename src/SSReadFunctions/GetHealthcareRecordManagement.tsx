import { useEffect, useState } from 'react';
import { useReadContract } from 'wagmi';
import { contractSS } from '../contracts';

const GetHealthcareRecordManagement = () => {
    const [healthcareRecordAddress, setHealthcareRecordAddress] = useState<string | null>(null);
    const [fetchStatus, setFetchStatus] = useState('');

    const { data, isError, isLoading } = useReadContract({
        ...contractSS,
        functionName: 'healthcareRecordManagement',
        address: contractSS.address as `0x${string}`,
    });

    useEffect(() => {
        if (data) {
            setHealthcareRecordAddress(data as `0x${string}`);
            setFetchStatus('Healthcare record contract address fetched successfully');
        } else if (isError) {
            setFetchStatus('Error fetching contract address');
        }
    }, [data, isError]);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching contract address</div>;

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Healthcare Record Management Address</h2>
            {fetchStatus && <p className="mt-4 text-lg text-center">{fetchStatus}</p>}
            {healthcareRecordAddress && (
                <div className="mt-6">
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                        Contract Address: {healthcareRecordAddress}
                    </p>
                </div>
            )}
        </div>
    );
};

export default GetHealthcareRecordManagement;

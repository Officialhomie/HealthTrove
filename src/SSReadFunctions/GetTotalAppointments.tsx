import { useEffect, useState } from 'react';
import { useReadContract } from 'wagmi';
import { contractSS } from '../contracts';

const GetTotalAppointments = () => {
    const [totalAppointments, setTotalAppointments] = useState<number | null>(null);
    const [fetchStatus, setFetchStatus] = useState('');

    const { data, isError, isLoading } = useReadContract({
        ...contractSS,
        functionName: 'getTotalAppointments',
        address: contractSS.address as `0x${string}`,
    });

    useEffect(() => {
        if (data) {
            setTotalAppointments(Number(data));
            setFetchStatus('Total appointments fetched successfully');
        } else if (isError) {
            setFetchStatus('Error fetching total appointments');
        }
    }, [data, isError]);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching total appointments</div>;

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Total Appointments</h2>
            {fetchStatus && <p className="mt-4 text-lg text-center">{fetchStatus}</p>}
            {totalAppointments !== null && (
                <div className="mt-6">
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                        Total Appointments: {totalAppointments}
                    </p>
                </div>
            )}
        </div>
    );
};

export default GetTotalAppointments;

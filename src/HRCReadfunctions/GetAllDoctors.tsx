import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { contractHRC } from '../contracts';

const GetAllDoctors = () => {
    const [doctors, setDoctors] = useState<string[]>([]);
    const [fetchStatus, setFetchStatus] = useState('');
    const [showStatus, setShowStatus] = useState(false);
    const [showList, setShowList] = useState(false);

    const { data, isError, isLoading } = useReadContract({
        ...contractHRC,
        functionName: 'getAllDoctors',
        address: contractHRC.address as `0x${string}`,
    });

    const handleToggleDoctors = () => {
        if (!doctors.length) {
            if (data) {
                setDoctors(data as string[]);
                setFetchStatus('Doctors fetched successfully');
            } else {
                setFetchStatus('No doctors found or error fetching doctors');
            }
            setShowStatus(true);
        }
        setShowList(!showList);
    };

    useEffect(() => {
        if (showStatus) {
            const timer = setTimeout(() => {
                setShowStatus(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showStatus]);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching doctors</div>;

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Get All Doctors</h2>
            <button
                onClick={handleToggleDoctors}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300"
            >
                {showList ? 'Hide Doctors' : 'Fetch Doctors'}
            </button>
            {showStatus && (
                <p className={`mt-4 text-lg text-center transition-opacity duration-500 ${showStatus ? 'opacity-100' : 'opacity-0'}`}>
                    {fetchStatus}
                </p>
            )}
            <div className="mt-6">
                {showList && doctors.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Doctors List:</h3>
                        <ul>
                            {doctors.map((doctor, index) => (
                                <li key={index} className="mb-2">
                                    {doctor}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GetAllDoctors;

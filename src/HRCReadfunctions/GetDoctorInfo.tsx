import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { contractHRC } from '../contracts';

const GetDoctorInfo = () => {
    const [doctorAddress, setDoctorAddress] = useState('');
    const [doctorInfo, setDoctorInfo] = useState<{ name: string; specialty: string; isActive: boolean } | null>(null);
    const [fetchStatus, setFetchStatus] = useState('');
    const [errorStatus, setErrorStatus] = useState('');
    const [isFetched, setIsFetched] = useState(false);
    const [showInfo, setShowInfo] = useState(false); // New state for toggling visibility

    const { data, isError, isLoading } = useReadContract({
        ...contractHRC,
        functionName: 'getDoctorInfo',
        args: [doctorAddress],
        address: contractHRC.address as `0x${string}`,
    });

    useEffect(() => {
        if (isFetched && !isLoading) {
            if (data) {
                const [name, specialty, isActive] = data as [string, string, boolean];
                setDoctorInfo({ name, specialty, isActive });
                setFetchStatus('Doctor information fetched successfully');
                setShowInfo(true); // Show info once data is fetched
            } else {
                setFetchStatus('No doctor found or error fetching doctor information');
            }
        }

        if (isError) {
            setErrorStatus('Error fetching doctor information');
            setTimeout(() => setErrorStatus(''), 5000);
        }
    }, [isFetched, data, isError, isLoading]);

    const handleFetchDoctorInfo = () => {
        if (showInfo) {
            setShowInfo(false); // Hide the info if already shown
            setIsFetched(false); // Reset fetch state
            setDoctorInfo(null); // Clear previous info
            setFetchStatus('');
        } else {
            setIsFetched(true); // Fetch new info
            setFetchStatus('');
            setErrorStatus('');
        }
    };

    const handleDoctorAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDoctorAddress(e.target.value);
        setDoctorInfo(null);
        setFetchStatus('');
        setIsFetched(false);
        setShowInfo(false);
        setErrorStatus('');
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-full mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Check A Doctor's Info</h2>
            <div className="mb-4">
                <input
                    type="text"
                    value={doctorAddress}
                    onChange={handleDoctorAddressChange}
                    placeholder="Enter doctor address"
                    className="w-full px-3 py-2 mb-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
            </div>
            <button
                onClick={handleFetchDoctorInfo}
                disabled={!doctorAddress || isLoading}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Fetching...' : showInfo ? 'Hide Doctor Info' : 'Get Doctor Info'}
            </button>

            {fetchStatus && <p className="mt-4 text-lg text-center">{fetchStatus}</p>}
            {errorStatus && <p className="mt-4 text-lg text-center text-red-600">{errorStatus}</p>}

            {showInfo && doctorInfo && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Doctor Information:</h3>
                    <ul>
                        <li><strong>Name:</strong> {doctorInfo.name}</li>
                        <li><strong>Specialty:</strong> {doctorInfo.specialty}</li>
                        <li><strong>Status:</strong> {doctorInfo.isActive ? 'Active' : 'Inactive'}</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default GetDoctorInfo;

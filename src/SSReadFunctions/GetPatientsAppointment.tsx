import { useState, useEffect } from 'react';
import { useReadContract, useAccount } from 'wagmi';
import { contractSS } from '../contracts';

interface Appointment {
    patient: string;
    doctor: string;
    dateTime: bigint;
    treatmentDetails: string;
    isActive: boolean;
}

const GetPatientAppointments = () => {
    const { address: connectedAddress } = useAccount(); // Get the connected wallet address
    const [patientAddress, setPatientAddress] = useState('');
    const [useConnectedAddress, setUseConnectedAddress] = useState(false);
    const [appointments, setAppointments] = useState<Appointment[] | null>(null);
    const [fetchStatus, setFetchStatus] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [shouldFetch, setShouldFetch] = useState(false);

    const addressToQuery = useConnectedAddress ? connectedAddress : patientAddress;

    const { data, isError, isLoading, error: contractError } = useReadContract({
        ...contractSS,
        functionName: 'getPatientAppointments',
        args: shouldFetch && addressToQuery ? [addressToQuery as `0x${string}`] : undefined,
        address: contractSS.address as `0x${string}`,
    });

    const handleFetchAppointments = () => {
        setAppointments(null);
        setError(null);
        setFetchStatus('');

        if (!addressToQuery) {
            setError('Please provide a patient address or use the connected address');
            return;
        }

        // Validate Ethereum address format
        if (!/^0x[a-fA-F0-9]{40}$/.test(addressToQuery)) {
            setError('Invalid Ethereum address');
            return;
        }

        setShouldFetch(true); // Trigger fetching
        setFetchStatus('Fetching appointments...');
    };

    // Effect to handle setting fetched data
    useEffect(() => {
        if (shouldFetch) {
            if (isLoading) {
                setFetchStatus('Loading...');
            } else if (isError || contractError) {
                setError('Error fetching appointments');
                setFetchStatus('');
                setShouldFetch(false);
            } else if (data) {
                const fetchedAppointments = data as Appointment[];
                if (fetchedAppointments.length === 0) {
                    setFetchStatus('No appointments found');
                } else {
                    setAppointments(fetchedAppointments);
                    setFetchStatus('Appointments fetched successfully');
                }
                setShouldFetch(false);
            }
        }
    }, [shouldFetch, data, isLoading, isError, contractError]);

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mx-auto w-full lg:w-11/12 xl:w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">View my Appointments</h2>
            <div className="mb-4">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={useConnectedAddress}
                        onChange={(e) => setUseConnectedAddress(e.target.checked)}
                        className="mr-2"
                    />
                    Use connected address
                </label>
            </div>
            {!useConnectedAddress && (
                <div className="mb-4">
                    <input
                        type="text"
                        value={patientAddress}
                        onChange={(e) => setPatientAddress(e.target.value)}
                        placeholder="Enter patient address"
                        className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                    />
                </div>
            )}
            <button
                onClick={handleFetchAppointments}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300"
                disabled={isLoading}
            >
                {isLoading ? 'Fetching...' : 'Fetch Appointments'}
            </button>
            {fetchStatus && <p className="mt-4 text-lg text-center">{fetchStatus}</p>}
            {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
            {appointments && appointments.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">Appointments:</h3>
                    <ul>
                        {appointments.map((appointment, index) => (
                            <li key={index} className="mb-4 text-lg">
                                <p><strong className="text-blue-600">Patient:</strong> <span className="text-blue-400">{appointment.patient}</span></p>
                                <p><strong className="text-green-600">Doctor:</strong> <span className="text-green-400">{appointment.doctor}</span></p>
                                <p><strong className="text-purple-600">Date & Time:</strong> <span className="text-purple-400">{new Date(Number(appointment.dateTime) * 1000).toLocaleString()}</span></p>
                                <p><strong className="text-yellow-600">Treatment Details:</strong> <span className="text-yellow-400">{appointment.treatmentDetails}</span></p>
                                <p><strong className="text-red-600">Active:</strong> <span className={appointment.isActive ? 'text-green-400' : 'text-red-400'}>{appointment.isActive ? 'Yes' : 'No'}</span></p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default GetPatientAppointments;

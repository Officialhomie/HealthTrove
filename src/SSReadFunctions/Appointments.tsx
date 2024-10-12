import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { contractSS } from '../contracts';

interface Appointment {
    patient: string;
    doctor: string;
    dateTime: bigint;
    treatmentDetails: string;
    isActive: boolean;
}

const GetAppointment = () => {
    const [appointmentIndex, setAppointmentIndex] = useState('');
    const [appointmentData, setAppointmentData] = useState<Appointment | null>(null);
    const [fetchStatus, setFetchStatus] = useState('');
    const [shouldFetch, setShouldFetch] = useState(false);

    const { data, isError, isLoading } = useReadContract({
        ...contractSS,
        functionName: 'appointments',
        args: shouldFetch ? [BigInt(appointmentIndex)] : undefined,
        address: contractSS.address as `0x${string}`,
    });

    const handleFetchAppointment = () => {
        if (!appointmentIndex) {
            setFetchStatus('Please enter a valid appointment index');
            return;
        }
        setFetchStatus('Fetching appointment...');
        setShouldFetch(true);
    };

    useEffect(() => {
        if (shouldFetch) {
            if (isLoading) {
                setFetchStatus('Loading...');
            } else if (isError) {
                setFetchStatus('Error fetching appointment');
                setShouldFetch(false);
            } else if (data) {
                setAppointmentData(data as Appointment);
                setFetchStatus('Appointment fetched successfully');
                setShouldFetch(false);
            }
        }
    }, [shouldFetch, data, isLoading, isError]);

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-full mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Get Appointment by Number</h2>
            <div className="mb-4">
                <input
                    type="number"
                    value={appointmentIndex}
                    onChange={(e) => setAppointmentIndex(e.target.value)}
                    placeholder="Enter appointment index"
                    className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
            </div>
            <button
                onClick={handleFetchAppointment}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300"
            >
                Fetch Appointment
            </button>
            {fetchStatus && <p className="mt-4 text-lg text-center">{fetchStatus}</p>}
            {appointmentData && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Appointment Details:</h3>
                    <ul>
                        <li><strong>Patient:</strong> {appointmentData.patient}</li>
                        <li><strong>Doctor:</strong> {appointmentData.doctor}</li>
                        <li><strong>Date & Time:</strong> {new Date(Number(appointmentData.dateTime) * 1000).toLocaleString()}</li>
                        <li><strong>Treatment Details:</strong> {appointmentData.treatmentDetails}</li>
                        <li><strong>Active:</strong> {appointmentData.isActive ? 'Yes' : 'No'}</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default GetAppointment;

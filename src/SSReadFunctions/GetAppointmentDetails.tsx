import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { contractSS } from '../contracts';

interface Appointment {
    patient: string;
    doctor: string;
    dateTime: bigint;
    treatmentDetails: string;
    isActive: boolean;
}

const GetAppointmentDetails = () => {
    const [appointmentId, setAppointmentId] = useState('');
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [fetchStatus, setFetchStatus] = useState('');

    const { data, isError, isLoading } = useReadContract({
        ...contractSS,
        functionName: 'getAppointmentDetails',
        args: [BigInt(appointmentId || '0')],
        address: contractSS.address as `0x${string}`,
    });

    const handleFetchAppointment = () => {
        if (data) {
            setAppointment(data as Appointment);
            setFetchStatus('Appointment details fetched successfully');
        } else {
            setFetchStatus('No appointment found or error fetching details');
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching appointment details</div>;

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Get Appointment Details</h2>
            <div className="mb-4">
                <input
                    type="number"
                    value={appointmentId}
                    onChange={(e) => setAppointmentId(e.target.value)}
                    placeholder="Enter appointment ID"
                    className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
            </div>
            <button
                onClick={handleFetchAppointment}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300"
            >
                Fetch Appointment Details
            </button>
            {fetchStatus && <p className="mt-4 text-lg text-center">{fetchStatus}</p>}
            {appointment && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Appointment Details:</h3>
                    <ul>
                        <li><strong>Patient:</strong> {appointment.patient}</li>
                        <li><strong>Doctor:</strong> {appointment.doctor}</li>
                        <li><strong>Date & Time:</strong> {new Date(Number(appointment.dateTime) * 1000).toLocaleString()}</li>
                        <li><strong>Treatment Details:</strong> {appointment.treatmentDetails}</li>
                        <li><strong>Active:</strong> {appointment.isActive ? 'Yes' : 'No'}</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default GetAppointmentDetails;

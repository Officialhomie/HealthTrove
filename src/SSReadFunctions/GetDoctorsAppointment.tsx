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

const GetDoctorAppointments = () => {
    const [doctorAddress, setDoctorAddress] = useState('');
    const [appointments, setAppointments] = useState<Appointment[] | null>(null);
    const [fetchStatus, setFetchStatus] = useState('');

    const { data, isError, isLoading } = useReadContract({
        ...contractSS,
        functionName: 'getDoctorAppointments',
        args: [doctorAddress as `0x${string}`],
        address: contractSS.address as `0x${string}`,
    });

    const handleFetchAppointments = () => {
        if (data) {
            setAppointments(data as Appointment[]);
            setFetchStatus('Appointments fetched successfully');
        } else {
            setFetchStatus('No appointments found or error fetching data');
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching appointments</div>;

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Get Appointments by Doctor</h2>
            <div className="mb-4">
                <input
                    type="text"
                    value={doctorAddress}
                    onChange={(e) => setDoctorAddress(e.target.value)}
                    placeholder="Enter doctor address"
                    className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
            </div>
            <button
                onClick={handleFetchAppointments}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300"
            >
                Fetch Appointments
            </button>
            {fetchStatus && <p className="mt-4 text-lg text-center">{fetchStatus}</p>}
            {appointments && appointments.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Appointments:</h3>
                    <ul>
                        {appointments.map((appointment, index) => (
                            <li key={index} className="mb-4">
                                <strong>Patient:</strong> {appointment.patient}<br />
                                <strong>Doctor:</strong> {appointment.doctor}<br />
                                <strong>Date & Time:</strong> {new Date(Number(appointment.dateTime) * 1000).toLocaleString()}<br />
                                <strong>Treatment Details:</strong> {appointment.treatmentDetails}<br />
                                <strong>Active:</strong> {appointment.isActive ? 'Yes' : 'No'}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default GetDoctorAppointments;

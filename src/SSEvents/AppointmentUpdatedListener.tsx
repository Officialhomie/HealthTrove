import { useState } from 'react';
import { useWatchContractEvent } from 'wagmi';
import { contractSS } from '../contracts';

import { Log } from 'viem';

interface AppointmentUpdatedLog extends Log {
    args: {
        appointmentId: bigint;
        newDateTime: bigint;
    };
}

const AppointmentUpdatedListener = () => {
    const [updatedAppointments, setUpdatedAppointments] = useState<{ appointmentId: bigint; newDateTime: bigint }[]>([]);

    useWatchContractEvent({
        address: contractSS.address as `0x${string}`,
        abi: contractSS.abi,
        eventName: 'AppointmentUpdated',
        onLogs(logs) {
            logs.forEach((log) => {
                const typedLog = log as AppointmentUpdatedLog;
                if (typedLog.args) {
                    setUpdatedAppointments((prev) => [
                        ...prev,
                        {
                            appointmentId: typedLog.args.appointmentId,
                            newDateTime: typedLog.args.newDateTime,
                        },
                    ]);
                }
            });
        },
    });

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Updated Appointments</h2>
            {updatedAppointments.length > 0 ? (
                <ul className="list-disc pl-5">
                    {updatedAppointments.map((appointment, index) => (
                        <li key={index} className="text-lg text-gray-800 dark:text-white">
                            Appointment ID: {appointment.appointmentId.toString()}, New Date & Time: {new Date(Number(appointment.newDateTime) * 1000).toLocaleString()}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-lg text-gray-800 dark:text-white">No appointments updated yet.</p>
            )}
        </div>
    );
};

export default AppointmentUpdatedListener;

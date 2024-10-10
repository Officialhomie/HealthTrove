import { useState } from 'react';
import { useWatchContractEvent } from 'wagmi';
import { contractSS } from '../contracts';

import { Log } from 'viem';

interface AppointmentCancelledLog extends Log {
    args: {
        appointmentId: bigint;
        canceller: `0x${string}`;
    };
}

const AppointmentCancelledListener = () => {
    const [cancelledAppointments, setCancelledAppointments] = useState<{ appointmentId: bigint; canceller: `0x${string}` }[]>([]);

    useWatchContractEvent({
        address: contractSS.address as `0x${string}`,
        abi: contractSS.abi,
        eventName: 'AppointmentCancelled',
        onLogs(logs) {
            logs.forEach((log) => {
                const typedLog = log as AppointmentCancelledLog;
                if (typedLog.args) {
                    setCancelledAppointments((prev) => [
                        ...prev,
                        {
                            appointmentId: typedLog.args.appointmentId,
                            canceller: typedLog.args.canceller,
                        },
                    ]);
                }
            });
        },
    });

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Cancelled Appointments</h2>
            {cancelledAppointments.length > 0 ? (
                <ul className="list-disc pl-5">
                    {cancelledAppointments.map((appointment, index) => (
                        <li key={index} className="text-lg text-gray-800 dark:text-white">
                            Appointment ID: {appointment.appointmentId.toString()}, Canceller: {appointment.canceller}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-lg text-gray-800 dark:text-white">No appointments cancelled yet.</p>
            )}
        </div>
    );
};

export default AppointmentCancelledListener;

import { useState } from 'react';
import { useWatchContractEvent } from 'wagmi';
import { contractSS } from '../contracts';

import { Log } from 'viem';

interface AppointmentScheduledLog extends Log {
    args: {
        appointmentId: bigint;
        patient: `0x${string}`;
        doctor: `0x${string}`;
        dateTime: bigint;
    };
}

const AppointmentScheduledListener = () => {
    const [scheduledAppointments, setScheduledAppointments] = useState<{ appointmentId: bigint; patient: `0x${string}`; doctor: `0x${string}`; dateTime: bigint }[]>([]);

    useWatchContractEvent({
        address: contractSS.address as `0x${string}`,
        abi: contractSS.abi,
        eventName: 'AppointmentScheduled',
        onLogs(logs) {
            logs.forEach((log) => {
                const typedLog = log as AppointmentScheduledLog;
                if (typedLog.args) {
                    setScheduledAppointments((prev) => [
                        ...prev,
                        {
                            appointmentId: typedLog.args.appointmentId,
                            patient: typedLog.args.patient,
                            doctor: typedLog.args.doctor,
                            dateTime: typedLog.args.dateTime,
                        },
                    ]);
                }
            });
        },
    });

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Scheduled Appointments</h2>
            {scheduledAppointments.length > 0 ? (
                <ul className="list-disc pl-5">
                    {scheduledAppointments.map((appointment, index) => (
                        <li key={index} className="text-lg text-gray-800 dark:text-white">
                            Appointment ID: {appointment.appointmentId.toString()}, Patient: {appointment.patient}, Doctor: {appointment.doctor}, Date & Time: {new Date(Number(appointment.dateTime) * 1000).toLocaleString()}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-lg text-gray-800 dark:text-white">No appointments scheduled yet.</p>
            )}
        </div>
    );
};

export default AppointmentScheduledListener;

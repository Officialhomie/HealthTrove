// RegisteredPatientsListener.tsx
import { useState } from 'react';
import { useWatchContractEvent } from 'wagmi';
import { contractHRC } from '../contracts';
import { Log } from 'viem';

interface PatientRegisteredLog extends Log {
    args: {
        patient: `0x${string}`;
        ailment: string;
        reason: string;
    };
}

const RegisteredPatientsListener = () => {
    const [registeredPatients, setRegisteredPatients] = useState<Array<{ patient: `0x${string}`; ailment: string; reason: string }>>([]);

    useWatchContractEvent({
        address: contractHRC.address as `0x${string}`,
        abi: contractHRC.abi,
        eventName: 'PatientRegistered',
        onLogs(logs) {
            logs.forEach((log) => {
                const typedLog = log as PatientRegisteredLog;
                if (typedLog.args) {
                    setRegisteredPatients((prevPatients) => [
                        ...prevPatients,
                        {
                            patient: typedLog.args.patient,
                            ailment: typedLog.args.ailment,
                            reason: typedLog.args.reason,
                        },
                    ]);
                }
            });
        },
    });

    return (
        <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Registered Patients</h3>
            {registeredPatients.length > 0 ? (
                <ul className="space-y-2">
                    {registeredPatients.map((patient, index) => (
                        <li key={`${patient.patient}-${index}`} className="text-gray-800 dark:text-white break-all bg-gray-50 dark:bg-gray-700 p-3 rounded">
                            {patient.patient}: {patient.ailment} - {patient.reason}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-lg text-gray-600 dark:text-gray-300">No patients registered yet.</p>
            )}
        </div>
    );
};

export default RegisteredPatientsListener;
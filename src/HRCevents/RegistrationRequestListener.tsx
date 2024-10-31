// RegistrationRequestsListener.tsx
import { useState } from 'react';
import { useWatchContractEvent } from 'wagmi';
import { contractHRC } from '../contracts';
import { Log } from 'viem';

interface PatientRegistrationRequestedLog extends Log {
    args: {
        patient: `0x${string}`;
        ailment: string;
        reason: string;
    };
}

const RegistrationRequestsListener = () => {
    const [registrationRequests, setRegistrationRequests] = useState<Array<{ patient: `0x${string}`; ailment: string; reason: string }>>([]);

    useWatchContractEvent({
        address: contractHRC.address as `0x${string}`,
        abi: contractHRC.abi,
        eventName: 'PatientRegistrationRequested',
        onLogs(logs) {
            logs.forEach((log) => {
                const typedLog = log as PatientRegistrationRequestedLog;
                if (typedLog.args) {
                    const newRequest = {
                        patient: typedLog.args.patient,
                        ailment: typedLog.args.ailment,
                        reason: typedLog.args.reason,
                    };

                    // Display as an alert
                    alert(`New Registration Request:\nPatient: ${newRequest.patient}\nAilment: ${newRequest.ailment}\nReason: ${newRequest.reason}`);

                    // Log to the console
                    console.log('New Registration Request:', newRequest);

                    // Add the new request to the state
                    setRegistrationRequests((prevRequests) => [...prevRequests, newRequest]);
                }
            });
        },
    });

    return (
        <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Registration Requests</h3>
            {registrationRequests.length > 0 ? (
                <ul className="space-y-2">
                    {registrationRequests.map((request, index) => (
                        <li key={`${request.patient}-${index}`} className="text-gray-800 dark:text-white break-all bg-gray-50 dark:bg-gray-700 p-3 rounded">
                            {request.patient}: {request.ailment} - {request.reason}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-lg text-gray-600 dark:text-gray-300">No registration requests yet.</p>
            )}
        </div>
    );
};

export default RegistrationRequestsListener;

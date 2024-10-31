// RegistrationFeeListener.tsx
import { useState } from 'react';
import { useWatchContractEvent } from 'wagmi';
import { contractHRC } from '../contracts';
import { Log } from 'viem';

interface RegistrationFeePaidLog extends Log {
    args: {
        patient: `0x${string}`;
        amount: bigint;
    };
}

const RegistrationFeeListener = () => {
    const [registrationFees, setRegistrationFees] = useState<Array<{ patient: `0x${string}`; amount: bigint }>>([]);

    useWatchContractEvent({
        address: contractHRC.address as `0x${string}`,
        abi: contractHRC.abi,
        eventName: 'RegistrationFeePaid',
        onLogs(logs) {
            logs.forEach((log) => {
                const typedLog = log as RegistrationFeePaidLog;
                if (typedLog.args) {
                    setRegistrationFees((prevFees) => [
                        ...prevFees,
                        { patient: typedLog.args.patient, amount: typedLog.args.amount },
                    ]);
                }
            });
        },
    });

    return (
        <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Registration Fees</h3>
            {registrationFees.length > 0 ? (
                <ul className="space-y-2">
                    {registrationFees.map((fee, index) => (
                        <li key={`${fee.patient}-${index}`} className="text-gray-800 dark:text-white break-all bg-gray-50 dark:bg-gray-700 p-3 rounded">
                            {fee.patient} paid {fee.amount.toString()} wei
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-lg text-gray-600 dark:text-gray-300">No registration fees recorded yet.</p>
            )}
        </div>
    );
};

export default RegistrationFeeListener;
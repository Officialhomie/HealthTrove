import { useState } from 'react';
import { useWatchContractEvent } from 'wagmi';
import { contractHRC } from '../contracts';
import { Log } from 'viem';

interface PatientConsentLog extends Log {
    args: {
        patient: `0x${string}`;
        consentTo: `0x${string}`;
        consent: boolean;
    };
}

const PatientConsentListener = () => {
    const [patientConsents, setPatientConsents] = useState<Array<{ patient: `0x${string}`; consentTo: `0x${string}`; consent: boolean; transactionHash: string }>>([]);

    useWatchContractEvent({
        address: contractHRC.address as `0x${string}`,
        abi: contractHRC.abi,
        eventName: 'PatientConsent',
        onLogs(logs) {
            logs.forEach((log) => {
                const typedLog = log as PatientConsentLog;
                if (typedLog.args) {
                    setPatientConsents((prevConsents) => [
                        ...prevConsents,
                        { 
                            patient: typedLog.args.patient, 
                            consentTo: typedLog.args.consentTo, 
                            consent: typedLog.args.consent, 
                            transactionHash: log.transactionHash! 
                        },
                    ]);
                }
            });
        },
    });

    const truncateHash = (hash: string) => `${hash.slice(0, 6)}...${hash.slice(-4)}`;
    const getExplorerUrl = (hash: string) => `https://sepolia.basescan.org/tx/${hash}`;

    return (
        <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Patient Consents</h3>
            {patientConsents.length > 0 ? (
                <ul className="space-y-2">
                    {patientConsents.map((consent, index) => (
                        <li key={`${consent.patient}-${consent.consentTo}-${index}`} className="text-gray-800 dark:text-white break-all bg-gray-50 dark:bg-gray-700 p-3 rounded">
                            <p>
                                <strong>Patient:</strong> {consent.patient} 
                            </p>
                            <p>
                                <strong>Consent To:</strong> {consent.consentTo}
                            </p>
                            <p>
                                <strong>Consent Status:</strong> {consent.consent ? 'Granted' : 'Revoked'}
                            </p>
                            <p>
                                <strong>Transaction:</strong>
                                <a 
                                    href={getExplorerUrl(consent.transactionHash)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400"
                                >
                                    {truncateHash(consent.transactionHash)}
                                </a>
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-lg text-gray-600 dark:text-gray-300">No patient consents recorded yet.</p>
            )}
        </div>
    );
};

export default PatientConsentListener;

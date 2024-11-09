import { useState } from 'react';
import { usePublicClient, useWatchContractEvent } from 'wagmi';
import { contractHRC } from '../contracts';
import { Log, decodeEventLog } from 'viem';

interface PatientConsentEvent {
    patient: `0x${string}`;
    consentTo: `0x${string}`;
    consent: boolean;
    transactionHash: `0x${string}`;
    blockNumber: bigint;
    timestamp?: number;
}

const PatientConsentListener = () => {
    const [patientConsents, setPatientConsents] = useState<PatientConsentEvent[]>([]);
    const publicClient = usePublicClient();

    const processLogs = async (logs: Log[]) => {
        for (const log of logs) {
            const decodedLog = decodeEventLog({
                abi: contractHRC.abi,
                data: log.data,
                topics: log.topics,
            });

            // Type guard to check if args exists and has the expected shape
            if (!decodedLog.args || typeof decodedLog.args !== 'object') continue;

            const args = decodedLog.args as unknown;
            if (!isPatientConsentArgs(args)) continue;

            if (log.transactionHash && log.blockNumber !== null) {
                const block = await publicClient.getBlock({ blockHash: log.blockHash! });
                setPatientConsents((prevConsents) => [
                    ...prevConsents,
                    {
                        patient: args.patient,
                        consentTo: args.consentTo,
                        consent: args.consent,
                        transactionHash: log.transactionHash!,
                        blockNumber: log.blockNumber!,
                        timestamp: Number(block.timestamp),
                    },
                ]);
            }
        }
    };

    // Type guard function
    const isPatientConsentArgs = (args: unknown): args is { 
        patient: `0x${string}`; 
        consentTo: `0x${string}`; 
        consent: boolean; 
    } => {
        return (
            typeof args === 'object' && 
            args !== null &&
            'patient' in args &&
            'consentTo' in args &&
            'consent' in args &&
            typeof (args as any).patient === 'string' &&
            typeof (args as any).consentTo === 'string' &&
            typeof (args as any).consent === 'boolean'
        );
    };

    useWatchContractEvent({
        address: contractHRC.address as `0x${string}`,
        abi: contractHRC.abi,
        eventName: 'PatientConsent',
        onLogs: processLogs,
    });

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full max-w-full mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Patient Consents</h2>
            {patientConsents.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto text-sm">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700">
                                <th>Time</th>
                                <th>Patient</th>
                                <th>Consent To</th>
                                <th>Consent</th>
                                <th>Transaction</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patientConsents.map((consent) => (
                                <tr key={consent.transactionHash} className="border-b dark:border-gray-700">
                                    <td>{consent.timestamp ? new Date(consent.timestamp * 1000).toLocaleString() : 'Processing...'}</td>
                                    <td>{consent.patient}</td>
                                    <td>{consent.consentTo}</td>
                                    <td>{consent.consent ? 'Granted' : 'Revoked'}</td>
                                    <td>
                                        <a href={`https://sepolia.basescan.org/tx/${consent.transactionHash}`} target="_blank" rel="noopener noreferrer">
                                            {consent.transactionHash.slice(0, 6)}...{consent.transactionHash.slice(-4)}
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No patient consents recorded yet.</p>
            )}
        </div>
    );
};

export default PatientConsentListener;

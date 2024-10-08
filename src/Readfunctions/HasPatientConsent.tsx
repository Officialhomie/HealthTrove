import { useState } from 'react';
import { useReadContract } from 'wagmi';
import contract from '../contracts';

const HasPatientConsent = () => {
    const [patientAddress, setPatientAddress] = useState('');
    const [doctorAddress, setDoctorAddress] = useState('');
    const [hasConsent, setHasConsent] = useState<boolean | null>(null);
    const [fetchStatus, setFetchStatus] = useState('');

    const { data, isError, isLoading } = useReadContract({
        ...contract,
        functionName: 'hasPatientConsent',
        args: [patientAddress, doctorAddress],
        address: contract.address as `0x${string}`,
    });

    const handleCheckConsent = () => {
        if (data !== undefined) {
            setHasConsent(data as boolean);
            setFetchStatus(`Consent check completed for Patient: ${patientAddress} and Doctor: ${doctorAddress}`);
        } else {
            setFetchStatus(`Failed to check consent for Patient: ${patientAddress} and Doctor: ${doctorAddress}`);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching consent status</div>;

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Check Patient Consent</h2>
            <div className="mb-4">
                <input
                    type="text"
                    value={patientAddress}
                    onChange={(e) => setPatientAddress(e.target.value)}
                    placeholder="Enter patient address"
                    className="w-full px-3 py-2 mb-3 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
                <input
                    type="text"
                    value={doctorAddress}
                    onChange={(e) => setDoctorAddress(e.target.value)}
                    placeholder="Enter doctor address"
                    className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
            </div>
            <button
                onClick={handleCheckConsent}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300"
            >
                Check Consent
            </button>
            {fetchStatus && <p className="mt-4 text-lg text-center">{fetchStatus}</p>}
            {hasConsent !== null && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Consent Status:</h3>
                    <p className={`text-lg ${hasConsent ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {hasConsent ? 'Consent granted.' : 'Consent not granted.'}
                    </p>
                </div>
            )}
        </div>
    );
}

export default HasPatientConsent;

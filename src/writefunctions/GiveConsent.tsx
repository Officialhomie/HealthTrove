import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import contract from '../contracts';

const GiveConsent = () => {
    const [doctorAddress, setDoctorAddress] = useState('');
    const [consentStatus, setConsentStatus] = useState('');

    const { writeContract, data: hash, error, isPending } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } = 
        useWaitForTransactionReceipt({
            hash,
        });

    const handleGiveConsent = async () => {
        if (!doctorAddress || !/^0x[a-fA-F0-9]{40}$/.test(doctorAddress)) {
            setConsentStatus('Please enter a valid Ethereum address');
            return;
        }

        try {
            await writeContract({
                address: contract.address as `0x${string}`,
                abi: contract.abi,
                functionName: 'giveConsent',
                args: [doctorAddress],
            });
            setConsentStatus('Consent request sent');
        } catch (error) {
            console.error('Error giving consent:', error);
            setConsentStatus('Error giving consent');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Give Consent to Doctor</h2>
            <div className="mb-4">
                <input
                    type="text"
                    value={doctorAddress}
                    onChange={(e) => setDoctorAddress(e.target.value)}
                    placeholder="Enter doctor's Ethereum address"
                    className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
            </div>
            <button
                onClick={handleGiveConsent}
                disabled={isPending || isConfirming}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? 'Sending...' : isConfirming ? 'Confirming...' : 'Give Consent'}
            </button>
            {isConfirmed && <p className="mt-4 text-lg text-center text-green-600">Consent given successfully!</p>}
            {error && <p className="mt-4 text-lg text-center text-red-600">Error: {error.message}</p>}
            {consentStatus && <p className="mt-4 text-lg text-center">{consentStatus}</p>}
        </div>
    );
};

export default GiveConsent;
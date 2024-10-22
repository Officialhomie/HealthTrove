import React, { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount } from 'wagmi';
import { contractHRC } from '../contracts';
import { motion, AnimatePresence } from 'framer-motion';

const GiveConsent: React.FC = () => {
    const [doctorAddress, setDoctorAddress] = useState('');
    const [consentStatus, setConsentStatus] = useState('');
    const [isPatient, setIsPatient] = useState<boolean | null>(null);

    const { address, isConnected } = useAccount();
    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isLoading } = useWaitForTransactionReceipt({ hash });

    const { data: patientStatus } = useReadContract({
        ...contractHRC,
        functionName: 'isPatient',
        args: [address as `0x${string}`],
        address: contractHRC.address as `0x${string}`,
    });

    useEffect(() => {
        if (isConnected && patientStatus !== undefined) {
            setIsPatient(patientStatus as boolean);
        } else if (!isConnected) {
            setIsPatient(null);
        }
    }, [isConnected, patientStatus]);

    const handleGiveConsent = async () => {
        if (!isConnected) {
            setConsentStatus('Please connect your wallet first.');
            return;
        }

        if (!isPatient) {
            setConsentStatus('Error: You need to be registered as a patient.');
            return;
        }

        if (!doctorAddress || !/^0x[a-fA-F0-9]{40}$/.test(doctorAddress)) {
            setConsentStatus('Please enter a valid Ethereum address.');
            return;
        }

        try {
            await writeContract({
                address: contractHRC.address as `0x${string}`,
                abi: contractHRC.abi,
                functionName: 'giveConsent',
                args: [doctorAddress],
            });
            setConsentStatus('Consent request sent successfully.');
            setDoctorAddress(''); // Clear doctor address field after submission

            // Clear status message after 3 seconds
            setTimeout(() => setConsentStatus(''), 3000);
        } catch (error) {
            console.error('Error giving consent:', error);
            setConsentStatus('Error giving consent.');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full mx-auto max-w-4xl md:max-w-6xl lg:max-w-full">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Give Consent to Doctor</h2>
            {!isConnected ? (
                <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md">
                    <p>Please connect your wallet to give consent.</p>
                </div>
            ) : isPatient === false ? (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    <p>You are not registered as a patient. Please register before giving consent.</p>
                </div>
            ) : null}
            <form onSubmit={(e) => { e.preventDefault(); handleGiveConsent(); }} className="grid grid-cols-1 gap-6">
                <motion.div 
                    className="mb-4"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <label htmlFor="doctorAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Doctor Address:</label>
                    <input
                        type="text"
                        id="doctorAddress"
                        value={doctorAddress}
                        onChange={(e) => setDoctorAddress(e.target.value)}
                        className="w-full px-4 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                        required
                        disabled={!isConnected || isPatient === false}
                    />
                </motion.div>
                <motion.button
                    type="submit"
                    disabled={isPending || isLoading || !isConnected || isPatient === false}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
                >
                    {isConnected ? 'Give Consent' : 'Connect Wallet'}
                </motion.button>
            </form>

            <AnimatePresence>
                {isPending && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-4 text-gray-600 dark:text-gray-300 text-center animate-pulse"
                    >
                        Sending consent...
                    </motion.p>
                )}
                {isLoading && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-4 text-gray-600 dark:text-gray-300 text-center animate-pulse"
                    >
                        Waiting for transaction confirmation...
                    </motion.p>
                )}
                {consentStatus && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-4 text-gray-800 dark:text-white text-center font-semibold"
                    >
                        {consentStatus}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GiveConsent;

import React, { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount } from 'wagmi';
import { contractSS, contractHRC } from '../contracts';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const CancelAppointment: React.FC = () => {
    const [appointmentId, setAppointmentId] = useState('');
    const [cancellationStatus, setCancellationStatus] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [cancellationFee, setCancellationFee] = useState<bigint>(BigInt(0));
    const [isPatient, setIsPatient] = useState<boolean | null>(null);

    const { address, isConnected } = useAccount();
    const { writeContract, data: hash, error, isPending } = useWriteContract();
    const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

    const { data: fee } = useReadContract({
        ...contractSS,
        functionName: 'CANCELLATION_FEE',
        address: contractSS.address as `0x${string}`,
    } as const);

    const { data: patientStatus } = useReadContract({
        ...contractHRC,
        functionName: 'isPatient',
        args: [address as `0x${string}`],
        address: contractHRC.address as `0x${string}`,
    });

    useEffect(() => {
        if (fee) {
            setCancellationFee(BigInt(fee.toString()));
        }
    }, [fee]);

    useEffect(() => {
        if (isConnected && patientStatus !== undefined) {
            setIsPatient(patientStatus as boolean);
        } else if (!isConnected) {
            setIsPatient(null);
        }
    }, [isConnected, patientStatus]);

    const handleCancel = () => {
        if (!isConnected) {
            setCancellationStatus('Please connect your wallet first.');
            return;
        }

        if (!isPatient) {
            setCancellationStatus('Error: You must be a registered patient to cancel an appointment.');
            return;
        }

        setIsAnimating(true);
        setTimeout(() => {
            setShowConfirmation(true);
            setIsAnimating(false);
        }, 1000);
    };

    const confirmCancel = () => {
        if (isConnected && isPatient && contractSS.address) {
            writeContract({
                address: contractSS.address as `0x${string}`,
                abi: contractSS.abi,
                functionName: 'cancelAppointment',
                args: [BigInt(appointmentId)],
                value: cancellationFee,
            });
            setShowConfirmation(false);
        }
    };

    useEffect(() => {
        if (isSuccess) {
            setCancellationStatus('Appointment cancelled successfully!');
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } else if (error) {
            setCancellationStatus(`Error: ${error.message}`);
        }
    }, [isSuccess, error]);

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full mx-auto max-w-4xl md:max-w-6xl lg:max-w-full my-[70px]">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Cancel Your Appointment</h2>
            {!isConnected ? (
                <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md">
                    <p>Please connect your wallet to cancel an appointment.</p>
                </div>
            ) : isPatient === false ? (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    <p>You are not registered as a patient. Please register before cancelling an appointment.</p>
                </div>
            ) : null}
            <form onSubmit={(e) => { e.preventDefault(); handleCancel(); }} className="grid grid-cols-1 gap-6">
                <motion.div 
                    className="mb-4"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <label htmlFor="appointmentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Appointment ID:</label>
                    <input
                        type="number"
                        id="appointmentId"
                        value={appointmentId}
                        onChange={(e) => setAppointmentId(e.target.value)}
                        placeholder="Enter Appointment ID"
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
                    animate={isAnimating ? { rotate: 360 } : {}}
                    transition={{ duration: 0.5 }}
                    className="w-full bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
                >
                    {isConnected ? 'Cancel Appointment' : 'Connect Wallet'}
                </motion.button>
            </form>

            <AnimatePresence>
                {showConfirmation && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                    >
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full">
                            <p className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Are you sure you want to cancel this appointment?</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Cancellation fee: {cancellationFee.toString()} wei</p>
                            <div className="flex justify-between">
                                <motion.button
                                    onClick={confirmCancel}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-300"
                                >
                                    Yes, Cancel
                                </motion.button>
                                <motion.button
                                    onClick={() => setShowConfirmation(false)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-300"
                                >
                                    No, Keep Appointment
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isPending && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-4 text-gray-600 dark:text-gray-300 text-center animate-pulse"
                    >
                        Cancelling appointment...
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
                {cancellationStatus && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-4 text-gray-800 dark:text-white text-center font-semibold"
                    >
                        {cancellationStatus}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CancelAppointment;
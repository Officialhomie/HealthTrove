import React, { useState, useEffect } from 'react';
import { contractSS } from "../contracts";
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

const CancelAppointment: React.FC = () => {
    const [appointmentId, setAppointmentId] = useState('');
    const [cancellationStatus, setCancellationStatus] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [cancellationFee, setCancellationFee] = useState<bigint>(BigInt(0));

    const { writeContract, data: hash, error, isPending } = useWriteContract();
    const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });
    const { data: fee } = useReadContract({
        ...contractSS,
        functionName: 'CANCELLATION_FEE',
        address: contractSS.address as `0x${string}`,
    } as const);

    useEffect(() => {
        if (fee) {
            setCancellationFee(BigInt(fee.toString()));
        }
    }, [fee]);

    const handleCancel = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setShowConfirmation(true);
            setIsAnimating(false);
        }, 1000);
    };

    const confirmCancel = () => {
        if (contractSS.address) {
            writeContract({
                address: contractSS.address as `0x${string}`,
                abi: contractSS.abi,
                functionName: 'cancelAppointment',
                args: [BigInt(appointmentId)],
                value: cancellationFee,
            });
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
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Cancel Your Appointment</h2>
            <input
                type="number"
                value={appointmentId}
                onChange={(e) => setAppointmentId(e.target.value)}
                placeholder="Enter Appointment ID"
                className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500 mb-4"
            />
            <motion.button
                onClick={handleCancel}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={isAnimating ? { rotate: 360 } : {}}
                transition={{ duration: 0.5 }}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300"
            >
                Cancel Appointment
            </motion.button>

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

            {isPending && <p className="mt-4 text-gray-600 dark:text-gray-300 text-center animate-pulse">Cancelling appointment...</p>}
            {isLoading && <p className="mt-4 text-gray-600 dark:text-gray-300 text-center animate-pulse">Waiting for transaction confirmation...</p>}
            {cancellationStatus && <p className="mt-4 text-gray-800 dark:text-white text-center font-semibold">{cancellationStatus}</p>}
        </div>
    );
};

export default CancelAppointment;

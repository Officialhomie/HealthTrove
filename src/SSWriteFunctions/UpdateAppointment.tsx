import React, { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { contractSS } from '../contracts';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const UpdateAppointment: React.FC = () => {
    const [appointmentId, setAppointmentId] = useState('');
    const [newDateTime, setNewDateTime] = useState('');
    const [updateStatus, setUpdateStatus] = useState('');
    const [maxFutureDays, setMaxFutureDays] = useState<number>(90); // Default to 90 days

    const { writeContract, data: hash, error, isPending } = useWriteContract();
    const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

    const { data: maxDays } = useReadContract({
        ...contractSS,
        functionName: 'MAX_FUTURE_DAYS',
        address: contractSS.address as `0x${string}`,
    } as const);

    useEffect(() => {
        if (maxDays) {
            // Convert from seconds to days
            setMaxFutureDays(Number(maxDays) / (24 * 60 * 60));
        }
    }, [maxDays]);

    const handleUpdateAppointment = async () => {
        if (contractSS.address) {
            writeContract({
                address: contractSS.address as `0x${string}`,
                abi: contractSS.abi,
                functionName: 'updateAppointment',
                args: [BigInt(appointmentId), BigInt(new Date(newDateTime).getTime() / 1000)],
            });
        }
    };

    useEffect(() => {
        if (isSuccess) {
            setUpdateStatus('Appointment updated successfully!');
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } else if (error) {
            setUpdateStatus(`Error: ${error.message}`);
        }
    }, [isSuccess, error]);

    // Calculate the maximum date based on maxFutureDays
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + maxFutureDays);

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full mx-auto my-[70px]">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Update Appointment</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateAppointment(); }} className="w-full">
                <motion.div 
                    className="mb-4"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <label htmlFor="appointmentId" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-1">Appointment ID:</label>
                    <input
                        type="number"
                        id="appointmentId"
                        value={appointmentId}
                        onChange={(e) => setAppointmentId(e.target.value)}
                        className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                        required
                    />
                </motion.div>
                <motion.div 
                    className="mb-4"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <label htmlFor="newDateTime" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-1">New Date and Time:</label>
                    <input
                        type="datetime-local"
                        id="newDateTime"
                        value={newDateTime}
                        onChange={(e) => setNewDateTime(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                        max={maxDate.toISOString().slice(0, 16)}
                        className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                        required
                    />
                    <p className="mt-1 text-base text-gray-500 dark:text-gray-400">
                        You can reschedule up to {maxFutureDays} days in advance.
                    </p>
                </motion.div>
                <motion.button
                    type="submit"
                    disabled={isPending || isLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Update Appointment
                </motion.button>
            </form>

            <AnimatePresence>
                {isPending && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-4 text-base text-gray-600 dark:text-gray-300 text-center animate-pulse"
                    >
                        Updating appointment...
                    </motion.p>
                )}
                {isLoading && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-4 text-base text-gray-600 dark:text-gray-300 text-center animate-pulse"
                    >
                        Waiting for transaction confirmation...
                    </motion.p>
                )}
                {updateStatus && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-4 text-base text-gray-800 dark:text-white text-center font-semibold"
                    >
                        {updateStatus}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UpdateAppointment;
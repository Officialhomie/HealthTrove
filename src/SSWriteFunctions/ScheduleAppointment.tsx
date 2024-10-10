import React, { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { contractSS } from '../contracts';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const ScheduleAppointment: React.FC = () => {
    const [doctorAddress, setDoctorAddress] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [details, setDetails] = useState('');
    const [appointmentStatus, setAppointmentStatus] = useState('');
    const [schedulingFee, setSchedulingFee] = useState<bigint>(BigInt(0));
    const [maxFutureDays, setMaxFutureDays] = useState<number>(90); // Default to 90 days

    const { writeContract, data: hash, error, isPending } = useWriteContract();
    const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });
    
    const { data: fee } = useReadContract({
        ...contractSS,
        functionName: 'SCHEDULING_FEE',
        address: contractSS.address as `0x${string}`,
    } as const);

    const { data: maxDays } = useReadContract({
        ...contractSS,
        functionName: 'MAX_FUTURE_DAYS',
        address: contractSS.address as `0x${string}`,
    } as const);

    useEffect(() => {
        if (fee) {
            setSchedulingFee(BigInt(fee.toString()));
        }
    }, [fee]);

    useEffect(() => {
        if (maxDays) {
            // Convert from seconds to days
            setMaxFutureDays(Number(maxDays) / (24 * 60 * 60));
        }
    }, [maxDays]);

    const handleScheduleAppointment = async () => {
        if (contractSS.address) {
            writeContract({
                address: contractSS.address as `0x${string}`,
                abi: contractSS.abi,
                functionName: 'scheduleAppointment',
                args: [doctorAddress, BigInt(new Date(dateTime).getTime() / 1000), details],
                value: schedulingFee,
            });
        }
    };

    useEffect(() => {
        if (isSuccess) {
            setAppointmentStatus('Appointment scheduled successfully!');
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } else if (error) {
            setAppointmentStatus(`Error: ${error.message}`);
        }
    }, [isSuccess, error]);

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + maxFutureDays);

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Schedule Appointment</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleScheduleAppointment(); }}>
                <motion.div 
                    className="mb-4"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <label htmlFor="doctorAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Doctor Address:</label>
                    <input
                        type="text"
                        id="doctorAddress"
                        value={doctorAddress}
                        onChange={(e) => setDoctorAddress(e.target.value)}
                        className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                        required
                    />
                </motion.div>
                <motion.div 
                    className="mb-4"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <label htmlFor="dateTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date and Time:</label>
                    <input
                        type="datetime-local"
                        id="dateTime"
                        value={dateTime}
                        onChange={(e) => setDateTime(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                        max={maxDate.toISOString().slice(0, 16)}
                        className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                        required
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        You can book up to {maxFutureDays} days in advance.
                    </p>
                </motion.div>
                <motion.div 
                    className="mb-4"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <label htmlFor="details" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Treatment Details:</label>
                    <textarea
                        id="details"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                        required
                    />
                </motion.div>
                <motion.button
                    type="submit"
                    disabled={isPending || isLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Schedule Appointment
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
                        Scheduling appointment...
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
                {appointmentStatus && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-4 text-gray-800 dark:text-white text-center font-semibold"
                    >
                        {appointmentStatus}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ScheduleAppointment;
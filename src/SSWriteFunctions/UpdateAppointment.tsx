import React, { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount } from 'wagmi';
import { contractSS, contractHRC } from '../contracts';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const UpdateAppointment: React.FC = () => {
    const [appointmentId, setAppointmentId] = useState('');
    const [newDateTime, setNewDateTime] = useState('');
    const [details, setDetails] = useState('');
    const [updateStatus, setUpdateStatus] = useState('');
    const [maxFutureDays, setMaxFutureDays] = useState<number>(90);
    const [isPatient, setIsPatient] = useState<boolean | null>(null);

    const { address, isConnected } = useAccount();
    const { writeContract, data: hash, error, isPending } = useWriteContract();
    const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

    const { data: maxDays } = useReadContract({
        ...contractSS,
        functionName: 'MAX_FUTURE_DAYS',
        address: contractSS.address as `0x${string}`,
    } as const);

    const { data: patientStatus, isError: isPatientCheckError, isLoading: isPatientCheckLoading } = useReadContract({
        ...contractHRC,
        functionName: 'isPatient',
        args: isConnected ? [address] : undefined,
        address: contractHRC.address as `0x${string}`,
    });

    useEffect(() => {
        if (maxDays) {
            setMaxFutureDays(Number(maxDays) / (24 * 60 * 60));
        }
    }, [maxDays]);

    useEffect(() => {
        if (patientStatus !== undefined) {
            setIsPatient(patientStatus as boolean);
        }
    }, [patientStatus]);

    const handleUpdateAppointment = async () => {
        if (!isConnected) {
            setUpdateStatus('Please connect your wallet first.');
            return;
        }

        if (!isPatient) {
            setUpdateStatus('Error: You must be a registered patient to update an appointment.');
            return;
        }

        if (isConnected && isPatient) {
            writeContract({
                address: contractSS.address as `0x${string}`,
                abi: contractSS.abi,
                functionName: 'updateAppointment',
                args: [BigInt(appointmentId), BigInt(new Date(newDateTime).getTime() / 1000), details],
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

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + maxFutureDays);

    if (isPatientCheckLoading) return <div>Checking patient status...</div>;
    if (isPatientCheckError) return <div>Error checking patient status</div>;

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full mx-auto max-w-4xl md:max-w-6xl lg:max-w-full my-[70px]">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Update Appointment</h2>
            {isConnected && isPatient === false && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    <p>You are not registered as a patient. Please register before updating an appointment.</p>
                </div>
            )}
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateAppointment(); }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className="w-full px-4 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                        required
                        disabled={!isConnected || !isPatient}
                    />
                </motion.div>
                <motion.div 
                    className="mb-4"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <label htmlFor="newDateTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Date and Time:</label>
                    <input
                        type="datetime-local"
                        id="newDateTime"
                        value={newDateTime}
                        onChange={(e) => setNewDateTime(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                        max={maxDate.toISOString().slice(0, 16)}
                        className="w-full px-4 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                        required
                        disabled={!isConnected || !isPatient}
                    />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        You can reschedule up to {maxFutureDays} days in advance.
                    </p>
                </motion.div>
                <motion.div 
                    className="mb-4 md:col-span-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <label htmlFor="details" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Updated Treatment Details:</label>
                    <textarea
                        id="details"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        className="w-full px-4 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                        rows={4}
                        required
                        disabled={!isConnected || !isPatient}
                    />
                </motion.div>
                <motion.button
                    type="submit"
                    disabled={isPending || isLoading || !isConnected || !isPatient}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="md:col-span-2 w-full bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
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
                        className="mt-4 text-gray-600 dark:text-gray-300 text-center animate-pulse"
                    >
                        Updating appointment...
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
                {updateStatus && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-4 text-gray-800 dark:text-white text-center font-semibold"
                    >
                        {updateStatus}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UpdateAppointment;
// import React, { useState, useEffect } from 'react';
// import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount } from 'wagmi';
// import { contractSS, contractHRC } from '../contracts';
// import { motion, AnimatePresence } from 'framer-motion';
// import confetti from 'canvas-confetti';

// const ScheduleAppointment: React.FC = () => {
//     const [doctorAddress, setDoctorAddress] = useState('');
//     const [dateTime, setDateTime] = useState('');
//     const [details, setDetails] = useState('');
//     const [appointmentStatus, setAppointmentStatus] = useState('');
//     const [schedulingFee, setSchedulingFee] = useState<bigint>(BigInt(0));
//     const [maxFutureDays, setMaxFutureDays] = useState<number>(90);
//     const [isPatient, setIsPatient] = useState<boolean | null>(null);

//     const { address, isConnected } = useAccount();
//     const { writeContract, data: hash, error, isPending } = useWriteContract();
//     const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });
    
//     const { data: fee } = useReadContract({
//         ...contractSS,
//         functionName: 'SCHEDULING_FEE',
//         address: contractSS.address as `0x${string}`,
//     } as const);

//     const { data: maxDays } = useReadContract({
//         ...contractSS,
//         functionName: 'MAX_FUTURE_DAYS',
//         address: contractSS.address as `0x${string}`,
//     } as const);

//     const { data: patientStatus, isError: isPatientCheckError, isLoading: isPatientCheckLoading } = useReadContract({
//         ...contractHRC,
//         functionName: 'isPatient',
//         args: isConnected ? [address] : undefined,
//         address: contractHRC.address as `0x${string}`,
//     });

//     useEffect(() => {
//         if (fee) {
//             setSchedulingFee(BigInt(fee.toString()));
//         }
//     }, [fee]);

//     useEffect(() => {
//         if (maxDays) {
//             setMaxFutureDays(Number(maxDays) / (24 * 60 * 60));
//         }
//     }, [maxDays]);

//     useEffect(() => {
//         if (patientStatus !== undefined) {
//             setIsPatient(patientStatus as boolean);
//         }
//     }, [patientStatus]);

//     const handleScheduleAppointment = async () => {
//         if (!isConnected) {
//             setAppointmentStatus('Please connect your wallet first.');
//             return;
//         }

//         if (!isPatient) {
//             setAppointmentStatus('Error: You must be a registered patient to schedule an appointment.');
//             return;
//         }

//         if (isConnected && isPatient) {
//             writeContract({
//                 address: contractSS.address as `0x${string}`,
//                 abi: contractSS.abi,
//                 functionName: 'scheduleAppointment',
//                 args: [doctorAddress, BigInt(new Date(dateTime).getTime() / 1000), details],
//                 value: schedulingFee,
//             });
//         } else {
//             if (!isConnected) {
//                 setAppointmentStatus('Please connect your wallet first.');
//             } else if (!isPatient) {
//                 setAppointmentStatus('Error: You must be a registered patient to schedule an appointment.');
//             }
//         }
//     };

//     useEffect(() => {
//         if (isSuccess) {
//             setAppointmentStatus('Appointment scheduled successfully!');
//             confetti({
//                 particleCount: 100,
//                 spread: 70,
//                 origin: { y: 0.6 }
//             });
//         } else if (error) {
//             setAppointmentStatus(`Error: ${error.message}`);
//         }
//     }, [isSuccess, error]);

//     const maxDate = new Date();
//     maxDate.setDate(maxDate.getDate() + maxFutureDays);

//     if (isPatientCheckLoading) return <div>Checking patient status...</div>;
//     if (isPatientCheckError) return <div>Error checking patient status</div>;

//     return (
//         <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full mx-auto max-w-4xl md:max-w-6xl lg:max-w-full">
//             <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Schedule Appointment</h2>
//             {isConnected && isPatient === false && (
//                 <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
//                     <p>You are not registered as a patient. Please register before scheduling an appointment.</p>
//                 </div>
//             )}
//             <form onSubmit={(e) => { e.preventDefault(); handleScheduleAppointment(); }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <motion.div 
//                     className="mb-4"
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                 >
//                     <label htmlFor="doctorAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Doctor Address:</label>
//                     <input
//                         type="text"
//                         id="doctorAddress"
//                         value={doctorAddress}
//                         onChange={(e) => setDoctorAddress(e.target.value)}
//                         className="w-full px-4 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
//                         required
//                         disabled={!isConnected || !isPatient}
//                     />
//                 </motion.div>
//                 <motion.div 
//                     className="mb-4"
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                 >
//                     <label htmlFor="dateTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date and Time:</label>
//                     <input
//                         type="datetime-local"
//                         id="dateTime"
//                         value={dateTime}
//                         onChange={(e) => setDateTime(e.target.value)}
//                         min={new Date().toISOString().slice(0, 16)}
//                         max={maxDate.toISOString().slice(0, 16)}
//                         className="w-full px-4 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
//                         required
//                         disabled={!isConnected || !isPatient}
//                     />
//                     <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
//                         You can book up to {maxFutureDays} days in advance.
//                     </p>
//                 </motion.div>
//                 <motion.div 
//                     className="mb-4 md:col-span-2"
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                 >
//                     <label htmlFor="details" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Treatment Details:</label>
//                     <textarea
//                         id="details"
//                         value={details}
//                         onChange={(e) => setDetails(e.target.value)}
//                         className="w-full px-4 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
//                         rows={4}
//                         required
//                         disabled={!isConnected || !isPatient}
//                     />
//                 </motion.div>
//                 <motion.button
//                     type="submit"
//                     disabled={isPending || isLoading || !isConnected || !isPatient}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="md:col-span-2 w-full bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
//                 >
//                     Schedule Appointment
//                 </motion.button>
//             </form>

//             <AnimatePresence>
//                 {isPending && (
//                     <motion.p
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -20 }}
//                         className="mt-4 text-gray-600 dark:text-gray-300 text-center animate-pulse"
//                     >
//                         Scheduling appointment...
//                     </motion.p>
//                 )}
//                 {isLoading && (
//                     <motion.p
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -20 }}
//                         className="mt-4 text-gray-600 dark:text-gray-300 text-center animate-pulse"
//                     >
//                         Waiting for transaction confirmation...
//                     </motion.p>
//                 )}
//                 {appointmentStatus && (
//                     <motion.p
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -20 }}
//                         className="mt-4 text-gray-800 dark:text-white text-center font-semibold"
//                     >
//                         {appointmentStatus}
//                     </motion.p>
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// };

// export default ScheduleAppointment;


import React, { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount } from 'wagmi';
import { contractSS, contractHRC } from '../contracts';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const ScheduleAppointment: React.FC = () => {
    const [doctorAddress, setDoctorAddress] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [details, setDetails] = useState('');
    const [appointmentStatus, setAppointmentStatus] = useState('');
    const [schedulingFee, setSchedulingFee] = useState<bigint>(BigInt(0));
    const [maxFutureDays, setMaxFutureDays] = useState<number>(90);
    const [isPatient, setIsPatient] = useState<boolean | null>(null);

    const { address, isConnected } = useAccount();
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

    const { data: patientStatus } = useReadContract({
        ...contractHRC,
        functionName: 'isPatient',
        args: [address as `0x${string}`],
        address: contractHRC.address as `0x${string}`,
    });

    useEffect(() => {
        if (fee) {
            setSchedulingFee(BigInt(fee.toString()));
        }
    }, [fee]);

    useEffect(() => {
        if (maxDays) {
            setMaxFutureDays(Number(maxDays) / (24 * 60 * 60));
        }
    }, [maxDays]);

    useEffect(() => {
        if (isConnected && patientStatus !== undefined) {
            setIsPatient(patientStatus as boolean);
        } else if (!isConnected) {
            setIsPatient(null);
        }
    }, [isConnected, patientStatus]);

    const handleScheduleAppointment = async () => {
        if (!isConnected) {
            setAppointmentStatus('Please connect your wallet first.');
            return;
        }

        if (!isPatient) {
            setAppointmentStatus('Error: You must be a registered patient to schedule an appointment.');
            return;
        }

        writeContract({
            address: contractSS.address as `0x${string}`,
            abi: contractSS.abi,
            functionName: 'scheduleAppointment',
            args: [doctorAddress, BigInt(new Date(dateTime).getTime() / 1000), details],
            value: schedulingFee,
        });
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
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full mx-auto max-w-4xl md:max-w-6xl lg:max-w-full">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Schedule Appointment</h2>
            {!isConnected ? (
                <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md">
                    <p>Please connect your wallet to schedule an appointment.</p>
                </div>
            ) : isPatient === false ? (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    <p>You are not registered as a patient. Please register before scheduling an appointment.</p>
                </div>
            ) : null}
            <form onSubmit={(e) => { e.preventDefault(); handleScheduleAppointment(); }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <motion.div 
                    className="mb-4"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <label htmlFor="dateTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date and Time:</label>
                    <input
                        type="datetime-local"
                        id="dateTime"
                        value={dateTime}
                        onChange={(e) => setDateTime(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                        max={maxDate.toISOString().slice(0, 16)}
                        className="w-full px-4 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                        required
                        disabled={!isConnected || isPatient === false}
                    />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        You can book up to {maxFutureDays} days in advance.
                    </p>
                </motion.div>
                <motion.div 
                    className="mb-4 md:col-span-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <label htmlFor="details" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Treatment Details:</label>
                    <textarea
                        id="details"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        className="w-full px-4 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                        rows={4}
                        required
                        disabled={!isConnected || isPatient === false}
                    />
                </motion.div>
                <motion.button
                    type="submit"
                    disabled={isPending || isLoading || !isConnected || isPatient === false}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="md:col-span-2 w-full bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
                >
                    {isConnected ? 'Schedule Appointment' : 'Connect Wallet'}
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


// import React, { useState, useEffect } from 'react';
// import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount } from 'wagmi';
// import { contractSS, contractHRC } from '../contracts';
// import { motion, AnimatePresence } from 'framer-motion';
// import confetti from 'canvas-confetti';

// const UpdateAppointment: React.FC = () => {
//     const [appointmentId, setAppointmentId] = useState('');
//     const [newDateTime, setNewDateTime] = useState('');
//     const [details, setDetails] = useState('');
//     const [updateStatus, setUpdateStatus] = useState('');
//     const [maxFutureDays, setMaxFutureDays] = useState<number>(90);
//     const [isPatient, setIsPatient] = useState<boolean | null>(null);

//     const { address, isConnected } = useAccount();
//     const { writeContract, data: hash, error, isPending } = useWriteContract();
//     const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

//     const { data: maxDays } = useReadContract({
//         ...contractSS,
//         functionName: 'MAX_FUTURE_DAYS',
//         address: contractSS.address as `0x${string}`,
//     } as const);

//     const { data: patientStatus } = useReadContract({
//         ...contractHRC,
//         functionName: 'isPatient',
//         args: [address as `0x${string}`],
//         address: contractHRC.address as `0x${string}`,
//     });

//     useEffect(() => {
//         if (maxDays) {
//             setMaxFutureDays(Number(maxDays) / (24 * 60 * 60));
//         }
//     }, [maxDays]);

//     useEffect(() => {
//         if (isConnected && patientStatus !== undefined) {
//             setIsPatient(patientStatus as boolean);
//         } else if (!isConnected) {
//             setIsPatient(null);
//         }
//     }, [isConnected, patientStatus]);

//     const handleUpdateAppointment = async () => {
//         if (!isConnected) {
//             setUpdateStatus('Please connect your wallet first.');
//             return;
//         }

//         if (!isPatient) {
//             setUpdateStatus('Error: You must be a registered patient to update an appointment.');
//             return;
//         }

//         writeContract({
//             address: contractSS.address as `0x${string}`,
//             abi: contractSS.abi,
//             functionName: 'updateAppointment',
//             args: [BigInt(appointmentId), BigInt(new Date(newDateTime).getTime() / 1000), details],
//         });
//     };

//     useEffect(() => {
//         if (isSuccess) {
//             setUpdateStatus('Appointment updated successfully!');
//             confetti({
//                 particleCount: 100,
//                 spread: 70,
//                 origin: { y: 0.6 }
//             });
//         } else if (error) {
//             setUpdateStatus(`Error: ${error.message}`);
//         }
//     }, [isSuccess, error]);

//     const maxDate = new Date();
//     maxDate.setDate(maxDate.getDate() + maxFutureDays);

//     return (
//         <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full mx-auto max-w-4xl md:max-w-6xl lg:max-w-full my-[70px]">
//             <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Update Appointment</h2>
//             {!isConnected ? (
//                 <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md">
//                     <p>Please connect your wallet to update an appointment.</p>
//                 </div>
//             ) : isPatient === false ? (
//                 <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
//                     <p>You are not registered as a patient. Please register before updating an appointment.</p>
//                 </div>
//             ) : null}
//             <form onSubmit={(e) => { e.preventDefault(); handleUpdateAppointment(); }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <motion.div 
//                     className="mb-4"
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                 >
//                     <label htmlFor="appointmentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Appointment ID:</label>
//                     <input
//                         type="number"
//                         id="appointmentId"
//                         value={appointmentId}
//                         onChange={(e) => setAppointmentId(e.target.value)}
//                         className="w-full px-4 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
//                         required
//                         disabled={!isConnected || isPatient === false}
//                     />
//                 </motion.div>
//                 <motion.div 
//                     className="mb-4"
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                 >
//                     <label htmlFor="newDateTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Date and Time:</label>
//                     <input
//                         type="datetime-local"
//                         id="newDateTime"
//                         value={newDateTime}
//                         onChange={(e) => setNewDateTime(e.target.value)}
//                         min={new Date().toISOString().slice(0, 16)}
//                         max={maxDate.toISOString().slice(0, 16)}
//                         className="w-full px-4 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
//                         required
//                         disabled={!isConnected || isPatient === false}
//                     />
//                     <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
//                         You can reschedule up to {maxFutureDays} days in advance.
//                     </p>
//                 </motion.div>
//                 <motion.div 
//                     className="mb-4 md:col-span-2"
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                 >
//                     <label htmlFor="details" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Updated Treatment Details:</label>
//                     <textarea
//                         id="details"
//                         value={details}
//                         onChange={(e) => setDetails(e.target.value)}
//                         className="w-full px-4 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
//                         rows={4}
//                         required
//                         disabled={!isConnected || isPatient === false}
//                     />
//                 </motion.div>
//                 <motion.button
//                     type="submit"
//                     disabled={isPending || isLoading || !isConnected || isPatient === false}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="md:col-span-2 w-full bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
//                 >
//                     {isConnected ? 'Update Appointment' : 'Connect Wallet'}
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
//                         Updating appointment...
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
//                 {updateStatus && (
//                     <motion.p
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -20 }}
//                         className="mt-4 text-gray-800 dark:text-white text-center font-semibold"
//                     >
//                         {updateStatus}
//                     </motion.p>
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// };

// export default UpdateAppointment;

// import React, { useState, useEffect } from 'react';
// import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount } from 'wagmi';
// import { contractSS, contractHRC } from '../contracts';
// import { motion, AnimatePresence } from 'framer-motion';
// import confetti from 'canvas-confetti';

// const UpdateAppointment: React.FC = () => {
//     const [appointmentId, setAppointmentId] = useState('');
//     const [newDateTime, setNewDateTime] = useState('');
//     const [details, setDetails] = useState('');
//     const [updateStatus, setUpdateStatus] = useState('');
//     const [maxFutureDays, setMaxFutureDays] = useState<number>(90);
//     const [isPatient, setIsPatient] = useState<boolean | null>(null);
//     const [appointmentExists, setAppointmentExists] = useState<boolean | null>(null);

//     const { address, isConnected } = useAccount();
//     const { writeContract, data: hash, error, isPending } = useWriteContract();
//     const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

//     const { data: maxDays } = useReadContract({
//         ...contractSS,
//         functionName: 'MAX_FUTURE_DAYS',
//         address: contractSS.address as `0x${string}`,
//     } as const);

//     const { data: patientStatus } = useReadContract({
//         ...contractHRC,
//         functionName: 'isPatient',
//         args: [address as `0x${string}`],
//         address: contractHRC.address as `0x${string}`,
//     });

//     const { data: appointmentData } = useReadContract({
//         ...contractSS,
//         functionName: 'getAppointmentDetails',
//         args: [BigInt(appointmentId)],
//         address: contractSS.address as `0x${string}`,
//     });
    

//     useEffect(() => {
//         if (maxDays) {
//             setMaxFutureDays(Number(maxDays) / (24 * 60 * 60));
//         }
//     }, [maxDays]);

//     useEffect(() => {
//         if (isConnected && patientStatus !== undefined) {
//             setIsPatient(patientStatus as boolean);
//         } else if (!isConnected) {
//             setIsPatient(null);
//         }
//     }, [isConnected, patientStatus]);

//     useEffect(() => {
//         if (appointmentData) {
//             // Assuming appointmentData is null or undefined if the appointment does not exist
//             setAppointmentExists(Boolean(appointmentData));
//         } else {
//             setAppointmentExists(null);
//         }
//     }, [appointmentData]);

//     const handleUpdateAppointment = async () => {
//         if (!isConnected) {
//             setUpdateStatus('Please connect your wallet first.');
//             return;
//         }

//         if (!isPatient) {
//             setUpdateStatus('Error: You must be a registered patient to update an appointment.');
//             return;
//         }

//         if (!appointmentExists) {
//             setUpdateStatus('Error: This appointment does not exist in our records yet, maybe in the future.');
//             return;
//         }

//         writeContract({
//             address: contractSS.address as `0x${string}`,
//             abi: contractSS.abi,
//             functionName: 'updateAppointment',
//             args: [BigInt(appointmentId), BigInt(new Date(newDateTime).getTime() / 1000)], // Only pass two arguments if the function expects two
//         });
//     };

//     useEffect(() => {
//         if (isSuccess) {
//             setUpdateStatus('Appointment updated successfully!');
//             confetti({
//                 particleCount: 100,
//                 spread: 70,
//                 origin: { y: 0.6 }
//             });
//         } else if (error) {
//             setUpdateStatus(`Error: ${error.message}`);
//         }
//     }, [isSuccess, error]);

//     const maxDate = new Date();
//     maxDate.setDate(maxDate.getDate() + maxFutureDays);

//     return (
//         <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full mx-auto max-w-4xl md:max-w-6xl lg:max-w-full my-[70px]">
//             <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Update Appointment</h2>
//             {!isConnected ? (
//                 <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md">
//                     <p>Please connect your wallet to update an appointment.</p>
//                 </div>
//             ) : isPatient === false ? (
//                 <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
//                     <p>You are not registered as a patient. Please register before updating an appointment.</p>
//                 </div>
//             ) : appointmentExists === false ? (
//                 <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
//                     <p>Error: This appointment does not exist in our records yet, maybe in the future.</p>
//                 </div>
//             ) : null}
//             <form onSubmit={(e) => { e.preventDefault(); handleUpdateAppointment(); }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <motion.div 
//                     className="mb-4"
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                 >
//                     <label htmlFor="appointmentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Appointment ID:</label>
//                     <input
//                         type="number"
//                         id="appointmentId"
//                         value={appointmentId}
//                         onChange={(e) => setAppointmentId(e.target.value)}
//                         className="w-full px-4 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
//                         required
//                         disabled={!isConnected || isPatient === false}
//                     />
//                 </motion.div>
//                 <motion.div 
//                     className="mb-4"
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                 >
//                     <label htmlFor="newDateTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Date and Time:</label>
//                     <input
//                         type="datetime-local"
//                         id="newDateTime"
//                         value={newDateTime}
//                         onChange={(e) => setNewDateTime(e.target.value)}
//                         min={new Date().toISOString().slice(0, 16)}
//                         max={maxDate.toISOString().slice(0, 16)}
//                         className="w-full px-4 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
//                         required
//                         disabled={!isConnected || isPatient === false}
//                     />
//                     <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
//                         You can reschedule up to {maxFutureDays} days in advance.
//                     </p>
//                 </motion.div>
//                 <motion.div 
//                     className="mb-4 md:col-span-2"
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                 >
//                     <label htmlFor="details" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Updated Treatment Details:</label>
//                     <textarea
//                         id="details"
//                         value={details}
//                         onChange={(e) => setDetails(e.target.value)}
//                         className="w-full px-4 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
//                         rows={4}
//                         required
//                         disabled={!isConnected || isPatient === false}
//                     />
//                 </motion.div>
//                 <motion.button
//                     type="submit"
//                     disabled={isPending || isLoading || !isConnected || isPatient === false || appointmentExists === false}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="md:col-span-2 w-full bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
//                 >
//                     {isPending || isLoading ? 'Updating...' : 'Update Appointment'}
//                 </motion.button>
//             </form>
//             <AnimatePresence>
//                 {updateStatus && (
//                     <motion.div
//                         key="statusMessage"
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -10 }}
//                         className={`mt-6 p-4 rounded-md ${isSuccess ? 'bg-green-100 text-green-700 border-green-400' : 'bg-red-100 text-red-700 border-red-400'}`}
//                     >
//                         {updateStatus}
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// };

// export default UpdateAppointment;



// import React, { useState, useEffect } from 'react';
// import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount } from 'wagmi';
// import { contractSS, contractHRC } from '../contracts';
// import { motion, AnimatePresence } from 'framer-motion';
// import confetti from 'canvas-confetti';

// const UpdateAppointment: React.FC = () => {
//     const [appointmentId, setAppointmentId] = useState('');
//     const [newDateTime, setNewDateTime] = useState('');
//     const [details, setDetails] = useState('');
//     const [updateStatus, setUpdateStatus] = useState('');
//     const [maxFutureDays, setMaxFutureDays] = useState<number>(90);
//     const [isPatient, setIsPatient] = useState<boolean | null>(null);
//     const [isDoctor, setIsDoctor] = useState<boolean | null>(null);
//     const [appointmentExists, setAppointmentExists] = useState<boolean | null>(null);

//     const { address, isConnected } = useAccount();
//     const { writeContract, data: hash, error, isPending } = useWriteContract();
//     const { isLoading: txLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

//     // Get the DOCTOR_ROLE constant
//     const { data: doctorRole } = useReadContract({
//         ...contractHRC,
//         functionName: 'DOCTOR_ROLE',
//         address: contractHRC.address as `0x${string}`,
//     });

//     // Check if the connected address has the doctor role
//     const { data: hasRoleData } = useReadContract({
//         ...contractHRC,
//         functionName: 'hasRole',
//         args: [doctorRole as `0x${string}`, address as `0x${string}`],
//         address: contractHRC.address as `0x${string}`,
//     });

//     const { data: maxDays } = useReadContract({
//         ...contractSS,
//         functionName: 'MAX_FUTURE_DAYS',
//         address: contractSS.address as `0x${string}`,
//     } as const);

//     const { data: patientStatus } = useReadContract({
//         ...contractHRC,
//         functionName: 'isPatient',
//         args: [address as `0x${string}`],
//         address: contractHRC.address as `0x${string}`,
//     });

//     const { data: appointmentData } = useReadContract({
//         ...contractSS,
//         functionName: 'getAppointmentDetails',
//         args: [BigInt(appointmentId)],
//         address: contractSS.address as `0x${string}`,
//     });

//     useEffect(() => {
//         if (maxDays) {
//             setMaxFutureDays(Number(maxDays) / (24 * 60 * 60));
//         }
//     }, [maxDays]);

//     useEffect(() => {
//         if (isConnected) {
//             setIsPatient(patientStatus as boolean);
//             setIsDoctor(hasRoleData as boolean);
//         } else {
//             setIsPatient(null);
//             setIsDoctor(null);
//         }
//     }, [isConnected, patientStatus, hasRoleData]);

//     useEffect(() => {
//         if (appointmentData) {
//             setAppointmentExists(Boolean(appointmentData));
//         } else {
//             setAppointmentExists(null);
//         }
//     }, [appointmentData]);

//     const handleUpdateAppointment = async () => {
//         if (!isConnected) {
//             setUpdateStatus('Please connect your wallet first.');
//             return;
//         }

//         if (!isPatient && !isDoctor) {
//             setUpdateStatus('Error: You must be either a registered patient or a doctor to update an appointment.');
//             return;
//         }

//         if (!appointmentExists) {
//             setUpdateStatus('Error: This appointment does not exist in our records yet, maybe in the future.');
//             return;
//         }

//         writeContract({
//             address: contractSS.address as `0x${string}`,
//             abi: contractSS.abi,
//             functionName: 'updateAppointment',
//             args: [BigInt(appointmentId), BigInt(new Date(newDateTime).getTime() / 1000)],
//         });
//     };

//     useEffect(() => {
//         if (isSuccess) {
//             setUpdateStatus('Appointment updated successfully!');
//             confetti({
//                 particleCount: 100,
//                 spread: 70,
//                 origin: { y: 0.6 }
//             });
//         } else if (error) {
//             setUpdateStatus(`Error: ${error.message}`);
//         }
//     }, [isSuccess, error]);

//     const maxDate = new Date();
//     maxDate.setDate(maxDate.getDate() + maxFutureDays);

//     return (
//         <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full mx-auto max-w-4xl md:max-w-6xl lg:max-w-full my-[70px]">
//             <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Update Appointment</h2>
//             {!isConnected ? (
//                 <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md">
//                     <p>Please connect your wallet to update an appointment.</p>
//                 </div>
//             ) : !isPatient && !isDoctor ? (
//                 <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
//                     <p>You must be either a registered patient or a doctor to update appointments.</p>
//                 </div>
//             ) : appointmentExists === false ? (
//                 <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
//                     <p>Error: This appointment does not exist in our records yet, maybe in the future.</p>
//                 </div>
//             ) : null}
//             <form onSubmit={(e) => { e.preventDefault(); handleUpdateAppointment(); }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <motion.div 
//                     className="mb-4"
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                 >
//                     <label htmlFor="appointmentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Appointment ID:</label>
//                     <input
//                         type="number"
//                         id="appointmentId"
//                         value={appointmentId}
//                         onChange={(e) => setAppointmentId(e.target.value)}
//                         className="w-full px-4 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
//                         required
//                         disabled={!isConnected || (!isPatient && !isDoctor)}
//                     />
//                 </motion.div>
//                 <motion.div 
//                     className="mb-4"
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                 >
//                     <label htmlFor="newDateTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Date and Time:</label>
//                     <input
//                         type="datetime-local"
//                         id="newDateTime"
//                         value={newDateTime}
//                         onChange={(e) => setNewDateTime(e.target.value)}
//                         min={new Date().toISOString().slice(0, 16)}
//                         max={maxDate.toISOString().slice(0, 16)}
//                         className="w-full px-4 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
//                         required
//                         disabled={!isConnected || (!isPatient && !isDoctor)}
//                     />
//                     <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
//                         You can reschedule up to {maxFutureDays} days in advance.
//                     </p>
//                 </motion.div>
//                 <motion.div 
//                     className="mb-4 md:col-span-2"
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                 >
//                     <label htmlFor="details" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Updated Treatment Details:</label>
//                     <textarea
//                         id="details"
//                         value={details}
//                         onChange={(e) => setDetails(e.target.value)}
//                         className="w-full px-4 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
//                         rows={4}
//                         required
//                         disabled={!isConnected || (!isPatient && !isDoctor)}
//                     />
//                 </motion.div>
//                 <motion.button
//                     type="submit"
//                     disabled={isPending || txLoading || !isConnected || (!isPatient && !isDoctor) || appointmentExists === false}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="md:col-span-2 w-full bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
//                 >
//                     {isPending || txLoading ? 'Updating...' : 'Update Appointment'}
//                 </motion.button>
//             </form>
//             <AnimatePresence>
//                 {updateStatus && (
//                     <motion.div
//                         key="statusMessage"
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -10 }}
//                         className={`mt-6 p-4 rounded-md ${isSuccess ? 'bg-green-100 text-green-700 border-green-400' : 'bg-red-100 text-red-700 border-red-400'}`}
//                     >
//                         {updateStatus}
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// };

// export default UpdateAppointment;



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
    const [isDoctor, setIsDoctor] = useState<boolean | null>(null);
    const [appointmentExists, setAppointmentExists] = useState<boolean | null>(null);

    const { address, isConnected } = useAccount();
    const { writeContract, data: hash, error, isPending } = useWriteContract();
    const { isLoading: txLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

    // Get the DOCTOR_ROLE constant
    const { data: doctorRole } = useReadContract({
        ...contractHRC,
        functionName: 'DOCTOR_ROLE',
        address: contractHRC.address as `0x${string}`,
    });

    // Check if the connected address has the doctor role
    const { data: hasRoleData } = useReadContract({
        ...contractHRC,
        functionName: 'hasRole',
        args: [doctorRole as `0x${string}`, address as `0x${string}`],
        address: contractHRC.address as `0x${string}`,
    });

    const { data: maxDays } = useReadContract({
        ...contractSS,
        functionName: 'MAX_FUTURE_DAYS',
        address: contractSS.address as `0x${string}`,
    } as const);

    const { data: appointmentData } = useReadContract({
        ...contractSS,
        functionName: 'getAppointmentDetails',
        args: [BigInt(appointmentId)],
        address: contractSS.address as `0x${string}`,
    });

    useEffect(() => {
        if (maxDays) {
            setMaxFutureDays(Number(maxDays) / (24 * 60 * 60));
        }
    }, [maxDays]);

    useEffect(() => {
        if (isConnected) {
            setIsDoctor(hasRoleData as boolean);
        } else {
            setIsDoctor(null);
        }
    }, [isConnected, hasRoleData]);

    useEffect(() => {
        if (appointmentData) {
            setAppointmentExists(Boolean(appointmentData));
        } else {
            setAppointmentExists(null);
        }
    }, [appointmentData]);

    // const handleUpdateAppointment = async () => {
    //     if (!isConnected) {
    //         setUpdateStatus('Please connect your wallet first.');
    //         return;
    //     }

    //     if (!isDoctor) {
    //         setUpdateStatus('Error: Only registered doctors can update appointments.');
    //         return;
    //     }

    //     if (!appointmentExists) {
    //         setUpdateStatus('Error: This appointment does not exist in our records.');
    //         return;
    //     }

    //     writeContract({
    //         address: contractSS.address as `0x${string}`,
    //         abi: contractSS.abi,
    //         functionName: 'updateAppointment',
    //         args: [BigInt(appointmentId), BigInt(new Date(newDateTime).getTime() / 1000)],
    //     });
    // };

    const handleUpdateAppointment = async () => {
        if (!isConnected) {
            setUpdateStatus('Please connect your wallet first.');
            return;
        }

        if (!isDoctor) {
            setUpdateStatus('Error: Only registered doctors can update appointments.');
            return;
        }

        if (!appointmentExists) {
            setUpdateStatus('Error: This appointment does not exist in our records.');
            return;
        }

        try {
            writeContract({
                address: contractSS.address as `0x${string}`,
                abi: contractSS.abi,
                functionName: 'updateAppointment',
                args: [BigInt(appointmentId), BigInt(new Date(newDateTime).getTime() / 1000)],
            });
        } catch (err) {
            console.error(err);
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
            // Handle different types of errors
            if (error.message.includes('User rejected') || 
                error.message.includes('User denied') || 
                error.message.includes('rejected the request')) {
                setUpdateStatus('Transaction was cancelled.');
            } else if (error.message.includes('insufficient funds')) {
                setUpdateStatus('Error: Insufficient funds to process this transaction.');
            } else if (error.message.includes('execution reverted')) {
                // Handle specific contract revert reasons
                const revertReason = error.message.match(/reverted: ([^"]*)/)?.[1] || 
                                   'Transaction failed. Please try again.';
                setUpdateStatus(`Error: ${revertReason}`);
            } else {
                // For any other errors, show a user-friendly message
                setUpdateStatus('An error occurred while processing your request. Please try again.');
            }
        }
    }, [isSuccess, error]);

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + maxFutureDays);

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full mx-auto max-w-4xl md:max-w-6xl lg:max-w-full my-[70px]">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Update Your Patients Appointment</h2>
            {!isConnected ? (
                <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md">
                    <p>Please connect your wallet to update an appointment.</p>
                </div>
            ) : !isDoctor ? (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    <p>Only registered doctors can update appointments.</p>
                </div>
            ) : appointmentExists === false ? (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    <p>Error: This appointment does not exist in our records.</p>
                </div>
            ) : null}
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
                        disabled={!isConnected || !isDoctor}
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
                        disabled={!isConnected || !isDoctor}
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
                        disabled={!isConnected || !isDoctor}
                    />
                </motion.div>
                <motion.button
                    type="submit"
                    disabled={isPending || txLoading || !isConnected || !isDoctor || appointmentExists === false}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="md:col-span-2 w-full bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
                >
                    {isPending || txLoading ? 'Updating...' : 'Update Appointment'}
                </motion.button>
            </form>
            <AnimatePresence>
                {updateStatus && (
                    <motion.div
                        key="statusMessage"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`mt-6 p-4 rounded-md ${isSuccess ? 'bg-green-100 text-green-700 border-green-400' : 'bg-red-100 text-red-700 border-red-400'}`}
                    >
                        {updateStatus}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UpdateAppointment;
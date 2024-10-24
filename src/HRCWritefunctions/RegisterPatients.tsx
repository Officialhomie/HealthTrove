// import { useState, useEffect } from 'react';
// import { useWriteContract, useTransaction, useReadContract } from 'wagmi';
// import { formatEther } from 'viem';
// import { contractHRC } from '../contracts';

// const RegisterPatients = () => {
//     const [ailment, setAilment] = useState('');
//     const [reason, setReason] = useState('');
//     const [registrationStatus, setRegistrationStatus] = useState('');
//     const [registrationFee, setRegistrationFee] = useState<bigint>(BigInt(0));
//     const [registrationWallet, setRegistrationWallet] = useState<string>('');

//     const { writeContract, data: hash, isPending, isError, error } = useWriteContract();

//     const { isLoading: isConfirming, isSuccess } = useTransaction({
//         hash,
//     });

//     const { data: feeData } = useReadContract({
//         address: contractHRC.address as `0x${string}`,
//         abi: contractHRC.abi,
//         functionName: 'PATIENT_REGISTRATION_FEE',
//     });

//     const { data: walletData } = useReadContract({
//         address: contractHRC.address as `0x${string}`,
//         abi: contractHRC.abi,
//         functionName: 'registrationWallet',
//     });

//     useEffect(() => {
//         if (feeData) {
//             setRegistrationFee(BigInt(feeData.toString()));
//         }
//     }, [feeData]);

//     useEffect(() => {
//         if (walletData) {
//             // Truncate the wallet address for display
//             const truncatedWallet = `${walletData.toString().substring(0, 6)}...${walletData.toString().substring(walletData.toString().length - 4)}`;
//             setRegistrationWallet(truncatedWallet);
//         }
//     }, [walletData]);

//     const handleRegisterPatient = async () => {
//         try {
//             await writeContract({
//                 address: contractHRC.address as `0x${string}`,
//                 abi: contractHRC.abi,
//                 functionName: 'requestPatientRegistration',
//                 args: [ailment, reason],
//                 value: registrationFee,
//             });
//         } catch (error) {
//             console.error('Error registering patient:', error);
//             setRegistrationStatus('Error registering patient');
//         }
//     };

//     return (
//         <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-4xl mx-auto w-full md:max-w-full mb-9">
//             <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Request Patient Registration</h2>
//             <div className="mb-4">
//                 <input
//                     type="text"
//                     value={ailment}
//                     onChange={(e) => setAilment(e.target.value)}
//                     placeholder="Enter ailment"
//                     className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500 mb-2"
//                 />
//                 <input
//                     type="text"
//                     value={reason}
//                     onChange={(e) => setReason(e.target.value)}
//                     placeholder="Enter reason"
//                     className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
//                 />
//             </div>
//             <button
//                 onClick={handleRegisterPatient}
//                 disabled={isPending || isConfirming}
//                 className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//                 {isPending ? 'Preparing Transaction...' : isConfirming ? 'Confirming...' : 'Request Registration'}
//             </button>
//             {isSuccess && <p className="mt-4 text-lg text-center text-green-600">Registration request sent successfully!</p>}
//             {isError && <p className="mt-4 text-lg text-center text-red-600">Error: {error?.message}</p>}
//             {registrationStatus && <p className="mt-4 text-lg text-center">{registrationStatus}</p>}
//             <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
//                 Note: This transaction requires a registration fee of {formatEther(registrationFee)} ETH.
//             </p>
//             {registrationWallet && (
//                 <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
//                     Registration fee will be sent to: {registrationWallet}
//                 </p>
//             )}
//         </div>
//     );
// };

// export default RegisterPatients;

// import { useState, useEffect } from 'react';
// import { useWriteContract, useTransaction, useReadContract } from 'wagmi';
// import { formatEther } from 'viem';
// import { contractHRC } from '../contracts';

// const RegisterPatients = () => {
//     const [ailment, setAilment] = useState('');
//     const [reason, setReason] = useState('');
//     const [registrationStatus, setRegistrationStatus] = useState('');
//     const [registrationFee, setRegistrationFee] = useState<bigint>(BigInt(0));
//     const [registrationWallet, setRegistrationWallet] = useState<string>('');
//     const [transactionError, setTransactionError] = useState<string | null>(null);

//     const { writeContract, data: hash, isPending, isError, error } = useWriteContract();

//     const { isLoading: isConfirming, isSuccess } = useTransaction({
//         hash,
//     });

//     const { data: feeData } = useReadContract({
//         address: contractHRC.address as `0x${string}`,
//         abi: contractHRC.abi,
//         functionName: 'PATIENT_REGISTRATION_FEE',
//     });

//     const { data: walletData } = useReadContract({
//         address: contractHRC.address as `0x${string}`,
//         abi: contractHRC.abi,
//         functionName: 'registrationWallet',
//     });

//     useEffect(() => {
//         if (feeData) {
//             setRegistrationFee(BigInt(feeData.toString()));
//         }
//     }, [feeData]);

//     useEffect(() => {
//         if (walletData) {
//             const truncatedWallet = `${walletData.toString().substring(0, 6)}...${walletData.toString().substring(walletData.toString().length - 4)}`;
//             setRegistrationWallet(truncatedWallet);
//         }
//     }, [walletData]);

//     // Clear error messages when transaction states change
//     useEffect(() => {
//         if (isSuccess) {
//             setTransactionError(null);
//             setRegistrationStatus('');
//         }
//     }, [isSuccess]);

//     const handleRegisterPatient = async () => {
//         try {
//             setTransactionError(null);
//             setRegistrationStatus('');
            
//             if (!ailment.trim() || !reason.trim()) {
//                 setTransactionError('Please fill in both ailment and reason fields.');
//                 return;
//             }

//             await writeContract({
//                 address: contractHRC.address as `0x${string}`,
//                 abi: contractHRC.abi,
//                 functionName: 'requestPatientRegistration',
//                 args: [ailment, reason],
//                 value: registrationFee,
//             });
//         } catch (error: any) {
//             console.error('Error registering patient:', error);
            
//             // Handle specific error cases
//             if (error?.message?.includes('User rejected the transaction')) {
//                 setTransactionError('Transaction was rejected in your wallet. Please try again.');
//             } else if (error?.message?.includes('insufficient funds')) {
//                 setTransactionError('Insufficient funds to cover the registration fee and gas costs.');
//             } else if (error?.code === 'ACTION_REJECTED' || error?.code === 4001) {
//                 setTransactionError('You declined the transaction. Please try again if this was unintentional.');
//             } else {
//                 setTransactionError(
//                     'An error occurred while processing your registration. Please try again later.'
//                 );
//             }
            
//             setRegistrationStatus('Transaction failed');
//         }
//     };

//     // Helper function to render error message with appropriate styling
//     const renderErrorMessage = () => {
//         if (transactionError) {
//             return (
//                 <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
//                     <p className="text-sm text-red-600 flex items-center">
//                         <svg 
//                             className="w-4 h-4 mr-2" 
//                             fill="currentColor" 
//                             viewBox="0 0 20 20"
//                         >
//                             <path 
//                                 fillRule="evenodd" 
//                                 d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
//                                 clipRule="evenodd"
//                             />
//                         </svg>
//                         {transactionError}
//                     </p>
//                 </div>
//             );
//         }
//         return null;
//     };

//     return (
//         <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-4xl mx-auto w-full md:max-w-full mb-9">
//             <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Request Patient Registration</h2>
//             <div className="mb-4">
//                 <input
//                     type="text"
//                     value={ailment}
//                     onChange={(e) => setAilment(e.target.value)}
//                     placeholder="Enter ailment"
//                     className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500 mb-2"
//                 />
//                 <input
//                     type="text"
//                     value={reason}
//                     onChange={(e) => setReason(e.target.value)}
//                     placeholder="Enter reason"
//                     className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
//                 />
//             </div>
//             <button
//                 onClick={handleRegisterPatient}
//                 disabled={isPending || isConfirming}
//                 className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//                 {isPending ? 'Preparing Transaction...' : isConfirming ? 'Confirming...' : 'Request Registration'}
//             </button>
            
//             {renderErrorMessage()}
            
//             {isSuccess && (
//                 <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
//                     <p className="text-sm text-green-600 flex items-center">
//                         <svg 
//                             className="w-4 h-4 mr-2" 
//                             fill="currentColor" 
//                             viewBox="0 0 20 20"
//                         >
//                             <path 
//                                 fillRule="evenodd" 
//                                 d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
//                                 clipRule="evenodd"
//                             />
//                         </svg>
//                         Registration request sent successfully!
//                     </p>
//                 </div>
//             )}

//             <div className="mt-4 space-y-2">
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                     Note: This transaction requires a registration fee of {formatEther(registrationFee)} ETH.
//                 </p>
//                 {registrationWallet && (
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                         Registration fee will be sent to: {registrationWallet}
//                     </p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default RegisterPatients;

// working one

// import { useState, useEffect } from 'react';
// import { useWriteContract, useTransaction, useReadContract, useAccount } from 'wagmi';
// import { formatEther } from 'viem';
// import { contractHRC } from '../contracts';

// const RegisterPatients = () => {
//     const { address } = useAccount();
//     const [ailment, setAilment] = useState('');
//     const [reason, setReason] = useState('');
//     const [registrationStatus, setRegistrationStatus] = useState('');
//     const [registrationFee, setRegistrationFee] = useState<bigint>(BigInt(0));
//     const [registrationWallet, setRegistrationWallet] = useState<string>('');
//     const [transactionError, setTransactionError] = useState<string | null>(null);
//     const [isPendingPatient, setIsPendingPatient] = useState<boolean>(false);

//     const { writeContract, data: hash, isPending, isError, error } = useWriteContract();

//     const { isLoading: isConfirming, isSuccess } = useTransaction({
//         hash,
//     });

//     // Check if user is already a registered patient
//     const { data: isPatientData, isLoading: isCheckingPatient } = useReadContract({
//         address: contractHRC.address as `0x${string}`,
//         abi: contractHRC.abi,
//         functionName: 'isPatient',
//         args: [address],
//     });

//     // Get pending patients list
//     const { data: pendingPatientsData, isLoading: isLoadingPending } = useReadContract({
//         address: contractHRC.address as `0x${string}`,
//         abi: contractHRC.abi,
//         functionName: 'getPendingPatients',
//     });

//     const { data: feeData } = useReadContract({
//         address: contractHRC.address as `0x${string}`,
//         abi: contractHRC.abi,
//         functionName: 'PATIENT_REGISTRATION_FEE',
//     });

//     const { data: walletData } = useReadContract({
//         address: contractHRC.address as `0x${string}`,
//         abi: contractHRC.abi,
//         functionName: 'registrationWallet',
//     });

//     // Check if user is in pending patients list
//     useEffect(() => {
//         if (pendingPatientsData && address) {
//             const isPending = pendingPatientsData.some(
//                 (patient: { patientAddress: string }) => 
//                 patient.patientAddress.toLowerCase() === address.toLowerCase()
//             );
//             setIsPendingPatient(isPending);
//         }
//     }, [pendingPatientsData, address]);

//     useEffect(() => {
//         if (feeData) {
//             setRegistrationFee(BigInt(feeData.toString()));
//         }
//     }, [feeData]);

//     useEffect(() => {
//         if (walletData) {
//             const truncatedWallet = `${walletData.toString().substring(0, 6)}...${walletData.toString().substring(walletData.toString().length - 4)}`;
//             setRegistrationWallet(truncatedWallet);
//         }
//     }, [walletData]);

//     // Clear error messages when transaction states change
//     useEffect(() => {
//         if (isSuccess) {
//             setTransactionError(null);
//             setRegistrationStatus('');
//         }
//     }, [isSuccess]);

//     const handleRegisterPatient = async () => {
//         try {
//             setTransactionError(null);
//             setRegistrationStatus('');
            
//             if (!ailment.trim() || !reason.trim()) {
//                 setTransactionError('Please fill in both ailment and reason fields.');
//                 return;
//             }

//             await writeContract({
//                 address: contractHRC.address as `0x${string}`,
//                 abi: contractHRC.abi,
//                 functionName: 'requestPatientRegistration',
//                 args: [ailment, reason],
//                 value: registrationFee,
//             });
//         } catch (error: any) {
//             console.error('Error registering patient:', error);
            
//             if (error?.message?.includes('User rejected the transaction')) {
//                 setTransactionError('Transaction was rejected in your wallet. Please try again.');
//             } else if (error?.message?.includes('insufficient funds')) {
//                 setTransactionError('Insufficient funds to cover the registration fee and gas costs.');
//             } else if (error?.code === 'ACTION_REJECTED' || error?.code === 4001) {
//                 setTransactionError('You declined the transaction. Please try again if this was unintentional.');
//             } else {
//                 setTransactionError(
//                     'An error occurred while processing your registration. Please try again later.'
//                 );
//             }
            
//             setRegistrationStatus('Transaction failed');
//         }
//     };

//     const renderErrorMessage = () => {
//         if (transactionError) {
//             return (
//                 <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
//                     <p className="text-sm text-red-600 flex items-center">
//                         <svg 
//                             className="w-4 h-4 mr-2" 
//                             fill="currentColor" 
//                             viewBox="0 0 20 20"
//                         >
//                             <path 
//                                 fillRule="evenodd" 
//                                 d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
//                                 clipRule="evenodd"
//                             />
//                         </svg>
//                         {transactionError}
//                     </p>
//                 </div>
//             );
//         }
//         return null;
//     };

//     // Show loading state while checking statuses
//     if (isCheckingPatient || isLoadingPending) {
//         return (
//             <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-4xl mx-auto w-full md:max-w-full mb-9">
//                 <div className="flex items-center justify-center space-x-2">
//                     <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
//                     <p className="text-gray-600 dark:text-gray-400">
//                         Checking registration status...
//                     </p>
//                 </div>
//             </div>
//         );
//     }

//     // Show status for registered patients
//     if (isPatientData) {
//         return (
//             <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-4xl mx-auto w-full md:max-w-full mb-9">
//                 <div className="text-center">
//                     <svg 
//                         className="w-12 h-12 mx-auto text-green-500 mb-4" 
//                         fill="none" 
//                         stroke="currentColor" 
//                         viewBox="0 0 24 24"
//                     >
//                         <path 
//                             strokeLinecap="round" 
//                             strokeLinejoin="round" 
//                             strokeWidth={2} 
//                             d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
//                         />
//                     </svg>
//                     <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
//                         Already Registered
//                     </h2>
//                     <p className="text-gray-600 dark:text-gray-400">
//                         You are already registered as a patient in our system.
//                     </p>
//                 </div>
//             </div>
//         );
//     }

//     // Show status for pending patients
//     if (isPendingPatient) {
//         return (
//             <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-4xl mx-auto w-full md:max-w-full mb-9">
//                 <div className="text-center">
//                     <svg 
//                         className="w-12 h-12 mx-auto text-yellow-500 mb-4" 
//                         fill="none" 
//                         stroke="currentColor" 
//                         viewBox="0 0 24 24"
//                     >
//                         <path 
//                             strokeLinecap="round" 
//                             strokeLinejoin="round" 
//                             strokeWidth={2} 
//                             d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
//                         />
//                     </svg>
//                     <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
//                         Registration Pending
//                     </h2>
//                     <p className="text-gray-600 dark:text-gray-400">
//                         Your registration request is currently under review. Please wait for approval.
//                     </p>
//                 </div>
//             </div>
//         );
//     }

//     // Show registration form for new patients
//     return (
//         <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-4xl mx-auto w-full md:max-w-full mb-9">
//             <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Request Patient Registration</h2>
//             <div className="mb-4">
//                 <input
//                     type="text"
//                     value={ailment}
//                     onChange={(e) => setAilment(e.target.value)}
//                     placeholder="Enter ailment"
//                     className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500 mb-2"
//                 />
//                 <input
//                     type="text"
//                     value={reason}
//                     onChange={(e) => setReason(e.target.value)}
//                     placeholder="Enter reason"
//                     className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
//                 />
//             </div>
//             <button
//                 onClick={handleRegisterPatient}
//                 disabled={isPending || isConfirming}
//                 className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//                 {isPending ? 'Preparing Transaction...' : isConfirming ? 'Confirming...' : 'Request Registration'}
//             </button>
            
//             {renderErrorMessage()}
            
//             {isSuccess && (
//                 <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
//                     <p className="text-sm text-green-600 flex items-center">
//                         <svg 
//                             className="w-4 h-4 mr-2" 
//                             fill="currentColor" 
//                             viewBox="0 0 20 20"
//                         >
//                             <path 
//                                 fillRule="evenodd" 
//                                 d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
//                                 clipRule="evenodd"
//                             />
//                         </svg>
//                         Registration request sent successfully!
//                     </p>
//                 </div>
//             )}

//             <div className="mt-4 space-y-2">
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                     Note: This transaction requires a registration fee of {formatEther(registrationFee)} ETH.
//                 </p>
//                 {registrationWallet && (
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                         Registration fee will be sent to: {registrationWallet}
//                     </p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default RegisterPatients;

import { useState, useEffect } from 'react';
import { useWriteContract, useTransaction, useReadContract, useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { contractHRC } from '../contracts';

const RegisterPatients = () => {
    const { address } = useAccount();
    const [ailment, setAilment] = useState('');
    const [reason, setReason] = useState('');
    const [registrationFee, setRegistrationFee] = useState<bigint>(BigInt(0));
    const [registrationWallet, setRegistrationWallet] = useState<string>('');
    const [transactionError, setTransactionError] = useState<string | null>(null);
    const [isPendingPatient, setIsPendingPatient] = useState<boolean>(false);

    const { writeContract, data: hash, isPending } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useTransaction({
        hash,
    });

    // Check if user is already a registered patient
    const { data: isPatientData, isLoading: isCheckingPatient } = useReadContract({
        address: contractHRC.address as `0x${string}`,
        abi: contractHRC.abi,
        functionName: 'isPatient',
        args: address ? [address] : undefined,
    });

    // Get pending patients list
    const { data: pendingPatientsData, isLoading: isLoadingPending } = useReadContract({
        address: contractHRC.address as `0x${string}`,
        abi: contractHRC.abi,
        functionName: 'getPendingPatients',
    });

    const { data: feeData } = useReadContract({
        address: contractHRC.address as `0x${string}`,
        abi: contractHRC.abi,
        functionName: 'PATIENT_REGISTRATION_FEE',
    });

    const { data: walletData } = useReadContract({
        address: contractHRC.address as `0x${string}`,
        abi: contractHRC.abi,
        functionName: 'registrationWallet',
    });

    // Check if user is in pending patients list
    useEffect(() => {
        if (pendingPatientsData && address) {
            const isPending = Object.values(pendingPatientsData).some(
                (patient: { patientAddress: string }) => 
                patient.patientAddress.toLowerCase() === address.toLowerCase()
            );
            setIsPendingPatient(isPending);
        }
    }, [pendingPatientsData, address]);

    useEffect(() => {
        if (feeData) {
            setRegistrationFee(BigInt(feeData.toString()));
        }
    }, [feeData]);

    useEffect(() => {
        if (walletData) {
            const truncatedWallet = `${walletData.toString().substring(0, 6)}...${walletData.toString().substring(walletData.toString().length - 4)}`;
            setRegistrationWallet(truncatedWallet);
        }
    }, [walletData]);

    // Clear error messages when transaction succeeds
    useEffect(() => {
        if (isSuccess) {
            setTransactionError(null);
            setAilment('');
            setReason('');
        }
    }, [isSuccess]);

    const handleRegisterPatient = async () => {
        try {
            setTransactionError(null);
            
            if (!ailment.trim() || !reason.trim()) {
                setTransactionError('Please fill in both ailment and reason fields.');
                return;
            }

            await writeContract({
                address: contractHRC.address as `0x${string}`,
                abi: contractHRC.abi,
                functionName: 'requestPatientRegistration',
                args: [ailment, reason],
                value: registrationFee,
            });
        } catch (error: any) {
            console.error('Error registering patient:', error);
            
            if (error?.message?.includes('User rejected the transaction')) {
                setTransactionError('Transaction was rejected in your wallet. Please try again.');
            } else if (error?.message?.includes('insufficient funds')) {
                setTransactionError('Insufficient funds to cover the registration fee and gas costs.');
            } else if (error?.code === 'ACTION_REJECTED' || error?.code === 4001) {
                setTransactionError('You declined the transaction. Please try again if this was unintentional.');
            } else {
                setTransactionError(
                    'An error occurred while processing your registration. Please try again later.'
                );
            }
        }
    };

    const renderErrorMessage = () => {
        if (transactionError) {
            return (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600 flex items-center">
                        <svg 
                            className="w-4 h-4 mr-2" 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                        >
                            <path 
                                fillRule="evenodd" 
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                                clipRule="evenodd"
                            />
                        </svg>
                        {transactionError}
                    </p>
                </div>
            );
        }
        return null;
    };

    // Show loading state while checking statuses
    if (!address) {
        return (
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-4xl mx-auto w-full md:max-w-full mb-9">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                        Please connect your wallet to continue.
                    </p>
                </div>
            </div>
        );
    }

    if (isCheckingPatient || isLoadingPending) {
        return (
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-4xl mx-auto w-full md:max-w-full mb-9">
                <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Checking registration status...
                    </p>
                </div>
            </div>
        );
    }

    // Show status for registered patients
    if (isPatientData) {
        return (
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-4xl mx-auto w-full md:max-w-full mb-9">
                <div className="text-center">
                    <svg 
                        className="w-12 h-12 mx-auto text-green-500 mb-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                        Already Registered
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        You are already registered as a patient in our system.
                    </p>
                </div>
            </div>
        );
    }

    // Show status for pending patients
    if (isPendingPatient) {
        return (
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-4xl mx-auto w-full md:max-w-full mb-9">
                <div className="text-center">
                    <svg 
                        className="w-12 h-12 mx-auto text-yellow-500 mb-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                        Registration Pending
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Your registration request is currently under review. Please wait for approval.
                    </p>
                </div>
            </div>
        );
    }

    // Show registration form for new patients
    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-4xl mx-auto w-full md:max-w-full mb-9">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Request Patient Registration</h2>
            <div className="mb-4">
                <input
                    type="text"
                    value={ailment}
                    onChange={(e) => setAilment(e.target.value)}
                    placeholder="Enter ailment"
                    className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500 mb-2"
                />
                <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter reason"
                    className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
            </div>
            <button
                onClick={handleRegisterPatient}
                disabled={isPending || isConfirming}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? 'Preparing Transaction...' : isConfirming ? 'Confirming...' : 'Request Registration'}
            </button>
            
            {renderErrorMessage()}
            
            {isSuccess && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-600 flex items-center">
                        <svg 
                            className="w-4 h-4 mr-2" 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                        >
                            <path 
                                fillRule="evenodd" 
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                                clipRule="evenodd"
                            />
                        </svg>
                        Registration request sent successfully!
                    </p>
                </div>
            )}

            <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Note: This transaction requires a registration fee of {formatEther(registrationFee)} ETH.
                </p>
                {registrationWallet && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Registration fee will be sent to: {registrationWallet}
                    </p>
                )}
            </div>
        </div>
    );
};

export default RegisterPatients;
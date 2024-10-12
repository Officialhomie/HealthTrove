import { useState, useEffect } from 'react';
import { useWriteContract, useTransaction, useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { contractHRC } from '../contracts';

const RegisterPatients = () => {
    const [ailment, setAilment] = useState('');
    const [reason, setReason] = useState('');
    const [registrationStatus, setRegistrationStatus] = useState('');
    const [registrationFee, setRegistrationFee] = useState<bigint>(BigInt(0));
    const [registrationWallet, setRegistrationWallet] = useState<string>('');

    const { writeContract, data: hash, isPending, isError, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useTransaction({
        hash,
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

    useEffect(() => {
        if (feeData) {
            setRegistrationFee(BigInt(feeData.toString()));
        }
    }, [feeData]);

    useEffect(() => {
        if (walletData) {
            setRegistrationWallet(walletData.toString());
        }
    }, [walletData]);

    const handleRegisterPatient = async () => {
        try {
            await writeContract({
                address: contractHRC.address as `0x${string}`,
                abi: contractHRC.abi,
                functionName: 'requestPatientRegistration',
                args: [ailment, reason],
                value: registrationFee,
            });
        } catch (error) {
            console.error('Error registering patient:', error);
            setRegistrationStatus('Error registering patient');
        }
    };

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
            {isSuccess && <p className="mt-4 text-lg text-center text-green-600">Registration request sent successfully!</p>}
            {isError && <p className="mt-4 text-lg text-center text-red-600">Error: {error?.message}</p>}
            {registrationStatus && <p className="mt-4 text-lg text-center">{registrationStatus}</p>}
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Note: This transaction requires a registration fee of {formatEther(registrationFee)} ETH.
            </p>
            {registrationWallet && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Registration fee will be sent to: {registrationWallet}
                </p>
            )}
        </div>
    );
};

export default RegisterPatients;



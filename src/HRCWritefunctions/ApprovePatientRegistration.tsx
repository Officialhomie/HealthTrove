import { useState } from 'react';
import { useWriteContract, useTransaction, useReadContract } from 'wagmi';
import { contractHRC } from '../contracts';

const ApprovePatientRegistration = () => {
    const [patientAddress, setPatientAddress] = useState('');
    const [approvalStatus, setApprovalStatus] = useState('');
    const [isPendingPatient, setIsPendingPatient] = useState<boolean | null>(null);

    const { writeContract, data: hash, isPending, isError, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useTransaction({
        hash,
    });

    const { data: pendingStatus, isLoading: isCheckingPending } = useReadContract({
        address: contractHRC.address as `0x${string}`,
        abi: contractHRC.abi,
        functionName: 'hasPendingPatientRequest',
        args: [patientAddress],
    });

    const handleCheckPendingStatus = () => {
        if (pendingStatus !== undefined) {
            setIsPendingPatient(pendingStatus as boolean);
        }
    };

    const handleApprovePatient = async () => {
        try {
            if (!isPendingPatient) {
                setApprovalStatus('The patient does not have a pending registration request.');
                return;
            }

            setApprovalStatus('');
            await writeContract({
                address: contractHRC.address as `0x${string}`,
                abi: contractHRC.abi,
                functionName: 'approvePatientRegistration',
                args: [patientAddress],
            });
            setApprovalStatus('Approval request sent successfully.');
        } catch (error) {
            console.error('Error approving patient registration:', error);
            setApprovalStatus('Error approving patient registration');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-4xl mx-auto w-full md:max-w-full mb-9">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Approve Patient Registration</h2>
            <div className="mb-4">
                <input
                    type="text"
                    value={patientAddress}
                    onChange={(e) => {
                        setPatientAddress(e.target.value);
                        setIsPendingPatient(null); // Reset pending status when address changes
                    }}
                    placeholder="Enter patient address"
                    className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500 mb-2"
                />
                <button
                    onClick={handleCheckPendingStatus}
                    disabled={isCheckingPending || !patientAddress}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                    {isCheckingPending ? 'Checking...' : 'Check Pending Status'}
                </button>
                {isPendingPatient !== null && (
                    <p className="mt-2 text-sm text-center">
                        {isPendingPatient ? 'Patient has a pending request.' : 'No pending request for this patient.'}
                    </p>
                )}
            </div>
            <button
                onClick={handleApprovePatient}
                disabled={isPending || isConfirming || isPendingPatient === null || !isPendingPatient}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? 'Preparing Transaction...' : isConfirming ? 'Confirming...' : 'Approve Registration'}
            </button>
            {isSuccess && <p className="mt-4 text-lg text-center text-green-600">Approval successful!</p>}
            {isError && <p className="mt-4 text-lg text-center text-red-600">Error: {error?.message}</p>}
            {approvalStatus && <p className="mt-4 text-lg text-center">{approvalStatus}</p>}
        </div>
    );
};

export default ApprovePatientRegistration;

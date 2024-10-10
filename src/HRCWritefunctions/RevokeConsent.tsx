import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { isAddress } from 'viem';
import { contractHRC } from '../contracts';

const RevokeConsent = () => {
    const [doctorAddress, setDoctorAddress] = useState('');
    const [revokeStatus, setRevokeStatus] = useState('');

    const { writeContract, data: hash, error, isPending } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } = 
        useWaitForTransactionReceipt({
            hash,
        });

    const handleRevokeConsent = async () => {
        if (!doctorAddress) {
            setRevokeStatus('Please enter the doctor\'s address');
            return;
        }

        if (!isAddress(doctorAddress)) {
            setRevokeStatus('Please enter a valid Ethereum address');
            return;
        }

        try {
            await writeContract({
                address: contractHRC.address as `0x${string}`,
                    abi: contractHRC.abi,
                functionName: 'revokeConsent',
                args: [doctorAddress],
            });
            setRevokeStatus('Consent revoke request sent');
        } catch (error) {
            console.error('Error revoking consent:', error);
            setRevokeStatus('Error revoking consent');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Revoke Consent</h2>
            <div className="mb-4">
                <input
                    type="text"
                    value={doctorAddress}
                    onChange={(e) => setDoctorAddress(e.target.value)}
                    placeholder="Enter doctor's Ethereum address"
                    className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
            </div>
            <button
                onClick={handleRevokeConsent}
                disabled={isPending || isConfirming}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? 'Revoking...' : isConfirming ? 'Confirming...' : 'Revoke Consent'}
            </button>
            {isConfirmed && <p className="mt-4 text-lg text-center text-green-600">Consent revoked successfully!</p>}
            {error && <p className="mt-4 text-lg text-center text-red-600">Error: {error.message}</p>}
            {revokeStatus && <p className="mt-4 text-lg text-center">{revokeStatus}</p>}
        </div>
    );
};

export default RevokeConsent;
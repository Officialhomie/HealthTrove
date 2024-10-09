import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import contractHRC from '../contracts';

const AddDoctors = () => {
    const [doctorAddress, setDoctorAddress] = useState('');
    const [doctorName, setDoctorName] = useState('');
    const [doctorSpecialty, setDoctorSpecialty] = useState('');
    const [additionStatus, setAdditionStatus] = useState('');

    const { writeContract, data: hash, error, isPending } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } = 
        useWaitForTransactionReceipt({
            hash,
        });

    const handleAddDoctor = async () => {
        try {
            const result = await writeContract({
                address: contractHRC.address as `0x${string}`,
                abi: contractHRC.abi,
                functionName: 'addDoctor',
                args: [doctorAddress, doctorName, doctorSpecialty],
            });
            console.log('Transaction hash:', result);
            setAdditionStatus('Doctor addition request sent. Transaction hash: ' + result);
        } catch (error) {
            console.error('Error adding doctor:', error);
            setAdditionStatus('Error adding doctor');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Add Doctor</h2>
            <div className="mb-4">
                <input
                    type="text"
                    value={doctorAddress}
                    onChange={(e) => setDoctorAddress(e.target.value)}
                    placeholder="Enter doctor address"
                    className="w-full px-3 py-2 mb-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
                <input
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="Enter doctor name"
                    className="w-full px-3 py-2 mb-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
                <input
                    type="text"
                    value={doctorSpecialty}
                    onChange={(e) => setDoctorSpecialty(e.target.value)}
                    placeholder="Enter doctor specialty"
                    className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
            </div>
            <button
                onClick={handleAddDoctor}
                disabled={isPending || isConfirming}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? 'Sending...' : isConfirming ? 'Confirming...' : 'Add Doctor'}
            </button>
            {isConfirmed && <p className="mt-4 text-lg text-center text-green-600">Doctor added successfully!</p>}
            {error && <p className="mt-4 text-lg text-center text-red-600">Error: {error.message}</p>}
            {additionStatus && <p className="mt-4 text-lg text-center">{additionStatus}</p>}
        </div>
    );
};

export default AddDoctors;



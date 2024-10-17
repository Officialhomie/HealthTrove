import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { contractHRC } from '../contracts';
import { create } from 'ipfs-http-client';

// Set up IPFS client
const projectId = import.meta.env.VITE_INFURA_PROJECT_ID;
const apiSecretKey = import.meta.env.VITE_INFURA_API_SECRET_KEY;
const auth = 'Basic ' + btoa(projectId + ':' + apiSecretKey);
const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

const AddHealthRecord = () => {
    const [patientAddress, setPatientAddress] = useState('');
    const [file, setFile] = useState<File | null>(null); // File state as File | null
    const [additionStatus, setAdditionStatus] = useState('');

    const { writeContract, data: hash, error, isPending } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } = 
        useWaitForTransactionReceipt({
            hash,
        });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]); // Set file state
        } else {
            console.error('No file selected');
        }
    };

    const uploadToIPFS = async (file: File) => {
        if (!file) {
            throw new Error('No file provided for upload');
        }
        try {
            const added = await client.add(file);
            console.log(`File uploaded to IPFS: https://ipfs.infura.io/ipfs/${added.path}`);
            return added.path; // Return the IPFS hash
        } catch (error) {
            console.error('Error uploading file to IPFS:', error);
            throw error;
        }
    };

    const handleAddHealthRecord = async () => {
        try {
            if (!file) {
                throw new Error('Please select a file to upload');
            }

            setAdditionStatus('Uploading file to IPFS...');
            const ipfsHash = await uploadToIPFS(file);
            setAdditionStatus('File uploaded to IPFS. Adding health record...');

            const result = await writeContract({
                address: contractHRC.address as `0x${string}`,
                abi: contractHRC.abi,
                functionName: 'addHealthRecord',
                args: [patientAddress, ipfsHash],
            });
            console.log('Transaction hash:', result);
            setAdditionStatus('Health record addition request sent. Transaction hash: ' + result);
        } catch (error) {
            console.error('Error adding health record:', error);
            setAdditionStatus('Error adding health record: ' + (error instanceof Error ? error.message : String(error)));
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Add Health Record</h2>
            <div className="mb-4">
                <input
                    type="text"
                    value={patientAddress}
                    onChange={(e) => setPatientAddress(e.target.value)}
                    placeholder="Enter patient address"
                    className="w-full px-3 py-2 mb-3 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
            </div>
            <button
                onClick={handleAddHealthRecord}
                disabled={isPending || isConfirming}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? 'Sending...' : isConfirming ? 'Confirming...' : 'Add Health Record'}
            </button>
            {isConfirmed && <p className="mt-4 text-lg text-center text-green-600">Health record added successfully!</p>}
            {error && <p className="mt-4 text-lg text-center text-red-600">Error: {error.message}</p>}
            {additionStatus && <p className="mt-4 text-lg text-center">{additionStatus}</p>}
        </div>
    );
};

export default AddHealthRecord;

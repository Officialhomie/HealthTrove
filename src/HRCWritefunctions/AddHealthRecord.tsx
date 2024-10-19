import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { contractHRC } from '../contracts';
import IPFSUpload from '../components/IPFSUpload';

const AddHealthRecord = () => {
    const [patientAddress, setPatientAddress] = useState('');
    const [ipfsHash, setIpfsHash] = useState<string>('');
    const [additionStatus, setAdditionStatus] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [fileUploaded, setFileUploaded] = useState(false); // Added to track file upload status

    const { writeContract, data: transactionHash, error, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: transactionHash,
    });

    const handleUploadSuccess = (hash: string) => {
        setIpfsHash(hash);
        setAdditionStatus('File uploaded to IPFS. Ready to add health record.');
        setIsUploading(false);
        setFileUploaded(true); // Set fileUploaded to true on success
    };

    const handleUploadError = (error: string) => {
        setAdditionStatus(`Error uploading file: ${error}`);
        setIsUploading(false);
        setFileUploaded(false); // Set fileUploaded to false on error
    };

    const handleAddHealthRecord = async () => {
        try {
            if (!ipfsHash || !fileUploaded) { // Check if file has been uploaded successfully
                throw new Error('Please upload a file to IPFS first');
            }

            setAdditionStatus('Adding health record...');

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

    const handleCopyHash = () => {
        navigator.clipboard.writeText(ipfsHash);
        setAdditionStatus('IPFS Hash copied to clipboard');
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
                <IPFSUpload onUploadSuccess={handleUploadSuccess} onUploadError={handleUploadError} />
            </div>
            <button
                onClick={handleAddHealthRecord}
                disabled={isPending || isConfirming || isUploading || !fileUploaded} // Disable button until file is uploaded successfully
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
            >
                {isPending ? 'Sending...' : isConfirming ? 'Confirming...' : 'Add Health Record'}
            </button>
            {isConfirmed && <p className="mt-4 text-lg text-center text-green-600">Health record added successfully!</p>}
            {error && <p className="mt-4 text-lg text-center text-red-600">Error: {error.message}</p>}
            {additionStatus && <p className="mt-4 text-lg text-center">{additionStatus}</p>}
            {ipfsHash && (
                <div className="mt-4 text-sm text-center">
                    <p>IPFS Hash: {ipfsHash}</p>
                    <button onClick={handleCopyHash} className="text-indigo-600 hover:underline focus:outline-none">
                        Copy to Clipboard
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddHealthRecord;

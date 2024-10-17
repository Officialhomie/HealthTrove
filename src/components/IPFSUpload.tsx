import React, { useState } from 'react';
import axios from 'axios';

interface IPFSUploadProps {
  onUploadSuccess: (hash: string) => void;
  onUploadError: (error: string) => void;
}

const IPFSUpload: React.FC<IPFSUploadProps> = ({ onUploadSuccess, onUploadError }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY;
  const pinataSecretApiKey = import.meta.env.VITE_PINATA_SECRET_API_KEY;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      console.error('No file selected');
    }
  };

  const uploadToPinata = async () => {
    if (!file) {
      onUploadError('No file provided for upload');
      return;
    }
    try {
      setUploadStatus('Uploading to IPFS...');
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        maxContentLength: Infinity,
        headers: {
          'Content-Type': `multipart/form-data`,
          'pinata_api_key': pinataApiKey,
          'pinata_secret_api_key': pinataSecretApiKey,
        },
      });

      console.log(`File uploaded to IPFS: https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`);
      setUploadStatus('File uploaded successfully');
      onUploadSuccess(res.data.IpfsHash);
    } catch (error) {
      console.error('Error uploading file to Pinata:', error);
      setUploadStatus('Error uploading file');
      onUploadError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        className="w-full px-3 py-2 mb-3 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
      />
      <button
        onClick={uploadToPinata}
        disabled={!file}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Upload to IPFS
      </button>
      {uploadStatus && <p className="mt-2 text-sm text-center">{uploadStatus}</p>}
    </div>
  );
};

export default IPFSUpload;
import React, { useState } from 'react';
import axios from 'axios';

const RetrieveIPFSContent: React.FC = () => {
    const [ipfsHash, setIpfsHash] = useState('');
    const [content, setContent] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleRetrieveContent = async () => {
        if (!ipfsHash) {
            setError('Please provide a valid IPFS hash.');
            return;
        }

        try {
            setError(null);
            setContent(null);

            // Fetching the content from IPFS via a public gateway
            const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
            setContent(response.data);
        } catch (err) {
            setError('Error retrieving content from IPFS: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full mx-auto mt-[70px]">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Retrieve IPFS Content</h2>
            <div className="mb-4">
                <input
                    type="text"
                    value={ipfsHash}
                    onChange={(e) => setIpfsHash(e.target.value)}
                    placeholder="Enter IPFS hash"
                    className="w-full px-3 py-2 mb-3 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
            </div>
            <button
                onClick={handleRetrieveContent}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
            >
                Retrieve Content
            </button>
            {error && <p className="mt-4 text-lg text-center text-red-600">Error: {error}</p>}
            {content && <pre className="mt-4 p-4 bg-gray-100 rounded text-gray-700 overflow-auto">{JSON.stringify(content, null, 2)}</pre>}
        </div>
    );
};

export default RetrieveIPFSContent;

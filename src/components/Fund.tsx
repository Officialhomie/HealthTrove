import { useState } from 'react';
import { FundButton } from '@coinbase/onchainkit/fund';
import { useAccount } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';

const FundAccount = () => {
    const { address, isConnected } = useAccount();
    const [showInfo, setShowInfo] = useState(false);

    return (
        <div className="mt-8 w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
            >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2 md:mb-0">
                        Fund Your Account
                    </h3>
                    {address && (
                        <div className="text-base text-gray-500 dark:text-gray-400 font-mono break-all">
                            {`${address.slice(0, 6)}...${address.slice(-4)}`}
                        </div>
                    )}
                </div>
                
                {!isConnected ? (
                    <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md text-base">
                        <p>Please connect your wallet first to fund your account.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                            <div className="flex flex-col justify-center">
                                <p className="text-base text-gray-600 dark:text-gray-300 mb-3">
                                    Add funds to your wallet to enable platform features.
                                </p>
                                <motion.button
                                    onClick={() => setShowInfo(!showInfo)}
                                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline text-base"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {showInfo ? "Hide Details" : "Why do I need funds?"}
                                </motion.button>
                            </div>
                            <div className="flex justify-center md:justify-end">
                                <FundButton />
                            </div>
                        </div>

                        <AnimatePresence>
                            {showInfo && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mt-2">
                                        <h4 className="font-medium text-gray-800 dark:text-white mb-2 text-base">
                                            Why Fund Your Account?
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <ul className="text-base text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1">
                                                <li>Cover transaction fees (gas)</li>
                                                <li>Enable smart contract interactions</li>
                                            </ul>
                                            <ul className="text-base text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1">
                                                <li>Access platform features</li>
                                                <li>Maintain account security</li>
                                            </ul>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default FundAccount;
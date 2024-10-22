// import { Avatar, Identity, Name, Badge, Address } from '@coinbase/onchainkit/identity';

// const IdentityComponent = ({ address }: { address: string }) => {
//   return (
//     <div>
//         <Identity
//         address={address as `0x${string}`}
//         schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
//         className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
//         >
//         <Avatar className="w-24 h-24 rounded-full mb-4 border-4 border-indigo-500" />
//         <Name className="text-2xl font-bold text-blue-800 dark:text-white mb-2">
//             <Badge className="ml-2 px-2 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full" />
//         </Name>
//         <Address className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full" />
//         </Identity>
//     </div>
//   )
// }

// export default IdentityComponent






// import { useMemo, useState } from 'react';
// import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
// import { useCapabilities, useWriteContracts } from "wagmi/experimental";

// import { AbiFunction, isAddress, keccak256, Narrow, toBytes } from 'viem';
// import { contractHRC } from '../contracts';
// import { writeContracts } from 'viem/experimental';

// const RevokeRole = () => {
//     const [roleType, setRoleType] = useState('');
//     const [accountAddress, setAccountAddress] = useState('');
//     const [revokeStatus, setRevokeStatus] = useState('');

//     const { writeContract, data: hash, error, isPending } = useWriteContract();

//     const { isLoading: isConfirming, isSuccess: isConfirmed } = 
//         useWaitForTransactionReceipt({
//             hash,
//         });


//     const account = useAccount();


//     const { data: availableCapabilities } = useCapabilities({
//         account: account.address,
//         });
//         const capabilities = useMemo(() => {
//         if (!availableCapabilities || !account.chainId) return {};
//         const capabilitiesForChain = availableCapabilities[account.chainId];
//         if (
//             capabilitiesForChain["paymasterService"] &&
//             capabilitiesForChain["paymasterService"].supported
//         ) {
//             return {
//             paymasterService: {
//                 url: `https://api.developer.coinbase.com/rpc/v1/base-sepolia/31Qwwnsz7Gsq5g04bWovmUEvVWXdYR__`,
//             },
//             };
//         }
//         return {};
//     }, [availableCapabilities, account.chainId]);


//     const homiePaymaster = () => {
//         const roleHash = keccak256(toBytes(roleType));

//         writeContracts({
//           contracts: [
//             {
//               address: contractHRC.address as `0x${string}`,
//               abi: contractHRC.abi as readonly Narrow<AbiFunction>[],
//               functionName: "revokeRole",
//               args: [roleHash, accountAddress],
//             },
//           ],
//           capabilities,
//         });
//     }

//     const handleRevokeRole = async () => {
//         if (!roleType || !accountAddress) {
//             setRevokeStatus('Please enter both role type and account address');
//             return;
//         }

//         if (!isAddress(accountAddress)) {
//             setRevokeStatus('Please enter a valid Ethereum address');
//             return;
//         }

//         try {
//             const roleHash = keccak256(toBytes(roleType));
//             await writeContract({
//                 address: contractHRC.address as `0x${string}`,
//                 abi: contractHRC.abi,
//                 functionName: 'revokeRole',
//                 args: [roleHash, accountAddress],
//             });
//             setRevokeStatus('Role revoke request sent');
//         } catch (error) {
//             console.error('Error revoking role:', error);
//             setRevokeStatus('Error revoking role');
//         }
//     };

//     return (
//         <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
//             <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Revoke Role</h2>
//             <div className="mb-4">
//                 <input
//                     type="text"
//                     value={roleType}
//                     onChange={(e) => setRoleType(e.target.value)}
//                     placeholder="Enter role type (e.g., ADMIN_ROLE)"
//                     className="w-full px-3 py-2 mb-3 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
//                 />
//                 <input
//                     type="text"
//                     value={accountAddress}
//                     onChange={(e) => setAccountAddress(e.target.value)}
//                     placeholder="Enter account Ethereum address"
//                     className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
//                 />
//             </div>
//             <button
//                 onClick={handleRevokeRole}
//                 disabled={isPending || isConfirming}
//                 className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//                 {isPending ? 'Revoking...' : isConfirming ? 'Confirming...' : 'Revoke Role'}
//             </button>
//             {isConfirmed && <p className="mt-4 text-lg text-center text-green-600">Role revoked successfully!</p>}
//             {error && <p className="mt-4 text-lg text-center text-red-600">Error: {error.message}</p>}
//             {revokeStatus && <p className="mt-4 text-lg text-center">{revokeStatus}</p>}
//         </div>
//     );
// };

// export default RevokeRole;


// import { useMemo, useState } from 'react';
// import { useAccount } from 'wagmi';
// import { useCapabilities, useWriteContracts } from "wagmi/experimental";
// import { isAddress, keccak256, toBytes, Narrow, AbiFunction } from 'viem';
// import { contractHRC } from '../contracts';

// const RevokeRole = () => {
//     const [roleType, setRoleType] = useState('');
//     const [accountAddress, setAccountAddress] = useState('');
//     const [revokeStatus, setRevokeStatus] = useState('');
//     const [transactionId, setTransactionId] = useState<string | null>(null);

//     const account = useAccount();
    
//     // Setup write contracts with success callback
//     const { writeContracts } = useWriteContracts({
//         mutation: { 
//             onSuccess: (id) => {
//                 setTransactionId(id);
//                 setRevokeStatus('Role revoke request sent successfully');
//             },
//             onError: (error) => {
//                 console.error('Error revoking role:', error);
//                 setRevokeStatus('Error revoking role: ' + error.message);
//             }
//         },
//     });

//     // Setup capabilities for paymaster
//     const { data: availableCapabilities } = useCapabilities({
//         account: account.address,
//     });

//     const capabilities = useMemo(() => {
//         if (!availableCapabilities || !account.chainId) return {};
        
//         const capabilitiesForChain = availableCapabilities[account.chainId];
//         if (
//             capabilitiesForChain["paymasterService"] &&
//             capabilitiesForChain["paymasterService"].supported
//         ) {
//             return {
//                 paymasterService: {
//                     url: `https://api.developer.coinbase.com/rpc/v1/base-sepolia/31Qwwnsz7Gsq5g04bWovmUEvVWXdYR__`,
//                 },
//             };
//         }
//         return {};
//     }, [availableCapabilities, account.chainId]);

//     const handleRevokeRole = async () => {
//         if (!roleType || !accountAddress) {
//             setRevokeStatus('Please enter both role type and account address');
//             return;
//         }

//         if (!isAddress(accountAddress)) {
//             setRevokeStatus('Please enter a valid Ethereum address');
//             return;
//         }

//         try {
//             const roleHash = keccak256(toBytes(roleType));
            
//             await writeContracts({
//                 contracts: [
//                     {
//                         address: contractHRC.address as `0x${string}`,
//                         abi: contractHRC.abi as readonly Narrow<AbiFunction>[],
//                         functionName: 'revokeRole',
//                         args: [roleHash, accountAddress],
//                     },
//                 ],
//                 capabilities,
//             });
//         } catch (error: any) {
//             console.error('Error revoking role:', error);
//             setRevokeStatus('Error revoking role: ' + error.message);
//         }
//     };

//     return (
//         <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full mx-auto">
//             <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Revoke Role</h2>
            
//             <div className="mb-4">
//                 <input
//                     type="text"
//                     value={roleType}
//                     onChange={(e) => setRoleType(e.target.value)}
//                     placeholder="Enter role type (e.g., ADMIN_ROLE)"
//                     className="w-full px-3 py-2 mb-3 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
//                 />
//                 <input
//                     type="text"
//                     value={accountAddress}
//                     onChange={(e) => setAccountAddress(e.target.value)}
//                     placeholder="Enter account Ethereum address"
//                     className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
//                 />
//             </div>

//             <button
//                 onClick={handleRevokeRole}
//                 className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//                 Revoke Role
//             </button>

//             {revokeStatus && (
//                 <p className={`mt-4 text-lg text-center ${
//                     revokeStatus.includes('Error') ? 'text-red-600' : 'text-green-600'
//                 }`}>
//                     {revokeStatus}
//                 </p>
//             )}

//             {/* Optional: Display capabilities for debugging */}
//             <div className="mt-4 text-sm text-gray-500">
//                 <p>Paymaster Capabilities:</p>
//                 <pre className="overflow-auto">
//                     {JSON.stringify(capabilities, null, 2)}
//                 </pre>
//             </div>
//         </div>
//     );
// };

// export default RevokeRole;

import { useMemo, useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useCapabilities } from "wagmi/experimental";
import { isAddress, keccak256, toBytes } from 'viem';
import { contractHRC } from '../contracts';

const RevokeRole = () => {
    const [roleType, setRoleType] = useState('');
    const [accountAddress, setAccountAddress] = useState('');
    const [revokeStatus, setRevokeStatus] = useState('');

    const account = useAccount();
    
    const { writeContract, data: hash, error, isPending } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } = 
        useWaitForTransactionReceipt({
            hash,
        });

    // Setup capabilities for paymaster
    const { data: availableCapabilities } = useCapabilities({
        account: account.address,
    });

    const capabilities = useMemo(() => {
        if (!availableCapabilities || !account.chainId) return {};
        
        const capabilitiesForChain = availableCapabilities[account.chainId];
        if (
            capabilitiesForChain["paymasterService"] &&
            capabilitiesForChain["paymasterService"].supported
        ) {
            return {
                paymasterService: {
                    url: `https://api.developer.coinbase.com/rpc/v1/base-sepolia/31Qwwnsz7Gsq5g04bWovmUEvVWXdYR__`,
                },
            };
        }
        return {};
    }, [availableCapabilities, account.chainId]);

    const handleRevokeRole = async () => {
        if (!roleType || !accountAddress) {
            setRevokeStatus('Please enter both role type and account address');
            return;
        }

        if (!isAddress(accountAddress)) {
            setRevokeStatus('Please enter a valid Ethereum address');
            return;
        }

        try {
            const roleHash = keccak256(toBytes(roleType));
            
            await writeContract({
                address: contractHRC.address as `0x${string}`,
                abi: contractHRC.abi,
                functionName: 'revokeRole',
                args: [roleHash, accountAddress],
                // Include paymaster data in the request
                ...capabilities,
            });
            
            setRevokeStatus('Role revoke request sent');
        } catch (error: any) {
            console.error('Error revoking role:', error);
            setRevokeStatus(`Error revoking role: ${error.message}`);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Revoke Role</h2>
            
            <div className="mb-4">
                <input
                    type="text"
                    value={roleType}
                    onChange={(e) => setRoleType(e.target.value)}
                    placeholder="Enter role type (e.g., ADMIN_ROLE)"
                    className="w-full px-3 py-2 mb-3 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
                <input
                    type="text"
                    value={accountAddress}
                    onChange={(e) => setAccountAddress(e.target.value)}
                    placeholder="Enter account Ethereum address"
                    className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
            </div>

            <button
                onClick={handleRevokeRole}
                disabled={isPending || isConfirming}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? 'Revoking...' : isConfirming ? 'Confirming...' : 'Revoke Role'}
            </button>

            {isConfirmed && (
                <p className="mt-4 text-lg text-center text-green-600">
                    Role revoked successfully!
                </p>
            )}
            
            {error && (
                <p className="mt-4 text-lg text-center text-red-600">
                    Error: {error.message}
                </p>
            )}

            {revokeStatus && (
                <p className={`mt-4 text-lg text-center ${
                    revokeStatus.includes('Error') ? 'text-red-600' : 'text-green-600'
                }`}>
                    {revokeStatus}
                </p>
            )}

            {/* Optional: Display capabilities for debugging */}
            <div className="mt-4 text-sm text-gray-500">
                <p>Paymaster Capabilities:</p>
                <pre className="overflow-auto">
                    {JSON.stringify(capabilities, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default RevokeRole;



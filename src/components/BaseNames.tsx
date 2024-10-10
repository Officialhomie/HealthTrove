import { Avatar, Identity, Name, Badge, Address } from '@coinbase/onchainkit/identity';

const IdentityComponent = ({ address }: { address: string }) => {
  return (
    <div>
        <Identity
        address={address as `0x${string}`}
        schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
        className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
        <Avatar className="w-24 h-24 rounded-full mb-4 border-4 border-indigo-500" />
        <Name className="text-2xl font-bold text-blue-800 dark:text-white mb-2">
            <Badge className="ml-2 px-2 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full" />
        </Name>
        <Address className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full" />
        </Identity>
    </div>
  )
}

export default IdentityComponent



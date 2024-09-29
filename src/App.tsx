import { useAccount, useConnect, useDisconnect } from 'wagmi'

function App() {
  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-5xl font-bold mb-4">Account</h2>

        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <p className="mb-2"><span className="font-semibold">Status:</span> {account.status}</p>
          <p className="mb-2"><span className="font-semibold">Addresses:</span> {JSON.stringify(account.addresses)}</p>
          <p><span className="font-semibold">Chain ID:</span> {account.chainId}</p>
        </div>

        {account.status === 'connected' && (
          <button
            type="button"
            onClick={() => disconnect()}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Disconnect
          </button>
        )}
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Connect</h2>
        <div className="flex flex-wrap gap-4 mb-6">
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => connect({ connector })}
              type="button"
              className="light:bg-indigo-500 hover:bg-indigo-700 text-yellow font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              {connector.name}
            </button>
          ))}
        </div>
        <div className="text-gray-700 mb-2">{status}</div>
        {error && <div className="text-red-500">{error.message}</div>}
      </div>
    </div>
  )
}

export default App

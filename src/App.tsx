import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected, metaMask } from 'wagmi/connectors'
import { BlackCreateWalletButton } from './components/BlackCreateWalletButton'
import IdentityComponent from './components/BaseNames'
import { WalletComponents } from './components/WalletComponent'
import AdminRole from './Readfunctions/AdminRole'
import RegisterPatients from './writefunctions/RegisterPatients'
import AddDoctors from './writefunctions/AddDoctors'
import AddHealthRecord from './writefunctions/AddHealthRecord'
import DeactivateRecord from './writefunctions/DeactivateRecord'
import UpdateHealthRecord from './writefunctions/UpdateHealthRecord'
import GrantRole from './writefunctions/GrantRole'
import RenounceRole from './writefunctions/RenounceRole'
import RemoveDoctor from './writefunctions/RemoveDoctor'
import GiveConsent from './writefunctions/GiveConsent'
import RevokeConsent from './writefunctions/RevokeConsent'
import DoctorRegisteredListener from './events/DoctorRegistered'
import GetAllDoctors from './Readfunctions/GetAllDoctors'

function App() {
  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 mb-8 md:mb-0">
          <IdentityComponent address={account.address ?? ''} />
        </div>
        <div className="w-full md:w-2/3 md:pl-8">
          <div className="mb-12 space-y-8">
            <h2 className="text-5xl font-bold mb-8 text-indigo-600 dark:text-indigo-400">Account</h2>
            
            <div className="mb-8">
              <BlackCreateWalletButton />
            </div>

            <div className="bg-indigo-100 dark:bg-indigo-900 p-8 rounded-lg shadow-md space-y-6">
              <p className="text-xl">
                <span className="font-semibold text-indigo-700 dark:text-indigo-300 mr-3">Status:</span>
                <span className="text-gray-800 dark:text-gray-200">{account.status}</span>
              </p>
              <p className="text-xl">
                <span className="font-semibold text-indigo-700 dark:text-indigo-300 mr-3">Addresses:</span>
                <span className="text-gray-800 dark:text-gray-200 break-all">{JSON.stringify(account.addresses)}</span>
              </p>
              <p className="text-xl">
                <span className="font-semibold text-indigo-700 dark:text-indigo-300 mr-3">Chain ID:</span>
                <span className="text-gray-800 dark:text-gray-200">{account.chainId}</span>
              </p>
            </div>

            {account.status === 'connected' && (
              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => disconnect()}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
          
          <div>
            {/* <h2 className="text-2xl font-bold mb-4 text-green-500">Connect</h2> */}
            {/* <div className="flex flex-wrap gap-4 mb-6">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                  type="button"
                  className="bg-indigo-500 hover:bg-indigo-700 text-yellow font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                  {connector.name}
                </button>
              ))}
            </div> */}
            {/* <div className="text-gray-700 mb-2">{status}</div> */}
            {error && <div className="text-red-500">{error.message}</div>}
          </div>

          <button
            onClick={() => connect({ connector: metaMask() })}
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Connect
          </button>

          <WalletComponents />

          <AdminRole />

          <RegisterPatients />  

          <AddDoctors />

          <AddHealthRecord /> 

          <DeactivateRecord />

          <UpdateHealthRecord />

          <GiveConsent />

          <RegisterPatients />  

          <GrantRole />

          <RenounceRole />

          <RemoveDoctor />  

          <RevokeConsent />

          <DoctorRegisteredListener />

          <GetAllDoctors />


        </div>
      </div>
    </div>
  )
}

export default App

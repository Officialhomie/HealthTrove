import { useEffect, useState } from 'react';
import {
  useAccount, useConnect, useDisconnect,
  injected, metaMask,
  BlackCreateWalletButton, IdentityComponent, WalletComponents,
  AdminRole, RegisterPatients, AddDoctors, AddHealthRecord, DeactivateRecord, UpdateHealthRecord,
  GrantRole, RenounceRole, RemoveDoctor, GiveConsent, RevokeConsent, 
  DoctorRegisteredListener, GetAllDoctors, GetAllPatients, HasRole,
  CancelAppointment, ScheduleAppointment, UpdateAppointment,
  GetHealthcareRecordManagement, CheckTakenSlots, GetAppointmentDetails,
  AppointmentCancelledListener, AppointmentUpdatedListener, AppointmentScheduledListener,
  Appointments, GetDoctorAppointments, GetPatientAppointments, GetTotalAppointments,
  PatientRegisteredListener
} from './exports';


function App() {
  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()
  const [address, setAddress] = useState<string | undefined>(undefined)

  useEffect(() => {
    if(account.address) {
      setAddress(JSON.stringify(account.address))
    }
  }, [account.address])

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 mb-8 md:mb-0">
          {/* <IdentityComponent address={account.address ?? ''} /> */}
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
          
          <WalletComponents address={address ?? ''} />
        </div>
      </div>

      <div className="grid gap-8">
        {/* Write Functions */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Write Functions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RegisterPatients />
            <AddDoctors />
            <AddHealthRecord />
            <DeactivateRecord />
            <UpdateHealthRecord />
            <GiveConsent />
            <GrantRole />
            <RenounceRole />
            <RemoveDoctor />
            <RevokeConsent />
          </div>
        </div>

        {/* Read Functions */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Read Functions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AdminRole />
            <GetAllDoctors />
            <GetAllPatients />
            <HasRole />
          </div>
        </div>

        {/* Events */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DoctorRegisteredListener />
            <PatientRegisteredListener />
            {/* <FetchPastEvent /> */}
          </div>
        </div>

        {/* SS Write Functions */}
        <div>
          <h2 className="text-2xl font-bold mb-4">SS Write Functions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CancelAppointment />
            <ScheduleAppointment />
            <UpdateAppointment />
          </div>
        </div>  

        {/* SS Read Functions */}
        <div>
          <h2 className="text-2xl font-bold mb-4">SS Read Functions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GetAppointmentDetails />
            <GetHealthcareRecordManagement />
            <CheckTakenSlots />
            <Appointments />
            <GetDoctorAppointments />
            <GetPatientAppointments />
            <GetTotalAppointments />
          </div>
        </div>  

        {/* SS Events */}
        <div>
          <h2 className="text-2xl font-bold mb-4">SS Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AppointmentScheduledListener />
            <AppointmentUpdatedListener />
            <AppointmentCancelledListener />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

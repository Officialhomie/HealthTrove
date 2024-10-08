import{ useState } from 'react';
import { useWriteContract } from 'wagmi';
import contract from '../contracts';

const RegisterPatients = () => {
    const [patientAddress, setPatientAddress] = useState('');
    const [registrationStatus, setRegistrationStatus] = useState('');

    const { writeContract, isPending, isSuccess, isError, error } = useWriteContract();

    const handleRegisterPatient = async () => {
        try {
            await writeContract({
                address: contract.address as `0x${string}`,
                abi: contract.abi,
                functionName: 'registerPatient',
            });
            setRegistrationStatus('Registration request sent');
        } catch (error) {
            console.error('Error registering patient:', error);
            setRegistrationStatus('Error registering patient');
        }
    };


    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Register Patient</h2>
            <div className="mb-4">
                <input
                    type="text"
                    value={patientAddress}
                    onChange={(e) => setPatientAddress(e.target.value)}
                    placeholder="Enter patient address"
                    className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
            </div>
            <button
                onClick={handleRegisterPatient}
                disabled={isPending}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? 'Registering...' : 'Register Patient'}
            </button>
            {isSuccess && <p className="mt-4 text-lg text-center text-green-600">Registration successful!</p>}
            {isError && <p className="mt-4 text-lg text-center text-red-600">Error: {error?.message}</p>}
            {registrationStatus && <p className="mt-4 text-lg text-center">{registrationStatus}</p>}
        </div>
    );
};

export default RegisterPatients;

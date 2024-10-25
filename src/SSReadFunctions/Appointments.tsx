import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { contractSS } from '../contracts';

interface Appointment {
    patient: string;
    doctor: string;
    dateTime: bigint;
    treatmentDetails: string;
    isActive: boolean;
}

const GetAppointment = () => {
    const [appointmentIndex, setAppointmentIndex] = useState('');
    const [appointmentData, setAppointmentData] = useState<Appointment | null>(null);
    const [fetchStatus, setFetchStatus] = useState('');
    const [shouldFetch, setShouldFetch] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(true);

    const formatDateTime = (timestamp: bigint) => {
        try {
            if (timestamp === BigInt(0)) {
                throw new Error('Invalid timestamp');
            }
            const date = new Date(Number(timestamp) * 1000);
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date');
            }
            return new Intl.DateTimeFormat('default', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZoneName: 'short'
            }).format(date);
        } catch (err) {
            console.error('Date formatting error:', err);
            return 'Invalid date';
        }
    };

    const validateAppointmentIndex = (index: string): boolean => {
        const num = parseInt(index);
        return !isNaN(num) && num >= 0 && Number.isInteger(num);
    };

    const { data, isError, isLoading, error: contractError } = useReadContract({
        ...contractSS,
        functionName: 'appointments',
        args: shouldFetch && validateAppointmentIndex(appointmentIndex) 
            ? [BigInt(appointmentIndex)] 
            : undefined,
        address: contractSS.address as `0x${string}`,
    });

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
        if (!isVisible) {
            setAppointmentData(null);
            setError(null);
            setFetchStatus('');
            setShouldFetch(false);
        }
    };

    const handleFetchAppointment = () => {
        setError(null);
        setAppointmentData(null);

        if (!appointmentIndex.trim()) {
            setError('Please enter an appointment index');
            return;
        }

        if (!validateAppointmentIndex(appointmentIndex)) {
            setError('Please enter a valid non-negative whole number');
            return;
        }

        const indexNum = parseInt(appointmentIndex);
        if (indexNum > 1000000) {
            setError('Appointment index seems unusually high. Please verify the number.');
            return;
        }

        setFetchStatus('Fetching appointment...');
        setShouldFetch(true);
        setIsVisible(true);
    };

    // useEffect(() => {
    //     if (shouldFetch && !isLoading) {
    //         if (isError || contractError) {
    //             setError('An error occurred while fetching the appointment');
    //             setFetchStatus('');
    //         } else if (data) {
    //             // Log the fetched data to understand its structure
    //             console.log('Fetched appointment data:', data);
    
    //             // Assuming we receive an array-like structure based on your description
    //             // Check if data has expected properties before setting state
    //             if (Array.isArray(data) && data.length >= 5) {
    //                 const appointmentData: Appointment = {
    //                     patient: data[0] as string,
    //                     doctor: data[1] as string,
    //                     dateTime: BigInt(data[2] as any),
    //                     treatmentDetails: data[3] as string,
    //                     isActive: data[4] as boolean,
    //                 };
    //                 setAppointmentData(appointmentData);
    //                 setFetchStatus('Appointment fetched successfully');
    //             } else {
    //                 setError('Fetched data format is unexpected');
    //                 setFetchStatus('');
    //             }
    //         } else {
    //             setError('No data found for the given index');
    //         }
    //         setShouldFetch(false);
    //     }
    // }, [data, isError, isLoading, contractError, shouldFetch]);
    
    useEffect(() => {
        if (shouldFetch && !isLoading) {
            if (isError || contractError) {
                setError('An error occurred while fetching the appointment');
                setFetchStatus('');
            } else if (data) {
                console.log('Fetched appointment data:', data);
    
                // Check if the fetched data is an empty or unexpected format
                if (Array.isArray(data) && data.length >= 5) {
                    const appointmentData: Appointment = {
                        patient: data[0] as string,
                        doctor: data[1] as string,
                        dateTime: BigInt(data[2] as any),
                        treatmentDetails: data[3] as string,
                        isActive: data[4] as boolean,
                    };
    
                    // Check if the data indicates a non-existent appointment
                    if (
                        appointmentData.patient === '0x0000000000000000000000000000000000000000' &&
                        appointmentData.doctor === '0x0000000000000000000000000000000000000000' &&
                        appointmentData.dateTime === BigInt(0)
                    ) {
                        setError('This does not exist in our records yet, maybe in the future');
                        setFetchStatus('');
                    } else {
                        setAppointmentData(appointmentData);
                        setFetchStatus('Appointment fetched successfully');
                    }
                } else {
                    setError('Fetched data format is unexpected');
                    setFetchStatus('');
                }
            } else {
                setError('This does not exist in our records yet, maybe in the future');
            }
            setShouldFetch(false);
        }
    }, [data, isError, isLoading, contractError, shouldFetch]);
    

    const formatAddress = (address: string): string => {
        try {
            if (!address || address.length !== 42 || !address.startsWith('0x')) {
                throw new Error('Invalid Ethereum address');
            }
            return `${address.slice(0, 6)}...${address.slice(-4)}`;
        } catch (err) {
            console.error('Error formatting address:', err);
            return 'Invalid address';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full lg:w-11/12 xl:w-full mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Get Appointment by Number
                </h2>
                <button
                    onClick={toggleVisibility}
                    className="px-3 py-1 text-sm rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                    {isVisible ? 'Hide' : 'Show'}
                </button>
            </div>

            {isVisible && (
                <>
                    <div className="mb-4">
                        <label htmlFor="appointmentIndex" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Appointment Index:
                        </label>
                        <div className="flex gap-2">
                            <input
                                id="appointmentIndex"
                                type="number"
                                min="0"
                                value={appointmentIndex}
                                onChange={(e) => {
                                    setAppointmentData(null);
                                    setError(null);
                                    setAppointmentIndex(e.target.value);
                                }}
                                placeholder="Enter appointment index"
                                className="flex-1 px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleFetchAppointment}
                                disabled={isLoading || shouldFetch}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Fetching...' : 'Fetch'}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}

                    {fetchStatus && !error && (
                        <p className="mt-4 text-lg text-center text-gray-600 dark:text-gray-300">
                            {fetchStatus}
                        </p>
                    )}

                    {appointmentData && (
                        <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                                Appointment Details
                            </h3>
                            <ul className="space-y-2 text-lg">
                                <li><strong className="text-blue-600">Patient:</strong> <span className="text-blue-400">{formatAddress(appointmentData.patient)}</span></li>
                                <li><strong className="text-green-600">Doctor:</strong> <span className="text-green-400">{formatAddress(appointmentData.doctor)}</span></li>
                                <li><strong className="text-purple-600">Date & Time:</strong> <span className="text-purple-400">{formatDateTime(appointmentData.dateTime)}</span></li>
                                <li><strong className="text-yellow-600">Treatment:</strong> <span className="text-yellow-400">{appointmentData.treatmentDetails || 'No details available'}</span></li>
                                <li><strong className="text-red-600">Status:</strong> <span className={appointmentData.isActive ? 'text-green-400' : 'text-red-400'}>{appointmentData.isActive ? 'Active' : 'Inactive'}</span></li>
                            </ul>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default GetAppointment;

// import { useState } from 'react';
// import { useWatchContractEvent } from 'wagmi';
// import { contractHRC } from '../contracts';
// import { Log } from 'viem';

// interface DoctorRegisteredLog extends Log {
//     args: {
//         doctor: `0x${string}`;
//     };
// }

// const DoctorRegisteredListener = () => {
//     const [doctors, setDoctors] = useState<`0x${string}`[]>([]);

//     useWatchContractEvent({
//         address: contractHRC.address as `0x${string}`,
//         abi: contractHRC.abi,
//         eventName: 'DoctorRegistered',
//         onLogs(logs) {
//             logs.forEach((log) => {
//                 const typedLog = log as DoctorRegisteredLog;
//                 if (typedLog.args && typedLog.args.doctor) {
//                     setDoctors((prevDoctors) => {
//                         // Avoid duplicate entries
//                         if (!prevDoctors.includes(typedLog.args.doctor)) {
//                             return [...prevDoctors, typedLog.args.doctor];
//                         }
//                         return prevDoctors;
//                     });
//                 }
//             });
//         },
//     });

//     return (
//         <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
//             <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
//                 Registered Doctors
//             </h2>
            
//             {doctors.length > 0 ? (
//                 <ul className="space-y-2">
//                     {doctors.map((doctor, index) => (
//                         <li 
//                             key={`${doctor}-${index}`} 
//                             className="text-gray-800 dark:text-white break-all bg-gray-50 dark:bg-gray-700 p-3 rounded"
//                         >
//                             {doctor}
//                         </li>
//                     ))}
//                 </ul>
//             ) : (
//                 <p className="text-lg text-gray-600 dark:text-gray-300">
//                     No doctors registered yet.
//                 </p>
//             )}
//         </div>
//     );
// };

// export default DoctorRegisteredListener;


import { useEffect, useState } from 'react';
import { useWatchContractEvent } from 'wagmi';
import { contractHRC } from '../contracts';
import { Log } from 'viem';

interface DoctorRegisteredLog extends Log {
    args: {
        doctor: `0x${string}`;
    };
}

const DoctorRegisteredListener = () => {
    const [doctors, setDoctors] = useState<`0x${string}`[]>(() => {
        // Load doctors from local storage on initial render
        const storedDoctors = localStorage.getItem('registeredDoctors');
        return storedDoctors ? JSON.parse(storedDoctors) : [];
    });

    useEffect(() => {
        // Store doctors list in local storage on each update
        localStorage.setItem('registeredDoctors', JSON.stringify(doctors));
    }, [doctors]);

    useWatchContractEvent({
        address: contractHRC.address as `0x${string}`,
        abi: contractHRC.abi,
        eventName: 'DoctorRegistered',
        onLogs(logs) {
            console.log("Received logs:", logs);  // Log received events
            logs.forEach((log) => {
                const typedLog = log as DoctorRegisteredLog;
                if (typedLog.args && typedLog.args.doctor) {
                    setDoctors((prevDoctors) => {
                        console.log("Current doctors list before update:", prevDoctors);  // Log before updating state
                        
                        // Avoid duplicate entries
                        if (!prevDoctors.includes(typedLog.args.doctor)) {
                            const updatedDoctors = [...prevDoctors, typedLog.args.doctor];
                            console.log("Updated doctors list:", updatedDoctors);  // Log after update
                            return updatedDoctors;
                        }
                        return prevDoctors;
                    });
                }
            });
        },
    });

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                Registered Doctors
            </h2>
            
            {doctors.length > 0 ? (
                <ul className="space-y-2">
                    {doctors.map((doctor, index) => (
                        <li 
                            key={`${doctor}-${index}`} 
                            className="text-gray-800 dark:text-white break-all bg-gray-50 dark:bg-gray-700 p-3 rounded"
                        >
                            {doctor}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-lg text-gray-600 dark:text-gray-300">
                    No doctors registered yet.
                </p>
            )}
        </div>
    );
};

export default DoctorRegisteredListener;

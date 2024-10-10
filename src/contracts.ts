import contractAbi from './contractAbi.json'
import sscontractAbi from './sscontractABI.json'

const myContractABI = contractAbi
const ssContractABI = sscontractAbi

const myContractAddress = '0x991eb294f51661bff40B16f7f023C387e98Fc813'
const ssContractAddress = '0xD6377b270c1DB5d42187da8d38cEEf0A68c2f4b6'

export const contractHRC = {
    abi: myContractABI,
    address: myContractAddress
}


export const contractSS = {
    abi: ssContractABI,
    address: ssContractAddress
}

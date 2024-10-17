import { PinataSDK } from "pinata-web3";

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT
const pinataGateway = import.meta.env.VITE_PINATA_GATEWAY

const pinata = new PinataSDK({
  pinataJwt: PINATA_JWT,
  pinataGateway: pinataGateway,
});

export default pinata;
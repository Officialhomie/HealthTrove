import { createClient, createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
 
export const client = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});



import { ENTRYPOINT_ADDRESS_V06 } from "permissionless";
import { paymasterActionsEip7677 } from "permissionless/experimental";
 
const paymasterService = process.env.PAYMASTER_SERVICE_URL!;
 
export const paymasterClient = createClient({
  chain: baseSepolia,
  transport: http(paymasterService),
}).extend(paymasterActionsEip7677(ENTRYPOINT_ADDRESS_V06));
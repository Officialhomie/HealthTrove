import { http, createConfig } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'; 
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected(),
    coinbaseWallet(),
    walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
    // Additional connectors you can use:
    // metaMask(),
    // safe(),
    // ledgerConnect(),
    // trustConnect(),
    // rabbyConnect(),
    // okxWalletConnect(),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

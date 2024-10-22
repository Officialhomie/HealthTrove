import { http, createConfig } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'; 
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [baseSepolia],
  multiInjectedProviderDiscovery: false,

  connectors: [
    injected(),
    coinbaseWallet({
      appName: "Template",
      preference: "all", // set this to `all` to use EOAs as well
      version: "4",
    }),
    walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
    // Additional connectors you can use:
    // metaMask(),
    // safe(),
    // ledgerConnect(),
    // trustConnect(),
    // rabbyConnect(),
    // okxWalletConnect(),
  ],
  ssr: true,
  transports: {
    [baseSepolia.id]: http('https://api.developer.coinbase.com/rpc/v1/base-sepolia/31Qwwnsz7Gsq5g04bWovmUEvVWXdYR__'),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}


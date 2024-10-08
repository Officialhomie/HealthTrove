import React, { useCallback } from 'react';
import { useConnect } from 'wagmi';
import { CoinbaseWalletLogo } from './CoinbaseWalletLogo';
 
const buttonStyles = {
  background: 'transparent',
  border: '1px solid transparent',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: 200,
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'bold',
  fontSize: 18,
  backgroundColor: '#0052FF',
  paddingLeft: 15,
  paddingRight: 30,
  borderRadius: 10,
};
 
export function BlueCreateWalletButton() {
  const { connectors, connect } = useConnect();
 
  const createWallet = useCallback(() => {
    const coinbaseWalletConnector = connectors.find(
      (connector) => connector.id === 'coinbaseWalletSDK'
    );
    if (coinbaseWalletConnector) {
      connect({ connector: coinbaseWalletConnector });
    }
  }, [connectors, connect]);

  return (
    <button style={buttonStyles as React.CSSProperties} onClick={createWallet}>
      <CoinbaseWalletLogo />
      Create Wallet
    </button>
  );
}
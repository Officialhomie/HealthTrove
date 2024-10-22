import { 
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownBasename, 
  WalletDropdownFundLink, 
  WalletDropdownLink, 
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet'; 

import {
  Address,
  Avatar,
  Identity,
  Badge,
  Name,
  EthBalance, 
} from '@coinbase/onchainkit/identity';

// const address = "0xDA6fDF1002bB0E2e5EDC45440C3975dbb54799A8"

export function WalletComponents() {
  return (
    <div className="relative z-10">
      <Wallet>
        <ConnectWallet className="flex items-center space-x-2 sm:space-x-3 bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-300 rounded-full px-2 sm:px-4 py-1 sm:py-2 shadow-lg hover:shadow-xl">
          <Avatar 
          // address={address}
          className="h-6 w-6 sm:h-8 sm:w-8 rounded-full border-2 border-indigo-300" />
          <div className="flex flex-col">
            <Name className="text-white font-semibold text-xs sm:text-sm md:text-base truncate max-w-[100px] sm:max-w-[150px] md:max-w-[200px]" />
            <EthBalance className="text-indigo-200 text-xs hidden sm:block" />
          </div>
        </ConnectWallet>
        <WalletDropdown className="mt-2 bg-white rounded-xl shadow-2xl border border-indigo-100 overflow-hidden w-full sm:w-72 max-w-[95vw]">
          <Identity 
            className="p-3 sm:p-4 hover:bg-indigo-50 transition-colors duration-200" 
            schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
            hasCopyAddressOnClick
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Avatar className="h-12 w-12 sm:h-16 sm:w-16 rounded-full border-2 border-indigo-500 shadow-md" />
              <div className="flex flex-col space-y-0.5 sm:space-y-1">
                <Name className="text-base sm:text-lg font-bold text-indigo-800" />
                <Address className="text-xs sm:text-sm text-indigo-600" />
                <Badge className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full" />
                <EthBalance className="text-xs sm:text-sm font-medium text-gray-600" />
              </div>
            </div>
          </Identity>
          <div className="border-t border-indigo-100">
            <WalletDropdownBasename className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 hover:bg-indigo-50 transition-colors duration-200" />
          </div>
          <div className="border-t border-indigo-100">
            <WalletDropdownFundLink className="block px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-blue-600 hover:bg-blue-50 transition-colors duration-200" />
          </div>
          <div className="border-t border-indigo-100">
            <WalletDropdownLink 
              icon="wallet"
              href="https://keys.coinbase.com"
              className="block px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-purple-600 hover:bg-purple-50 transition-colors duration-200" 
              children="Wallet Link"
              />
          </div>
          <div className="border-t border-indigo-100">
            <WalletDropdownDisconnect className="w-full text-center py-2 sm:py-3 text-xs sm:text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 font-semibold" />
          </div>
        </WalletDropdown>
      </Wallet>
    </div>
  );
}
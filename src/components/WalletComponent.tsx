import { 
    ConnectWallet, 
    Wallet, 
    WalletDropdown, 
    WalletDropdownDisconnect, 
  } from '@coinbase/onchainkit/wallet'; 
  import {
    Address,
    Avatar,
    Name,
    Identity,
  } from '@coinbase/onchainkit/identity';
  // import { color } from '@coinbase/onchainkit/theme';
   
  export function WalletComponents() {

    return (
      <div className="flex justify-end p-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-lg">
        <Wallet>
          <ConnectWallet className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-300 rounded-full px-4 py-2">
            <Avatar className="h-8 w-8 rounded-full border-2 border-white" />
            <Name className="text-white font-semibold text-lg truncate max-w-[400px]" />
          </ConnectWallet>
          <WalletDropdown className="mt-2 bg-white rounded-lg shadow-xl">
            <Identity 
              className="p-4 hover:bg-gray-100 transition-colors duration-200" 
              hasCopyAddressOnClick
            >
              <div className="flex items-center space-x-3">
                <Avatar 
                  className="h-12 w-12 rounded-full border-2 border-indigo-500"
                />
                <div>
                  <Name className="text-lg font-bold text-gray-800" />
                  <Address className="text-sm text-gray-500" />
                </div>
              </div>
            </Identity>
            <WalletDropdownDisconnect className="w-full text-center py-2 text-red-600 hover:bg-red-100 transition-colors duration-200" />
          </WalletDropdown>
        </Wallet>
      </div>
    );
  }
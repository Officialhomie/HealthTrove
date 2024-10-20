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
    <div className="relative z-10">
      <Wallet>
        <ConnectWallet className="flex items-center space-x-3 bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-300 rounded-full px-4 py-2 shadow-lg hover:shadow-xl">
          <Avatar className="h-8 w-8 rounded-full border-2 border-indigo-300" />
          <Name className="text-white font-semibold text-sm md:text-base truncate max-w-[150px] sm:max-w-[200px]" />
        </ConnectWallet>
        <WalletDropdown className="mt-2 bg-white rounded-xl shadow-2xl border border-indigo-100 overflow-hidden">
          <Identity 
            className="p-4 hover:bg-indigo-50 transition-colors duration-200" 
            hasCopyAddressOnClick
          >
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 rounded-full border-2 border-indigo-500 shadow-md" />
              <div>
                <Name className="text-base font-bold text-indigo-800" />
                <Address className="text-sm text-indigo-600" />
              </div>
            </div>
          </Identity>
          <WalletDropdownDisconnect className="w-full text-center py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 font-semibold" />
        </WalletDropdown>
      </Wallet>
    </div>
  );
}

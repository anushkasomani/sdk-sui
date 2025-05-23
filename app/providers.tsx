'use client';

import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={{ testnet: { url: getFullnodeUrl('testnet') } }}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
} 
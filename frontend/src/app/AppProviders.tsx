import { useMemo } from "react";
import type { PropsWithChildren } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { AuthProvider } from "@/features/auth/AuthContext";
import theme from "@/shared/theme";

export function AppProviders({ children }: PropsWithChildren) {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 30_000,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
    [],
  );

  const environmentId = import.meta.env.VITE_DYNAMIC_ENV_ID ?? "";

  return (
    <ChakraProvider value={theme}>
      <DynamicContextProvider
        settings={{
          environmentId,
          walletConnectors: [EthereumWalletConnectors],
        }}
      >
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
          {import.meta.env.DEV ? <ReactQueryDevtools initialIsOpen={false} /> : null}
        </QueryClientProvider>
      </DynamicContextProvider>
    </ChakraProvider>
  );
}

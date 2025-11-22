import { Badge, Button, Flex, Heading, HStack, Spacer, Text } from "@chakra-ui/react";

import { useAuth } from "@/features/auth/useAuth";
import { shortenAddress } from "@/shared/lib/ids";

export function Header() {
  const { address, phase, logout, isLoading } = useAuth();
  const isReady = phase === "ready" && Boolean(address);

  return (
    <Flex
      as="header"
      py={4}
      px={{ base: 4, md: 6 }}
      borderBottom="1px solid"
      borderColor="gray.100"
      align="center"
      bg="white"
      position="sticky"
      top={0}
      zIndex={1}
    >
      <Heading size="md" letterSpacing="tight">
        Web3 Message Signer
      </Heading>
      <Spacer />
      <HStack gap={3}>
        {isReady ? (
          <Badge colorPalette="green" px={3} py={1} rounded="full" fontWeight="semibold">
            <Text fontSize="sm">Wallet {shortenAddress(address!)}</Text>
          </Badge>
        ) : (
          <Badge colorPalette="gray" px={3} py={1} rounded="full">
            <Text fontSize="sm">Not connected</Text>
          </Badge>
        )}
        {isReady ? (
          <Button variant="outline" size="sm" onClick={logout} loading={isLoading}>
            Logout
          </Button>
        ) : null}
      </HStack>
    </Flex>
  );
}

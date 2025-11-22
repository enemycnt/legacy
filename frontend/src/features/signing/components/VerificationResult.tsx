import { Alert, Badge, Box, Code, HStack, Stack, Text } from "@chakra-ui/react";

import { shortenAddress } from "@/shared/lib/ids";
import type { VerifySignatureResponse } from "../types";

interface VerificationResultProps {
  result: VerifySignatureResponse | null;
  signature?: string;
}

export function VerificationResult({ result, signature }: VerificationResultProps) {
  if (!result) return null;

  return (
    <Box borderWidth="1px" borderColor="gray.100" rounded="lg" p={4} bg="gray.50">
      <Alert.Root
        status={result.isValid ? "success" : "error"}
        rounded="md"
        mb={3}
        variant="surface"
      >
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Description>
          {result.isValid ? "Signature is valid" : "Signature is invalid"}{" "}
          {result.signer ? `for ${shortenAddress(result.signer)}` : ""}
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>
      <Stack gap={2}>
        <HStack gap={2}>
          <Text fontWeight="medium">Message:</Text>
          <Text color="gray.700">{result.originalMessage}</Text>
        </HStack>
        {signature ? (
          <HStack gap={2}>
            <Text fontWeight="medium">Signature:</Text>
            <Code whiteSpace="pre-wrap" wordBreak="break-all">
              {signature}
            </Code>
          </HStack>
        ) : null}
        {result.signer ? (
          <HStack gap={2}>
            <Text fontWeight="medium">Signer:</Text>
            <Badge colorPalette="purple" px={2} py={1}>
              {shortenAddress(result.signer)}
            </Badge>
          </HStack>
        ) : null}
      </Stack>
    </Box>
  );
}

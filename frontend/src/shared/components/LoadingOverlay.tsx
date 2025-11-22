import { Flex, Spinner } from "@chakra-ui/react";

export function LoadingOverlay() {
  return (
    <Flex
      position="absolute"
      inset={0}
      bg="whiteAlpha.700"
      justify="center"
      align="center"
      zIndex={1}
      rounded="xl"
    >
      <Spinner size="lg" color="brand.500" borderWidth="3px" />
    </Flex>
  );
}

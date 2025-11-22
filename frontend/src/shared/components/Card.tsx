import { Box } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";

export function Card(props: BoxProps) {
  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="gray.100"
      shadow="lg"
      rounded="xl"
      p={{ base: 5, md: 6 }}
      position="relative"
      {...props}
    />
  );
}

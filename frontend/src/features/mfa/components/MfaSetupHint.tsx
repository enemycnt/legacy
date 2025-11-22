import { Box, Text } from "@chakra-ui/react";

export function MfaSetupHint() {
  return (
    <Box bg="gray.50" border="1px dashed" borderColor="gray.200" rounded="lg" p={4}>
      <Text fontWeight="medium">MFA setup</Text>
      <Text color="gray.600" fontSize="sm">
        After enabling MFA in Dynamic, this step will prompt for your code. It is a placeholder in
        this demo to keep the flow structure intact.
      </Text>
    </Box>
  );
}

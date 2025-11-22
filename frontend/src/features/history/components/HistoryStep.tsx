import { Badge, Button, HStack, Icon, Stack, Text } from "@chakra-ui/react";
import { FiCheckCircle, FiClock, FiTrash2, FiXCircle } from "react-icons/fi";

import { Card } from "@/shared/components/Card";
import { formatDateTime } from "@/shared/lib/date";
import { shortenAddress } from "@/shared/lib/ids";
import type { SignedMessageEntry } from "../types";

interface HistoryStepProps {
  entries: SignedMessageEntry[];
  onClear: () => void;
}

export function HistoryStep({ entries, onClear }: HistoryStepProps) {
  const hasEntries = entries.length > 0;

  return (
    <Card>
      <HStack justify="space-between" mb={4}>
        <HStack gap={2}>
          <Icon as={FiClock} color="gray.500" />
          <Text fontWeight="semibold">Signing history</Text>
        </HStack>
        <Button
          size="sm"
          variant="ghost"
          onClick={onClear}
          disabled={!hasEntries}
          gap={2}
        >
          <Icon as={FiTrash2} />
          Clear history
        </Button>
      </HStack>

      {hasEntries ? (
        <Stack gap={3}>
          {entries.map((entry) => (
            <Card key={entry.id} bg="gray.50" borderColor="gray.100" shadow="none" p={4}>
              <HStack justify="space-between" align="flex-start" gap={4} mb={2}>
                <Badge colorPalette={entry.isValid ? "green" : "red"} px={2} py={1}>
                  {entry.isValid ? "Valid" : "Invalid"}
                </Badge>
                <Text color="gray.500" fontSize="sm">
                  {formatDateTime(entry.createdAt)}
                </Text>
              </HStack>
              <Text fontWeight="medium" mb={1}>
                {entry.message.length > 160 ? `${entry.message.slice(0, 157)}…` : entry.message}
              </Text>
              <HStack gap={3} color="gray.600" fontSize="sm">
                <Icon as={entry.isValid ? FiCheckCircle : FiXCircle} color={entry.isValid ? "green.500" : "red.500"} />
                <Text>Signer: {shortenAddress(entry.signer)}</Text>
              </HStack>
            </Card>
          ))}
        </Stack>
      ) : (
        <Card bg="gray.50" borderColor="gray.100" shadow="none">
          <Text color="gray.600">No signed messages yet. Sign something to see it here.</Text>
        </Card>
      )}
    </Card>
  );
}

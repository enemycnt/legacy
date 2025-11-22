import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  FieldErrorText,
  FieldLabel,
  FieldRoot,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Card } from "@/shared/components/Card";
import { ErrorAlert } from "@/shared/components/ErrorAlert";
import { LoadingOverlay } from "@/shared/components/LoadingOverlay";
import type { AddHistoryEntry } from "@/features/history/hooks/useSignatureHistory";
import { useSignAndVerify } from "../hooks/useSignAndVerify";
import type { VerifySignatureResponse } from "../types";
import { VerificationResult } from "./VerificationResult";

const schema = z.object({
  message: z.string().min(1, "Enter a message to sign."),
});

type SignFormValues = z.infer<typeof schema>;

interface SignStepProps {
  onDone?: () => void;
  addHistoryEntry: AddHistoryEntry;
}

export function SignStep({ onDone, addHistoryEntry }: SignStepProps) {
  const [lastResult, setLastResult] = useState<VerifySignatureResponse | null>(null);
  const [lastSignature, setLastSignature] = useState<string | undefined>();

  const { signAndVerify, mutation } = useSignAndVerify({
    addHistoryEntry,
    onVerified: (result, signature) => {
      setLastResult(result);
      setLastSignature(signature);
      onDone?.();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { message: "" },
  });

  const submit = async (values: SignFormValues) => {
    await signAndVerify(values.message);
    reset({ message: values.message });
  };

  const mutationError = mutation.error instanceof Error ? mutation.error.message : null;

  return (
    <Card position="relative">
      {mutation.isPending ? <LoadingOverlay /> : null}
      <Stack gap={5}>
        <Stack gap={1}>
          <Text fontSize="sm" fontWeight="semibold" color="brand.600" textTransform="uppercase">
            Step 2
          </Text>
          <Text fontSize="xl" fontWeight="bold">
            Sign and verify a message
          </Text>
          <Text color="gray.600">We will sign with your embedded wallet, then verify server-side.</Text>
        </Stack>

        <ErrorAlert message={mutationError} />

        <form onSubmit={handleSubmit(submit)}>
          <FieldRoot invalid={Boolean(errors.message)} mb={4}>
            <FieldLabel>Message</FieldLabel>
            <Textarea
              rows={4}
              placeholder="I own this wallet..."
              {...register("message")}
              resize="vertical"
            />
            <FieldErrorText>{errors.message?.message}</FieldErrorText>
          </FieldRoot>
          <Button type="submit" loading={mutation.isPending} w="full">
            Sign &amp; verify
          </Button>
        </form>

        <VerificationResult result={lastResult} signature={lastSignature} />
      </Stack>
    </Card>
  );
}

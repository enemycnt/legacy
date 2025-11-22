import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  FieldErrorText,
  FieldLabel,
  FieldRoot,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Card } from "@/shared/components/Card";
import { ErrorAlert } from "@/shared/components/ErrorAlert";
import { LoadingOverlay } from "@/shared/components/LoadingOverlay";
import { useAuth } from "../useAuth";
import { MfaForm } from "./MfaForm";
import { OtpForm } from "./OtpForm";

const emailSchema = z.object({
  email: z.string().email("Enter a valid email."),
});

type EmailFormValues = z.infer<typeof emailSchema>;

export function LoginStep() {
  const { phase, loginWithEmail, verifyOtp, completeMfa, isLoading, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmitEmail = (values: EmailFormValues) => loginWithEmail(values.email);

  return (
    <Card position="relative">
      {isLoading ? <LoadingOverlay /> : null}
      <Stack gap={5}>
        <Stack gap={1}>
          <Heading size="md">Log in to Dynamic</Heading>
          <Text color="gray.600">Use email + OTP to spin up an embedded wallet.</Text>
        </Stack>

        <ErrorAlert message={error} />

        {phase === "otp" ? (
          <OtpForm onSubmit={verifyOtp} isLoading={isLoading} />
        ) : phase === "mfa" ? (
          <MfaForm onSubmit={completeMfa} isLoading={isLoading} />
        ) : (
          <form onSubmit={handleSubmit(onSubmitEmail)}>
            <FieldRoot invalid={Boolean(errors.email)} mb={4}>
              <FieldLabel>Email</FieldLabel>
              <Input
                placeholder="you@example.com"
                type="email"
                autoComplete="email"
                {...register("email")}
              />
              <FieldErrorText>{errors.email?.message}</FieldErrorText>
            </FieldRoot>
            <Button type="submit" loading={isLoading} w="full">
              Send OTP
            </Button>
          </form>
        )}
      </Stack>
    </Card>
  );
}

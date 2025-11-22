import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FieldErrorText, FieldLabel, FieldRoot, HStack, Input } from "@chakra-ui/react";

const schema = z.object({
  code: z.string().min(4, "Enter the code we emailed you."),
});

type OtpFormValues = z.infer<typeof schema>;

interface OtpFormProps {
  onSubmit: (code: string) => Promise<void>;
  onBack?: () => void;
  isLoading: boolean;
}

export function OtpForm({ onSubmit, onBack, isLoading }: OtpFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormValues>({ resolver: zodResolver(schema) });

  const submit = (values: OtpFormValues) => onSubmit(values.code);

  return (
    <form onSubmit={handleSubmit(submit)}>
      <FieldRoot invalid={Boolean(errors.code)} mb={4}>
        <FieldLabel>OTP code</FieldLabel>
        <Input
          placeholder="123456"
          maxLength={8}
          autoComplete="one-time-code"
          {...register("code")}
        />
        <FieldErrorText>{errors.code?.message}</FieldErrorText>
      </FieldRoot>
      <HStack justify="flex-end" gap={2}>
        {onBack ? (
          <Button variant="ghost" onClick={onBack} size="sm">
            Back
          </Button>
        ) : null}
        <Button type="submit" loading={isLoading} w="full">
          Verify code
        </Button>
      </HStack>
    </form>
  );
}

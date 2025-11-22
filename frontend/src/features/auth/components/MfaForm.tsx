import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FieldErrorText, FieldLabel, FieldRoot, HStack, Input } from "@chakra-ui/react";

const schema = z.object({
  code: z.string().min(6, "Enter your MFA code."),
});

type MfaFormValues = z.infer<typeof schema>;

interface MfaFormProps {
  onSubmit: (code: string) => Promise<void>;
  isLoading: boolean;
}

export function MfaForm({ onSubmit, isLoading }: MfaFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MfaFormValues>({ resolver: zodResolver(schema) });

  const submit = (values: MfaFormValues) => onSubmit(values.code);

  return (
    <form onSubmit={handleSubmit(submit)}>
      <FieldRoot invalid={Boolean(errors.code)} mb={4}>
        <FieldLabel>MFA code</FieldLabel>
        <Input placeholder="000 000" maxLength={8} {...register("code")} />
        <FieldErrorText>{errors.code?.message}</FieldErrorText>
      </FieldRoot>
      <HStack justify="flex-end" gap={2}>
        <Button type="submit" loading={isLoading} w="full">
          Verify MFA
        </Button>
      </HStack>
    </form>
  );
}

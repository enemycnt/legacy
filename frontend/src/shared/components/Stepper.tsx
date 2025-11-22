import { Box, Steps } from "@chakra-ui/react";

import type { WizardStep } from "@/app/types";

type StepKey = WizardStep;

const steps: { key: StepKey; label: string; description: string }[] = [
  { key: "login", label: "Login", description: "Authenticate" },
  { key: "sign", label: "Sign", description: "Sign & verify" },
  { key: "history", label: "History", description: "View history" },
];

interface StepperProps {
  current: WizardStep;
  isAuthReady: boolean;
  onStepChange?: (step: WizardStep) => void;
}

export function Stepper({ current, isAuthReady, onStepChange }: StepperProps) {
  const activeIndex = Math.max(
    steps.findIndex((step) => step.key === current),
    0
  );

  return (
    <Steps.Root
      step={activeIndex}
      onStepChange={({ step }) => {
        const next = steps[step]?.key;
        if (!next) return;
        if (!isAuthReady && next !== "login") return;
        onStepChange?.(next);
      }}
      count={steps.length}
      colorPalette="brand"
    >
      <Steps.List>
        {steps.map((step, index) => {
          const clickable = isAuthReady || step.key === "login";
          return (
            <Steps.Item key={step.key} index={index}>
              <Steps.Trigger
                disabled={!clickable}
                cursor={clickable ? "pointer" : "default"}
                px={2}
                py={1}
                gap={3}
              >
                <Steps.Indicator />
                <Box textAlign="left">
                  <Steps.Title fontWeight="semibold">{step.label}</Steps.Title>
                </Box>
              </Steps.Trigger>
              <Steps.Separator />
            </Steps.Item>
          );
        })}
      </Steps.List>
    </Steps.Root>
  );
}

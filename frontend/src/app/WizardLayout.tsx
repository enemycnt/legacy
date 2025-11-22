import { useState } from "react";
import { Container, Stack } from "@chakra-ui/react";

import { HistoryStep } from "@/features/history/components/HistoryStep";
import { useSignatureHistory } from "@/features/history/hooks/useSignatureHistory";
import { LoginStep } from "@/features/auth/components/LoginStep";
import { SignStep } from "@/features/signing/components/SignStep";
import { useAuth } from "@/features/auth/useAuth";
import { Card } from "@/shared/components/Card";
import { Header } from "@/shared/components/Header";
import { Stepper } from "@/shared/components/Stepper";
import type { WizardStep } from "./types";

export function WizardLayout() {
  const { phase, address } = useAuth();
  const history = useSignatureHistory();

  const [currentStep, setCurrentStep] = useState<WizardStep>("login");

  const isAuthReady = phase === "ready" && Boolean(address);
  const activeStep: WizardStep = (() => {
    if (!isAuthReady) return "login";
    if (currentStep === "login") return "sign";
    return currentStep;
  })();

  const handleStepChange = (next: WizardStep) => {
    if (!isAuthReady && next !== "login") return;
    setCurrentStep(next);
  };

  const handleSigned = () => setCurrentStep("history");

  const renderContent = () => {
    if (!isAuthReady) {
      return <LoginStep />;
    }

    if (activeStep === "history") {
      return <HistoryStep entries={history.history} onClear={history.clearHistory} />;
    }

    return <SignStep addHistoryEntry={history.addEntry} onDone={handleSigned} />;
  };

  return (
    <>
      <Header />
      <Container maxW="xl" py={10}>
        <Stack gap={6}>
          <Card bg="white" shadow="md">
            <Stepper current={activeStep} isAuthReady={isAuthReady} onStepChange={handleStepChange} />
          </Card>
          {renderContent()}
        </Stack>
      </Container>
    </>
  );
}

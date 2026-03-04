import { useBillStore } from "./store/billStore";
import { StepNav } from "./components/StepNav";
import { BillStep } from "./components/steps/BillStep";
import { PeopleStep } from "./components/steps/PeopleStep";
import { SplitStep } from "./components/steps/SplitStep";
import { SummaryStep } from "./components/steps/SummaryStep";
import { Toast } from "./components/ui";
import { useToast } from "./hooks/useToast";
import { calculate, buildWhatsAppLink } from "./utils/calculation";
import { Receipt } from "lucide-react";

export default function App() {
  const { toast, show: showToast } = useToast();
  const {
    step,
    setStep,
    reset,
    title,
    tax,
    serviceCharge,
    items,
    participants,
    splits,
    setSummary,
  } = useBillStore();

  function nextStep() {
    setStep(step + 1);
  }
  function prevStep() {
    setStep(step - 1);
  }

  function handleCalculate() {
    const { totals, grandTotal } = calculate(
      items,
      participants,
      splits,
      tax,
      serviceCharge,
    );
    const link = buildWhatsAppLink(
      title,
      totals,
      grandTotal,
      tax,
      serviceCharge,
      items,
      participants,
      splits,
    );
    setSummary(totals, link);
    setStep(3);
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: 500,
          height: 500,
          background: "rgba(200,240,78,0.05)",
          borderRadius: "50%",
          filter: "blur(140px)",
          pointerEvents: "none",
          transform: "translate(30%, -30%)",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: 400,
          height: 400,
          background: "rgba(240,78,122,0.05)",
          borderRadius: "50%",
          filter: "blur(120px)",
          pointerEvents: "none",
          transform: "translate(-30%, 30%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 680,
          margin: "0 auto",
          padding: "0 20px 80px",
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "32px 0 28px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                background: "var(--color-lime)",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Receipt size={18} color="#000" />
            </div>
            <span
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: 20,
                letterSpacing: "-0.3px",
              }}
            >
              Split<span style={{ color: "var(--color-lime)" }}>It</span>
            </span>
          </div>
          <span
            style={{
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--color-muted)",
              border: "1px solid var(--color-border)",
              borderRadius: 99,
              padding: "5px 12px",
              fontFamily: "DM Mono, monospace",
            }}
          >
            Beta
          </span>
        </header>

        <StepNav />

        {step === 0 && <BillStep onNext={nextStep} showToast={showToast} />}
        {step === 1 && (
          <PeopleStep
            onNext={nextStep}
            onBack={prevStep}
            showToast={showToast}
          />
        )}
        {step === 2 && (
          <SplitStep
            onNext={handleCalculate}
            onBack={prevStep}
            showToast={showToast}
          />
        )}
        {step === 3 && <SummaryStep onBack={prevStep} onReset={reset} />}
      </div>

      <Toast toast={toast} />
    </div>
  );
}

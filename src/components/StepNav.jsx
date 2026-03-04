import { useBillStore } from "../store/billStore";

const STEPS = ["Bill", "People", "Split", "Summary"];

export function StepNav() {
  const step = useBillStore((s) => s.step);
  const setStep = useBillStore((s) => s.setStep);

  return (
    <div style={{ marginBottom: 32 }}>
      <div
        style={{
          display: "flex",
          border: "1px solid var(--color-border)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {STEPS.map((label, i) => {
          const isDone = i < step;
          const isActive = i === step;
          return (
            <button
              key={i}
              onClick={() => isDone && setStep(i)}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "12px 8px",
                fontSize: 11,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontFamily: "DM Mono, monospace",
                border: "none",
                borderLeft: i > 0 ? "1px solid var(--color-border)" : "none",
                background: isActive ? "var(--color-lime)" : "transparent",
                color: isActive
                  ? "#000"
                  : isDone
                    ? "var(--color-lime)"
                    : "var(--color-muted)",
                cursor: isDone ? "pointer" : "default",
                fontWeight: isActive ? 500 : 400,
                transition: "all 0.2s",
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  flexShrink: 0,
                  border: `1px solid currentColor`,
                  background: isActive ? "#000" : "transparent",
                  color: isActive ? "var(--color-lime)" : "currentColor",
                }}
              >
                {isDone ? "✓" : i + 1}
              </span>
              <span
                style={{ display: window.innerWidth < 480 ? "none" : "inline" }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 12,
          height: 2,
          background: "var(--color-border)",
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            background: "var(--color-lime)",
            borderRadius: 99,
            width: `${((step + 1) / STEPS.length) * 100}%`,
            transition: "width 0.5s ease",
          }}
        />
      </div>
    </div>
  );
}

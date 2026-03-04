import { useBillStore } from "../../store/billStore";
import { SecondaryButton, SectionLabel, avatarBg } from "../ui";
import { formatIDR } from "../../utils/calculation";
import { RotateCcw, MessageCircle } from "lucide-react";

export function SummaryStep({ onBack, onReset }) {
  const {
    title,
    summary,
    whatsappLink,
    billId,
    participants,
    tax,
    serviceCharge,
  } = useBillStore();
  const grandTotal = summary
    ? Object.values(summary).reduce((a, b) => a + b, 0)
    : 0;
  const multiplier = 1 + (tax || 0) / 100 + (serviceCharge || 0) / 100;
  const subtotal = multiplier !== 1 ? grandTotal / multiplier : grandTotal;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionLabel>Step 4 — Summary</SectionLabel>

      {/* Bill header */}
      <div className="card">
        <h2
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 800,
            fontSize: 28,
            lineHeight: 1.1,
            margin: "0 0 4px",
          }}
        >
          {title || "Untitled Bill"}
        </h2>
        <p
          style={{
            fontSize: 11,
            color: "var(--color-muted)",
            fontFamily: "DM Mono, monospace",
            margin: 0,
          }}
        >
          {billId ? `Bill ID: ${billId}` : "Local calculation"}
          {(tax > 0 || serviceCharge > 0) && (
            <span style={{ marginLeft: 12, color: "rgba(200,240,78,0.7)" }}>
              {tax > 0 && `Tax ${tax}%`}
              {tax > 0 && serviceCharge > 0 && " + "}
              {serviceCharge > 0 && `Service ${serviceCharge}%`}
            </span>
          )}
        </p>
      </div>

      {/* Totals */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          ["Subtotal", subtotal, "var(--color-text-main)"],
          ["Grand Total", grandTotal, "var(--color-lime)"],
        ].map(([label, val, color]) => (
          <div key={label} className="card">
            <span className="section-label">{label}</span>
            <p
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: 22,
                color,
                margin: 0,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontFamily: "DM Mono, monospace",
                  color: "var(--color-muted)",
                  marginRight: 3,
                }}
              >
                Rp
              </span>
              {formatIDR(Math.round(val))}
            </p>
          </div>
        ))}
      </div>

      {/* Per-person */}
      <div>
        <SectionLabel>Per Person</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {participants.map((name, i) => {
            const amount = summary?.[name] || 0;
            const { bg, fg } = avatarBg(i);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 12,
                  padding: "14px 20px",
                  animation: `fadeUp 0.3s ease ${i * 0.06}s both`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: bg,
                      color: fg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "Syne, sans-serif",
                      fontWeight: 700,
                      fontSize: 15,
                    }}
                  >
                    {name[0].toUpperCase()}
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "Syne, sans-serif",
                        fontWeight: 600,
                        fontSize: 16,
                        margin: 0,
                      }}
                    >
                      {name}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: "var(--color-muted)",
                        margin: "2px 0 0",
                      }}
                    >
                      Their share
                    </p>
                  </div>
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "Syne, sans-serif",
                      fontWeight: 800,
                      fontSize: 22,
                      color: "var(--color-lime)",
                      margin: 0,
                      textAlign: "right",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontFamily: "DM Mono, monospace",
                        color: "var(--color-muted)",
                        marginRight: 3,
                      }}
                    >
                      Rp
                    </span>
                    {formatIDR(Math.round(amount))}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* WhatsApp */}
      <a
        href={whatsappLink || "#"}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          padding: "16px",
          background: "#25D366",
          color: "#fff",
          fontFamily: "DM Mono, monospace",
          fontWeight: 500,
          fontSize: 15,
          borderRadius: 12,
          textDecoration: "none",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "#20bd5a";
          e.target.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "#25D366";
          e.target.style.transform = "translateY(0)";
        }}
      >
        <MessageCircle size={20} /> Share via WhatsApp
      </a>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <SecondaryButton onClick={onBack}>← Edit</SecondaryButton>
        <button
          onClick={onReset}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 20px",
            fontSize: 13,
            fontFamily: "DM Mono, monospace",
            color: "var(--color-muted)",
            border: "1px solid var(--color-border)",
            borderRadius: 12,
            background: "transparent",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          <RotateCcw size={14} /> New Bill
        </button>
      </div>
    </div>
  );
}

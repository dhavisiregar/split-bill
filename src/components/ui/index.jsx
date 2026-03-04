import { X } from "lucide-react";

export function Input({ label, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {label && (
        <label className="section-label" style={{ marginBottom: 0 }}>
          {label}
        </label>
      )}
      <input className="input-base" {...props} />
    </div>
  );
}

export function PrimaryButton({
  children,
  className = "",
  style = {},
  ...props
}) {
  return (
    <button className={`btn-primary ${className}`} style={style} {...props}>
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className = "",
  style = {},
  ...props
}) {
  return (
    <button className={`btn-secondary ${className}`} style={style} {...props}>
      {children}
    </button>
  );
}

export function GhostButton({ children, className = "", ...props }) {
  return (
    <button className={`btn-ghost ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Card({ children, className = "", style = {} }) {
  return (
    <div className={`card ${className}`} style={style}>
      {children}
    </div>
  );
}

export function SectionLabel({ children }) {
  return <span className="section-label">{children}</span>;
}

const AVATAR_BG = [
  "#c8f04e",
  "#f04e7a",
  "#4ec8f0",
  "#f0c14e",
  "#c084fc",
  "#fb923c",
];
const AVATAR_FG = ["#000", "#fff", "#000", "#000", "#000", "#000"];

export function Avatar({ name, idx = 0, size = "md" }) {
  const sizes = { sm: 24, md: 36, lg: 44 };
  const fontSize = { sm: 10, md: 13, lg: 15 };
  const s = sizes[size];
  return (
    <div
      style={{
        width: s,
        height: s,
        borderRadius: "50%",
        background: AVATAR_BG[idx % AVATAR_BG.length],
        color: AVATAR_FG[idx % AVATAR_FG.length],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Syne, sans-serif",
        fontWeight: 700,
        fontSize: fontSize[size],
        flexShrink: 0,
      }}
    >
      {name[0].toUpperCase()}
    </div>
  );
}

export function avatarBg(idx) {
  const BG = ["#c8f04e", "#f04e7a", "#4ec8f0", "#f0c14e", "#c084fc", "#fb923c"];
  const FG = ["#000", "#fff", "#000", "#000", "#000", "#000"];
  return { bg: BG[idx % BG.length], fg: FG[idx % FG.length] };
}

export function Toast({ toast }) {
  if (!toast) return null;
  const isError = toast.type === "error";
  return (
    <div
      key={toast.id}
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "12px 20px",
        borderRadius: 12,
        fontFamily: "DM Mono, monospace",
        fontSize: 13,
        fontWeight: 500,
        background: isError ? "#f04e7a" : "#c8f04e",
        color: isError ? "#fff" : "#000",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        animation: "slideIn 0.3s ease both",
      }}
    >
      <span>{isError ? "⚠" : "✓"}</span>
      {toast.message}
    </div>
  );
}

export function Divider({ label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        margin: "20px 0",
      }}
    >
      <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
      <span
        style={{
          fontSize: 10,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--color-muted)",
          fontFamily: "DM Mono, monospace",
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
    </div>
  );
}

export function EmptyState({ icon, text }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
      <p
        style={{
          color: "var(--color-muted)",
          fontSize: 12,
          fontFamily: "DM Mono, monospace",
        }}
      >
        {text}
      </p>
    </div>
  );
}

export function ParticipantChip({ name, idx, onRemove }) {
  const { bg, fg } = avatarBg(idx);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: 99,
        padding: "4px 12px 4px 4px",
        animation: "fadeUp 0.3s ease both",
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: bg,
          color: fg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          fontWeight: 700,
        }}
      >
        {name[0].toUpperCase()}
      </div>
      <span
        style={{
          fontSize: 13,
          fontFamily: "DM Mono, monospace",
          color: "var(--color-text-main)",
        }}
      >
        {name}
      </span>
      <button
        onClick={onRemove}
        style={{
          background: "none",
          border: "none",
          color: "var(--color-muted)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          padding: 0,
          marginLeft: 2,
        }}
      >
        <X size={12} />
      </button>
    </div>
  );
}

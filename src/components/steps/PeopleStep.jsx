import { useState } from "react";
import { UserPlus } from "lucide-react";
import { useBillStore } from "../../store/billStore";
import {
  Input,
  PrimaryButton,
  SecondaryButton,
  Card,
  SectionLabel,
  EmptyState,
  ParticipantChip,
} from "../ui";

export function PeopleStep({ onNext, onBack, showToast }) {
  const { participants, addParticipant, removeParticipant } = useBillStore();
  const [name, setName] = useState("");

  function handleAdd() {
    const n = name.trim();
    if (!n) return;
    if (participants.includes(n)) {
      showToast("Already added!", "error");
      return;
    }
    addParticipant(n);
    setName("");
  }

  function handleNext() {
    if (participants.length === 0) {
      showToast("Add at least one person", "error");
      return;
    }
    onNext();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionLabel>Step 2 — Who's Splitting?</SectionLabel>

      <Card style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <Input
              label="Name"
              placeholder="e.g. Budi, Rani, Dimas..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
          </div>
          <PrimaryButton onClick={handleAdd}>
            <UserPlus size={14} /> Add
          </PrimaryButton>
        </div>

        {participants.length === 0 ? (
          <EmptyState
            icon="👥"
            text="No participants yet. Add some people above."
          />
        ) : (
          <div>
            <span className="section-label">
              {participants.length} participant
              {participants.length !== 1 ? "s" : ""}
            </span>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 8,
              }}
            >
              {participants.map((p, i) => (
                <ParticipantChip
                  key={i}
                  name={p}
                  idx={i}
                  onRemove={() => removeParticipant(i)}
                />
              ))}
            </div>
          </div>
        )}
      </Card>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <SecondaryButton onClick={onBack}>← Back</SecondaryButton>
        <PrimaryButton onClick={handleNext}>Next: Split Items →</PrimaryButton>
      </div>
    </div>
  );
}

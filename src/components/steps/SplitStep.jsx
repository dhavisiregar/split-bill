import { useBillStore } from "../../store/billStore";
import {
  PrimaryButton,
  SecondaryButton,
  GhostButton,
  SectionLabel,
} from "../ui";
import { formatIDR, avatarColor } from "../../utils/calculation";

function SplitItemCard({
  item,
  itemIdx,
  participants,
  splits,
  onToggle,
  onAll,
  onClear,
}) {
  const assigned = splits[itemIdx] || [];

  return (
    <div className="bg-surface border border-border rounded-xl p-4 space-y-3 animate-fade-up">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <p className="font-display font-semibold text-base">{item.name}</p>
          <p className="text-[11px] text-muted mt-0.5">
            ×{item.qty} unit{item.qty > 1 ? "s" : ""}
          </p>
        </div>
        <span className="text-lime font-mono text-sm shrink-0 ml-4">
          Rp {formatIDR(item.price * item.qty)}
        </span>
      </div>

      {/* Person toggle buttons */}
      <div>
        <p className="text-[10px] tracking-widest uppercase text-muted mb-2 font-mono">
          Who had this?
          {assigned.length > 0 && (
            <span className="ml-2 text-lime">
              {assigned.length === 1 ? "1 person" : `${assigned.length} people`}{" "}
              · Rp{" "}
              {formatIDR(Math.round((item.price * item.qty) / assigned.length))}{" "}
              each
            </span>
          )}
        </p>
        <div className="flex flex-wrap gap-2">
          {participants.map((name, pIdx) => {
            const selected = assigned.includes(pIdx);
            return (
              <button
                key={pIdx}
                onClick={() => onToggle(itemIdx, pIdx)}
                className={`flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full text-xs font-mono transition-all duration-150
                  ${
                    selected
                      ? "bg-lime text-black font-medium"
                      : "bg-card border border-border text-text-main hover:border-lime/50"
                  }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold
                    ${selected ? "bg-black text-lime" : avatarColor(pIdx)}`}
                >
                  {name[0].toUpperCase()}
                </span>
                {name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-2 pt-1 border-t border-border/60">
        <GhostButton onClick={() => onAll(itemIdx)}>Select all</GhostButton>
        <GhostButton onClick={() => onClear(itemIdx)}>Clear</GhostButton>
      </div>
    </div>
  );
}

export function SplitStep({ onNext, onBack, showToast }) {
  const { items, participants, splits, toggleSplit, setSplitAll, clearSplit } =
    useBillStore();

  function handleNext() {
    for (let i = 0; i < items.length; i++) {
      if (!splits[i] || splits[i].length === 0) {
        showToast(`Assign "${items[i].name}" to someone`, "error");
        return;
      }
    }
    onNext();
  }

  return (
    <div className="animate-fade-up space-y-4">
      <SectionLabel>Step 3 — Who Gets What?</SectionLabel>

      {items.map((item, i) => (
        <SplitItemCard
          key={i}
          item={item}
          itemIdx={i}
          participants={participants}
          splits={splits}
          onToggle={toggleSplit}
          onAll={setSplitAll}
          onClear={clearSplit}
        />
      ))}

      <div className="flex justify-between pt-2">
        <SecondaryButton onClick={onBack}>← Back</SecondaryButton>
        <PrimaryButton onClick={handleNext}>Calculate → Summary</PrimaryButton>
      </div>
    </div>
  );
}

import { useRef, useState } from "react";
import {
  ImagePlus,
  Trash2,
  Plus,
  X,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useBillStore } from "../../store/billStore";
import {
  Input,
  PrimaryButton,
  Card,
  SectionLabel,
  Divider,
  EmptyState,
  GhostButton,
} from "../ui";
import { formatIDR } from "../../utils/calculation";
import { extractItemsFromReceipt } from "../../api/receiptAI";

const S = {
  space: { display: "flex", flexDirection: "column", gap: 20 },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  row35: { display: "grid", gridTemplateColumns: "3fr 2fr 1fr", gap: 8 },
  itemRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: 12,
    padding: "10px 16px",
  },
};

export function BillStep({ onNext, showToast }) {
  const {
    title,
    tax,
    serviceCharge,
    imagePreview,
    items,
    setBillMeta,
    setImage,
    clearImage,
    addItem,
    removeItem,
    applyScannedReceipt,
  } = useBillStore();

  const fileRef = useRef();
  const [dragOver, setDragOver] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState(null);
  const [scanSuccess, setScanSuccess] = useState(null);
  const [imageFile, setImageFileLocal] = useState(null);
  const [newItem, setNewItem] = useState({ name: "", price: "", qty: "1" });

  // These are controlled so AI can populate them
  const [localTitle, setLocalTitle] = useState(title || "");
  const [localTax, setLocalTax] = useState(tax ? String(tax) : "");
  const [localService, setLocalService] = useState(
    serviceCharge ? String(serviceCharge) : "",
  );

  function handleFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    setScanError(null);
    setScanSuccess(null);
    setImageFileLocal(file);
    const reader = new FileReader();
    reader.onload = (e) => setImage(file, e.target.result);
    reader.readAsDataURL(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }

  async function handleScanReceipt() {
    if (!imageFile) return;
    setScanning(true);
    setScanError(null);
    setScanSuccess(null);

    try {
      const result = await extractItemsFromReceipt(imageFile);

      if (result.items.length === 0) {
        setScanError(
          "No items found. Try a clearer photo or add items manually.",
        );
        return;
      }

      // Apply everything from scan
      applyScannedReceipt({
        title: result.title || localTitle,
        tax: result.tax,
        serviceCharge: result.serviceCharge,
        items: result.items,
      });

      // Sync local controlled inputs
      if (result.title) setLocalTitle(result.title);
      if (result.tax) setLocalTax(String(result.tax));
      if (result.serviceCharge) setLocalService(String(result.serviceCharge));

      const details = [];
      if (result.title) details.push(`"${result.title}"`);
      details.push(`${result.items.length} items`);
      if (result.tax) details.push(`${result.tax}% tax`);
      if (result.serviceCharge)
        details.push(`${result.serviceCharge}% service`);

      setScanSuccess(`Extracted: ${details.join(", ")}`);
      showToast(`${result.items.length} items extracted!`);
    } catch (err) {
      setScanError(err.message || "Failed to scan receipt");
    } finally {
      setScanning(false);
    }
  }

  function handleRemoveImage() {
    clearImage();
    setImageFileLocal(null);
    setScanError(null);
    setScanSuccess(null);
  }

  function handleAddItem() {
    const name = newItem.name.trim();
    const price = parseFloat(newItem.price);
    const qty = parseInt(newItem.qty) || 1;
    if (!name) {
      showToast("Enter item name", "error");
      return;
    }
    if (!price || price <= 0) {
      showToast("Enter a valid price", "error");
      return;
    }
    addItem({ name, price, qty });
    setNewItem({ name: "", price: "", qty: "1" });
  }

  function handleNext() {
    if (!localTitle.trim()) {
      showToast("Enter a bill title", "error");
      return;
    }
    if (items.length === 0) {
      showToast("Add at least one item", "error");
      return;
    }
    setBillMeta(
      localTitle.trim(),
      parseFloat(localTax) || 0,
      parseFloat(localService) || 0,
    );
    onNext();
  }

  return (
    <div style={S.space}>
      <SectionLabel>Step 1 — Bill Details</SectionLabel>

      {/* Bill meta — controlled, AI can populate */}
      <Card style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Input
          label="Bill Title"
          placeholder="e.g. Dinner at Warung Pak Budi"
          value={localTitle}
          onChange={(e) => setLocalTitle(e.target.value)}
        />
        <div style={S.row2}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label className="section-label" style={{ marginBottom: 0 }}>
              Tax (%)
            </label>
            <div style={{ position: "relative" }}>
              <input
                className="input-base"
                type="number"
                placeholder="0"
                min="0"
                max="100"
                step="0.1"
                value={localTax}
                onChange={(e) => setLocalTax(e.target.value)}
              />
              {localTax && Number(localTax) > 0 && (
                <span
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 10,
                    color: "var(--color-lime)",
                    fontFamily: "DM Mono, monospace",
                  }}
                >
                  auto
                </span>
              )}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label className="section-label" style={{ marginBottom: 0 }}>
              Service Charge (%)
            </label>
            <div style={{ position: "relative" }}>
              <input
                className="input-base"
                type="number"
                placeholder="0"
                min="0"
                max="100"
                step="0.1"
                value={localService}
                onChange={(e) => setLocalService(e.target.value)}
              />
              {localService && Number(localService) > 0 && (
                <span
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 10,
                    color: "var(--color-lime)",
                    fontFamily: "DM Mono, monospace",
                  }}
                >
                  auto
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Image upload */}
      <div>
        <SectionLabel>Receipt Photo</SectionLabel>
        {imagePreview ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                position: "relative",
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid var(--color-border)",
              }}
            >
              <img
                src={imagePreview}
                alt="Receipt"
                style={{
                  width: "100%",
                  maxHeight: 280,
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <button
                onClick={handleRemoveImage}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  background: "rgba(0,0,0,0.7)",
                  border: "none",
                  color: "#fff",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  backdropFilter: "blur(4px)",
                }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Scan button */}
            <button
              onClick={handleScanReceipt}
              disabled={scanning}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "14px 20px",
                background: scanning
                  ? "rgba(200,240,78,0.08)"
                  : "rgba(200,240,78,0.12)",
                border: `1px solid ${scanning ? "rgba(200,240,78,0.2)" : "rgba(200,240,78,0.35)"}`,
                borderRadius: 12,
                color: scanning ? "rgba(200,240,78,0.5)" : "var(--color-lime)",
                fontFamily: "DM Mono, monospace",
                fontSize: 13,
                fontWeight: 500,
                cursor: scanning ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
            >
              {scanning ? (
                <>
                  <Loader2
                    size={16}
                    style={{ animation: "spin 1s linear infinite" }}
                  />{" "}
                  Scanning receipt...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Extract Items, Tax & Service with AI
                </>
              )}
            </button>

            {/* Success banner */}
            {scanSuccess && (
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  padding: "11px 16px",
                  background: "rgba(200,240,78,0.08)",
                  border: "1px solid rgba(200,240,78,0.25)",
                  borderRadius: 10,
                }}
              >
                <CheckCircle2
                  size={15}
                  style={{ color: "var(--color-lime)", flexShrink: 0 }}
                />
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--color-lime)",
                    fontFamily: "DM Mono, monospace",
                    margin: 0,
                  }}
                >
                  {scanSuccess}
                </p>
              </div>
            )}

            {/* Error banner */}
            {scanError && (
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  padding: "11px 16px",
                  background: "rgba(240,78,122,0.08)",
                  border: "1px solid rgba(240,78,122,0.25)",
                  borderRadius: 10,
                }}
              >
                <AlertCircle
                  size={15}
                  style={{ color: "#f04e7a", flexShrink: 0, marginTop: 1 }}
                />
                <p
                  style={{
                    fontSize: 12,
                    color: "#f04e7a",
                    fontFamily: "DM Mono, monospace",
                    margin: 0,
                  }}
                >
                  {scanError}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragOver ? "var(--color-lime)" : "var(--color-border)"}`,
              borderRadius: 16,
              padding: "48px 32px",
              textAlign: "center",
              cursor: "pointer",
              background: dragOver
                ? "rgba(200,240,78,0.04)"
                : "var(--color-card)",
              transition: "all 0.2s",
            }}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
            <ImagePlus
              size={36}
              style={{ margin: "0 auto 12px", color: "var(--color-muted)" }}
            />
            <p
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 600,
                fontSize: 16,
                marginBottom: 6,
              }}
            >
              Drop your receipt here
            </p>
            <p style={{ color: "var(--color-muted)", fontSize: 12, margin: 0 }}>
              AI will extract items, tax & service charge automatically
            </p>
          </div>
        )}
      </div>

      <Divider label="items" />

      {/* Items list */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <SectionLabel>
            Items {items.length > 0 && `(${items.length})`}
          </SectionLabel>
          {items.length > 0 && (
            <span
              style={{
                fontSize: 11,
                color: "var(--color-lime)",
                fontFamily: "DM Mono, monospace",
              }}
            >
              Subtotal: Rp{" "}
              {formatIDR(items.reduce((s, i) => s + i.price * i.qty, 0))}
            </span>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginBottom: 12,
          }}
        >
          {items.length === 0 ? (
            <EmptyState
              icon="🧾"
              text="No items yet. Upload a receipt or add manually below."
            />
          ) : (
            items.map((item, i) => (
              <div
                key={i}
                style={{
                  ...S.itemRow,
                  animation: `fadeUp 0.25s ease ${i * 0.04}s both`,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--color-text-main)",
                      margin: 0,
                    }}
                  >
                    {item.name}
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--color-muted)",
                      margin: "2px 0 0",
                    }}
                  >
                    ×{item.qty} @ Rp {formatIDR(item.price)}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontFamily: "DM Mono, monospace",
                    color: "var(--color-lime)",
                    flexShrink: 0,
                  }}
                >
                  Rp {formatIDR(item.price * item.qty)}
                </span>
                <button
                  onClick={() => removeItem(i)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--color-muted)",
                    cursor: "pointer",
                    display: "flex",
                    padding: 4,
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Manual add */}
        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 12,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <span className="section-label" style={{ marginBottom: 0 }}>
            Add Item Manually
          </span>
          <div style={S.row35}>
            <Input
              placeholder="Item name"
              value={newItem.name}
              onChange={(e) =>
                setNewItem((p) => ({ ...p, name: e.target.value }))
              }
              onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
            />
            <Input
              placeholder="Price"
              type="number"
              value={newItem.price}
              onChange={(e) =>
                setNewItem((p) => ({ ...p, price: e.target.value }))
              }
              onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
            />
            <Input
              placeholder="Qty"
              type="number"
              min="1"
              value={newItem.qty}
              onChange={(e) =>
                setNewItem((p) => ({ ...p, qty: e.target.value }))
              }
              onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
            />
          </div>
          <PrimaryButton onClick={handleAddItem}>
            <Plus size={14} /> Add Item
          </PrimaryButton>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <PrimaryButton onClick={handleNext}>Next: Add People →</PrimaryButton>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

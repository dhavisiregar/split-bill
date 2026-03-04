/**
 * Calculate per-person amounts from split assignments.
 * Mirrors the backend CalculationService logic.
 *
 * @param {import('../types').Item[]} items
 * @param {string[]} participants
 * @param {Record<number, number[]>} splits
 * @param {number} taxPct
 * @param {number} servicePct
 * @returns {{ totals: Record<string, number>, subtotal: number, grandTotal: number }}
 */
export function calculate(items, participants, splits, taxPct, servicePct) {
  const totals = Object.fromEntries(participants.map((n) => [n, 0]));

  items.forEach((item, iIdx) => {
    const assigned = splits[iIdx] || [];
    if (assigned.length === 0) return;
    const itemTotal = item.price * item.qty;
    const share = itemTotal / assigned.length;
    assigned.forEach((pIdx) => {
      totals[participants[pIdx]] += share;
    });
  });

  const subtotal = Object.values(totals).reduce((a, b) => a + b, 0);
  const multiplier = 1 + taxPct / 100 + servicePct / 100;
  const adjusted = Object.fromEntries(
    Object.entries(totals).map(([k, v]) => [k, v * multiplier]),
  );
  const grandTotal = subtotal * multiplier;

  return { totals: adjusted, subtotal, grandTotal };
}

/**
 * Build a WhatsApp share message
 * @param {string} title
 * @param {Record<string, number>} totals
 * @param {number} grandTotal
 * @param {number} taxPct
 * @param {number} servicePct
 */
export function buildWhatsAppLink(
  title,
  totals,
  grandTotal,
  taxPct,
  servicePct,
) {
  let msg = `💸 *Split Bill: ${title}*\n\n`;
  Object.entries(totals).forEach(([name, amount]) => {
    msg += `• ${name}: Rp ${formatIDR(Math.round(amount))}\n`;
  });
  msg += `\n_Total: Rp ${formatIDR(Math.round(grandTotal))}_`;
  if (taxPct > 0) msg += ` (incl. ${taxPct}% tax)`;
  if (servicePct > 0) msg += ` + ${servicePct}% service`;
  msg += `\n\n_Generated with SplitIt_ 🧾`;
  return `https://wa.me/?text=${encodeURIComponent(msg)}`;
}

/** Format a number as Indonesian Rupiah style (no symbol) */
export function formatIDR(n) {
  return Math.round(n).toLocaleString("id-ID");
}

/** Get avatar color class by index */
const AVATAR_COLORS = [
  "bg-lime text-black",
  "bg-coral text-white",
  "bg-sky text-black",
  "bg-amber text-black",
  "bg-purple-400 text-black",
  "bg-orange-400 text-black",
];
export function avatarColor(idx) {
  return AVATAR_COLORS[idx % AVATAR_COLORS.length];
}

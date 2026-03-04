/**
 * Calculate per-person amounts from split assignments.
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
 * Build a detailed WhatsApp share message showing each person's items.
 *
 * @param {string} title
 * @param {Record<string, number>} totals        - final per-person amounts (post tax/service)
 * @param {number} grandTotal
 * @param {number} taxPct
 * @param {number} servicePct
 * @param {import('../types').Item[]} items
 * @param {string[]} participants
 * @param {Record<number, number[]>} splits
 */
export function buildWhatsAppLink(
  title,
  totals,
  grandTotal,
  taxPct,
  servicePct,
  items = [],
  participants = [],
  splits = {},
) {
  const multiplier = 1 + taxPct / 100 + servicePct / 100;
  let msg = `🧾 *${title || "Split Bill"}*\n`;
  msg += `━━━━━━━━━━━━━━━━━━\n\n`;

  participants.forEach((name) => {
    const personItems = [];

    items.forEach((item, iIdx) => {
      const assigned = splits[iIdx] || [];
      const pIdx = participants.indexOf(name);
      if (!assigned.includes(pIdx)) return;

      const share = (item.price * item.qty) / assigned.length;
      const sharedNote = assigned.length > 1 ? ` ÷${assigned.length}` : "";
      personItems.push(
        `  • ${item.name}${sharedNote}: Rp ${formatIDR(Math.round(share))}`,
      );
    });

    const total = totals[name] || 0;
    msg += `👤 *${name}*\n`;
    personItems.forEach((line) => {
      msg += `${line}\n`;
    });

    if (taxPct > 0 || servicePct > 0) {
      const subtotalPerson = total / multiplier;
      msg += `  + Tax & Service: Rp ${formatIDR(Math.round(total - subtotalPerson))}\n`;
    }

    msg += `  ➜ *Total: Rp ${formatIDR(Math.round(total))}*\n\n`;
  });

  msg += `━━━━━━━━━━━━━━━━━━\n`;
  msg += `💰 *Grand Total: Rp ${formatIDR(Math.round(grandTotal))}*\n`;

  const extras = [];
  if (taxPct > 0) extras.push(`Tax ${taxPct}%`);
  if (servicePct > 0) extras.push(`Service ${servicePct}%`);
  if (extras.length > 0) msg += `_(incl. ${extras.join(" + ")})_\n`;

  msg += `\n_Shared via SplitIt 🧾_`;

  return `https://wa.me/?text=${encodeURIComponent(msg)}`;
}

/** Format number as Indonesian Rupiah (no symbol) */
export function formatIDR(n) {
  return Math.round(n).toLocaleString("id-ID");
}

/** Avatar colors by index */
const AVATAR_BG = [
  "#c8f04e",
  "#f04e7a",
  "#4ec8f0",
  "#f0c14e",
  "#c084fc",
  "#fb923c",
];
const AVATAR_FG = ["#000", "#fff", "#000", "#000", "#000", "#000"];
export function avatarBg(idx) {
  return {
    bg: AVATAR_BG[idx % AVATAR_BG.length],
    fg: AVATAR_FG[idx % AVATAR_FG.length],
  };
}

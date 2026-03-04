import { create } from "zustand";

const INITIAL_STATE = {
  step: 0,
  billId: null,
  title: "",
  tax: 0,
  serviceCharge: 0,
  imageFile: null,
  imagePreview: null,
  items: [],
  participants: [],
  splits: {},
  summary: null,
  whatsappLink: null,
};

export const useBillStore = create((set) => ({
  ...INITIAL_STATE,

  setStep: (step) => set({ step }),

  setBillMeta: (title, tax, serviceCharge) =>
    set({ title, tax, serviceCharge }),
  setBillId: (billId) => set({ billId }),

  setImage: (file, preview) => set({ imageFile: file, imagePreview: preview }),
  clearImage: () => set({ imageFile: null, imagePreview: null }),

  addItem: (item) => set((s) => ({ items: [...s.items, item] })),
  removeItem: (idx) =>
    set((s) => {
      const items = s.items.filter((_, i) => i !== idx);
      const splits = {};
      Object.entries(s.splits).forEach(([k, v]) => {
        const ki = Number(k);
        if (ki === idx) return;
        splits[ki > idx ? ki - 1 : ki] = v;
      });
      return { items, splits };
    }),
  clearItems: () => set({ items: [], splits: {} }),

  // Called after AI scan — sets title, tax, serviceCharge, and replaces items
  applyScannedReceipt: ({ title, tax, serviceCharge, items }) =>
    set({ title, tax, serviceCharge, items, splits: {} }),

  addParticipant: (name) =>
    set((s) => ({ participants: [...s.participants, name] })),
  removeParticipant: (idx) =>
    set((s) => {
      const participants = s.participants.filter((_, i) => i !== idx);
      const splits = {};
      Object.entries(s.splits).forEach(([k, arr]) => {
        splits[k] = arr
          .filter((pi) => pi !== idx)
          .map((pi) => (pi > idx ? pi - 1 : pi));
      });
      return { participants, splits };
    }),

  toggleSplit: (itemIdx, personIdx) =>
    set((s) => {
      const current = s.splits[itemIdx] || [];
      const exists = current.includes(personIdx);
      return {
        splits: {
          ...s.splits,
          [itemIdx]: exists
            ? current.filter((i) => i !== personIdx)
            : [...current, personIdx],
        },
      };
    }),
  setSplitAll: (itemIdx) =>
    set((s) => ({
      splits: { ...s.splits, [itemIdx]: s.participants.map((_, i) => i) },
    })),
  clearSplit: (itemIdx) =>
    set((s) => ({ splits: { ...s.splits, [itemIdx]: [] } })),

  setSummary: (summary, whatsappLink) => set({ summary, whatsappLink }),

  reset: () => set(INITIAL_STATE),
}));

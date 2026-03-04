/**
 * Uses Groq's Llama 4 Scout vision model to extract items, tax, and service charge from a receipt.
 *
 * Requires VITE_GROQ_API_KEY in your .env file.
 * Get your key at: https://console.groq.com/keys
 */
export async function extractItemsFromReceipt(imageFile) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) throw new Error("Missing VITE_GROQ_API_KEY in .env");

  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(imageFile);
  });

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: base64 },
              },
              {
                type: "text",
                text: `Analyze this receipt carefully and extract the following.

Return ONLY a single valid JSON object, no markdown, no explanation, no extra text.

The JSON must have exactly these fields:
- "items": array of purchased line items, each with "name" (string), "price" (number, unit price), "qty" (integer). Ignore tax, service charge, discount, subtotal, total rows.
- "tax": number, the tax percentage (e.g. if PB1/VAT/Tax is shown as 21,507 out of subtotal 201,000 that is ~10.7, so return 10.7). If not found return 0.
- "serviceCharge": number, the service charge percentage (e.g. if SC is 14,070 out of subtotal 201,000 that is ~7, so return 7). If not found return 0.
- "title": string, the restaurant or merchant name from the receipt. If not found return "".

Important: calculate tax and serviceCharge as PERCENTAGES (not raw amounts) by dividing their amount by the subtotal and multiplying by 100. Round to 1 decimal place.

Example output:
{
  "items": [{"name":"Tori Aka Ramen","price":83000,"qty":1},{"name":"Ice Ocha","price":14000,"qty":1}],
  "tax": 10.7,
  "serviceCharge": 7.0,
  "title": "Ikkudo Ichi"
}`,
              },
            ],
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq API error ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "";
  const clean = text.replace(/```json|```/gi, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(clean);
  } catch {
    throw new Error("Could not parse receipt data from AI response");
  }

  const items = (parsed.items || [])
    .filter((i) => i.name && Number(i.price) > 0)
    .map((i) => ({
      name: String(i.name).trim(),
      price: Number(i.price),
      qty: Math.max(1, parseInt(i.qty) || 1),
    }));

  return {
    items,
    tax: Math.round((Number(parsed.tax) || 0) * 10) / 10,
    serviceCharge: Math.round((Number(parsed.serviceCharge) || 0) * 10) / 10,
    title: String(parsed.title || "").trim(),
  };
}

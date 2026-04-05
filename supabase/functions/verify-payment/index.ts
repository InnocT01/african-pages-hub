import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageBase64, expectedAmount, currency, orderId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (!imageBase64) {
      return new Response(JSON.stringify({ valid: false, reason: "No image provided", confidence: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a payment verification AI for KitabuShop, an African book marketplace. Analyze payment confirmation screenshots to determine if they are genuine bank transfer confirmations.

Check for:
1. **Transaction details visible**: Amount, date, sender/receiver names, reference number
2. **Bank branding**: Does it look like a real bank app/receipt (Rawbank, Equity Bank, M-Pesa, Airtel Money, Orange Money, etc.)?
3. **Amount match**: Does the visible amount approximately match the expected amount of ${expectedAmount || "unknown"} ${currency || "USD"}?
4. **Fraud indicators**: Screenshots of screenshots, edited text, mismatched fonts, suspicious artifacts, generic templates
5. **Completeness**: Is the full transaction confirmation visible?

Respond in JSON:
{
  "valid": <boolean - true if likely genuine>,
  "confidence": <number 0-100>,
  "amount_detected": "<amount found in image or null>",
  "bank_detected": "<bank/service name or null>",
  "date_detected": "<transaction date or null>",
  "reference_detected": "<reference number or null>",
  "issues": ["<list of concerns>"],
  "verdict": "<✅ Vérifié | ⚠️ À vérifier manuellement | ❌ Rejeté>",
  "summary": "<brief assessment in French>"
}`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Verify this payment proof for order ${orderId || "unknown"}. Expected: ${expectedAmount || "?"} ${currency || "USD"}.`,
              },
              {
                type: "image_url",
                image_url: { url: imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}` },
              },
            ],
          },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ valid: false, reason: "Rate limit exceeded", confidence: 0 }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ valid: false, reason: "AI credits exhausted", confidence: 0 }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI verification failed");
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || "";

    let parsed;
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      parsed = null;
    }

    if (parsed && typeof parsed.valid === "boolean") {
      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ valid: false, reason: rawContent, confidence: 0, issues: ["Could not parse AI response"] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("verify-payment error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

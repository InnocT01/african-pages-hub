import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { text, title } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (!text || text.length < 50) {
      return new Response(JSON.stringify({ result: "Text too short to analyze.", score: 0, details: [] }), {
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
            content: `You are an advanced plagiarism detection system for an African publishing platform. Perform a thorough analysis of the submitted text using multiple detection methods:

1. **Stylometric Analysis**: Analyze writing style consistency (vocabulary richness, sentence complexity, transitions). Flag sudden style changes.
2. **Pattern Detection**: Check for well-known phrases, clichés, or passages commonly found in published works.
3. **Structural Analysis**: Evaluate if the text structure follows original thought patterns or appears to be assembled from multiple sources.
4. **Language Quality**: Check for inconsistencies in language register, tone, or regional variations that suggest copy-paste from different sources.
5. **Content Originality**: Assess the uniqueness of ideas and arguments.

Respond in JSON format with this exact structure:
{
  "score": <number 0-100 where 0=likely plagiarized, 100=likely original>,
  "verdict": "<✅ Original | ⚠️ Suspicious | ❌ Likely Plagiarized>",
  "summary": "<2-3 sentence overall assessment>",
  "details": [
    {"check": "<check name>", "status": "<pass|warning|fail>", "note": "<brief explanation>"}
  ],
  "suggestions": ["<improvement suggestion 1>", "<improvement suggestion 2>"]
}

Respond in the same language as the analyzed text (French or English).`,
          },
          {
            role: "user",
            content: `Title: "${title || "Untitled"}"\n\nText to analyze (${text.length} characters):\n${text.slice(0, 3000)}`,
          },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ result: "Rate limit exceeded. Please try again later.", score: -1, details: [] }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ result: "AI credits exhausted. Please try again later.", score: -1, details: [] }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || "";
    
    // Try to parse as JSON
    let parsed;
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      parsed = null;
    }

    if (parsed && typeof parsed.score === "number") {
      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback
    return new Response(JSON.stringify({ result: rawContent, score: 50, details: [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("check-plagiarism error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

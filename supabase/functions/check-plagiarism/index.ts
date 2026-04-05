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
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content: `You are the most advanced plagiarism detection system for KitabuShop, an African publishing platform. Perform an exhaustive multi-layered analysis using these methods:

1. **Stylometric Fingerprinting**: Analyze vocabulary richness (TTR, hapax legomena), sentence length distribution, punctuation patterns, paragraph structure. Flag any sudden stylistic shifts that suggest different authors.

2. **N-gram & Phrase Detection**: Check for common phrases, clichés, or verbatim passages frequently found in published African and world literature. Identify any sequences of 5+ words that appear formulaic or copied.

3. **Structural Coherence Analysis**: Evaluate logical flow, argument progression, narrative consistency. Assembled texts from multiple sources often show topic jumps, inconsistent arguments, or disjointed paragraphs.

4. **Linguistic Consistency Check**: Analyze language register, regional expressions, spelling conventions (British vs American English, formal vs informal French), idiomatic usage. Mixed registers suggest copy-paste from different sources.

5. **Content Originality Assessment**: Evaluate the uniqueness of ideas, metaphors, examples, and arguments. Generic or widely-known content scores lower.

6. **AI-Generated Text Detection**: Check for hallmarks of AI-generated text: unnaturally perfect grammar, repetitive sentence structures, lack of personal voice, generic examples, absence of cultural specificity.

7. **Cross-Reference Check**: Identify any passages that closely resemble well-known works, Wikipedia articles, academic papers, or commonly plagiarized sources in African literature.

Respond ONLY with valid JSON (no markdown, no code blocks):
{
  "score": <number 0-100, where 0=definitely plagiarized, 100=highly original>,
  "verdict": "<one of: ✅ Original | ⚠️ Suspicious | ❌ Likely Plagiarized>",
  "summary": "<2-3 sentence assessment explaining the key findings>",
  "details": [
    {"check": "<check name>", "status": "<pass|warning|fail>", "note": "<specific finding with evidence>", "weight": <importance 1-10>}
  ],
  "suggestions": ["<specific actionable improvement>"],
  "risk_factors": ["<specific concern>"],
  "confidence": <number 0-100 indicating how confident you are in this analysis>
}

Be thorough but fair. African authors often use oral tradition patterns, proverbs, and cultural references that should NOT be flagged as plagiarism.
Respond in the same language as the analyzed text.`,
          },
          {
            role: "user",
            content: `Title: "${title || "Untitled"}"\n\nFull text to analyze (${text.length} characters):\n${text.slice(0, 5000)}`,
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

    return new Response(JSON.stringify({ result: rawContent, score: 50, details: [], confidence: 0 }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("check-plagiarism error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

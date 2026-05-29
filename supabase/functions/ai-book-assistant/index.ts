import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

interface Body {
  task: "description" | "keywords" | "title_ideas";
  title?: string;
  excerpt?: string;
  genre?: string;
  language?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = (await req.json()) as Body;
    if (!body.task) return json({ error: "task is required" }, 400);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) return json({ error: "AI gateway not configured" }, 500);

    const lang = body.language === "en" ? "English" : "French";
    let systemPrompt = "";
    let userPrompt = "";

    if (body.task === "description") {
      systemPrompt = `You write captivating book descriptions for an African literary marketplace in ${lang}. Output 3-4 short paragraphs, vivid and emotional, ending with a hook. Return only the description, no preamble.`;
      userPrompt = `Title: ${body.title}\nGenre: ${body.genre || "Fiction"}\nExcerpt: ${body.excerpt || "(none)"}\n\nWrite the back-cover description.`;
    } else if (body.task === "keywords") {
      systemPrompt = `You are an Amazon KDP SEO expert. Output exactly 7 high-intent search keywords (2-4 words each), comma-separated, no numbering, no explanations. Language: ${lang}.`;
      userPrompt = `Title: ${body.title}\nGenre: ${body.genre || "Fiction"}\nExcerpt: ${body.excerpt || "(none)"}\n\nGive the 7 keywords.`;
    } else if (body.task === "title_ideas") {
      systemPrompt = `Generate 5 magnetic book title ideas in ${lang}. Return as a numbered list, nothing else.`;
      userPrompt = `Genre: ${body.genre || "Fiction"}\nExcerpt: ${body.excerpt || "(none)"}`;
    } else {
      return json({ error: "invalid task" }, 400);
    }

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (resp.status === 429) return json({ error: "Rate limit, try again shortly" }, 429);
    if (resp.status === 402) return json({ error: "AI credits exhausted" }, 402);
    if (!resp.ok) return json({ error: `AI error ${resp.status}` }, 500);

    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content?.trim() ?? "";

    let result: any = { content };
    if (body.task === "keywords") {
      result.keywords = content.split(",").map((k: string) => k.trim()).filter(Boolean).slice(0, 7);
    }
    return json(result);
  } catch (e) {
    console.error("ai-book-assistant error", e);
    return json({ error: String(e) }, 500);
  }
});

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

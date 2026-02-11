import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentTexts, businessModel } = await req.json();

    if (!documentTexts || documentTexts.length === 0) {
      return new Response(
        JSON.stringify({ error: "No document texts provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let combinedText = documentTexts.join("\n\n---DOCUMENT SEPARATOR---\n\n");
    
    // Truncate to ~800K characters (~200K tokens) to stay within context limits
    const MAX_CHARS = 800000;
    if (combinedText.length > MAX_CHARS) {
      console.log(`Truncating input from ${combinedText.length} to ${MAX_CHARS} characters`);
      combinedText = combinedText.substring(0, MAX_CHARS) + "\n\n[... Document truncated due to length. Analysis based on first portion of materials.]";
    }
    const isB2B = businessModel === "B2B";

    const systemPrompt = `You are an expert VC due diligence analyst specializing in GTM strategy and Product-Market Fit analysis. You analyze ONLY the materials provided — do not invent information. Extract the company name, then produce a structured analysis.

Your output MUST be valid JSON matching this exact schema (no markdown, no code fences):

{
  "companyName": "string - the actual company name from the materials",
  "sections": [
    {
      "id": "string",
      "title": "string",
      "category": "Value Proposition" | "Market Size" | "Traction",
      "status": "pass" | "risk" | "unclear",
      "summary": "string - 1-2 sentence evidence-based summary",
      "insights": ["string array - key findings from the materials"],
      "gaps": ["string array - missing info or risks identified"],
      "recommendations": ["string array - actionable GTM recommendations"],
      "assumptions": ["string array - unvalidated assumptions found"],
      "validatedSignals": ["string array - evidence-backed signals"]
    }
  ],
  "customerSegments": [{"name": "string", "percentage": number, "urgency": "high"|"medium"|"low"}],
  "positioning": [{"company": "string", "innovation": number 0-100, "marketFit": number 0-100, "isTarget": boolean}],
  "gtmDecisions": [{"factor": "string", "pushScore": number 0-100, "pullScore": number 0-100}],
  "disruptionScore": number 0-100,
  "acquisitionFunnel": [{"name": "string", "value": number, "percentage": number}]
}

The sections MUST include exactly these 18 items grouped into 3 categories:

**Value Proposition** (6 sections):
1. "customer-pain" - Customer Pain & Urgency
2. "customer-segmentation" - Customer Segmentation & ICP Clarity
3. "differentiation" - Better vs Faster vs Cheaper Differentiation
4. "positioning" - Incremental vs Disruptive Positioning
5. "platform-vs-product" - Platform vs Focused Product Strategy
6. "gtm-motion" - Push vs Pull GTM Motion

**Market Size** (6 sections):
7. "market-tam" - TAM
8. "market-competitor-sales" - Competitors' Sales
9. "market-cost-savings" - Cost Savings
10. "market-macro" - Macro Market
11. "market-trends" - Market Trends
12. "market-niche-platform" - Niche and Platform

**Traction** (6 sections):
13. "traction-paying-customers" - Paying Customers
14. "traction-engagement" - Engagement Metrics
15. "traction-lois" - Letters of Intent (LOIs)
16. "traction-inferior-competition" - Inferior Competition
17. "traction-seed-investors" - Seed Investors
18. "traction-industry-validation" - Industry Validation

Business model is: ${businessModel}
${isB2B 
  ? "This is a B2B company. Focus on sales-led GTM motion, enterprise sales cycles, ABM strategies, ACV, account-based approaches. The acquisition funnel should reflect enterprise sales stages (Target Accounts → Outreach/ABM → Discovery Calls → Proposals → Negotiations → Closed Won)."
  : "This is a B2C company. Focus on digitally-led/product-led growth, viral loops, performance marketing, self-serve conversion. The acquisition funnel should reflect consumer stages (Website Visitors → Sign-ups → Activated Users → Trial Users → Paid Conversion → Retained)."
}

CRITICAL RULES:
- Extract ALL insights from the provided materials only
- If information for a section is not found in the materials, mark status as "unclear" and note what's missing in gaps
- The companyName MUST be extracted from the materials, not invented
- customerSegments percentages must sum to 100
- positioning must include the target company (isTarget: true) and at least 2 competitors
- gtmDecisions must have 5 factors with pushScore + pullScore = 100 each
- acquisitionFunnel must have 6 stages with decreasing values
- Return ONLY the JSON object, no other text`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze the following materials and produce the GTM & PMF due diligence report:\n\n${combinedText}` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings → Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI analysis failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    let content = aiResponse.choices?.[0]?.message?.content || "";

    // Strip markdown code fences if present
    content = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

    let report;
    try {
      report = JSON.parse(content);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content.substring(0, 500));
      return new Response(
        JSON.stringify({ error: "Failed to parse AI analysis. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(report), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-documents error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

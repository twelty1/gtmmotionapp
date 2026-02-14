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
    
    // Truncate to ~400K characters to leave room for output tokens
    const MAX_CHARS = 400000;
    if (combinedText.length > MAX_CHARS) {
      console.log(`Truncating input from ${combinedText.length} to ${MAX_CHARS} characters`);
      combinedText = combinedText.substring(0, MAX_CHARS) + "\n\n[... Document truncated due to length. Analysis based on first portion of materials.]";
    }
    const isB2B = businessModel === "B2B";

    const systemPrompt = `You are an elite GTM strategist and Product-Market Fit architect for venture-backed startups. Your job is NOT just to summarize what's in the materials — your job is to BUILD a comprehensive GTM strategy and PMF assessment based on the information provided.

CRITICAL MINDSET:
- You are a strategic advisor, not a passive reviewer. DO NOT say "unclear" or "not specified" — instead, use the available data to RECOMMEND the best approach.
- If specific data (e.g., TAM numbers, LOIs) isn't explicitly stated, INFER from context and RECOMMEND what the company should target, with reasoning.
- Every section must contain ACTIONABLE recommendations — specific channels, tactics, metrics, and timelines.
- Think like a top-tier GTM consultant: what would you actually tell this founder to DO?

Your output MUST be valid JSON matching this exact schema (no markdown, no code fences):

{
  "companyName": "string - the actual company name from the materials",
  "sections": [
    {
      "id": "string",
      "title": "string",
      "category": "Value Proposition" | "Market Size" | "Traction",
      "status": "pass" | "risk" | "unclear",
      "summary": "string - 2-3 sentence strategic assessment with specific recommendations",
      "insights": ["string array - key findings AND strategic implications"],
      "gaps": ["string array - what's missing AND what the company should do about it"],
      "recommendations": ["string array - SPECIFIC, ACTIONABLE steps with channels, tactics, metrics, and timelines. Never generic advice."],
      "assumptions": ["string array - assumptions that need testing, with suggested validation methods"],
      "validatedSignals": ["string array - evidence-backed signals from the materials"]
    }
  ],
  "customerSegments": [{"name": "string", "percentage": number, "urgency": "high"|"medium"|"low"}],
  "positioning": [{"company": "string", "innovation": number 0-100, "marketFit": number 0-100, "isTarget": boolean}],
  "gtmDecisions": [{"factor": "string", "pushScore": number 0-100, "pullScore": number 0-100}],
  "disruptionScore": number 0-100,
  "acquisitionFunnel": [{"name": "string", "value": number, "percentage": number, "tactic": "string - 1 sentence describing the specific tactic/action at this stage", "channels": ["string array - 2-3 specific channels or tools to use at this stage"]}]
}

The sections MUST include exactly these 18 items grouped into 3 categories:

**Value Proposition** (6 sections):
1. "customer-pain" - Customer Pain & Urgency: Identify the core pain, rate its urgency, and recommend how to amplify urgency in sales/marketing messaging.
2. "customer-segmentation" - Customer Segmentation & ICP: Define the ideal customer profile with specifics (company size, industry, role, budget). If not fully clear, RECOMMEND the best ICP based on available signals.
3. "differentiation" - Better vs Faster vs Cheaper: Determine which differentiation axis the company should lead with and recommend messaging frameworks.
4. "positioning" - Incremental vs Disruptive: Assess where the company sits on the disruption spectrum and recommend positioning strategy accordingly.
5. "platform-vs-product" - Platform vs Focused Product: Recommend whether to focus on a single product or build a platform, with reasoning.
6. "gtm-motion" - Push vs Pull GTM Motion: RECOMMEND the optimal GTM motion (sales-led, product-led, community-led, or hybrid) with specific channel recommendations.

**Market Size** (6 sections):
7. "market-tam" - TAM: If TAM isn't stated, ESTIMATE it using bottom-up or top-down methods based on the ICP and pricing signals in the materials. Show your reasoning.
8. "market-competitor-sales" - Competitors' Sales: Identify competitors and recommend competitive positioning tactics.
9. "market-cost-savings" - Cost Savings: Quantify the ROI story for buyers — recommend how to frame cost savings in sales materials.
10. "market-macro" - Macro Market: Identify macro tailwinds/headwinds and recommend how to leverage or mitigate them.
11. "market-trends" - Market Trends: Identify relevant trends and recommend how to ride them in GTM messaging.
12. "market-niche-platform" - Niche and Platform: Recommend the beachhead niche to dominate first before expanding.

**Traction** (6 sections):
13. "traction-paying-customers" - Paying Customers: Assess current traction and recommend next milestones with specific targets.
14. "traction-engagement" - Engagement Metrics: Recommend which metrics to track and what benchmarks to hit.
15. "traction-lois" - Letters of Intent (LOIs): If no LOIs exist, recommend a strategy to secure 3-5 LOIs within 60 days.
16. "traction-inferior-competition" - Inferior Competition: Identify competitive weaknesses to exploit and recommend attack strategies.
17. "traction-seed-investors" - Seed Investors: Assess fundraising position and recommend investor targeting strategy.
18. "traction-industry-validation" - Industry Validation: Recommend specific validation tactics (awards, analyst coverage, partnerships).

Business model is: ${businessModel}
${isB2B 
  ? "This is a B2B company. Focus on sales-led GTM motion, enterprise sales cycles, ABM strategies, ACV, account-based approaches. The acquisition funnel should reflect enterprise sales stages (Target Accounts → Outreach/ABM → Discovery Calls → Proposals → Negotiations → Closed Won). Recommend specific B2B tactics."
  : "This is a B2C company. Focus on digitally-led/product-led growth, viral loops, performance marketing, self-serve conversion. The acquisition funnel should reflect consumer stages (Website Visitors → Sign-ups → Activated Users → Trial Users → Paid Conversion → Retained). Recommend specific B2C growth tactics."
}

CRITICAL RULES:
- NEVER say "not mentioned," "unclear from materials," or "not specified" without ALSO providing a strategic recommendation
- Every recommendation must be SPECIFIC: include channels, tools, timelines, and success metrics
- The companyName MUST be extracted from the materials
- customerSegments percentages must sum to 100
- positioning must include the target company (isTarget: true) and at least 2 competitors
- gtmDecisions must have 5 factors with pushScore + pullScore = 100 each
- acquisitionFunnel must have 6 stages with decreasing values. Each stage MUST include a "tactic" (specific action) and "channels" (2-3 tools/platforms). This is a STRATEGIC GAMEPLAN, not just metrics — describe HOW to move prospects through each stage.
- Use "risk" status when data suggests a problem that needs fixing, NOT when data is simply absent
- Use "pass" when evidence supports the approach OR when your recommended approach is strong
- Use "unclear" ONLY as last resort, and always pair it with a concrete recommendation
- Return ONLY the JSON object, no other text`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        max_tokens: 16000,
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

    // Robust JSON extraction
    function extractJson(raw: string): unknown {
      let cleaned = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
      const jsonStart = cleaned.indexOf("{");
      if (jsonStart === -1) throw new Error("No JSON object found");
      cleaned = cleaned.substring(jsonStart);
      
      // Find matching closing brace
      let depth = 0;
      let jsonEnd = -1;
      for (let i = 0; i < cleaned.length; i++) {
        if (cleaned[i] === "{") depth++;
        else if (cleaned[i] === "}") { depth--; if (depth === 0) { jsonEnd = i; break; } }
      }
      if (jsonEnd === -1) {
        // Truncated response — try to repair by closing open structures
        cleaned = cleaned + ']}]}';
        // Retry finding end
        depth = 0;
        for (let i = 0; i < cleaned.length; i++) {
          if (cleaned[i] === "{") depth++;
          else if (cleaned[i] === "}") { depth--; if (depth === 0) { jsonEnd = i; break; } }
        }
        if (jsonEnd === -1) throw new Error("Cannot repair truncated JSON");
      }
      cleaned = cleaned.substring(0, jsonEnd + 1);

      try {
        return JSON.parse(cleaned);
      } catch {
        // Fix trailing commas and control chars
        cleaned = cleaned
          .replace(/,\s*}/g, "}")
          .replace(/,\s*]/g, "]")
          .replace(/[\x00-\x1F\x7F]/g, " ");
        return JSON.parse(cleaned);
      }
    }

    let report;
    try {
      report = extractJson(content);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content.substring(0, 1000), "...", content.substring(content.length - 500));
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

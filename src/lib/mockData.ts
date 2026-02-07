import type { DiligenceReport, AnalysisSection } from '@/types/diligence';

// Mock data for demonstration - in production this would come from AI analysis
export function generateMockReport(companyName: string): DiligenceReport {
  const sections: AnalysisSection[] = [
    // ── Value Proposition ──────────────────────────────────
    {
      id: 'customer-pain',
      title: 'Customer Pain & Urgency',
      category: 'Value Proposition',
      status: 'pass',
      summary: 'Strong evidence of acute customer pain with high urgency indicators across enterprise segment.',
      insights: [
        'Primary pain point: Manual compliance workflows costing 40+ hours/week per team',
        'Regulatory deadline pressure creating urgency (SOC2/GDPR requirements)',
        'Current solutions require 3-6 month implementation cycles',
        'Customer interviews show "hair on fire" problem characterization',
      ],
      gaps: [
        'No quantified cost-of-inaction data provided',
        'SMB segment pain validation missing',
        'Competitive displacement scenarios not documented',
      ],
      recommendations: [
        'Lead with ROI calculator in sales motion',
        'Position around compliance deadline urgency',
        'Develop case studies with specific time/cost savings',
      ],
      assumptions: [
        'Urgency persists post-initial compliance',
        'Budget allocation for this category exists',
      ],
      validatedSignals: [
        'Customer interview transcripts (n=12)',
        'LOI from 3 enterprise prospects',
        'Industry analyst report on market pain',
      ],
    },
    {
      id: 'customer-segmentation',
      title: 'Customer Segmentation & ICP Clarity',
      category: 'Value Proposition',
      status: 'unclear',
      summary: 'ICP defined but segmentation strategy shows gaps in prioritization logic.',
      insights: [
        'Primary ICP: Mid-market SaaS (100-500 employees, Series B+)',
        'Secondary: Enterprise financial services (compliance-heavy)',
        'Buyer persona: VP Engineering / CISO',
        'Deal size: $50-150K ACV target',
      ],
      gaps: [
        'No clear criteria for segment prioritization',
        'Overlap between segments not addressed',
        'Geographic expansion strategy undefined',
        'Vertical vs horizontal positioning unclear',
      ],
      recommendations: [
        'Focus GTM on mid-market SaaS as beachhead',
        'Develop segment-specific value propositions',
        'Create scoring model for lead qualification',
      ],
      assumptions: [
        'Mid-market has faster sales cycles',
        'Technical buyer can champion internally',
      ],
      validatedSignals: [
        'Win/loss analysis across 8 deals',
        'Pipeline composition data',
      ],
    },
    {
      id: 'differentiation',
      title: 'Better vs Faster vs Cheaper Differentiation',
      category: 'Value Proposition',
      status: 'pass',
      summary: 'Clear "faster" positioning with 10x speed improvement claim backed by technical architecture.',
      insights: [
        'Primary differentiation: 10x faster implementation (days vs months)',
        'Secondary: Better accuracy via ML-based automation',
        'Not competing on price - premium positioning justified',
        'Technical moat through proprietary data model',
      ],
      gaps: [
        'Speed claims need independent verification',
        'No comparison matrix vs top 3 competitors',
        'Feature parity gaps not acknowledged',
      ],
      recommendations: [
        'Lead with speed-to-value in all messaging',
        'Develop proof-of-value pilot program',
        'Create competitive battlecards for sales team',
      ],
      assumptions: [
        'Speed matters more than feature depth',
        'Customers will pay premium for faster time-to-value',
      ],
      validatedSignals: [
        'Pilot customer achieved compliance in 14 days',
        'Technical architecture review confirms approach',
      ],
    },
    {
      id: 'positioning',
      title: 'Incremental vs Disruptive Positioning',
      category: 'Value Proposition',
      status: 'unclear',
      summary: 'Positioning straddles incremental improvement and category creation - needs clarification.',
      insights: [
        'Product offers genuine innovation in automation approach',
        'Market education required for full value realization',
        'Current messaging emphasizes incremental benefits',
        'Long-term vision suggests category creation potential',
      ],
      gaps: [
        'No clear decision on category strategy',
        'Risk of getting stuck in "no mans land"',
        'Messaging inconsistent between pitch and website',
      ],
      recommendations: [
        'Decide: Own existing category or create new one',
        'If disruptive: invest in thought leadership and education',
        'If incremental: emphasize competitive displacement',
      ],
      assumptions: [
        'Market ready for category innovation',
        'Resources available for extended education cycle',
      ],
      validatedSignals: [
        'Analyst briefing feedback suggests novelty',
        'Early customers describe as "different approach"',
      ],
    },
    {
      id: 'platform-vs-product',
      title: 'Platform vs Focused Product Strategy',
      category: 'Value Proposition',
      status: 'risk',
      summary: 'Platform ambitions premature - need to prove focused product success first.',
      insights: [
        'Current roadmap includes platform features (APIs, integrations, marketplace)',
        'Engineering resources split between core and platform',
        'Customers requesting integrations with existing tools',
        'Platform narrative appealing to investors',
      ],
      gaps: [
        'Core product PMF not fully validated',
        'Platform strategy diverting focus from ICP',
        'Integration depth vs breadth trade-offs unclear',
        'Monetization model for platform undefined',
      ],
      recommendations: [
        'Delay platform investments 12-18 months',
        'Focus on 3 critical integrations only',
        'Prove repeatable sales motion before expanding',
      ],
      assumptions: [
        'Platform creates defensibility',
        'Customers want ecosystem play',
      ],
      validatedSignals: [
        'Customer requests for Slack/Jira integrations',
      ],
    },
    {
      id: 'gtm-motion',
      title: 'Push vs Pull GTM Motion',
      category: 'Value Proposition',
      status: 'pass',
      summary: 'Hybrid motion recommended with emphasis on product-led pull augmented by targeted outbound.',
      insights: [
        'Product has viral/shareable elements (compliance badges)',
        'SEO and content showing early organic traction',
        'Outbound required for enterprise segment',
        'Current CAC:LTV ratio healthy at 1:4',
      ],
      gaps: [
        'Channel partner strategy undeveloped',
        'Self-serve conversion rate not tracked',
        'Territory and account ownership unclear',
      ],
      recommendations: [
        'Invest in product-led acquisition (freemium tier)',
        'Build sales team for enterprise outbound only',
        'Develop partner program for mid-market scale',
      ],
      assumptions: [
        'PLG can work in compliance category',
        'Content marketing will scale',
      ],
      validatedSignals: [
        'Organic traffic up 300% QoQ',
        '15% of trials convert without sales touch',
      ],
    },

    // ── Market Size ────────────────────────────────────────
    {
      id: 'market-tam',
      title: 'TAM',
      category: 'Market Size',
      status: 'unclear',
      summary: 'Total addressable market estimated but methodology and bottom-up validation missing.',
      insights: [
        'Enterprise compliance software market estimated at $12B globally',
        'Top-down sizing based on analyst reports and industry extrapolation',
      ],
      gaps: [
        'SAM and SOM calculations not provided',
        'Bottom-up market sizing methodology not documented',
      ],
      recommendations: [
        'Commission independent market sizing study',
        'Validate TAM with bottom-up customer count analysis',
      ],
      assumptions: [
        'TAM growth rate of 12% CAGR assumed',
        'Adjacent market expansion included in projections',
      ],
      validatedSignals: [
        'Gartner report on compliance software market',
      ],
    },
    {
      id: 'market-competitor-sales',
      title: "Competitors' Sales",
      category: 'Market Size',
      status: 'unclear',
      summary: 'Top incumbents generate significant revenue but granular market share data is limited.',
      insights: [
        'Top 3 incumbents generate ~$2B combined annual revenue',
        'Market fragmented beyond top 3 with many niche players',
      ],
      gaps: [
        'Competitor market share breakdown not mentioned',
        'Competitor growth rates not provided',
        'Win/loss data against specific competitors not included',
      ],
      recommendations: [
        'Map competitor revenue to addressable segments',
        'Build competitive intelligence database',
      ],
      assumptions: [
        'Incumbent revenue represents serviceable market',
      ],
      validatedSignals: [
        'Public competitor financial disclosures',
      ],
    },
    {
      id: 'market-cost-savings',
      title: 'Cost Savings',
      category: 'Market Size',
      status: 'pass',
      summary: 'Clear cost savings narrative with strong quantified evidence from early customers.',
      insights: [
        'Customers report 60-80% reduction in manual compliance labor costs',
        'Average time savings of 40+ hours per week per compliance team',
      ],
      gaps: [
        'Independent cost savings verification not provided',
        'Savings calculation methodology not disclosed',
      ],
      recommendations: [
        'Develop formal ROI calculator for sales enablement',
        'Commission third-party cost savings study',
      ],
      assumptions: [
        'Savings persist beyond initial implementation',
      ],
      validatedSignals: [
        'Customer testimonials citing labor reduction',
        'Pilot data showing reduced compliance cycle times',
      ],
    },
    {
      id: 'market-macro',
      title: 'Macro Market',
      category: 'Market Size',
      status: 'pass',
      summary: 'Strong macro tailwinds driven by increasing regulatory complexity globally.',
      insights: [
        'Regulatory complexity increasing 15% YoY across industries',
        'New compliance mandates emerging in AI governance and data privacy',
      ],
      gaps: [
        'Geographic market breakdown not included',
        'Regulatory risk (deregulation scenario) not addressed',
      ],
      recommendations: [
        'Monitor regulatory landscape for expansion opportunities',
        'Develop region-specific compliance playbooks',
      ],
      assumptions: [
        'Regulatory burden continues to increase',
      ],
      validatedSignals: [
        'Government policy tracker data',
        'Industry publications on regulatory trends',
      ],
    },
    {
      id: 'market-trends',
      title: 'Market Trends',
      category: 'Market Size',
      status: 'pass',
      summary: 'AI-driven compliance automation is a clear secular trend with accelerating adoption.',
      insights: [
        'Shift toward automated, AI-driven compliance solutions accelerating',
        'Enterprise buyers increasingly open to AI-first tooling',
      ],
      gaps: [
        'Adoption curve timeline not quantified',
        'Hype cycle risk not mentioned',
      ],
      recommendations: [
        'Position as category leader in AI-driven compliance',
        'Publish thought leadership on automation trends',
      ],
      assumptions: [
        'AI adoption in compliance will follow broader enterprise AI trends',
      ],
      validatedSignals: [
        'Analyst reports on AI adoption in GRC',
        'Competitor product launches confirming trend',
      ],
    },
    {
      id: 'market-niche-platform',
      title: 'Niche and Platform',
      category: 'Market Size',
      status: 'unclear',
      summary: 'Initial SaaS vertical focus is sound but platform expansion path needs definition.',
      insights: [
        'Initial focus on SaaS vertical with platform expansion potential',
        'Niche provides defensible beachhead with clear ICP alignment',
      ],
      gaps: [
        'Platform expansion roadmap not mentioned',
        'Adjacent vertical prioritization criteria not defined',
        'Niche market ceiling not quantified',
      ],
      recommendations: [
        'Dominate SaaS niche before horizontal expansion',
        'Define criteria for evaluating adjacent verticals',
      ],
      assumptions: [
        'SaaS vertical is large enough for meaningful scale',
        'Horizontal expansion will be feasible from SaaS beachhead',
      ],
      validatedSignals: [
        'Pipeline concentration in SaaS vertical',
      ],
    },

    // ── Traction ───────────────────────────────────────────
    {
      id: 'traction-paying-customers',
      title: 'Paying Customers',
      category: 'Traction',
      status: 'pass',
      summary: 'Strong early revenue signal with 8 paying enterprise customers.',
      insights: [
        '8 paying enterprise customers with $50K+ ACV',
        'Average deal size aligns with target ICP range',
      ],
      gaps: [
        'Revenue run rate not specified',
        'Customer concentration risk not addressed',
        'Expansion revenue data not mentioned',
      ],
      recommendations: [
        'Track net dollar retention across cohorts',
        'Diversify customer base to reduce concentration',
      ],
      assumptions: [
        'Current customers represent repeatable ICP',
      ],
      validatedSignals: [
        'Signed customer contracts on file',
        'Bank statements confirming revenue',
      ],
    },
    {
      id: 'traction-engagement',
      title: 'Engagement Metrics',
      category: 'Traction',
      status: 'pass',
      summary: 'High engagement signals indicate strong product-market resonance.',
      insights: [
        '85% weekly active usage across customer base',
        '4.2 NPS from pilot users indicating strong satisfaction',
      ],
      gaps: [
        'Churn/retention data not provided',
        'Feature adoption depth not mentioned',
        'Time-to-value metrics not disclosed',
      ],
      recommendations: [
        'Establish cohort retention analysis',
        'Track feature-level engagement metrics',
      ],
      assumptions: [
        'High engagement correlates with retention',
      ],
      validatedSignals: [
        'Product analytics dashboard data',
        'NPS survey results on file',
      ],
    },
    {
      id: 'traction-lois',
      title: 'Letters of Intent (LOIs)',
      category: 'Traction',
      status: 'pass',
      summary: 'Strong forward demand signal with 5 signed LOIs representing significant ACV.',
      insights: [
        '5 signed LOIs totaling $400K in potential ACV',
        'LOI prospects align with primary ICP definition',
      ],
      gaps: [
        'LOI conversion timeline not specified',
        'Historical LOI-to-close conversion rate not mentioned',
        'LOI terms and conditions not disclosed',
      ],
      recommendations: [
        'Track LOI-to-close conversion rate',
        'Accelerate LOI conversion with proof-of-value pilots',
      ],
      assumptions: [
        'LOIs will convert at 60%+ rate',
      ],
      validatedSignals: [
        'Signed LOI documents on file',
      ],
    },
    {
      id: 'traction-inferior-competition',
      title: 'Inferior Competition',
      category: 'Traction',
      status: 'pass',
      summary: 'Current competitive landscape presents a clear window of opportunity.',
      insights: [
        'Current solutions require 10x more implementation time',
        'Incumbent products built on legacy architectures',
      ],
      gaps: [
        'Competitive response strategy not addressed',
        'Feature parity analysis not mentioned',
        'Switching cost analysis not provided',
      ],
      recommendations: [
        'Create competitive battlecards for sales team',
        'Monitor incumbent innovation roadmaps',
      ],
      assumptions: [
        'Incumbents will be slow to respond',
      ],
      validatedSignals: [
        'Competitive product demos and teardown analysis',
      ],
    },
    {
      id: 'traction-seed-investors',
      title: 'Seed Investors',
      category: 'Traction',
      status: 'pass',
      summary: 'Strong investor validation with tier-1 VC leading seed round.',
      insights: [
        'Led by tier-1 VC with $3M seed round closed',
        'Investor syndicate includes strategic angels from compliance domain',
      ],
      gaps: [
        'Follow-on funding strategy not mentioned',
        'Runway and burn rate not disclosed',
        'Investor value-add beyond capital not specified',
      ],
      recommendations: [
        'Define Series A milestones with current investors',
        'Leverage investor network for customer introductions',
      ],
      assumptions: [
        'Seed investors will support Series A bridge if needed',
      ],
      validatedSignals: [
        'Seed round term sheet and close documentation',
        'Investor track record in category',
      ],
    },
    {
      id: 'traction-industry-validation',
      title: 'Industry Validation',
      category: 'Traction',
      status: 'pass',
      summary: 'Notable third-party validation through analyst recognition.',
      insights: [
        'Featured in Gartner Cool Vendors report',
        'Recognized by industry analysts as emerging player',
      ],
      gaps: [
        'No peer-reviewed case studies published',
        'Awards or additional analyst coverage not mentioned',
        'Customer reference program not established',
      ],
      recommendations: [
        'Pursue additional analyst briefings (Forrester, IDC)',
        'Develop published customer case studies',
      ],
      assumptions: [
        'Analyst recognition translates to buyer trust',
      ],
      validatedSignals: [
        'Gartner Cool Vendors report inclusion',
      ],
    },
  ];

  return {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    status: 'complete',
    companyName,
    sections,
    customerSegments: [
      { name: 'Mid-Market SaaS', percentage: 45, urgency: 'high' },
      { name: 'Enterprise FinServ', percentage: 30, urgency: 'medium' },
      { name: 'Healthcare Tech', percentage: 15, urgency: 'high' },
      { name: 'Other', percentage: 10, urgency: 'low' },
    ],
    positioning: [
      { company: 'Target Company', innovation: 75, marketFit: 60, isTarget: true },
      { company: 'Incumbent A', innovation: 30, marketFit: 85 },
      { company: 'Incumbent B', innovation: 25, marketFit: 75 },
      { company: 'Startup X', innovation: 80, marketFit: 35 },
      { company: 'Startup Y', innovation: 65, marketFit: 45 },
    ],
    gtmDecisions: [
      { factor: 'Brand Awareness', pushScore: 70, pullScore: 30 },
      { factor: 'Sales Cycle', pushScore: 40, pullScore: 60 },
      { factor: 'Product Complexity', pushScore: 55, pullScore: 45 },
      { factor: 'Buyer Persona', pushScore: 35, pullScore: 65 },
      { factor: 'Market Maturity', pushScore: 60, pullScore: 40 },
    ],
    disruptionScore: 62,
  };
}

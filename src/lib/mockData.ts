import type { DiligenceReport, AnalysisSection } from '@/types/diligence';

// Mock data for demonstration - in production this would come from AI analysis
export function generateMockReport(companyName: string): DiligenceReport {
  const sections: AnalysisSection[] = [
    {
      id: 'customer-pain',
      title: 'Customer Pain & Urgency',
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

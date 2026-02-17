import type { DiligenceReport, AnalysisSection, BusinessModel, FunnelStage } from '@/types/diligence';

// Fallback mock data used only if AI analysis fails
export function generateMockReport(companyName: string, businessModel: BusinessModel = 'B2B'): DiligenceReport {
  const sections: AnalysisSection[] = [
    {
      id: 'customer-pain',
      title: 'Customer Pain & Urgency',
      category: 'Value Proposition',
      status: 'unclear',
      summary: 'Upload materials to analyze customer pain signals.',
      insights: ['No materials analyzed yet'],
      gaps: ['Upload pitch deck or materials to generate insights'],
      recommendations: ['Provide company materials for analysis'],
      assumptions: [],
      validatedSignals: [],
    },
  ];

  return {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    status: 'complete',
    companyName,
    businessModel,
    sections,
    customerSegments: [],
    positioning: [],
    gtmDecisions: [],
    disruptionScore: 0,
    acquisitionFunnel: [],
    roadmap: [],
    businessModelFlow: { stages: [], revenueStreams: [], summary: '' },
  };
}

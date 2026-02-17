export type AnalysisStatus = 'pass' | 'risk' | 'unclear' | 'pending';

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  progress: number;
}

export interface AnalysisSection {
  id: string;
  title: string;
  category: 'Value Proposition' | 'Market Size' | 'Traction';
  status: AnalysisStatus;
  summary: string;
  insights: string[];
  gaps: string[];
  recommendations: string[];
  assumptions: string[];
  validatedSignals: string[];
}

export interface CustomerSegment {
  name: string;
  percentage: number;
  urgency: 'high' | 'medium' | 'low';
}

export interface PositioningData {
  company: string;
  innovation: number;
  marketFit: number;
  isTarget?: boolean;
}

export interface GTMDecision {
  factor: string;
  pushScore: number;
  pullScore: number;
}

export type BusinessModel = 'B2B' | 'B2C';

export interface FunnelStage {
  name: string;
  value: number;
  percentage: number;
  tactic: string;
  channels: string[];
}

export interface BusinessModelFlowStage {
  label: string;
  description: string;
  type: 'source' | 'process' | 'revenue';
}

export interface RevenueStream {
  name: string;
  description: string;
  percentage?: number;
}

export interface BusinessModelData {
  stages: BusinessModelFlowStage[];
  revenueStreams: RevenueStream[];
  summary: string;
}

export interface RoadmapMilestone {
  title: string;
  description: string;
  tactics: string[];
  successMetrics: string[];
  timeline: string;
}

export interface RoadmapPhase {
  id: 'icp-discovery' | 'pmf-validation' | 'gtm-scaling';
  name: string;
  objective: string;
  milestones: RoadmapMilestone[];
}

export interface DiligenceReport {
  id: string;
  createdAt: Date;
  status: 'processing' | 'complete' | 'error';
  companyName: string;
  businessModel: BusinessModel;
  sections: AnalysisSection[];
  customerSegments: CustomerSegment[];
  positioning: PositioningData[];
  gtmDecisions: GTMDecision[];
  disruptionScore: number;
  acquisitionFunnel: FunnelStage[];
  roadmap: RoadmapPhase[];
  businessModelFlow: BusinessModelData;
}

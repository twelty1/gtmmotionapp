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

export interface DiligenceReport {
  id: string;
  createdAt: Date;
  status: 'processing' | 'complete' | 'error';
  companyName: string;
  sections: AnalysisSection[];
  customerSegments: CustomerSegment[];
  positioning: PositioningData[];
  gtmDecisions: GTMDecision[];
  disruptionScore: number;
}

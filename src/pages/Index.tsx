import { useState } from 'react';
import { cn } from '@/lib/utils';
import { FileUploadZone } from '@/components/FileUploadZone';
import { BusinessModelToggle } from '@/components/BusinessModelToggle';
import { AnalysisCard } from '@/components/AnalysisCard';
import { SegmentationChart } from '@/components/charts/SegmentationChart';
import { PositioningMap } from '@/components/charts/PositioningMap';
import { GTMDecisionChart } from '@/components/charts/GTMDecisionChart';
import { DisruptionSpectrum } from '@/components/charts/DisruptionSpectrum';
import { AcquisitionFunnel } from '@/components/charts/AcquisitionFunnel';
import { StatusBadge } from '@/components/StatusBadge';
import { generateMockReport } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  FileText,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Loader2,
  Target,
} from 'lucide-react';
import type { UploadedFile, DiligenceReport, BusinessModel } from '@/types/diligence';

const Index = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [businessModel, setBusinessModel] = useState<BusinessModel>('B2B');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [report, setReport] = useState<DiligenceReport | null>(null);

  const handleStartAnalysis = async () => {
    setIsProcessing(true);
    setProcessingProgress(0);

    // Simulate processing
    const steps = [
      { progress: 20, label: 'Ingesting documents...' },
      { progress: 40, label: 'Extracting key information...' },
      { progress: 60, label: 'Analyzing GTM signals...' },
      { progress: 80, label: 'Generating insights...' },
      { progress: 100, label: 'Complete!' },
    ];

    for (const step of steps) {
      await new Promise((r) => setTimeout(r, 800));
      setProcessingProgress(step.progress);
    }

    await new Promise((r) => setTimeout(r, 500));
    setReport(generateMockReport('TechCorp AI', businessModel));
    setIsProcessing(false);
  };

  const handleRegenerate = () => {
    setReport(null);
    handleStartAnalysis();
  };

  const getStatusCounts = () => {
    if (!report) return { pass: 0, risk: 0, unclear: 0 };
    return report.sections.reduce(
      (acc, section) => {
        acc[section.status as keyof typeof acc]++;
        return acc;
      },
      { pass: 0, risk: 0, unclear: 0, pending: 0 }
    );
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  VC Diligence Platform
                </h1>
                <p className="text-sm text-muted-foreground">
                  GTM & Product-Market Fit Analysis
                </p>
              </div>
            </div>
            {report && (
              <Button
                variant="outline"
                onClick={handleRegenerate}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate Analysis
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!report && !isProcessing && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Upload Investment Materials
              </h2>
              <p className="text-muted-foreground">
                Upload pitch decks, memos, transcripts, and documents to generate
                a comprehensive GTM and PMF analysis.
              </p>
            </div>
            <FileUploadZone
              files={files}
              onFilesChange={setFiles}
              onStartAnalysis={handleStartAnalysis}
              isProcessing={isProcessing}
            >
              <BusinessModelToggle
                value={businessModel}
                onChange={setBusinessModel}
              />
            </FileUploadZone>
          </div>
        )}

        {isProcessing && (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Analyzing Materials
            </h2>
            <p className="text-muted-foreground mb-6">
              Processing {files.length} document{files.length !== 1 && 's'} and
              generating GTM insights...
            </p>
            <Progress value={processingProgress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {processingProgress}% complete
            </p>
          </div>
        )}

        {report && (
          <div className="space-y-8 animate-fade-in">
            {/* Dashboard Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Due Diligence Report
                </h2>
                <p className="text-muted-foreground">
                  {report.companyName} • Generated{' '}
                  {report.createdAt.toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-status-pass" />
                  <span className="text-muted-foreground">
                    {statusCounts.pass} Pass
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <HelpCircle className="w-4 h-4 text-status-unclear" />
                  <span className="text-muted-foreground">
                    {statusCounts.unclear} Unclear
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-status-risk" />
                  <span className="text-muted-foreground">
                    {statusCounts.risk} Risk
                  </span>
                </div>
              </div>
            </div>

            {/* Grouped Analysis Sections */}
            {(['Value Proposition', 'Market Size', 'Traction'] as const).map((category) => {
              const categorySections = report.sections.filter(s => s.category === category);
              const categoryIcons = {
                'Value Proposition': <FileText className="w-5 h-5 text-primary" />,
                'Market Size': <BarChart3 className="w-5 h-5 text-primary" />,
                'Traction': <Target className="w-5 h-5 text-primary" />,
              };
              const categoryPass = categorySections.filter(s => s.status === 'pass').length;
              const categoryRisk = categorySections.filter(s => s.status === 'risk').length;
              const categoryUnclear = categorySections.filter(s => s.status === 'unclear').length;

              return (
                <section key={category}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {categoryIcons[category]}
                      <h3 className="text-lg font-semibold text-foreground">
                        {category}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-status-pass" />
                        {categoryPass}
                      </span>
                      <span className="flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-status-unclear" />
                        {categoryUnclear}
                      </span>
                      <span className="flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-status-risk" />
                        {categoryRisk}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {categorySections.map((section, index) => (
                      <AnalysisCard
                        key={section.id}
                        section={section}
                        index={index}
                      />
                    ))}
                  </div>
                </section>
              );
            })}

            {/* Visualizations */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  Visual Analysis
                </h3>
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                <AcquisitionFunnel
                  data={report.acquisitionFunnel}
                  businessModel={report.businessModel}
                />
                <SegmentationChart data={report.customerSegments} />
                <PositioningMap data={report.positioning} />
                <GTMDecisionChart data={report.gtmDecisions} />
                <DisruptionSpectrum score={report.disruptionScore} />
              </div>
            </section>

            {/* Add More Files */}
            <section className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">
                    Add More Materials
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Upload additional documents to refine the analysis
                  </p>
                </div>
              </div>
              <FileUploadZone
                files={files}
                onFilesChange={setFiles}
                onStartAnalysis={handleRegenerate}
                isProcessing={isProcessing}
              />
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-sm text-muted-foreground text-center">
            VC Diligence Platform • Investor-grade GTM & PMF Analysis
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

import { useState, useRef } from 'react';
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
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
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
  const [rawFiles, setRawFiles] = useState<File[]>([]);
  const [businessModel, setBusinessModel] = useState<BusinessModel>('B2B');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingLabel, setProcessingLabel] = useState('');
  const [report, setReport] = useState<DiligenceReport | null>(null);
  const { toast } = useToast();

  const readFileAsText = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handleStartAnalysis = async () => {
    if (rawFiles.length === 0) {
      toast({ title: 'No files', description: 'Please upload materials first.', variant: 'destructive' });
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);
    setProcessingLabel('Reading documents...');

    try {
      // Step 1: Read file contents
      setProcessingProgress(15);
      setProcessingLabel('Extracting text from documents...');
      const documentTexts: string[] = [];
      for (const file of rawFiles) {
        try {
          const text = await readFileAsText(file);
          if (text.trim()) {
            documentTexts.push(`--- ${file.name} ---\n${text}`);
          }
        } catch {
          documentTexts.push(`--- ${file.name} --- [Could not extract text from this file format]`);
        }
      }

      if (documentTexts.length === 0) {
        throw new Error('Could not extract text from any uploaded files.');
      }

      // Step 2: Call AI analysis
      setProcessingProgress(30);
      setProcessingLabel('Analyzing materials with AI...');

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-documents`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ documentTexts, businessModel }),
        }
      );

      setProcessingProgress(70);
      setProcessingLabel('Processing GTM insights...');

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Analysis failed (${response.status})`);
      }

      const aiReport = await response.json();

      setProcessingProgress(90);
      setProcessingLabel('Building report...');

      // Build the final report
      const finalReport: DiligenceReport = {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        status: 'complete',
        companyName: aiReport.companyName || 'Unknown Company',
        businessModel,
        sections: aiReport.sections || [],
        customerSegments: aiReport.customerSegments || [],
        positioning: aiReport.positioning || [],
        gtmDecisions: aiReport.gtmDecisions || [],
        disruptionScore: aiReport.disruptionScore || 0,
        acquisitionFunnel: aiReport.acquisitionFunnel || [],
      };

      setProcessingProgress(100);
      setProcessingLabel('Complete!');
      await new Promise((r) => setTimeout(r, 500));
      setReport(finalReport);
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRegenerate = () => {
    setReport(null);
    handleStartAnalysis();
  };

  const handleFilesChange = (uploadedFiles: UploadedFile[], nativeFiles?: File[]) => {
    setFiles(uploadedFiles);
    if (nativeFiles) {
      setRawFiles(nativeFiles);
    }
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
                a comprehensive GTM and PMF analysis for the company.
              </p>
            </div>
            <FileUploadZone
              files={files}
              onFilesChange={handleFilesChange}
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
              {processingLabel}
            </p>
            <Progress value={processingProgress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {processingProgress}% complete
            </p>
          </div>
        )}

        {report && (
          <div className="space-y-8 animate-fade-in">
            {/* Company Name Header */}
            <div className="text-center pb-2 border-b border-border">
              <h2 className="text-3xl font-bold text-foreground">
                {report.companyName}
              </h2>
              <p className="text-muted-foreground mt-1">
                {report.businessModel === 'B2B' ? 'Sales-Led' : 'Digitally-Led'} GTM Strategy • Generated{' '}
                {report.createdAt.toLocaleDateString()}
              </p>
            </div>

            {/* Status Summary */}
            <div className="flex items-center justify-center gap-6">
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

            {/* Grouped Analysis Sections */}
            {(['Value Proposition', 'Market Size', 'Traction'] as const).map((category) => {
              const categorySections = report.sections.filter(s => s.category === category);
              if (categorySections.length === 0) return null;
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
            {(report.acquisitionFunnel.length > 0 || report.customerSegments.length > 0 || report.positioning.length > 0 || report.gtmDecisions.length > 0) && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Visual Analysis
                  </h3>
                </div>
                <div className="grid lg:grid-cols-2 gap-6">
                  {report.acquisitionFunnel.length > 0 && (
                    <AcquisitionFunnel
                      data={report.acquisitionFunnel}
                      businessModel={report.businessModel}
                    />
                  )}
                  {report.customerSegments.length > 0 && (
                    <SegmentationChart data={report.customerSegments} />
                  )}
                  {report.positioning.length > 0 && (
                    <PositioningMap data={report.positioning} />
                  )}
                  {report.gtmDecisions.length > 0 && (
                    <GTMDecisionChart data={report.gtmDecisions} />
                  )}
                  {report.disruptionScore > 0 && (
                    <DisruptionSpectrum score={report.disruptionScore} />
                  )}
                </div>
              </section>
            )}

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
                onFilesChange={handleFilesChange}
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

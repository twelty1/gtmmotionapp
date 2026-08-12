import { useState, useEffect } from 'react';
import * as mammoth from 'mammoth/mammoth.browser';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import pdfWorkerUrl from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';
import { cn } from '@/lib/utils';
import { FileUploadZone } from '@/components/FileUploadZone';
import { BusinessModelToggle } from '@/components/BusinessModelToggle';
import { AnalysisCard } from '@/components/AnalysisCard';
import { SegmentationChart } from '@/components/charts/SegmentationChart';
import { PositioningMap } from '@/components/charts/PositioningMap';
import { GTMDecisionChart } from '@/components/charts/GTMDecisionChart';
import { DisruptionSpectrum } from '@/components/charts/DisruptionSpectrum';
import { AcquisitionFunnel } from '@/components/charts/AcquisitionFunnel';
import { GTMRoadmap } from '@/components/GTMRoadmap';
import { BusinessModelDiagram } from '@/components/charts/BusinessModelDiagram';
import { RiskyStrategies } from '@/components/RiskyStrategies';
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
  TrendingUp,
  Sun,
  Moon,
} from 'lucide-react';
import type { UploadedFile, DiligenceReport, BusinessModel } from '@/types/diligence';

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const Index = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [rawFiles, setRawFiles] = useState<File[]>([]);
  const [additionalContext, setAdditionalContext] = useState('');
  const [businessModel, setBusinessModel] = useState<BusinessModel>('B2B');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingLabel, setProcessingLabel] = useState('');
  const [report, setReport] = useState<DiligenceReport | null>(null);
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const readFileAsText = async (file: File): Promise<string> => {
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension === 'pdf') {
      const pdf = await getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
      const pages: string[] = [];
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        pages.push(content.items.map((item) => ('str' in item ? item.str : '')).join(' '));
      }
      return pages.join('\n\n');
    }

    if (extension === 'docx') {
      const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
      return result.value;
    }

    if (extension === 'txt' || extension === 'md') {
      return file.text();
    }

    throw new Error(`Text extraction is not supported for ${file.name}`);
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
      setProcessingProgress(15);
      setProcessingLabel('Extracting text from documents...');
      const documentTexts: string[] = [];
      for (const file of rawFiles) {
        try {
          const text = await readFileAsText(file);
          if (text.trim()) documentTexts.push(`--- ${file.name} ---\n${text}`);
        } catch (error) {
          console.error(`Could not extract ${file.name}:`, error);
        }
      }
      if (documentTexts.length === 0) throw new Error('Could not extract text from the uploaded files. Please use a text-based PDF, DOCX, TXT, or MD file.');

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
          body: JSON.stringify({ documentTexts, businessModel, additionalContext: additionalContext.trim() || undefined }),
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
        roadmap: aiReport.roadmap || [],
        businessModelFlow: aiReport.businessModelFlow || { stages: [], revenueStreams: [], summary: '' },
        riskyStrategies: aiReport.riskyStrategies || [],
        gtmSummaryParagraph: aiReport.gtmSummaryParagraph || '',
        businessModelSummaryParagraph: aiReport.businessModelSummaryParagraph || '',
      };
      setProcessingProgress(100);
      setProcessingLabel('Complete!');
      await new Promise((r) => setTimeout(r, 500));
      setReport(finalReport);
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'Something went wrong.',
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
    if (nativeFiles) setRawFiles(nativeFiles);
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

  const categoryConfig = {
    'Value Proposition': { icon: <FileText className="w-5 h-5" />, description: 'Core value drivers, differentiation, ICP definition, and go-to-market motion' },
    'Market Size': { icon: <TrendingUp className="w-5 h-5" />, description: 'ROI positioning, market trends, and beachhead niche strategy' },
    'Traction': { icon: <Target className="w-5 h-5" />, description: 'Industry validation signals and credibility building' },
  } as const;

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
                <h1 className="text-lg font-semibold text-foreground">VC Diligence Platform</h1>
                <p className="text-sm text-muted-foreground">GTM & Product-Market Fit Analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDarkMode(!darkMode)}
                className="rounded-full"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              {report && (
                <Button variant="outline" onClick={handleRegenerate} className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Regenerate
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Upload State */}
        {!report && !isProcessing && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Upload Investment Materials</h2>
              <p className="text-muted-foreground">
                Upload pitch decks, memos, transcripts, and documents to generate a comprehensive GTM and PMF analysis.
              </p>
            </div>
            <FileUploadZone files={files} onFilesChange={handleFilesChange} onStartAnalysis={handleStartAnalysis} isProcessing={isProcessing}>
              <BusinessModelToggle value={businessModel} onChange={setBusinessModel} />
              <div className="mt-4">
                <label htmlFor="additional-context" className="block text-sm font-medium text-foreground mb-1.5">
                  Additional Context & Notes (optional)
                </label>
                <textarea
                  id="additional-context"
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  placeholder="Add any extra context, key questions, recent developments, or details not covered in the uploaded materials..."
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This will be included as additional context for the AI analysis.
                </p>
              </div>
            </FileUploadZone>
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Analyzing Materials</h2>
            <p className="text-muted-foreground mb-6">{processingLabel}</p>
            <Progress value={processingProgress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">{processingProgress}% complete</p>
          </div>
        )}

        {/* Report Output */}
        {report && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            {/* Report Title Block */}
            <div className="text-center mb-10 pb-8 border-b border-border">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Due Diligence Report</p>
              <h2 className="text-4xl font-bold text-foreground mb-3">{report.companyName}</h2>
              <p className="text-muted-foreground">
                {report.businessModel === 'B2B' ? 'Sales-Led' : report.businessModel === 'B2C' ? 'Digitally-Led' : 'Mixed (B2B + B2C)'} GTM Strategy Analysis
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Generated {report.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Executive Summary Bar */}
            <div className="bg-card border border-border rounded-lg p-5 mb-10">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Executive Summary</h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <CheckCircle2 className="w-5 h-5 text-[hsl(var(--status-pass))]" />
                    <span className="text-2xl font-bold text-foreground">{statusCounts.pass}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Signals Validated</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <HelpCircle className="w-5 h-5 text-[hsl(var(--status-unclear))]" />
                    <span className="text-2xl font-bold text-foreground">{statusCounts.unclear}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Need More Data</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <AlertCircle className="w-5 h-5 text-[hsl(var(--status-risk))]" />
                    <span className="text-2xl font-bold text-foreground">{statusCounts.risk}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Risks Identified</p>
                </div>
              </div>
            </div>

            {/* Business Model Section */}
            {report.businessModelFlow && report.businessModelFlow.stages.length > 0 && (
              <section className="mb-12">
                <BusinessModelDiagram data={report.businessModelFlow} />
              </section>
            )}

            {/* Category Sections with Inline Charts */}
            {(['Value Proposition', 'Market Size', 'Traction'] as const).map((category, catIdx) => {
              const categorySections = report.sections.filter(s => s.category === category);
              if (categorySections.length === 0) return null;
              const config = categoryConfig[category];

              return (
                <section key={category} className="mb-12">
                  {/* Category Header */}
                  <div className="mb-6 pb-3 border-b border-border">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="text-primary">{config.icon}</div>
                      <h3 className="text-xl font-bold text-foreground">{category}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground ml-8">{config.description}</p>
                  </div>

                  {/* Section Cards */}
                  <div className="space-y-4 mb-6">
                    {categorySections.map((section, index) => (
                      <AnalysisCard key={section.id} section={section} index={index} />
                    ))}
                  </div>

                  {/* Inline Visualizations per Category */}
                  {category === 'Value Proposition' && (
                    <div className="grid lg:grid-cols-2 gap-6 mt-6">
                      {report.customerSegments.length > 0 && <SegmentationChart data={report.customerSegments} />}
                      {report.gtmDecisions.length > 0 && <GTMDecisionChart data={report.gtmDecisions} />}
                      {report.disruptionScore > 0 && <DisruptionSpectrum score={report.disruptionScore} />}
                    </div>
                  )}

                  {category === 'Market Size' && report.positioning.length > 0 && (
                    <div className="mt-6">
                      <PositioningMap data={report.positioning} />
                    </div>
                  )}

                  {category === 'Traction' && report.acquisitionFunnel.length > 0 && (
                    <div className="mt-6">
                      <AcquisitionFunnel data={report.acquisitionFunnel} businessModel={report.businessModel} />
                    </div>
                  )}
                </section>
              );
            })}

            {/* GTM Execution Roadmap */}
            {report.roadmap.length > 0 && (
              <section className="mt-10 mb-8">
                <GTMRoadmap phases={report.roadmap} />
              </section>
            )}

            {/* Risky GTM Strategies */}
            {report.riskyStrategies.length > 0 && (
              <section className="mt-10 mb-8">
                <RiskyStrategies strategies={report.riskyStrategies} />
              </section>
            )}

            {/* Summary Paragraphs */}
            {(report.gtmSummaryParagraph || report.businessModelSummaryParagraph) && (
              <section className="mt-10 mb-8 space-y-8">
                {report.gtmSummaryParagraph && (
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-bold text-foreground mb-1">Market & GTM Summary</h3>
                    <div className="w-12 h-0.5 bg-primary mb-4" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{report.gtmSummaryParagraph}</p>
                  </div>
                )}
                {report.businessModelSummaryParagraph && (
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-bold text-foreground mb-1">Business Model Summary</h3>
                    <div className="w-12 h-0.5 bg-primary mb-4" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{report.businessModelSummaryParagraph}</p>
                  </div>
                )}
              </section>
            )}

            {/* Add More Materials */}
            <section className="bg-card border border-border rounded-lg p-6 mt-8">
              <div className="mb-4">
                <h3 className="font-semibold text-foreground">Refine This Analysis</h3>
                <p className="text-sm text-muted-foreground">Upload additional materials or add new context to regenerate the report</p>
              </div>
              <FileUploadZone files={files} onFilesChange={handleFilesChange} onStartAnalysis={handleRegenerate} isProcessing={isProcessing}>
                <BusinessModelToggle value={businessModel} onChange={setBusinessModel} />
                <div className="mt-4">
                  <label htmlFor="additional-context-refine" className="block text-sm font-medium text-foreground mb-1.5">
                    Additional Context & Notes (optional)
                  </label>
                  <textarea
                    id="additional-context-refine"
                    value={additionalContext}
                    onChange={(e) => setAdditionalContext(e.target.value)}
                    placeholder="Add new findings, context, key questions, or details to refine the analysis..."
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This will be included as additional context when regenerating the report.
                  </p>
                </div>
              </FileUploadZone>
            </section>
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-sm text-muted-foreground text-center">VC Diligence Platform • Investor-grade GTM & PMF Analysis</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

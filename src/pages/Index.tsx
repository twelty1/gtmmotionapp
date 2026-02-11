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
      setProcessingProgress(15);
      setProcessingLabel('Extracting text from documents...');
      const documentTexts: string[] = [];
      for (const file of rawFiles) {
        try {
          const text = await readFileAsText(file);
          if (text.trim()) documentTexts.push(`--- ${file.name} ---\n${text}`);
        } catch {
          documentTexts.push(`--- ${file.name} --- [Could not extract text]`);
        }
      }
      if (documentTexts.length === 0) throw new Error('Could not extract text from any uploaded files.');

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
    'Value Proposition': { icon: <FileText className="w-5 h-5" />, description: 'Analysis of core value drivers, differentiation, and go-to-market positioning' },
    'Market Size': { icon: <TrendingUp className="w-5 h-5" />, description: 'Market opportunity assessment including TAM, competitive landscape, and trends' },
    'Traction': { icon: <Target className="w-5 h-5" />, description: 'Evidence of product-market fit through customers, engagement, and validation signals' },
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
            {report && (
              <Button variant="outline" onClick={handleRegenerate} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </Button>
            )}
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
                {report.businessModel === 'B2B' ? 'Sales-Led' : 'Digitally-Led'} GTM Strategy Analysis
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

            {/* GTM Motion Summary */}
            <section className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-8 mt-10 mb-8">
              <h3 className="text-lg font-bold text-foreground mb-6">GTM Motion: Execution Roadmap</h3>
              <div className="space-y-5 text-sm leading-relaxed text-foreground/90">
                <p>
                  <strong className="text-foreground">Immediate (Weeks 1-4):</strong> {
                    report.businessModel === 'B2B' 
                      ? `Launch a targeted ABM campaign focusing on your highest-urgency customer segments (${report.customerSegments[0]?.name || 'primary market'}). Build a curated target account list of 50 high-fit prospects, establish clear discovery call scripts, and assign dedicated account executives to each prospect. Run parallel validation through LOI collection—aim for 3-5 letters of intent to prove sales motion viability. Simultaneously, address the biggest market size risks by collecting concrete TAM validation data from industry reports and customer conversations.`
                      : `Build a self-serve product-led growth (PLG) experience that removes friction from onboarding—optimize your funnel's weakest conversion stage (currently ${report.acquisitionFunnel[Math.floor(report.acquisitionFunnel.length / 2)]?.name || 'middle stage'}). Implement viral loops and referral mechanics targeting your fastest-growing segment (${report.customerSegments[0]?.name || 'early adopters'}). Set up automated engagement tracking and retention metrics to identify churn patterns. Run daily experiments on landing page positioning to test your ${report.positioning[0]?.company || 'core value proposition'} messaging against competitor differentiation claims.`
                  }
                </p>
                <p>
                  <strong className="text-foreground">Short-term (Weeks 5-12):</strong> {
                    report.businessModel === 'B2B'
                      ? `Scale ABM efforts to 150 target accounts using multi-threaded selling strategies. Drive all closed deals through your sales team—focus on average contract value (ACV) expansion and account penetration. Host customer advisory boards with your top-performing accounts to validate product roadmap priorities and generate case studies. If your market trends show a shift toward your positioning, publish thought leadership content to reinforce your positioning vs. competitors and attract inbound deals.`
                      : `Double down on your highest-performing acquisition channels—whether that's ${report.gtmDecisions[0]?.factor?.toLowerCase().includes('paid') ? 'paid performance marketing' : 'organic or viral loops'}. Implement retention playbooks based on your engagement metrics—identify power users and replicate their behavior patterns across your user base. Launch a referral program tied to your highest-impact customer segment to accelerate word-of-mouth growth. Build partnerships with complementary products in your niche to expand your TAM without proportional sales costs.`
                  }
                </p>
                <p>
                  <strong className="text-foreground">Medium-term (Months 3-6):</strong> {
                    report.businessModel === 'B2B'
                      ? `Achieve 10-15 closed customers with validated sales playbooks, focusing on customer success and retention to generate expansion revenue and referrals. Publish customer case studies and industry validation (awards, analyst recognition, seed investors) to build credibility with your buyer personas. If market trends are favorable, invest in enterprise sales infrastructure—add sales development reps (SDRs) and customer success managers (CSMs). Begin building a platform strategy to increase account lifetime value and reduce competitive churn.`
                      : `Target 10K+ activated users with a 30%+ month-on-month growth rate in your largest customer segment. Invest in community building and user-generated content campaigns to deepen engagement and reduce churn. Optimize your acquisition funnel to achieve repeatable unit economics across all channels. Begin exploring monetization strategies that align with your cheapest-to-acquire, highest-engagement user cohort—whether that's premium tiers, marketplace fees, or enterprise licenses.`
                  }
                </p>
              </div>
            </section>

            {/* Add More Materials */}
            <section className="bg-card border border-border rounded-lg p-6 mt-8">
              <div className="mb-4">
                <h3 className="font-semibold text-foreground">Refine This Analysis</h3>
                <p className="text-sm text-muted-foreground">Upload additional materials to deepen the analysis</p>
              </div>
              <FileUploadZone files={files} onFilesChange={handleFilesChange} onStartAnalysis={handleRegenerate} isProcessing={isProcessing} />
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

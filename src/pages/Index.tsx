import { useState } from "react";
import { Shield, Heart } from "lucide-react";
import { StepIndicator } from "@/components/StepIndicator";
import { FileUpload } from "@/components/FileUpload";
import { IdeasSelector } from "@/components/IdeasSelector";
import { ResourceDisplay } from "@/components/ResourceDisplay";
import { toast } from "@/hooks/use-toast";
import type { WorkflowStep, Audience, ResourceIdea, GeneratedResource } from "@/types/resource";

const N8N_IDEAS_ENDPOINT = 'https://meta-lutz.app.n8n.cloud/webhook-test/upload-pdf';
const N8N_RESOURCES_ENDPOINT = 'https://meta-lutz.app.n8n.cloud/webhook-test/generate-resource';

export default function Index() {
  const [step, setStep] = useState<WorkflowStep>('upload');
  const [isLoading, setIsLoading] = useState(false);
  const [baseTitle, setBaseTitle] = useState('');
  const [ideas, setIdeas] = useState<ResourceIdea[]>([]);
  const [resources, setResources] = useState<GeneratedResource[]>([]);
  const [selectedIdeas, setSelectedIdeas] = useState<ResourceIdea[]>([]);

  const handleUpload = async (file: File, audience: Audience) => {
    setIsLoading(true);
    
    try {
      // Extract text from file (for PDF, you may need server-side extraction)
      const text = await file.text();
      const title = file.name.replace(/\.[^/.]+$/, '');
      
      const response = await fetch(N8N_IDEAS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base_title: title,
          base_text: text,
          audience: audience,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze resource');
      }
      
      const data = await response.json();
      
      setBaseTitle(data.base_title || title);
      setIdeas(data.ideas || []);
      setStep('ideas');
      
      toast({
        title: "Analysis Complete",
        description: `Found ${data.ideas?.length || 0} expansion ideas for your resource.`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to analyze the resource. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateResources = async (selectedIds: string[]) => {
    setIsLoading(true);
    const selected = ideas.filter(i => selectedIds.includes(i.id));
    setSelectedIdeas(selected);
    
    try {
      const response = await fetch(N8N_RESOURCES_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base_title: baseTitle,
          selected_ideas: selected,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate resources');
      }
      
      const data = await response.json();
      
      setResources(data.resources || []);
      setStep('resources');
      
      toast({
        title: "Resources Generated",
        description: `Created ${data.resources?.length || 0} resources for you.`,
      });
    } catch (error) {
      console.error('Generate error:', error);
      toast({
        title: "Error",
        description: "Failed to generate resources. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setStep('upload');
    setBaseTitle('');
    setIdeas([]);
    setResources([]);
    setSelectedIdeas([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="h-8 w-8 text-primary" />
              <Heart className="h-3 w-3 text-accent absolute -bottom-0.5 -right-0.5" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">Bully Proof</h1>
              <p className="text-xs text-muted-foreground">Resource Builder</p>
            </div>
          </div>
        </div>
      </header>

      {/* Step Indicator */}
      <div className="border-b border-border bg-secondary/30">
        <div className="container max-w-5xl mx-auto px-4 py-4">
          <StepIndicator currentStep={step} />
        </div>
      </div>

      {/* Main Content */}
      <main className="container max-w-3xl mx-auto px-4 py-8 md:py-12">
        {step === 'upload' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Build Powerful Prevention Resources
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Upload your base resource and we'll help you create complementary materials 
                tailored to your audience.
              </p>
            </div>
            <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-soft">
              <FileUpload onSubmit={handleUpload} isLoading={isLoading} />
            </div>
          </div>
        )}

        {step === 'ideas' && (
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-soft">
            <IdeasSelector
              baseTitle={baseTitle}
              ideas={ideas}
              onGenerate={handleGenerateResources}
              onBack={() => setStep('upload')}
              isLoading={isLoading}
            />
          </div>
        )}

        {step === 'resources' && (
          <ResourceDisplay
            baseTitle={baseTitle}
            resources={resources}
            onBack={() => setStep('ideas')}
            onStartOver={handleStartOver}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="container max-w-5xl mx-auto px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            Empowering communities to create safer spaces for everyone.
          </p>
        </div>
      </footer>
    </div>
  );
}

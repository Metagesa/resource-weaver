import { useState } from "react";
import { Shield, Heart } from "lucide-react";
import { StepIndicator } from "@/components/StepIndicator";
import { FileUpload } from "@/components/FileUpload";
import { IdeasSelector } from "@/components/IdeasSelector";
import { ResourceDisplay } from "@/components/ResourceDisplay";
import { toast } from "@/hooks/use-toast";
import type { WorkflowStep, Audience, ResourceIdea, GeneratedResource } from "@/types/resource";

// Mock data for demonstration - replace with actual n8n endpoint calls
const mockIdeas: ResourceIdea[] = [
  { id: 'wts_1', category: 'what_to_say', title: 'Calm Responses to Name-Calling', description: 'Scripts for children to use when faced with verbal bullying, emphasizing confidence and de-escalation.' },
  { id: 'wts_2', category: 'what_to_say', title: 'Conversation Starters for Parents', description: 'Age-appropriate ways to open dialogue about bullying experiences at home.' },
  { id: 'wts_3', category: 'what_to_say', title: 'Peer Support Phrases', description: 'What bystanders can say to support targeted students and discourage bullying behavior.' },
  { id: 'wtd_1', category: 'what_to_do', title: 'Step-by-Step Incident Checklist', description: 'A practical guide for documenting and reporting bullying incidents effectively.' },
  { id: 'wtd_2', category: 'what_to_do', title: 'Classroom Prevention Activities', description: 'Interactive exercises that build empathy and reduce bullying behavior.' },
  { id: 'wtd_3', category: 'what_to_do', title: 'Digital Safety Action Plan', description: 'Concrete steps for addressing cyberbullying and maintaining online safety.' },
];

const mockResources: GeneratedResource[] = [
  {
    id: 'res_1',
    idea_id: 'wts_1',
    title: 'Calm Responses to Name-Calling',
    html: `<h2>Calm Responses to Name-Calling</h2>
<p>When someone calls you a name, it can hurt. But you have the power to respond in ways that protect your feelings and show confidence. Here are some strategies:</p>
<h3>The Power Phrases</h3>
<ul>
<li><strong>"Thanks for sharing."</strong> — Neutral, shows you're unbothered</li>
<li><strong>"Okay."</strong> — Simple, takes away their power</li>
<li><strong>"I don't agree, but you're entitled to your opinion."</strong> — Mature and confident</li>
</ul>
<h3>Remember</h3>
<p>Your reaction is your superpower. When you stay calm, you show that their words don't control you. Practice these responses at home so they feel natural when you need them.</p>`
  }
];

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
      // TODO: Replace with actual n8n endpoint call
      // const formData = new FormData();
      // formData.append('file', file);
      // const response = await fetch('/api/ideas', {
      //   method: 'POST',
      //   body: JSON.stringify({ base_title: file.name, base_text: '...', audience }),
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setBaseTitle(file.name.replace(/\.[^/.]+$/, ''));
      setIdeas(mockIdeas);
      setStep('ideas');
      
      toast({
        title: "Analysis Complete",
        description: `Found ${mockIdeas.length} expansion ideas for your resource.`,
      });
    } catch (error) {
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
      // TODO: Replace with actual n8n endpoint call
      // const response = await fetch('/api/resources', {
      //   method: 'POST',
      //   body: JSON.stringify({ base_title: baseTitle, selected_ideas: selected, ... }),
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate mock resources based on selected ideas
      const generatedResources: GeneratedResource[] = selected.map((idea, index) => ({
        id: `res_${index + 1}`,
        idea_id: idea.id,
        title: idea.title,
        html: `<h2>${idea.title}</h2>
<p>${idea.description}</p>
<h3>Key Points</h3>
<ul>
<li>Practical, actionable guidance tailored to your audience</li>
<li>Evidence-based strategies for bullying prevention</li>
<li>Age-appropriate language and examples</li>
</ul>
<h3>Implementation Tips</h3>
<p>This resource is designed to be used alongside your existing materials. Share it with parents, educators, or administrators to reinforce your bullying prevention efforts.</p>`
      }));
      
      setResources(generatedResources);
      setStep('resources');
      
      toast({
        title: "Resources Generated",
        description: `Created ${generatedResources.length} resources for you.`,
      });
    } catch (error) {
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

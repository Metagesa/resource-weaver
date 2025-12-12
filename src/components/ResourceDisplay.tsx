import { useState } from "react";
import { Copy, Check, ArrowLeft, FileText, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { GeneratedResource } from "@/types/resource";

interface ResourceDisplayProps {
  baseTitle: string;
  resources: GeneratedResource[];
  onBack: () => void;
  onStartOver: () => void;
}

export function ResourceDisplay({ baseTitle, resources, onBack, onStartOver }: ResourceDisplayProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyHtml = async (resource: GeneratedResource) => {
    await navigator.clipboard.writeText(resource.html);
    setCopiedId(resource.id);
    toast({
      title: "Copied!",
      description: `"${resource.title}" HTML copied to clipboard.`,
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyPlainText = async (resource: GeneratedResource) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = resource.html;
    const plainText = tempDiv.textContent || tempDiv.innerText;
    await navigator.clipboard.writeText(plainText);
    toast({
      title: "Copied!",
      description: `"${resource.title}" text copied to clipboard.`,
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <Button variant="ghost" onClick={onBack} className="mb-2 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Ideas
          </Button>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Your Generated Resources
          </h2>
          <p className="text-muted-foreground">
            Based on "{baseTitle}" — {resources.length} resource{resources.length !== 1 ? 's' : ''} ready
          </p>
        </div>
        <Button variant="outline" onClick={onStartOver}>
          <RotateCcw className="h-4 w-4" />
          Start Over
        </Button>
      </div>

      {/* Resources */}
      <div className="space-y-6">
        {resources.map((resource, index) => (
          <div
            key={resource.id}
            className="rounded-xl border-2 border-border bg-card overflow-hidden shadow-soft animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Resource Header */}
            <div className="flex items-center justify-between gap-4 border-b border-border bg-secondary/50 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-display font-bold text-foreground">
                  {resource.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyPlainText(resource)}
                >
                  Copy Text
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => copyHtml(resource)}
                  className={cn(
                    copiedId === resource.id && "bg-success text-success-foreground"
                  )}
                >
                  {copiedId === resource.id ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy HTML
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Resource Content */}
            <div 
              className="prose prose-sm max-w-none p-6 text-foreground
                prose-headings:font-display prose-headings:text-foreground
                prose-p:text-foreground/90 prose-li:text-foreground/90
                prose-strong:text-foreground prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: resource.html }}
            />
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="flex justify-center pt-4">
        <Button variant="accent" size="lg" onClick={onStartOver}>
          <RotateCcw />
          Create More Resources
        </Button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { MessageCircle, ListTodo, Loader2, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { ResourceIdea } from "@/types/resource";

interface IdeasSelectorProps {
  baseTitle: string;
  ideas: ResourceIdea[];
  onGenerate: (selectedIds: string[]) => void;
  onBack: () => void;
  isLoading: boolean;
}

export function IdeasSelector({ baseTitle, ideas, onGenerate, onBack, isLoading }: IdeasSelectorProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const whatToSay = ideas.filter(i => i.category === 'what_to_say');
  const whatToDo = ideas.filter(i => i.category === 'what_to_do');

  const toggleIdea = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleGenerate = () => {
    onGenerate(Array.from(selectedIds));
  };

  const CategorySection = ({ 
    title, 
    icon: Icon, 
    items,
    accentColor 
  }: { 
    title: string; 
    icon: typeof MessageCircle; 
    items: ResourceIdea[];
    accentColor: string;
  }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className={cn("rounded-lg p-2", accentColor)}>
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
        <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
        <span className="text-sm text-muted-foreground">({items.length} ideas)</span>
      </div>
      <div className="space-y-3">
        {items.map((idea) => (
          <label
            key={idea.id}
            className={cn(
              "flex items-start gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all duration-200",
              selectedIds.has(idea.id)
                ? "border-primary bg-primary/5 shadow-soft"
                : "border-border hover:border-primary/30 hover:bg-secondary/50"
            )}
          >
            <Checkbox
              checked={selectedIds.has(idea.id)}
              onCheckedChange={() => toggleIdea(idea.id)}
              className="mt-1"
            />
            <div className="flex-1">
              <p className="font-semibold text-foreground">{idea.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{idea.description}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <Button variant="ghost" onClick={onBack} className="mb-2 -ml-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h2 className="font-display text-2xl font-bold text-foreground">
          Expansion Ideas for "{baseTitle}"
        </h2>
        <p className="text-muted-foreground">
          Select the ideas you'd like to develop into full resources.
        </p>
      </div>

      {/* Ideas Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {whatToSay.length > 0 && (
          <CategorySection
            title="What to Say"
            icon={MessageCircle}
            items={whatToSay}
            accentColor="bg-primary"
          />
        )}
        {whatToDo.length > 0 && (
          <CategorySection
            title="What to Do"
            icon={ListTodo}
            items={whatToDo}
            accentColor="bg-accent"
          />
        )}
      </div>

      {/* Generate Button */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          {selectedIds.size} idea{selectedIds.size !== 1 ? 's' : ''} selected
        </p>
        <Button
          onClick={handleGenerate}
          disabled={selectedIds.size === 0 || isLoading}
          size="lg"
          variant="accent"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" />
              Generating Resources...
            </>
          ) : (
            <>
              <Sparkles />
              Generate Resources
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

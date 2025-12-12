import { useState, useCallback } from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Audience } from "@/types/resource";

interface FileUploadProps {
  onSubmit: (file: File, audience: Audience) => void;
  isLoading: boolean;
}

const audienceOptions: { value: Audience; label: string; description: string }[] = [
  { value: 'parents', label: 'Parents', description: 'Family-focused guidance' },
  { value: 'educators', label: 'Educators', description: 'Classroom strategies' },
  { value: 'administrators', label: 'Administrators', description: 'Policy & program resources' },
  { value: 'mixed', label: 'Mixed Audience', description: 'General resources for all' },
];

export function FileUpload({ onSubmit, isLoading }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [audience, setAudience] = useState<Audience | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.type === 'text/plain')) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = () => {
    if (file && audience) {
      onSubmit(file, audience);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* File Upload Area */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-foreground">
          Upload Your Base Resource
        </label>
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-8 md:p-12 transition-all duration-300 cursor-pointer",
            isDragging && "border-primary bg-primary/5 scale-[1.02]",
            !isDragging && !file && "border-border hover:border-primary/50 hover:bg-secondary/50",
            file && "border-success bg-success/5"
          )}
        >
          {file ? (
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-success" />
              <div className="text-left">
                <p className="font-semibold text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="ml-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-full bg-primary/10 p-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">
                  Drop your PDF here or click to browse
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Supports PDF and TXT files
                </p>
              </div>
            </>
          )}
          <input
            type="file"
            accept=".pdf,.txt"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Audience Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-foreground">
          Who is your primary audience?
        </label>
        <div className="grid grid-cols-2 gap-3">
          {audienceOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setAudience(option.value)}
              className={cn(
                "flex flex-col items-start gap-1 rounded-xl border-2 p-4 text-left transition-all duration-200",
                audience === option.value
                  ? "border-primary bg-primary/5 shadow-soft"
                  : "border-border hover:border-primary/50 hover:bg-secondary/50"
              )}
            >
              <span className="font-semibold text-foreground">{option.label}</span>
              <span className="text-xs text-muted-foreground">{option.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!file || !audience || isLoading}
        size="lg"
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" />
            Analyzing Resource...
          </>
        ) : (
          <>
            <Upload />
            Generate Expansion Ideas
          </>
        )}
      </Button>
    </div>
  );
}

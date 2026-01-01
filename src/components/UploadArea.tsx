import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface UploadAreaProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  file: File | null;
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  required?: boolean;
}

export function UploadArea({
  icon,
  title,
  description,
  file,
  onFileSelect,
  accept,
  maxSize = 10,
  required = false,
}: UploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return;

    // Check file size
    if (selectedFile.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    onFileSelect(selectedFile);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileChange(droppedFile);
  };

  return (
    <div
      className={cn(
        "mt-2 border-2 border-dashed rounded-lg p-8 transition-all cursor-pointer",
        "hover:border-primary/50 hover:bg-muted/30",
        isDragging && "border-primary bg-muted/50",
        file && "border-primary bg-accent/10",
        "border-[hsl(var(--upload-border))] bg-[hsl(var(--upload-bg))]"
      )}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
      />
      <div className="flex flex-col items-center text-center space-y-3">
        {file ? (
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
            <Check className="w-6 h-6 text-accent-foreground" />
          </div>
        ) : (
          icon
        )}
        <div>
          <p className="font-medium text-foreground">
            {file ? file.name : title}
          </p>
          {!file && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

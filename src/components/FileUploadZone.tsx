import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Upload, FileText, X, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { UploadedFile } from '@/types/diligence';

interface FileUploadZoneProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  onStartAnalysis: () => void;
  isProcessing: boolean;
}

export function FileUploadZone({
  files,
  onFilesChange,
  onStartAnalysis,
  isProcessing,
}: FileUploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragActive(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      const newFiles: UploadedFile[] = droppedFiles.map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type,
        size: file.size,
        status: 'complete' as const,
        progress: 100,
      }));

      onFilesChange([...files, ...newFiles]);
    },
    [files, onFilesChange]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const newFiles: UploadedFile[] = selectedFiles.map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type,
        size: file.size,
        status: 'complete' as const,
        progress: 100,
      }));

      onFilesChange([...files, ...newFiles]);
    }
  };

  const removeFile = (id: string) => {
    onFilesChange(files.filter((f) => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragActive(true);
        }}
        onDragLeave={() => setIsDragActive(false)}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8 transition-all duration-200',
          'flex flex-col items-center justify-center text-center',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
        )}
      >
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.md,.pptx,.ppt"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div
          className={cn(
            'w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors',
            isDragActive ? 'bg-primary/20' : 'bg-muted'
          )}
        >
          <Upload
            className={cn(
              'w-6 h-6 transition-colors',
              isDragActive ? 'text-primary' : 'text-muted-foreground'
            )}
          />
        </div>

        <h3 className="font-semibold text-foreground mb-1">
          {isDragActive ? 'Drop files here' : 'Upload materials for analysis'}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Pitch decks, memos, notes, transcripts, and documents
        </p>
        <p className="text-xs text-muted-foreground">
          Supports PDF, DOC, DOCX, TXT, MD, PPT, PPTX
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">
              Uploaded files ({files.length})
            </h4>
            <Button
              onClick={onStartAnalysis}
              disabled={isProcessing || files.length === 0}
              className="gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Start GTM Analysis'
              )}
            </Button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg group"
              >
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                  {file.status === 'uploading' && (
                    <Progress value={file.progress} className="h-1 mt-1" />
                  )}
                </div>
                {file.status === 'complete' && (
                  <CheckCircle2 className="w-4 h-4 text-status-pass flex-shrink-0" />
                )}
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1 rounded hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

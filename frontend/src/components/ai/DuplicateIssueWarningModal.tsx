import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface DuplicateIssue {
  existingIssueId: string;
  existingIssueTitle: string;
  similarityPercentage: number;
  duplicateConfidenceScore: number;
}

interface DuplicateIssueWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  duplicates: DuplicateIssue[];
}

export function DuplicateIssueWarningModal({ isOpen, onClose, onContinue, duplicates }: DuplicateIssueWarningModalProps) {
  const router = useRouter();

  if (!duplicates || duplicates.length === 0) return null;

  // For simplicity, showing the top duplicate
  const topDuplicate = duplicates.sort((a, b) => b.similarityPercentage - a.similarityPercentage)[0];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-500">
            <AlertTriangle className="w-5 h-5" />
            Possible Duplicate Issue Detected
          </DialogTitle>
          <DialogDescription>
            We found an existing issue that looks very similar to the one you are creating.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-muted p-4 rounded-md text-sm">
            <p><strong>Existing Issue Title:</strong> {topDuplicate.existingIssueTitle}</p>
            <p className="mt-2">
              <strong>Similarity:</strong> {topDuplicate.similarityPercentage}%
            </p>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => router.push(`/issues/${topDuplicate.existingIssueId}`)}>
            Open Existing Issue
          </Button>
          <Button onClick={onContinue}>
            Continue Anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

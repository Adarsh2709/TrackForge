import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

interface AIPriorityBadgeProps {
  priority: string;
}

export function AIPriorityBadge({ priority }: AIPriorityBadgeProps) {
  const getPriorityColor = (p: string) => {
    switch (p.toLowerCase()) {
      case 'critical':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'high':
        return 'bg-orange-500 hover:bg-orange-600 text-white';
      case 'medium':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      case 'low':
        return 'bg-green-500 hover:bg-green-600 text-white';
      default:
        return 'bg-blue-500 hover:bg-blue-600 text-white';
    }
  };

  return (
    <Badge className={`flex items-center gap-1 font-semibold ${getPriorityColor(priority)}`} title="AI Generated Priority">
      <Sparkles className="w-3 h-3" />
      {priority}
    </Badge>
  );
}

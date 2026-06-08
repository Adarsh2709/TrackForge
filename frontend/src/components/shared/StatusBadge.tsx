import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (s: string) => {
    switch (s.toLowerCase()) {
      case "open":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200";
      case "in progress":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 hover:bg-amber-200";
      case "in review":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 hover:bg-purple-200";
      case "resolved":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 hover:bg-emerald-200";
      case "closed":
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 hover:bg-slate-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Badge className={`font-medium border-0 ${getStatusColor(status)} transition-colors`}>
      {status}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const getPriorityColor = (p: string) => {
    switch (p.toLowerCase()) {
      case "low":
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
      case "medium":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "high":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300";
      case "critical":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Badge variant="outline" className={`font-medium border-0 ${getPriorityColor(priority)} transition-colors`}>
      {priority}
    </Badge>
  );
}

import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, HelpCircle, Clock } from 'lucide-react';
import type { AnalysisStatus } from '@/types/diligence';

interface StatusBadgeProps {
  status: AnalysisStatus;
  className?: string;
}

const statusConfig = {
  pass: {
    label: 'Pass',
    icon: CheckCircle2,
    className: 'status-badge-pass',
  },
  risk: {
    label: 'Risk',
    icon: AlertCircle,
    className: 'status-badge-risk',
  },
  unclear: {
    label: 'Unclear',
    icon: HelpCircle,
    className: 'status-badge-unclear',
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    className: 'bg-muted text-muted-foreground border-muted',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border',
        config.className,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}

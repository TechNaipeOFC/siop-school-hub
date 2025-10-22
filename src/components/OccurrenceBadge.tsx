import { Badge } from '@/components/ui/badge';
import { OccurrenceType, OccurrenceSeverity } from '@/types/occurrence';

interface OccurrenceBadgeProps {
  type?: OccurrenceType;
  severity?: OccurrenceSeverity;
}

export const OccurrenceBadge = ({ type, severity }: OccurrenceBadgeProps) => {
  if (type) {
    const typeConfig = {
      comportamento: { label: 'Comportamento', variant: 'warning' as const },
      pedagogico: { label: 'Pedagógico', variant: 'info' as const },
      indisciplina: { label: 'Indisciplina', variant: 'destructive' as const },
      elogio: { label: 'Elogio', variant: 'success' as const }
    };

    const config = typeConfig[type];
    return (
      <Badge variant={config.variant} className="font-medium">
        {config.label}
      </Badge>
    );
  }

  if (severity) {
    const severityConfig = {
      baixa: { label: 'Baixa', variant: 'success' as const },
      media: { label: 'Média', variant: 'warning' as const },
      alta: { label: 'Alta', variant: 'destructive' as const },
      critica: { label: 'Crítica', variant: 'destructive' as const }
    };

    const config = severityConfig[severity];
    return (
      <Badge variant={config.variant} className="font-medium">
        {config.label}
      </Badge>
    );
  }

  return null;
};

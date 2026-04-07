import { Field, FieldLabel } from '@/components/ui/field';
import { Progress } from '@/components/ui/progress';
import { REASON_COLORS } from '@/lib/utils/get-color-map';
import { REASON_LABELS } from '@/lib/utils/get-reason-labels';
import { ReportedCommentDetailInput } from '@repo/schemas';

interface Props {
  reporters: ReportedCommentDetailInput['reporters'];
}

export default function ReporterReasonBreakdown({ reporters }: Props) {
  const total = reporters.length;

  const reasonCounts = reporters.reduce(
    (acc, r) => {
      acc[r.reason] = (acc[r.reason] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  if (total === 0) return null;

  return (
    <div className='flex flex-col gap-4 w-full'>
      {Object.entries(reasonCounts).map(([reason, count]) => (
        <Field key={reason} className='w-full'>
          <FieldLabel className='flex items-center justify-between w-full'>
            <div className='flex items-center  gap-2'>
              <div
                className='size-4 rounded-sm'
                style={{ backgroundColor: REASON_COLORS[reason] }}
              ></div>
              <span>{REASON_LABELS[reason] ?? reason}</span>
            </div>
            <span>{Math.round((count / total) * 100)}%</span>
          </FieldLabel>
          <Progress
            value={(count / total) * 100}
            style={
              {
                '--indicator-color': REASON_COLORS[reason],
              } as React.CSSProperties
            }
          />
        </Field>
      ))}
    </div>
  );
}

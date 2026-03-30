import { ReportedCommentsDialogProvider } from '@/contexts/reported-comments-dialog-context';
import ReportedCommentsDialog from './reported-comments-dialog';

export default function ReportedCommentsClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReportedCommentsDialogProvider>
      {children}
      <ReportedCommentsDialog />
    </ReportedCommentsDialogProvider>
  );
}

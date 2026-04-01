import { ReportedCommentsDialogProvider } from '@/contexts/reported-comments-dialog-context';
import ReportedCommentsDialog from './reported-comments-dialog';
import DeleteReportedCommentDialog from './delete-reported-comment-dialog';

export default function ReportedCommentsClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReportedCommentsDialogProvider>
      {children}
      <ReportedCommentsDialog />
      <DeleteReportedCommentDialog />
    </ReportedCommentsDialogProvider>
  );
}

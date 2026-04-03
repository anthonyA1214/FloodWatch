import { ReportedCommentsDialogProvider } from '@/contexts/reported-comments-dialog-context';
import ViewReportedCommentDialog from './view-reported-comment-dialog';
import DeleteReportedCommentDialog from './delete-reported-comment-dialog';

export default function ReportedCommentsClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReportedCommentsDialogProvider>
      {children}
      <ViewReportedCommentDialog />
      <DeleteReportedCommentDialog />
    </ReportedCommentsDialogProvider>
  );
}

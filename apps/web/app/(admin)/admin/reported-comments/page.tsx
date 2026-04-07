import ReportedCommentsClient from '@/components/admin/reported-comments/reported-comments-client';
import ReportedCommentsView from '@/components/admin/reported-comments/reported-comments-view';

export default function ReportedComments() {
  return (
    <ReportedCommentsClient>
      <ReportedCommentsView />
    </ReportedCommentsClient>
  );
}

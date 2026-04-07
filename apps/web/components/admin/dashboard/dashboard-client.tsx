import ReportDialogProvider from '@/contexts/report-dialog-context';
import ViewReportDialog from '../reports/view-report-dialog';

export default function DashboardClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReportDialogProvider>
      {children}
      <ViewReportDialog />
    </ReportDialogProvider>
  );
}

import DashboardClient from '@/components/admin/dashboard/dashboard-client';
import DashboardView from '@/components/admin/dashboard/dashboard-view';

export default function DashboardPage() {
  return (
    <DashboardClient>
      <DashboardView />
    </DashboardClient>
  );
}

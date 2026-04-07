import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import SideNav from '@/components/admin/side-nav';
import { SidebarProvider } from '@/components/ui/sidebar';
import { toast } from 'sonner';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function isMobile(userAgent: string): boolean {
  return /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    userAgent,
  );
}

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') ?? '';

  if (isMobile(userAgent)) {
    redirect('/');
  }

  return (
    <SidebarProvider>
      <SideNav />
      <main className='flex py-4 pe-4 w-full h-screen'>{children}</main>
    </SidebarProvider>
  );
}

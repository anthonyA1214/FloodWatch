import Footer from '@/components/landing/footer';
import TopNav from '@/components/landing/top-nav';

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className='overflow-x-hidden w-full'>
      <TopNav />
      <main className='overflow-x-hidden'>{children}</main>
      <Footer />
    </div>
  );
}

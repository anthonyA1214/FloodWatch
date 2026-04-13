'use client';

import Image from 'next/image';
import Link from 'next/link';
import TopNavShadow from '@/components/shared/top-nav-shadow';
import CollapsibleMenu from '@/components/landing/collapsible-menu';
import { useMe } from '@/hooks/use-me';

const navItems = [
  { label: 'FEATURES', url: '#features' },
  { label: 'SAFETY GUIDES', url: '#safety-guides' },
  { label: 'LATEST NEWS', url: '#latest-news' },
  { label: 'ABOUT US', url: '#about-us' },
];

export default function TopNav() {
  const { me } = useMe();

  const isLoggedIn = !!me;

  return (
    <>
      <header
        className='flex w-full bg-[#0066CC]/95 backdrop-blur-md fixed h-16 top-0 z-50 transition-shadow duration-200'
        id='top-nav'
      >
        <nav className='flex justify-between py-4 max-w-7xl w-full mx-auto px-4'>
          <div className='flex items-center gap-4 lg:gap-10'>
            <Link href='/' className='flex items-center gap-x-2'>
              <Image
                src='/logo-white.svg'
                alt='FloodWatch Logo'
                width={32}
                height={32}
              />
              <h1 className='text-white font-bold md:text-xl'>FloodWatch</h1>
            </Link>
          </div>

          <div className='flex items-center gap-10'>
            {/* Desktop nav links */}
            <div className='hidden lg:flex items-center gap-8'>
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.url}
                  className='font-poppins text-sm font-semibold text-white hover:text-white/80 transition-colors'
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Desktop auth buttons — hidden when logged in */}
            {!isLoggedIn && (
              <div className='hidden lg:flex items-center gap-3'>
                <Link
                  href='/auth/login'
                  className='text-sm font-semibold text-white border border-white/40 hover:border-white hover:bg-white/10 rounded-full px-5 py-1.5 transition-all duration-200'
                >
                  Log In
                </Link>
                <Link
                  href='/auth/sign-up'
                  className='text-sm font-semibold text-[#0066CC] bg-white hover:bg-white/90 rounded-full px-5 py-1.5 transition-all duration-200 shadow-sm'
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu */}
            <div className='lg:hidden flex items-center'>
              <CollapsibleMenu isLoggedIn={isLoggedIn} />
            </div>
          </div>
        </nav>
      </header>
      <TopNavShadow />
    </>
  );
}

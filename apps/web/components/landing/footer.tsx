'use client';

import Image from 'next/image';
import { Separator } from '@radix-ui/react-separator';
import { FacebookIcon, GitHubIcon } from '@/components/shared/icons';
import Link from 'next/link';
import PrivacyPolicyDialog from './privacy-policy-dialog';
import TermsOfServicesDialog from './terms-of-services-dialog';
import { IconPointFilled } from '@tabler/icons-react';

const quickLinks = [
  { label: 'Home', href: '#' },
  { label: 'Features', href: '#features' },
  { label: 'Safety Guides', href: '#safety-guides' },
  { label: 'Latest News', href: '#latest-news' },
  { label: 'About Us', href: '#about-us' },
];

const resourcesLinks = [
  {
    label: 'Emergency Hotlines',
    href: 'https://caloocancity.gov.ph/news/caloocan-emergency-hotline-888-along25664/',
  },
  { label: 'Flood Alerts', href: '#' },
  { label: 'Evacuation Centers', href: '#' },
  { label: 'Preparation Checklist', href: '#' },
  { label: 'Weather Updates', href: '#' },
];

const contactUsLinks = [
  { label: '0969-512-6532' },
  { label: 'University of Caloocan City, Congressional Road' },
];

export default function Footer() {
  return (
    <footer className='relative bg-[#2F327D] mt-auto rounded-t-3xl sm:rounded-t-[3rem] overflow-hidden'>
      {/* Background bleed fix */}
      <div className='absolute top-0 left-0 h-16 sm:h-20 w-full bg-white -z-10'></div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-16 md:pt-20 pb-8 sm:pb-10'>
        {/* Main footer content */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 md:gap-12 lg:gap-16 mb-8 sm:mb-12 md:mb-16'>
          {/* Logo, taglines and social */}
          <div className='flex flex-col gap-4 sm:gap-6 sm:col-span-2'>
            <div className='flex items-center gap-2 sm:gap-3'>
              <Image
                src='/logo-white.svg'
                alt='FloodWatch Logo'
                width={40}
                height={40}
                className='w-10 h-10 sm:w-12 sm:h-12'
                priority
              />
              <h1 className='font-poppins font-bold text-xl sm:text-2xl md:text-3xl text-white tracking-tight'>
                FloodWatch
              </h1>
            </div>

            <p className='text-xs sm:text-sm text-white/80 leading-relaxed max-w-xs'>
              Partner with us. Help FloodWatch protect communities everywhere.
            </p>

            <div className='flex items-center gap-3 sm:gap-4'>
              <a
                href='https://www.facebook.com/profile.php?id=61580210802670'
                target='_blank'
                rel='noopener noreferrer'
                className='w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl sm:rounded-2xl text-white transition-all hover:-translate-y-1'
              >
                <FacebookIcon />
              </a>

              <a
                href='https://github.com/anthonyA1214/floodwatch'
                target='_blank'
                rel='noopener noreferrer'
                className='w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl sm:rounded-2xl text-white transition-all hover:-translate-y-1'
              >
                <GitHubIcon />
              </a>
            </div>
          </div>

          {/* Links Grid - responsive columns */}
          <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-8 col-span-1 sm:col-span-2 lg:col-span-3'>
            {/* Quick Links */}
            <div className='flex flex-col gap-4 sm:gap-6'>
              <h3 className='font-poppins text-white font-bold text-base sm:text-lg'>
                Quick Links
              </h3>
              <ul className='flex flex-col gap-2 sm:gap-4'>
                {quickLinks.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.href}
                      className='text-xs sm:text-sm text-white/70 hover:text-white hover:translate-x-1 sm:hover:translate-x-2 transition duration-300 ease-in-out inline-block'
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className='flex flex-col gap-4 sm:gap-6'>
              <h3 className='font-poppins text-white font-bold text-base sm:text-lg'>
                Resources
              </h3>
              <ul className='flex flex-col gap-2 sm:gap-4'>
                {resourcesLinks.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className='text-xs sm:text-sm text-white/70 hover:text-white hover:translate-x-1 sm:hover:translate-x-2 transition duration-300 ease-in-out inline-block'
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Us */}
            <div className='flex flex-col gap-4 sm:gap-6 col-span-2 sm:col-span-1'>
              <h3 className='font-poppins text-white font-bold text-base sm:text-lg'>
                Contact Us
              </h3>
              <ul className='flex flex-col gap-2 sm:gap-4'>
                {contactUsLinks.map((link, i) => (
                  <li key={i}>
                    <p className='text-xs sm:text-sm text-white/70 leading-relaxed'>
                      {link.label}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Separator */}
        <Separator className='my-8 sm:my-10 md:my-12 lg:my-16 bg-white/10 h-px' />

        {/* Footer Bottom */}
        <div className='flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 text-xs sm:text-sm text-white/60 font-medium'>
          <span className='text-center sm:text-left'>
            &copy; 2026 AidLink Tech. All rights reserved.
          </span>
          <div className='flex items-center gap-2 sm:gap-4 bg-white/5 py-2 px-3 sm:px-4 rounded-full border border-white/10 flex-wrap justify-center sm:justify-end'>
            <PrivacyPolicyDialog />
            <IconPointFilled className='size-[0.35em] sm:size-[0.5em] text-[#0066CC] shrink-0' />
            <TermsOfServicesDialog />
          </div>
        </div>
      </div>
    </footer>
  );
}

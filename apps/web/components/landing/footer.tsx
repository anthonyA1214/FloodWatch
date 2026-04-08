'use client';

import Image from 'next/image';
import { Separator } from '@radix-ui/react-separator';
import { FacebookIcon, GitHubIcon } from '@/components/shared/icons';
import Link from 'next/link';
import { useState } from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { TermsContent } from './terms-of-services';
import { PrivacyContent } from './privacy-policy';

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
  { label: 'aidlinktechnologies@gmail.com' },
  { label: 'University of Caloocan City, Congressional Road' },
];

// ─── Footer ───────────────────────────────────────────────────────────────────

export default function Footer() {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <>
      {/* ── Modals (shadcn dialog) ── */}
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent
          showCloseButton={false}
          className='bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden p-0 border-0'
        >
          {/* Header */}
          <div className='flex items-center gap-3 bg-[#1A56DB] px-6 py-4 rounded-t-2xl shrink-0'>
            {/* Location pin icon */}
            <div className='w-9 h-9 rounded-full border-2 border-white/60 flex items-center justify-center shrink-0'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='w-5 h-5 text-white'
                viewBox='0 0 24 24'
                fill='currentColor'
              >
                <path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z' />
              </svg>
            </div>
            <DialogTitle className='text-white font-semibold text-lg'>
              Terms of Services
            </DialogTitle>
            <DialogClose
              className='ml-auto text-white hover:text-white/70 transition'
              aria-label='Close modal'
            >
              <X className='w-5 h-5' />
            </DialogClose>
          </div>

          {/* Scrollable body */}
          <div className='overflow-y-auto px-8 py-6 text-sm text-gray-700 leading-relaxed flex-1'>
            <TermsContent />
          </div>

          {/* Footer */}
          <div className='px-6 py-4 flex justify-end border-t border-gray-100 shrink-0'>
            <DialogClose asChild>
              <button className='bg-[#1A56DB] hover:bg-[#1648c0] text-white font-medium px-6 py-2 rounded-lg transition'>
                Close
              </button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
        <DialogContent
          showCloseButton={false}
          className='bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden p-0 border-0'
        >
          {/* Header */}
          <div className='flex items-center gap-3 bg-[#1A56DB] px-6 py-4 rounded-t-2xl shrink-0'>
            {/* Location pin icon */}
            <div className='w-9 h-9 rounded-full border-2 border-white/60 flex items-center justify-center shrink-0'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='w-5 h-5 text-white'
                viewBox='0 0 24 24'
                fill='currentColor'
              >
                <path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z' />
              </svg>
            </div>
            <DialogTitle className='text-white font-semibold text-lg'>
              Privacy Policy
            </DialogTitle>
            <DialogClose
              className='ml-auto text-white hover:text-white/70 transition'
              aria-label='Close modal'
            >
              <X className='w-5 h-5' />
            </DialogClose>
          </div>

          {/* Scrollable body */}
          <div className='overflow-y-auto px-8 py-6 text-sm text-gray-700 leading-relaxed flex-1'>
            <PrivacyContent />
          </div>

          {/* Footer */}
          <div className='px-6 py-4 flex justify-end border-t border-gray-100 shrink-0'>
            <DialogClose asChild>
              <button className='bg-[#1A56DB] hover:bg-[#1648c0] text-white font-medium px-6 py-2 rounded-lg transition'>
                Close
              </button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Footer ── */}
      <footer className='relative bg-[#2F327D] mt-auto rounded-t-[2.5rem]'>
        <div className='absolute top-0 left-0 h-16 w-full bg-white -z-10'></div>
        <div className='max-w-7xl mx-auto px-4 py-16'>
          <div className='grid grid-cols-1 md:grid-cols-5 w-full gap-6 sm:gap-8 md:gap-12'>
            {/* Logo, taglines and social */}
            <div className='flex flex-col gap-4 md:col-span-2'>
              <div className='flex items-center gap-2'>
                <Image
                  src='/logo-white.svg'
                  alt='FloodWatch Logo'
                  width={48}
                  height={48}
                />
                <h1 className='font-poppins font-medium text-2xl text-white'>
                  FloodWatch
                </h1>
              </div>

              <span className='text-sm text-white/90'>
                Partner with us. Help FloodWatch protect communities everywhere.
              </span>

              <div className='flex items-center gap-4'>
                <a
                  href='https://www.facebook.com/profile.php?id=61580210802670'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <button className='text-white rounded-2xl text-3xl'>
                    <FacebookIcon />
                  </button>
                </a>

                <a
                  href='https://github.com/anthonyA1214/floodwatch'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <button className='text-white rounded-2xl text-3xl'>
                    <GitHubIcon />
                  </button>
                </a>
              </div>
            </div>

            {/* Links */}
            <div className='grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12 col-span-3'>
              {/* Quick Links */}
              <div className='flex flex-col gap-4'>
                <h3 className='font-poppins text-white font-semibold text-xl'>
                  Quick Links
                </h3>
                <ul className='flex flex-col text-sm text-white/90 gap-4'>
                  {quickLinks.map((link, i) => (
                    <li key={i}>
                      <a
                        href={link.href}
                        className='inline-block text-white/90 hover:text-white transform hover:translate-x-1 transition duration-200'
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div className='flex flex-col gap-4'>
                <h3 className='font-poppins text-white font-semibold text-xl'>
                  Resources
                </h3>
                <ul className='flex flex-col text-sm text-white/90 gap-4'>
                  {resourcesLinks.map((link, i) => (
                    <li key={i}>
                      <Link
                        href={link.href}
                        className='inline-block text-white/90 hover:text-white transform hover:translate-x-1 transition duration-200'
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Us */}
              <div className='flex flex-col gap-4'>
                <h3 className='font-poppins text-white font-semibold text-xl'>
                  Contact Us
                </h3>
                <ul className='flex flex-col text-sm text-white/90 gap-4'>
                  {contactUsLinks.map((link, i) => (
                    <li key={i}>
                      <p className='inline-block text-white/90 hover:text-white transition duration-200'>
                        {link.label}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <Separator className='my-10 bg-white/30 h-px' />

          {/* Bottom bar */}
          <div className='flex flex-col sm:flex-row justify-between items-center gap-4 text-white'>
            <span>&copy; 2026 AidLink Tech. All rights reserved.</span>

            <div className='flex items-center gap-4 text-sm'>
              <button
                onClick={() => setShowTerms(true)}
                className='text-white/80 hover:text-white transition duration-200 underline-offset-2 hover:underline'
              >
                Terms of Services
              </button>
              <span className='text-white/80'>•</span>
              <button
                onClick={() => setShowPrivacy(true)}
                className='text-white/80 hover:text-white transition duration-200 underline-offset-2 hover:underline'
              >
                Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

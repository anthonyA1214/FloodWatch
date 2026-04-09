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
              {/* github */}
              <a
                href='https://www.facebook.com/profile.php?id=61580210802670'
                target='_blank'
                rel='noopener noreferrer'
              >
                <button className='text-white rounded-2xl text-3xl'>
                  <FacebookIcon />
                </button>
              </a>

              {/* github */}
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
          <div className='grid grid-cols-2  md:grid-cols-3 gap-6 sm:gap-8 md:gap-12 col-span-3'>
            {/* quick links */}
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

            {/* resources */}
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

            {/* contact us */}
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

        <div className='flex sm:justify-between sm:flex-row flex-col gap-4 items-center text-white'>
          <span> &copy; 2026 AidLink Tech. All rights reserved. </span>
          <div className='flex items-center gap-2'>
            <PrivacyPolicyDialog />
            <IconPointFilled className='size-[0.75em]' />
            <TermsOfServicesDialog />
          </div>
        </div>
      </div>
    </footer>
  );
}

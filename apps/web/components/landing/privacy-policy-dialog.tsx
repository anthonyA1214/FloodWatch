'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { useState } from 'react';

export default function PrivacyPolicyDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className='font-poppins cursor-pointer hover:underline'>
          Privacy Policy
        </span>
      </DialogTrigger>
      <DialogContent className='flex flex-col w-full max-w-full sm:max-w-lg max-h-[85vh] p-0 overflow-hidden gap-0 border-0 [&>button]:text-white [&>button]:hover:text-white [&>button]:opacity-70 [&>button]:hover:opacity-100'>
        {/* ── Blue Header ── */}
        <DialogHeader className='flex flex-row items-center gap-4 bg-[#0066CC] rounded-b-2xl p-4 shrink-0 text-white'>
          {/* Text */}
          <DialogTitle className='flex items-center gap-3 sm:gap-4 font-poppins text-sm sm:text-base font-medium'>
            PRIVACY POLICY
          </DialogTitle>
        </DialogHeader>

        {/* ── Content Area ── */}
        <div className='flex-1 min-h-0 overflow-y-auto'>
          <div className='flex flex-col p-4 gap-4'>
            <div>
              <h3 className='font-bold text-gray-900 mb-2'>1. Introduction</h3>
              <p>
                FloodWatch is committed to protecting the privacy and personal
                data of its users. This Privacy Policy outlines how information
                is collected, used, stored, and protected when using the
                platform.
              </p>
              <p className='mt-2'>
                By accessing or using FloodWatch, you agree to the terms of this
                Policy.
              </p>
            </div>

            <div>
              <h3 className='font-bold text-gray-900 mb-2'>
                2. Information We Collect
              </h3>
              <p className='mb-2'>FloodWatch may collect the following:</p>

              <p className='font-semibold text-gray-800 mb-1'>
                a. Personal Information
              </p>
              <ul className='list-disc list-inside space-y-1 pl-2 mb-3'>
                <li>Name or username</li>
                <li>Email address</li>
                <li>Login credentials</li>
              </ul>

              <p className='font-semibold text-gray-800 mb-1'>
                b. User-Generated Content
              </p>
              <ul className='list-disc list-inside space-y-1 pl-2 mb-3'>
                <li>Flood reports submitted by users</li>
                <li>Comments, reactions, and posts</li>
                <li>Profile information and preferences</li>
              </ul>

              <p className='font-semibold text-gray-800 mb-1'>
                c. Location Data
              </p>
              <ul className='list-disc list-inside space-y-1 pl-2 mb-3'>
                <li>
                  Geolocation data associated with reports (which may be
                  publicly visible when attached to user-generated reports)
                </li>
                <li>Map-based inputs identifying affected areas</li>
              </ul>

              <p className='font-semibold text-gray-800 mb-1'>
                d. Technical Data
              </p>
              <ul className='list-disc list-inside space-y-1 pl-2'>
                <li>Device and browser information</li>
                <li>IP address</li>
                <li>System usage activity</li>
              </ul>
            </div>

            <div>
              <h3 className='font-bold text-gray-900 mb-2'>
                3. Use of Information
              </h3>
              <p className='mb-2'>Collected data is used to:</p>
              <ul className='list-disc list-inside space-y-1 pl-2'>
                <li>Provide and maintain platform functionality</li>
                <li>Process and verify flood reports</li>
                <li>Display data on the interactive map</li>
                <li>Improve system performance and user experience</li>
                <li>Communicate updates and announcements</li>
                <li>Ensure platform security and prevent misuse</li>
              </ul>
            </div>

            <div>
              <h3 className='font-bold text-gray-900 mb-2'>
                4. Data Verification and Moderation
              </h3>
              <p>
                User-submitted reports are subject to administrative review
                prior to classification as Verified or Unverified. FloodWatch
                reserves the right to edit, categorize, or remove submitted
                content to ensure accuracy, safety, and reliability. Data may be
                cross-referenced with official sources when necessary.
              </p>
            </div>

            <div>
              <h3 className='font-bold text-gray-900 mb-2'>
                5. Data Sharing and Disclosure
              </h3>
              <p className='mb-2'>
                FloodWatch does not sell personal data. Information may be
                shared with:
              </p>
              <ul className='list-disc list-inside space-y-1 pl-2'>
                <li>Government agencies or disaster response organizations</li>
                <li>
                  Authorized service providers (e.g., hosting and mapping
                  services)
                </li>
                <li>Authorities, when required by law</li>
              </ul>
              <p className='mt-2'>
                Public content, including reports and comments, may be visible
                within the platform.
              </p>
            </div>

            <div>
              <h3 className='font-bold text-gray-900 mb-2'>
                6. Data Storage and Security
              </h3>
              <p className='mb-2'>
                FloodWatch implements appropriate administrative, technical, and
                physical safeguards, including:
              </p>
              <ul className='list-disc list-inside space-y-1 pl-2'>
                <li>Secure servers and databases</li>
                <li>Access controls and authentication</li>
                <li>Data validation and monitoring</li>
              </ul>
              <p className='mt-2'>
                While reasonable measures are in place, no system can guarantee
                absolute security.
              </p>
            </div>

            <div>
              <h3 className='font-bold text-gray-900 mb-2'>
                7. Data Retention
              </h3>
              <p>
                Personal data is retained only as necessary for operational,
                legal, and reporting purposes. User-generated content may be
                retained for historical or analytical use. Users may request
                deletion of their account and associated data, subject to
                verification.
              </p>
            </div>

            <div>
              <h3 className='font-bold text-gray-900 mb-2'>8. User Rights</h3>
              <p className='mb-2'>Users may request:</p>
              <ul className='list-disc list-inside space-y-1 pl-2'>
                <li>Access to personal data</li>
                <li>Correction of inaccurate information</li>
                <li>Deletion of personal data</li>
                <li>Withdrawal of consent, where applicable</li>
              </ul>
              <p className='mt-2'>
                Requests are subject to identity verification and applicable
                laws.
              </p>
            </div>

            <div>
              <h3 className='font-bold text-gray-900 mb-2'>
                9. Cookies and Tracking
              </h3>
              <p className='mb-2'>
                FloodWatch may use cookies or similar technologies to:
              </p>
              <ul className='list-disc list-inside space-y-1 pl-2'>
                <li>Maintain user sessions</li>
                <li>Enhance performance and usability</li>
                <li>Analyze platform usage</li>
              </ul>
              <p className='mt-2'>
                Disabling cookies may affect certain features.
              </p>
            </div>

            <div>
              <h3 className='font-bold text-gray-900 mb-2'>
                10. Third-Party Services
              </h3>
              <p className='mb-2'>
                FloodWatch utilizes third-party services. Use of these services
                is also governed by the privacy policies of the respective
                providers:
              </p>
              <ul className='list-disc list-inside space-y-1 pl-2'>
                <li>Mapping platforms (e.g., OpenFreeMap, MapLibre)</li>
                <li>Cloud hosting and storage providers</li>
                <li>Media storage services</li>
              </ul>
              <p className='mt-2'>
                These providers may collect limited technical data as part of
                their operations.
              </p>
            </div>

            <div>
              <h3 className='font-bold text-gray-900 mb-2'>
                11. Children&apos;s Privacy
              </h3>
              <p>
                FloodWatch is not intended for individuals under the age of 13.
                Personal data from children is not knowingly collected without
                parental consent.
              </p>
            </div>

            <div>
              <h3 className='font-bold text-gray-900 mb-2'>
                12. Changes to This Policy
              </h3>
              <p>
                This Privacy Policy may be updated at any time. Continued use of
                the platform constitutes acceptance of any revisions.
              </p>
            </div>

            <div>
              <h3 className='font-bold text-gray-900 mb-2'>
                13. Contact Information
              </h3>
              <p>For inquiries or data-related requests:</p>
              <ul className='list-none mt-1 space-y-1 pl-2'>
                <li>Email: aidlinktechnologies@gmail.com</li>
                <li>Phone: 0969-512-6532</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

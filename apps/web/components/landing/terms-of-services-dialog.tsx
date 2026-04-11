'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { useState } from 'react';

export default function TermsOfServicesDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className='font-poppins cursor-pointer hover:underline'>
          Terms of Services
        </span>
      </DialogTrigger>
      <DialogContent className='flex flex-col w-full max-w-full sm:max-w-lg max-h-[85vh] p-0 overflow-hidden gap-0 border-0 [&>button]:text-white [&>button]:hover:text-white [&>button]:opacity-70 [&>button]:hover:opacity-100'>
        {/* ── Blue Header ── */}
        <DialogHeader className='flex flex-row items-center gap-4 bg-[#0066CC] rounded-b-2xl p-4 shrink-0 text-white'>
          {/* Text */}
          <DialogTitle className='flex items-center gap-3 sm:gap-4 font-poppins text-sm sm:text-base font-medium'>
            TERMS OF SERVICES
          </DialogTitle>
        </DialogHeader>

        {/* ── Content Area ── */}
        <div className='flex-1 min-h-0 overflow-y-auto'>
          <div className='flex flex-col p-4 gap-4'>
            <div>
              <h3 className='font-bold text-gray-900 mb-2'>
                1. Acceptance of Terms
              </h3>
              <p>
                By accessing or using FloodWatch, you agree to be bound by these
                Terms of Service. If you do not agree, you must discontinue use
                of the platform.
              </p>
            </div>

            <div>
              <h3 className='font-bold text-gray-900 mb-2'>
                2. Description of Service
              </h3>
              <p className='mb-2'>
                FloodWatch is a web-based platform that provides:
              </p>
              <ul className='list-disc list-inside space-y-1 pl-2'>
                <li>
                  Verified flood reports and official announcements from partner
                  agencies
                </li>
                <li>Community-submitted reports subject to verification</li>
                <li>An interactive map of flood-affected areas</li>
                <li>
                  Informational content, including infographics and safety
                  guidelines
                </li>
              </ul>
              <p className='mt-2'>
                The platform is designed to enhance disaster awareness and
                public safety. FloodWatch is not an emergency response service.
                In life-threatening situations, users must contact local
                emergency authorities directly.
              </p>
            </div>

            <div>
              <h3 className='font-bold text-gray-900 mb-2'>
                3. User Responsibilities
              </h3>
              <p className='mb-2'>
                Users represent that they are legally permitted to use the
                platform under the laws of their jurisdiction.
              </p>
              <p className='mb-2'>Users agree to:</p>
              <ul className='list-disc list-inside space-y-1 pl-2'>
                <li>
                  Provide accurate and truthful information when submitting
                  reports
                </li>
                <li>
                  Refrain from submitting false, misleading, or harmful content
                </li>
                <li>
                  Respect the rights and safety of other users and communities
                </li>
                <li>
                  Not use the platform for any unlawful or unauthorized purpose
                </li>
                <li>
                  Not attempt to disrupt, hack, or compromise the
                  platform&apos;s integrity
                </li>
              </ul>
            </div>

            <div>
              <h3 className='font-bold text-gray-900 mb-2'>
                4. Content Submission and Moderation
              </h3>
              <p>
                User-submitted content is subject to review and moderation.
                FloodWatch reserves the right to verify, edit, reclassify, or
                remove any submitted content that is deemed inaccurate, harmful,
                or in violation of these Terms. Repeated violations may result
                in account suspension or termination.
              </p>
            </div>

            <div>
              <h3 className='font-bold text-gray-900 mb-2'>
                5. Intellectual Property
              </h3>
              <p>
                All platform content, design, and code are the property of
                AidLink Tech unless otherwise stated. Users retain ownership of
                their submitted content but grant FloodWatch a non-exclusive
                license to display, store, and use it for platform purposes.
              </p>
            </div>

            <div>
              <h3 className='font-bold text-gray-900 mb-2'>
                6. Disclaimer of Warranties
              </h3>
              <p>
                FloodWatch is provided &ldquo;as is&rdquo; without warranties of
                any kind. The platform does not guarantee the accuracy,
                completeness, or timeliness of flood data. Users rely on
                platform information at their own risk and should always follow
                official government advisories.
              </p>
            </div>

            <div>
              <h3 className='font-bold text-gray-900 mb-2'>
                7. Limitation of Liability
              </h3>
              <p>
                AidLink Tech shall not be held liable for any direct, indirect,
                incidental, or consequential damages arising from the use or
                inability to use FloodWatch, including decisions made based on
                platform data.
              </p>
            </div>

            <div>
              <h3 className='font-bold text-gray-900 mb-2'>8. Termination</h3>
              <p>
                FloodWatch reserves the right to suspend or terminate access to
                any user who violates these Terms, without prior notice. Users
                may also deactivate their accounts at any time by contacting the
                platform administrators.
              </p>
            </div>

            <div>
              <h3 className='font-bold text-gray-900 mb-2'>
                9. Changes to Terms
              </h3>
              <p>
                These Terms of Service may be updated at any time. Continued use
                of the platform after changes are posted constitutes acceptance
                of the revised Terms.
              </p>
            </div>

            <div>
              <h3 className='font-bold text-gray-900 mb-2'>
                10. Contact Information
              </h3>
              <p>For inquiries regarding these Terms:</p>
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

'use client';

import React from 'react';
import Image from 'next/image';
import {
  IconShieldCheck,
  IconCodeCircle,
  IconUsersGroup,
  IconDatabase,
} from '@tabler/icons-react';

const coreValues = [
  {
    icon: <IconShieldCheck className='w-6 h-6 text-[#0066CC]' />,
    title: 'Community Safety',
    description:
      'Prioritizing the well-being and preparedness of Caloocan City residents through accurate, real-time flood reports.',
  },
  {
    icon: <IconCodeCircle className='w-6 h-6 text-[#0066CC]' />,
    title: 'Software Engineering',
    description:
      'Developing robust web architectures to process and deliver critical disaster information with low latency.',
  },
  {
    icon: <IconUsersGroup className='w-6 h-6 text-[#0066CC]' />,
    title: 'Student-Led Initiative',
    description:
      'Driven by the passion and technical expertise of future computer scientists from the University of Caloocan City.',
  },
  {
    icon: <IconDatabase className='w-6 h-6 text-[#0066CC]' />,
    title: 'Data Aggregation',
    description:
      'Utilizing modern data processing techniques to keep flood-related information transparent and accessible.',
  },
];

export default function AboutUsSection() {
  return (
    <section
      className='bg-white py-16 sm:py-24 md:py-32 relative overflow-hidden'
      id='about-us'
    >
      {/* Decorative blobs — pointer-events none, overflow hidden on section prevents bleed */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none z-0'>
        <div className='absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-50/50 blur-3xl' />
        <div className='absolute -bottom-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-slate-50 blur-3xl' />
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        {/* Split layout */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-24 items-center mb-16 sm:mb-24'>
          {/* Left: Narrative */}
          <div className='space-y-6 sm:space-y-8'>
            <div>
              <h2 className='text-[#2F327D] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-3 sm:mb-4 flex items-center gap-2'>
                <span className='w-8 h-px bg-[#0066CC]' /> Our Mission
              </h2>
              <h3 className='text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight'>
                Protecting <span className='text-[#0066CC]'>Caloocan</span>{' '}
                <br className='hidden md:block' />
                Through Code.
              </h3>
            </div>

            <p className='text-slate-500 leading-relaxed text-base sm:text-lg'>
              FloodWatch was born out of a necessity to provide smarter, faster,
              and highly localized disaster information tools exclusively for
              Caloocan City. We believe that access to real-time updates is a
              fundamental right for our local flood-prone zones.
            </p>

            <p className='text-slate-500 leading-relaxed text-base sm:text-lg'>
              Developed as a dedicated Software Engineering Project by Bachelor
              of Science in Computer Science students, our platform leverages a
              modern full-stack infrastructure to aggregate, process, and
              deliver critical alerts directly to the residents who need them
              most.
            </p>

            <div className='pt-2 sm:pt-4'>
              <div className='inline-block border-l-4 border-[#0066CC] pl-5 sm:pl-6 py-2'>
                <p className='text-slate-900 font-bold text-sm sm:text-base'>
                  Powered By
                </p>
                <p className='text-slate-500 text-xs sm:text-sm'>
                  Bachelor of Science in Computer Science
                  <br />
                  University of Caloocan City
                </p>
              </div>
            </div>
          </div>

          {/* Right: Image */}
          <div className='relative'>
            <div
              className='relative w-full rounded-4xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-100 border border-slate-100'
              style={{ aspectRatio: '1/1' }}
            >
              <Image
                src='/images/dreamteam.jpg'
                alt='FloodWatch Software Engineering Project Team'
                fill
                className='object-cover hover:scale-105 transition-all duration-700'
                sizes='(max-width: 1024px) 100vw, 50vw'
              />
              <div className='absolute inset-0 bg-[#0066CC]/20 mix-blend-color' />
              <div className='absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent opacity-90' />
              <div className='absolute bottom-5 sm:bottom-8 left-5 sm:left-8 right-5 sm:right-8'>
                <p className='text-white font-bold text-lg sm:text-2xl drop-shadow-md mb-1'>
                  Flood Watch Team
                </p>
                <p className='text-white/90 text-sm sm:text-xs font-light tracking-wide drop-shadow-sm uppercase'>
                  University of Caloocan City | Software Engineering Project
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8'>
          {coreValues.map((value, index) => (
            <div
              key={index}
              className='bg-slate-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-slate-100'
            >
              <div className='w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm mb-4 sm:mb-6 border border-slate-100'>
                {value.icon}
              </div>
              <h4 className='text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3'>
                {value.title}
              </h4>
              <p className='text-slate-500 text-sm leading-relaxed'>
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

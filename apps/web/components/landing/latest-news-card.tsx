'use client';

import Image from 'next/image';
import NoPhotoEmpty from '../shared/no-photo-empty';
import { IconArrowUpRight, IconCalendarEvent } from '@tabler/icons-react';

export interface NewsCardProps {
  title: string;
  description: string;
  image?: string | null;
  publishedAt: Date;
  url: string;
  variant: 'featured' | 'compact'; // Removed the '?' to be explicit
}

export default function LatestNewsCard({
  title,
  description,
  image,
  publishedAt,
  url,
  variant,
}: NewsCardProps) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(publishedAt);

  // --- FEATURED CARD LAYOUT ---
  if (variant === 'featured') {
    return (
      <a
        href={url}
        target='_blank'
        rel='noopener noreferrer'
        className='group h-full block'
      >
        <div className='bg-white h-full flex flex-col lg:flex-row rounded-4xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 lg:min-h-[450px]'>
          <div className='relative lg:w-7/12 h-[300px] lg:h-auto overflow-hidden'>
            {image ? (
              <Image
                src={image}
                alt={title}
                fill
                priority
                className='object-cover group-hover:scale-105 transition-transform duration-700'
                sizes='(max-width: 1024px) 100vw, 60vw'
              />
            ) : (
              <NoPhotoEmpty />
            )}
            <div className='absolute top-6 left-6 z-10'>
              <span className='bg-[#0066CC] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg'>
                LATEST UPDATE
              </span>
            </div>
          </div>

          <div className='flex flex-1 flex-col justify-center gap-6 p-8 md:p-12'>
            <div className='flex items-center gap-2 text-slate-400 text-sm'>
              <IconCalendarEvent className='w-4 h-4' /> {formattedDate}
            </div>
            <h3 className='font-poppins text-2xl lg:text-3xl font-bold leading-tight group-hover:text-[#0066CC] transition-colors'>
              {title}
            </h3>
            <p className='text-slate-500 leading-relaxed line-clamp-4'>
              {description}
            </p>
            <div className='pt-4'>
              <div className='inline-block bg-[#2F327D] text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-[#1a1c4b] transition-colors shadow-lg shadow-blue-900/10'>
                Read Full Report
              </div>
            </div>
          </div>
        </div>
      </a>
    );
  }

  // --- COMPACT CARD LAYOUT ---
  return (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      className='group h-full block'
    >
      <div className='bg-white h-full flex flex-col sm:flex-row rounded-3xl shadow-sm border border-slate-100 p-4 sm:p-5 gap-6 hover:border-transparent hover:shadow-xl hover:-translate-y-1 transition-all duration-300'>
        <div className='relative w-full sm:w-32 md:w-40 h-40 shrink-0 rounded-xl overflow-hidden'>
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className='object-cover group-hover:scale-110 transition-transform duration-500'
              sizes='(max-width: 640px) 100vw, 160px'
            />
          ) : (
            <NoPhotoEmpty />
          )}
        </div>

        <div className='flex flex-1 flex-col justify-between py-1'>
          <div className='space-y-3'>
            <div className='flex justify-between items-center'>
              <span className='text-[#0066CC] text-[10px] font-bold uppercase tracking-[0.2em]'>
                REPORT
              </span>
              <span className='text-[10px] text-slate-400 font-medium'>
                {formattedDate}
              </span>
            </div>
            <h3 className='font-bold text-slate-900 text-lg leading-snug group-hover:text-[#0066CC] transition-colors line-clamp-2'>
              {title}
            </h3>
            <p className='text-xs sm:text-sm text-slate-500 line-clamp-2'>
              {description}
            </p>
          </div>
          <div className='mt-4 sm:mt-0'>
            <div className='text-[#2F327D] font-bold text-xs flex items-center gap-1 group-hover:gap-2 transition-all uppercase tracking-wider'>
              Details <IconArrowUpRight className='w-3.5 h-3.5' />
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

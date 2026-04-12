'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  IconAlertTriangle,
  IconBriefcase,
  IconClipboardText,
  IconClock,
  IconHome,
  IconRadio,
  IconRipple,
  IconRun,
  IconSparkles,
  IconSquareCheck,
  IconSquarePlus,
  IconWaterpolo,
  IconArrowRight,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';

const safetyData = [
  {
    key: 'before',
    label: 'Phase 01',
    title: 'Before the Flood',
    description:
      'Preparation is the most effective way to reduce the impact of flooding on your home and family.',
    icon: IconSquarePlus,
    // Changed to just text color suitable for the dark overlay
    accent: 'text-[#66B2FF]',
    image: '/images/beforeflood.png',
    protocolLink: 'https://www.ready.gov/floods',
    cards: [
      {
        icon: IconClipboardText,
        title: 'Emergency Plan',
        desc: 'Develop a family contact list and evacuation route. Practice regularly.',
      },
      {
        icon: IconBriefcase,
        title: 'Survival Kit',
        desc: 'Assemble 72 hours of food, water, and first-aid supplies.',
      },
      {
        icon: IconHome,
        title: 'Secure Documents',
        desc: 'Keep IDs and insurance policies in waterproof containers.',
      },
    ],
  },
  {
    key: 'during',
    label: 'Phase 02',
    title: 'During the Flood',
    description:
      'When water levels rise, every second counts. Follow these immediate safety actions.',
    icon: IconAlertTriangle,
    // Changed to just text color suitable for the dark overlay
    accent: 'text-amber-400',
    image: '/images/duringflood.png',
    protocolLink: 'https://www.ready.gov/floods',
    cards: [
      {
        icon: IconRun,
        title: 'Immediate Evacuation',
        desc: 'If authorities order an evacuation, leave immediately. Do not wait.',
      },
      {
        icon: IconWaterpolo,
        title: 'Avoid Water',
        desc: 'Do not walk or drive through moving water. Six inches can knock you down.',
      },
      {
        icon: IconRadio,
        title: 'Live Updates',
        desc: 'Monitor emergency broadcasts for instructions and water levels.',
      },
    ],
  },
  {
    key: 'after',
    label: 'Phase 03',
    title: 'After the Flood',
    description:
      "The danger doesn't end when water recedes. Approach recovery with extreme caution.",
    icon: IconSquareCheck,
    // Changed to just text color suitable for the dark overlay
    accent: 'text-emerald-400',
    image: '/images/afterflood.png',
    protocolLink: 'https://www.ready.gov/floods',
    cards: [
      {
        icon: IconClock,
        title: 'Wait for Clearance',
        desc: 'Do not return home until officials confirm it is safe.',
      },
      {
        icon: IconRipple,
        title: 'Contamination Risk',
        desc: 'Avoid floodwater; it often contains sewage or live electrical wires.',
      },
      {
        icon: IconSparkles,
        title: 'Safe Cleanup',
        desc: 'Disinfect wet items. Wear masks to protect against mold.',
      },
    ],
  },
];

interface SectionRowProps {
  section: (typeof safetyData)[number];
  index: number;
}

function SectionRow({ section, index }: SectionRowProps) {
  const isEven = index % 2 === 0;
  const textFromLeft = isEven;
  const cardsFromLeft = !isEven;

  const rowRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    const image = imageRef.current;
    const cards = cardsRef.current;
    if (!row || !image || !cards) return;

    const applyHidden = (el: HTMLElement, fromLeft: boolean) => {
      el.style.opacity = '0';
      el.style.transform = `translateX(${fromLeft ? '-50px' : '50px'})`;
      el.style.transition = 'none';
    };

    applyHidden(image, textFromLeft);
    applyHidden(cards, cardsFromLeft);

    const observer = new IntersectionObserver(
      ([entry]) => {
        const reveal = (el: HTMLElement, delay: number) => {
          el.style.transition = `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`;
          el.style.opacity = '1';
          el.style.transform = 'translateX(0)';
        };
        if (entry.isIntersecting) {
          reveal(image, 0);
          reveal(cards, 120);
        } else {
          applyHidden(image, textFromLeft);
          applyHidden(cards, cardsFromLeft);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(row);
    return () => observer.disconnect();
  }, [textFromLeft, cardsFromLeft]);

  return (
    <div
      ref={rowRef}
      className={cn(
        'flex flex-col gap-6 sm:gap-8 md:gap-12 items-stretch',
        isEven ? 'md:flex-row' : 'md:flex-row-reverse',
      )}
    >
      {/* Image Card with Overlay Text */}
      <div
        ref={imageRef}
        className='w-full md:w-1/2 relative min-h-[350px] md:min-h-0 rounded-sm overflow-hidden shadow-2xl group flex-1'
      >
        <Image
          src={section.image}
          alt={section.title}
          fill
          className='object-cover group-hover:scale-105 transition-transform duration-700'
          sizes='(max-width: 768px) 100vw, 50vw'
        />

        {/* Dark blueish filter overlay */}
        <div className='absolute inset-0 bg-[#002244]/40 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-75' />

        {/* Dark blue gradient for text readability */}
        <div className='absolute inset-0 bg-linear-to-t from-[#041226]/90 via-[#041226]/50 to-transparent' />

        {/* Content overlay */}
        <div className='absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white'>
          {/* FIXED: Removed box styling, now sleek text for Phase label */}
          <div
            className={cn(
              'flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-3 sm:mb-4',
              section.accent,
            )}
          >
            <section.icon className='w-5 h-5' stroke={2} />
            {section.label}
          </div>

          <h3 className='text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight'>
            {section.title}
          </h3>

          <p className='text-sm sm:text-base text-white/90 mb-6 sm:mb-8 leading-relaxed max-w-md'>
            {section.description}
          </p>

          {/* FIXED: Removed box/border styling, now sleek linked text */}
          <a
            href={section.protocolLink}
            target='_blank'
            rel='noopener noreferrer'
            className='group inline-flex items-center gap-2 text-white font-bold text-sm tracking-wide uppercase hover:text-white/70 transition-colors'
          >
            VIEW FULL PROTOCOL{' '}
            <IconArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
          </a>
        </div>
      </div>

      {/* Cards block */}
      <div
        ref={cardsRef}
        className='w-full md:w-1/2 flex flex-col justify-between gap-4 flex-1'
      >
        {section.cards.map((card, cardIdx) => (
          <div
            key={cardIdx}
            className='group flex items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-sm border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-[#0066CC]/30 hover:shadow-[0_20px_40px_rgba(0,102,204,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex-1'
          >
            <div className='shrink-0 p-2.5 sm:p-3 rounded-sm bg-white shadow-sm text-[#0066CC] group-hover:bg-[#0066CC] group-hover:text-white group-hover:shadow-[0_0_15px_rgba(0,102,204,0.4)] transition-all duration-300'>
              <card.icon className='w-5 h-5 sm:w-6 sm:h-6' />
            </div>
            <div className='space-y-1 min-w-0'>
              <h5 className='font-bold text-slate-900 group-hover:text-[#0066CC] transition-colors uppercase text-xs sm:text-sm tracking-wide'>
                {card.title}
              </h5>
              <p className='text-xs sm:text-sm text-slate-500 leading-relaxed'>
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SafetyGuidesSection() {
  return (
    <section
      className='bg-white py-16 sm:py-20 md:py-24 overflow-hidden'
      id='safety-guides'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='max-w-2xl mb-12 sm:mb-16 md:mb-20'>
          <h2 className='text-[#2F327D] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-3 sm:mb-4'>
            Safety Protocol
          </h2>
          <h3 className='text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 sm:mb-6'>
            Guidelines for <span className='text-[#0066CC]'>Survival.</span>
          </h3>
          <p className='text-base sm:text-lg text-slate-500 leading-relaxed'>
            A comprehensive roadmap designed to protect lives and property
            before, during, and after a flood event.
          </p>
        </div>

        <div className='flex flex-col gap-16 sm:gap-24 md:gap-32'>
          {safetyData.map((section, index) => (
            <SectionRow key={section.key} section={section} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

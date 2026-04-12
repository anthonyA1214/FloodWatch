'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const features = [
  {
    id: 1,
    title: 'Community Posting',
    description:
      'Users can view the newsfeed, create posts, like, comment, and share updates with others. Stay connected when it matters most.',
    imageSrc: '/images/1.svg',
  },
  {
    id: 2,
    title: 'Interactive Map',
    description:
      'Users can see flooded areas based on a selected location using an interactive map. Pinpoint danger zones in real-time.',
    imageSrc: '/images/2.svg',
  },
  {
    id: 3,
    title: 'Safety Guides',
    description:
      'Users can read safety tips and prevention guides that help protect lives during disasters. Knowledge is your first line of defense.',
    imageSrc: '/images/3.svg',
  },
];

export default function SafetyFeaturesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % features.length);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const timer = setInterval(handleNext, 3000); // 3 seconds
    return () => clearInterval(timer);
  }, [handleNext]);

  const currentFeature = features[currentIndex];

  return (
    <section
      id='features'
      className='relative z-0 bg-white pt-24 md:pt-32 pb-8 md:pb-12 overflow-hidden flex flex-col justify-center'
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes slideInFromRight {
              0% { transform: translateX(60%); opacity: 0; }
              100% { transform: translateX(0); opacity: 1; }
            }
            .animate-slide-in-right {
              animation: slideInFromRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            @keyframes fadeIn {
              0% { opacity: 0; transform: translateY(10px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
              animation: fadeIn 0.4s ease-out forwards;
            }
          `,
        }}
      />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full flex flex-col gap-6 md:gap-8'>
        {/* Heading */}
        <div className='text-center'>
          <h2 className='font-poppins text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900'>
            System <span className='text-[#0066CC]'>Features</span>
          </h2>
        </div>

        <div className='flex flex-col lg:flex-row items-center gap-6 lg:gap-16'>
          {/* Image on top, takes full width on mobile and 1/2 on desktop */}
          <div className='w-full lg:w-1/2 relative h-[280px] sm:h-[340px] md:h-[400px] lg:h-[480px] flex items-center justify-center order-1'>
            <div
              key={`img-${currentIndex}`}
              className='absolute inset-0 animate-slide-in-right flex items-center justify-center'
            >
              <div className='relative w-full h-full scale-[1.2] sm:scale-[1.3] md:scale-[1.4] lg:scale-[1.5]'>
                <Image
                  src={currentFeature.imageSrc}
                  alt={currentFeature.title}
                  fill
                  className='object-contain drop-shadow-2xl'
                  priority
                />
              </div>
            </div>
          </div>

          {/* Text content below image on mobile, right side on desktop */}
          <div className='w-full lg:w-1/2 flex flex-col gap-5 md:gap-6 order-2'>
            <div
              key={`text-${currentIndex}`}
              className='animate-fade-in flex flex-col gap-2 md:gap-3'
            >
              <h3 className='font-poppins text-2xl sm:text-3xl md:text-3xl font-bold text-[#2F327D]'>
                {currentFeature.title}
              </h3>
              <p className='text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed font-normal'>
                {currentFeature.description}
              </p>
            </div>

            {/* Dots - centered on mobile, left-aligned on desktop */}
            <div className='flex items-center justify-center lg:justify-start gap-2 sm:gap-2.5 md:gap-3 pt-2'>
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    'h-2 sm:h-2.5 rounded-full transition-all duration-500 cursor-pointer border-none outline-none',
                    index === currentIndex
                      ? 'w-8 sm:w-9 md:w-10 bg-[#0066CC]'
                      : 'w-2 sm:w-2.5 bg-gray-300 hover:bg-gray-400',
                  )}
                  aria-label={`Go to feature ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

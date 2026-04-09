'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useWeather } from '@/hooks/use-weather';
import { getWeatherInfo } from '@/lib/utils/get-weather-icon';
import { IconDroplet, IconWind } from '@tabler/icons-react';
import Image from 'next/image';
import { format, isToday } from 'date-fns';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';
import { useWeatherData } from '@/hooks/use-weather-data';

export default function WeatherAccordion({
  latitude,
  longitude,
}: {
  latitude: number | null;
  longitude: number | null;
}) {
  const { weather, isLoading } = useWeather(
    latitude ?? null,
    longitude ?? null,
  );

  const { current, units, daily } = useWeatherData(weather);
  const { icon, description } = getWeatherInfo(
    current?.wmoCode ?? null,
    current?.isDay,
  );

  if (!latitude && !longitude) return null;
  if (isLoading || !weather) {
    return (
      <div className='bg-white/80 pointer-events-auto rounded-2xl shadow-lg border px-4 py-3 w-full'>
        <div className='flex items-center justify-between w-full'>
          <div className='flex gap-2 items-center'>
            <Skeleton className='w-9 h-9 rounded-full' />
            <div className='flex flex-col gap-1'>
              <Skeleton className='w-16 h-3' />
              <Skeleton className='w-12 h-3' />
            </div>
          </div>
          <div className='flex flex-col gap-1'>
            <Skeleton className='w-12 h-3' />
            <Skeleton className='w-12 h-3' />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white/80 pointer-events-auto overflow-hidden rounded-2xl  shadow-lg border w-full'>
      <Accordion type='single' collapsible>
        <AccordionItem value='item-1'>
          <AccordionTrigger className='flex items-center px-4 py-3 hover:no-underline! shadow-2xs rounded-2xl'>
            <div className='flex items-center justify-between w-full'>
              <div className='flex gap-2'>
                <Image
                  src={`/icons/weather/${icon}.svg`}
                  alt={description}
                  width={36}
                  height={36}
                  unoptimized
                />
                <div className='flex flex-col'>
                  <span className='font-poppins font-semibold text-sm'>
                    {current?.temperature}
                    {units?.temperature}
                  </span>
                  <span className='text-xs opacity-50'>{description}</span>
                </div>
              </div>

              <div className='flex flex-col text-xs'>
                <div className='flex items-center gap-1 text-blue-400'>
                  <IconDroplet className='w-[1.5em]! h-[1.5em]!' />
                  <span>
                    {current?.relativeHumidity}
                    {units?.humidity}
                  </span>
                </div>

                <div className='flex items-center gap-1 text-slate-400'>
                  <IconWind className='w-[1.5em]! h-[1.5em]!' />
                  <span>
                    {current?.windSpeed}
                    {units?.windSpeed}
                  </span>
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className='flex flex-col gap-2 px-4 py-2'>
            <span className='font-poppins font-semibold text-xs'>
              7-DAY FORECAST
            </span>

            <Separator />

            {daily?.times.map((time: string, i: number) => {
              const date = new Date(time);
              const dayName = isToday(date) ? 'Today' : format(date, 'EEE');
              const dateLabel = format(date, 'MMM d');
              const { icon: dailyIcon, description: dailyDescription } =
                getWeatherInfo(daily?.wmoCodes?.[i] ?? null, true);

              return (
                <div
                  key={i}
                  className='flex-1 flex items-center py-2 border-b last:border-b-0'
                >
                  <div className='flex-[0.5] flex flex-col'>
                    <span className='font-poppins uppercase font-medium'>
                      {dayName}
                    </span>
                    <span className='font-inter text-xs opacity-50'>
                      {dateLabel}
                    </span>
                  </div>

                  <div className='flex-1 flex items-center gap-2 justify-start'>
                    <div>
                      <Image
                        src={`/icons/weather/${dailyIcon}.svg`}
                        alt={dailyDescription}
                        width={36}
                        height={36}
                        unoptimized
                      />
                    </div>

                    <div className='flex items-center gap-1 text-xs text-blue-400'>
                      <IconDroplet className='w-[1.5em]! h-[1.5em]!' />
                      <span>
                        {daily?.precipitationProbabilities[i]}
                        {units?.precipitation}
                      </span>
                    </div>
                  </div>

                  <div className='flex-1 flex items-center gap-2 justify-start text-sm'>
                    <span className='font-poppins font-medium text-orange-400'>
                      {daily?.maxTemps[i]}
                      {units?.temperature}
                    </span>

                    <span className='opacity-50'>/</span>

                    <span className='opacity-50'>
                      {daily?.minTemps[i]}
                      {units?.temperature}
                    </span>
                  </div>
                </div>
              );
            })}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

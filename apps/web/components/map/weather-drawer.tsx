'use client';

import { clsx } from 'clsx';
import { useState } from 'react';
import { Drawer } from 'vaul';
import { Separator } from '../ui/separator';
import { IconDroplet, IconWind } from '@tabler/icons-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import Image from 'next/image';
import { useWeather } from '@/hooks/use-weather';
import { useWeatherData } from '@/hooks/use-weather-data';
import { getWeatherInfo } from '@/lib/utils/get-weather-icon';
import { format, isToday } from 'date-fns';
import WeatherDrawerSkeleton from './skeletons/weather-drawer-skeleton';

const snapPoints = ['160px', '355px', 1];

export default function WeatherDrawer({
  latitude,
  longitude,
}: {
  latitude: number | null;
  longitude: number | null;
}) {
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);

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

  return (
    <Drawer.Root
      modal={false}
      dismissible={false}
      snapPoints={snapPoints}
      handleOnly={true}
      activeSnapPoint={snap}
      setActiveSnapPoint={(newSnap) => {
        setSnap(newSnap);
      }}
      open={true}
    >
      <Drawer.Overlay className='absolute inset-0 bg-black/40 pointer-events-none' />

      <Drawer.Content
        data-testid='content'
        className='z-20 absolute flex flex-col bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-full -mx-px'
      >
        <Drawer.Handle className='w-16! my-3! rounded-full! shrink-0!' />

        <VisuallyHidden>
          <Drawer.Title>Weather Forecast</Drawer.Title>
        </VisuallyHidden>

        {isLoading || !weather ? (
          <WeatherDrawerSkeleton />
        ) : (
          <div
            className={clsx('flex flex-col max-w-lg mx-auto w-full gap-2', {
              'overflow-y-auto': snap === 1,
              'overflow-hidden': snap !== 1,
            })}
          >
            <div className='flex flex-col gap-4 flex-1 min-h-0'>
              {/* Header */}
              <div className='flex items-center justify-between w-full px-3'>
                <div className='flex items-center gap-2'>
                  <Image
                    src={`/icons/weather/${icon}.svg`}
                    alt={description}
                    width={36}
                    height={36}
                    unoptimized
                  />

                  <span className='font-poppins font-semibold text-sm'>
                    {current?.temperature}
                    {units?.temperature}
                  </span>
                  <span className='text-xs opacity-50'>{description}</span>
                </div>

                <div className='flex items-center gap-2 text-xs'>
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

              <Separator />

              {/* Content */}
              <div className='flex flex-col gap-2 overflow-y-auto flex-1 min-h-0 px-3 pb-3'>
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
                      className='flex-1 flex items-center py-2 border-b last:border-b-0 '
                    >
                      <div className='flex-[0.5] flex flex-col'>
                        <span className='font-poppins uppercase font-medium text-sm'>
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

                      <div className='flex-1 flex items-center gap-2 justify-start text-xs'>
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
              </div>
            </div>
          </div>
        )}
      </Drawer.Content>
    </Drawer.Root>
  );
}

'use client';

import { Separator } from '@/components/ui/separator';
import { useWeather } from '@/hooks/use-weather';
import { useWeatherData } from '@/hooks/use-weather-data';
import { getUserLocation } from '@/lib/utils/get-user-location';
import { getWeatherInfo } from '@/lib/utils/get-weather-icon';
import { IconDroplet, IconWind } from '@tabler/icons-react';
import { format, isToday } from 'date-fns';
import Image from 'next/image';
import { Fragment, useEffect, useState } from 'react';
import { toast } from 'sonner';
import WeatherHorizontalCardSkeleton from './skeleton/weather-horizontal-card-skeleton';

export default function WeatherHorizontalCard() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const pos = await getUserLocation();
        setLocation(pos);
      } catch {
        toast.error('Unable to retrieve your location.');
      }
    };

    fetchLocation();
  }, []);

  const { weather, isLoading } = useWeather(
    location?.latitude ?? null,
    location?.longitude ?? null,
  );

  const { current, units, daily } = useWeatherData(weather);
  const { icon, description } = getWeatherInfo(
    current?.wmoCode ?? null,
    current?.isDay,
  );

  if (!location) return null;
  if (isLoading || !weather) return <WeatherHorizontalCardSkeleton />;
  return (
    <div className='flex items-center rounded-2xl border shadow-xs p-4 gap-4'>
      {/*co1 current*/}
      <div className='flex-[1.5] flex flex-col items-center justify-center w-full'>
        <div className='flex items-center gap-2'>
          <Image
            src={`/icons/weather/${icon}.svg`}
            alt={description}
            width={36}
            height={36}
            unoptimized
          />
          <div className='flex items-center gap-2'>
            <span className='font-poppins font-semibold text-base'>
              {current?.temperature}
              {units?.temperature}
            </span>
            <span className='text-xs opacity-50'>{description}</span>
          </div>
        </div>

        <div className='flex gap-2 text-xs'>
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

      {/*daily col2-8*/}
      {daily?.times.map((time: string, i: number) => {
        const date = new Date(time);
        const dayName = isToday(date) ? 'Today' : format(date, 'EEE');
        const dateLabel = format(date, 'MMM d');
        const { icon: dailyIcon, description: dailyDescription } =
          getWeatherInfo(daily?.wmoCodes?.[i] ?? null, true);

        return (
          <Fragment key={i}>
            <Separator orientation='vertical' />

            <div className='flex-1 flex flex-col items-center'>
              <div className='flex justify-center items-center gap-2'>
                <span className='font-poppins text-sm uppercase font-medium'>
                  {dayName}
                </span>
                <span className='font-inter text-xs opacity-50'>
                  {dateLabel}
                </span>
              </div>

              <div className='flex items-center gap-2 justify-start text-sm'>
                <div className='shrink-0'>
                  <Image
                    src={`/icons/weather/${dailyIcon}.svg`}
                    alt={dailyDescription}
                    width={28}
                    height={28}
                    unoptimized
                  />
                </div>

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

              <div className='flex items-center gap-1 text-xs text-blue-400'>
                <IconDroplet className='w-[1.5em]! h-[1.5em]!' />
                <span>
                  {daily?.precipitationProbabilities[i]}
                  {units?.precipitation}
                </span>
              </div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

import { SWR_KEYS } from '@/lib/constants/swr-keys';

export async function getWeather(lat: number | null, lon: number | null) {
  if (!lat || !lon) return null;

  const res = await fetch(SWR_KEYS.weather(lat, lon));

  if (!res.ok) throw new Error('Failed to fetch weather data');

  return res.json();
}

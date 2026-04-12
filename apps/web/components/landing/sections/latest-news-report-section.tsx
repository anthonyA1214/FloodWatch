'use client';

import React, { useEffect, useState } from 'react';
import { IconLoader2 } from '@tabler/icons-react';
import LatestNewsCard from '../latest-news-card';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  url: string;
  image: string | null;
  publishedAt: string;
}

export default function LatestNewsSection() {
  const [newsReports, setNewsReports] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchRealNews = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news`);
        if (!response.ok) throw new Error('Failed to fetch news');
        const data = await response.json();
        setNewsReports(data);
      } catch (error) {
        console.error('Error fetching news from backend:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchRealNews();
  }, []);

  const featured = newsReports.find((n) => n.image) ?? newsReports[0];
  const others = newsReports.filter((n) => n.id !== featured?.id).slice(0, 2);

  return (
    <section
      className='bg-white py-16 sm:py-24 md:py-32 overflow-hidden'
      id='latest-news'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-10 sm:mb-16 max-w-2xl'>
          <h2 className='text-[#2F327D] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-3 sm:mb-4'>
            Real-time Updates
          </h2>
          <h3 className='text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900'>
            Latest News <span className='text-[#0066CC]'>Report.</span>
          </h3>
        </div>

        {loading ? (
          <div className='flex flex-col items-center justify-center py-16 sm:py-20 gap-4 text-slate-400'>
            <IconLoader2 className='w-7 h-7 sm:w-8 sm:h-8 animate-spin text-[#0066CC]' />
            <p className='text-sm sm:text-base'>Fetching latest updates...</p>
          </div>
        ) : newsReports.length === 0 || error ? (
          <div className='text-center py-16 sm:py-20 text-slate-500 bg-slate-50 rounded-3xl sm:rounded-4xl border border-slate-100 text-sm sm:text-base px-4'>
            No flood reports available at the moment.
          </div>
        ) : (
          <>
            {featured && (
              <div className='mb-8 sm:mb-12'>
                <LatestNewsCard
                  variant='featured'
                  title={featured.title}
                  description={featured.description}
                  image={featured.image}
                  publishedAt={new Date(featured.publishedAt)}
                  url={featured.url}
                />
              </div>
            )}

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8'>
              {others.map((news) => (
                <LatestNewsCard
                  key={news.id}
                  variant='compact'
                  title={news.title}
                  description={news.description}
                  image={news.image}
                  publishedAt={new Date(news.publishedAt)}
                  url={news.url}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

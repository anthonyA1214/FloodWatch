'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

interface PolicyModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

// ─── Modal Component ──────────────────────────────────────────────────────────

export default function PolicyModal({
  title,
  children,
  onClose,
}: PolicyModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Prevent background scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex items-center gap-3 bg-[#1A56DB] px-6 py-4 rounded-t-2xl shrink-0'>
          {/* Location pin icon */}
          <div className='w-9 h-9 rounded-full border-2 border-white/60 flex items-center justify-center shrink-0'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='w-5 h-5 text-white'
              viewBox='0 0 24 24'
              fill='currentColor'
            >
              <path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z' />
            </svg>
          </div>
          <h2 className='text-white font-semibold text-lg'>{title}</h2>
          <button
            onClick={onClose}
            className='ml-auto text-white hover:text-white/70 transition'
            aria-label='Close modal'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Scrollable body */}
        <div className='overflow-y-auto px-8 py-6 text-sm text-gray-700 leading-relaxed flex-1'>
          {children}
        </div>

        {/* Footer */}
        <div className='px-6 py-4 flex justify-end border-t border-gray-100 shrink-0'>
          <button
            onClick={onClose}
            className='bg-[#1A56DB] hover:bg-[#1648c0] text-white font-medium px-6 py-2 rounded-lg transition'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

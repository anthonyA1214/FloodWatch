import { IconChevronDown, IconPhoneCall } from '@tabler/icons-react';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';

export default function HotlinesPill() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`pointer-events-auto bg-white/80 rounded-2xl shadow-lg w-[230px] md:w-[280px] max-w-xs overflow-hidden border ${open ? 'border-red-400/70' : 'border-gray-200'}`}
    >
      <button
        type='button'
        onClick={() => setOpen((v) => !v)}
        className='flex w-full items-center justify-between gap-2 md:gap-3 px-3 py-2.5 md:px-4 md:py-3 hover:bg-white focus:outline-none cursor-pointer'
      >
        <div className='flex items-center gap-2 md:gap-3'>
          <div className='relative flex items-center justify-center rounded-full bg-red-50 p-1 md:p-1.5'>
            {open && (
              <span className='absolute inset-0.5 rounded-full bg-red-400/30 animate-ping' />
            )}
            <IconPhoneCall
              className='relative w-3.5 h-3.5 md:w-4 md:h-4 text-red-500'
              strokeWidth={1.8}
            />
          </div>
          <span className='text-[11px] md:text-xs font-semibold tracking-[0.16em] text-gray-700 uppercase'>
            Hotlines
          </span>
        </div>

        <IconChevronDown
          className={`w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500 ml-1 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          strokeWidth={1.8}
        />
      </button>

      {open && (
        <div className='flex flex-col gap-3 px-4 pb-4 pt-2 text-xs'>
          <Separator className='bg-gray-200 mb-1' />
          <p className='text-[10px] text-center font-medium text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis'>
            Caloocan City Disaster Risk Management Office
          </p>

          <div className='flex flex-col gap-2'>
            <a
              href='tel:+63288825664'
              className='flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-4 py-3 active:bg-red-100 cursor-pointer'
            >
              <span className='text-[11px] md:text-xs font-semibold tracking-[0.16em] text-red-400 uppercase'>
                Phone
              </span>
              <span className='text-[13px] md:text-sm font-bold text-red-600 whitespace-nowrap text-right'>
                (02) 888-25664
              </span>
            </a>

            <a
              href='tel:+639088125664'
              className='flex items-center justify-between rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 active:bg-blue-100 cursor-pointer'
            >
              <span className='text-[11px] md:text-xs font-semibold tracking-[0.16em] text-blue-500 uppercase'>
                Mobile
              </span>
              <span className='text-[13px] md:text-sm font-bold text-blue-600 whitespace-nowrap text-right'>
                090881 - 25664
              </span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

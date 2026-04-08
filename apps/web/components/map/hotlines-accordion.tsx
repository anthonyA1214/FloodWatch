import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { IconPhoneCall } from '@tabler/icons-react';

export default function HotlinesPill() {
  return (
    <div className='pointer-events-auto bg-white/80 overflow-hidden rounded-2xl shadow-lg border w-[230px] md:w-[280px] max-w-xs'>
      <Accordion type='single' collapsible>
        <AccordionItem value='hotlines'>
          <AccordionTrigger className='flex items-center px-3 py-2.5 md:px-4 md:py-3 hover:no-underline! shadow-2xs rounded-2xl'>
            <div className='flex items-center gap-2 md:gap-3'>
              <div className='relative flex items-center justify-center '>
                <IconPhoneCall
                  className='relative size-[1.5em]! text-red-500'
                  strokeWidth={1.8}
                />
                <IconPhoneCall
                  className='absolute size-[1.5em]! text-red-500 animate-ping'
                  strokeWidth={1.8}
                />
              </div>
              <span className='text-[11px] md:text-xs font-semibold tracking-[0.16em] text-gray-700 uppercase'>
                Hotlines
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className='flex flex-col gap-3 px-4 pb-4 pt-2 text-xs'>
            <p className='text-[10px] text-center font-medium text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis'>
              Caloocan City Disaster Risk Management Office
            </p>
            <div className='flex flex-col gap-2'>
              <a
                href='tel:+63288825664'
                className='flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-4 py-3 cursor-pointer'
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
                className='flex items-center justify-between rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 cursor-pointer'
              >
                <span className='text-[11px] md:text-xs font-semibold tracking-[0.16em] text-blue-500 uppercase'>
                  Mobile
                </span>
                <span className='text-[13px] md:text-sm font-bold text-blue-600 whitespace-nowrap text-right'>
                  090881 - 25664
                </span>
              </a>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

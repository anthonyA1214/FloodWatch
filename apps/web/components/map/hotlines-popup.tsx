import { IconPhoneCall, IconX } from '@tabler/icons-react';
import { Separator } from '@/components/ui/separator';

export default function HotlinesPopup({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) {
  if (!show) return null;

  return (
    <div className='flex flex-col bg-white rounded-2xl shadow-xl border w-[320px] md:w-[380px] p-5 gap-5'>
      {/* Header */}
      <div className='flex items-start justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <div className='flex items-center justify-center rounded-full bg-red-50 p-2'>
            <IconPhoneCall className='w-6 h-6 text-red-500' />
          </div>
          <div className='flex flex-col'>
            <span className='text-lg md:text-xl font-semibold tracking-[0.16em] text-gray-800 uppercase'>
              Emergency Hotlines
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className='text-xs rounded-full p-1 hover:bg-gray-100'
        >
          <IconX className='w-4 h-4 text-[#525254] hover:text-black' />
        </button>
      </div>

      <Separator className='bg-gray-200' />

      {/* Subheader */}
      <p className='text-xs md:text-sm text-center font-medium text-gray-800'>
        Caloocan City Disaster Risk Management Office
      </p>

      {/* Phone block */}
      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between rounded-3xl border border-red-200 bg-red-50 px-6 py-4'>
          <span className='text-sm md:text-base font-semibold tracking-[0.16em] text-red-400 uppercase'>
            Phone
          </span>
          <span className='text-lg md:text-2xl font-bold text-red-600 whitespace-nowrap'>
            (02) 888-25664
          </span>
        </div>

        <div className='flex items-center justify-between rounded-3xl border border-blue-200 bg-blue-50 px-6 py-4'>
          <span className='text-sm md:text-base font-semibold tracking-[0.16em] text-blue-500 uppercase'>
            Mobile
          </span>
          <span className='text-lg md:text-2xl font-bold text-blue-600 whitespace-nowrap'>
            090881 - 25664
          </span>
        </div>
      </div>
    </div>
  );
}

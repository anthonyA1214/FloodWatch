import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

const btnClass = `
  flex items-center gap-1.5 w-full justify-center
  transition-colors duration-200 rounded-md
  px-3 py-1.5 sm:px-4 sm:py-2
  text-gray-500 border border-gray-200 bg-transparent
  hover:text-gray-800 hover:bg-gray-100 hover:border-gray-300
  active:text-gray-900 active:bg-gray-200 active:border-gray-400
  disabled:opacity-40 disabled:cursor-not-allowed
  disabled:hover:text-gray-500 disabled:hover:bg-transparent disabled:hover:border-gray-200
`;

export default function ReportPaginationPopup({
  nextReport,
  prevReport,
  hasNext,
  hasPrev,
  currentReportIndex,
  total,
  className,
}: {
  nextReport: () => void;
  prevReport: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  currentReportIndex: number;
  total: number;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 sm:gap-6 justify-between ${className}`}
    >
      <button onClick={prevReport} disabled={!hasPrev} className={btnClass}>
        <IconChevronLeft className='w-[1.5em]! h-[1.5em]!' />
        <span className='font-medium font-poppins text-xs sm:text-sm'>
          BACK
        </span>
      </button>

      <span className='font-poppins font-bold text-xs text-primary shrink-0'>
        {currentReportIndex}{' '}
        <span className='text-gray-400 font-normal'>/ {total}</span>
      </span>

      <button onClick={nextReport} disabled={!hasNext} className={btnClass}>
        <span className='font-medium font-poppins text-xs sm:text-sm'>
          NEXT
        </span>
        <IconChevronRight className='w-[1.5em]! h-[1.5em]!' />
      </button>
    </div>
  );
}

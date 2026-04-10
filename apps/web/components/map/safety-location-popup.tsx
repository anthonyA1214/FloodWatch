import {
  IconMapPin,
  IconPhone,
  IconRoad,
  IconSearch,
  IconSend,
  IconShield,
  IconTag,
  IconX,
} from '@tabler/icons-react';
import { Separator } from '../ui/separator';
import { SAFETY_TYPE_COLOR_MAP } from '@/lib/utils/get-color-map';
import { useSafetyLocationDetail } from '@/hooks/use-safety-location-detail';
import SafetyLocationPopupSkeleton from './skeletons/safety-location-popup-skeleton';
import { useDirections } from '@/hooks/use-directions';
import { useMapRouting } from '@/contexts/map-routing-context';
import { Spinner } from '../ui/spinner';
import { useMapPopup } from '@/contexts/map-popup-context';

export default function SafetyLocationPopup({
  onClose,
  safetyId,
  latitude,
  longitude,
  onSelectSafety,
}: {
  onClose: () => void;
  safetyId: number;
  latitude: number;
  longitude: number;
  onSelectSafety?: () => void;
}) {
  const { safetyDetail, isLoading } = useSafetyLocationDetail(safetyId);
  const { getDirections } = useDirections();
  const { isLoadingRoute } = useMapRouting();
  const { closePopup } = useMapPopup();

  if (isLoading || !safetyDetail) return <SafetyLocationPopupSkeleton />;

  return (
    <div
      className='flex flex-col justify-center rounded-lg overflow-hidden w-[300px] max-h-[70vh] overflow-y-auto bg-white'
      onClick={(e) => e.stopPropagation()}
    >
      {/* header */}
      <div className='bg-[#9B32E4]/10'>
        <div className='flex items-center justify-between bg-[#0066CC] p-3 text-white rounded-b-2xl'>
          <span className='font-poppins font-medium text-sm'>
            SAFETY LOCATION
          </span>
          <button onClick={onClose} className='text-[10px]'>
            <IconX className='opacity-70 hover:opacity-100 w-[1.5em]! h-[1.5em]! duration-200' />
          </button>
        </div>
      </div>

      <div className='flex w-full gap-1.5 p-3 bg-[#9B32E4]/10 text-[#9B32E4] text-xs items-center'>
        <IconShield className='w-[1.5em]! h-[1.5em]!' />
        <span className='font-poppins font-medium'>OFFICIAL INFORMATION</span>
      </div>

      <Separator className='bg-[#9B32E4]/30' />

      <div className='flex flex-col'>
        <div className='flex flex-col gap-2 p-3'>
          <div className='flex justify-between gap-2'>
            <div className='flex items-center gap-1.5 opacity-50'>
              <IconTag className='w-[1.5em]! h-[1.5em]!' />
              <span className='font-poppins font-medium'>SAFETY TYPE</span>
            </div>

            <div
              className='flex items-center rounded-full px-3 py-1 w-fit'
              style={{
                color: SAFETY_TYPE_COLOR_MAP[safetyDetail?.type],
                backgroundColor: `${SAFETY_TYPE_COLOR_MAP[safetyDetail?.type]}25`,
              }}
            >
              <span className='font-poppins text-xs font-medium'>
                {safetyDetail?.type?.toUpperCase()}
              </span>
            </div>
          </div>

          <Separator />

          <div className='flex justify-between gap-2'>
            <div className='flex items-center gap-1.5 opacity-50 h-fit shrink-0'>
              <IconMapPin className='w-[1.5em]! h-[1.5em]!' />
              <span className='font-poppins font-medium'>LOCATION</span>
            </div>

            <span className='text-right line-clamp-2'>
              {safetyDetail?.location}
            </span>
          </div>

          <Separator />

          <div className='flex justify-between gap-2'>
            <div className='flex items-center gap-1.5 opacity-50 h-fit shrink-0'>
              <IconRoad className='w-[1.5em]! h-[1.5em]!' />
              <span className='font-poppins font-medium'>ADDRESS</span>
            </div>

            <span className='text-right line-clamp-2'>
              {safetyDetail?.address}
            </span>
          </div>

          {safetyDetail?.availability && (
            <>
              <Separator />

              <div className='flex justify-between gap-2'>
                <div className='flex items-center gap-1.5 opacity-50 h-fit shrink-0'>
                  <IconPhone className='w-[1.5em]! h-[1.5em]!' />
                  <span className='font-poppins font-medium'>
                    CONTACT NUMBER
                  </span>
                </div>

                <span className='text-right line-clamp-2'>
                  {safetyDetail?.contactNumber}
                </span>
              </div>
            </>
          )}
        </div>

        <Separator />

        <div className='flex justify-between items-center p-3 gap-2'>
          <button
            className='flex items-center gap-1.5 w-full bg-primary text-primary-foreground hover:bg-primary/90 duration-200 px-4 py-2.5 rounded-lg justify-center'
            onClick={onSelectSafety}
          >
            <IconSearch className='w-[1.5em]! h-[1.5em]!' />
            <span className='font-poppins font-medium'>OVERVIEW</span>
          </button>

          <button
            className='flex items-center gap-1.5 w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 duration-200 px-4 py-2.5 rounded-lg justify-center disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={isLoadingRoute}
            onClick={() =>
              getDirections({ latitude, longitude }).then(() => closePopup())
            }
          >
            {isLoadingRoute ? (
              <Spinner />
            ) : (
              <IconSend className='w-[1.5em]! h-[1.5em]!' />
            )}
            <span className='font-poppins font-medium'>
              {isLoadingRoute ? 'LOADING...' : 'DIRECTIONS'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

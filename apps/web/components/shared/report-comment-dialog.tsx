'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  IconArrowLeft,
  IconChevronRight,
  IconCircleCheck,
} from '@tabler/icons-react';
import { useState } from 'react';
import { Field } from '../ui/field';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import { apiFetchClient } from '@/lib/api-fetch-client';
import { toast } from 'sonner';

const REASONS = [
  {
    id: 'misinformation',
    label: 'Misinformation / False Information',
    description: 'Inaccurate or misleading content',
    followUp:
      'Can you tell us how this post is giving misinformation or false information?',
  },
  {
    id: 'wrong_pinned_location',
    label: 'Wrong Pinned Location',
    description: 'Location marker is incorrect',
    followUp: 'Where should the correct location be pinned?',
  },
  {
    id: 'not_disaster_related',
    label: 'Not Disaster-Related',
    description: 'Content is unrelated to the current event',
    followUp: 'How is this post unrelated to the disaster?',
  },
  {
    id: 'harmful_panic_content',
    label: 'Harmful or Panic-Inducing Content',
    description: 'May cause distress or spread fear',
    followUp: 'Please describe how this content is harmful or panic-inducing.',
  },
];

export default function ReportCommentDialog({
  open,
  onClose,
  commentId,
}: {
  open: boolean;
  onClose: () => void;
  commentId: number | null;
}) {
  const [step, setStep] = useState<
    'select-reason' | 'provide-details' | 'success'
  >('select-reason');
  const [selectedReason, setSelectedReason] = useState<
    (typeof REASONS)[0] | null
  >(null);
  const [details, setDetails] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleReasonSelect = (reason: (typeof REASONS)[0]) => {
    setSelectedReason(reason);
    setStep('provide-details');
  };

  const handleBack = () => {
    setSelectedReason(null);
    setDetails('');
    setStep('select-reason');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedReason) return;

    setIsPending(true);
    try {
      await apiFetchClient(`/comments/${commentId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: selectedReason.id,
          description: details || undefined,
        }),
      });
      setStep('success');
    } catch (error) {
      if (error instanceof Response) {
        if (error.status === 400) {
          toast.error(
            'You have already reported this comment. Thank you for your feedback.',
          );
          handleClose();
          return;
        }
      }

      toast.error('Failed to submit report. Please try again later.');
    } finally {
      setIsPending(false);
    }
  };

  const handleClose = () => {
    onClose();

    setTimeout(() => {
      setSelectedReason(null);
      setDetails('');
      setStep('select-reason');
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className='flex flex-col p-0 overflow-hidden gap-0 border-0
      w-full max-w-full sm:max-w-md
      [&>button]:text-white [&>button]:hover:text-white
      [&>button]:opacity-70 [&>button]:hover:opacity-100'
      >
        <DialogHeader className='flex flex-row items-center gap-4 bg-[#0066CC] rounded-b-2xl px-5 py-4 shrink-0 text-white'>
          {/* Text */}
          <DialogTitle className='flex items-center gap-3 sm:gap-4 font-poppins text-sm sm:text-base font-medium'>
            {step === 'provide-details' && (
              <button
                onClick={handleBack}
                className='p-1.5 text-xs rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors shrink-0'
              >
                <IconArrowLeft className='w-[1.25em]! h-[1.25em]! sm:w-[1.5em]! sm:h-[1.5em]!' />
              </button>
            )}
            REPORT COMMENT
          </DialogTitle>
        </DialogHeader>

        {/* body */}
        <div className='flex-1 flex flex-col p-4 sm:p-6 gap-4 sm:gap-6 min-h-0 overflow-y-auto'>
          {/* step 1 */}
          {step === 'select-reason' && selectedReason === null && (
            <>
              {/* Progress */}
              <div className='flex items-center gap-1.5'>
                <div className='h-[3px] sm:h-[4px] flex-1 rounded-full bg-[#0066CC]' />
                <div className='h-[3px] sm:h-[4px] flex-1 rounded-full bg-slate-200' />
              </div>

              <div>
                <h3 className='text-base sm:text-lg font-bold'>
                  Why are you reporting this comment?
                </h3>
                <span className='text-xs sm:text-sm opacity-50'>
                  Select the option that best describes the issue.
                </span>
              </div>

              <div className='flex flex-col gap-3 sm:gap-4'>
                {REASONS.map((reason) => (
                  <button
                    key={reason.id}
                    onClick={() => handleReasonSelect(reason)}
                    className='flex items-center justify-between gap-3 px-3 py-3 sm:px-4 sm:py-3.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-[#0066CC] hover:shadow-md hover:shadow-[#0066CC]/10 hover:-translate-y-0.5 transition-all duration-150 text-left group'
                  >
                    <div>
                      <p className='text-sm sm:text-base font-semibold group-hover:text-[#0066CC] transition-colors'>
                        {reason.label}
                      </p>
                      <p className='text-xs opacity-50'>{reason.description}</p>
                    </div>
                    <IconChevronRight
                      size={15}
                      className='opacity-50 group-hover:opacity-100 group-hover:text-[#0066CC] group-hover:translate-x-0.5 transition-all shrink-0'
                    />
                  </button>
                ))}
              </div>
            </>
          )}

          {/* step 2 */}
          {step === 'provide-details' && selectedReason && (
            <>
              <div className='flex items-center gap-1.5'>
                <div className='h-[3px] sm:h-[4px] flex-1 rounded-full bg-[#0066CC]' />
                <div className='h-[3px] sm:h-[4px] flex-1 rounded-full bg-[#0066CC]' />
              </div>

              <div>
                <h3 className='text-base sm:text-lg font-bold'>
                  {selectedReason.label}
                </h3>
                <span className='text-xs sm:text-sm opacity-50'>
                  {selectedReason.followUp}
                </span>
              </div>

              {/* textarea */}
              <Field className='flex flex-col gap-2'>
                <Textarea
                  id='details'
                  placeholder='Describe the issue in more detail...'
                  className='no-scrollbar min-h-[120px] max-h-[120px] text-sm'
                  style={{ wordBreak: 'break-word' }}
                  value={details}
                  maxLength={300}
                  onChange={(e) => setDetails(e.target.value)}
                />
                <div className='flex justify-between items-center text-xs'>
                  <span className='opacity-50'>
                    Optional · More details help us act faster
                  </span>
                  <span className='opacity-50'>{details.length} / 300</span>
                </div>
              </Field>

              <Button
                className='rounded-lg h-12 text-sm'
                onClick={handleSubmit}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Spinner /> SUBMITTING...
                  </>
                ) : (
                  <span>SUBMIT REPORT</span>
                )}
              </Button>
            </>
          )}

          {/* step 3 */}
          {step === 'success' && (
            <div className='flex flex-col items-center gap-5 sm:gap-6 py-8 sm:py-10'>
              <IconCircleCheck className='size-24 text-[#0066CC]' />

              <div className='flex flex-col items-center gap-2 text-center'>
                <h3 className='text-base sm:text-lg font-medium'>
                  Report Submitted
                </h3>
                <span className='text-center text-xs sm:text-sm opacity-50'>
                  Thank you for helping us keep the community safe. We will
                  review the comment and take appropriate action.
                </span>
              </div>

              <Button
                variant='outline'
                className='w-full border-[#0066CC] text-[#0066CC] hover:bg-[#0066CC]/10 hover:text-[#0066CC] max-w-3xs text-sm'
                onClick={handleClose}
              >
                DONE
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

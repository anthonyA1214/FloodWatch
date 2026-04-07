'use client';

import { useMyVote } from '@/hooks/use-my-vote';
import { useReportDetail } from '@/hooks/use-report-detail';
import { useMe } from '@/hooks/use-me';
import { apiFetchClient } from '@/lib/api-fetch-client';
import { cn } from '@/lib/utils';
import { IconThumbUp, IconThumbUpFilled, IconX } from '@tabler/icons-react';
import { useState } from 'react';

export default function VoteButtons({ reportId }: { reportId: number }) {
  const { me } = useMe();
  const { myVote, mutateMyVote } = useMyVote(reportId, !!me);
  const { mutateReportDetail } = useReportDetail(reportId);
  const [pendingAction, setPendingAction] = useState<'confirm' | 'deny' | null>(
    null,
  );

  const handleVote = async (action: 'confirm' | 'deny') => {
    if (pendingAction) return; // Prevent multiple rapid votes
    setPendingAction(action);

    try {
      await apiFetchClient(`/reports/${reportId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      await Promise.all([mutateMyVote(), mutateReportDetail()]);
    } catch (err) {
      console.error('Failed to submit vote:', err);
    } finally {
      setPendingAction(null);
    }
  };

  const isConfirmed = pendingAction
    ? pendingAction === 'confirm' // while pending, trust the clicked button
    : myVote?.action === 'confirm'; // otherwise trust server data

  const isDenied = pendingAction
    ? pendingAction === 'deny'
    : myVote?.action === 'deny';

  return (
    <div className='flex justify-between'>
      {/* confirm */}
      <button
        onClick={() => handleVote('confirm')}
        disabled={!!pendingAction || !me}
        className={cn(
          'w-full group transition-colors duration-200 disabled:cursor-not-allowed',
          !me
            ? 'opacity-50 cursor-not-allowed'
            : isConfirmed || pendingAction === 'confirm'
              ? 'text-[#16a34a] bg-[#bbf7d0] ring-2 ring-inset ring-[#16a34a]/30 font-semibold'
              : 'text-[#16a34a] bg-[#f0fdf4] hover:bg-[#d1fae5] active:bg-[#bbf7d0]',
        )}
      >
        <div
          className={cn(
            'flex items-center justify-center gap-1.5 lg:gap-2 p-3 lg:p-4 transition-transform duration-200',
            isConfirmed
              ? 'scale-105'
              : me
                ? 'group-hover:-translate-y-0.5'
                : '',
          )}
        >
          {isConfirmed ? (
            <IconThumbUpFilled className='w-[1.5em]! h-[1.5em]!' />
          ) : (
            <IconThumbUp className='w-[1.5em]! h-[1.5em]!' />
          )}
          <span className='font-poppins font-medium'>
            {isConfirmed ? 'CONFIRMED' : 'CONFIRM'}
          </span>
        </div>
      </button>

      {/* deny */}
      <button
        onClick={() => handleVote('deny')}
        disabled={!!pendingAction || !me}
        className={cn(
          'w-full group transition-colors duration-200 disabled:cursor-not-allowed',
          !me
            ? 'opacity-50 cursor-not-allowed'
            : isDenied || pendingAction === 'deny'
              ? 'text-[#dc2626] bg-[#fecaca] ring-2 ring-inset ring-[#dc2626]/30 font-semibold'
              : 'text-[#dc2626] bg-[#fef2f2] hover:bg-[#fee2e2] active:bg-[#fecaca]',
        )}
      >
        <div
          className={cn(
            'flex items-center justify-center gap-1.5 lg:gap-2 p-3 lg:p-4 transition-transform duration-200',
            isDenied ? 'scale-105' : me ? 'group-hover:-translate-y-0.5' : '',
          )}
        >
          <IconX
            className='w-[1.5em]! h-[1.5em]!'
            strokeWidth={isDenied ? 3 : undefined}
          />
          <span className='font-poppins font-medium'>
            {isDenied ? 'DENIED' : 'DENY'}
          </span>
        </div>
      </button>
    </div>
  );
}

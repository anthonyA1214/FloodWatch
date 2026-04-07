'use client';

import CommentComposer from '@/components/shared/comment-composer';
import { useCommunityFeed } from '@/contexts/community-feed-context';
import { useReportDetail } from '@/hooks/use-report-detail';
import CommunityFeedEmpty from './community-feed-empty';
import CommentsList from '@/components/shared/comments-list';
import CommentCardsSkeleton from '@/components/shared/skeletons/comment-cards-skeleton';

export default function CommunityFeedLeft() {
  const { reportId } = useCommunityFeed();
  const { reportDetail, isLoading, isValidating } = useReportDetail(reportId);

  return (
    <div className='flex-3 flex flex-col gap-6 min-h-0'>
      {!reportId || !reportDetail ? (
        <CommunityFeedEmpty />
      ) : isLoading || isValidating ? (
        <>
          <CommentCardsSkeleton />
        </>
      ) : (
        reportDetail && (
          <div className='flex flex-col gap-6 overflow-y-auto pr-4'>
            <div className='flex gap-4 text-xs items-center px-2 lg:px-0'>
              <div className='h-px flex-1 bg-gray-200' />
              <span className='font-poppins font-bold opacity-50'>
                COMMUNITY UPDATES
              </span>
              <div className='h-px flex-1 bg-gray-200' />
            </div>

            {/* comment composer */}
            <CommentComposer reportId={reportId} />

            {/*comment list*/}
            <CommentsList reportId={reportId} />
          </div>
        )
      )}
    </div>
  );
}

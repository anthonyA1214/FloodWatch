'use client';

import useSWR from 'swr';
import { SWR_KEYS } from '@/lib/constants/swr-keys';
import { getReportedCommentDetail } from '@/lib/fetchers/get-reported-comment-details';
import { ReportedCommentDetailInput } from '@repo/schemas';

export function useReportedCommentDetail(commentId: number | null) {
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<ReportedCommentDetailInput>(
      commentId ? SWR_KEYS.safetyDetail(commentId) : null,
      () => getReportedCommentDetail(commentId!),
    );

  return {
    reportedComment: data,
    isLoading,
    isValidating,
    isError: error,
    mutateReportedComment: mutate,
  };
}

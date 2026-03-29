'use client';
import useSWRInfinite from 'swr/infinite';
import { SWR_KEYS } from '@/lib/constants/swr-keys';
import { getComments } from '@/lib/fetchers/get-comments';
import { useCallback } from 'react';

type Cursor = { cursorDate: string; cursorId: number } | null;

export function useComments(reportId: number) {
  const getKey = (
    pageIndex: number,
    previousPageData: Awaited<ReturnType<typeof getComments>>,
  ) => {
    if (previousPageData && !previousPageData.meta.hasMore) return null;
    const cursor: Cursor = previousPageData?.meta?.nextCursor ?? null;
    return [SWR_KEYS.reportComments(reportId), cursor] as const;
  };

  const { data, size, setSize, isLoading, isValidating, mutate } =
    useSWRInfinite(getKey, ([, cursor]) => getComments(reportId, cursor), {
      keepPreviousData: true,
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      revalidateFirstPage: false,
      refreshInterval: 60 * 1000,
      revalidateAll: false,
    });

  const comments = data ? data.flatMap((page) => page?.data ?? []) : [];
  const hasMore = data ? !!data[data.length - 1]?.meta.hasMore : true;
  const isFetchingMore = size > (data?.length ?? 0);

  const loadMore = useCallback(() => {
    if (isFetchingMore || isValidating || isLoading) return;
    setSize((s) => s + 1);
  }, [isFetchingMore, isValidating, isLoading, setSize]);

  return {
    comments,
    isLoading,
    isValidating,
    isFetchingMore,
    hasMore,
    loadMore,
    mutateComments: mutate,
  };
}

'use client';

import { useComments } from '@/hooks/use-comments';
import CommentCardsSkeleton from './skeletons/comment-cards-skeleton';
import CommentCard from './comment-card';
import NoUpdatesYetEmpty from './no-updates-yet-empty';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import { useMe } from '@/hooks/use-me';
import CommentEditForm from '../map/forms/comment-edit-form';
import { apiFetchClient } from '@/lib/api-fetch-client';
import ReportCommentDialog from './report-comment-dialog';
import DeleteCommentDialog from './delete-comment-dialog';
import { CommentInput } from '@repo/schemas';

export default function CommentsList({
  reportId,
  scrollContainerId,
}: {
  reportId: number;
  scrollContainerId?: string;
}) {
  const { me } = useMe();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [reportingId, setReportingId] = useState<number | null>(null);
  const [deletingComment, setDeletingComment] = useState<CommentInput | null>(
    null,
  );

  const {
    comments,
    hasMore,
    isLoading,
    isValidating,
    isFetchingMore,
    loadMore,
    mutateComments,
  } = useComments(reportId);

  const { ref, inView } = useInView({
    threshold: 0.1,
    root:
      typeof window !== 'undefined' && scrollContainerId
        ? document.getElementById(scrollContainerId)
        : null,
  });

  useEffect(() => {
    if (inView && hasMore && !isLoading && !isValidating && !isFetchingMore) {
      loadMore();
    }
  }, [inView, hasMore, isLoading, isValidating, isFetchingMore, loadMore]);

  if (isLoading) return <CommentCardsSkeleton />;
  if (!isLoading && comments.length === 0) return <NoUpdatesYetEmpty />;

  const isAdmin = me?.role === 'admin';

  const handleSave = async (
    commentId: number,
    content: string,
    image: File | null,
    removeImage: boolean,
  ) => {
    const formData = new FormData();
    formData.append('content', content);
    if (removeImage) formData.append('removeImage', 'true');
    if (image) formData.append('image', image);

    await apiFetchClient(`/comments/${commentId}`, {
      method: 'PATCH',
      body: formData,
    });

    mutateComments();
    setEditingId(null);
  };

  const handleDelete = async () => {
    if (!deletingComment) return;

    await apiFetchClient(`/comments/${deletingComment?.id}`, {
      method: 'DELETE',
    });

    mutateComments();
    setDeletingComment(null);
  };

  return (
    <div className='flex flex-col gap-4'>
      {comments.map((comment) => {
        if (editingId === comment.id) {
          return (
            <CommentEditForm
              key={comment.id}
              author={{
                id: comment.author?.id,
                name: comment.author?.name ?? 'Unknown User',
                profilePicture: comment.author?.profilePicture ?? undefined,
              }}
              initialContent={comment.content}
              initialImage={comment.image ?? undefined}
              timestamp={comment.createdAt}
              onSave={(content, image, removeImage) =>
                handleSave(comment.id, content, image, removeImage)
              }
              onCancel={() => setEditingId(null)}
            />
          );
        }

        return (
          <CommentCard
            key={comment.id}
            author={{
              id: comment?.author?.id,
              name: comment?.author?.name ?? 'Unknown User',
              profilePicture: comment?.author?.profilePicture ?? undefined,
            }}
            content={comment.content}
            timestamp={comment.createdAt}
            reportCount={comment.reportCount}
            hasReported={comment.hasReported}
            image={comment.image ?? undefined}
            isAdmin={isAdmin}
            isOwner={comment.author?.id === me?.id}
            onEditClick={() => setEditingId(comment.id)}
            onReportClick={() => setReportingId(comment.id)}
            onDeleteClick={() => setDeletingComment(comment)}
          />
        );
      })}
      {/* sentinel */}
      <div ref={ref} className={!hasMore ? 'invisible' : 'h-2'} />

      {isFetchingMore && <CommentCardsSkeleton />}

      {!hasMore && !isValidating && (
        <div className='flex gap-4 text-xs items-center px-2 lg:px-0'>
          <div className='h-px flex-1 bg-gray-200' />
          <span className='font-poppins font-bold opacity-50'>
            YOU&apos;RE ALL CAUGHT UP
          </span>
          <div className='h-px flex-1 bg-gray-200' />
        </div>
      )}

      <ReportCommentDialog
        commentId={reportingId}
        open={reportingId !== null}
        onClose={() => setReportingId(null)}
      />

      <DeleteCommentDialog
        open={deletingComment !== null}
        comment={deletingComment}
        onConfirm={handleDelete}
        onClose={() => setDeletingComment(null)}
      />
    </div>
  );
}

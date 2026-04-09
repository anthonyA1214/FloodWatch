import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { IconUsers } from '@tabler/icons-react';

export default function CommunityFeedEmpty() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <IconUsers />
        </EmptyMedia>
        <EmptyTitle>No report selected</EmptyTitle>
        <EmptyDescription>
          Select a flood report to view and post community updates for that
          location
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

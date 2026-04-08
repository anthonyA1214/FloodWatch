import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty';
import { IconBellOff } from '@tabler/icons-react';

interface EmptyNotificationsProps {
  title?: string;
  description?: string;
}

export default function EmptyNotifications({
  title = 'No notifications',
  description = 'You have no notifications yet.',
}: EmptyNotificationsProps) {
  return (
    <Empty className='h-full justify-center'>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <IconBellOff />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

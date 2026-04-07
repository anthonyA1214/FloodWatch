import { IconMapPinX } from '@tabler/icons-react';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

type Props = {
  title?: string;
  description?: string;
};

export default function LocationsListEmpty({ title, description }: Props) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <IconMapPinX />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

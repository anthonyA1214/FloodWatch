import { Icon } from '@tabler/icons-react';

export default function CommentStatCard({
  icon: Icon,
  color,
  label,
  count,
}: {
  icon: Icon;
  color: string;
  label: string;
  count: number;
}) {
  return (
    <div className='flex items-center rounded-2xl border shadow-xs p-6 gap-6'>
      <div
        className={`rounded-full p-4 text-2xl`}
        style={{ color: color, backgroundColor: `${color}25` }}
      >
        <Icon className='w-[1.5em]! h-[1.5em]!' />
      </div>
      <div className='grid space-y-2'>
        <span className=' text-xl'>{label}</span>
        <h3 className='text-4xl font-bold'>{count}</h3>
      </div>
    </div>
  );
}

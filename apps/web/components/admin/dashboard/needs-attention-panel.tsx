'use client';

import NeedsAttentionCard from './needs-attention-card';

export default function NeedsAttentionPanel() {
  const cards = [
    {
      id: 1,
      location: '123 Main St, Springfield',
      description:
        'Broken streetlight near the intersection causing visibility issues at night.',
      reportedAt: '2024-03-15T08:30:00Z',
      confirms: 7,
    },
    {
      id: 2,
      location: '456 Elm Ave, Shelbyville',
      description:
        'Large pothole in the middle of the road damaging vehicles passing through.',
      reportedAt: '2024-03-18T14:15:00Z',
      confirms: 12,
    },
    {
      id: 3,
      location: '789 Oak Blvd, Capital City',
      description:
        'Overflowing trash bins at the park entrance attracting pests.',
      reportedAt: '2024-03-20T09:45:00Z',
      confirms: 4,
    },
    {
      id: 4,
      location: '321 Pine Rd, Ogdenville',
      description:
        'Graffiti on the underpass wall along the pedestrian walkway.',
      reportedAt: '2024-03-22T11:00:00Z',
      confirms: 2,
    },
    {
      id: 5,
      location: '654 Maple Dr, North Haverbrook',
      description:
        "Fallen tree blocking the bike lane after last night's storm.",
      reportedAt: '2024-03-25T07:20:00Z',
      confirms: 9,
    },
  ];

  return (
    <div className='flex flex-col rounded-2xl border shadow-xs p-4 gap-4 h-full'>
      {/*header*/}
      <div className='flex flex-col'>
        <div className='flex items-center gap-2'>
          <div className='relative flex'>
            <div className='relative size-2 shrink-0 rounded-full bg-[#FB2C36]' />
            <div className='absolute animate-ping size-2 shrink-0 rounded-full bg-[#FB2C36]' />
          </div>

          <h3 className='font-poppins font-medium text-lg'>NEEDS ATTENTION</h3>
        </div>
        <span className='opacity-50'>
          Reports that require your attention. Please review and take necessary
          actions.
        </span>
      </div>

      <div className='space-y-4 overflow-y-auto'>
        {cards.map((card) => (
          <NeedsAttentionCard key={card.id} {...card} />
        ))}
      </div>
    </div>
  );
}

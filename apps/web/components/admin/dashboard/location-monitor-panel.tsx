'use client';

import { useState } from 'react';
import {
  IconArrowRight,
  IconLocation,
  IconMapPinExclamation,
  IconShieldPin,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import AffectedLocationCard from './affected-location-card';
import SafetyLocationCard from './safety-location-card';

export default function LocationMonitorPanel() {
  const [activeTab, setActiveTab] = useState('affected');

  const link = activeTab === 'affected' ? '/admin/reports' : '/admin/safety';

  return (
    <div className='flex flex-col rounded-2xl border shadow-xs p-4 gap-4 h-full'>
      {/*header*/}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <IconLocation className='size-[1.5em]! shrink-0 text-[#0066CC]' />
          <h3 className='font-poppins font-medium text-lg'>LOCATION MONITOR</h3>
        </div>

        <Link href={link}>
          <Button
            variant='outline'
            size='sm'
            className='font-poppins flex items-center gap-2 border-[#0066CC] bg-white text-[#0066CC] hover:bg-[#0066CC10] hover:text-[#0066CC]'
          >
            <span>VIEW ALL</span>
            <IconArrowRight className='size-[1.25em]! shrink-0' />
          </Button>
        </Link>
      </div>

      <Tabs
        defaultValue='affected'
        className='flex-1 flex flex-col h-full min-h-0'
        onValueChange={(value) => setActiveTab(value)}
      >
        <div className='w-full border-b'>
          <TabsList variant='line' className='font-poppins w-full'>
            <TabsTrigger
              value='affected'
              className='data-[state=active]:text-[#0066CC]
                      data-[state=active]:after:bg-[#0066CC] text-base'
            >
              <IconMapPinExclamation className='size-[1.5em]! shrink-0' />
              <span className='font-medium'> AFFECTED LOCATIONS</span>
            </TabsTrigger>
            <TabsTrigger
              value='safety'
              className='data-[state=active]:text-[#0066CC]
                      data-[state=active]:after:bg-[#0066CC] text-base'
            >
              <IconShieldPin className='size-[1.5em]! shrink-0' />
              <span className='font-medium'>SAFETY LOCATIONS</span>
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent
          value='affected'
          className='flex-1 flex flex-col min-h-0 space-y-4 mt-4 overflow-y-auto'
        >
          <AffectedLocationCard
            severity='critical'
            location='Barangay 176'
            description='Water level exceeded critical threshold. Immediate evacuation required for Zone A and B.'
            reportedAt='2026-01-28T10:30:00Z'
          />
          <AffectedLocationCard
            severity='critical'
            location='Barangay 176'
            description='Water level exceeded critical threshold. Immediate evacuation required for Zone A and B.'
            reportedAt='2026-01-28T10:30:00Z'
          />
          <AffectedLocationCard
            severity='critical'
            location='Barangay 176'
            description='Water level exceeded critical threshold. Immediate evacuation required for Zone A and B.'
            reportedAt='2026-01-28T10:30:00Z'
          />
        </TabsContent>
        <TabsContent
          value='safety'
          className='flex-1 flex flex-col min-h-0 space-y-4 mt-4 overflow-y-auto'
        >
          <SafetyLocationCard
            type='hospital'
            name='dito'
            address='Doon'
            availability='pwede'
          />
          <SafetyLocationCard
            type='hospital'
            name='dito'
            address='Doon'
            availability='pwede'
          />
          <SafetyLocationCard
            type='hospital'
            name='dito'
            address='Doon'
            availability='pwede'
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

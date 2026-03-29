'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AffectedLocationsTab from '@/components/admin/map/affected-locations-tab';
import SafetyLocationsTab from '@/components/admin/map/safety-locations-tab';
import { useMapFilterAdmin } from '@/contexts/map-filter-admin-context';

export default function MapRight() {
  const { activeTab, setActiveTab } = useMapFilterAdmin();

  return (
    <div className='flex-1 min-h-0 rounded-2xl overflow-hidden'>
      <Tabs
        defaultValue={activeTab}
        className='flex-1 flex flex-col h-full min-h-0'
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList className='w-full bg-[#EFF6FF] py-7 px-1.5 space-x-1.5'>
          <TabsTrigger
            value='affected'
            className='font-poppins data-[state=active]:bg-[#0066CC] data-[state=active]:text-white hover:bg-[#DBEAFE] py-5'
          >
            AFFECTED LOCATIONS
          </TabsTrigger>
          <TabsTrigger
            value='safe'
            className='font-poppins data-[state=active]:bg-[#0066CC] data-[state=active]:text-white hover:bg-[#DBEAFE] py-5'
          >
            SAFETY LOCATIONS
          </TabsTrigger>
        </TabsList>

        {/* Affected Location */}
        <TabsContent
          value='affected'
          className='flex-1 flex flex-col space-y-2 min-h-0'
        >
          <AffectedLocationsTab />
        </TabsContent>

        {/* Safe Zone */}
        <TabsContent
          value='safe'
          className='flex-1 flex flex-col space-y-2 min-h-0'
        >
          <SafetyLocationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

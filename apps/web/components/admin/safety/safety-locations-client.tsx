'use client';

import SafetyLocationsDialogProvider from '@/contexts/safety-locations-dialog-context';
import ViewSafetyLocationDialog from './view-safety-location-dialog';

export default function SafetyLocationsClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SafetyLocationsDialogProvider>
      {children}
      <ViewSafetyLocationDialog />
    </SafetyLocationsDialogProvider>
  );
}

'use client';

import SafetyLocationDialogProvider from '@/contexts/safety-location-dialog-context';
import ViewSafetyLocationDialog from './view-safety-location-dialog';
import DeleteSafetyLocationDialog from './delete-safety-location-dialog';
import EditSafetyLocationDialog from './edit-safety-location-dialog';

export default function SafetyLocationsClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SafetyLocationDialogProvider>
      {children}
      <ViewSafetyLocationDialog />
      <EditSafetyLocationDialog />
      <DeleteSafetyLocationDialog />
    </SafetyLocationDialogProvider>
  );
}

import SettingsLeft from '@/components/admin/settings/settings-left';
import SettingsRight from '@/components/admin/settings/settings-right';

export default function SettingsPage() {
  return (
    <div className='flex-1 flex flex-col bg-white p-8 rounded-2xl gap-8 min-h-0'>
      {/* Header */}
      <div className='space-y-2'>
        <h1 className='font-poppins text-3xl font-bold'>SETTINGS</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className='grid grid-cols-2 gap-4 h-full'>
        {/* left side */}
        <SettingsLeft />

        {/* right side */}
        <SettingsRight />
      </div>
    </div>
  );
}

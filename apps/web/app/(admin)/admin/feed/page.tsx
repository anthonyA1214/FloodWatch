import CommunityFeedLeft from '@/components/admin/feed/community-feed-left';
import CommunityFeedRight from '@/components/admin/feed/community-feed-right';
import SearchBar from '@/components/admin/feed/search-bar';
import { CommunityFeedProvider } from '@/contexts/community-feed-context';

export default async function CommunityFeedPage() {
  return (
    <CommunityFeedProvider>
      <div className='flex-1 flex flex-col bg-white p-8 rounded-2xl gap-8 min-h-0'>
        {/* Header */}
        <h1 className='font-poppins text-3xl font-bold'>COMMUNITY FEED</h1>
        <SearchBar />

        <div className='flex-1 flex gap-4 min-h-0'>
          <CommunityFeedLeft />
          <CommunityFeedRight />
        </div>
      </div>
    </CommunityFeedProvider>
  );
}

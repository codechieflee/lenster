import QueuedPublication from '@components/Publication/QueuedPublication';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { Card } from '@components/UI/Card';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import InfiniteLoader from '@components/UI/InfiniteLoader';
import { CollectionIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import { SCROLL_THRESHOLD } from 'data/constants';
import type { FeedHighlightsRequest, Publication } from 'lens';
import { useFeedHighlightsQuery } from 'lens';
import type { FC } from 'react';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAppStore } from 'src/store/app';
import { useTransactionPersistStore } from 'src/store/transaction';

const Highlights: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const txnQueue = useTransactionPersistStore((state) => state.txnQueue);
  const [hasMore, setHasMore] = useState(true);

  // Variables
  const request: FeedHighlightsRequest = { profileId: currentProfile?.id, limit: 10 };
  const reactionRequest = currentProfile ? { profileId: currentProfile?.id } : null;
  const profileId = currentProfile?.id ?? null;

  const { data, loading, error, fetchMore } = useFeedHighlightsQuery({
    variables: { request, reactionRequest, profileId }
  });

  const publications = data?.feedHighlights?.items;
  const pageInfo = data?.feedHighlights?.pageInfo;

  const loadMore = async () => {
    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next }, reactionRequest, profileId }
    }).then(({ data }) => {
      setHasMore(data?.feedHighlights?.items?.length > 0);
    });
  };

  if (loading) {
    return <PublicationsShimmer />;
  }

  if (publications?.length === 0) {
    return <EmptyState message={t`No posts yet!`} icon={<CollectionIcon className="text-brand h-8 w-8" />} />;
  }

  if (error) {
    return <ErrorMessage title={t`Failed to load highlights`} error={error} />;
  }

  return (
    <InfiniteScroll
      dataLength={publications?.length ?? 0}
      scrollThreshold={SCROLL_THRESHOLD}
      hasMore={hasMore}
      next={loadMore}
      loader={<InfiniteLoader />}
    >
      <Card className="divide-y-[1px] dark:divide-gray-700">
        {txnQueue.map(
          (txn) =>
            txn?.type === 'NEW_POST' && (
              <div key={txn.id}>
                <QueuedPublication txn={txn} />
              </div>
            )
        )}
        {publications?.map((publication, index) => (
          <SinglePublication key={`${publication?.id}_${index}`} publication={publication as Publication} />
        ))}
      </Card>
    </InfiniteScroll>
  );
};

export default Highlights;

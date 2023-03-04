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
import type { FeedItem, FeedRequest, Publication } from 'lens';
import { FeedEventItemType, useTimelineQuery } from 'lens';
import type { FC } from 'react';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAppStore } from 'src/store/app';
import { useTimelinePersistStore, useTimelineStore } from 'src/store/timeline';
import { useTransactionPersistStore } from 'src/store/transaction';

const Timeline: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const txnQueue = useTransactionPersistStore((state) => state.txnQueue);
  const feedEventFilters = useTimelinePersistStore((state) => state.feedEventFilters);
  const seeThroughProfile = useTimelineStore((state) => state.seeThroughProfile);
  const [hasMore, setHasMore] = useState(true);

  const getFeedEventItems = () => {
    const filters: FeedEventItemType[] = [];
    if (feedEventFilters.posts) {
      filters.push(FeedEventItemType.Post, FeedEventItemType.Comment);
    }
    if (feedEventFilters.collects) {
      filters.push(FeedEventItemType.CollectPost, FeedEventItemType.CollectComment);
    }
    if (feedEventFilters.mirrors) {
      filters.push(FeedEventItemType.Mirror);
    }
    if (feedEventFilters.likes) {
      filters.push(FeedEventItemType.ReactionPost, FeedEventItemType.ReactionComment);
    }
    return filters;
  };

  // Variables
  const profileId = seeThroughProfile?.id ?? currentProfile?.id;
  const request: FeedRequest = { profileId, limit: 50, feedEventItemTypes: getFeedEventItems() };
  const reactionRequest = currentProfile ? { profileId } : null;

  const { data, loading, error, fetchMore } = useTimelineQuery({
    variables: { request, reactionRequest, profileId }
  });

  const publications = data?.feed?.items;
  const pageInfo = data?.feed?.pageInfo;

  const loadMore = async () => {
    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next }, reactionRequest, profileId }
    }).then(({ data }) => {
      setHasMore(data?.feed?.items?.length > 0);
    });
  };

  if (loading) {
    return <PublicationsShimmer />;
  }

  if (publications?.length === 0) {
    return <EmptyState message={t`No posts yet!`} icon={<CollectionIcon className="text-brand h-8 w-8" />} />;
  }

  if (error) {
    return <ErrorMessage title={t`Failed to load timeline`} error={error} />;
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
          <SinglePublication
            key={`${publication?.root.id}_${index}`}
            feedItem={publication as FeedItem}
            publication={publication.root as Publication}
          />
        ))}
      </Card>
    </InfiniteScroll>
  );
};

export default Timeline;

import { useQuery } from '@apollo/client';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { Card } from '@components/UI/Card';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Spinner } from '@components/UI/Spinner';
import type { LensterPublication } from '@generated/lenstertypes';
import { CustomFiltersTypes, ExploreFeedDocument, PublicationSortCriteria } from '@generated/types';
import { CollectionIcon } from '@heroicons/react/outline';
import { Leafwatch } from '@lib/leafwatch';
import type { FC } from 'react';
import { useInView } from 'react-cool-inview';
import { PAGINATION_ROOT_MARGIN } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { PAGINATION } from 'src/tracking';

interface Props {
  focus?: any;
  feedType?: PublicationSortCriteria;
}

const Feed: FC<Props> = ({ focus, feedType = PublicationSortCriteria.CuratedProfiles }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  // Variables
  const request = {
    sortCriteria: feedType,
    noRandomize: feedType === 'LATEST',
    customFilters: [CustomFiltersTypes.Gardeners],
    metadata: focus ? { mainContentFocus: focus } : null,
    limit: 10
  };
  const reactionRequest = currentProfile ? { profileId: currentProfile?.id } : null;
  const profileId = currentProfile?.id ?? null;

  const { data, loading, error, fetchMore } = useQuery(ExploreFeedDocument, {
    variables: { request, reactionRequest, profileId },
    fetchPolicy: 'no-cache'
  });

  const publications = data?.explorePublications?.items;
  const pageInfo = data?.explorePublications?.pageInfo;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView) {
        return;
      }

      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next }, reactionRequest, profileId }
      });
      Leafwatch.track(PAGINATION.EXPLORE_FEED);
    },
    rootMargin: PAGINATION_ROOT_MARGIN
  });

  if (loading) {
    return <PublicationsShimmer />;
  }

  if (publications?.length === 0) {
    return (
      <EmptyState
        message={<div>No posts yet!</div>}
        icon={<CollectionIcon className="w-8 h-8 text-brand" />}
      />
    );
  }

  if (error) {
    return <ErrorMessage title="Failed to load explore feed" error={error} />;
  }

  return (
    <>
      <Card className="divide-y-[1px] dark:divide-gray-700/80">
        {publications?.map((publication, index: number) => (
          <SinglePublication
            key={`${publication.id}_${index}`}
            publication={publication as LensterPublication}
          />
        ))}
      </Card>
      {pageInfo?.next && publications?.length !== pageInfo.totalCount && (
        <span ref={observe} className="flex justify-center p-5">
          <Spinner size="sm" />
        </span>
      )}
    </>
  );
};

export default Feed;

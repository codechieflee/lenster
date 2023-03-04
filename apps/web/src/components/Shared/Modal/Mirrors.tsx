import UserProfile from '@components/Shared/UserProfile';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import InfiniteLoader from '@components/UI/InfiniteLoader';
import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import { SCROLL_THRESHOLD } from 'data/constants';
import type { Profile, ProfileQueryRequest } from 'lens';
import { useMirrorsQuery } from 'lens';
import type { FC } from 'react';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { FollowSource } from '../Follow';
import Loader from '../Loader';

interface Props {
  publicationId: string;
}

const Mirrors: FC<Props> = ({ publicationId }) => {
  const [hasMore, setHasMore] = useState(true);

  // Variables
  const request: ProfileQueryRequest = { whoMirroredPublicationId: publicationId, limit: 10 };

  const { data, loading, error, fetchMore } = useMirrorsQuery({
    variables: { request },
    skip: !publicationId
  });

  const profiles = data?.profiles?.items;
  const pageInfo = data?.profiles?.pageInfo;

  const loadMore = async () => {
    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    }).then(({ data }) => {
      setHasMore(data?.profiles?.items?.length > 0);
    });
  };

  if (loading) {
    return <Loader message={t`Loading mirrors`} />;
  }

  if (profiles?.length === 0) {
    return (
      <div className="p-5">
        <EmptyState
          message={t`No mirrors.`}
          icon={<SwitchHorizontalIcon className="text-brand h-8 w-8" />}
          hideCard
        />
      </div>
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto" id="scrollableMirrorsDiv">
      <ErrorMessage className="m-5" title={t`Failed to load mirrors`} error={error} />
      <InfiniteScroll
        dataLength={profiles?.length ?? 0}
        scrollThreshold={SCROLL_THRESHOLD}
        hasMore={hasMore}
        next={loadMore}
        loader={<InfiniteLoader />}
        scrollableTarget="scrollableMirrorsDiv"
      >
        <div className="divide-y dark:divide-gray-700">
          {profiles?.map((profile, index) => (
            <div className="p-5" key={profile?.id}>
              <UserProfile
                profile={profile as Profile}
                isFollowing={profile?.isFollowedByMe}
                followPosition={index + 1}
                followSource={FollowSource.MIRRORS_MODAL}
                showBio
                showFollow
                showUserPreview={false}
              />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Mirrors;

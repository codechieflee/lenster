import { FollowSource } from '@components/Shared/Follow';
import Loader from '@components/Shared/Loader';
import UserProfile from '@components/Shared/UserProfile';
import WalletProfile from '@components/Shared/WalletProfile';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import InfiniteLoader from '@components/UI/InfiniteLoader';
import { UsersIcon } from '@heroicons/react/outline';
import formatHandle from '@lib/formatHandle';
import { t, Trans } from '@lingui/macro';
import { SCROLL_THRESHOLD } from 'data/constants';
import type { FollowersRequest, Profile, Wallet } from 'lens';
import { useFollowersQuery } from 'lens';
import type { FC } from 'react';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

interface Props {
  profile: Profile;
}

const Followers: FC<Props> = ({ profile }) => {
  const [hasMore, setHasMore] = useState(true);

  // Variables
  const request: FollowersRequest = { profileId: profile?.id, limit: 10 };

  const { data, loading, error, fetchMore } = useFollowersQuery({
    variables: { request },
    skip: !profile?.id
  });

  const followers = data?.followers?.items;
  const pageInfo = data?.followers?.pageInfo;

  const loadMore = async () => {
    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    }).then(({ data }) => {
      setHasMore(data?.followers?.items?.length > 0);
    });
  };

  if (loading) {
    return <Loader message={t`Loading followers`} />;
  }

  if (followers?.length === 0) {
    return (
      <EmptyState
        message={
          <div>
            <span className="mr-1 font-bold">@{formatHandle(profile?.handle)}</span>
            <span>
              <Trans>doesn’t have any followers yet.</Trans>
            </span>
          </div>
        }
        icon={<UsersIcon className="text-brand h-8 w-8" />}
        hideCard
      />
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto" id="scrollableFollowersDiv">
      <ErrorMessage className="m-5" title={t`Failed to load followers`} error={error} />
      <InfiniteScroll
        dataLength={followers?.length ?? 0}
        scrollThreshold={SCROLL_THRESHOLD}
        hasMore={hasMore}
        next={loadMore}
        loader={<InfiniteLoader />}
        scrollableTarget="scrollableFollowersDiv"
      >
        <div className="divide-y dark:divide-gray-700">
          {followers?.map((follower, index) => (
            <div className="p-5" key={follower?.wallet?.defaultProfile?.id}>
              {follower?.wallet?.defaultProfile ? (
                <UserProfile
                  profile={follower?.wallet?.defaultProfile as Profile}
                  isFollowing={follower?.wallet?.defaultProfile?.isFollowedByMe}
                  followPosition={index + 1}
                  followSource={FollowSource.FOLLOWERS_MODAL}
                  showBio
                  showFollow
                  showUserPreview={false}
                />
              ) : (
                <WalletProfile wallet={follower?.wallet as Wallet} />
              )}
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Followers;

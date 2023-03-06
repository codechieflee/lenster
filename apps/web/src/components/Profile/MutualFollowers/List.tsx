import { FollowSource } from '@components/Shared/Follow';
import Loader from '@components/Shared/Loader';
import UserProfile from '@components/Shared/UserProfile';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import InfiniteLoader from '@components/UI/InfiniteLoader';
import { t } from '@lingui/macro';
import { SCROLL_THRESHOLD } from 'data/constants';
import type { MutualFollowersProfilesQueryRequest, Profile } from 'lens';
import { useMutualFollowersListQuery } from 'lens';
import type { FC } from 'react';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAppStore } from 'src/store/app';

interface Props {
  profileId: string;
}

const MutualFollowersList: FC<Props> = ({ profileId }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [hasMore, setHasMore] = useState(true);

  // Variables
  const request: MutualFollowersProfilesQueryRequest = {
    viewingProfileId: profileId,
    yourProfileId: currentProfile?.id,
    limit: 10
  };

  const { data, loading, error, fetchMore } = useMutualFollowersListQuery({
    variables: { request },
    skip: !profileId
  });

  const profiles = data?.mutualFollowersProfiles?.items;
  const pageInfo = data?.mutualFollowersProfiles?.pageInfo;

  const loadMore = async () => {
    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    }).then(({ data }) => {
      setHasMore(data?.mutualFollowersProfiles?.items?.length > 0);
    });
  };

  if (loading) {
    return <Loader message={t`Loading mutual followers`} />;
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto" id="scrollableMutualListDiv">
      <ErrorMessage className="m-5" title={t`Failed to load mutual followers`} error={error} />
      <InfiniteScroll
        dataLength={profiles?.length ?? 0}
        scrollThreshold={SCROLL_THRESHOLD}
        hasMore={hasMore}
        next={loadMore}
        loader={<InfiniteLoader />}
        scrollableTarget="scrollableMutualListDiv"
      >
        <div className="divide-y dark:divide-gray-700">
          {profiles?.map((profile, index) => (
            <div className="p-5" key={profile?.id}>
              <UserProfile
                profile={profile as Profile}
                isFollowing={profile?.isFollowedByMe}
                followPosition={index + 1}
                followSource={FollowSource.MUTUAL_FOLLOWERS_MODAL}
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

export default MutualFollowersList;

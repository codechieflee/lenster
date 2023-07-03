import UserProfile from '@components/Shared/UserProfile';
import { HeartIcon } from '@heroicons/react/outline';
import { FollowUnfollowSource } from '@lenster/data/tracking';
import type { Profile, WhoReactedPublicationRequest } from '@lenster/lens';
import { useLikesQuery } from '@lenster/lens';
import { EmptyState, ErrorMessage } from '@lenster/ui';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import { Virtuoso } from 'react-virtuoso';

import Loader from '../Loader';

interface LikesProps {
  publicationId: string;
}

const Likes: FC<LikesProps> = ({ publicationId }) => {
  // Variables
  const request: WhoReactedPublicationRequest = {
    publicationId: publicationId,
    limit: 10
  };

  const { data, loading, error, fetchMore } = useLikesQuery({
    variables: { request },
    skip: !publicationId
  });

  const profiles = data?.whoReactedPublication?.items;
  const pageInfo = data?.whoReactedPublication?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (!hasMore) {
      return;
    }

    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    });
  };

  if (loading) {
    return <Loader message={t`Loading likes`} />;
  }

  if (profiles?.length === 0) {
    return (
      <div className="p-5">
        <EmptyState
          message={t`No likes.`}
          icon={<HeartIcon className="text-brand h-8 w-8" />}
          hideCard
        />
      </div>
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto" data-testid="likes-modal">
      <ErrorMessage
        className="m-5"
        title={t`Failed to load likes`}
        error={error}
      />
      <Virtuoso
        className="virtual-profile-list"
        data={profiles}
        endReached={onEndReached}
        itemContent={(index, like) => {
          return (
            <div className="p-5">
              <UserProfile
                profile={like?.profile as Profile}
                isFollowing={like?.profile?.isFollowedByMe}
                followUnfollowPosition={index + 1}
                followUnfollowSource={FollowUnfollowSource.LIKES_MODAL}
                showBio
                showFollow
                showUserPreview={false}
              />
            </div>
          );
        }}
      />
    </div>
  );
};

export default Likes;

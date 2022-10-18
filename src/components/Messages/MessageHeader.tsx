import Unfollow from '@components/Shared/Unfollow';
import UserProfile from '@components/Shared/UserProfile';
import type { Profile } from '@generated/types';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

import Follow from '../Shared/Follow';

interface Props {
  profile?: Profile;
}

const MessageHeader: FC<Props> = ({ profile }) => {
  const [following, setFollowing] = useState(true);

  useEffect(() => {
    setFollowing(profile?.isFollowedByMe ?? false);
  }, [profile?.isFollowedByMe, profile]);

  if (!profile) {
    return null;
  }

  return (
    <div className="dark:border-gray-700/80 flex justify-between flex-1 px-4 py-2 border-b-[1px]">
      <UserProfile profile={profile} />
      <div className="flex items-center">
        {!following ? (
          <Follow showText profile={profile} setFollowing={setFollowing} />
        ) : (
          <Unfollow showText profile={profile} setFollowing={setFollowing} />
        )}
      </div>
    </div>
  );
};

export default MessageHeader;

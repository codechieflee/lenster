import { UsersIcon } from '@heroicons/react/outline';
import { PROFILE } from '@lenster/data/tracking';
import type { Profile } from '@lenster/lens';
import humanize from '@lenster/lib/humanize';
import { Modal } from '@lenster/ui';
import { Mixpanel } from '@lib/mixpanel';
import { Plural, t } from '@lingui/macro';
import type { FC } from 'react';
import { useState } from 'react';

import Followers from './Followers';
import Following from './Following';

interface FolloweringsProps {
  profile: Profile;
}

const Followerings: FC<FolloweringsProps> = ({ profile }) => {
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);

  return (
    <div className="flex gap-8">
      <button
        type="button"
        className="text-left"
        onClick={() => {
          setShowFollowingModal(!showFollowingModal);
          Mixpanel.track(PROFILE.OPEN_FOLLOWING, {
            profile_id: profile.id
          });
        }}
        data-testid="profile-followings"
      >
        <div className="text-xl">
          {humanize(profile?.stats?.totalFollowing)}
        </div>
        <div className="lt-text-gray-500">
          <Plural
            value={profile?.stats?.totalFollowing}
            zero="Following"
            one="Following"
            other="Following"
          />
        </div>
      </button>
      <button
        type="button"
        className="text-left"
        onClick={() => {
          setShowFollowersModal(!showFollowersModal);
          Mixpanel.track(PROFILE.OPEN_FOLLOWERS, {
            profile_id: profile.id
          });
        }}
        data-testid="profile-followers"
      >
        <div className="text-xl">
          {humanize(profile?.stats?.totalFollowers)}
        </div>
        <div className="lt-text-gray-500">
          <Plural
            value={profile?.stats?.totalFollowers}
            zero="Follower"
            one="Follower"
            other="Followers"
          />
        </div>
      </button>
      <Modal
        title={t`Following`}
        icon={<UsersIcon className="text-brand h-5 w-5" />}
        show={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
      >
        <Following profile={profile} />
      </Modal>
      <Modal
        title={t`Followers`}
        icon={<UsersIcon className="text-brand h-5 w-5" />}
        show={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
      >
        <Followers profile={profile} />
      </Modal>
    </div>
  );
};

export default Followerings;

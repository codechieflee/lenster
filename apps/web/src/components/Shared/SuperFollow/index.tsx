import { StarIcon } from '@heroicons/react/outline';
import { PROFILE } from '@lenster/data/tracking';
import type { Profile } from '@lenster/lens';
import formatHandle from '@lenster/lib/formatHandle';
import { Button, Modal } from '@lenster/ui';
import { Mixpanel } from '@lib/mixpanel';
import { t } from '@lingui/macro';
import dynamic from 'next/dynamic';
import type { Dispatch, FC } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';
import { useGlobalModalStateStore } from 'src/store/modals';

import Loader from '../Loader';
import Slug from '../Slug';

const FollowModule = dynamic(() => import('./FollowModule'), {
  loading: () => <Loader message={t`Loading super follow`} />
});

interface SuperFollowProps {
  profile: Profile;
  setFollowing: Dispatch<boolean>;
  showText?: boolean;
  again?: boolean;

  // For data analytics
  followUnfollowPosition?: number;
  followUnfollowSource?: string;
}

const SuperFollow: FC<SuperFollowProps> = ({
  profile,
  setFollowing,
  showText = false,
  again = false,
  followUnfollowPosition,
  followUnfollowSource
}) => {
  const [showFollowModal, setShowFollowModal] = useState(false);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setShowAuthModal = useGlobalModalStateStore(
    (state) => state.setShowAuthModal
  );

  return (
    <>
      <Button
        className="!px-3 !py-1.5 text-sm"
        variant="super"
        outline
        onClick={() => {
          if (!currentProfile) {
            setShowAuthModal(true);
            return;
          }
          setShowFollowModal(!showFollowModal);
          Mixpanel.track(PROFILE.OPEN_SUPER_FOLLOW);
        }}
        aria-label="Super Follow"
        icon={<StarIcon className="h-4 w-4" />}
      >
        {showText && t`Super follow`}
      </Button>
      <Modal
        title={
          <span>
            Super follow{' '}
            <Slug slug={formatHandle(profile?.handle)} prefix="@" />{' '}
            {again ? 'again' : ''}
          </span>
        }
        icon={<StarIcon className="h-5 w-5 text-pink-500" />}
        show={showFollowModal}
        onClose={() => setShowFollowModal(false)}
      >
        <FollowModule
          profile={profile}
          setFollowing={setFollowing}
          setShowFollowModal={setShowFollowModal}
          again={again}
          followUnfollowPosition={followUnfollowPosition}
          followUnfollowSource={followUnfollowSource}
        />
      </Modal>
    </>
  );
};

export default SuperFollow;

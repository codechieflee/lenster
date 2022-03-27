import { Modal } from '@components/UI/Modal'
import { Profile } from '@generated/types'
import { UsersIcon } from '@heroicons/react/outline'
import { humanize } from '@lib/humanize'
import React, { useState } from 'react'

import Followers from './Followers'
import Following from './Following'

interface Props {
  profile: Profile
}

const Followerings: React.FC<Props> = ({ profile }) => {
  const [showFollowingModal, setShowFollowingModal] = useState<boolean>(false)
  const [showFollowersModal, setShowFollowersModal] = useState<boolean>(false)

  return (
    <div className="flex gap-5">
      <div
        className="cursor-pointer"
        onClick={() => setShowFollowingModal(!showFollowingModal)}
      >
        <div className="text-xl">
          {humanize(profile?.stats?.totalFollowing)}
        </div>
        <div className="text-gray-500">Following</div>
      </div>
      <div
        className="cursor-pointer"
        onClick={() => setShowFollowersModal(!showFollowersModal)}
      >
        <div className="text-xl">
          {humanize(profile?.stats?.totalFollowers)}
        </div>
        <div className="text-gray-500">Followers</div>
      </div>
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <UsersIcon className="w-5 h-5 text-brand-500" />
            <div>Following</div>
          </div>
        }
        size="md"
        show={showFollowingModal}
        onClose={() => setShowFollowingModal(!showFollowingModal)}
      >
        <Following profile={profile} />
      </Modal>
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <UsersIcon className="w-5 h-5 text-brand-500" />
            <div>Followers</div>
          </div>
        }
        size="md"
        show={showFollowersModal}
        onClose={() => setShowFollowersModal(!showFollowersModal)}
      >
        <Followers profile={profile} />
      </Modal>
    </div>
  )
}

export default Followerings

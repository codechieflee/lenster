import { useMutation } from '@apollo/client'
import { HIDE_POST_MUTATION } from '@components/Post/Actions/Menu/Delete'
import { Button } from '@components/UI/Button'
import { WarningMessage } from '@components/UI/WarningMessage'
import { Community } from '@generated/lenstertypes'
import { TrashIcon } from '@heroicons/react/outline'
import trackEvent from '@lib/trackEvent'
import React, { FC } from 'react'

interface Props {
  community: Community
}

const Settings: FC<Props> = ({ community }) => {
  const [hidePost] = useMutation(HIDE_POST_MUTATION, {
    onCompleted() {
      trackEvent('delete community')
    }
  })

  return (
    <div className="p-5 space-y-5">
      <div>
        <WarningMessage message="Only delete settings is available now, you can't edit any part of the community right now!" />
      </div>
      <div className="space-y-2">
        <div className="font-bold text-red-500">Danger Zone</div>
        <p>
          Deleting your community will delete only from indexers and not from
          the blockchain.
        </p>
        <Button
          className="!mt-5"
          icon={<TrashIcon className="h-5 w-5" />}
          variant="danger"
          onClick={() => {
            if (confirm('Are you sure you want to delete?')) {
              hidePost({
                variables: { request: { publicationId: community?.id } }
              })
            }
          }}
        >
          Delete Community
        </Button>
      </div>
    </div>
  )
}

export default Settings

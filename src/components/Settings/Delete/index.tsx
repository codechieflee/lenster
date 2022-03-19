import LensHubProxy from '@abis/LensHubProxy.json'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import { TrashIcon } from '@heroicons/react/outline'
import React, { useContext } from 'react'
import toast from 'react-hot-toast'
import { LENSHUB_PROXY } from 'src/constants'
import Custom404 from 'src/pages/404'
import { useContractWrite } from 'wagmi'

import Sidebar from '../Sidebar'

const DeleteSettings: React.FC = () => {
  const { currentUser } = useContext(AppContext)

  const [{ loading: writeLoading }, write] = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'burn'
  )

  const handleDelete = () => {
    var confirm = prompt('Type (delete) to confirm')
    if (confirm === 'delete') {
      write({ args: [currentUser?.id] }).then(({ error }) => {
        if (!error) {
          localStorage.setItem('selectedProfile', '0')
          location.href = '/'
        }
      })
    } else {
      toast.success('You cancelled the operation!')
    }
  }

  if (!currentUser) return <Custom404 />

  return (
    <GridLayout>
      <GridItemFour>
        <Sidebar />
      </GridItemFour>
      <GridItemEight>
        <Card>
          <CardBody className="space-y-5 linkify">
            <div className="text-lg font-bold text-red-500">
              Delete your account
            </div>
            <p>
              Deleting your account is permanent. All your data will be wiped
              out immediately and you won't be able to get it back.
            </p>
            <Button
              variant="danger"
              icon={
                writeLoading ? (
                  <Spinner variant="danger" size="xs" />
                ) : (
                  <TrashIcon className="w-5 h-5" />
                )
              }
              onClick={handleDelete}
            >
              {writeLoading ? 'Deleting...' : 'Delete your account'}
            </Button>
          </CardBody>
        </Card>
      </GridItemEight>
    </GridLayout>
  )
}

export default DeleteSettings

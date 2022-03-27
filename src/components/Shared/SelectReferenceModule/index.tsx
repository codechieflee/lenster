import { Modal } from '@components/UI/Modal'
import { Tooltip } from '@components/UI/Tooltip'
import { GlobeAltIcon, UsersIcon } from '@heroicons/react/outline'
import { CheckCircleIcon } from '@heroicons/react/solid'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface Props {
  setOnlyFollowers: React.Dispatch<React.SetStateAction<any>>
  onlyFollowers: boolean
}

const SelectReferenceModule: React.FC<Props> = ({
  setOnlyFollowers,
  onlyFollowers
}) => {
  const [showModal, setShowModal] = useState<boolean>(false)

  return (
    <div>
      <Tooltip
        content={
          onlyFollowers ? 'Only followers can comment' : 'Everyone can comment'
        }
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          className="tab-focus-ring"
          onClick={() => setShowModal(!showModal)}
        >
          <div className="text-brand-500">
            {onlyFollowers ? (
              <UsersIcon className="w-5 h-5" />
            ) : (
              <GlobeAltIcon className="w-5 h-5" />
            )}
          </div>
        </motion.button>
      </Tooltip>
      <Modal
        onClose={() => setShowModal(!showModal)}
        title="Select who to comment"
        show={showModal}
      >
        <div className="dark:divide-gray-700">
          <div className="py-3.5 px-5 space-y-3">
            <button
              type="button"
              className={clsx(
                { 'border-green-500': !onlyFollowers },
                'w-full p-3 space-y-1 text-left border rounded-xl flex justify-between items-center'
              )}
              onClick={() => {
                setOnlyFollowers(false)
                setShowModal(false)
              }}
            >
              <div className="flex items-center space-x-3">
                <GlobeAltIcon className="w-5 h-5 text-brand-500" />
                <div>Everyone can comment</div>
              </div>
              {!onlyFollowers && (
                <CheckCircleIcon className="w-7 h-7 text-green-500" />
              )}
            </button>
            <button
              type="button"
              className={clsx(
                { 'border-green-500': onlyFollowers },
                'w-full p-3 space-y-1 text-left border rounded-xl flex justify-between items-center'
              )}
              onClick={() => {
                setOnlyFollowers(true)
                setShowModal(false)
              }}
            >
              <div className="flex items-center space-x-3">
                <UsersIcon className="w-5 h-5 text-brand-500" />
                <div>Only followers can comment</div>
              </div>
              {onlyFollowers && (
                <CheckCircleIcon className="w-7 h-7 text-green-500" />
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default SelectReferenceModule

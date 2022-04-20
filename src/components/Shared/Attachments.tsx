import { LensterAttachment } from '@generated/lenstertypes'
import { MediaSet } from '@generated/types'
import { XIcon } from '@heroicons/react/outline'
import getIPFSLink from '@lib/getIPFSLink'
import imagekitURL from '@lib/imagekitURL'
import clsx from 'clsx'
import React, { FC } from 'react'

const getGridRows = (attachments: number) => {
  if (attachments === 1) {
    return 'grid-cols-1 grid-rows-1 w-2/3'
  } else if (attachments === 2) {
    return 'grid-cols-2 grid-rows-1'
  } else if (attachments > 2) {
    return 'grid-cols-2 grid-rows-2'
  }
}

interface Props {
  attachments: any
  setAttachments?: any
  isNew?: boolean
}

const Attachments: FC<Props> = ({
  attachments,
  setAttachments,
  isNew = false
}) => {
  const removeAttachment = (attachment: any) => {
    const arr = attachments
    setAttachments(
      arr.filter(function (ele: any) {
        return ele != attachment
      })
    )
  }

  const slicedAttachments = attachments?.slice(0, 4)

  return slicedAttachments?.length !== 0 ? (
    <div
      className={clsx(
        getGridRows(slicedAttachments?.length),
        'grid grid-flow-col gap-2 pt-3'
      )}
    >
      {slicedAttachments?.map((attachment: LensterAttachment & MediaSet) => (
        <div
          className="aspect-w-16 aspect-h-12"
          key={isNew ? attachment.item : getIPFSLink(attachment.original.url)}
        >
          {(isNew ? attachment.type : attachment.original.mimeType) ===
          'video/mp4' ? (
            <video
              controls
              className="object-cover bg-gray-100 rounded-lg border dark:bg-gray-800 dark:border-gray-700/80"
            >
              <source
                src={
                  isNew ? attachment.item : getIPFSLink(attachment.original.url)
                }
                type="video/mp4"
              />
            </video>
          ) : (
            <img
              className="object-cover bg-gray-100 rounded-lg border dark:bg-gray-800 dark:border-gray-700/80"
              src={
                isNew
                  ? attachment.item
                  : imagekitURL(
                      getIPFSLink(attachment.original.url),
                      'attachment'
                    )
              }
              alt={
                isNew
                  ? attachment.item
                  : imagekitURL(
                      getIPFSLink(attachment.original.url),
                      'attachment'
                    )
              }
            />
          )}
          {isNew && (
            <div className="m-3">
              <button
                type="button"
                className="p-1.5 bg-gray-900 rounded-full opacity-75"
                onClick={() => removeAttachment(attachment)}
              >
                <XIcon className="w-4 h-4 text-white" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  ) : null
}

export default Attachments

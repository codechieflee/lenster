import { Wallet } from '@generated/types'
import formatAddress from '@lib/formatAddress'
import imagekitURL from '@lib/imagekitURL'
import React, { FC } from 'react'
import { POLYGONSCAN_URL } from 'src/constants'

interface Props {
  wallet: Wallet
}

export const NotificationWalletProfileAvatar: FC<Props> = ({ wallet }) => {
  return (
    <a
      href={`${POLYGONSCAN_URL}/address/${wallet?.address}`}
      target="_blank"
      rel="noreferrer noopener"
    >
      <img
        src={imagekitURL(
          `https://avatar.tobi.sh/${wallet?.address}.png`,
          'avatar'
        )}
        className="w-10 h-10 bg-gray-200 rounded-full border dark:border-gray-700/80"
        height={40}
        width={40}
        alt={wallet?.address}
      />
    </a>
  )
}

export const NotificationWalletProfileName: FC<Props> = ({ wallet }) => {
  return (
    <a
      className="inline-flex items-center space-x-1 font-bold"
      href={`${POLYGONSCAN_URL}/address/${wallet?.address}`}
      target="_blank"
      rel="noreferrer noopener"
    >
      <div>{formatAddress(wallet?.address)}</div>
    </a>
  )
}

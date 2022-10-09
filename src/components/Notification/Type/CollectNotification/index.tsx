import { NotificationProfileAvatar, NotificationProfileName } from '@components/Notification/Profile';
import {
  NotificationWalletProfileAvatar,
  NotificationWalletProfileName
} from '@components/Notification/WalletProfile';
import type { NewCollectNotification } from '@generated/types';
import { CollectionIcon } from '@heroicons/react/solid';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import type { FC } from 'react';

import CollectedAmount from './Amount';
import CollectedContent from './Content';

dayjs.extend(relativeTime);

interface Props {
  notification: NewCollectNotification;
}

const CollectNotification: FC<Props> = ({ notification }) => {
  return (
    <div className="flex justify-between items-start">
      <div className="space-y-2 w-4/5">
        <div className="flex items-center space-x-3">
          <CollectionIcon className="h-6 w-6 text-pink-500/70" />
          {notification?.wallet?.defaultProfile ? (
            <NotificationProfileAvatar profile={notification?.wallet?.defaultProfile} />
          ) : (
            <NotificationWalletProfileAvatar wallet={notification?.wallet} />
          )}
        </div>
        <div className="ml-9">
          {notification?.wallet?.defaultProfile ? (
            <NotificationProfileName profile={notification?.wallet?.defaultProfile} />
          ) : (
            <NotificationWalletProfileName wallet={notification?.wallet} />
          )}{' '}
          <span className="text-gray-600 dark:text-gray-400">collected your </span>
          <Link href={`/posts/${notification?.collectedPublication?.id}`} className="font-bold">
            {notification?.collectedPublication.__typename?.toLowerCase()}
          </Link>
          <CollectedContent notification={notification} />
          <CollectedAmount notification={notification} />
        </div>
      </div>
      <div className="text-gray-400 text-[12px]">{dayjs(new Date(notification?.createdAt)).fromNow()}</div>
    </div>
  );
};

export default CollectNotification;

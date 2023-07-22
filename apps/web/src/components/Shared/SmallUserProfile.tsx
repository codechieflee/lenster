import { BadgeCheckIcon, ExclamationCircleIcon } from '@heroicons/react/solid';
import type { Profile } from '@lenster/lens';
import formatHandle from '@lenster/lib/formatHandle';
import getAvatar from '@lenster/lib/getAvatar';
import hasMisused from '@lenster/lib/hasMisused';
import isVerified from '@lenster/lib/isVerified';
import sanitizeDisplayName from '@lenster/lib/sanitizeDisplayName';
import { Image } from '@lenster/ui';
import { formatTime, getTwitterFormat } from '@lib/formatTime';
import clsx from 'clsx';
import Link from 'next/link';
import type { FC } from 'react';
import { memo } from 'react';

import Slug from './Slug';

interface UserProfileProps {
  profile: Profile;
  timestamp?: Date;
  smallAvatar?: boolean;
}

const SmallUserProfile: FC<UserProfileProps> = ({
  profile,
  timestamp = '',
  smallAvatar = false
}) => {
  const UserAvatar = () => (
    <Image
      src={getAvatar(profile)}
      loading="lazy"
      className={clsx(
        smallAvatar ? 'h-5 w-5' : 'h-6 w-6',
        'rounded-full border bg-gray-200 dark:border-gray-700'
      )}
      height={smallAvatar ? 20 : 24}
      width={smallAvatar ? 20 : 24}
      alt={formatHandle(profile?.handle)}
    />
  );

  const UserName = () => (
    <div className="flex max-w-sm items-center">
      <div className="truncate">
        {sanitizeDisplayName(profile?.name) ?? formatHandle(profile?.handle)}
      </div>
      {isVerified(profile.id) && (
        <BadgeCheckIcon className="text-brand ml-1 h-4 w-4" />
      )}
      {hasMisused(profile.id) && (
        <ExclamationCircleIcon className="ml-1 h-4 w-4 text-red-500" />
      )}
      <Slug
        className="ml-2 text-sm"
        slug={formatHandle(profile?.handle)}
        prefix="@"
      />
      {timestamp ? (
        <span className="lt-text-gray-500">
          <span className="mx-1.5">·</span>
          <span className="text-xs" title={formatTime(timestamp as Date)}>
            {getTwitterFormat(timestamp)}
          </span>
        </span>
      ) : null}
    </div>
  );

  return (
    <Link href={`/u/${formatHandle(profile?.handle)}`}>
      <div className="flex items-center space-x-2">
        <UserAvatar />
        <UserName />
      </div>
    </Link>
  );
};

export default memo(SmallUserProfile);

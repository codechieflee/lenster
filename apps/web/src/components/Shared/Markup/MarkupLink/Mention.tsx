import { PUBLICATION } from '@lenster/data/tracking';
import type { Profile } from '@lenster/lens';
import formatHandle from '@lenster/lib/formatHandle';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import { PostHog } from '@lib/posthog';
import Link from 'next/link';
import type { FC } from 'react';
import type { MarkupLinkProps } from 'src/types';

import Slug from '../../Slug';
import UserPreview from '../../UserPreview';

const Mention: FC<MarkupLinkProps> = ({ href, title = href }) => {
  const handle = title?.slice(1);

  if (!handle) {
    return null;
  }

  const profile = {
    __typename: 'Profile',
    handle: handle,
    name: null,
    id: null
  };

  return (
    <Link
      href={`/u/${formatHandle(handle)}`}
      onClick={(event) => {
        stopEventPropagation(event);
        PostHog.track(PUBLICATION.CLICK_MENTION, {
          handle: formatHandle(handle)
        });
      }}
    >
      {profile?.handle ? (
        <UserPreview
          isBig={false}
          profile={profile as Profile}
          followStatusLoading={false}
        >
          <Slug slug={formatHandle(handle)} prefix="@" />
        </UserPreview>
      ) : (
        <Slug slug={formatHandle(handle)} prefix="@" />
      )}
    </Link>
  );
};

export default Mention;

import MetaTags from '@components/Common/MetaTags';
import { APP_NAME } from '@lenster/data/constants';
import { PAGEVIEW } from '@lenster/data/tracking';
import { Mixpanel } from '@lib/mixpanel';
import { t } from '@lingui/macro';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useState } from 'react';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';
import { useEffectOnce } from 'usehooks-ts';

import FeedType from './FeedType';
import List from './List';
import Settings from './Settings';

const Notification: FC = () => {
  const {
    query: { type }
  } = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [feedType, setFeedType] = useState(
    type &&
      ['all', 'mentions', 'comments', 'likes', 'collects'].includes(
        type as string
      )
      ? type.toString().toUpperCase()
      : 'ALL'
  );

  useEffectOnce(() => {
    Mixpanel.track(PAGEVIEW, { page: 'notifications' });
  });

  if (!currentProfile) {
    return <Custom404 />;
  }

  return (
    <div className="flex grow justify-center px-0 py-8 sm:px-6 lg:px-8">
      <MetaTags title={t`Notifications • ${APP_NAME}`} />
      <div className="w-full max-w-4xl space-y-3">
        <div className="flex flex-wrap justify-between gap-3 pb-2">
          <FeedType setFeedType={setFeedType} feedType={feedType} />
          <Settings />
        </div>
        <List feedType={feedType} />
      </div>
    </div>
  );
};

export default Notification;

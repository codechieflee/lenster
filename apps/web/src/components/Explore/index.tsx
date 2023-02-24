import MetaTags from '@components/Common/MetaTags';
import RecommendedProfiles from '@components/Home/RecommendedProfiles';
import Trending from '@components/Home/Trending';
import Footer from '@components/Shared/Footer';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import { Tab } from '@headlessui/react';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import { Mixpanel } from '@lib/mixpanel';
import { t } from '@lingui/macro';
import clsx from 'clsx';
import { APP_NAME } from 'data/constants';
import { FeatureFlag } from 'data/feature-flags';
import type { PublicationMainFocus } from 'lens';
import { PublicationSortCriteria } from 'lens';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { EXPLORE, PAGEVIEW } from 'src/tracking';

import Feed from './Feed';
import FeedType from './FeedType';

const Explore: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [focus, setFocus] = useState<PublicationMainFocus>();
  const router = useRouter();

  useEffect(() => {
    Mixpanel.track(PAGEVIEW, { page: 'explore' });
  }, []);

  const tabs = [
    { name: t`For you`, type: PublicationSortCriteria.CuratedProfiles },
    { name: t`Popular`, type: PublicationSortCriteria.TopCommented },
    { name: t`Trending`, type: PublicationSortCriteria.TopCollected },
    { name: t`Interesting`, type: PublicationSortCriteria.TopMirrored }
  ];

  return (
    <GridLayout>
      <MetaTags
        title={t`Explore • ${APP_NAME}`}
        description={`Explore top commented, collected and latest publications in the ${APP_NAME}.`}
      />
      <GridItemEight className="space-y-5">
        <Tab.Group
          defaultIndex={Number(router.query.tab)}
          onChange={(index) => {
            router.replace({ query: { ...router.query, tab: index } }, undefined, { shallow: true });
          }}
        >
          <Tab.List className="divider space-x-8">
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                defaultChecked={index === 1}
                onClick={() => {
                  Mixpanel.track(EXPLORE.SWITCH_EXPLORE_FEED_TAB, {
                    explore_feed_type: tab.type.toLowerCase()
                  });
                }}
                className={({ selected }) =>
                  clsx(
                    { 'border-brand-500 border-b-2 !text-black dark:!text-white': selected },
                    'lt-text-gray-500 px-4 pb-2 text-xs font-medium outline-none sm:text-sm'
                  )
                }
              >
                {tab.name}
              </Tab>
            ))}
          </Tab.List>
          <FeedType setFocus={setFocus} focus={focus} />
          <Tab.Panels>
            {tabs.map((tab, index) => (
              <Tab.Panel key={index}>
                <Feed focus={focus} feedType={tab.type} />
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </GridItemEight>
      <GridItemFour>
        {isFeatureEnabled(FeatureFlag.TrendingWidget, currentProfile?.id) && <Trending />}
        {currentProfile ? <RecommendedProfiles /> : null}
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Explore;

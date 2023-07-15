import MetaTags from '@components/Common/MetaTags';
import RecommendedProfiles from '@components/Home/RecommendedProfiles';
import Tags from '@components/Home/Tags';
import Trending from '@components/Home/Trending';
import FeedFocusType from '@components/Shared/FeedFocusType';
import Footer from '@components/Shared/Footer';
import { Tab } from '@headlessui/react';
import { APP_NAME } from '@lenster/data/constants';
import { FeatureFlag } from '@lenster/data/feature-flags';
import { EXPLORE, PAGEVIEW } from '@lenster/data/tracking';
import type { PublicationMainFocus } from '@lenster/lens';
import { PublicationSortCriteria } from '@lenster/lens';
import isFeatureEnabled from '@lenster/lib/isFeatureEnabled';
import { GridItemEight, GridItemFour, GridLayout } from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import { t } from '@lingui/macro';
import clsx from 'clsx';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';
import { useEffectOnce } from 'usehooks-ts';

import Feed from './Feed';

const Explore: NextPage = () => {
  const router = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [focus, setFocus] = useState<PublicationMainFocus>();
  const isTrendingWidgetEnabled = isFeatureEnabled(FeatureFlag.TrendingWidget);
  const isExploreTagsEnabled = isFeatureEnabled(FeatureFlag.ExploreTags);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'explore' });
  });

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
            router.replace(
              { query: { ...router.query, tab: index } },
              undefined,
              { shallow: true }
            );
          }}
        >
          <Tab.List className="divider space-x-8">
            {tabs.map((tab, index) => (
              <Tab
                key={tab.type}
                defaultChecked={index === 1}
                onClick={() => {
                  Leafwatch.track(EXPLORE.SWITCH_EXPLORE_FEED_TAB, {
                    explore_feed_type: tab.type.toLowerCase()
                  });
                }}
                className={({ selected }) =>
                  clsx(
                    {
                      'border-brand-500 border-b-2 !text-black dark:!text-white':
                        selected
                    },
                    'lt-text-gray-500 px-4 pb-2 text-xs font-medium outline-none sm:text-sm'
                  )
                }
                data-testid={`explore-tab-${index}`}
              >
                {tab.name}
              </Tab>
            ))}
          </Tab.List>
          <FeedFocusType setFocus={setFocus} focus={focus} />
          <Tab.Panels>
            {tabs.map((tab) => (
              <Tab.Panel key={tab.type}>
                <Feed focus={focus} feedType={tab.type} />
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </GridItemEight>
      <GridItemFour>
        {isExploreTagsEnabled && <Tags />}
        {isTrendingWidgetEnabled && <Trending />}
        {currentProfile ? <RecommendedProfiles /> : null}
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Explore;

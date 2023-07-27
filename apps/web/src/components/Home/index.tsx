import MetaTags from '@components/Common/MetaTags';
import NewPost from '@components/Composer/Post/New';
import ExploreFeed from '@components/Explore/Feed';
import Footer from '@components/Shared/Footer';
import { PAGEVIEW } from '@lenster/data/tracking';
import { GridItemEight, GridItemFour, GridLayout } from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import type { NextPage } from 'next';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';
import { useEffectOnce } from 'usehooks-ts';

import EnableDispatcher from './EnableDispatcher';
import EnableMessages from './EnableMessages';
import FeedType, { Type } from './FeedType';
import ForYou from './ForYou';
import Hero from './Hero';
import Highlights from './Highlights';
import RecommendedProfiles from './RecommendedProfiles';
import SetDefaultProfile from './SetDefaultProfile';
import SetProfile from './SetProfile';
import Timeline from './Timeline';
import Waitlist from './Waitlist';

const Home: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [feedType, setFeedType] = useState<Type>(Type.FOLLOWING);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'home' });
  });

  return (
    <>
      <MetaTags />
      {!currentProfile && <Hero />}
      <GridLayout>
        <GridItemEight className="space-y-5">
          {currentProfile ? (
            <>
              <NewPost />
              <FeedType feedType={feedType} setFeedType={setFeedType} />
              {feedType === Type.FOR_YOU ? (
                <ForYou />
              ) : feedType === Type.FOLLOWING ? (
                <Timeline />
              ) : (
                <Highlights />
              )}
            </>
          ) : (
            <ExploreFeed />
          )}
        </GridItemEight>
        <GridItemFour>
          {currentProfile ? (
            <>
              <EnableDispatcher />
              <EnableMessages />
              <SetDefaultProfile />
              <SetProfile />
              <RecommendedProfiles />
            </>
          ) : (
            <Waitlist />
          )}
          <Footer />
        </GridItemFour>
      </GridLayout>
    </>
  );
};

export default Home;

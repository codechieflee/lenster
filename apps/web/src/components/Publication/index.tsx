import Feed from '@components/Comment/Feed';
import NoneRelevantFeed from '@components/Comment/NoneRelevantFeed';
import MetaTags from '@components/Common/MetaTags';
import NewPublication from '@components/Composer/NewPublication';
import CommentWarning from '@components/Shared/CommentWarning';
import Footer from '@components/Shared/Footer';
import UserProfile from '@components/Shared/UserProfile';
import PublicationStaffTool from '@components/StaffTools/Panels/Publication';
import useStaffMode from '@components/utils/hooks/useStaffMode';
import { APP_NAME } from '@lenster/data/constants';
import { PAGEVIEW } from '@lenster/data/tracking';
import { usePublicationQuery } from '@lenster/lens';
import formatHandle from '@lenster/lib/formatHandle';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useAppStore } from 'src/store/app';
import { useEffectOnce } from 'usehooks-ts';

import FullPublication from './FullPublication';
import OnchainMeta from './OnchainMeta';
import RelevantPeople from './RelevantPeople';
import PublicationPageShimmer from './Shimmer';

const ViewPublication: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { allowed: staffMode } = useStaffMode();
  const {
    query: { id }
  } = useRouter();

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'publication' });
  });

  const { data, loading, error } = usePublicationQuery({
    variables: {
      request: { publicationId: id },
      reactionRequest: currentProfile
        ? { profileId: currentProfile?.id }
        : null,
      profileId: currentProfile?.id ?? null
    },
    skip: !id
  });

  if (error) {
    return <Custom500 />;
  }

  if (loading || !data) {
    return <PublicationPageShimmer />;
  }

  if (!data.publication) {
    return <Custom404 />;
  }

  const { publication } = data as any;
  const canComment = publication?.canComment?.result;

  return (
    <GridLayout>
      <MetaTags
        title={
          publication.__typename && publication?.profile?.handle
            ? `${publication.__typename} by @${formatHandle(
                publication.profile.handle
              )} • ${APP_NAME}`
            : APP_NAME
        }
      />
      <GridItemEight className="space-y-5">
        <Card>
          <FullPublication publication={publication} />
        </Card>
        {currentProfile && !publication?.hidden ? (
          canComment ? (
            <NewPublication publication={publication} />
          ) : (
            <CommentWarning />
          )
        ) : null}
        <Feed publication={publication} />
        <NoneRelevantFeed publication={publication} />
      </GridItemEight>
      <GridItemFour className="space-y-5">
        <Card as="aside" className="p-5" dataTestId="poster-profile">
          <UserProfile
            profile={
              publication.__typename === 'Mirror'
                ? publication?.mirrorOf?.profile
                : publication?.profile
            }
            showBio
          />
        </Card>
        <RelevantPeople publication={publication} />
        <OnchainMeta publication={publication} />
        {staffMode && <PublicationStaffTool publication={publication} />}
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default ViewPublication;

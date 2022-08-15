import { gql, useQuery } from '@apollo/client';
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import Seo from '@components/utils/Seo';
import { CommunityFields } from '@gql/CommunityFields';
import { Mixpanel } from '@lib/mixpanel';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { APP_NAME } from 'src/constants';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { PAGEVIEW } from 'src/tracking';

import Details from './Details';
import CommunityPageShimmer from './Shimmer';

const Feed = dynamic(() => import('@components/Comment/Feed'), {
  loading: () => <PublicationsShimmer />
});

const COMMUNITY_QUERY = gql`
  query Community($request: PublicationQueryRequest!) {
    publication(request: $request) {
      ... on Post {
        ...CommunityFields
      }
    }
  }
  ${CommunityFields}
`;

const ViewCommunity: NextPage = () => {
  const {
    query: { id }
  } = useRouter();

  useEffect(() => {
    Mixpanel.track(PAGEVIEW.COMMUNITY);
  }, []);

  const { data, loading, error } = useQuery(COMMUNITY_QUERY, {
    variables: { request: { publicationId: id } },
    skip: !id
  });

  if (error) return <Custom500 />;
  if (loading || !data) return <CommunityPageShimmer />;
  if (!data.publication || data.publication?.metadata?.attributes[0]?.value !== 'community')
    return <Custom404 />;

  return (
    <GridLayout>
      <Seo title={`${data?.publication?.metadata?.name} • ${APP_NAME}`} />
      <GridItemFour>
        <Details community={data.publication} />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <Feed publication={data.publication} type="community post" />
      </GridItemEight>
    </GridLayout>
  );
};

export default ViewCommunity;

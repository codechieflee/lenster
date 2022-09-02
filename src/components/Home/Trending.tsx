import { gql, useQuery } from '@apollo/client';
import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import { Card, CardBody } from '@components/UI/Card';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { TagResult, TagSortCriteria } from '@generated/types';
import { TrendingUpIcon } from '@heroicons/react/solid';
import nFormatter from '@lib/nFormatter';
import Link from 'next/link';
import React, { FC } from 'react';

export const TRENDING_QUERY = gql`
  query Trending($request: AllPublicationsTagsRequest!) {
    allPublicationsTags(request: $request) {
      items {
        tag
        total
      }
    }
  }
`;

const Title = () => {
  return (
    <div className="flex gap-2 items-center px-5 mb-2 sm:px-0">
      <TrendingUpIcon className="w-4 h-4 text-green-500" />
      <div>Trending</div>
    </div>
  );
};

const Trending: FC = () => {
  const { data, loading, error } = useQuery(TRENDING_QUERY, {
    variables: {
      request: { limit: 7, sort: TagSortCriteria.MostPopular }
    }
  });

  if (loading) {
    return (
      <>
        <Title />
        <Card className="mb-4">
          <CardBody className="space-y-4">
            <UserProfileShimmer showFollow />
            <UserProfileShimmer showFollow />
            <UserProfileShimmer showFollow />
            <UserProfileShimmer showFollow />
            <UserProfileShimmer showFollow />
          </CardBody>
        </Card>
      </>
    );
  }

  return (
    <>
      <Title />
      <Card as="aside" className="mb-4">
        <CardBody className="space-y-4">
          <ErrorMessage title="Failed to load recommendations" error={error} />
          {data?.allPublicationsTags?.items?.map((tag: TagResult) => (
            <div key={tag?.tag}>
              <Link href={`/search?q=${tag?.tag}&type=pubs`}>
                <div className="font-bold">#{tag?.tag}</div>
                <div className="text-[12px] text-gray-500">{nFormatter(tag?.total)} Publications</div>
              </Link>
            </div>
          ))}
        </CardBody>
      </Card>
    </>
  );
};

export default Trending;

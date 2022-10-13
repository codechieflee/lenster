import { useQuery } from '@apollo/client';
import UserProfilesShimmer from '@components/Shared/Shimmer/UserProfilesShimmer';
import UserProfile from '@components/Shared/UserProfile';
import { Card } from '@components/UI/Card';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Spinner } from '@components/UI/Spinner';
import type { Profile } from '@generated/types';
import { CustomFiltersTypes, SearchProfilesDocument, SearchRequestTypes } from '@generated/types';
import { UsersIcon } from '@heroicons/react/outline';
import { Leafwatch } from '@lib/leafwatch';
import type { FC } from 'react';
import { useInView } from 'react-cool-inview';
import { PAGINATION_ROOT_MARGIN } from 'src/constants';
import { PAGINATION } from 'src/tracking';

interface Props {
  query: string | string[];
}

const Profiles: FC<Props> = ({ query }) => {
  // Variables
  const request = {
    query,
    type: SearchRequestTypes.Profile,
    customFilters: [CustomFiltersTypes.Gardeners],
    limit: 10
  };

  const { data, loading, error, fetchMore } = useQuery(SearchProfilesDocument, {
    variables: { request },
    skip: !query
  });

  // @ts-ignore
  const profiles = data?.search?.items;
  // @ts-ignore
  const pageInfo = data?.search?.pageInfo;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView) {
        return;
      }

      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
      Leafwatch.track(PAGINATION.PROFILE_SEARCH);
    },
    rootMargin: PAGINATION_ROOT_MARGIN
  });

  if (loading) {
    return <UserProfilesShimmer isBig />;
  }

  if (profiles?.length === 0) {
    return (
      <EmptyState
        message={
          <div>
            No profiles for <b>&ldquo;{query}&rdquo;</b>
          </div>
        }
        icon={<UsersIcon className="w-8 h-8 text-brand" />}
      />
    );
  }

  if (error) {
    return <ErrorMessage title="Failed to load profiles" error={error} />;
  }

  return (
    <>
      <div className="space-y-3">
        {profiles?.map((profile: Profile) => (
          <Card key={profile?.id} className="p-5">
            <UserProfile profile={profile} showBio isBig />
          </Card>
        ))}
      </div>
      {pageInfo?.next && profiles?.length !== pageInfo.totalCount && (
        <span ref={observe} className="flex justify-center p-5">
          <Spinner size="sm" />
        </span>
      )}
    </>
  );
};

export default Profiles;

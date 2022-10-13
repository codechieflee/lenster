import { useLazyQuery } from '@apollo/client';
import { Card } from '@components/UI/Card';
import { Input } from '@components/UI/Input';
import { Spinner } from '@components/UI/Spinner';
import useOnClickOutside from '@components/utils/hooks/useOnClickOutside';
import type { Profile } from '@generated/types';
import { CustomFiltersTypes, SearchProfilesDocument, SearchRequestTypes } from '@generated/types';
import { SearchIcon, XIcon } from '@heroicons/react/outline';
import { Leafwatch } from '@lib/leafwatch';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ChangeEvent, FC } from 'react';
import { useRef, useState } from 'react';
import { SEARCH } from 'src/tracking';

import UserProfile from '../UserProfile';

interface Props {
  hideDropdown?: boolean;
}

const Search: FC<Props> = ({ hideDropdown = false }) => {
  const { push, pathname, query } = useRouter();
  const [searchText, setSearchText] = useState('');
  const dropdownRef = useRef(null);

  useOnClickOutside(dropdownRef, () => setSearchText(''));

  const [searchUsers, { data: searchUsersData, loading: searchUsersLoading }] =
    useLazyQuery(SearchProfilesDocument);

  const handleSearch = (evt: ChangeEvent<HTMLInputElement>) => {
    const keyword = evt.target.value;
    setSearchText(keyword);
    if (pathname !== '/search' && !hideDropdown) {
      searchUsers({
        variables: {
          request: {
            type: SearchRequestTypes.Profile,
            query: keyword,
            customFilters: [CustomFiltersTypes.Gardeners],
            limit: 8
          }
        }
      });
    }
  };

  const handleKeyDown = (evt: ChangeEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (pathname === '/search') {
      push(`/search?q=${searchText}&type=${query.type}`);
    } else {
      push(`/search?q=${searchText}&type=profiles`);
    }
    setSearchText('');
  };

  // @ts-ignore
  const profiles = searchUsersData?.search?.items ?? [];

  return (
    <>
      <div aria-hidden="true">
        <form onSubmit={handleKeyDown}>
          <Input
            type="text"
            className="py-2 px-3 text-sm"
            placeholder="Search..."
            value={searchText}
            onFocus={() => Leafwatch.track(SEARCH.FOCUS)}
            iconLeft={<SearchIcon />}
            iconRight={
              <XIcon
                className={clsx('cursor-pointer', searchText ? 'visible' : 'invisible')}
                onClick={() => {
                  setSearchText('');
                  Leafwatch.track(SEARCH.CLEAR);
                }}
              />
            }
            onChange={handleSearch}
          />
        </form>
      </div>
      {pathname !== '/search' && !hideDropdown && searchText.length > 0 && (
        <div className="flex absolute flex-col mt-2 w-full sm:max-w-md" ref={dropdownRef}>
          <Card className="overflow-y-auto py-2 max-h-[80vh]">
            {searchUsersLoading ? (
              <div className="py-2 px-4 space-y-2 text-sm font-bold text-center">
                <Spinner size="sm" className="mx-auto" />
                <div>Searching users</div>
              </div>
            ) : (
              <>
                {profiles.map((profile: Profile) => (
                  <div key={profile?.handle} className="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Link href={`/u/${profile?.handle}`} onClick={() => setSearchText('')}>
                      <UserProfile profile={profile} />
                    </Link>
                  </div>
                ))}
                {profiles.length === 0 && <div className="py-2 px-4">No matching users</div>}
              </>
            )}
          </Card>
        </div>
      )}
    </>
  );
};

export default Search;

import { gql, useLazyQuery } from '@apollo/client'
import { Card } from '@components/UI/Card'
import { Input } from '@components/UI/Input'
import { Spinner } from '@components/UI/Spinner'
import useOnClickOutside from '@components/utils/hooks/useOnClickOutside'
import { Profile } from '@generated/types'
import { useRef, useState } from 'react'

import UserProfile from '../UserProfile'

const SEARCH_USERS_QUERY = gql`
  query SearchUsers($request: SearchQueryRequest!) {
    search(request: $request) {
      ... on ProfileSearchResult {
        items {
          id
          handle
          name
          ownedBy
          picture {
            ... on MediaSet {
              original {
                url
              }
            }
          }
        }
      }
    }
  }
`

const Search = () => {
  const [searchText, setSearchText] = useState<string>('')
  const dropdownRef = useRef(null)

  useOnClickOutside(dropdownRef, () => setSearchText(''))

  const [searchUsers, { data: searchUsersData, loading: searchUsersLoading }] =
    useLazyQuery(SEARCH_USERS_QUERY)

  const handleSearch = async (evt: any) => {
    let keyword = evt.target.value
    setSearchText(keyword)
    searchUsers({ variables: { request: { type: 'PROFILE', query: keyword } } })
  }

  return (
    <>
      <Input
        type="text"
        className="px-3 py-2 text-sm"
        placeholder="Search..."
        value={searchText}
        onChange={handleSearch}
      />
      {searchText.length > 0 && (
        <div
          className="absolute flex flex-col w-full mt-2 sm:max-w-md"
          ref={dropdownRef}
        >
          <Card className="overflow-y-auto py-2 max-h-[80vh]">
            {searchUsersLoading ? (
              <div className="px-4 py-2 space-y-2 text-sm font-bold text-center">
                <Spinner size="sm" className="mx-auto" />
                <div>Searching users</div>
              </div>
            ) : (
              <div>
                {searchUsersData?.search?.items?.map((profile: Profile) => (
                  <div
                    key={profile.handle}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setSearchText('')}
                  >
                    <UserProfile profile={profile} />
                  </div>
                ))}
                {searchUsersData?.length === 0 && (
                  <div className="px-4 py-2">No matching users</div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}
    </>
  )
}

export default Search

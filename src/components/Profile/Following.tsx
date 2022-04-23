import { gql, useQuery } from '@apollo/client'
import Loader from '@components/Shared/Loader'
import UserProfile from '@components/Shared/UserProfile'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import { Following, PaginatedResultInfo, Profile } from '@generated/types'
import { MinimalProfileFields } from '@gql/MinimalProfileFields'
import { UsersIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import { FC, useState } from 'react'
import { useInView } from 'react-cool-inview'

const FOLLOWING_QUERY = gql`
  query Following($request: FollowingRequest!) {
    following(request: $request) {
      items {
        profile {
          ...MinimalProfileFields
        }
        totalAmountOfTimesFollowing
      }
      pageInfo {
        next
        totalCount
      }
    }
  }
  ${MinimalProfileFields}
`

interface Props {
  profile: Profile
}

const Following: FC<Props> = ({ profile }) => {
  const [following, setFollowing] = useState<Following[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  const { data, loading, error, fetchMore } = useQuery(FOLLOWING_QUERY, {
    variables: { request: { address: profile?.ownedBy, limit: 10 } },
    skip: !profile?.id,
    onCompleted(data) {
      setPageInfo(data?.following?.pageInfo)
      setFollowing(data?.following?.items)
      consoleLog(
        'Query',
        '#8b5cf6',
        `Fetched first 10 following Profile:${profile?.id}`
      )
    }
  })

  const { observe } = useInView({
    threshold: 1,
    onEnter: () => {
      fetchMore({
        variables: {
          request: {
            address: profile?.ownedBy,
            cursor: pageInfo?.next,
            limit: 10
          }
        }
      }).then(({ data }: any) => {
        setPageInfo(data?.following?.pageInfo)
        setFollowing([...following, ...data?.following?.items])
        consoleLog(
          'Query',
          '#8b5cf6',
          `Fetched next 10 following Profile:${profile?.id} Next:${pageInfo?.next}`
        )
      })
    }
  })

  if (loading) return <Loader message="Loading following" />

  if (data?.following?.items?.length === 0)
    return (
      <EmptyState
        message={
          <div>
            <span className="mr-1 font-bold">@{profile?.handle}</span>
            <span>doesn’t follow anyone.</span>
          </div>
        }
        icon={<UsersIcon className="w-8 h-8 text-brand" />}
        hideCard
      />
    )

  return (
    <div className="overflow-y-auto max-h-[80vh]">
      <ErrorMessage
        className="m-5"
        title="Failed to load following"
        error={error}
      />
      <div className="space-y-3">
        <div className="divide-y dark:divide-gray-700">
          {following?.map((following: Following) => (
            <div className="p-5" key={following?.profile?.id}>
              <UserProfile profile={following?.profile} showBio />
            </div>
          ))}
        </div>
        {pageInfo?.next && following.length !== pageInfo?.totalCount && (
          <span ref={observe} className="flex justify-center p-5">
            <Spinner size="md" />
          </span>
        )}
      </div>
    </div>
  )
}

export default Following

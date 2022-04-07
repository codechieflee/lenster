import { gql, useQuery } from '@apollo/client'
import SinglePost from '@components/Post/SinglePost'
import PostsShimmer from '@components/Shared/Shimmer/PostsShimmer'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import { LensterPost } from '@generated/lenstertypes'
import { PaginatedResultInfo, Profile } from '@generated/types'
import { CommentFragment } from '@gql/CommentFragment'
import { MirrorFragment } from '@gql/MirrorFragment'
import { PostFragment } from '@gql/PostFragment'
import { CollectionIcon } from '@heroicons/react/outline'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'

const PROFILE_FEED_QUERY = gql`
  query ProfileFeed($request: PublicationsQueryRequest!) {
    publications(request: $request) {
      items {
        __typename
        ... on Post {
          ...PostFragment
        }
        ... on Comment {
          ...CommentFragment
        }
        ... on Mirror {
          ...MirrorFragment
        }
      }
      pageInfo {
        next
      }
    }
  }
  ${PostFragment}
  ${CommentFragment}
  ${MirrorFragment}
`

interface Props {
  profile: Profile
  type: 'POST' | 'COMMENT' | 'MIRROR'
}

const Feed: React.FC<Props> = ({ profile, type }) => {
  const [publications, setPublications] = useState<LensterPost[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  const { data, loading, error, fetchMore } = useQuery(PROFILE_FEED_QUERY, {
    variables: {
      request: { publicationTypes: type, profileId: profile.id, limit: 10 }
    },
    skip: !profile.id,
    onCompleted(data) {
      setPageInfo(data?.publications?.pageInfo)
      setPublications(data?.publications?.items)
    }
  })

  const { observe } = useInView({
    threshold: 1,
    onEnter: () => {
      fetchMore({
        variables: {
          request: {
            publicationTypes: type,
            profileId: profile.id,
            cursor: pageInfo?.next,
            limit: 10
          }
        }
      }).then(({ data }: any) => {
        setPageInfo(data?.publications?.pageInfo)
        setPublications([...publications, ...data?.publications?.items])
      })
    }
  })

  if (loading) return <PostsShimmer />

  if (data?.publications?.items?.length === 0)
    return (
      <EmptyState
        message={
          <div>
            <span className="mr-1 font-bold">@{profile.handle}</span>
            <span>seems like not {type.toLowerCase()}ed yet!</span>
          </div>
        }
        icon={<CollectionIcon className="w-8 h-8 text-brand-500" />}
      />
    )

  return (
    <>
      {error && (
        <ErrorMessage title="Failed to load profile feed" error={error} />
      )}
      <div className="space-y-3">
        {publications?.map((post: LensterPost, index: number) => (
          <SinglePost key={`${post.id}_${index}`} post={post} />
        ))}
      </div>
      {pageInfo?.next && (
        <span ref={observe} className="flex justify-center p-5">
          <Spinner size="sm" />
        </span>
      )}
    </>
  )
}

export default Feed

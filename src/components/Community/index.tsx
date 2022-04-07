import { gql, useQuery } from '@apollo/client'
import Feed from '@components/Comment/Feed'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import { CommunityFragment } from '@gql/CommunityFragment'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'

import Details from './Details'
import CommunityPageShimmer from './Shimmer'

const COMMUNITY_QUERY = gql`
  query Post($request: PublicationQueryRequest!) {
    publication(request: $request) {
      ... on Post {
        ...CommunityFragment
      }
    }
  }
  ${CommunityFragment}
`

const ViewCommunity: NextPage = () => {
  const {
    query: { id }
  } = useRouter()
  const { data, loading, error } = useQuery(COMMUNITY_QUERY, {
    variables: { request: { publicationId: id } },
    skip: !id
  })

  if (error) return <Custom500 />
  if (loading || !data) return <CommunityPageShimmer />
  if (
    !data.publication ||
    data.publication?.metadata?.attributes[0]?.value !== 'community'
  )
    return <Custom404 />

  return (
    <GridLayout className="pt-6">
      <GridItemFour>
        <Details community={data.publication} />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <Feed post={data.publication} type="community post" />
      </GridItemEight>
    </GridLayout>
  )
}

export default ViewCommunity

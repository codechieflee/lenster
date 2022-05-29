import { LensterPost } from '@generated/lenstertypes'
import { useRouter } from 'next/router'
import React, { FC } from 'react'

import Collected from './Collected'
import Commented from './Commented'
import CommunityPost from './CommunityPost'
import Mirrored from './Mirrored'

interface Props {
  post: LensterPost
  hideType?: boolean
  showThread?: boolean
}

const PostType: FC<Props> = ({ post, hideType, showThread }) => {
  const { pathname } = useRouter()
  const type = post?.__typename
  const postType = post?.metadata?.attributes[0]?.value
  const isCollected = !!post?.collectedBy

  return (
    <>
      {type === 'Mirror' && <Mirrored post={post} />}
      {type === 'Comment' &&
        !hideType &&
        !showThread &&
        !isCollected &&
        postType !== 'community post' && <Commented post={post} />}
      {postType === 'community post' &&
        pathname !== '/communities/[id]' &&
        type !== 'Mirror' && <CommunityPost post={post} />}
      {isCollected && postType !== 'community' && postType !== 'crowdfund' && (
        <Collected post={post} type="Collected" />
      )}
      {isCollected && postType === 'crowdfund' && (
        <Collected post={post} type="Funded" />
      )}
    </>
  )
}

export default PostType

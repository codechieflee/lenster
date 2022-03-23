import 'linkify-plugin-mention'

import { LensterPost } from '@generated/lenstertypes'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useRouter } from 'next/router'
import React from 'react'

import Collected from './Collected'
import Commented from './Commented'
import CommunityPost from './CommunityPost'
import Mirrored from './Mirrored'

dayjs.extend(relativeTime)

interface Props {
  post: LensterPost
  type?: string
}

const PostType: React.FC<Props> = ({ post, type }) => {
  const { pathname } = useRouter()
  const postType = post.metadata?.attributes[0]?.value

  return (
    <>
      {post?.__typename === 'Mirror' && <Mirrored post={post} />}
      {post?.__typename === 'Comment' &&
        type !== 'COMMENT' &&
        postType !== 'community_post' && <Commented post={post} />}
      {postType === 'community_post' && pathname !== '/communities/[id]' && (
        <CommunityPost post={post} />
      )}
      {post?.collectedBy && type !== 'COLLECT' && postType !== 'community' && (
        <Collected post={post} />
      )}
    </>
  )
}

export default PostType

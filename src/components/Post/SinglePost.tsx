import 'linkify-plugin-mention'

import Attachments from '@components/Shared/Attachments'
import IFramely from '@components/Shared/IFramely'
import UserProfile from '@components/Shared/UserProfile'
import { Card, CardBody } from '@components/UI/Card'
import { LensterPost } from '@generated/lenstertypes'
import { getURLs } from '@lib/getURLs'
import { linkifyOptions } from '@lib/linkifyOptions'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Linkify from 'linkify-react'
import Link from 'next/link'
import React from 'react'

import Collect from './Actions/Collect'
import Comment from './Actions/Comment'
import PostMenu from './Actions/Menu'
import Mirror from './Actions/Mirror'
import Collected from './Type/Collected'
import Commented from './Type/Commented'
import Mirrored from './Type/Mirrored'

dayjs.extend(relativeTime)

interface Props {
  post: LensterPost
  type?: string
}

const SinglePost: React.FC<Props> = ({ post, type }) => {
  return (
    <Card>
      <CardBody>
        {post?.__typename === 'Mirror' && <Mirrored post={post} />}
        {post?.__typename === 'Comment' && type !== 'COMMENT' && (
          <Commented post={post} />
        )}
        {post?.collectedBy && <Collected post={post} />}
        <div className="flex justify-between pb-4">
          <UserProfile profile={post.profile} />
          <Link href={`/post/${post.pubId}`}>
            <a className="text-sm text-gray-500" href={`/post/${post.pubId}`}>
              {dayjs(new Date(post.createdAt)).fromNow()}
            </a>
          </Link>
        </div>
        <div className="flex items-start justify-between linkify">
          <Linkify tagName="div" options={linkifyOptions}>
            {post?.metadata?.content}
          </Linkify>
        </div>
        {post?.metadata?.media?.length > 0 ? (
          <Attachments attachments={post?.metadata?.media} />
        ) : (
          post?.metadata?.content &&
          getURLs(post?.metadata?.content)?.length > 0 && (
            <IFramely url={getURLs(post?.metadata?.content)[0]} />
          )
        )}
      </CardBody>
      <div className="flex items-center px-3 py-1.5 text-gray-500 border-t dark:border-gray-800 gap-6">
        <Comment post={post} />
        <Mirror post={post} />
        {post?.collectModule?.__typename !== 'RevertCollectModuleSettings' && (
          <Collect post={post} />
        )}
        <PostMenu post={post} />
      </div>
    </Card>
  )
}

export default SinglePost

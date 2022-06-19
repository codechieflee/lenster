import { gql, useMutation } from '@apollo/client'
import { Tooltip } from '@components/UI/Tooltip'
import AppContext from '@components/utils/AppContext'
import { LensterPost } from '@generated/lenstertypes'
import { HeartIcon } from '@heroicons/react/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/solid'
import humanize from '@lib/humanize'
import { motion } from 'framer-motion'
import { FC, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { CONNECT_WALLET } from 'src/constants'

const ADD_REACTION_MUTATION = gql`
  mutation AddReaction($request: ReactionRequest!) {
    addReaction(request: $request)
  }
`

const REMOVE_REACTION_MUTATION = gql`
  mutation RemoveReaction($request: ReactionRequest!) {
    removeReaction(request: $request)
  }
`

interface Props {
  post: LensterPost
}

const Like: FC<Props> = ({ post }) => {
  const { currentUser } = useContext(AppContext)
  const [liked, setLiked] = useState<boolean>(false)
  const [count, setCount] = useState<number>(0)

  useEffect(() => {
    if (post?.mirrorOf?.stats?.totalUpvotes || post?.stats?.totalUpvotes) {
      const reactionCount =
        post.__typename === 'Mirror'
          ? post?.mirrorOf?.stats?.totalUpvotes
          : post?.stats?.totalUpvotes
      const reaction =
        post.__typename === 'Mirror' ? post?.mirrorOf?.reaction : post?.reaction

      setCount(reactionCount)
      setLiked(reaction === 'UPVOTE')
    }
  }, [post])

  const [addReaction] = useMutation(ADD_REACTION_MUTATION, {
    onError(error) {
      setLiked(!liked)
      setCount(count - 1)
      toast.error(error.message)
    }
  })

  const [removeReaction] = useMutation(REMOVE_REACTION_MUTATION, {
    onError(error) {
      setLiked(!liked)
      setCount(count + 1)
      toast.error(error.message)
    }
  })

  const createLike = () => {
    if (!currentUser) {
      toast.error(CONNECT_WALLET)
    } else {
      const variable = {
        variables: {
          request: {
            profileId: currentUser?.id,
            reaction: 'UPVOTE',
            publicationId:
              post.__typename === 'Mirror'
                ? post?.mirrorOf?.id
                : post?.pubId ?? post?.id
          }
        }
      }

      if (liked) {
        setLiked(false)
        setCount(count - 1)
        removeReaction(variable)
      } else {
        setLiked(true)
        setCount(count + 1)
        addReaction(variable)
      }
    }
  }

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={createLike}
      aria-label="Like"
    >
      <div className="flex items-center space-x-1 text-pink-500">
        <div className="p-1.5 rounded-full hover:bg-pink-300 hover:bg-opacity-20">
          <Tooltip
            placement="top"
            content={liked ? 'Unlike' : 'Like'}
            withDelay
          >
            {liked ? (
              <HeartIconSolid className="w-[18px]" />
            ) : (
              <HeartIcon className="w-[18px]" />
            )}
          </Tooltip>
        </div>
        {count > 0 && <div className="text-xs">{humanize(count)}</div>}
      </div>
    </motion.button>
  )
}

export default Like

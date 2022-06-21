import { LensHubProxy } from '@abis/LensHubProxy'
import { gql, useMutation } from '@apollo/client'
import { Spinner } from '@components/UI/Spinner'
import { Tooltip } from '@components/UI/Tooltip'
import { LensterPost } from '@generated/lenstertypes'
import { CreateMirrorBroadcastItemResult } from '@generated/types'
import { BROADCAST_MUTATION } from '@gql/BroadcastMutation'
import { SwitchHorizontalIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import humanize from '@lib/humanize'
import nFormatter from '@lib/nFormatter'
import omit from '@lib/omit'
import splitSignature from '@lib/splitSignature'
import { motion } from 'framer-motion'
import { FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  CONNECT_WALLET,
  ERROR_MESSAGE,
  ERRORS,
  LENSHUB_PROXY,
  RELAY_ON
} from 'src/constants'
import useAppStore from 'src/store'
import { useContractWrite, useSignTypedData } from 'wagmi'

const CREATE_MIRROR_TYPED_DATA_MUTATION = gql`
  mutation CreateMirrorTypedData(
    $options: TypedDataOptions
    $request: CreateMirrorRequest!
  ) {
    createMirrorTypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        types {
          MirrorWithSig {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          profileIdPointed
          pubIdPointed
          referenceModule
          referenceModuleData
          referenceModuleInitData
        }
      }
    }
  }
`

interface Props {
  post: LensterPost
}

const Mirror: FC<Props> = ({ post }) => {
  const [count, setCount] = useState<number>(0)
  const { isAuthenticated, currentUser, userSigNonce, setUserSigNonce } =
    useAppStore()

  useEffect(() => {
    if (
      post?.mirrorOf?.stats?.totalAmountOfMirrors ||
      post?.stats?.totalAmountOfMirrors
    ) {
      setCount(
        post.__typename === 'Mirror'
          ? post?.mirrorOf?.stats?.totalAmountOfMirrors
          : post?.stats?.totalAmountOfMirrors
      )
    }
  }, [post])

  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
    }
  })

  const onCompleted = () => {
    setCount(count + 1)
    toast.success('Post has been mirrored!')
  }

  const { isLoading: writeLoading, write } = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'mirrorWithSig',
    {
      onSuccess() {
        onCompleted()
      },
      onError(error: any) {
        toast.error(error?.data?.message ?? error?.message)
      }
    }
  )

  const [broadcast, { loading: broadcastLoading }] = useMutation(
    BROADCAST_MUTATION,
    {
      onCompleted(data) {
        if (data?.broadcast?.reason !== 'NOT_ALLOWED') {
          onCompleted()
        }
      },
      onError(error) {
        if (error.message === ERRORS.notMined) {
          toast.error(error.message)
        }
        consoleLog('Relay Error', '#ef4444', error.message)
      }
    }
  )
  const [createMirrorTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_MIRROR_TYPED_DATA_MUTATION,
    {
      onCompleted({
        createMirrorTypedData
      }: {
        createMirrorTypedData: CreateMirrorBroadcastItemResult
      }) {
        consoleLog('Mutation', '#4ade80', 'Generated createMirrorTypedData')
        const { id, typedData } = createMirrorTypedData
        const {
          profileId,
          profileIdPointed,
          pubIdPointed,
          referenceModule,
          referenceModuleData,
          referenceModuleInitData
        } = typedData?.value

        signTypedDataAsync({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        }).then((signature) => {
          setUserSigNonce(userSigNonce + 1)
          const { v, r, s } = splitSignature(signature)
          const sig = { v, r, s, deadline: typedData.value.deadline }
          const inputStruct = {
            profileId,
            profileIdPointed,
            pubIdPointed,
            referenceModule,
            referenceModuleData,
            referenceModuleInitData,
            sig
          }
          if (RELAY_ON) {
            broadcast({ variables: { request: { id, signature } } }).then(
              ({ data, errors }) => {
                if (errors || data?.broadcast?.reason === 'NOT_ALLOWED') {
                  write({ args: inputStruct })
                }
              }
            )
          } else {
            write({ args: inputStruct })
          }
        })
      },
      onError(error) {
        toast.error(error.message ?? ERROR_MESSAGE)
      }
    }
  )

  const createMirror = () => {
    if (!isAuthenticated) return toast.error(CONNECT_WALLET)

    createMirrorTypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
        request: {
          profileId: currentUser?.id,
          publicationId: post?.pubId ?? post?.id,
          referenceModule: {
            followerOnlyReferenceModule: false
          }
        }
      }
    })
  }

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={createMirror}
      disabled={typedDataLoading || writeLoading}
      aria-label="Mirror"
    >
      <div className="flex items-center space-x-1 text-brand">
        <div className="p-1.5 rounded-full hover:bg-opacity-20 hover:bg-brand-300">
          {typedDataLoading ||
          signLoading ||
          writeLoading ||
          broadcastLoading ? (
            <Spinner size="xs" />
          ) : (
            <Tooltip
              placement="top"
              content={count > 0 ? `${humanize(count)} Mirrors` : 'Mirror'}
              withDelay
            >
              <SwitchHorizontalIcon className="w-[18px]" />
            </Tooltip>
          )}
        </div>
        {count > 0 && <div className="text-xs">{nFormatter(count)}</div>}
      </div>
    </motion.button>
  )
}

export default Mirror

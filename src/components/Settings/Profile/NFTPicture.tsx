import { LensHubProxy } from '@abis/LensHubProxy'
import { useLazyQuery, useMutation } from '@apollo/client'
import IndexStatus from '@components/Shared/IndexStatus'
import { Button } from '@components/UI/Button'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import { Spinner } from '@components/UI/Spinner'
import {
  CreateSetProfileImageUriBroadcastItemResult,
  NftImage,
  Profile
} from '@generated/types'
import { BROADCAST_MUTATION } from '@gql/BroadcastMutation'
import { PencilIcon } from '@heroicons/react/outline'
import Logger from '@lib/logger'
import omit from '@lib/omit'
import splitSignature from '@lib/splitSignature'
import gql from 'graphql-tag'
import React, { FC, useState } from 'react'
import toast from 'react-hot-toast'
import {
  CONNECT_WALLET,
  ERROR_MESSAGE,
  ERRORS,
  IS_MAINNET,
  LENSHUB_PROXY,
  RELAY_ON
} from 'src/constants'
import { useAppStore, usePersistStore } from 'src/store'
import {
  chain,
  useContractWrite,
  useSignMessage,
  useSignTypedData
} from 'wagmi'
import { object, string } from 'zod'

const editNftPictureSchema = object({
  contractAddress: string()
    .max(42, { message: 'Contract address should be within 42 characters' })
    .regex(/^0x[a-fA-F0-9]{40}$/, { message: 'Invalid Contract address' }),
  tokenId: string()
})

const CREATE_SET_PROFILE_IMAGE_URI_TYPED_DATA_MUTATION = gql`
  mutation CreateSetProfileImageUriTypedData(
    $options: TypedDataOptions
    $request: UpdateProfileImageRequest!
  ) {
    createSetProfileImageURITypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          SetProfileImageURIWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          imageURI
          profileId
        }
      }
    }
  }
`

const CHALLENGE_QUERY = gql`
  query Challenge($request: NftOwnershipChallengeRequest!) {
    nftOwnershipChallenge(request: $request) {
      id
      text
    }
  }
`

interface Props {
  profile: Profile & { picture: NftImage }
}

const NFTPicture: FC<Props> = ({ profile }) => {
  const form = useZodForm({
    schema: editNftPictureSchema,
    defaultValues: {
      contractAddress: profile?.picture?.contractAddress,
      tokenId: profile?.picture?.tokenId
    }
  })

  const { userSigNonce, setUserSigNonce } = useAppStore()
  const { isAuthenticated, currentUser } = usePersistStore()
  const [chainId, setChainId] = useState<number>(
    IS_MAINNET ? chain.mainnet.id : chain.kovan.id
  )
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
    }
  })
  const { signMessageAsync } = useSignMessage()

  const onCompleted = () => {
    toast.success('Avatar updated successfully!')
  }

  const {
    data: writeData,
    isLoading: writeLoading,
    error,
    write
  } = useContractWrite({
    addressOrName: LENSHUB_PROXY,
    contractInterface: LensHubProxy,
    functionName: 'setProfileImageURIWithSig',
    onSuccess() {
      onCompleted()
    },
    onError(error: any) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })

  const [loadChallenge, { loading: challengeLoading }] =
    useLazyQuery(CHALLENGE_QUERY)
  const [broadcast, { data: broadcastData, loading: broadcastLoading }] =
    useMutation(BROADCAST_MUTATION, {
      onCompleted() {
        onCompleted()
      },
      onError(error) {
        if (error.message === ERRORS.notMined) {
          toast.error(error.message)
        }
        Logger.error('Relay Error =>', error.message)
      }
    })
  const [createSetProfileImageURITypedData, { loading: typedDataLoading }] =
    useMutation(CREATE_SET_PROFILE_IMAGE_URI_TYPED_DATA_MUTATION, {
      async onCompleted({
        createSetProfileImageURITypedData
      }: {
        createSetProfileImageURITypedData: CreateSetProfileImageUriBroadcastItemResult
      }) {
        const { id, typedData } = createSetProfileImageURITypedData
        const { deadline } = typedData?.value

        try {
          const signature = await signTypedDataAsync({
            domain: omit(typedData?.domain, '__typename'),
            types: omit(typedData?.types, '__typename'),
            value: omit(typedData?.value, '__typename')
          })
          setUserSigNonce(userSigNonce + 1)
          const { profileId, imageURI } = typedData?.value
          const { v, r, s } = splitSignature(signature)
          const sig = { v, r, s, deadline }
          const inputStruct = {
            profileId,
            imageURI,
            sig
          }
          if (RELAY_ON) {
            const {
              data: { broadcast: result }
            } = await broadcast({ variables: { request: { id, signature } } })

            if ('reason' in result) write({ args: inputStruct })
          } else {
            write({ args: inputStruct })
          }
        } catch (error) {
          Logger.warn('Sign Error =>', error)
        }
      },
      onError(error) {
        toast.error(error.message ?? ERROR_MESSAGE)
      }
    })

  const setAvatar = async (contractAddress: string, tokenId: string) => {
    if (!isAuthenticated) return toast.error(CONNECT_WALLET)

    const challengeRes = await loadChallenge({
      variables: {
        request: {
          ethereumAddress: currentUser?.ownedBy,
          nfts: {
            contractAddress,
            tokenId,
            chainId
          }
        }
      }
    })

    const signature = await signMessageAsync({
      message: challengeRes?.data?.nftOwnershipChallenge?.text
    })
    createSetProfileImageURITypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
        request: {
          profileId: currentUser?.id,
          nftData: {
            id: challengeRes?.data?.nftOwnershipChallenge?.id,
            signature
          }
        }
      }
    })
  }

  return (
    <Form
      form={form}
      className="space-y-4"
      onSubmit={({ contractAddress, tokenId }) => {
        setAvatar(contractAddress, tokenId)
      }}
    >
      {error && (
        <ErrorMessage
          className="mb-3"
          title="Transaction failed!"
          error={error}
        />
      )}
      <div>
        <div className="label">Chain</div>
        <div>
          <select
            className="w-full bg-white rounded-xl border border-gray-300 outline-none dark:bg-gray-800 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700/80 focus:border-brand-500 focus:ring-brand-400"
            onChange={(e) => setChainId(parseInt(e.target.value))}
            value={chainId}
          >
            <option value={IS_MAINNET ? chain.mainnet.id : chain.kovan.id}>
              {IS_MAINNET ? 'Ethereum' : 'Kovan'}
            </option>
            <option
              value={IS_MAINNET ? chain.polygon.id : chain.polygonMumbai.id}
            >
              {IS_MAINNET ? 'Polygon' : 'Mumbai'}
            </option>
          </select>
        </div>
      </div>
      <Input
        label="Contract Address"
        type="text"
        placeholder="0x277f5959e22f94d5bd4c2cc0a77c4c71f31da3ac"
        {...form.register('contractAddress')}
      />
      <Input
        label="Token Id"
        type="text"
        placeholder="1"
        {...form.register('tokenId')}
      />

      <div className="flex flex-col space-y-2">
        <Button
          className="ml-auto"
          type="submit"
          disabled={
            challengeLoading ||
            typedDataLoading ||
            signLoading ||
            writeLoading ||
            broadcastLoading
          }
          icon={
            challengeLoading ||
            typedDataLoading ||
            signLoading ||
            writeLoading ||
            broadcastLoading ? (
              <Spinner size="xs" />
            ) : (
              <PencilIcon className="w-4 h-4" />
            )
          }
        >
          Save
        </Button>
        {writeData?.hash ?? broadcastData?.broadcast?.txHash ? (
          <IndexStatus
            txHash={
              writeData?.hash
                ? writeData?.hash
                : broadcastData?.broadcast?.txHash
            }
          />
        ) : null}
      </div>
    </Form>
  )
}

export default NFTPicture

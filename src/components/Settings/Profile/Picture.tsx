import LensHubProxy from '@abis/LensHubProxy.json'
import { gql, useMutation } from '@apollo/client'
import ChooseFile from '@components/Shared/ChooseFile'
import IndexStatus from '@components/Shared/IndexStatus'
import SwitchNetwork from '@components/Shared/SwitchNetwork'
import { Button } from '@components/UI/Button'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import {
  CreateSetProfileImageUriBroadcastItemResult,
  MediaSet,
  NftImage,
  Profile
} from '@generated/types'
import { PencilIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import imagekitURL from '@lib/imagekitURL'
import omit from '@lib/omit'
import splitSignature from '@lib/splitSignature'
import trackEvent from '@lib/trackEvent'
import uploadAssetsToIPFS from '@lib/uploadAssetsToIPFS'
import React, { ChangeEvent, FC, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  CHAIN_ID,
  CONNECT_WALLET,
  ERROR_MESSAGE,
  LENSHUB_PROXY,
  WRONG_NETWORK
} from 'src/constants'
import {
  useAccount,
  useContractWrite,
  useNetwork,
  useSignTypedData
} from 'wagmi'

const CREATE_SET_PROFILE_IMAGE_URI_TYPED_DATA_MUTATION = gql`
  mutation CreateSetProfileImageUriTypedData(
    $request: UpdateProfileImageRequest!
  ) {
    createSetProfileImageURITypedData(request: $request) {
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

interface Props {
  profile: Profile & { picture: MediaSet & NftImage }
}

const Picture: FC<Props> = ({ profile }) => {
  const [avatar, setAvatar] = useState<string>()
  const [uploading, setUploading] = useState<boolean>(false)
  const { currentUser } = useContext(AppContext)
  const { activeChain } = useNetwork()
  const { data: account } = useAccount()
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
    }
  })
  const {
    data: writeData,
    isLoading: writeLoading,
    error,
    write
  } = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'setProfileImageURIWithSig',
    {
      onSuccess() {
        toast.success('Avatar updated successfully!')
        trackEvent('update avatar')
      },
      onError(error) {
        toast.error(error?.message)
      }
    }
  )

  useEffect(() => {
    if (profile?.picture?.original?.url || profile?.picture?.uri)
      setAvatar(profile?.picture?.original?.url ?? profile?.picture?.uri)
  }, [profile])

  const [createSetProfileImageURITypedData, { loading: typedDataLoading }] =
    useMutation(CREATE_SET_PROFILE_IMAGE_URI_TYPED_DATA_MUTATION, {
      onCompleted({
        createSetProfileImageURITypedData
      }: {
        createSetProfileImageURITypedData: CreateSetProfileImageUriBroadcastItemResult
      }) {
        consoleLog(
          'Mutation',
          '#4ade80',
          'Generated createSetProfileImageURITypedData'
        )
        const { typedData } = createSetProfileImageURITypedData
        signTypedDataAsync({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        }).then((signature) => {
          const { profileId, imageURI } = typedData?.value
          const { v, r, s } = splitSignature(signature)
          const inputStruct = {
            profileId,
            imageURI,
            sig: {
              v,
              r,
              s,
              deadline: typedData.value.deadline
            }
          }
          write({ args: inputStruct })
        })
      },
      onError(error) {
        toast.error(error.message ?? ERROR_MESSAGE)
      }
    })

  const handleUpload = async (evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault()
    setUploading(true)
    try {
      const attachment = await uploadAssetsToIPFS(evt.target.files![0])
      setAvatar(attachment.item)
    } finally {
      setUploading(false)
    }
  }

  const editPicture = (avatar: string | undefined) => {
    if (!avatar) {
      toast.error("Avatar can't be empty!")
    } else if (!account?.address) {
      toast.error(CONNECT_WALLET)
    } else if (activeChain?.id !== CHAIN_ID) {
      toast.error(WRONG_NETWORK)
    } else {
      createSetProfileImageURITypedData({
        variables: {
          request: {
            profileId: currentUser?.id,
            url: avatar
          }
        }
      })
    }
  }

  return (
    <>
      <div className="space-y-1.5">
        {error && (
          <ErrorMessage
            className="mb-3"
            title="Transaction failed!"
            error={error}
          />
        )}
        <div className="space-y-3">
          {avatar && (
            <div>
              <img
                className="w-60 h-60 rounded-lg"
                src={imagekitURL(avatar, 'avatar')}
                alt={avatar}
              />
            </div>
          )}
          <div className="flex items-center space-x-3">
            <ChooseFile
              onChange={(evt: ChangeEvent<HTMLInputElement>) =>
                handleUpload(evt)
              }
            />
            {uploading && <Spinner size="sm" />}
          </div>
        </div>
      </div>
      {activeChain?.id !== CHAIN_ID ? (
        <SwitchNetwork className="ml-auto" />
      ) : (
        <div className="flex flex-col space-y-2">
          <Button
            className="ml-auto"
            type="submit"
            disabled={typedDataLoading || signLoading || writeLoading}
            onClick={() => editPicture(avatar)}
            icon={
              typedDataLoading || signLoading || writeLoading ? (
                <Spinner size="xs" />
              ) : (
                <PencilIcon className="w-4 h-4" />
              )
            }
          >
            Save
          </Button>
          {writeData?.hash && <IndexStatus txHash={writeData?.hash} />}
        </div>
      )}
    </>
  )
}

export default Picture

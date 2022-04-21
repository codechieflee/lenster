import LensHubProxy from '@abis/LensHubProxy.json'
import { gql, useMutation } from '@apollo/client'
import Attachments from '@components/Shared/Attachments'
import PubIndexStatus from '@components/Shared/PubIndexStatus'
import SwitchNetwork from '@components/Shared/SwitchNetwork'
import { Button } from '@components/UI/Button'
import { Card } from '@components/UI/Card'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { MentionTextArea } from '@components/UI/MentionTextArea'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import { LensterAttachment, LensterPost } from '@generated/lenstertypes'
import {
  CreateCommentBroadcastItemResult,
  EnabledModule
} from '@generated/types'
import { IGif } from '@giphy/js-types'
import { ChatAlt2Icon, PencilAltIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import {
  defaultFeeData,
  defaultModuleData,
  FEE_DATA_TYPE,
  getModule
} from '@lib/getModule'
import omit from '@lib/omit'
import splitSignature from '@lib/splitSignature'
import trackEvent from '@lib/trackEvent'
import uploadToIPFS from '@lib/uploadToIPFS'
import dynamic from 'next/dynamic'
import { FC, useContext, useState } from 'react'
import toast from 'react-hot-toast'
import {
  CHAIN_ID,
  CONNECT_WALLET,
  ERROR_MESSAGE,
  LENSHUB_PROXY,
  WRONG_NETWORK
} from 'src/constants'
import { v4 as uuidv4 } from 'uuid'
import {
  useAccount,
  useContractWrite,
  useNetwork,
  useSignTypedData
} from 'wagmi'

const Attachment = dynamic(() => import('../../Shared/Attachment'), {
  loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
})
const Giphy = dynamic(() => import('../../Shared/Giphy'), {
  loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
})
const SelectCollectModule = dynamic(
  () => import('../../Shared/SelectCollectModule'),
  {
    loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
  }
)
const SelectReferenceModule = dynamic(
  () => import('../../Shared/SelectReferenceModule'),
  {
    loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
  }
)

const CREATE_COMMENT_TYPED_DATA_MUTATION = gql`
  mutation CreateCommentTypedData($request: CreatePublicCommentRequest!) {
    createCommentTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          CommentWithSig {
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
          contentURI
          collectModule
          collectModuleData
          referenceModule
          referenceModuleData
        }
      }
    }
  }
`

interface Props {
  refetch: any
  post: LensterPost
  type: 'comment' | 'community post'
}

const NewComment: FC<Props> = ({ refetch, post, type }) => {
  const [commentContent, setCommentContent] = useState<string>('')
  const [commentContentError, setCommentContentError] = useState<string>('')
  const { currentUser } = useContext(AppContext)
  const [selectedModule, setSelectedModule] =
    useState<EnabledModule>(defaultModuleData)
  const [onlyFollowers, setOnlyFollowers] = useState<boolean>(false)
  const [feeData, setFeeData] = useState<FEE_DATA_TYPE>(defaultFeeData)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [attachments, setAttachments] = useState<LensterAttachment[]>([])
  const { activeChain } = useNetwork()
  const { data: account } = useAccount()
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
    }
  })
  const {
    data,
    error,
    isLoading: writeLoading,
    write
  } = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'commentWithSig',
    {
      onSuccess() {
        setCommentContent('')
        setAttachments([])
        setSelectedModule(defaultModuleData)
        setFeeData(defaultFeeData)
        trackEvent('new comment', 'create')
      },
      onError(error) {
        toast.error(error?.message)
      }
    }
  )

  const [createCommentTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_COMMENT_TYPED_DATA_MUTATION,
    {
      onCompleted({
        createCommentTypedData
      }: {
        createCommentTypedData: CreateCommentBroadcastItemResult
      }) {
        consoleLog('Mutation', '#4ade80', 'Generated createCommentTypedData')
        const { typedData } = createCommentTypedData
        const {
          profileId,
          profileIdPointed,
          pubIdPointed,
          contentURI,
          collectModule,
          collectModuleData,
          referenceModule,
          referenceModuleData
        } = typedData?.value

        signTypedDataAsync({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        }).then((signature) => {
          const { v, r, s } = splitSignature(signature)
          const inputStruct = {
            profileId,
            profileIdPointed,
            pubIdPointed,
            contentURI,
            collectModule,
            collectModuleData,
            referenceModule,
            referenceModuleData,
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
    }
  )

  const createComment = async () => {
    if (!account?.address) {
      toast.error(CONNECT_WALLET)
    } else if (activeChain?.id !== CHAIN_ID) {
      toast.error(WRONG_NETWORK)
    } else if (commentContent.length === 0 && attachments.length === 0) {
      setCommentContentError('Comment should not be empty!')
    } else {
      setCommentContentError('')
      setIsUploading(true)
      const { path } = await uploadToIPFS({
        version: '1.0.0',
        metadata_id: uuidv4(),
        description: commentContent,
        content: commentContent,
        external_url: null,
        image: attachments.length > 0 ? attachments[0]?.item : null,
        imageMimeType: attachments.length > 0 ? attachments[0]?.type : null,
        name: `Comment by @${currentUser?.handle}`,
        attributes: [
          {
            traitType: 'string',
            key: 'type',
            value: type
          }
        ],
        media: attachments,
        appId: 'Lenster'
      }).finally(() => setIsUploading(false))

      createCommentTypedData({
        variables: {
          request: {
            profileId: currentUser?.id,
            publicationId: post?.id,
            contentURI: `https://ipfs.infura.io/ipfs/${path}`,
            collectModule: feeData.recipient
              ? {
                  [getModule(selectedModule.moduleName).config]: feeData
                }
              : getModule(selectedModule.moduleName).config,
            referenceModule: {
              followerOnlyReferenceModule: onlyFollowers ? true : false
            }
          }
        }
      })
    }
  }

  const setGifAttachment = (gif: IGif) => {
    const attachment = {
      item: gif.images.original.url,
      type: 'image/gif'
    }
    setAttachments([...attachments, attachment])
  }

  return (
    <Card>
      <div className="px-5 pt-5 pb-3">
        <div className="space-y-1">
          {error && (
            <ErrorMessage
              className="mb-3"
              title="Transaction failed!"
              error={error}
            />
          )}
          <MentionTextArea
            value={commentContent}
            setValue={setCommentContent}
            error={commentContentError}
            setError={setCommentContentError}
            placeholder="Tell something cool!"
          />
          <div className="block items-center sm:flex">
            <div className="flex items-center space-x-4">
              <Attachment
                attachments={attachments}
                setAttachments={setAttachments}
              />
              <Giphy setGifAttachment={(gif: IGif) => setGifAttachment(gif)} />
              <SelectCollectModule
                feeData={feeData}
                setFeeData={setFeeData}
                selectedModule={selectedModule}
                setSelectedModule={setSelectedModule}
              />
              <SelectReferenceModule
                onlyFollowers={onlyFollowers}
                setOnlyFollowers={setOnlyFollowers}
              />
            </div>
            <div className="flex items-center pt-2 ml-auto space-x-2 sm:pt-0">
              {data?.hash && (
                <PubIndexStatus
                  refetch={refetch}
                  type={type === 'comment' ? 'Comment' : 'Post'}
                  txHash={data?.hash}
                />
              )}
              {activeChain?.id !== CHAIN_ID ? (
                <SwitchNetwork className="ml-auto" />
              ) : (
                <Button
                  className="ml-auto"
                  disabled={
                    isUploading ||
                    typedDataLoading ||
                    signLoading ||
                    writeLoading
                  }
                  icon={
                    isUploading ||
                    typedDataLoading ||
                    signLoading ||
                    writeLoading ? (
                      <Spinner size="xs" />
                    ) : type === 'community post' ? (
                      <PencilAltIcon className="w-4 h-4" />
                    ) : (
                      <ChatAlt2Icon className="w-4 h-4" />
                    )
                  }
                  onClick={createComment}
                >
                  {isUploading
                    ? 'Uploading to IPFS'
                    : typedDataLoading
                    ? `Generating ${type === 'comment' ? 'Comment' : 'Post'}`
                    : signLoading
                    ? 'Sign'
                    : writeLoading
                    ? 'Send'
                    : type === 'comment'
                    ? 'Comment'
                    : 'Post'}
                </Button>
              )}
            </div>
          </div>
          <Attachments
            attachments={attachments}
            setAttachments={setAttachments}
            isNew
          />
        </div>
      </div>
    </Card>
  )
}

export default NewComment

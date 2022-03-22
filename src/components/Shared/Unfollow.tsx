import FollowNFT from '@abis/FollowNFT.json'
import { gql, useMutation } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { Spinner } from '@components/UI/Spinner'
import { CreateUnfollowBroadcastItemResult, Profile } from '@generated/types'
import { UserRemoveIcon } from '@heroicons/react/outline'
import { omit } from '@lib/omit'
import { splitSignature } from '@lib/splitSignature'
import { Contract } from 'ethers'
import { Dispatch, useState } from 'react'
import toast from 'react-hot-toast'
import { CONNECT_WALLET, ERROR_MESSAGE, WRONG_NETWORK } from 'src/constants'
import {
  chain,
  useAccount,
  useNetwork,
  useSigner,
  useSignTypedData
} from 'wagmi'

const CREATE_UNFOLLOW_TYPED_DATA_MUTATION = gql`
  mutation CreateUnfollowTypedData($request: UnfollowRequest!) {
    createUnfollowTypedData(request: $request) {
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
          BurnWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          tokenId
        }
      }
    }
  }
`

interface Props {
  profile: Profile
  showText?: boolean
  setFollowing: Dispatch<boolean>
}

const Unfollow: React.FC<Props> = ({
  profile,
  showText = false,
  setFollowing
}) => {
  const [writeLoading, setWriteLoading] = useState<boolean>(false)
  const [{ data: network }] = useNetwork()
  const [{ data: account }] = useAccount()
  const [{ loading: signLoading }, signTypedData] = useSignTypedData()
  const [{ data: signer }] = useSigner()

  const [createUnfollowTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_UNFOLLOW_TYPED_DATA_MUTATION,
    {
      onCompleted({
        createUnfollowTypedData
      }: {
        createUnfollowTypedData: CreateUnfollowBroadcastItemResult
      }) {
        const { typedData } = createUnfollowTypedData

        signTypedData({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        }).then(async (res) => {
          if (!res.error) {
            const { tokenId } = typedData?.value
            const { v, r, s } = splitSignature(res.data)
            const sig = {
              v,
              r,
              s,
              deadline: typedData.value.deadline
            }
            setWriteLoading(true)
            const followNftContract = new Contract(
              typedData.domain.verifyingContract,
              FollowNFT,
              signer
            )
            try {
              const tx = await followNftContract.burnWithSig(tokenId, sig)
              if (tx) {
                setFollowing(false)
              }
              toast.success('Unfollowed successfully!')
            } catch {
              toast.error('User rejected request')
            } finally {
              setWriteLoading(false)
            }
          } else {
            toast.error(res.error?.message)
          }
        })
      },
      onError(error) {
        toast.error(error.message ?? ERROR_MESSAGE)
      }
    }
  )

  const createUnfollow = async () => {
    if (!account?.address) {
      toast.error(CONNECT_WALLET)
    } else if (network.chain?.id !== chain.polygonTestnetMumbai.id) {
      toast.error(WRONG_NETWORK)
    } else {
      createUnfollowTypedData({
        variables: {
          request: { profile: profile.id }
        }
      })
    }
  }

  return (
    <Button
      className="text-sm !px-3 !py-1.5"
      outline
      onClick={createUnfollow}
      disabled={typedDataLoading || signLoading || writeLoading}
      variant="danger"
      icon={
        typedDataLoading || signLoading || writeLoading ? (
          <Spinner variant="danger" size="xs" />
        ) : (
          <UserRemoveIcon className="w-4 h-4" />
        )
      }
    >
      {showText && 'Unfollow'}
    </Button>
  )
}

export default Unfollow

import LensHubProxy from '@abis/LensHubProxy.json'
import { gql, useMutation, useQuery } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import { CREATE_POST_TYPED_DATA_MUTATION } from '@components/Post/NewPost'
import ChooseFile from '@components/Shared/ChooseFile'
import SettingsHelper from '@components/Shared/SettingsHelper'
import SwitchNetwork from '@components/Shared/SwitchNetwork'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import { PageLoading } from '@components/UI/PageLoading'
import { Spinner } from '@components/UI/Spinner'
import { TextArea } from '@components/UI/TextArea'
import AppContext from '@components/utils/AppContext'
import { CreatePostBroadcastItemResult, Erc20 } from '@generated/types'
import { PlusIcon } from '@heroicons/react/outline'
import { getTokenImage } from '@lib/getTokenImage'
import { omit } from '@lib/omit'
import { splitSignature } from '@lib/splitSignature'
import { uploadAssetsToIPFS } from '@lib/uploadAssetsToIPFS'
import { uploadToIPFS } from '@lib/uploadToIPFS'
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import {
  CONNECT_WALLET,
  ERROR_MESSAGE,
  LENSHUB_PROXY,
  WRONG_NETWORK
} from 'src/constants'
import Custom404 from 'src/pages/404'
import { v4 as uuidv4 } from 'uuid'
import {
  chain,
  useAccount,
  useContractWrite,
  useNetwork,
  useSignTypedData
} from 'wagmi'
import { object, string } from 'zod'

import Pending from './Pending'

export const MODULES_CURRENCY_QUERY = gql`
  query EnabledCurrencyModules {
    enabledModuleCurrencies {
      name
      symbol
      decimals
      address
    }
  }
`

const newCommunitySchema = object({
  name: string()
    .min(2, { message: 'Name should be atleast 2 characters' })
    .max(31, { message: 'Name should be less than 32 characters' }),
  description: string()
    .max(260, { message: 'Description should not exceed 260 characters' })
    .nullable()
})

const Create: React.FC = () => {
  const [avatar, setAvatar] = useState<string>()
  const [avatarType, setAvatarType] = useState<string>()
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploading, setUploading] = useState<boolean>(false)
  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889'
  )
  const [selectedCurrencySymobol, setSelectedCurrencySymobol] =
    useState<string>('WMATIC')
  const { currentUser } = useContext(AppContext)
  const [{ data: network }] = useNetwork()
  const [{ data: account }] = useAccount()
  const [{ loading: signLoading }, signTypedData] = useSignTypedData()
  const {
    error,
    data: currencyData,
    loading
  } = useQuery(MODULES_CURRENCY_QUERY)
  const [{ data, loading: writeLoading }, write] = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'postWithSig'
  )

  const form = useZodForm({
    schema: newCommunitySchema
  })

  const handleUpload = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault()
    setUploading(true)
    try {
      // @ts-ignore
      const attachment = await uploadAssetsToIPFS(evt.target.files[0])
      setAvatar(attachment.item)
      setAvatarType(attachment.type)
    } finally {
      setUploading(false)
    }
  }

  const [createPostTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_POST_TYPED_DATA_MUTATION,
    {
      onCompleted({
        createPostTypedData
      }: {
        createPostTypedData: CreatePostBroadcastItemResult
      }) {
        const { typedData } = createPostTypedData
        const {
          profileId,
          contentURI,
          collectModule,
          collectModuleData,
          referenceModule,
          referenceModuleData
        } = typedData?.value

        signTypedData({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        }).then((res) => {
          if (!res.error) {
            const { v, r, s } = splitSignature(res.data)
            const inputStruct = {
              profileId,
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

            write({ args: inputStruct }).then(({ error }) => {
              if (!error) {
                form.reset()
              } else {
                toast.error(error?.message)
              }
            })
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

  const createCommunity = async (name: string, description: string | null) => {
    if (!account?.address) {
      toast.error(CONNECT_WALLET)
    } else if (network.chain?.id !== chain.polygonTestnetMumbai.id) {
      toast.error(WRONG_NETWORK)
    } else {
      setIsUploading(true)
      const { path } = await uploadToIPFS({
        version: '1.0.0',
        metadata_id: uuidv4(),
        description: description,
        content: description,
        external_url: null,
        image: avatar ? avatar : `https://avatar.tobi.sh/${uuidv4()}.svg`,
        imageMimeType: avatarType,
        name: name,
        attributes: [
          {
            traitType: 'type',
            value: 'community'
          }
        ],
        media: [],
        appId: 'Lenster Crowdfund'
      }).finally(() => setIsUploading(false))

      createPostTypedData({
        variables: {
          request: {
            profileId: currentUser?.id,
            contentURI: `ipfs://${path}`,
            collectModule: {
              emptyCollectModule: true
            },
            referenceModule: {
              followerOnlyReferenceModule: false
            }
          }
        }
      })
    }
  }

  if (loading) return <PageLoading message="Loading create crowdfund" />
  if (!currentUser) return <Custom404 />

  return (
    <GridLayout>
      <GridItemFour>
        <SettingsHelper
          heading="Create crowdfund"
          description="Create new decentralized crowdfund"
        />
      </GridItemFour>
      <GridItemEight>
        <Card>
          <CardBody>
            {data?.hash ? (
              <Pending txHash={data?.hash} />
            ) : (
              <Form
                form={form}
                className="space-y-4"
                onSubmit={({ name, description }) => {
                  createCommunity(name, description)
                }}
              >
                <Input
                  label="Title"
                  type="text"
                  placeholder="Lenster DAO"
                  {...form.register('name')}
                />
                <TextArea
                  label="Description"
                  placeholder="Tell us something about the fundraise!"
                  {...form.register('description')}
                />
                <div>
                  <div className="mb-1 font-medium text-gray-800 dark:text-gray-200">
                    Select Currency
                  </div>
                  <select
                    className="w-full bg-white border border-gray-300 outline-none rounded-xl dark:bg-gray-800 dark:border-gray-700 focus:border-brand-500 focus:ring-brand-400 disabled:opacity-60 disabled:bg-gray-500 disabled:bg-opacity-20"
                    onChange={(e) => {
                      const currency = e.target.value.split('-')
                      setSelectedCurrency(currency[0])
                      setSelectedCurrencySymobol(currency[1])
                    }}
                  >
                    {currencyData?.enabledModuleCurrencies?.map(
                      (currency: Erc20) => (
                        <option
                          key={currency.symbol}
                          value={`${currency.address}-${currency.symbol}`}
                        >
                          {currency.name}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <Input
                  label="Funding Goal"
                  type="number"
                  prefix={
                    <img
                      className="w-6 h-6"
                      src={getTokenImage(selectedCurrencySymobol)}
                      alt={selectedCurrencySymobol}
                    />
                  }
                  placeholder="420"
                  {...form.register('name')}
                />
                <div className="space-y-1.5">
                  <label>Cover Image</label>
                  <div className="space-y-3">
                    {avatar && (
                      <div>
                        <img
                          className="rounded-lg h-60 w-60"
                          src={avatar}
                          alt={avatar}
                        />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center space-x-3">
                        <ChooseFile
                          onChange={(
                            evt: React.ChangeEvent<HTMLInputElement>
                          ) => handleUpload(evt)}
                        />
                        {uploading && <Spinner size="sm" />}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-auto">
                  {network.chain?.unsupported ? (
                    <SwitchNetwork />
                  ) : (
                    <Button
                      type="submit"
                      disabled={
                        typedDataLoading ||
                        isUploading ||
                        signLoading ||
                        writeLoading
                      }
                      icon={
                        typedDataLoading ||
                        isUploading ||
                        signLoading ||
                        writeLoading ? (
                          <Spinner size="xs" />
                        ) : (
                          <PlusIcon className="w-4 h-4" />
                        )
                      }
                    >
                      Create
                    </Button>
                  )}
                </div>
              </Form>
            )}
          </CardBody>
        </Card>
      </GridItemEight>
    </GridLayout>
  )
}

export default Create

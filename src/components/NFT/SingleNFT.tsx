import { Card, CardBody } from '@components/UI/Card'
import { Nft } from '@generated/types'
import React from 'react'
import { STATIC_ASSETS } from 'src/constants'
import { chain } from 'wagmi'

interface Props {
  nft: Nft
}

const SingleNFT: React.FC<Props> = ({ nft }) => {
  return (
    <Card>
      <div
        className="h-52 border-b sm:h-80 rounded-t-[10px]"
        style={{
          backgroundImage: `url(${
            nft.originalContent.uri
              ? nft.originalContent.uri
              : `${STATIC_ASSETS}/placeholder.webp`
          })`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <CardBody>
        {nft.collectionName && (
          <div>
            <a
              className="text-sm text-gray-500 truncate"
              href={`https://testnets.opensea.io/collection/${nft.collectionName}`}
              target="_blank"
              rel="noreferrer"
            >
              {nft.collectionName}
            </a>
          </div>
        )}
        <div>
          <a
            className="font-bold truncate"
            href={`https://testnets.opensea.io/assets/${
              nft.chainId === chain.polygonTestnetMumbai.id ? 'matic/' : ''
            }${nft.contractAddress}/${nft.tokenId}`}
            target="_blank"
            rel="noreferrer"
          >
            {nft.name ? nft.name : `#${nft.tokenId}`}
          </a>
        </div>
      </CardBody>
    </Card>
  )
}

export default SingleNFT

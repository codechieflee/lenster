import { Card } from '@components/UI/Card';
import { RARIBLE_URL, STATIC_IMAGES_URL } from 'data/constants';
import type { Nft } from 'lens';
import type { FC } from 'react';
import { CHAIN_ID } from 'src/constants';
import getIPFSLink from 'utils/getIPFSLink';

interface Props {
  nft: Nft;
  linkToDetail?: boolean;
}

const SingleNFT: FC<Props> = ({ nft, linkToDetail = true }) => {
  const nftURL = linkToDetail
    ? `${RARIBLE_URL}/token/${nft.chainId === CHAIN_ID ? 'polygon/' : ''}${nft.contractAddress}:${
        nft.tokenId
      }`.toLowerCase()
    : undefined;

  return (
    <Card>
      {nft?.originalContent?.animatedUrl ? (
        <div className="h-52 border-b sm:h-80 sm:rounded-t-[10px]">
          {nft?.originalContent?.animatedUrl?.includes('.gltf') ? (
            <a href={nftURL} target="_blank" rel="noreferrer noopener">
              <div
                className="h-52 border-b sm:h-80 sm:rounded-t-[10px]"
                style={{
                  backgroundImage: `url(${`${STATIC_IMAGES_URL}/placeholder.webp`})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat'
                }}
              />
            </a>
          ) : (
            <iframe
              title={`${nft.contractAddress}:${nft.tokenId}`}
              sandbox=""
              className="h-full w-full sm:rounded-t-[10px]"
              src={getIPFSLink(nft?.originalContent?.animatedUrl)}
            />
          )}
        </div>
      ) : (
        <a href={nftURL} target="_blank" rel="noreferrer noopener">
          <div
            className="h-52 border-b sm:h-80 sm:rounded-t-[10px]"
            style={{
              backgroundImage: `url(${
                nft.originalContent.uri
                  ? getIPFSLink(nft.originalContent.uri)
                  : `${STATIC_IMAGES_URL}/placeholder.webp`
              })`,
              backgroundSize: 'contain',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        </a>
      )}
      <div className="space-y-1 p-5">
        {nft.collectionName && <div className="lt-text-gray-500 truncate text-sm">{nft.collectionName}</div>}
        <div className="truncate">
          <a className="font-bold" href={nftURL} target="_blank" rel="noreferrer noopener">
            {nft.name ? nft.name : `#${nft.tokenId}`}
          </a>
        </div>
      </div>
    </Card>
  );
};

export default SingleNFT;

import { STATIC_IMAGES_URL } from '@lenster/data/constants';
import { PUBLICATION } from '@lenster/data/tracking';
import getUniswapURL from '@lenster/lib/getUniswapURL';
import { Leafwatch } from '@lib/leafwatch';
import { Trans } from '@lingui/macro';
import Link from 'next/link';
import type { FC } from 'react';

interface UniswapProps {
  module: any;
}

const Uniswap: FC<UniswapProps> = ({ module }) => {
  const amount = module?.amount?.value ?? module?.fee?.amount?.value;
  const currency =
    module?.amount?.asset?.symbol ?? module?.fee?.amount?.asset?.symbol;
  const assetAddress =
    module?.amount?.asset?.address ?? module?.fee?.amount?.asset?.address;

  return (
    <div className="space-y-1">
      <div className="text-sm">
        <Trans>
          You don't have enough <b>{currency}</b>
        </Trans>
      </div>
      <Link
        href={getUniswapURL(parseFloat(amount), assetAddress)}
        onClick={() => {
          Leafwatch.track(PUBLICATION.COLLECT_MODULE.OPEN_UNISWAP);
        }}
        className="flex items-center space-x-1.5 text-xs font-bold text-pink-500"
        target="_blank"
        rel="noreferrer noopener"
      >
        <img
          src={`${STATIC_IMAGES_URL}/brands/uniswap.png`}
          className="h-5 w-5"
          height={20}
          width={20}
          alt="Uniswap"
        />
        <div>
          <Trans>Swap in Uniswap</Trans>
        </div>
      </Link>
    </div>
  );
};

export default Uniswap;

import { Button } from '@components/UI/Button';
import { Spinner } from '@components/UI/Spinner';
import { ArrowRightIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import { HANDLE_SUFFIX } from 'data/constants';
import { useHasTxHashBeenIndexedQuery } from 'lens';
import type { FC } from 'react';

interface Props {
  handle: string;
  txHash: string;
}

const Pending: FC<Props> = ({ handle, txHash }) => {
  const { data, loading } = useHasTxHashBeenIndexedQuery({
    variables: { request: { txHash } },
    pollInterval: 1000
  });

  return (
    <div className="p-5 text-center font-bold">
      {loading ||
      (data?.hasTxHashBeenIndexed.__typename === 'TransactionIndexedResult' &&
        !data?.hasTxHashBeenIndexed.indexed) ? (
        <div className="space-y-3">
          <Spinner className="mx-auto" />
          <div>
            <Trans>Account creation in progress, please wait!</Trans>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-[40px]">🌿</div>
          <div>Account created successfully</div>
          <div className="pt-3">
            <a href={`/u/${handle}${HANDLE_SUFFIX}`}>
              <Button className="mx-auto" icon={<ArrowRightIcon className="mr-1 h-4 w-4" />}>
                <Trans>Go to profile</Trans>
              </Button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pending;

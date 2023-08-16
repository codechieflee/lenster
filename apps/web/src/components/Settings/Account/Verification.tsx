import { BadgeCheckIcon } from '@heroicons/react/solid';
import { Card } from '@lenster/ui';
import isVerified from '@lib/isVerified';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';

const Verification: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  return (
    <Card className="space-y-2 p-5">
      <div className="text-lg font-bold">
        <Trans>Verified</Trans>
      </div>
      {isVerified(currentProfile?.id) ? (
        <div className="flex items-center space-x-1.5">
          <span>Believe it. Yes, you're really verified.</span>
          <BadgeCheckIcon className="text-brand h-5 w-5" />
        </div>
      ) : (
        <div>
          <Trans>No.</Trans>{' '}
        </div>
      )}
    </Card>
  );
};

export default Verification;

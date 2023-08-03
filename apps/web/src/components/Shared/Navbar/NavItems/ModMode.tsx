import useModMode from '@components/utils/hooks/useModMode';
import { LightningBoltIcon as LightningBoltIconOutline } from '@heroicons/react/outline';
import { LightningBoltIcon as LightningBoltIconSolid } from '@heroicons/react/solid';
import { MOD } from '@lenster/data/tracking';
import { Leafwatch } from '@lib/leafwatch';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { FC } from 'react';
import { useModePersistStore } from 'src/store/mode';

interface ModModeProps {
  className?: string;
}

const ModMode: FC<ModModeProps> = ({ className = '' }) => {
  const { allowed: modMode } = useModMode();
  const setModMode = useModePersistStore((state) => state.setModMode);

  const toggleStaffMode = () => {
    setModMode(!modMode);
    Leafwatch.track(MOD.TOGGLE_MODE);
  };

  return (
    <button
      onClick={toggleStaffMode}
      className={clsx(
        'flex w-full items-center space-x-1.5 px-4 py-1.5 text-sm text-gray-700 dark:text-gray-200',
        className
      )}
    >
      {modMode ? (
        <>
          <LightningBoltIconSolid className="h-4 w-4 text-green-600" />
          <div>
            <Trans>Disable mod mode</Trans>
          </div>
        </>
      ) : (
        <>
          <LightningBoltIconOutline className="h-4 w-4 text-red-500" />
          <div>
            <Trans>Enable mod mode</Trans>
          </div>
        </>
      )}
    </button>
  );
};

export default ModMode;

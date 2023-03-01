import { Tooltip } from '@components/UI/Tooltip';
import { LockClosedIcon } from '@heroicons/react/solid';
import { stopEventPropagation } from '@lib/stopEventPropagation';
import { t } from '@lingui/macro';
import type { ElectedMirror, Publication } from 'lens';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';

import Analytics from './Analytics';
import Collect from './Collect';
import Comment from './Comment';
import Like from './Like';
import Mirror from './Mirror';

interface Props {
  publication: Publication;
  electedMirror?: ElectedMirror;
  showCount?: boolean;
}

const PublicationActions: FC<Props> = ({ publication, electedMirror, showCount = false }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const collectModuleType = publication?.collectModule.__typename;
  const canMirror = currentProfile ? publication?.canMirror?.result : true;

  return (
    <div className="-ml-2 flex items-center justify-between pt-3">
      <span className="flex items-center gap-6 sm:gap-8" onClick={stopEventPropagation}>
        <Comment publication={publication} showCount={showCount} />
        {canMirror && <Mirror publication={publication} showCount={showCount} />}
        <Like publication={publication} showCount={showCount} />
        {collectModuleType !== 'RevertCollectModuleSettings' && (
          <Collect electedMirror={electedMirror} publication={publication} showCount={showCount} />
        )}
        <Analytics publication={publication} />
      </span>
      {publication?.isGated && (
        <Tooltip placement="top" content={t`Gated Publication`}>
          <LockClosedIcon className="h-4 w-4 text-green-500" />
        </Tooltip>
      )}
    </div>
  );
};

export default PublicationActions;

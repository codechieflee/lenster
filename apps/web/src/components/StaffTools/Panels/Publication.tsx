import { CollectionIcon, HashtagIcon } from '@heroicons/react/outline';
import { ShieldCheckIcon } from '@heroicons/react/solid';
import { t, Trans } from '@lingui/macro';
import type { Publication } from 'lens';
import type { FC } from 'react';
import { Card } from 'ui';

import MetaDetails from './MetaDetails';

interface PublicationStaffToolProps {
  publication: Publication;
}

const PublicationStaffTool: FC<PublicationStaffToolProps> = ({
  publication
}) => {
  const isComment = publication.__typename === 'Comment';

  return (
    <Card as="aside" className="mt-5 border-yellow-400 !bg-yellow-300/20 p-5">
      <div className="flex items-center space-x-2 text-yellow-600">
        <ShieldCheckIcon className="h-5 w-5" />
        <div className="text-lg font-bold">
          <Trans>Staff tool</Trans>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <MetaDetails
          icon={<HashtagIcon className="lt-text-gray-500 h-4 w-4" />}
          value={publication?.id}
          title={t`Publication ID`}
        >
          {publication?.id}
        </MetaDetails>
        {isComment ? (
          <MetaDetails
            icon={<HashtagIcon className="lt-text-gray-500 h-4 w-4" />}
            value={publication?.commentOn?.id}
            title={t`Comment on`}
          >
            {publication?.commentOn?.id}
          </MetaDetails>
        ) : null}
        {publication?.collectModule?.type ? (
          <MetaDetails
            icon={<CollectionIcon className="lt-text-gray-500 h-4 w-4" />}
            value={publication?.collectModule?.type}
            title={t`Collect module`}
          >
            {publication?.collectModule?.type}
          </MetaDetails>
        ) : null}
      </div>
    </Card>
  );
};

export default PublicationStaffTool;

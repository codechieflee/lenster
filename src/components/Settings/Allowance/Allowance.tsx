import type { ApprovedAllowanceAmount } from '@generated/types';
import { CollectModules } from '@generated/types';
import type { FC } from 'react';

import Module from './Module';

interface Props {
  allowance: any;
}

const Allowance: FC<Props> = ({ allowance }) => {
  return (
    <div className="space-y-4 p-5">
      {allowance?.approvedModuleAllowanceAmount?.map((item: ApprovedAllowanceAmount) =>
        item?.module === CollectModules.RevertCollectModule ||
        item?.module === CollectModules.FreeCollectModule ? (
          ''
        ) : (
          <Module key={item?.contractAddress} module={item} />
        )
      )}
    </div>
  );
};

export default Allowance;

import MetaTags from '@components/Common/MetaTags';
import { APP_NAME, OLD_LENS_RELAYER_ADDRESS } from '@lenster/data/constants';
import getIsDispatcherEnabled from '@lenster/lib/getIsDispatcherEnabled';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@lenster/ui';
import { t, Trans } from '@lingui/macro';
import type { FC } from 'react';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';

import SettingsSidebar from '../Sidebar';
import ToggleDispatcher from './ToggleDispatcher';

const DispatcherSettings: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const canUseRelay = getIsDispatcherEnabled(currentProfile);
  const isOldDispatcherEnabled =
    currentProfile?.dispatcher?.address?.toLocaleLowerCase() ===
    OLD_LENS_RELAYER_ADDRESS.toLocaleLowerCase();

  const getTitleText = () => {
    if (canUseRelay) {
      return <Trans>Disable Signless Transactions</Trans>;
    } else if (isOldDispatcherEnabled) {
      return <Trans>Signless Transactions Upgrade</Trans>;
    } else {
      return <Trans>Signless Transactions</Trans>;
    }
  };

  const getDescription = () => {
    if (isOldDispatcherEnabled) {
      return (
        <Trans>
          Upgrade your dispatcher to the latest version for better, faster,
          stronger signless transactions.
        </Trans>
      );
    }
    return (
      <Trans>
        You can enable dispatcher to interact with {APP_NAME} without signing
        any of your transactions.
      </Trans>
    );
  };

  if (!currentProfile) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={t`Dispatcher • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight>
        <Card className="linkify space-y-2 p-5">
          <div className="flex items-center space-x-2">
            <div className="text-lg font-bold">{getTitleText()}</div>
          </div>
          <div className="pb-2">{getDescription()}</div>
          <ToggleDispatcher />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default DispatcherSettings;

import { Trans } from '@lingui/macro';
import { APP_NAME } from 'data/constants';
import type { FC } from 'react';

const Hero: FC = () => {
  return (
    <div className="bg-hero border-b py-12 dark:border-b-gray-700">
      <div className="mx-auto flex w-full max-w-screen-xl items-stretch px-5 py-8 text-center sm:py-12 sm:text-left">
        <div className="flex-1 space-y-3">
          <div className="font-serif text-2xl font-extrabold sm:text-4xl">
            <Trans>Welcome to {APP_NAME} 👋</Trans>
          </div>
          <div className="leading-7 text-gray-700 dark:text-gray-300">
            <Trans>
              {APP_NAME} is a decentralized, and permissionless social media app built with Lens Protocol 🌿
            </Trans>
          </div>
        </div>
        <div className="hidden w-full flex-1 flex-shrink-0 sm:block" />
      </div>
    </div>
  );
};

export default Hero;

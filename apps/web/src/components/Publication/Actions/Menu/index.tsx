import MenuTransition from '@components/Shared/MenuTransition';
import { Menu } from '@headlessui/react';
import { DotsVerticalIcon } from '@heroicons/react/outline';
import { stopEventPropagation } from '@lib/stopEventPropagation';
import clsx from 'clsx';
import type { Publication } from 'lens';
import type { FC } from 'react';
import { Fragment } from 'react';
import { useAppStore } from 'src/store/app';

import Delete from './Delete';
import Embed from './Embed';
import Permalink from './Permalink';
import Report from './Report';

interface Props {
  publication: Publication;
  forceReloadOnDelete?: boolean;
}

const PublicationMenu: FC<Props> = ({ publication, forceReloadOnDelete }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const iconClassName = 'w-[15px] sm:w-[18px]';

  return (
    <Menu as="div" className="relative">
      <Menu.Button as={Fragment}>
        <button
          className="rounded-full p-1.5 hover:bg-gray-300 hover:bg-opacity-20"
          onClick={stopEventPropagation}
          aria-label="More"
        >
          <DotsVerticalIcon className={clsx('lt-text-gray-500', iconClassName)} />
        </button>
      </Menu.Button>
      <MenuTransition>
        <Menu.Items
          static
          className="absolute right-0 z-[5] mt-1 w-max rounded-xl border bg-white shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          {currentProfile?.id === publication?.profile?.id ? (
            <Delete publication={publication} forceReloadOnDelete={forceReloadOnDelete} />
          ) : (
            <Report publication={publication} />
          )}
          <Embed publication={publication} />
          <Permalink publication={publication} />
        </Menu.Items>
      </MenuTransition>
    </Menu>
  );
};

export default PublicationMenu;

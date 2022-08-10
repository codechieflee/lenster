import UserProfile from '@components/Shared/UserProfile';
import { Profile } from '@generated/types';
import { ChipIcon, DatabaseIcon, ExclamationIcon, ShareIcon, UserIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, ReactNode } from 'react';
import { useAppPersistStore } from 'src/store/app';

interface MenuProps {
  children: ReactNode;
  current: boolean;
  url: string;
}

const Menu: FC<MenuProps> = ({ children, current, url }) => (
  <Link href={url}>
    <a
      href={url}
      className={clsx(
        'flex items-center space-x-2 rounded-lg px-3 py-2 hover:bg-brand-100 hover:text-brand dark:hover:bg-opacity-20 dark:bg-opacity-20 hover:bg-opacity-100',
        { 'bg-brand-100 text-brand font-bold': current }
      )}
    >
      {children}
    </a>
  </Link>
);

const Sidebar: FC = () => {
  const { pathname } = useRouter();
  const currentUser = useAppPersistStore((state) => state.currentUser);

  return (
    <div className="px-3 mb-4 space-y-1.5 sm:px-0">
      <div className="pb-3">
        <UserProfile profile={currentUser as Profile} />
      </div>
      <Menu current={pathname == '/settings'} url="/settings">
        <UserIcon className="w-4 h-4" />
        <div>Profile</div>
      </Menu>
      <Menu current={pathname == '/settings/account'} url="/settings/account">
        <ChipIcon className="w-4 h-4" />
        <div>Account</div>
      </Menu>
      <Menu current={pathname == '/settings/allowance'} url="/settings/allowance">
        <ShareIcon className="w-4 h-4" />
        <div>Allowance</div>
      </Menu>
      <Menu current={pathname == '/settings/data'} url="/settings/data">
        <DatabaseIcon className="w-4 h-4" />
        <div>Data</div>
      </Menu>
      <Menu current={pathname == '/settings/delete'} url="/settings/delete">
        <ExclamationIcon className="w-4 h-4 text-red-500" />
        <div className="text-red-500">Danger Zone</div>
      </Menu>
    </div>
  );
};

export default Sidebar;

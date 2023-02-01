import { Menu } from '@headlessui/react';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { FC } from 'react';
import { Fragment } from 'react';

import MenuTransition from '../MenuTransition';
import Contact from './NavItems/Contact';
import ReportBug from './NavItems/ReportBug';

const MoreNavItems: FC = () => {
  return (
    <Menu as="div">
      {({ open }) => (
        <>
          <Menu.Button
            className={clsx(
              'w-full cursor-pointer rounded-md px-2 py-1 text-left text-sm font-bold tracking-wide md:px-3',
              {
                'bg-gray-200 text-black dark:bg-gray-800 dark:text-white': open,
                'text-gray-700 hover:bg-gray-200 hover:text-black dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white':
                  !open
              }
            )}
          >
            <Trans>More</Trans>
          </Menu.Button>
          <MenuTransition>
            <Menu.Items
              static
              className="absolute mt-2 rounded-xl border bg-white py-1 shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
            >
              <Menu.Item
                as="div"
                className={({ active }: { active: boolean }) =>
                  clsx({ 'dropdown-active': active }, 'm-2 rounded-lg')
                }
              >
                <Contact />
              </Menu.Item>
              <Menu.Item
                as="div"
                className={({ active }: { active: boolean }) =>
                  clsx({ 'dropdown-active': active }, 'm-2 rounded-lg')
                }
              >
                <ReportBug />
              </Menu.Item>
            </Menu.Items>
          </MenuTransition>
        </>
      )}
    </Menu>
  );
};

export default MoreNavItems;

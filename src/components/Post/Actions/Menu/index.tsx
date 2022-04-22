import { NextLink } from '@components/Shared/Navbar/MenuItems'
import AppContext from '@components/utils/AppContext'
import { LensterPost } from '@generated/lenstertypes'
import { Menu, Transition } from '@headlessui/react'
import {
  DotsHorizontalIcon,
  ShieldExclamationIcon
} from '@heroicons/react/outline'
import trackEvent from '@lib/trackEvent'
import clsx from 'clsx'
import { FC, Fragment, useContext } from 'react'

import Delete from './Delete'

interface Props {
  post: LensterPost
}

const PostMenu: FC<Props> = ({ post }) => {
  const { currentUser } = useContext(AppContext)

  return (
    <Menu as="div">
      {({ open }) => (
        <>
          <Menu.Button className="p-1.5 rounded-full hover:bg-gray-300 hover:bg-opacity-20">
            <DotsHorizontalIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
          </Menu.Button>
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              className="absolute py-1 w-max bg-white rounded-xl border shadow-sm dark:bg-gray-900 focus:outline-none z-[5] dark:border-gray-700/80"
            >
              {currentUser?.id === post?.profile?.id ? (
                <Delete post={post} />
              ) : (
                <Menu.Item
                  as={NextLink}
                  href={`/report/${post?.id}`}
                  onClick={() => trackEvent('report menu')}
                  className={({ active }: { active: boolean }) =>
                    clsx(
                      { 'bg-gray-100 dark:bg-gray-800': active },
                      'block px-4 py-1.5 text-sm text-red-500 m-2 rounded-lg cursor-pointer'
                    )
                  }
                >
                  <div className="flex items-center space-x-2">
                    <ShieldExclamationIcon className="w-4 h-4" />
                    <div>Report Post</div>
                  </div>
                </Menu.Item>
              )}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}

export default PostMenu

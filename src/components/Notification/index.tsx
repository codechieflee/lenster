import { Menu, Transition } from '@headlessui/react'
import { LightningBoltIcon } from '@heroicons/react/outline'
import { Fragment } from 'react'

import List from './List'

const Notification: React.FC = () => {
  return (
    <Menu as="span" className="relative mt-1.5">
      {({ open }) => (
        <>
          <Menu.Button>
            <LightningBoltIcon className="h-6 w-6" />
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
            <Menu.Items className="overflow-y-auto max-h-[50vh] absolute py-1 right-0 mt-1 w-full md:min-w-[25rem] bg-white rounded-xl border shadow-sm dark:bg-gray-900 dark:border-gray-800">
              <List />
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}

export default Notification

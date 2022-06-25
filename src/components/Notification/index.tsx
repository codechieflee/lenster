import { LightningBoltIcon } from '@heroicons/react/outline'
import { FC } from 'react'

import List from './List'

const Notification: FC = () => {
  return (
    <div className="flex flex-grow justify-center px-0 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl w-full space-y-3">
        <div className="flex items-center space-x-2">
          <LightningBoltIcon className="h-5 w-5" />
          <div className="font-bold">Notification</div>
        </div>
        <List />
      </div>
    </div>
  )
}

export default Notification

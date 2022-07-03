import SEO from '@components/utils/SEO'
import { LightningBoltIcon } from '@heroicons/react/outline'
import { FC } from 'react'
import { APP_NAME } from 'src/constants'
import Custom404 from 'src/pages/404'
import { useAppPersistStore } from 'src/store/app'

import List from './List'

const Notification: FC = () => {
  const { isAuthenticated } = useAppPersistStore()

  if (!isAuthenticated) return <Custom404 />

  return (
    <div className="flex flex-grow justify-center px-0 sm:px-6 lg:px-8 py-8">
      <SEO title={`Notifications • ${APP_NAME}`} />
      <div className="max-w-4xl w-full space-y-3">
        <div className="flex items-center space-x-2 px-5 sm:px-0">
          <LightningBoltIcon className="h-5 w-5" />
          <div className="font-bold">Notification</div>
        </div>
        <List />
      </div>
    </div>
  )
}

export default Notification

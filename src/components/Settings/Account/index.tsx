import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import SuperFollow from '@components/Settings/Account/SuperFollow'
import SEO from '@components/utils/SEO'
import { NextPage } from 'next'
import React from 'react'
import { APP_NAME } from 'src/constants'
import Custom404 from 'src/pages/404'
import useAppStore from 'src/store'

import Sidebar from '../Sidebar'
import CrossPost from './CrossPost'
import SetProfile from './SetProfile'
import Verification from './Verification'

const AccountSettings: NextPage = () => {
  const { currentUser } = useAppStore()

  if (!currentUser) return <Custom404 />

  return (
    <GridLayout>
      <SEO title={`Account settings • ${APP_NAME}`} />
      <GridItemFour>
        <Sidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <SetProfile />
        <SuperFollow />
        <Verification />
        <CrossPost />
      </GridItemEight>
    </GridLayout>
  )
}

export default AccountSettings

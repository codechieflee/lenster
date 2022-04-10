import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import SuperFollow from '@components/Settings/Account/SuperFollow/Create'
import AppContext from '@components/utils/AppContext'
import SEO from '@components/utils/SEO'
import { NextPage } from 'next'
import React, { useContext } from 'react'
import Custom404 from 'src/pages/404'

import Sidebar from '../Sidebar'
import SetProfile from './SetProfile'

const AccountSettings: NextPage = () => {
  const { currentUser } = useContext(AppContext)

  if (!currentUser) return <Custom404 />

  return (
    <GridLayout>
      <SEO title="Account settings • Lenster" />
      <GridItemFour>
        <Sidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <SetProfile />
        <SuperFollow />
      </GridItemEight>
    </GridLayout>
  )
}

export default AccountSettings

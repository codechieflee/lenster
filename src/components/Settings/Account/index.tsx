import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import AppContext from '@components/utils/AppContext'
import SEO from '@components/utils/SEO'
import { NextPage } from 'next'
import React, { useContext } from 'react'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'

import Sidebar from '../Sidebar'
import SetProfile from './SetProfile'

const AccountSettings: NextPage = () => {
  const { currentUser, currentUserError } = useContext(AppContext)

  if (currentUserError) return <Custom500 />
  if (!currentUser) return <Custom404 />

  return (
    <GridLayout>
      <SEO title="Account settings • Lenster" />
      <GridItemFour>
        <Sidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <SetProfile />
      </GridItemEight>
    </GridLayout>
  )
}

export default AccountSettings

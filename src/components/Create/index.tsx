import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import Signup from '@components/Shared/Navbar/Login/Create'
import SettingsHelper from '@components/Shared/SettingsHelper'
import { Card, CardBody } from '@components/UI/Card'
import SEO from '@components/utils/SEO'
import { NextPage } from 'next'
import React from 'react'
import { APP_NAME } from 'src/constants'
import Custom404 from 'src/pages/404'
import { useAppPersistStore } from 'src/store/app'

const Create: NextPage = () => {
  const { currentUser } = useAppPersistStore()

  if (!currentUser) return <Custom404 />

  return (
    <GridLayout>
      <SEO title={`Create Profile • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsHelper
          heading="Create profile"
          description="Create new decentralized profile"
        />
      </GridItemFour>
      <GridItemEight>
        <Card>
          <CardBody>
            <Signup />
          </CardBody>
        </Card>
      </GridItemEight>
    </GridLayout>
  )
}

export default Create

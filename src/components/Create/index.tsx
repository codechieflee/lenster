import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import Signup from '@components/Shared/Navbar/Login/Create'
import SettingsHelper from '@components/Shared/SettingsHelper'
import { Card, CardBody } from '@components/UI/Card'
import AppContext from '@components/utils/AppContext'
import React, { useContext } from 'react'
import Custom404 from 'src/pages/404'

const Create: React.FC = () => {
  const { currentUser } = useContext(AppContext)

  if (!currentUser) return <Custom404 />

  return (
    <GridLayout>
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

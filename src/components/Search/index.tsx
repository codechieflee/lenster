import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import SEO from '@components/utils/SEO'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import Custom404 from 'src/pages/404'

import Profiles from './Profiles'
import Publications from './Publications'
import Sidebar from './Sidebar'

const Search: NextPage = () => {
  const { query } = useRouter()

  if (!query.q || !['pubs', 'profiles'].includes(query.type as any))
    return <Custom404 />

  return (
    <>
      <SEO />
      <GridLayout>
        <GridItemFour>
          <Sidebar />
        </GridItemFour>
        <GridItemEight className="space-y-5">
          {query.type === 'profiles' && <Profiles query={query.q} />}
          {query.type === 'pubs' && <Publications query={query.q} />}
        </GridItemEight>
      </GridLayout>
    </>
  )
}

export default Search

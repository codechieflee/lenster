import { gql, useQuery } from '@apollo/client'
import { Profile } from '@generated/types'
import { MinimalProfileFields } from '@gql/MinimalProfileFields'
import consoleLog from '@lib/consoleLog'
import Head from 'next/head'
import { useTheme } from 'next-themes'
import { FC, ReactNode, useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

import Loading from './Loading'
import Navbar from './Shared/Navbar'
import AppContext from './utils/AppContext'

export const CURRENT_USER_QUERY = gql`
  query CurrentUser($ownedBy: [EthereumAddress!]) {
    profiles(request: { ownedBy: $ownedBy }) {
      items {
        ...MinimalProfileFields
        isDefault
      }
    }
  }
  ${MinimalProfileFields}
`

interface Props {
  children: ReactNode
}

const SiteLayout: FC<Props> = ({ children }) => {
  const { resolvedTheme } = useTheme()
  const [pageLoading, setPageLoading] = useState<boolean>(true)
  const [staffMode, setStaffMode] = useState<boolean>()
  const [refreshToken, setRefreshToken] = useState<string>()
  const [selectedProfile, setSelectedProfile] = useState<number>(0)
  const { data: accountData } = useAccount()
  const { activeConnector } = useConnect()
  const { disconnect } = useDisconnect()
  const { data, loading, error } = useQuery(CURRENT_USER_QUERY, {
    variables: { ownedBy: accountData?.address },
    skip: !selectedProfile || !refreshToken,
    onCompleted(data) {
      consoleLog(
        'Query',
        '#8b5cf6',
        `Fetched ${data?.profiles?.items?.length} owned profiles`
      )
    }
  })
  const profiles: Profile[] = data?.profiles?.items
    ?.slice()
    ?.sort((a: Profile, b: Profile) => Number(a.id) - Number(b.id))

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false)
    }, 500)
    setSelectedProfile(localStorage.selectedProfile)
    setRefreshToken(localStorage.refreshToken)
    setStaffMode(localStorage.staffMode === 'true')

    if (!activeConnector) {
      disconnect()
    }

    activeConnector?.on('change', () => {
      localStorage.removeItem('selectedProfile')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      disconnect()
    })
  }, [selectedProfile, activeConnector, disconnect])

  const injectedGlobalContext = {
    selectedProfile,
    setSelectedProfile,
    staffMode,
    setStaffMode,
    profiles: profiles,
    currentUser: profiles && profiles[selectedProfile],
    currentUserLoading: loading,
    currentUserError: error
  }

  const toastOptions = {
    style: {
      background: resolvedTheme === 'dark' ? '#18181B' : '',
      color: resolvedTheme === 'dark' ? '#fff' : ''
    },
    success: {
      className: 'border border-green-500',
      iconTheme: {
        primary: '#10B981',
        secondary: 'white'
      }
    },
    error: {
      className: 'border border-red-500',
      iconTheme: {
        primary: '#EF4444',
        secondary: 'white'
      }
    },
    loading: { className: 'border border-gray-300' }
  }

  if (loading || pageLoading) return <Loading />

  return (
    <AppContext.Provider value={injectedGlobalContext}>
      <Head>
        <meta
          name="theme-color"
          content={resolvedTheme === 'dark' ? '#1b1b1d' : '#ffffff'}
        />
      </Head>
      <Toaster position="bottom-right" toastOptions={toastOptions} />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        {children}
      </div>
    </AppContext.Provider>
  )
}

export default SiteLayout

import { gql, useQuery } from '@apollo/client'
import { Profile } from '@generated/types'
import { MinimalProfileFields } from '@gql/MinimalProfileFields'
import consoleLog from '@lib/consoleLog'
import Cookies from 'js-cookie'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useTheme } from 'next-themes'
import { FC, ReactNode, Suspense, useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { CHAIN_ID } from 'src/constants'
import { useAppStore, usePersistStore } from 'src/store'
import { useAccount, useDisconnect, useNetwork } from 'wagmi'

import Loading from './Loading'

const Navbar = dynamic(() => import('./Shared/Navbar'), { suspense: true })

export const CURRENT_USER_QUERY = gql`
  query CurrentUser($ownedBy: [EthereumAddress!]) {
    profiles(request: { ownedBy: $ownedBy }) {
      items {
        ...MinimalProfileFields
        isDefault
      }
    }
    userSigNonces {
      lensHubOnChainSigNonce
    }
  }
  ${MinimalProfileFields}
`

interface Props {
  children: ReactNode
}

const SiteLayout: FC<Props> = ({ children }) => {
  const { resolvedTheme } = useTheme()
  const { setProfiles, setUserSigNonce } = useAppStore()
  const { isAuthenticated, setIsAuthenticated, currentUser, setCurrentUser } =
    usePersistStore()
  const [mounted, setMounted] = useState<boolean>(false)
  const { address, connector, isDisconnected } = useAccount()
  const { chain } = useNetwork()
  const { disconnect } = useDisconnect()
  const { loading } = useQuery(CURRENT_USER_QUERY, {
    variables: { ownedBy: address },
    skip: !isAuthenticated,
    onCompleted(data) {
      const profiles: Profile[] = data?.profiles?.items
        ?.slice()
        ?.sort((a: Profile, b: Profile) => Number(a.id) - Number(b.id))
        ?.sort((a: Profile, b: Profile) =>
          !(a.isDefault !== b.isDefault) ? 0 : a.isDefault ? -1 : 1
        )

      if (profiles.length === 0) {
        setCurrentUser(null)
      } else {
        setProfiles(profiles)
        setUserSigNonce(data?.userSigNonces?.lensHubOnChainSigNonce)
      }

      consoleLog(
        'Query',
        '#8b5cf6',
        `Fetched ${data?.profiles?.items?.length} owned profiles`
      )
    }
  })

  useEffect(() => {
    const accessToken = Cookies.get('accessToken')
    const refreshToken = Cookies.get('refreshToken')
    setMounted(true)

    const logout = () => {
      setIsAuthenticated(false)
      setCurrentUser(null)
      Cookies.remove('accessToken')
      Cookies.remove('refreshToken')
      localStorage.removeItem('lenster.store')
      if (disconnect) disconnect()
    }

    if (
      refreshToken &&
      accessToken &&
      accessToken !== 'undefined' &&
      refreshToken !== 'undefined' &&
      currentUser &&
      chain?.id === CHAIN_ID
    ) {
      setIsAuthenticated(true)
    } else {
      if (isAuthenticated) logout()
    }

    if (isDisconnected) {
      if (disconnect) disconnect()
      setIsAuthenticated(false)
    }

    connector?.on('change', () => {
      logout()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isDisconnected, connector, disconnect, setCurrentUser])

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

  if (loading || !mounted) return <Loading />

  return (
    <>
      <Head>
        <meta
          name="theme-color"
          content={resolvedTheme === 'dark' ? '#1b1b1d' : '#ffffff'}
        />
      </Head>
      <Toaster position="bottom-right" toastOptions={toastOptions} />
      <Suspense fallback={<Loading />}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          {children}
        </div>
      </Suspense>
    </>
  )
}

export default SiteLayout

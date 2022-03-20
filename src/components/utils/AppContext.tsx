import { ApolloError } from '@apollo/client'
import { Profile } from '@generated/types'
import { createContext, Dispatch } from 'react'

export interface ContextType {
  selectedProfile: number
  setSelectedProfile: Dispatch<number>
  staffMode?: boolean
  setStaffMode: Dispatch<boolean>
  profiles: Profile[]
  currentUser: Profile | undefined
  currentUserLoading: boolean
  currentUserError?: ApolloError
}

const AppContext = createContext<ContextType>({
  selectedProfile: 0,
  setSelectedProfile: () => {},
  staffMode: false,
  setStaffMode: () => {},
  profiles: [],
  currentUser: undefined,
  currentUserLoading: false,
  currentUserError: undefined
})

export default AppContext

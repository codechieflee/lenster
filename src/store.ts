/* eslint-disable no-unused-vars */
import { Profile } from '@generated/types'
import create from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  profiles: Profile[] | []
  setProfiles: (profiles: Profile[]) => void
  userSigNonce: number
  setUserSigNonce: (userSigNonce: number) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  profiles: [],
  setProfiles: (profiles) => set(() => ({ profiles })),
  userSigNonce: 0,
  setUserSigNonce: (userSigNonce) => set(() => ({ userSigNonce }))
}))

interface PersistState {
  isAuthenticated: boolean
  setIsAuthenticated: (isAuthenticated: boolean) => void
  currentUser: Profile | null
  setCurrentUser: (currentUser: Profile | null) => void
  staffMode: boolean
  setStaffMode: (staffMode: boolean) => void
}

export const usePersistStore = create(
  persist<PersistState>(
    (set) => ({
      isAuthenticated: false,
      setIsAuthenticated: (isAuthenticated) => set(() => ({ isAuthenticated })),
      currentUser: null,
      setCurrentUser: (currentUser) => set(() => ({ currentUser })),
      staffMode: false,
      setStaffMode: (staffMode) => set(() => ({ staffMode }))
    }),
    { name: 'lenster.store' }
  )
)

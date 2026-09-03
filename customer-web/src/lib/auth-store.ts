import { create } from 'zustand'
import { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  profile: any | null
  loading: boolean
  phone: string | null
  setPhone: (phone: string) => void
  setAuth: (user: User, profile: any) => void
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,
  phone: null,

  setPhone: (phone) => set({ phone }),

  setAuth: (user, profile) => set({ user, profile, loading: false }),

  logout: async () => {
    const { signOut } = await import('firebase/auth')
    const { auth } = await import('@/lib/firebase')
    await signOut(auth)
    set({ user: null, profile: null, phone: null, loading: false })
  },
}))

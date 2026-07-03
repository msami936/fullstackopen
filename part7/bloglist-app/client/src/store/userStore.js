import { create } from 'zustand'
import blogService from '../services/blogs'
import loginService from '../services/login'
import persistentUser from '../services/persistentUser'

const useUserStore = create((set) => ({
  user: null,
  actions: {
    initializeUser: () => {
      const user = persistentUser.getUser()
      if (user) {
        blogService.setToken(user.token)
        set({ user })
      }
    },
    login: async (credentials) => {
      const userObject = await loginService.login(credentials)
      persistentUser.saveUser(userObject)
      blogService.setToken(userObject.token)
      set({ user: userObject })
      return userObject
    },
    logout: () => {
      persistentUser.removeUser()
      blogService.setToken(null)
      set({ user: null })
    },
  },
}))

export const useUser = () => useUserStore((state) => state.user)
export const useUserActions = () => useUserStore((state) => state.actions)

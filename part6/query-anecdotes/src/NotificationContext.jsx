import { createContext, useContext, useRef, useState } from 'react'

/* eslint-disable react-refresh/only-export-components */

const NotificationContext = createContext(null)

export const NotificationProvider = ({ children }) => {
  const [message, setMessage] = useState(null)
  const timeoutRef = useRef(null)

  const notify = (notification) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setMessage(notification)
    timeoutRef.current = setTimeout(() => {
      setMessage(null)
      timeoutRef.current = null
    }, 5000)
  }

  return (
    <NotificationContext.Provider value={{ message, notify }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotify = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotify must be used within a NotificationProvider')
  }
  return context.notify
}

export const useNotificationMessage = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotificationMessage must be used within a NotificationProvider')
  }
  return context.message
}

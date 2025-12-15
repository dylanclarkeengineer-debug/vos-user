'use client'

import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react'
import Cookies from 'js-cookie'

import { logout as logoutHandler } from '@/utils/auth/authHandlers'
import profileHandlers from '@/utils/user/profileHandlers' // getUserProfile

// --- 1. INITIAL STATE ---
const initialState = {
  isAuthenticated: false,
  user: null, // populated with profile object from API
  isLoading: true, // true while we validate token / fetch profile
}

// --- 2. REDUCER ---
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload, // payload will be the user profile object (merged with decoded token if needed)
        isLoading: false,
      }
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
      }
    case 'STOP_LOADING':
      return {
        ...state,
        isLoading: false,
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      }
    default:
      return state
  }
}

// --- 3. CREATE CONTEXT ---
const AuthContext = createContext()

// --- 4. PROVIDER ---
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  /**
   * Decode JWT without external dependency.
   * Works in browser environment (this is a client component).
   * Returns decoded payload object or null on error.
   */
  const safeDecode = (token) => {
    try {
      if (!token || typeof token !== 'string') return null
      const parts = token.split('.')
      if (parts.length < 2) return null
      const payload = parts[1]

      // base64url -> base64
      const b64 = payload.replace(/-/g, '+').replace(/_/g, '/')
      // Pad base64 string if necessary
      const pad = b64.length % 4
      const padded = pad ? b64 + '='.repeat(4 - pad) : b64

      // atob only available in browser (client component). Use decodeURIComponent to handle unicode.
      const jsonPayload = decodeURIComponent(
        atob(padded)
          .split('')
          .map(c => {
            const code = c.charCodeAt(0).toString(16).toUpperCase()
            return '%' + ('00' + code).slice(-2)
          })
          .join('')
      )

      return JSON.parse(jsonPayload)
    } catch (e) {
      console.error('Invalid JWT token', e)
      return null
    }
  }

  // Refresh / fetch profile by userId using profileHandlers.getUserProfile
  const fetchAndSetProfile = useCallback(async (userId, token) => {
    try {
      const profile = await profileHandlers.getUserProfile(userId, token)
      // profile is expected in format:
      // {"email":"...","user_id":"...","created_at":{...},"name":"...","phone":"...","businesses":[...],"personal_profile_image":"..."}
      dispatch({ type: 'LOGIN_SUCCESS', payload: profile })
      return profile
    } catch (err) {
      console.error('Failed to fetch user profile in auth context', err)
      // If profile fetch fails due to auth, clear cookie and logout
      try {
        Cookies.remove('vos_token')
      } catch (e) { /* ignore */ }
      dispatch({ type: 'LOGOUT' })
      return null
    }
  }, [])

  // A. Login: accept a token (cookie is usually already set by auth handlers)
  const login = useCallback(async (token) => {
    if (!token) {
      dispatch({ type: 'STOP_LOADING' })
      return
    }

    // ensure cookie is set
    try {
      if (!Cookies.get('vos_token')) Cookies.set('vos_token', token)
    } catch (e) {
      // ignore cookie set errors in some environments
    }

    const decoded = safeDecode(token)
    if (!decoded) {
      logout()
      return
    }

    // token might contain user_id or sub
    const userId = decoded.user_id || decoded.sub || decoded?.id

    // token expiry check
    const currentTime = Date.now() / 1000
    if (decoded.exp && decoded.exp < currentTime) {
      // token expired
      logout()
      return
    }

    // fetch profile and set into state
    if (userId) {
      await fetchAndSetProfile(userId, token)
    } else {
      // fallback: set decoded token as user minimal object
      dispatch({ type: 'LOGIN_SUCCESS', payload: decoded })
    }
  }, [fetchAndSetProfile])

  // B. Logout: clear state and cookie
  const logout = useCallback(() => {
    try {
      logoutHandler() // existing logic to clear cookie/session on client & server if necessary
    } catch (e) {
      console.error('logoutHandler error', e)
      try { Cookies.remove('vos_token') } catch (err) { /* ignore */ }
    }
    dispatch({ type: 'LOGOUT' })
  }, [])

  // Expose a manual refreshProfile to allow other parts to refresh user info
  const refreshProfile = useCallback(async () => {
    const token = Cookies.get('vos_token')
    if (!token) return null
    const decoded = safeDecode(token)
    const userId = decoded?.user_id || decoded?.sub || decoded?.id
    if (!userId) return null
    return fetchAndSetProfile(userId, token)
  }, [fetchAndSetProfile])

  // C. Initialize auth on mount (restore session)
  useEffect(() => {
    const initializeAuth = async () => {
      const token = Cookies.get('vos_token')

      if (token) {
        const decoded = safeDecode(token)
        if (!decoded) {
          logout()
          return
        }
        const currentTime = Date.now() / 1000

        // Check token expiry
        if (decoded.exp && decoded.exp < currentTime) {
          logout()
          return
        }

        // try to fetch full profile and set state
        const userId = decoded.user_id || decoded.sub || decoded?.id
        if (userId) {
          await fetchAndSetProfile(userId, token)
        } else {
          // If token doesn't contain id, just set decoded token
          dispatch({ type: 'LOGIN_SUCCESS', payload: decoded })
        }
      } else {
        // No token
        dispatch({ type: 'STOP_LOADING' })
      }
    }

    initializeAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // run once on client init

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      logout,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// --- 5. CUSTOM HOOK ---
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
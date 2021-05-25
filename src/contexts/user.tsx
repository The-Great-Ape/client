// src/count-context.tsx
import * as React from 'react'
type Action = {type: 'user'} | {type: 'isConnected'}
type Dispatch = (action: Action) => void
type State = {user: Object; isConnected: boolean}
type CountProviderProps = {children: React.ReactNode}
const CountStateContext = React.createContext<{state: State; dispatch: Dispatch} | undefined>(undefined)

function userReducer(state: State, action: Action) {
  switch (action.type) {
    case 'user': {
      return {user: state.user}
    }
    case 'isConnected': {
        return {isConnected: state.isConnected}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function CountProvider({children}: CountProviderProps) {
  const [state, dispatch] = React.useReducer(userReducer, {user: null, isConnected: false})
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = {state, dispatch}
  return (
    <CountStateContext.Provider value={value}>
      {children}
    </CountStateContext.Provider>
  )
}

function useCount() {
  const context = React.useContext(CountStateContext)
  if (context === undefined) {
    throw new Error('useCount must be used within a CountProvider')
  }
  return context
}

export {CountProvider, useCount}
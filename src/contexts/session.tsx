import React, { createContext, useContext, useState, useEffect } from 'react';
import Session from '../models/Session';

//Initial state
const LOCAL_STORAGE_KEY = 'grape-session';
let grapeSession = localStorage.getItem(LOCAL_STORAGE_KEY);
if(grapeSession === "undefined") grapeSession = null;
let initialState = JSON.parse(grapeSession) || null;

if(initialState === "undefined"){
  initialState = null;
}

export type SessionContextType = {
  session: Session;
  setSession: (Session: Session) => void;
}

export const SessionContext = createContext<SessionContextType>({ 
  session: initialState, 
  setSession: session => console.warn('no session provider') 
});

export const useSession = () => useContext(SessionContext);

export const SessionProvider: React.FC = ({ children }) => {
  const [session, setSession] = useState(initialState);

  useEffect(() => {
    console.log('setting session', session);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  )
}
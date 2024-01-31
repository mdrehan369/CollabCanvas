import { createContext , useContext } from 'react';

export const userContext = createContext({user:{}});

export const UserContextProvider = userContext.Provider;

export function useUserContext() {
    return useContext(userContext);
}

import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { UserContextProvider } from "./contexts/UserContext.js"

function App() {

  const [user, setUser] = useState(null);

  return (
    <UserContextProvider value={{user, setUser}}>
      <Outlet />
    </UserContextProvider>
  )
}

export default App

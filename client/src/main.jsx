import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginForm from './components/LoginForm.jsx'
import SignupForm from './components/SignupForm.jsx'
import WhiteBoard from './components/WhiteBoard.jsx'
import Home from './components/Home.jsx'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/login',
                element: <LoginForm />
            },
            {
                path: '/signup',
                element: <SignupForm />
            },
            {
                path:'/whiteBoard/:id',
                element: <WhiteBoard />
            }
        ]
    },

])

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router}/>
)

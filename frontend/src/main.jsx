import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Register, Login, Profile, Edit, ProfileUpload} from "../index.js";
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path: "register",
        element: <Register/>
      },
      {
        path: "login",
        element: <Login/>
      },
      {
        path: "profile",
        element: <Profile/>,
      },
      {
        path: "edit/:id",
        element: <Edit/>
      },
      {
        path: "profileupload",
        element: <ProfileUpload/>
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)

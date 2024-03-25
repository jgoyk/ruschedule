import React from 'react'
import './index.css'
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";

const router = createBrowserRouter([
  { path: "*", Component: Home },
  { path: "/profile", Component: Profile },
]);

const root = createRoot(document.getElementById('root'));
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

root.render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />;
    </ClerkProvider>
);

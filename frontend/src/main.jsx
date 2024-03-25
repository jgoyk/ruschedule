import React from 'react'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import ReactDOM, { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { ClerkProvider } from '@clerk/clerk-react'
 

const root = createRoot(document.getElementById('root'));
const domain = import.meta.env.VITE_DOMAIN
const clientid = import.meta.env.VITE_CLIENT_ID
const uri = import.meta.env.VITE_URI
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

root.render(
  <BrowserRouter>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App className="oswald-font"/>
    </ClerkProvider>
  </BrowserRouter>,
);

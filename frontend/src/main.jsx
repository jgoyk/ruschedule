import React from 'react'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import ReactDOM, { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';


const root = createRoot(document.getElementById('root'));
const domain = import.meta.env.VITE_DOMAIN
const clientid = import.meta.env.VITE_CLIENT_ID
const uri = import.meta.env.VITE_LINK

root.render(
  <BrowserRouter>
    <Auth0Provider
      domain={domain}
      clientId={clientid}
      authorizationParams={{
        redirect_uri: {uri}
      }}
    >
        <App />
    </Auth0Provider>
  </BrowserRouter>,
);

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import AppContexProvider from './context/appContext.jsx';

const token = localStorage.getItem("token");

ReactDOM.createRoot(document.getElementById('root')).render(


  <React.StrictMode>
    <BrowserRouter>
      <AppContexProvider token={token}>
        <App />
      </AppContexProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

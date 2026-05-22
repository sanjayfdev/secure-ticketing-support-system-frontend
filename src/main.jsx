import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@emotion/react'
import { Toaster } from 'react-hot-toast'
import theme from './theme/theme.js'
import router from './app/router.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <Toaster position='top-right'/>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)

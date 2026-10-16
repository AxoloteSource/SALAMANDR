import { MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import App from './app'
import { AxiosProvider } from './contexts/AxiosContext'
import { ThemeProvider } from './contexts/ThemeProvider'
import routes from './routes/index'
import store from './store/index'

// Mantine
import '@mantine/core/styles.layer.css'
import 'mantine-datatable/styles.layer.css'

// Tailwind css (also imports @axolotesource/ui/styles.css)
import './tailwind.css'

import './i18n'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AxiosProvider>
      <Provider store={store}>
        <App>
          <ThemeProvider defaultTheme="dark" storageKey="theme">
            <MantineProvider>
              <QueryClientProvider client={queryClient}>
                <Suspense fallback={<div>Cargando...</div>}>
                  <RouterProvider router={routes} />
                </Suspense>
              </QueryClientProvider>
            </MantineProvider>
          </ThemeProvider>
        </App>
      </Provider>
    </AxiosProvider>
  </React.StrictMode>
)

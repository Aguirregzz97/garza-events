import { initializeIcons } from '@uifabric/icons'
import * as React from 'react'
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { App } from './components/App'
import { getCurrentUser } from './shared/getCurrentUser'
import { history } from './shared/history'
import { getErrorAsString } from './shared/logging/getErrorAsString'
import { Log } from './shared/logging/Log'

// Used in index.html
require('./assets/img/favicon.ico')

Log.logger.info('Starting app...')

initializeIcons()

render((
  <HashRouter>
    <App />
  </HashRouter>
), document.getElementById('root'), () => {
  Log.logger.info('Done rendering!')
  const currentUser = getCurrentUser()
  // Si el usuario no esta registrado en la empresa, redirigir
  if (!currentUser) {
    Log.logger.warn('Redirecting to another webpage because user is not logged in!')
    history.push(`/#/changeEmpresa`)
  }
})

async function installServiceWorkers() {
  // Service worker registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      Log.logger.info('Running SW code...')
      try {
        await navigator.serviceWorker.register('/service-worker.js')
        Log.logger.info('SW registered!')
      } catch (error) {
        Log.logger.error('SW registration failed: ' + getErrorAsString(error))
      }

      // If ever in need of disabling all service workers, uncomment this
      // try {
      //   const registrations = await navigator.serviceWorker.getRegistrations()
      //   for (const registration of registrations) {
      //     registration.unregister()
      //     Log.logger.info('Service worker unregistered')
      //   }
      // } catch (error) {
      //   Log.logger.error('SW unregistration failed: ' + getErrorAsString(error))
      // }
    })
  } else {
    Log.logger.warn('Browser does not support service workers')
  }
}

installServiceWorkers()

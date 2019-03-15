import { initializeIcons } from '@uifabric/icons'
import * as React from 'react'
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { App } from './components/App'
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
})

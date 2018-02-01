import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './components/App'
import Model from './model'

const store = Model.getStore()
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)




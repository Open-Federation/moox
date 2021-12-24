import moox from '../moox'
import user from './models/user'

export default moox({
  user
},{
  // @ts-ignore
  enhancer: window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({
    name: 'Maglar-Page-' + document.title
  })
})
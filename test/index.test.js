import test from 'ava'
import moox from '../src/index'
import user from './fixtures/user'

test('addUser', t=>{
  let model = moox({
    user
  })
  t.is(typeof model.getStore, 'function')
  t.is(typeof model.user, 'object')
  t.is(Object.keys(model.user).length, 7)
  let store = model.getStore()

  model.user.addUserSyncAction()
  let state = store.getState()
  t.is(state.user.list.length, 3)
})

test('preloadedState', t=>{
  let model = moox({
    user
  }, {
    preloadedState: {
      user: {
        list: ['tom', 'xiaoming', 'haha'],
        status: 0,
        filterText: ''
      }
    }
  })
  let state = model.getState()
  
  t.is(state.user.list.length, 3)
})
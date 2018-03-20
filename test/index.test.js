import test from 'ava'
import moox from '../src/index'
import user from './fixtures/user'

test('moox', t=>{
  let model = moox({
    user
  })
  t.is(typeof model.getStore, 'function')
  t.is(typeof model.user, 'object')
  t.is(Object.keys(model.user).length, 6)

  let store = model.getStore()

  model.user.addUserSyncAction()
  let state = store.getState()
  t.is(state.user.list.length, 3)
})
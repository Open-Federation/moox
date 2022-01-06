import moox from '@/index';
import user from './user'

describe('Default cases', () => {
  test('base', () => {
    let model = moox({
      user
    })
    expect(typeof model.getStore).toBe('function')
    expect(typeof model.user).toBe('object')
    //@ts-ignore
    expect(Object.keys(model.user).length).toBe(7)

    let store = model.getStore()

    model.user?.addUserSyncAction()
    let state = store.getState()
    //@ts-ignore
    expect(state.user.list.length).toBe(3)
  });

  test('many model', ()=>{
    interface IState{
      data: any
    }
    const state: IState = {
      data: null
    }
    let model = moox({
      user: {
        state,
        actions: {
          testAction: (state: IState, params: any)=>{
            state.data = params;
          }
        }
      },
      order: {
        state: {
          data: null
        },
        actions:{
          testAction: (state: IState, params: any)=>{
            state.data = params;
          }
        }
      },
    })

    let store = model.getStore()
    //@ts-ignore
    model.order.testAction({id: 1})

    let data = store.getState()
    //@ts-ignore
    expect(data.order.data).toEqual({id: 1})
    //@ts-ignore
    expect(data.user.data).toBe(null)
  })
});



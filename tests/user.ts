interface IState {
    list: string[],
    status: number,
    filterText: string
  }

const state = {
    list: ['tom', 'xiaoming'],
    status: 0,
    filterText: ''
  }


  export default {
    state,
    actions: {
      changeCurrentEditUserAction: function(state:IState, action){
        state.list[action.index] = action.name
      },
      changeFilterValueAction: function(state:IState, action){
        state.filterText = action.text
      },
      changeEditIndexAction: function(state:IState, action){
        state.currentEditIndex = action.index
      },
      addUserAction: function (state:IState, action) {
        state.list.push(getRandomName())
        state.status = 0
      },
      addUserSyncAction: function(state:IState, action){
        state.list.push(getRandomName(5))
      },
      requestStatusAction: function (state:IState, action) {
        state.status = 1
      },
      delUserAction: function(state:IState, action){
        state.list.splice(action.index, 1)
      }
    }
  }

  function getRandomName(len=4){
    let str = ''
    while(len--) str += String.fromCharCode(97 + Math.ceil(Math.random()* 25))
    return str
  }

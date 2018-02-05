export default {
  state: {
    list: [200, 300],
    status: 0,
    filterText: ''
  },
  addUserSyncAction: null,
  requestStatusAction: null,
  changeFilterValueAction: (text)=>({
    text
  }),
  changeCurrentEditUserAction: (name, index) =>({
    name,
    index
  }),
  addUserAction: () => (
    {
      payload: new Promise((resolve) => {
        setTimeout(function () {
          resolve(100)
        }, 300)
      })
    }
  ),
  delUserAction: (index)=>{
    return {
      index: index
    }
  },  
  reducers: {
    changeCurrentEditUserAction: function(state, action){
      state.list[action.index] = action.name
    },
    changeFilterValueAction: function(state, action){
      state.filterText = action.text
    },
    changeEditIndexAction: function(state, action){
      state.currentEditIndex = action.index
    },
    addUserAction: function (state, action) {
      state.list.push(Math.round(Math.random() * 1000))
      state.status = 0
    },
    addUserSyncAction: function(state, action){
      state.list.push(Math.round(Math.random() * 1000))
    },
    requestStatusAction: function (state, action) {
      state.status = 1
    },
    delUserAction: function(state, action){
      state.list.splice(action.index, 1)
    }
  }
}
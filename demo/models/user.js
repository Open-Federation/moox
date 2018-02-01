export default {
  state: {
    list: [1],
    status: 0
  },
  requestStatusAction: () => { },
  addUserAction: () => (
    {
      payload: new Promise((resolve) => {
        setTimeout(function () {
          resolve(100)
        }, 1000)
      })
    }),  
  reducers: {
    addUserAction: function (state, action) {
      state.list.push(Math.round(Math.random() * 1000))
      state.status = 0
    },
    requestStatusAction: function (state, action) {
      state.status = 1
    }
  }
}
export default {
  state: {
    list: ['tom', 'xiaoming'],
    status: 0,
    filterText: ''
  },

  changeCurrentEditUserAction: function (state, params) {
    state.list[params.index] = params.name
  },
  /**
   * paramsTypes = {
   *  text: filterText
   * }
   */
  changeFilterValueAction: function (state, params) {
    state.filterText = params.text
  },
  changeEditIndexAction: function (state, params) {
    state.currentEditIndex = params.index
  },
  addUserAction: function (state, params) {
    state.list.push(getRandomName())
    state.status = 0
  },
  requestStatusAction: function (state, params) {
    state.status = 1
  },
  delUserAction: function (state, params) {
    state.list.splice(params.index, 1)
  }

}

function getRandomName(len = 4) {
  let str = ''
  while (len--) str += String.fromCharCode(97 + Math.ceil(Math.random() * 25))
  return str
}
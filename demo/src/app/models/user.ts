import {IModel, IActionFun} from '../../moox'

type ActionType = {
  changeCurrentEditUser: IActionFun,
  changeFilterValue: IActionFun,
  changeEditIndex: IActionFun,
  addUser: IActionFun,
  requestStatus: IActionFun,
  delUser: IActionFun

}

const config: IModel<ActionType> = {
  state: {
    list: ['tom', 'xiaoming'],
    status: 0,
    filterText: ''
  },

  actions: {
    changeCurrentEditUser: function (state, params) {
      state.list[params.index] = params.name;
    },
    /**
     * paramsTypes = {
     *  text: filterText
     * }
     */
    changeFilterValue: function (state, params) {
      console.log(555, state, params)
      state.filterText = params.text;
    },
    changeEditIndex: function (state, params) {
      state.currentEditIndex = params.index;
    },
    addUser: function (state, params) {
      state.list.push(getRandomName());
      state.status = 0;
    },
    requestStatus: function (state, params) {
      state.status = 1;
    },
    delUser: function (state, params) {
      state.list.splice(params.index, 1);
    }
  }
};

export default config;

function getRandomName(len = 4) {
  let str = '';
  while (len--) str += String.fromCharCode(97 + Math.ceil(Math.random() * 25));
  return str;
}

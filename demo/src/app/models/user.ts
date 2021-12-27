import {createModel} from '../../moox'

type StateType = {
  list: string[],
  status: number,
  filterText: string,
  currentEditIndex: number
}

const state : StateType = {
  list: ['tom', 'xiaoming'],
  status: 0,
  filterText: '',
  currentEditIndex: 0
}

const actions = {
  changeCurrentEditUser: function (state: StateType, params: {
    name: string,
    index: number, //index of todo list 
  }) {
    state.list[params.index] = params.name;
  },
  changeFilterValue: function (state: StateType, params: {
    text?: string
  }) {
    
    console.log(555, state, params)
    
    state.filterText = params.text;
  },
  changeEditIndex: function (state: StateType, params) {
    state.currentEditIndex = params.index;
  },
  addUser: function (state: StateType, params) {
    state.list.push(getRandomName());
    state.status = 0;
  },
  requestStatus: function (state: StateType, params) {
    // state.ss
    state.status = 1;
  },
  delUser: function (state: StateType, params) {
    state.list.splice(params.index, 1);
  }
}


export default createModel({
  state, 
  actions
});

function getRandomName(len = 4) {
  let str = '';
  while (len--) str += String.fromCharCode(97 + Math.ceil(Math.random() * 25));
  return str;
}

# moox
moox is a high-performance state management tool of based on redux.

> version 2.0 is refactoring by ts.

## Install
```bash
npm install moox
```

## Getting Started

### 1.create Model
The structure of the model is as the following sample code，state is initialState of model, action is used of calculating state。

```js
import {createModel} from 'moox'

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


```

### 2.Bind the component to the Provider

```js
export default Models.getProvider(App)
```

### 3.Get store data from hook

```js
import React from 'react'
import Model from './model'

const App = (props)=>{
  const store = useModel((state) => ({
    user: state.user
  }))
  const {user} = store;
  const handleClick = () =>{
    if(user.status === 1) return;
    Model.user.requestStatusAction()
    Model.user.addUserAction()
  }

  return <div>
    <div><button  onClick={handleClick}>Add Random Number</button>
      {user.status === 1? 'loading...' : ''}
    </div>

    {user.list.map((item, index)=>{
      return <div key={index}>{item}</div>
    })}
  </div>
}
export default App;

```
>Note: In addition to hooks usage, class are also supported here, please refer to the following example

```js
import {connect} from 'react-redux';

const changeState = ()=>{
   Models.user.changeStateAction({
      x: Math.random()
   })
}

@connect(state=>({
	store: state.user
}))
const Home = class extends React.PureComponent{
   render(){
    const {store} = this.props;
    return <span onClick={changeState}   >{JSON.stringify(store)}</span>
  }
}

```

For more detailed usage, please refer to [demo](https://github.com/Open-Federation/moox/tree/master/demo)

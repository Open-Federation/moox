# moox
moox 是基于 redux 开发的高性能状态管理机。

> 2.0版本用 ts 重写了，正在完善用

## Install
npm install moox

## Getting Started

### 第一步：创建 Model
> model 的结构如下面示例代码，model.state 指 initialState, action 函数负责计算 state 数据。

model.js

```js
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

```
Model属性介绍：
| name | type | description |
| --- | --- | --- |
| user | `Object` | 申明的user store对象，可通过 user[actionName](params) 修改状态 |
| getProvider | `function` | 将store注入到组件上，每个页面只需在入口文件注入，其他地方不需要 |
| useModel | `function` | 获取store的hook函数 |
| getState | `function` | 获取当前全局state |


### 第二步：绑定到父组件

```js
export default Models.getProvider(App)
```

### 第三步，获取store

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
>注：这里除了 hooks 用法外,也支持使用非hooks方式,请参考如下示例

```js
import {connect} from 'react-redux';

const changeState = ()=>{
   //修改
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



实际使用请参考 [demo](https://github.com/suxiaoxin/moox/tree/master/demo)

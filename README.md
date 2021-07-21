# moox
moox 是基于 redux 开发的高性能状态管理机。

## Install
npm install moox

## Getting Started

### 第一步：创建 Model
> model 的结构如下面示例代码，model.state 是初始化的 state, 带 Action 字符串后缀的的函数是一个 action，action 负责计算 state 数据。

model.js

```js
import moox from 'moox'
import user from './models/user'

export default moox({
  user: {
    state: {
        list: [1],
        status: 0
    },
    addUserAction: function (state, params) {
        state.list.push(Math.round(Math.random() * 1000))
        state.status = 0
    },
    requestStatusAction: function (state, params) {
        state.status = 1
    }
    }
})
```

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

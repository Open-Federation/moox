# moox 
moox 是基于 redux 开发的高性能状态管理机。

## Install
npm install moox

## Getting Started

### 第一步：Init

model.js

```js
import moox from 'moox'
import user from './models/user'

export default moox({
  user
})

```

### 第二步: 创建 Model

models/user.js

model 的结构如下面示例代码，model.state 是初始化的 state, 带 Action 字符串后缀的的函数是一个 action，action 负责计算 state 数据。

```js
export default {
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

```

### 第三步：绑定到父组件

```js
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './components/App'
import Model from './model'

const store = Model.getStore()
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

### 第四步：connect 到应用

```js
import React from 'react'
import { connect } from 'react-redux'
import Model from './model'

const App = (props)=>{  
  const handleClick = () =>{
    if(props.user.status === 1) return;
    Model.user.requestStatusAction()    
    Model.user.addUserAction()
  }

  return <div>
    <div><button  onClick={handleClick}>Add Random Number</button>    
      {props.user.status === 1? 'loading...' : ''}
    </div>
    
    {props.user.list.map((item, index)=>{
      return <div key={index}>{item}</div>
    })}
  </div>
}


export default connect((state)=>({
  user: state.user
}))(App)

```


实际使用请参考 [demo](https://github.com/suxiaoxin/moox/tree/master/demo)

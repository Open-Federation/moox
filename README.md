# moox 
moox 是基于 redux 开发的高性能状态管理机。

## 安装
npm install moox

## 用法
moox 封装了 redux 的 action, reducer 到一个文件。如下面示例代码，model.state 是初始化的 state, 带 Action 字符串后缀的函数是一个 action，比较特殊的是，action 函数不需要写繁琐的 type, 所有 actionType 都会自动生成。MODEL 对象里的 reducers 存储纯函数 reducer，比较特殊的是，moox reducer 不需要返回新的 state,直接修改函数参数传入的 state,即可自动化生成新的 state。

## Example

model 层代码：
```js
const model = {
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

```

组件层跟 react-redux 用法一样：
```js
const App = (props)=>{  
  const handleClick = () =>{
    if(props.user.status === 1) return;
    props.requestStatusAction()    
    props.addUserAction()  
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
}), {
  addUserAction: Model.user.addUserAction,
  requestStatusAction: Model.user.requestStatusAction
})(App)

```
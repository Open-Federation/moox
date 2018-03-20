# moox 
moox 是基于 redux 开发的高性能状态管理机。

## 安装
npm install moox

## 用法
moox 封装了 redux 的 action, reducer 到一个文件。

首先调用 moox(models) 初始化，models 对象结构是
```
{
  modelName1: model1,
  modelName2: model2,
  modelName3: model3,
  ...
}
```

model 的结构如下面示例代码，model.state 是初始化的 state, 带 Action 字符串后缀的的函数是一个 action，action 负责计算 state 数据。

## Example

model 层代码：
```js
const model = {
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

组件层需要调用 connect 方法绑定 state ，对 state 数据的修改，直接调用 aciton。 
```js
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

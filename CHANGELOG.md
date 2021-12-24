## 2.0
使用 ts 重构,和 1.0 不兼容,升级指南：
```js
// 1.0
{
    state: {}
    init: (draftState, params){}
}

// 2.0 所有 actions 移动至 actions 下
{
    state: {},
    actions: (draftState, params){}

}


```
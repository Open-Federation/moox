import React from 'react'
import Models from '../model'
const {useModel} = Models;
interface IState {
  user: any
}

const App = () => {
  const store = useModel((state: IState) => ({  
    user: state.user
  }))
  const {user} = store;
  const handleClick = () => {
    if (user.status === 1) return;
    Models.user.requestStatus()
    setTimeout(()=>{
      Models.user.addUser()
    }, 400)
  }
  

  const handleClickSync = () => Models.user.addUser()
  const handleFilterValue = (event)=>{
    let text = event.target.value;
    Models.user.changeFilterValue({
      text
    })
  }
  const delUser = (index) => ()=>Models.user.delUser({
    index
  })
  const getContent = (item, index) => {
    return <input type="text" onChange={(event) => {
      Models.user.changeCurrentEditUser({
        name: event.target.value,
        index
      })
    }} value={item} />
  }
  const list = user.list.filter(item=>{
    item = item + '';
    return !user.filterText || item.indexOf(user.filterText) !== -1
  })

  return <div style={{ width: 500, margin: '100px auto' }}>
    <div >
      <input placeholder="Filter" style={{height: 35, width: '100%', backgroundColor: '#eee'}} type="text" value={user.filterText} onChange={handleFilterValue} />
    </div>
    <div>
      <button style={{ height: '40px', margin: 30 }} onClick={handleClick}>Async Add Random Number</button>
      <button style={{ height: '40px', margin: 30 }} onClick={handleClickSync}>Add Random Number</button>
      {user.status === 1 ? 'loading...' : ''}
    </div>
    {list.map((item, index) => {
      return <div style={{ height: 30, margin: 15, backgroundColor: '#eee' }} key={index}>{}{getContent(item, index)} &nbsp; <span onClick={delUser(index)}>X</span></div>
    })}
  </div>
}
export default Models.getProvider(App)

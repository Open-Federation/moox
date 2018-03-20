import React from 'react'
import { connect } from 'react-redux'
import Model from '../model'

const App = (props) => {

  const handleClick = () => {
    if (props.user.status === 1) return;
    Model.user.requestStatusAction()
    setTimeout(()=>{
      Model.user.addUserAction()
    }, 400)
  }


  const handleClickSync = () => Model.user.addUserAction()
  const handleFilterValue = (event)=>{
    let text = event.target.value
    Model.user.changeFilterValueAction({
      text
    })
  }
  const delUser = (index) => ()=>Model.user.delUserAction({
    index
  })
  const getContent = (item, index) => {
    return <input type="text" onChange={(event) => {
      Model.user.changeCurrentEditUserAction({
        name: event.target.value,
        index
      })
    }} value={item} />
  }
  const list = props.user.list.filter(item=>{
    item = item + '';
    return !props.user.filterText || item.indexOf(props.user.filterText) !== -1
  })

  return <div style={{ width: 500, margin: '100px auto' }}>
    <div >
      <input placeholder="Filter" style={{height: 35, width: '100%', backgroundColor: '#eee'}} type="text" value={props.user.filterText} onChange={handleFilterValue} />
    </div>
    <div>
      <button style={{ height: '40px', margin: 30 }} onClick={handleClick}>Async Add Random Number</button>
      <button style={{ height: '40px', margin: 30 }} onClick={handleClickSync}>Add Random Number</button>
      {props.user.status === 1 ? 'loading...' : ''}
    </div>
    {list.map((item, index) => {
      return <div style={{ height: 30, margin: 15, backgroundColor: '#eee' }} key={index}>{}{getContent(item, index)} &nbsp; <span onClick={delUser(index)}>X</span></div>
    })}
  </div>
}
export default connect((state) => ({
  user: state.user
}))(App)

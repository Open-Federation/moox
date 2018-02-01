import React from 'react'
import { connect } from 'react-redux'
import Model from '../model'



const App = (props)=>{  
  const handleClick = () =>{
    if(props.user.status === 1) return;
    props.requestStatusAction()    
    props.addUserAction()  
  }

  return <div>
    <div><button style={{height: '40px'}} onClick={handleClick}>Add Random Number</button>    
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


import {combineReducers, createStore as _createStore, applyMiddleware} from 'redux'
import promiseMiddleware from 'redux-promise';
import produce from "immer"

const ActionSuffix = 'Action'
const CONFIG = {}

function getType(modelName, actionName){
  return 'moox/' + modelName + '/' + actionName
}

function getActionByTypeName(type){
  return type.split('/')[2]
}

function loadModel(name, model){
  const initialState = model.state;
  return  function reducer(state = initialState, action){
    let actionFn = getActionByTypeName(action.type);
    if(model.reducers[actionFn]){
      if(CONFIG.immer){
        return produce(state, nextState=>{
          return model.reducers[actionFn](nextState, action, state)
        })
      }
      return model.reducers[actionFn](state, action)
    }    
    return state
  }
}

function loadActions(name, model){
  const keys = Object.keys(model);
  const actions = {}
  keys.forEach(item=>{
    let len = item.length;
    if(item.substr(len-6) === ActionSuffix){
      actions[item] = function actionCreator(...args){
        let action;
        if(typeof model[item] === 'function'){
          action = model[item].apply(this, ...args)
          action = action ? action : {}
        }else action = {}
        action.type = getType(name, item)
        return action
      }
    }
  })
  return actions;
}

const defaultMiddleware = [promiseMiddleware]

function moox(models, config = {
  middleware:[],
  immer: true
}){
  const keys = Object.keys(models);  
  Object.assign(CONFIG, config)
  const reducers = {}
  let store;
  const middleware = defaultMiddleware.concat(config.middleware)
  const MOOX = {
    getStore: function(){
      if(store) return store;
      let finalCreateStore;
      finalCreateStore = applyMiddleware(...middleware)(_createStore);
      store = finalCreateStore(combineReducers(reducers))
      return store;
    }
  }

  keys.forEach(name=>{
    reducers[name] = loadModel(name, models[name])
    MOOX[name] = loadActions(name, models[name])
  })
  return MOOX;
}


module.exports = moox;
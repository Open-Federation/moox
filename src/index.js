import {combineReducers, createStore as _createStore, applyMiddleware} from 'redux'
import produce from "immer"
import { useSelector } from 'react-redux'
import { Provider } from 'react-redux'
import React from 'react'

const typePrefix = 'Moox'
const storeConfig = {}

export function useModel(selectorReturningObject, shallowEqual){
    return useSelector(selectorReturningObject, shallowEqual)
}

export default moox;

function getType(modelName, actionName){
  return typePrefix + '/' + modelName + '/' + actionName
}

function getActionByTypeName(type){
  return type.split('/')
}

function loadModel(name, model){
  const initialState = model.state;
  model.$name = name;
  return  function reducer(state = initialState, action){
    let params = action.params;
    let types = getActionByTypeName(action.type);
    if(types[0] !== typePrefix){
      return state;
    }else if(types[1] !== model.$name){
      return state;
    }
    let actionFn = types[2];
    if(model[actionFn]){
      if(storeConfig.immer && model.immer !== false){
        return produce(state, draftState=>{
          return model[actionFn](draftState, params, state)
        })
      }
      return model[actionFn](state, params)
    }
    return state
  }
}

function loadActions(name, model){
  const store = this;
  const keys = Object.keys(model);
  const actions = {}
  keys.forEach(key=>{
    if(typeof model[key] === 'function'){
      actions[key] = function actionCreator(params){
        return store.dispatch({
          type: getType(name, key),
          params
        })
      }
    }
  })
  return actions;
}

const defaultMiddleware = []

function moox(models, customConfig = {}){
  const Moox = {}
  const reducers = {}
  let   store;

  const keys = Object.keys(models);
  Object.assign(storeConfig, {
    middleware:[],
    immer: true
  },customConfig)

  keys.forEach(name=>{
    reducers[name] = loadModel(name, models[name])
  })

  const middleware = defaultMiddleware.concat(storeConfig.middleware)
  store = applyMiddleware(...middleware)(_createStore)(combineReducers(reducers), storeConfig.preloadedState, storeConfig.enhancer);

  Moox.getReducers = ()=> reducers;
  Moox.getStore = ()=> store
  Moox.getState = ()=> store.getState()
  Moox.useModel = useModel;
  Moox.getProvider = (Application)=> ()=>{
    return React.createElement(Provider, {
        store: store
      }, React.createElement(Application, null));
  }

  keys.forEach(name=>{
    if(name.indexOf('get') === 0){
        throw new Error(`modelName"${name}" is not a valid, the name prefix must not use "get" or "use"`)
    }
    Moox[name] = loadActions.call(store, name, models[name])
  })



  return Moox;
}

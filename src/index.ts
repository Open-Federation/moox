import {combineReducers, createStore, applyMiddleware, compose} from 'redux'
import produce from "immer"
import { useSelector } from 'react-redux'
import { Provider } from 'react-redux'
import * as  React from 'react'

const typePrefix = 'Moox'


export const useModel = useSelector;

export default moox;

function getType(modelName: string, actionName: string){
  return typePrefix + '/' + modelName + '/' + actionName
}

function getActionByTypeName(type: string){
  return type.split('/')
}

interface IInitialState{} 

interface IActionFun{
  (draftState: any, args: any, state?: any) : null
}

type IModel ={
  state: IInitialState,  //初始化状态
  $name?: string, //model名称
  immer: boolean
}&{
  [actionName : string]: IActionFun
}

interface IActions{
  [actionName: string]: (params: any)=> any
}

const loadActions = (store: any)=> (name: string, model: IModel)=>{
  const keys = Object.keys(model);
  const actions: IActions = {}
  keys.forEach(key=>{
    if(typeof model[key] === 'function'){
      actions[key] = function actionCreator(params: any){
        return store.dispatch({
          type: getType(name, key),
          params
        })
      }
    }
  })
  return actions;
}

const defaultMiddleware: any[] = []

interface IConfig {
  preloadedState?: any,
  middleware?: any,
  immer?: boolean,
  enhancer?: any,
}

interface IModels {
  [modelName: string]: IModel
}

function moox(models: IModels, customConfig: IConfig = {}){
  const reducers: any = {}

  const keys: string[] = Object.keys(models);
  const storeConfig : IConfig= {
    middleware:[],
    immer: true,
    ...customConfig
  }

  function loadModel(name: string, model: IModel){
    const initialState = model.state;
    model.$name = name;
    return  function reducer(state = initialState, action: any){
      let params = action.params;
      let types = getActionByTypeName(action.type);
      if(types[0] !== typePrefix){
        return state;
      }else if(types[1] !== model.$name){
        return state;
      }
      let actionFn = types[2];
      const fn: IActionFun = model[actionFn];
      if(fn){
        const enableImmer = typeof model.immer === 'undefined' ? storeConfig.immer : model.immer;
        if(enableImmer ){
          return produce(state, draftState=>{
            return fn(draftState, params, state)
          })
        }
        return fn(state, params)
      }
      return state
    }
  }

  keys.forEach(name=>{
    reducers[name] = loadModel(name, models[name])
  })

  const middleware = defaultMiddleware.concat(storeConfig.middleware)
  const store = createStore(combineReducers(reducers), 
    storeConfig.preloadedState, 
    compose(applyMiddleware(...middleware),storeConfig.enhancer)
  );


  const Moox = {
    getReducers : ()=> reducers,
    getStore:()=> store,
    getState:()=> store.getState(),
    useModel: useModel,
    getProvider: (Application: React.FC) => ()=>{
      return React.createElement(Provider, {
          store: store
        }, React.createElement(Application, null));
      }
  }

  keys.forEach(name=>{
    if(name.indexOf('get') === 0){
        throw new Error(`modelName"${name}" is not a valid, the name prefix must not use "get" or "use"`)
    }
    Moox[name] = loadActions(store)( name, models[name])
  })

  return Moox;
}

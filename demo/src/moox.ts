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

export interface IActionFun{
  (draftState: any, args: any, state?: any) : void
}

export type IModel<T extends Record<string,  IActionFun>> ={
  state: IInitialState,  //初始化状态
  $name?: string, //model名称
  immer?: boolean,
  actions: T;
}

const defaultMiddleware: any[] = []

interface IConfig {
  preloadedState?: any,
  middleware?: any,
  immer?: boolean,
  enhancer?: any,
}

function moox<T extends Record<string,  any>, MS extends {
  [modelName:string]: IModel<T>
}>(models: MS, customConfig: IConfig = {}){
  const reducers: any = {}
  
  const keys = Object.keys(models);
  const storeConfig : IConfig= {
    middleware:[],
    immer: true,
    ...customConfig
  }

  function loadModel(name: string, model: IModel<T>){
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
      const fn: IActionFun = model.actions[actionFn];
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

  interface Ac {
    (params?: Record<string, any>) : void
  }

  const loadActions = <T> (store)=> (name: string, actions: T) =>{
    const keys = Object.keys(actions);
    
    const res: {
      [actionName in keyof T]?: Ac
    } = {};
    keys.forEach(key=>{
      if(typeof actions[key] === 'function'){
        res[key] = function actionCreator(params?: Record<string, any> ){
          return store.dispatch({
            type: getType(name, key),
            params
          })
        }
      }
    })
    return res
  }

  keys.forEach((name)=>{
    reducers[name] = loadModel(name, models[name])
  })

  const middleware = defaultMiddleware.concat(storeConfig.middleware);
  const funMiddleware = applyMiddleware(...middleware);
  const store = createStore(combineReducers(reducers), 
    storeConfig.preloadedState, 
    storeConfig.enhancer? compose(funMiddleware,storeConfig.enhancer): funMiddleware
  );

  const Base: {
    getReducers: any,
    getStore: any,
    getState: any,
    useModel: any,
    getProvider: any,
  }  = {
    getReducers : ()=> reducers,
    getStore:()=> store,
    getState:()=> store.getState(),
    useModel: useModel,
    getProvider: (Application: React.ComponentType) => ()=>{
      return React.createElement(Provider, {
          // @ts-ignore:  code error
          store: store
        }, React.createElement(Application, null));
    }
  }

  const Actions: {
    [name in keyof MS]?: {
      [action in keyof MS[name]['actions']] : Ac
    }
  } = {};
  
  keys.forEach(name=>{
    const res = loadActions<T> (store)( name, models[name].actions);
    // @ts-ignore
    Actions[name] = res;
  })

  const Moox = {
    ...Base,
    ...Actions
  }

  return Moox
}

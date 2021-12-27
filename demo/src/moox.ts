import {combineReducers, createStore, applyMiddleware, compose} from 'redux'
import produce from "immer"
import { useSelector } from 'react-redux'
import { Provider } from 'react-redux'
import * as  React from 'react'

const NamePrefix = 'Moox'

function getType(modelName: string, actionName: string) : string{
  return NamePrefix + '/' + modelName + '/' + actionName
}
function getActionByTypeName(type: string): string[]{
  return type.split('/')
}

export interface IActionFun<ParamType>{
  (draftState: any, params: ParamType, state?: any) : void
}

export type IModel<T, S> ={
  state: S,  //Initinal state
  $name?: string, //Model name, not need to manually add it
  immer?: boolean, 
  actions: T
}

export const createModel = <T, S>(model: IModel<T, S>)=>{
  const {state, actions} = model;
  return {
    state,
    actions
  }
}

const defaultMiddleware: any[] = []

interface IConfig {
  preloadedState?: any,
  middleware?: any,
  immer?: boolean,
  enhancer?: any,
}


function loadModel<
  T extends Record<string, IActionFun<P>>, 
  S,
  P,
  >(name: string, model: IModel<T, S>){
  model.$name = name;
  return  function reducer(state: S = model.state, action: any){
    let types = getActionByTypeName(action.type);
    let actionName = types[2];
    type keyType = keyof T;
    const fn = model.actions[actionName as keyType];
    type ParamType = Parameters<typeof fn>[1];
    let params = action.params as ParamType;
    
    if(types[0] !== NamePrefix){
      return state;
    }else if(types[1] !== model.$name){
      return state;
    }
    
    if(fn){
      
      if(model.immer ){
        return produce(state, draftState=>{
          //@ts-ignore
          return fn(draftState, params, state)
        })
      }
      return fn(state, params)
    }
    return state
  }
}

interface Ac<ParamType> {
  (params?: ParamType) : void
}

const loadActions = <T extends Record<string, IActionFun<any>>> (store)=> (name: string, actions: T) =>{
  const keys = Object.keys(actions);
  
  const res: {
    [actionName in keyof T]?:  Ac<Parameters<T[actionName]>[1] >
  } = {};
  keys.forEach(key=>{
    if(typeof actions[key] === 'function'){
      //@ts-ignore
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

function moox<T extends Record<string,  any>, S, MS extends {
  [modelName:string]: IModel<T, S>
}>(models: MS, customConfig: IConfig = {}){
  const reducers: any = {}
  
  const keys = Object.keys(models);
  const storeConfig : IConfig= {
    middleware:[],
    immer: true,
    //@ts-ignore redux-dev-tools is supported by default.
    enhancer: window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({
      name: document.title
    }),
    ...customConfig
  }

  keys.forEach((name)=>{
    models[name].immer = typeof models[name].immer === 'undefined' ? storeConfig.immer : models[name].immer;
    reducers[name] = loadModel(name, models[name]);
  })

  const middleware = defaultMiddleware.concat(storeConfig.middleware);
  const funMiddleware = applyMiddleware(...middleware);
  const store = createStore(combineReducers(reducers), 
    storeConfig.preloadedState, 
    storeConfig.enhancer? compose(funMiddleware,storeConfig.enhancer): funMiddleware
  );

  const Base = {
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
      [action in keyof MS[name]['actions']] : Ac<Parameters<MS[name]['actions'][action]>[1] >
    }
  } = {};
  
  keys.forEach(name=>{
    const res = loadActions(store)( name, models[name].actions);
    // @ts-ignore
    Actions[name] = res;
  })

  const Moox = {
    ...Base,
    ...Actions
  }

  return Moox
}

export const useModel = useSelector;
export default moox;
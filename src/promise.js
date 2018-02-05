import { isFSA } from 'flux-standard-action';
import {extend} from './utils';

function isPromise(val) {
  return val && typeof val.then === 'function';
}

export default function promiseMiddleware({ dispatch }) {
  return next => action => {
    if (!isFSA(action)) {
      return isPromise(action)
        ? action.then(dispatch)
        : next(action);
    }

    return isPromise(action.payload)
      ? action.payload.then(
          result => dispatch(extend({}, action, {payload: result} )),
          error => {
            dispatch(extend({}, action, {payload: error, error: true }));
            return Promise.reject(error);
          }
        )
      : next(action);
  };
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = promiseMiddleware;

var _fluxStandardAction = require('flux-standard-action');

var _utils = require('./utils');

function isPromise(val) {
  return val && typeof val.then === 'function';
}

function promiseMiddleware(_ref) {
  var dispatch = _ref.dispatch;

  return function (next) {
    return function (action) {
      if (!(0, _fluxStandardAction.isFSA)(action)) {
        return isPromise(action) ? action.then(dispatch) : next(action);
      }

      return isPromise(action.payload) ? action.payload.then(function (result) {
        return dispatch((0, _utils.extend)({}, action, { payload: result }));
      }, function (error) {
        dispatch((0, _utils.extend)({}, action, { payload: error, error: true }));
        return Promise.reject(error);
      }) : next(action);
    };
  };
}
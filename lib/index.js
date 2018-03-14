'use strict';

var _redux = require('redux');

var _promise = require('./promise');

var _promise2 = _interopRequireDefault(_promise);

var _immer = require('immer');

var _immer2 = _interopRequireDefault(_immer);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var window = undefined;
var ActionSuffix = 'Action';
var CONFIG = {};

function getType(modelName, actionName) {
  return 'moox/' + modelName + '/' + actionName;
}

function getActionByTypeName(type) {
  return type.split('/')[2];
}

function loadModel(name, model) {
  var initialState = model.state;
  return function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    var actionFn = getActionByTypeName(action.type);
    if (model.reducers[actionFn]) {
      if (CONFIG.immer) {
        return (0, _immer2.default)(state, function (nextState) {
          return model.reducers[actionFn](nextState, action, state);
        });
      }
      return model.reducers[actionFn](state, action);
    }
    return state;
  };
}

function loadActions(name, model) {
  var keys = Object.keys(model);
  var actions = {};
  keys.forEach(function (item) {
    var len = item.length;
    if (item.substr(len - 6) === ActionSuffix) {
      actions[item] = function actionCreator() {
        var action = void 0;
        if (typeof model[item] === 'function') {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          action = model[item].apply(this, args);
          action = action ? action : {};
        } else action = {};
        action.type = getType(name, item);
        return action;
      };
    }
  });
  return actions;
}

var defaultMiddleware = [_promise2.default];

function moox(models) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    middleware: [],
    immer: true
  };

  var keys = Object.keys(models);
  (0, _utils.extend)(CONFIG, config);
  var reducers = {};
  var store = void 0;
  var middleware = defaultMiddleware.concat(config.middleware);
  var MOOX = {
    getStore: function getStore(enhancer) {
      if (store) return store;
      var finalCreateStore = void 0;
      finalCreateStore = _redux.applyMiddleware.apply(undefined, _toConsumableArray(middleware))(_redux.createStore);
      store = finalCreateStore((0, _redux.combineReducers)(reducers), enhancer);
      return store;
    },
    getReducers: function getReducers() {
      return reducers;
    }
  };

  keys.forEach(function (name) {
    reducers[name] = loadModel(name, models[name]);
    MOOX[name] = loadActions(name, models[name]);
  });
  return MOOX;
}

module.exports = moox;
"use strict";

var _redux = require("redux");

var _immer = require("immer");

var _immer2 = _interopRequireDefault(_immer);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var ActionSuffix = 'Action';
var CONFIG = {};

function getType(modelName, actionName) {
  return 'moox/' + modelName + '/' + actionName;
}

function getActionByTypeName(type) {
  return type.split('/')[2];
}

function isPromise(val) {
  return val && typeof val.then === 'function';
}

function loadModel(name, model) {
  var initialState = model.state;
  return function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    var params = action.params;
    var actionFn = getActionByTypeName(action.type);
    if (model[actionFn]) {
      if (CONFIG.immer) {
        return (0, _immer2.default)(state, function (draftState) {
          return model[actionFn](draftState, params, state);
        });
      }
      return model[actionFn](state, params);
    }
    return state;
  };
}

function loadActions(name, model) {
  var store = this;
  var keys = Object.keys(model);
  var actions = {};
  keys.forEach(function (item) {
    var len = item.length;
    if (item.substr(len - 6) === ActionSuffix) {
      actions[item] = function actionCreator(params) {
        return store.dispatch({
          type: getType(name, item),
          params: params
        });
      };
    }
  });
  return actions;
}

var defaultMiddleware = [];

function moox(models) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    middleware: [],
    immer: true
  };

  var MOOX = {};
  var reducers = {};
  var store = void 0;

  var keys = Object.keys(models);
  (0, _utils.extend)(CONFIG, config);

  keys.forEach(function (name) {
    reducers[name] = loadModel(name, models[name]);
  });

  MOOX.getReducers = function () {
    return reducers;
  };

  var middleware = defaultMiddleware.concat(config.middleware);
  store = _redux.applyMiddleware.apply(undefined, _toConsumableArray(middleware))(_redux.createStore)((0, _redux.combineReducers)(reducers), config.preloadedState, config.enhancer);

  MOOX.getStore = function () {
    return store;
  };

  keys.forEach(function (name) {
    MOOX[name] = loadActions.call(store, name, models[name]);
  });

  return MOOX;
}

module.exports = moox;
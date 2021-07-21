'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useModel = useModel;

var _redux = require('redux');

var _immer = require('immer');

var _immer2 = _interopRequireDefault(_immer);

var _reactRedux = require('react-redux');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var typePrefix = 'Moox';
var storeConfig = {};

function useModel(selectorReturningObject, shallowEqual) {
  return (0, _reactRedux.useSelector)(selectorReturningObject, shallowEqual);
}

exports.default = moox;


function getType(modelName, actionName) {
  return typePrefix + '/' + modelName + '/' + actionName;
}

function getActionByTypeName(type) {
  return type.split('/');
}

function loadModel(name, model) {
  var initialState = model.state;
  model.$name = name;
  return function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    var params = action.params;
    var types = getActionByTypeName(action.type);
    if (types[0] !== typePrefix) {
      return state;
    } else if (types[1] !== model.$name) {
      return state;
    }
    var actionFn = types[2];
    if (model[actionFn]) {
      if (storeConfig.immer && model.immer !== false) {
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
  keys.forEach(function (key) {
    if (typeof model[key] === 'function') {
      actions[key] = function actionCreator(params) {
        return store.dispatch({
          type: getType(name, key),
          params: params
        });
      };
    }
  });
  return actions;
}

var defaultMiddleware = [];

function moox(models) {
  var customConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var Moox = {};
  var reducers = {};
  var store = void 0;

  var keys = Object.keys(models);
  Object.assign(storeConfig, {
    middleware: [],
    immer: true
  }, customConfig);

  keys.forEach(function (name) {
    reducers[name] = loadModel(name, models[name]);
  });

  var middleware = defaultMiddleware.concat(storeConfig.middleware);
  store = _redux.applyMiddleware.apply(undefined, _toConsumableArray(middleware))(_redux.createStore)((0, _redux.combineReducers)(reducers), storeConfig.preloadedState, storeConfig.enhancer);

  Moox.getReducers = function () {
    return reducers;
  };
  Moox.getStore = function () {
    return store;
  };
  Moox.getState = function () {
    return store.getState();
  };
  Moox.useModel = useModel;
  Moox.getProvider = function (Application) {
    return function () {
      return _react2.default.createElement(_reactRedux.Provider, {
        store: store
      }, _react2.default.createElement(Application, null));
    };
  };

  keys.forEach(function (name) {
    if (name.indexOf('get') === 0) {
      throw new Error('modelName"' + name + '" is not a valid, the name prefix must not use "get" or "use"');
    }
    Moox[name] = loadActions.call(store, name, models[name]);
  });

  return Moox;
}
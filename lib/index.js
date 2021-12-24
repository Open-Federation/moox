"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useModel = exports["default"] = void 0;

var _redux = require("redux");

var _immer = _interopRequireDefault(require("immer"));

var _reactRedux = require("react-redux");

var React = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var typePrefix = 'Moox';
var useModel = _reactRedux.useSelector;
exports.useModel = useModel;
var _default = moox;
exports["default"] = _default;

function getType(modelName, actionName) {
  return typePrefix + '/' + modelName + '/' + actionName;
}

function getActionByTypeName(type) {
  return type.split('/');
}

var loadActions = function loadActions(store) {
  return function (name, model) {
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
  };
};

var defaultMiddleware = [];

function moox(models) {
  var customConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var reducers = {};
  var keys = Object.keys(models);

  var storeConfig = _objectSpread({
    middleware: [],
    immer: true
  }, customConfig);

  function loadModel(name, model) {
    var initialState = model.state;
    model.$name = name;
    return function reducer() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
      var action = arguments.length > 1 ? arguments[1] : undefined;
      var params = action.params;
      var types = getActionByTypeName(action.type);

      if (types[0] !== typePrefix) {
        return state;
      } else if (types[1] !== model.$name) {
        return state;
      }

      var actionFn = types[2];
      var fn = model[actionFn];

      if (fn) {
        var enableImmer = typeof model.immer === 'undefined' ? storeConfig.immer : model.immer;

        if (enableImmer) {
          return (0, _immer["default"])(state, function (draftState) {
            return fn(draftState, params, state);
          });
        }

        return fn(state, params);
      }

      return state;
    };
  }

  keys.forEach(function (name) {
    reducers[name] = loadModel(name, models[name]);
  });
  var middleware = defaultMiddleware.concat(storeConfig.middleware);
  var store = (0, _redux.createStore)((0, _redux.combineReducers)(reducers), storeConfig.preloadedState, (0, _redux.compose)(_redux.applyMiddleware.apply(void 0, _toConsumableArray(middleware)), storeConfig.enhancer));
  var Moox = {
    getReducers: function getReducers() {
      return reducers;
    },
    getStore: function getStore() {
      return store;
    },
    getState: function getState() {
      return store.getState();
    },
    useModel: useModel,
    getProvider: function getProvider(Application) {
      return function () {
        return React.createElement(_reactRedux.Provider, {
          store: store
        }, React.createElement(Application, null));
      };
    }
  };
  keys.forEach(function (name) {
    if (name.indexOf('get') === 0) {
      throw new Error("modelName\"".concat(name, "\" is not a valid, the name prefix must not use \"get\" or \"use\""));
    }

    Moox[name] = loadActions(store)(name, models[name]);
  });
  return Moox;
}
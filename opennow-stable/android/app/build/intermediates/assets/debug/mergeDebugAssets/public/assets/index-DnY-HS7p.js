function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var REACT_ELEMENT_TYPE$2 = Symbol.for("react.transitional.element"), REACT_FRAGMENT_TYPE$2 = Symbol.for("react.fragment");
function jsxProd(type, config, maybeKey) {
  var key = null;
  void 0 !== maybeKey && (key = "" + maybeKey);
  void 0 !== config.key && (key = "" + config.key);
  if ("key" in config) {
    maybeKey = {};
    for (var propName in config)
      "key" !== propName && (maybeKey[propName] = config[propName]);
  } else maybeKey = config;
  config = maybeKey.ref;
  return {
    $$typeof: REACT_ELEMENT_TYPE$2,
    type,
    key,
    ref: void 0 !== config ? config : null,
    props: maybeKey
  };
}
reactJsxRuntime_production.Fragment = REACT_FRAGMENT_TYPE$2;
reactJsxRuntime_production.jsx = jsxProd;
reactJsxRuntime_production.jsxs = jsxProd;
{
  jsxRuntime.exports = reactJsxRuntime_production;
}
var jsxRuntimeExports = jsxRuntime.exports;
var react = { exports: {} };
var react_production = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var REACT_ELEMENT_TYPE$1 = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE$2 = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE$1 = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE$1 = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE$1 = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE$1 = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE$1 = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE$1 = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE$1 = Symbol.for("react.suspense"), REACT_MEMO_TYPE$1 = Symbol.for("react.memo"), REACT_LAZY_TYPE$1 = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE$1 = Symbol.for("react.activity"), MAYBE_ITERATOR_SYMBOL$1 = Symbol.iterator;
function getIteratorFn$1(maybeIterable) {
  if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
  maybeIterable = MAYBE_ITERATOR_SYMBOL$1 && maybeIterable[MAYBE_ITERATOR_SYMBOL$1] || maybeIterable["@@iterator"];
  return "function" === typeof maybeIterable ? maybeIterable : null;
}
var ReactNoopUpdateQueue = {
  isMounted: function() {
    return false;
  },
  enqueueForceUpdate: function() {
  },
  enqueueReplaceState: function() {
  },
  enqueueSetState: function() {
  }
}, assign$1 = Object.assign, emptyObject = {};
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}
Component.prototype.isReactComponent = {};
Component.prototype.setState = function(partialState, callback) {
  if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
    throw Error(
      "takes an object of state variables to update or a function which returns an object of state variables."
    );
  this.updater.enqueueSetState(this, partialState, callback, "setState");
};
Component.prototype.forceUpdate = function(callback) {
  this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
};
function ComponentDummy() {
}
ComponentDummy.prototype = Component.prototype;
function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}
var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
pureComponentPrototype.constructor = PureComponent;
assign$1(pureComponentPrototype, Component.prototype);
pureComponentPrototype.isPureReactComponent = true;
var isArrayImpl$1 = Array.isArray;
function noop$3() {
}
var ReactSharedInternals$2 = { H: null, A: null, T: null, S: null }, hasOwnProperty$1 = Object.prototype.hasOwnProperty;
function ReactElement(type, key, props) {
  var refProp = props.ref;
  return {
    $$typeof: REACT_ELEMENT_TYPE$1,
    type,
    key,
    ref: void 0 !== refProp ? refProp : null,
    props
  };
}
function cloneAndReplaceKey(oldElement, newKey) {
  return ReactElement(oldElement.type, newKey, oldElement.props);
}
function isValidElement(object) {
  return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE$1;
}
function escape(key) {
  var escaperLookup = { "=": "=0", ":": "=2" };
  return "$" + key.replace(/[=:]/g, function(match) {
    return escaperLookup[match];
  });
}
var userProvidedKeyEscapeRegex = /\/+/g;
function getElementKey(element, index2) {
  return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index2.toString(36);
}
function resolveThenable(thenable) {
  switch (thenable.status) {
    case "fulfilled":
      return thenable.value;
    case "rejected":
      throw thenable.reason;
    default:
      switch ("string" === typeof thenable.status ? thenable.then(noop$3, noop$3) : (thenable.status = "pending", thenable.then(
        function(fulfilledValue) {
          "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
        },
        function(error) {
          "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
        }
      )), thenable.status) {
        case "fulfilled":
          return thenable.value;
        case "rejected":
          throw thenable.reason;
      }
  }
  throw thenable;
}
function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
  var type = typeof children;
  if ("undefined" === type || "boolean" === type) children = null;
  var invokeCallback = false;
  if (null === children) invokeCallback = true;
  else
    switch (type) {
      case "bigint":
      case "string":
      case "number":
        invokeCallback = true;
        break;
      case "object":
        switch (children.$$typeof) {
          case REACT_ELEMENT_TYPE$1:
          case REACT_PORTAL_TYPE$2:
            invokeCallback = true;
            break;
          case REACT_LAZY_TYPE$1:
            return invokeCallback = children._init, mapIntoArray(
              invokeCallback(children._payload),
              array,
              escapedPrefix,
              nameSoFar,
              callback
            );
        }
    }
  if (invokeCallback)
    return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl$1(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
      return c;
    })) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(
      callback,
      escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(
        userProvidedKeyEscapeRegex,
        "$&/"
      ) + "/") + invokeCallback
    )), array.push(callback)), 1;
  invokeCallback = 0;
  var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
  if (isArrayImpl$1(children))
    for (var i = 0; i < children.length; i++)
      nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
        nameSoFar,
        array,
        escapedPrefix,
        type,
        callback
      );
  else if (i = getIteratorFn$1(children), "function" === typeof i)
    for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
      nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
        nameSoFar,
        array,
        escapedPrefix,
        type,
        callback
      );
  else if ("object" === type) {
    if ("function" === typeof children.then)
      return mapIntoArray(
        resolveThenable(children),
        array,
        escapedPrefix,
        nameSoFar,
        callback
      );
    array = String(children);
    throw Error(
      "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
    );
  }
  return invokeCallback;
}
function mapChildren(children, func, context) {
  if (null == children) return children;
  var result = [], count = 0;
  mapIntoArray(children, result, "", "", function(child) {
    return func.call(context, child, count++);
  });
  return result;
}
function lazyInitializer(payload) {
  if (-1 === payload._status) {
    var ctor = payload._result;
    ctor = ctor();
    ctor.then(
      function(moduleObject) {
        if (0 === payload._status || -1 === payload._status)
          payload._status = 1, payload._result = moduleObject;
      },
      function(error) {
        if (0 === payload._status || -1 === payload._status)
          payload._status = 2, payload._result = error;
      }
    );
    -1 === payload._status && (payload._status = 0, payload._result = ctor);
  }
  if (1 === payload._status) return payload._result.default;
  throw payload._result;
}
var reportGlobalError$1 = "function" === typeof reportError ? reportError : function(error) {
  if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
    var event = new window.ErrorEvent("error", {
      bubbles: true,
      cancelable: true,
      message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
      error
    });
    if (!window.dispatchEvent(event)) return;
  } else if ("object" === typeof process && "function" === typeof process.emit) {
    process.emit("uncaughtException", error);
    return;
  }
  console.error(error);
}, Children = {
  map: mapChildren,
  forEach: function(children, forEachFunc, forEachContext) {
    mapChildren(
      children,
      function() {
        forEachFunc.apply(this, arguments);
      },
      forEachContext
    );
  },
  count: function(children) {
    var n = 0;
    mapChildren(children, function() {
      n++;
    });
    return n;
  },
  toArray: function(children) {
    return mapChildren(children, function(child) {
      return child;
    }) || [];
  },
  only: function(children) {
    if (!isValidElement(children))
      throw Error(
        "React.Children.only expected to receive a single React element child."
      );
    return children;
  }
};
react_production.Activity = REACT_ACTIVITY_TYPE$1;
react_production.Children = Children;
react_production.Component = Component;
react_production.Fragment = REACT_FRAGMENT_TYPE$1;
react_production.Profiler = REACT_PROFILER_TYPE$1;
react_production.PureComponent = PureComponent;
react_production.StrictMode = REACT_STRICT_MODE_TYPE$1;
react_production.Suspense = REACT_SUSPENSE_TYPE$1;
react_production.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals$2;
react_production.__COMPILER_RUNTIME = {
  __proto__: null,
  c: function(size) {
    return ReactSharedInternals$2.H.useMemoCache(size);
  }
};
react_production.cache = function(fn) {
  return function() {
    return fn.apply(null, arguments);
  };
};
react_production.cacheSignal = function() {
  return null;
};
react_production.cloneElement = function(element, config, children) {
  if (null === element || void 0 === element)
    throw Error(
      "The argument must be a React element, but you passed " + element + "."
    );
  var props = assign$1({}, element.props), key = element.key;
  if (null != config)
    for (propName in void 0 !== config.key && (key = "" + config.key), config)
      !hasOwnProperty$1.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
  var propName = arguments.length - 2;
  if (1 === propName) props.children = children;
  else if (1 < propName) {
    for (var childArray = Array(propName), i = 0; i < propName; i++)
      childArray[i] = arguments[i + 2];
    props.children = childArray;
  }
  return ReactElement(element.type, key, props);
};
react_production.createContext = function(defaultValue) {
  defaultValue = {
    $$typeof: REACT_CONTEXT_TYPE$1,
    _currentValue: defaultValue,
    _currentValue2: defaultValue,
    _threadCount: 0,
    Provider: null,
    Consumer: null
  };
  defaultValue.Provider = defaultValue;
  defaultValue.Consumer = {
    $$typeof: REACT_CONSUMER_TYPE$1,
    _context: defaultValue
  };
  return defaultValue;
};
react_production.createElement = function(type, config, children) {
  var propName, props = {}, key = null;
  if (null != config)
    for (propName in void 0 !== config.key && (key = "" + config.key), config)
      hasOwnProperty$1.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
  var childrenLength = arguments.length - 2;
  if (1 === childrenLength) props.children = children;
  else if (1 < childrenLength) {
    for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)
      childArray[i] = arguments[i + 2];
    props.children = childArray;
  }
  if (type && type.defaultProps)
    for (propName in childrenLength = type.defaultProps, childrenLength)
      void 0 === props[propName] && (props[propName] = childrenLength[propName]);
  return ReactElement(type, key, props);
};
react_production.createRef = function() {
  return { current: null };
};
react_production.forwardRef = function(render) {
  return { $$typeof: REACT_FORWARD_REF_TYPE$1, render };
};
react_production.isValidElement = isValidElement;
react_production.lazy = function(ctor) {
  return {
    $$typeof: REACT_LAZY_TYPE$1,
    _payload: { _status: -1, _result: ctor },
    _init: lazyInitializer
  };
};
react_production.memo = function(type, compare) {
  return {
    $$typeof: REACT_MEMO_TYPE$1,
    type,
    compare: void 0 === compare ? null : compare
  };
};
react_production.startTransition = function(scope) {
  var prevTransition = ReactSharedInternals$2.T, currentTransition = {};
  ReactSharedInternals$2.T = currentTransition;
  try {
    var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals$2.S;
    null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
    "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop$3, reportGlobalError$1);
  } catch (error) {
    reportGlobalError$1(error);
  } finally {
    null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals$2.T = prevTransition;
  }
};
react_production.unstable_useCacheRefresh = function() {
  return ReactSharedInternals$2.H.useCacheRefresh();
};
react_production.use = function(usable) {
  return ReactSharedInternals$2.H.use(usable);
};
react_production.useActionState = function(action, initialState, permalink) {
  return ReactSharedInternals$2.H.useActionState(action, initialState, permalink);
};
react_production.useCallback = function(callback, deps) {
  return ReactSharedInternals$2.H.useCallback(callback, deps);
};
react_production.useContext = function(Context) {
  return ReactSharedInternals$2.H.useContext(Context);
};
react_production.useDebugValue = function() {
};
react_production.useDeferredValue = function(value, initialValue) {
  return ReactSharedInternals$2.H.useDeferredValue(value, initialValue);
};
react_production.useEffect = function(create, deps) {
  return ReactSharedInternals$2.H.useEffect(create, deps);
};
react_production.useEffectEvent = function(callback) {
  return ReactSharedInternals$2.H.useEffectEvent(callback);
};
react_production.useId = function() {
  return ReactSharedInternals$2.H.useId();
};
react_production.useImperativeHandle = function(ref, create, deps) {
  return ReactSharedInternals$2.H.useImperativeHandle(ref, create, deps);
};
react_production.useInsertionEffect = function(create, deps) {
  return ReactSharedInternals$2.H.useInsertionEffect(create, deps);
};
react_production.useLayoutEffect = function(create, deps) {
  return ReactSharedInternals$2.H.useLayoutEffect(create, deps);
};
react_production.useMemo = function(create, deps) {
  return ReactSharedInternals$2.H.useMemo(create, deps);
};
react_production.useOptimistic = function(passthrough, reducer) {
  return ReactSharedInternals$2.H.useOptimistic(passthrough, reducer);
};
react_production.useReducer = function(reducer, initialArg, init) {
  return ReactSharedInternals$2.H.useReducer(reducer, initialArg, init);
};
react_production.useRef = function(initialValue) {
  return ReactSharedInternals$2.H.useRef(initialValue);
};
react_production.useState = function(initialState) {
  return ReactSharedInternals$2.H.useState(initialState);
};
react_production.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
  return ReactSharedInternals$2.H.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
};
react_production.useTransition = function() {
  return ReactSharedInternals$2.H.useTransition();
};
react_production.version = "19.2.4";
{
  react.exports = react_production;
}
var reactExports = react.exports;
const React$2 = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
var client = { exports: {} };
var reactDomClient_production = {};
var scheduler = { exports: {} };
var scheduler_production = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(exports$1) {
  function push2(heap, node) {
    var index2 = heap.length;
    heap.push(node);
    a: for (; 0 < index2; ) {
      var parentIndex = index2 - 1 >>> 1, parent = heap[parentIndex];
      if (0 < compare(parent, node))
        heap[parentIndex] = node, heap[index2] = parent, index2 = parentIndex;
      else break a;
    }
  }
  function peek(heap) {
    return 0 === heap.length ? null : heap[0];
  }
  function pop2(heap) {
    if (0 === heap.length) return null;
    var first = heap[0], last = heap.pop();
    if (last !== first) {
      heap[0] = last;
      a: for (var index2 = 0, length = heap.length, halfLength = length >>> 1; index2 < halfLength; ) {
        var leftIndex = 2 * (index2 + 1) - 1, left = heap[leftIndex], rightIndex = leftIndex + 1, right = heap[rightIndex];
        if (0 > compare(left, last))
          rightIndex < length && 0 > compare(right, left) ? (heap[index2] = right, heap[rightIndex] = last, index2 = rightIndex) : (heap[index2] = left, heap[leftIndex] = last, index2 = leftIndex);
        else if (rightIndex < length && 0 > compare(right, last))
          heap[index2] = right, heap[rightIndex] = last, index2 = rightIndex;
        else break a;
      }
    }
    return first;
  }
  function compare(a, b) {
    var diff = a.sortIndex - b.sortIndex;
    return 0 !== diff ? diff : a.id - b.id;
  }
  exports$1.unstable_now = void 0;
  if ("object" === typeof performance && "function" === typeof performance.now) {
    var localPerformance = performance;
    exports$1.unstable_now = function() {
      return localPerformance.now();
    };
  } else {
    var localDate = Date, initialTime = localDate.now();
    exports$1.unstable_now = function() {
      return localDate.now() - initialTime;
    };
  }
  var taskQueue = [], timerQueue = [], taskIdCounter = 1, currentTask = null, currentPriorityLevel = 3, isPerformingWork = false, isHostCallbackScheduled = false, isHostTimeoutScheduled = false, needsPaint = false, localSetTimeout = "function" === typeof setTimeout ? setTimeout : null, localClearTimeout = "function" === typeof clearTimeout ? clearTimeout : null, localSetImmediate = "undefined" !== typeof setImmediate ? setImmediate : null;
  function advanceTimers(currentTime) {
    for (var timer = peek(timerQueue); null !== timer; ) {
      if (null === timer.callback) pop2(timerQueue);
      else if (timer.startTime <= currentTime)
        pop2(timerQueue), timer.sortIndex = timer.expirationTime, push2(taskQueue, timer);
      else break;
      timer = peek(timerQueue);
    }
  }
  function handleTimeout(currentTime) {
    isHostTimeoutScheduled = false;
    advanceTimers(currentTime);
    if (!isHostCallbackScheduled)
      if (null !== peek(taskQueue))
        isHostCallbackScheduled = true, isMessageLoopRunning || (isMessageLoopRunning = true, schedulePerformWorkUntilDeadline());
      else {
        var firstTimer = peek(timerQueue);
        null !== firstTimer && requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
      }
  }
  var isMessageLoopRunning = false, taskTimeoutID = -1, frameInterval = 5, startTime = -1;
  function shouldYieldToHost() {
    return needsPaint ? true : exports$1.unstable_now() - startTime < frameInterval ? false : true;
  }
  function performWorkUntilDeadline() {
    needsPaint = false;
    if (isMessageLoopRunning) {
      var currentTime = exports$1.unstable_now();
      startTime = currentTime;
      var hasMoreWork = true;
      try {
        a: {
          isHostCallbackScheduled = false;
          isHostTimeoutScheduled && (isHostTimeoutScheduled = false, localClearTimeout(taskTimeoutID), taskTimeoutID = -1);
          isPerformingWork = true;
          var previousPriorityLevel = currentPriorityLevel;
          try {
            b: {
              advanceTimers(currentTime);
              for (currentTask = peek(taskQueue); null !== currentTask && !(currentTask.expirationTime > currentTime && shouldYieldToHost()); ) {
                var callback = currentTask.callback;
                if ("function" === typeof callback) {
                  currentTask.callback = null;
                  currentPriorityLevel = currentTask.priorityLevel;
                  var continuationCallback = callback(
                    currentTask.expirationTime <= currentTime
                  );
                  currentTime = exports$1.unstable_now();
                  if ("function" === typeof continuationCallback) {
                    currentTask.callback = continuationCallback;
                    advanceTimers(currentTime);
                    hasMoreWork = true;
                    break b;
                  }
                  currentTask === peek(taskQueue) && pop2(taskQueue);
                  advanceTimers(currentTime);
                } else pop2(taskQueue);
                currentTask = peek(taskQueue);
              }
              if (null !== currentTask) hasMoreWork = true;
              else {
                var firstTimer = peek(timerQueue);
                null !== firstTimer && requestHostTimeout(
                  handleTimeout,
                  firstTimer.startTime - currentTime
                );
                hasMoreWork = false;
              }
            }
            break a;
          } finally {
            currentTask = null, currentPriorityLevel = previousPriorityLevel, isPerformingWork = false;
          }
          hasMoreWork = void 0;
        }
      } finally {
        hasMoreWork ? schedulePerformWorkUntilDeadline() : isMessageLoopRunning = false;
      }
    }
  }
  var schedulePerformWorkUntilDeadline;
  if ("function" === typeof localSetImmediate)
    schedulePerformWorkUntilDeadline = function() {
      localSetImmediate(performWorkUntilDeadline);
    };
  else if ("undefined" !== typeof MessageChannel) {
    var channel = new MessageChannel(), port = channel.port2;
    channel.port1.onmessage = performWorkUntilDeadline;
    schedulePerformWorkUntilDeadline = function() {
      port.postMessage(null);
    };
  } else
    schedulePerformWorkUntilDeadline = function() {
      localSetTimeout(performWorkUntilDeadline, 0);
    };
  function requestHostTimeout(callback, ms) {
    taskTimeoutID = localSetTimeout(function() {
      callback(exports$1.unstable_now());
    }, ms);
  }
  exports$1.unstable_IdlePriority = 5;
  exports$1.unstable_ImmediatePriority = 1;
  exports$1.unstable_LowPriority = 4;
  exports$1.unstable_NormalPriority = 3;
  exports$1.unstable_Profiling = null;
  exports$1.unstable_UserBlockingPriority = 2;
  exports$1.unstable_cancelCallback = function(task) {
    task.callback = null;
  };
  exports$1.unstable_forceFrameRate = function(fps) {
    0 > fps || 125 < fps ? console.error(
      "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
    ) : frameInterval = 0 < fps ? Math.floor(1e3 / fps) : 5;
  };
  exports$1.unstable_getCurrentPriorityLevel = function() {
    return currentPriorityLevel;
  };
  exports$1.unstable_next = function(eventHandler) {
    switch (currentPriorityLevel) {
      case 1:
      case 2:
      case 3:
        var priorityLevel = 3;
        break;
      default:
        priorityLevel = currentPriorityLevel;
    }
    var previousPriorityLevel = currentPriorityLevel;
    currentPriorityLevel = priorityLevel;
    try {
      return eventHandler();
    } finally {
      currentPriorityLevel = previousPriorityLevel;
    }
  };
  exports$1.unstable_requestPaint = function() {
    needsPaint = true;
  };
  exports$1.unstable_runWithPriority = function(priorityLevel, eventHandler) {
    switch (priorityLevel) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        priorityLevel = 3;
    }
    var previousPriorityLevel = currentPriorityLevel;
    currentPriorityLevel = priorityLevel;
    try {
      return eventHandler();
    } finally {
      currentPriorityLevel = previousPriorityLevel;
    }
  };
  exports$1.unstable_scheduleCallback = function(priorityLevel, callback, options) {
    var currentTime = exports$1.unstable_now();
    "object" === typeof options && null !== options ? (options = options.delay, options = "number" === typeof options && 0 < options ? currentTime + options : currentTime) : options = currentTime;
    switch (priorityLevel) {
      case 1:
        var timeout = -1;
        break;
      case 2:
        timeout = 250;
        break;
      case 5:
        timeout = 1073741823;
        break;
      case 4:
        timeout = 1e4;
        break;
      default:
        timeout = 5e3;
    }
    timeout = options + timeout;
    priorityLevel = {
      id: taskIdCounter++,
      callback,
      priorityLevel,
      startTime: options,
      expirationTime: timeout,
      sortIndex: -1
    };
    options > currentTime ? (priorityLevel.sortIndex = options, push2(timerQueue, priorityLevel), null === peek(taskQueue) && priorityLevel === peek(timerQueue) && (isHostTimeoutScheduled ? (localClearTimeout(taskTimeoutID), taskTimeoutID = -1) : isHostTimeoutScheduled = true, requestHostTimeout(handleTimeout, options - currentTime))) : (priorityLevel.sortIndex = timeout, push2(taskQueue, priorityLevel), isHostCallbackScheduled || isPerformingWork || (isHostCallbackScheduled = true, isMessageLoopRunning || (isMessageLoopRunning = true, schedulePerformWorkUntilDeadline())));
    return priorityLevel;
  };
  exports$1.unstable_shouldYield = shouldYieldToHost;
  exports$1.unstable_wrapCallback = function(callback) {
    var parentPriorityLevel = currentPriorityLevel;
    return function() {
      var previousPriorityLevel = currentPriorityLevel;
      currentPriorityLevel = parentPriorityLevel;
      try {
        return callback.apply(this, arguments);
      } finally {
        currentPriorityLevel = previousPriorityLevel;
      }
    };
  };
})(scheduler_production);
{
  scheduler.exports = scheduler_production;
}
var schedulerExports = scheduler.exports;
var reactDom = { exports: {} };
var reactDom_production = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var React$1 = reactExports;
function formatProdErrorMessage$1(code) {
  var url = "https://react.dev/errors/" + code;
  if (1 < arguments.length) {
    url += "?args[]=" + encodeURIComponent(arguments[1]);
    for (var i = 2; i < arguments.length; i++)
      url += "&args[]=" + encodeURIComponent(arguments[i]);
  }
  return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
function noop$2() {
}
var Internals = {
  d: {
    f: noop$2,
    r: function() {
      throw Error(formatProdErrorMessage$1(522));
    },
    D: noop$2,
    C: noop$2,
    L: noop$2,
    m: noop$2,
    X: noop$2,
    S: noop$2,
    M: noop$2
  },
  p: 0,
  findDOMNode: null
}, REACT_PORTAL_TYPE$1 = Symbol.for("react.portal");
function createPortal$1(children, containerInfo, implementation) {
  var key = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
  return {
    $$typeof: REACT_PORTAL_TYPE$1,
    key: null == key ? null : "" + key,
    children,
    containerInfo,
    implementation
  };
}
var ReactSharedInternals$1 = React$1.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
function getCrossOriginStringAs(as, input) {
  if ("font" === as) return "";
  if ("string" === typeof input)
    return "use-credentials" === input ? input : "";
}
reactDom_production.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Internals;
reactDom_production.createPortal = function(children, container) {
  var key = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
  if (!container || 1 !== container.nodeType && 9 !== container.nodeType && 11 !== container.nodeType)
    throw Error(formatProdErrorMessage$1(299));
  return createPortal$1(children, container, null, key);
};
reactDom_production.flushSync = function(fn) {
  var previousTransition = ReactSharedInternals$1.T, previousUpdatePriority = Internals.p;
  try {
    if (ReactSharedInternals$1.T = null, Internals.p = 2, fn) return fn();
  } finally {
    ReactSharedInternals$1.T = previousTransition, Internals.p = previousUpdatePriority, Internals.d.f();
  }
};
reactDom_production.preconnect = function(href, options) {
  "string" === typeof href && (options ? (options = options.crossOrigin, options = "string" === typeof options ? "use-credentials" === options ? options : "" : void 0) : options = null, Internals.d.C(href, options));
};
reactDom_production.prefetchDNS = function(href) {
  "string" === typeof href && Internals.d.D(href);
};
reactDom_production.preinit = function(href, options) {
  if ("string" === typeof href && options && "string" === typeof options.as) {
    var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin), integrity = "string" === typeof options.integrity ? options.integrity : void 0, fetchPriority = "string" === typeof options.fetchPriority ? options.fetchPriority : void 0;
    "style" === as ? Internals.d.S(
      href,
      "string" === typeof options.precedence ? options.precedence : void 0,
      {
        crossOrigin,
        integrity,
        fetchPriority
      }
    ) : "script" === as && Internals.d.X(href, {
      crossOrigin,
      integrity,
      fetchPriority,
      nonce: "string" === typeof options.nonce ? options.nonce : void 0
    });
  }
};
reactDom_production.preinitModule = function(href, options) {
  if ("string" === typeof href)
    if ("object" === typeof options && null !== options) {
      if (null == options.as || "script" === options.as) {
        var crossOrigin = getCrossOriginStringAs(
          options.as,
          options.crossOrigin
        );
        Internals.d.M(href, {
          crossOrigin,
          integrity: "string" === typeof options.integrity ? options.integrity : void 0,
          nonce: "string" === typeof options.nonce ? options.nonce : void 0
        });
      }
    } else null == options && Internals.d.M(href);
};
reactDom_production.preload = function(href, options) {
  if ("string" === typeof href && "object" === typeof options && null !== options && "string" === typeof options.as) {
    var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin);
    Internals.d.L(href, as, {
      crossOrigin,
      integrity: "string" === typeof options.integrity ? options.integrity : void 0,
      nonce: "string" === typeof options.nonce ? options.nonce : void 0,
      type: "string" === typeof options.type ? options.type : void 0,
      fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0,
      referrerPolicy: "string" === typeof options.referrerPolicy ? options.referrerPolicy : void 0,
      imageSrcSet: "string" === typeof options.imageSrcSet ? options.imageSrcSet : void 0,
      imageSizes: "string" === typeof options.imageSizes ? options.imageSizes : void 0,
      media: "string" === typeof options.media ? options.media : void 0
    });
  }
};
reactDom_production.preloadModule = function(href, options) {
  if ("string" === typeof href)
    if (options) {
      var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
      Internals.d.m(href, {
        as: "string" === typeof options.as && "script" !== options.as ? options.as : void 0,
        crossOrigin,
        integrity: "string" === typeof options.integrity ? options.integrity : void 0
      });
    } else Internals.d.m(href);
};
reactDom_production.requestFormReset = function(form) {
  Internals.d.r(form);
};
reactDom_production.unstable_batchedUpdates = function(fn, a) {
  return fn(a);
};
reactDom_production.useFormState = function(action, initialState, permalink) {
  return ReactSharedInternals$1.H.useFormState(action, initialState, permalink);
};
reactDom_production.useFormStatus = function() {
  return ReactSharedInternals$1.H.useHostTransitionStatus();
};
reactDom_production.version = "19.2.4";
function checkDCE$1() {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
    return;
  }
  try {
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE$1);
  } catch (err) {
    console.error(err);
  }
}
{
  checkDCE$1();
  reactDom.exports = reactDom_production;
}
var reactDomExports = reactDom.exports;
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Scheduler = schedulerExports, React = reactExports, ReactDOM$1 = reactDomExports;
function formatProdErrorMessage(code) {
  var url = "https://react.dev/errors/" + code;
  if (1 < arguments.length) {
    url += "?args[]=" + encodeURIComponent(arguments[1]);
    for (var i = 2; i < arguments.length; i++)
      url += "&args[]=" + encodeURIComponent(arguments[i]);
  }
  return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
function isValidContainer(node) {
  return !(!node || 1 !== node.nodeType && 9 !== node.nodeType && 11 !== node.nodeType);
}
function getNearestMountedFiber(fiber) {
  var node = fiber, nearestMounted = fiber;
  if (fiber.alternate) for (; node.return; ) node = node.return;
  else {
    fiber = node;
    do
      node = fiber, 0 !== (node.flags & 4098) && (nearestMounted = node.return), fiber = node.return;
    while (fiber);
  }
  return 3 === node.tag ? nearestMounted : null;
}
function getSuspenseInstanceFromFiber(fiber) {
  if (13 === fiber.tag) {
    var suspenseState = fiber.memoizedState;
    null === suspenseState && (fiber = fiber.alternate, null !== fiber && (suspenseState = fiber.memoizedState));
    if (null !== suspenseState) return suspenseState.dehydrated;
  }
  return null;
}
function getActivityInstanceFromFiber(fiber) {
  if (31 === fiber.tag) {
    var activityState = fiber.memoizedState;
    null === activityState && (fiber = fiber.alternate, null !== fiber && (activityState = fiber.memoizedState));
    if (null !== activityState) return activityState.dehydrated;
  }
  return null;
}
function assertIsMounted(fiber) {
  if (getNearestMountedFiber(fiber) !== fiber)
    throw Error(formatProdErrorMessage(188));
}
function findCurrentFiberUsingSlowPath(fiber) {
  var alternate = fiber.alternate;
  if (!alternate) {
    alternate = getNearestMountedFiber(fiber);
    if (null === alternate) throw Error(formatProdErrorMessage(188));
    return alternate !== fiber ? null : fiber;
  }
  for (var a = fiber, b = alternate; ; ) {
    var parentA = a.return;
    if (null === parentA) break;
    var parentB = parentA.alternate;
    if (null === parentB) {
      b = parentA.return;
      if (null !== b) {
        a = b;
        continue;
      }
      break;
    }
    if (parentA.child === parentB.child) {
      for (parentB = parentA.child; parentB; ) {
        if (parentB === a) return assertIsMounted(parentA), fiber;
        if (parentB === b) return assertIsMounted(parentA), alternate;
        parentB = parentB.sibling;
      }
      throw Error(formatProdErrorMessage(188));
    }
    if (a.return !== b.return) a = parentA, b = parentB;
    else {
      for (var didFindChild = false, child$0 = parentA.child; child$0; ) {
        if (child$0 === a) {
          didFindChild = true;
          a = parentA;
          b = parentB;
          break;
        }
        if (child$0 === b) {
          didFindChild = true;
          b = parentA;
          a = parentB;
          break;
        }
        child$0 = child$0.sibling;
      }
      if (!didFindChild) {
        for (child$0 = parentB.child; child$0; ) {
          if (child$0 === a) {
            didFindChild = true;
            a = parentB;
            b = parentA;
            break;
          }
          if (child$0 === b) {
            didFindChild = true;
            b = parentB;
            a = parentA;
            break;
          }
          child$0 = child$0.sibling;
        }
        if (!didFindChild) throw Error(formatProdErrorMessage(189));
      }
    }
    if (a.alternate !== b) throw Error(formatProdErrorMessage(190));
  }
  if (3 !== a.tag) throw Error(formatProdErrorMessage(188));
  return a.stateNode.current === a ? fiber : alternate;
}
function findCurrentHostFiberImpl(node) {
  var tag = node.tag;
  if (5 === tag || 26 === tag || 27 === tag || 6 === tag) return node;
  for (node = node.child; null !== node; ) {
    tag = findCurrentHostFiberImpl(node);
    if (null !== tag) return tag;
    node = node.sibling;
  }
  return null;
}
var assign = Object.assign, REACT_LEGACY_ELEMENT_TYPE = Symbol.for("react.element"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy");
var REACT_ACTIVITY_TYPE = Symbol.for("react.activity");
var REACT_MEMO_CACHE_SENTINEL = Symbol.for("react.memo_cache_sentinel");
var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
function getIteratorFn(maybeIterable) {
  if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
  maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
  return "function" === typeof maybeIterable ? maybeIterable : null;
}
var REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference");
function getComponentNameFromType(type) {
  if (null == type) return null;
  if ("function" === typeof type)
    return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
  if ("string" === typeof type) return type;
  switch (type) {
    case REACT_FRAGMENT_TYPE:
      return "Fragment";
    case REACT_PROFILER_TYPE:
      return "Profiler";
    case REACT_STRICT_MODE_TYPE:
      return "StrictMode";
    case REACT_SUSPENSE_TYPE:
      return "Suspense";
    case REACT_SUSPENSE_LIST_TYPE:
      return "SuspenseList";
    case REACT_ACTIVITY_TYPE:
      return "Activity";
  }
  if ("object" === typeof type)
    switch (type.$$typeof) {
      case REACT_PORTAL_TYPE:
        return "Portal";
      case REACT_CONTEXT_TYPE:
        return type.displayName || "Context";
      case REACT_CONSUMER_TYPE:
        return (type._context.displayName || "Context") + ".Consumer";
      case REACT_FORWARD_REF_TYPE:
        var innerType = type.render;
        type = type.displayName;
        type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
        return type;
      case REACT_MEMO_TYPE:
        return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
      case REACT_LAZY_TYPE:
        innerType = type._payload;
        type = type._init;
        try {
          return getComponentNameFromType(type(innerType));
        } catch (x) {
        }
    }
  return null;
}
var isArrayImpl = Array.isArray, ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, ReactDOMSharedInternals = ReactDOM$1.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, sharedNotPendingObject = {
  pending: false,
  data: null,
  method: null,
  action: null
}, valueStack = [], index = -1;
function createCursor(defaultValue) {
  return { current: defaultValue };
}
function pop(cursor) {
  0 > index || (cursor.current = valueStack[index], valueStack[index] = null, index--);
}
function push(cursor, value) {
  index++;
  valueStack[index] = cursor.current;
  cursor.current = value;
}
var contextStackCursor = createCursor(null), contextFiberStackCursor = createCursor(null), rootInstanceStackCursor = createCursor(null), hostTransitionProviderCursor = createCursor(null);
function pushHostContainer(fiber, nextRootInstance) {
  push(rootInstanceStackCursor, nextRootInstance);
  push(contextFiberStackCursor, fiber);
  push(contextStackCursor, null);
  switch (nextRootInstance.nodeType) {
    case 9:
    case 11:
      fiber = (fiber = nextRootInstance.documentElement) ? (fiber = fiber.namespaceURI) ? getOwnHostContext(fiber) : 0 : 0;
      break;
    default:
      if (fiber = nextRootInstance.tagName, nextRootInstance = nextRootInstance.namespaceURI)
        nextRootInstance = getOwnHostContext(nextRootInstance), fiber = getChildHostContextProd(nextRootInstance, fiber);
      else
        switch (fiber) {
          case "svg":
            fiber = 1;
            break;
          case "math":
            fiber = 2;
            break;
          default:
            fiber = 0;
        }
  }
  pop(contextStackCursor);
  push(contextStackCursor, fiber);
}
function popHostContainer() {
  pop(contextStackCursor);
  pop(contextFiberStackCursor);
  pop(rootInstanceStackCursor);
}
function pushHostContext(fiber) {
  null !== fiber.memoizedState && push(hostTransitionProviderCursor, fiber);
  var context = contextStackCursor.current;
  var JSCompiler_inline_result = getChildHostContextProd(context, fiber.type);
  context !== JSCompiler_inline_result && (push(contextFiberStackCursor, fiber), push(contextStackCursor, JSCompiler_inline_result));
}
function popHostContext(fiber) {
  contextFiberStackCursor.current === fiber && (pop(contextStackCursor), pop(contextFiberStackCursor));
  hostTransitionProviderCursor.current === fiber && (pop(hostTransitionProviderCursor), HostTransitionContext._currentValue = sharedNotPendingObject);
}
var prefix, suffix;
function describeBuiltInComponentFrame(name) {
  if (void 0 === prefix)
    try {
      throw Error();
    } catch (x) {
      var match = x.stack.trim().match(/\n( *(at )?)/);
      prefix = match && match[1] || "";
      suffix = -1 < x.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < x.stack.indexOf("@") ? "@unknown:0:0" : "";
    }
  return "\n" + prefix + name + suffix;
}
var reentry = false;
function describeNativeComponentFrame(fn, construct) {
  if (!fn || reentry) return "";
  reentry = true;
  var previousPrepareStackTrace = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    var RunInRootFrame = {
      DetermineComponentFrameRoot: function() {
        try {
          if (construct) {
            var Fake = function() {
              throw Error();
            };
            Object.defineProperty(Fake.prototype, "props", {
              set: function() {
                throw Error();
              }
            });
            if ("object" === typeof Reflect && Reflect.construct) {
              try {
                Reflect.construct(Fake, []);
              } catch (x) {
                var control = x;
              }
              Reflect.construct(fn, [], Fake);
            } else {
              try {
                Fake.call();
              } catch (x$1) {
                control = x$1;
              }
              fn.call(Fake.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (x$2) {
              control = x$2;
            }
            (Fake = fn()) && "function" === typeof Fake.catch && Fake.catch(function() {
            });
          }
        } catch (sample) {
          if (sample && control && "string" === typeof sample.stack)
            return [sample.stack, control.stack];
        }
        return [null, null];
      }
    };
    RunInRootFrame.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
    var namePropDescriptor = Object.getOwnPropertyDescriptor(
      RunInRootFrame.DetermineComponentFrameRoot,
      "name"
    );
    namePropDescriptor && namePropDescriptor.configurable && Object.defineProperty(
      RunInRootFrame.DetermineComponentFrameRoot,
      "name",
      { value: "DetermineComponentFrameRoot" }
    );
    var _RunInRootFrame$Deter = RunInRootFrame.DetermineComponentFrameRoot(), sampleStack = _RunInRootFrame$Deter[0], controlStack = _RunInRootFrame$Deter[1];
    if (sampleStack && controlStack) {
      var sampleLines = sampleStack.split("\n"), controlLines = controlStack.split("\n");
      for (namePropDescriptor = RunInRootFrame = 0; RunInRootFrame < sampleLines.length && !sampleLines[RunInRootFrame].includes("DetermineComponentFrameRoot"); )
        RunInRootFrame++;
      for (; namePropDescriptor < controlLines.length && !controlLines[namePropDescriptor].includes(
        "DetermineComponentFrameRoot"
      ); )
        namePropDescriptor++;
      if (RunInRootFrame === sampleLines.length || namePropDescriptor === controlLines.length)
        for (RunInRootFrame = sampleLines.length - 1, namePropDescriptor = controlLines.length - 1; 1 <= RunInRootFrame && 0 <= namePropDescriptor && sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]; )
          namePropDescriptor--;
      for (; 1 <= RunInRootFrame && 0 <= namePropDescriptor; RunInRootFrame--, namePropDescriptor--)
        if (sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
          if (1 !== RunInRootFrame || 1 !== namePropDescriptor) {
            do
              if (RunInRootFrame--, namePropDescriptor--, 0 > namePropDescriptor || sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
                var frame = "\n" + sampleLines[RunInRootFrame].replace(" at new ", " at ");
                fn.displayName && frame.includes("<anonymous>") && (frame = frame.replace("<anonymous>", fn.displayName));
                return frame;
              }
            while (1 <= RunInRootFrame && 0 <= namePropDescriptor);
          }
          break;
        }
    }
  } finally {
    reentry = false, Error.prepareStackTrace = previousPrepareStackTrace;
  }
  return (previousPrepareStackTrace = fn ? fn.displayName || fn.name : "") ? describeBuiltInComponentFrame(previousPrepareStackTrace) : "";
}
function describeFiber(fiber, childFiber) {
  switch (fiber.tag) {
    case 26:
    case 27:
    case 5:
      return describeBuiltInComponentFrame(fiber.type);
    case 16:
      return describeBuiltInComponentFrame("Lazy");
    case 13:
      return fiber.child !== childFiber && null !== childFiber ? describeBuiltInComponentFrame("Suspense Fallback") : describeBuiltInComponentFrame("Suspense");
    case 19:
      return describeBuiltInComponentFrame("SuspenseList");
    case 0:
    case 15:
      return describeNativeComponentFrame(fiber.type, false);
    case 11:
      return describeNativeComponentFrame(fiber.type.render, false);
    case 1:
      return describeNativeComponentFrame(fiber.type, true);
    case 31:
      return describeBuiltInComponentFrame("Activity");
    default:
      return "";
  }
}
function getStackByFiberInDevAndProd(workInProgress2) {
  try {
    var info = "", previous = null;
    do
      info += describeFiber(workInProgress2, previous), previous = workInProgress2, workInProgress2 = workInProgress2.return;
    while (workInProgress2);
    return info;
  } catch (x) {
    return "\nError generating stack: " + x.message + "\n" + x.stack;
  }
}
var hasOwnProperty = Object.prototype.hasOwnProperty, scheduleCallback$3 = Scheduler.unstable_scheduleCallback, cancelCallback$1 = Scheduler.unstable_cancelCallback, shouldYield = Scheduler.unstable_shouldYield, requestPaint = Scheduler.unstable_requestPaint, now = Scheduler.unstable_now, getCurrentPriorityLevel = Scheduler.unstable_getCurrentPriorityLevel, ImmediatePriority = Scheduler.unstable_ImmediatePriority, UserBlockingPriority = Scheduler.unstable_UserBlockingPriority, NormalPriority$1 = Scheduler.unstable_NormalPriority, LowPriority = Scheduler.unstable_LowPriority, IdlePriority = Scheduler.unstable_IdlePriority, log$1 = Scheduler.log, unstable_setDisableYieldValue = Scheduler.unstable_setDisableYieldValue, rendererID = null, injectedHook = null;
function setIsStrictModeForDevtools(newIsStrictMode) {
  "function" === typeof log$1 && unstable_setDisableYieldValue(newIsStrictMode);
  if (injectedHook && "function" === typeof injectedHook.setStrictMode)
    try {
      injectedHook.setStrictMode(rendererID, newIsStrictMode);
    } catch (err) {
    }
}
var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback, log = Math.log, LN2 = Math.LN2;
function clz32Fallback(x) {
  x >>>= 0;
  return 0 === x ? 32 : 31 - (log(x) / LN2 | 0) | 0;
}
var nextTransitionUpdateLane = 256, nextTransitionDeferredLane = 262144, nextRetryLane = 4194304;
function getHighestPriorityLanes(lanes) {
  var pendingSyncLanes = lanes & 42;
  if (0 !== pendingSyncLanes) return pendingSyncLanes;
  switch (lanes & -lanes) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
      return 64;
    case 128:
      return 128;
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
      return lanes & 261888;
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return lanes & 3932160;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
      return lanes & 62914560;
    case 67108864:
      return 67108864;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 0;
    default:
      return lanes;
  }
}
function getNextLanes(root2, wipLanes, rootHasPendingCommit) {
  var pendingLanes = root2.pendingLanes;
  if (0 === pendingLanes) return 0;
  var nextLanes = 0, suspendedLanes = root2.suspendedLanes, pingedLanes = root2.pingedLanes;
  root2 = root2.warmLanes;
  var nonIdlePendingLanes = pendingLanes & 134217727;
  0 !== nonIdlePendingLanes ? (pendingLanes = nonIdlePendingLanes & ~suspendedLanes, 0 !== pendingLanes ? nextLanes = getHighestPriorityLanes(pendingLanes) : (pingedLanes &= nonIdlePendingLanes, 0 !== pingedLanes ? nextLanes = getHighestPriorityLanes(pingedLanes) : rootHasPendingCommit || (rootHasPendingCommit = nonIdlePendingLanes & ~root2, 0 !== rootHasPendingCommit && (nextLanes = getHighestPriorityLanes(rootHasPendingCommit))))) : (nonIdlePendingLanes = pendingLanes & ~suspendedLanes, 0 !== nonIdlePendingLanes ? nextLanes = getHighestPriorityLanes(nonIdlePendingLanes) : 0 !== pingedLanes ? nextLanes = getHighestPriorityLanes(pingedLanes) : rootHasPendingCommit || (rootHasPendingCommit = pendingLanes & ~root2, 0 !== rootHasPendingCommit && (nextLanes = getHighestPriorityLanes(rootHasPendingCommit))));
  return 0 === nextLanes ? 0 : 0 !== wipLanes && wipLanes !== nextLanes && 0 === (wipLanes & suspendedLanes) && (suspendedLanes = nextLanes & -nextLanes, rootHasPendingCommit = wipLanes & -wipLanes, suspendedLanes >= rootHasPendingCommit || 32 === suspendedLanes && 0 !== (rootHasPendingCommit & 4194048)) ? wipLanes : nextLanes;
}
function checkIfRootIsPrerendering(root2, renderLanes2) {
  return 0 === (root2.pendingLanes & ~(root2.suspendedLanes & ~root2.pingedLanes) & renderLanes2);
}
function computeExpirationTime(lane, currentTime) {
  switch (lane) {
    case 1:
    case 2:
    case 4:
    case 8:
    case 64:
      return currentTime + 250;
    case 16:
    case 32:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return currentTime + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
      return -1;
    case 67108864:
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function claimNextRetryLane() {
  var lane = nextRetryLane;
  nextRetryLane <<= 1;
  0 === (nextRetryLane & 62914560) && (nextRetryLane = 4194304);
  return lane;
}
function createLaneMap(initial) {
  for (var laneMap = [], i = 0; 31 > i; i++) laneMap.push(initial);
  return laneMap;
}
function markRootUpdated$1(root2, updateLane) {
  root2.pendingLanes |= updateLane;
  268435456 !== updateLane && (root2.suspendedLanes = 0, root2.pingedLanes = 0, root2.warmLanes = 0);
}
function markRootFinished(root2, finishedLanes, remainingLanes, spawnedLane, updatedLanes, suspendedRetryLanes) {
  var previouslyPendingLanes = root2.pendingLanes;
  root2.pendingLanes = remainingLanes;
  root2.suspendedLanes = 0;
  root2.pingedLanes = 0;
  root2.warmLanes = 0;
  root2.expiredLanes &= remainingLanes;
  root2.entangledLanes &= remainingLanes;
  root2.errorRecoveryDisabledLanes &= remainingLanes;
  root2.shellSuspendCounter = 0;
  var entanglements = root2.entanglements, expirationTimes = root2.expirationTimes, hiddenUpdates = root2.hiddenUpdates;
  for (remainingLanes = previouslyPendingLanes & ~remainingLanes; 0 < remainingLanes; ) {
    var index$7 = 31 - clz32(remainingLanes), lane = 1 << index$7;
    entanglements[index$7] = 0;
    expirationTimes[index$7] = -1;
    var hiddenUpdatesForLane = hiddenUpdates[index$7];
    if (null !== hiddenUpdatesForLane)
      for (hiddenUpdates[index$7] = null, index$7 = 0; index$7 < hiddenUpdatesForLane.length; index$7++) {
        var update = hiddenUpdatesForLane[index$7];
        null !== update && (update.lane &= -536870913);
      }
    remainingLanes &= ~lane;
  }
  0 !== spawnedLane && markSpawnedDeferredLane(root2, spawnedLane, 0);
  0 !== suspendedRetryLanes && 0 === updatedLanes && 0 !== root2.tag && (root2.suspendedLanes |= suspendedRetryLanes & ~(previouslyPendingLanes & ~finishedLanes));
}
function markSpawnedDeferredLane(root2, spawnedLane, entangledLanes) {
  root2.pendingLanes |= spawnedLane;
  root2.suspendedLanes &= ~spawnedLane;
  var spawnedLaneIndex = 31 - clz32(spawnedLane);
  root2.entangledLanes |= spawnedLane;
  root2.entanglements[spawnedLaneIndex] = root2.entanglements[spawnedLaneIndex] | 1073741824 | entangledLanes & 261930;
}
function markRootEntangled(root2, entangledLanes) {
  var rootEntangledLanes = root2.entangledLanes |= entangledLanes;
  for (root2 = root2.entanglements; rootEntangledLanes; ) {
    var index$8 = 31 - clz32(rootEntangledLanes), lane = 1 << index$8;
    lane & entangledLanes | root2[index$8] & entangledLanes && (root2[index$8] |= entangledLanes);
    rootEntangledLanes &= ~lane;
  }
}
function getBumpedLaneForHydration(root2, renderLanes2) {
  var renderLane = renderLanes2 & -renderLanes2;
  renderLane = 0 !== (renderLane & 42) ? 1 : getBumpedLaneForHydrationByLane(renderLane);
  return 0 !== (renderLane & (root2.suspendedLanes | renderLanes2)) ? 0 : renderLane;
}
function getBumpedLaneForHydrationByLane(lane) {
  switch (lane) {
    case 2:
      lane = 1;
      break;
    case 8:
      lane = 4;
      break;
    case 32:
      lane = 16;
      break;
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
      lane = 128;
      break;
    case 268435456:
      lane = 134217728;
      break;
    default:
      lane = 0;
  }
  return lane;
}
function lanesToEventPriority(lanes) {
  lanes &= -lanes;
  return 2 < lanes ? 8 < lanes ? 0 !== (lanes & 134217727) ? 32 : 268435456 : 8 : 2;
}
function resolveUpdatePriority() {
  var updatePriority = ReactDOMSharedInternals.p;
  if (0 !== updatePriority) return updatePriority;
  updatePriority = window.event;
  return void 0 === updatePriority ? 32 : getEventPriority(updatePriority.type);
}
function runWithPriority(priority, fn) {
  var previousPriority = ReactDOMSharedInternals.p;
  try {
    return ReactDOMSharedInternals.p = priority, fn();
  } finally {
    ReactDOMSharedInternals.p = previousPriority;
  }
}
var randomKey = Math.random().toString(36).slice(2), internalInstanceKey = "__reactFiber$" + randomKey, internalPropsKey = "__reactProps$" + randomKey, internalContainerInstanceKey = "__reactContainer$" + randomKey, internalEventHandlersKey = "__reactEvents$" + randomKey, internalEventHandlerListenersKey = "__reactListeners$" + randomKey, internalEventHandlesSetKey = "__reactHandles$" + randomKey, internalRootNodeResourcesKey = "__reactResources$" + randomKey, internalHoistableMarker = "__reactMarker$" + randomKey;
function detachDeletedInstance(node) {
  delete node[internalInstanceKey];
  delete node[internalPropsKey];
  delete node[internalEventHandlersKey];
  delete node[internalEventHandlerListenersKey];
  delete node[internalEventHandlesSetKey];
}
function getClosestInstanceFromNode(targetNode) {
  var targetInst = targetNode[internalInstanceKey];
  if (targetInst) return targetInst;
  for (var parentNode = targetNode.parentNode; parentNode; ) {
    if (targetInst = parentNode[internalContainerInstanceKey] || parentNode[internalInstanceKey]) {
      parentNode = targetInst.alternate;
      if (null !== targetInst.child || null !== parentNode && null !== parentNode.child)
        for (targetNode = getParentHydrationBoundary(targetNode); null !== targetNode; ) {
          if (parentNode = targetNode[internalInstanceKey]) return parentNode;
          targetNode = getParentHydrationBoundary(targetNode);
        }
      return targetInst;
    }
    targetNode = parentNode;
    parentNode = targetNode.parentNode;
  }
  return null;
}
function getInstanceFromNode(node) {
  if (node = node[internalInstanceKey] || node[internalContainerInstanceKey]) {
    var tag = node.tag;
    if (5 === tag || 6 === tag || 13 === tag || 31 === tag || 26 === tag || 27 === tag || 3 === tag)
      return node;
  }
  return null;
}
function getNodeFromInstance(inst) {
  var tag = inst.tag;
  if (5 === tag || 26 === tag || 27 === tag || 6 === tag) return inst.stateNode;
  throw Error(formatProdErrorMessage(33));
}
function getResourcesFromRoot(root2) {
  var resources = root2[internalRootNodeResourcesKey];
  resources || (resources = root2[internalRootNodeResourcesKey] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() });
  return resources;
}
function markNodeAsHoistable(node) {
  node[internalHoistableMarker] = true;
}
var allNativeEvents = /* @__PURE__ */ new Set(), registrationNameDependencies = {};
function registerTwoPhaseEvent(registrationName, dependencies) {
  registerDirectEvent(registrationName, dependencies);
  registerDirectEvent(registrationName + "Capture", dependencies);
}
function registerDirectEvent(registrationName, dependencies) {
  registrationNameDependencies[registrationName] = dependencies;
  for (registrationName = 0; registrationName < dependencies.length; registrationName++)
    allNativeEvents.add(dependencies[registrationName]);
}
var VALID_ATTRIBUTE_NAME_REGEX = RegExp(
  "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
), illegalAttributeNameCache = {}, validatedAttributeNameCache = {};
function isAttributeNameSafe(attributeName) {
  if (hasOwnProperty.call(validatedAttributeNameCache, attributeName))
    return true;
  if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) return false;
  if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName))
    return validatedAttributeNameCache[attributeName] = true;
  illegalAttributeNameCache[attributeName] = true;
  return false;
}
function setValueForAttribute(node, name, value) {
  if (isAttributeNameSafe(name))
    if (null === value) node.removeAttribute(name);
    else {
      switch (typeof value) {
        case "undefined":
        case "function":
        case "symbol":
          node.removeAttribute(name);
          return;
        case "boolean":
          var prefix$10 = name.toLowerCase().slice(0, 5);
          if ("data-" !== prefix$10 && "aria-" !== prefix$10) {
            node.removeAttribute(name);
            return;
          }
      }
      node.setAttribute(name, "" + value);
    }
}
function setValueForKnownAttribute(node, name, value) {
  if (null === value) node.removeAttribute(name);
  else {
    switch (typeof value) {
      case "undefined":
      case "function":
      case "symbol":
      case "boolean":
        node.removeAttribute(name);
        return;
    }
    node.setAttribute(name, "" + value);
  }
}
function setValueForNamespacedAttribute(node, namespace, name, value) {
  if (null === value) node.removeAttribute(name);
  else {
    switch (typeof value) {
      case "undefined":
      case "function":
      case "symbol":
      case "boolean":
        node.removeAttribute(name);
        return;
    }
    node.setAttributeNS(namespace, name, "" + value);
  }
}
function getToStringValue(value) {
  switch (typeof value) {
    case "bigint":
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return value;
    case "object":
      return value;
    default:
      return "";
  }
}
function isCheckable(elem) {
  var type = elem.type;
  return (elem = elem.nodeName) && "input" === elem.toLowerCase() && ("checkbox" === type || "radio" === type);
}
function trackValueOnNode(node, valueField, currentValue) {
  var descriptor = Object.getOwnPropertyDescriptor(
    node.constructor.prototype,
    valueField
  );
  if (!node.hasOwnProperty(valueField) && "undefined" !== typeof descriptor && "function" === typeof descriptor.get && "function" === typeof descriptor.set) {
    var get = descriptor.get, set = descriptor.set;
    Object.defineProperty(node, valueField, {
      configurable: true,
      get: function() {
        return get.call(this);
      },
      set: function(value) {
        currentValue = "" + value;
        set.call(this, value);
      }
    });
    Object.defineProperty(node, valueField, {
      enumerable: descriptor.enumerable
    });
    return {
      getValue: function() {
        return currentValue;
      },
      setValue: function(value) {
        currentValue = "" + value;
      },
      stopTracking: function() {
        node._valueTracker = null;
        delete node[valueField];
      }
    };
  }
}
function track(node) {
  if (!node._valueTracker) {
    var valueField = isCheckable(node) ? "checked" : "value";
    node._valueTracker = trackValueOnNode(
      node,
      valueField,
      "" + node[valueField]
    );
  }
}
function updateValueIfChanged(node) {
  if (!node) return false;
  var tracker = node._valueTracker;
  if (!tracker) return true;
  var lastValue = tracker.getValue();
  var value = "";
  node && (value = isCheckable(node) ? node.checked ? "true" : "false" : node.value);
  node = value;
  return node !== lastValue ? (tracker.setValue(node), true) : false;
}
function getActiveElement(doc) {
  doc = doc || ("undefined" !== typeof document ? document : void 0);
  if ("undefined" === typeof doc) return null;
  try {
    return doc.activeElement || doc.body;
  } catch (e) {
    return doc.body;
  }
}
var escapeSelectorAttributeValueInsideDoubleQuotesRegex = /[\n"\\]/g;
function escapeSelectorAttributeValueInsideDoubleQuotes(value) {
  return value.replace(
    escapeSelectorAttributeValueInsideDoubleQuotesRegex,
    function(ch) {
      return "\\" + ch.charCodeAt(0).toString(16) + " ";
    }
  );
}
function updateInput(element, value, defaultValue, lastDefaultValue, checked, defaultChecked, type, name) {
  element.name = "";
  null != type && "function" !== typeof type && "symbol" !== typeof type && "boolean" !== typeof type ? element.type = type : element.removeAttribute("type");
  if (null != value)
    if ("number" === type) {
      if (0 === value && "" === element.value || element.value != value)
        element.value = "" + getToStringValue(value);
    } else
      element.value !== "" + getToStringValue(value) && (element.value = "" + getToStringValue(value));
  else
    "submit" !== type && "reset" !== type || element.removeAttribute("value");
  null != value ? setDefaultValue(element, type, getToStringValue(value)) : null != defaultValue ? setDefaultValue(element, type, getToStringValue(defaultValue)) : null != lastDefaultValue && element.removeAttribute("value");
  null == checked && null != defaultChecked && (element.defaultChecked = !!defaultChecked);
  null != checked && (element.checked = checked && "function" !== typeof checked && "symbol" !== typeof checked);
  null != name && "function" !== typeof name && "symbol" !== typeof name && "boolean" !== typeof name ? element.name = "" + getToStringValue(name) : element.removeAttribute("name");
}
function initInput(element, value, defaultValue, checked, defaultChecked, type, name, isHydrating2) {
  null != type && "function" !== typeof type && "symbol" !== typeof type && "boolean" !== typeof type && (element.type = type);
  if (null != value || null != defaultValue) {
    if (!("submit" !== type && "reset" !== type || void 0 !== value && null !== value)) {
      track(element);
      return;
    }
    defaultValue = null != defaultValue ? "" + getToStringValue(defaultValue) : "";
    value = null != value ? "" + getToStringValue(value) : defaultValue;
    isHydrating2 || value === element.value || (element.value = value);
    element.defaultValue = value;
  }
  checked = null != checked ? checked : defaultChecked;
  checked = "function" !== typeof checked && "symbol" !== typeof checked && !!checked;
  element.checked = isHydrating2 ? element.checked : !!checked;
  element.defaultChecked = !!checked;
  null != name && "function" !== typeof name && "symbol" !== typeof name && "boolean" !== typeof name && (element.name = name);
  track(element);
}
function setDefaultValue(node, type, value) {
  "number" === type && getActiveElement(node.ownerDocument) === node || node.defaultValue === "" + value || (node.defaultValue = "" + value);
}
function updateOptions(node, multiple, propValue, setDefaultSelected) {
  node = node.options;
  if (multiple) {
    multiple = {};
    for (var i = 0; i < propValue.length; i++)
      multiple["$" + propValue[i]] = true;
    for (propValue = 0; propValue < node.length; propValue++)
      i = multiple.hasOwnProperty("$" + node[propValue].value), node[propValue].selected !== i && (node[propValue].selected = i), i && setDefaultSelected && (node[propValue].defaultSelected = true);
  } else {
    propValue = "" + getToStringValue(propValue);
    multiple = null;
    for (i = 0; i < node.length; i++) {
      if (node[i].value === propValue) {
        node[i].selected = true;
        setDefaultSelected && (node[i].defaultSelected = true);
        return;
      }
      null !== multiple || node[i].disabled || (multiple = node[i]);
    }
    null !== multiple && (multiple.selected = true);
  }
}
function updateTextarea(element, value, defaultValue) {
  if (null != value && (value = "" + getToStringValue(value), value !== element.value && (element.value = value), null == defaultValue)) {
    element.defaultValue !== value && (element.defaultValue = value);
    return;
  }
  element.defaultValue = null != defaultValue ? "" + getToStringValue(defaultValue) : "";
}
function initTextarea(element, value, defaultValue, children) {
  if (null == value) {
    if (null != children) {
      if (null != defaultValue) throw Error(formatProdErrorMessage(92));
      if (isArrayImpl(children)) {
        if (1 < children.length) throw Error(formatProdErrorMessage(93));
        children = children[0];
      }
      defaultValue = children;
    }
    null == defaultValue && (defaultValue = "");
    value = defaultValue;
  }
  defaultValue = getToStringValue(value);
  element.defaultValue = defaultValue;
  children = element.textContent;
  children === defaultValue && "" !== children && null !== children && (element.value = children);
  track(element);
}
function setTextContent(node, text) {
  if (text) {
    var firstChild = node.firstChild;
    if (firstChild && firstChild === node.lastChild && 3 === firstChild.nodeType) {
      firstChild.nodeValue = text;
      return;
    }
  }
  node.textContent = text;
}
var unitlessNumbers = new Set(
  "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
    " "
  )
);
function setValueForStyle(style2, styleName, value) {
  var isCustomProperty = 0 === styleName.indexOf("--");
  null == value || "boolean" === typeof value || "" === value ? isCustomProperty ? style2.setProperty(styleName, "") : "float" === styleName ? style2.cssFloat = "" : style2[styleName] = "" : isCustomProperty ? style2.setProperty(styleName, value) : "number" !== typeof value || 0 === value || unitlessNumbers.has(styleName) ? "float" === styleName ? style2.cssFloat = value : style2[styleName] = ("" + value).trim() : style2[styleName] = value + "px";
}
function setValueForStyles(node, styles, prevStyles) {
  if (null != styles && "object" !== typeof styles)
    throw Error(formatProdErrorMessage(62));
  node = node.style;
  if (null != prevStyles) {
    for (var styleName in prevStyles)
      !prevStyles.hasOwnProperty(styleName) || null != styles && styles.hasOwnProperty(styleName) || (0 === styleName.indexOf("--") ? node.setProperty(styleName, "") : "float" === styleName ? node.cssFloat = "" : node[styleName] = "");
    for (var styleName$16 in styles)
      styleName = styles[styleName$16], styles.hasOwnProperty(styleName$16) && prevStyles[styleName$16] !== styleName && setValueForStyle(node, styleName$16, styleName);
  } else
    for (var styleName$17 in styles)
      styles.hasOwnProperty(styleName$17) && setValueForStyle(node, styleName$17, styles[styleName$17]);
}
function isCustomElement(tagName) {
  if (-1 === tagName.indexOf("-")) return false;
  switch (tagName) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return false;
    default:
      return true;
  }
}
var aliases = /* @__PURE__ */ new Map([
  ["acceptCharset", "accept-charset"],
  ["htmlFor", "for"],
  ["httpEquiv", "http-equiv"],
  ["crossOrigin", "crossorigin"],
  ["accentHeight", "accent-height"],
  ["alignmentBaseline", "alignment-baseline"],
  ["arabicForm", "arabic-form"],
  ["baselineShift", "baseline-shift"],
  ["capHeight", "cap-height"],
  ["clipPath", "clip-path"],
  ["clipRule", "clip-rule"],
  ["colorInterpolation", "color-interpolation"],
  ["colorInterpolationFilters", "color-interpolation-filters"],
  ["colorProfile", "color-profile"],
  ["colorRendering", "color-rendering"],
  ["dominantBaseline", "dominant-baseline"],
  ["enableBackground", "enable-background"],
  ["fillOpacity", "fill-opacity"],
  ["fillRule", "fill-rule"],
  ["floodColor", "flood-color"],
  ["floodOpacity", "flood-opacity"],
  ["fontFamily", "font-family"],
  ["fontSize", "font-size"],
  ["fontSizeAdjust", "font-size-adjust"],
  ["fontStretch", "font-stretch"],
  ["fontStyle", "font-style"],
  ["fontVariant", "font-variant"],
  ["fontWeight", "font-weight"],
  ["glyphName", "glyph-name"],
  ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
  ["glyphOrientationVertical", "glyph-orientation-vertical"],
  ["horizAdvX", "horiz-adv-x"],
  ["horizOriginX", "horiz-origin-x"],
  ["imageRendering", "image-rendering"],
  ["letterSpacing", "letter-spacing"],
  ["lightingColor", "lighting-color"],
  ["markerEnd", "marker-end"],
  ["markerMid", "marker-mid"],
  ["markerStart", "marker-start"],
  ["overlinePosition", "overline-position"],
  ["overlineThickness", "overline-thickness"],
  ["paintOrder", "paint-order"],
  ["panose-1", "panose-1"],
  ["pointerEvents", "pointer-events"],
  ["renderingIntent", "rendering-intent"],
  ["shapeRendering", "shape-rendering"],
  ["stopColor", "stop-color"],
  ["stopOpacity", "stop-opacity"],
  ["strikethroughPosition", "strikethrough-position"],
  ["strikethroughThickness", "strikethrough-thickness"],
  ["strokeDasharray", "stroke-dasharray"],
  ["strokeDashoffset", "stroke-dashoffset"],
  ["strokeLinecap", "stroke-linecap"],
  ["strokeLinejoin", "stroke-linejoin"],
  ["strokeMiterlimit", "stroke-miterlimit"],
  ["strokeOpacity", "stroke-opacity"],
  ["strokeWidth", "stroke-width"],
  ["textAnchor", "text-anchor"],
  ["textDecoration", "text-decoration"],
  ["textRendering", "text-rendering"],
  ["transformOrigin", "transform-origin"],
  ["underlinePosition", "underline-position"],
  ["underlineThickness", "underline-thickness"],
  ["unicodeBidi", "unicode-bidi"],
  ["unicodeRange", "unicode-range"],
  ["unitsPerEm", "units-per-em"],
  ["vAlphabetic", "v-alphabetic"],
  ["vHanging", "v-hanging"],
  ["vIdeographic", "v-ideographic"],
  ["vMathematical", "v-mathematical"],
  ["vectorEffect", "vector-effect"],
  ["vertAdvY", "vert-adv-y"],
  ["vertOriginX", "vert-origin-x"],
  ["vertOriginY", "vert-origin-y"],
  ["wordSpacing", "word-spacing"],
  ["writingMode", "writing-mode"],
  ["xmlnsXlink", "xmlns:xlink"],
  ["xHeight", "x-height"]
]), isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
function sanitizeURL(url) {
  return isJavaScriptProtocol.test("" + url) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : url;
}
function noop$1() {
}
var currentReplayingEvent = null;
function getEventTarget(nativeEvent) {
  nativeEvent = nativeEvent.target || nativeEvent.srcElement || window;
  nativeEvent.correspondingUseElement && (nativeEvent = nativeEvent.correspondingUseElement);
  return 3 === nativeEvent.nodeType ? nativeEvent.parentNode : nativeEvent;
}
var restoreTarget = null, restoreQueue = null;
function restoreStateOfTarget(target) {
  var internalInstance = getInstanceFromNode(target);
  if (internalInstance && (target = internalInstance.stateNode)) {
    var props = target[internalPropsKey] || null;
    a: switch (target = internalInstance.stateNode, internalInstance.type) {
      case "input":
        updateInput(
          target,
          props.value,
          props.defaultValue,
          props.defaultValue,
          props.checked,
          props.defaultChecked,
          props.type,
          props.name
        );
        internalInstance = props.name;
        if ("radio" === props.type && null != internalInstance) {
          for (props = target; props.parentNode; ) props = props.parentNode;
          props = props.querySelectorAll(
            'input[name="' + escapeSelectorAttributeValueInsideDoubleQuotes(
              "" + internalInstance
            ) + '"][type="radio"]'
          );
          for (internalInstance = 0; internalInstance < props.length; internalInstance++) {
            var otherNode = props[internalInstance];
            if (otherNode !== target && otherNode.form === target.form) {
              var otherProps = otherNode[internalPropsKey] || null;
              if (!otherProps) throw Error(formatProdErrorMessage(90));
              updateInput(
                otherNode,
                otherProps.value,
                otherProps.defaultValue,
                otherProps.defaultValue,
                otherProps.checked,
                otherProps.defaultChecked,
                otherProps.type,
                otherProps.name
              );
            }
          }
          for (internalInstance = 0; internalInstance < props.length; internalInstance++)
            otherNode = props[internalInstance], otherNode.form === target.form && updateValueIfChanged(otherNode);
        }
        break a;
      case "textarea":
        updateTextarea(target, props.value, props.defaultValue);
        break a;
      case "select":
        internalInstance = props.value, null != internalInstance && updateOptions(target, !!props.multiple, internalInstance, false);
    }
  }
}
var isInsideEventHandler = false;
function batchedUpdates$1(fn, a, b) {
  if (isInsideEventHandler) return fn(a, b);
  isInsideEventHandler = true;
  try {
    var JSCompiler_inline_result = fn(a);
    return JSCompiler_inline_result;
  } finally {
    if (isInsideEventHandler = false, null !== restoreTarget || null !== restoreQueue) {
      if (flushSyncWork$1(), restoreTarget && (a = restoreTarget, fn = restoreQueue, restoreQueue = restoreTarget = null, restoreStateOfTarget(a), fn))
        for (a = 0; a < fn.length; a++) restoreStateOfTarget(fn[a]);
    }
  }
}
function getListener(inst, registrationName) {
  var stateNode = inst.stateNode;
  if (null === stateNode) return null;
  var props = stateNode[internalPropsKey] || null;
  if (null === props) return null;
  stateNode = props[registrationName];
  a: switch (registrationName) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (props = !props.disabled) || (inst = inst.type, props = !("button" === inst || "input" === inst || "select" === inst || "textarea" === inst));
      inst = !props;
      break a;
    default:
      inst = false;
  }
  if (inst) return null;
  if (stateNode && "function" !== typeof stateNode)
    throw Error(
      formatProdErrorMessage(231, registrationName, typeof stateNode)
    );
  return stateNode;
}
var canUseDOM = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), passiveBrowserEventsSupported = false;
if (canUseDOM)
  try {
    var options = {};
    Object.defineProperty(options, "passive", {
      get: function() {
        passiveBrowserEventsSupported = true;
      }
    });
    window.addEventListener("test", options, options);
    window.removeEventListener("test", options, options);
  } catch (e) {
    passiveBrowserEventsSupported = false;
  }
var root = null, startText = null, fallbackText = null;
function getData() {
  if (fallbackText) return fallbackText;
  var start, startValue = startText, startLength = startValue.length, end, endValue = "value" in root ? root.value : root.textContent, endLength = endValue.length;
  for (start = 0; start < startLength && startValue[start] === endValue[start]; start++) ;
  var minEnd = startLength - start;
  for (end = 1; end <= minEnd && startValue[startLength - end] === endValue[endLength - end]; end++) ;
  return fallbackText = endValue.slice(start, 1 < end ? 1 - end : void 0);
}
function getEventCharCode(nativeEvent) {
  var keyCode = nativeEvent.keyCode;
  "charCode" in nativeEvent ? (nativeEvent = nativeEvent.charCode, 0 === nativeEvent && 13 === keyCode && (nativeEvent = 13)) : nativeEvent = keyCode;
  10 === nativeEvent && (nativeEvent = 13);
  return 32 <= nativeEvent || 13 === nativeEvent ? nativeEvent : 0;
}
function functionThatReturnsTrue() {
  return true;
}
function functionThatReturnsFalse() {
  return false;
}
function createSyntheticEvent(Interface) {
  function SyntheticBaseEvent(reactName, reactEventType, targetInst, nativeEvent, nativeEventTarget) {
    this._reactName = reactName;
    this._targetInst = targetInst;
    this.type = reactEventType;
    this.nativeEvent = nativeEvent;
    this.target = nativeEventTarget;
    this.currentTarget = null;
    for (var propName in Interface)
      Interface.hasOwnProperty(propName) && (reactName = Interface[propName], this[propName] = reactName ? reactName(nativeEvent) : nativeEvent[propName]);
    this.isDefaultPrevented = (null != nativeEvent.defaultPrevented ? nativeEvent.defaultPrevented : false === nativeEvent.returnValue) ? functionThatReturnsTrue : functionThatReturnsFalse;
    this.isPropagationStopped = functionThatReturnsFalse;
    return this;
  }
  assign(SyntheticBaseEvent.prototype, {
    preventDefault: function() {
      this.defaultPrevented = true;
      var event = this.nativeEvent;
      event && (event.preventDefault ? event.preventDefault() : "unknown" !== typeof event.returnValue && (event.returnValue = false), this.isDefaultPrevented = functionThatReturnsTrue);
    },
    stopPropagation: function() {
      var event = this.nativeEvent;
      event && (event.stopPropagation ? event.stopPropagation() : "unknown" !== typeof event.cancelBubble && (event.cancelBubble = true), this.isPropagationStopped = functionThatReturnsTrue);
    },
    persist: function() {
    },
    isPersistent: functionThatReturnsTrue
  });
  return SyntheticBaseEvent;
}
var EventInterface = {
  eventPhase: 0,
  bubbles: 0,
  cancelable: 0,
  timeStamp: function(event) {
    return event.timeStamp || Date.now();
  },
  defaultPrevented: 0,
  isTrusted: 0
}, SyntheticEvent = createSyntheticEvent(EventInterface), UIEventInterface = assign({}, EventInterface, { view: 0, detail: 0 }), SyntheticUIEvent = createSyntheticEvent(UIEventInterface), lastMovementX, lastMovementY, lastMouseEvent, MouseEventInterface = assign({}, UIEventInterface, {
  screenX: 0,
  screenY: 0,
  clientX: 0,
  clientY: 0,
  pageX: 0,
  pageY: 0,
  ctrlKey: 0,
  shiftKey: 0,
  altKey: 0,
  metaKey: 0,
  getModifierState: getEventModifierState,
  button: 0,
  buttons: 0,
  relatedTarget: function(event) {
    return void 0 === event.relatedTarget ? event.fromElement === event.srcElement ? event.toElement : event.fromElement : event.relatedTarget;
  },
  movementX: function(event) {
    if ("movementX" in event) return event.movementX;
    event !== lastMouseEvent && (lastMouseEvent && "mousemove" === event.type ? (lastMovementX = event.screenX - lastMouseEvent.screenX, lastMovementY = event.screenY - lastMouseEvent.screenY) : lastMovementY = lastMovementX = 0, lastMouseEvent = event);
    return lastMovementX;
  },
  movementY: function(event) {
    return "movementY" in event ? event.movementY : lastMovementY;
  }
}), SyntheticMouseEvent = createSyntheticEvent(MouseEventInterface), DragEventInterface = assign({}, MouseEventInterface, { dataTransfer: 0 }), SyntheticDragEvent = createSyntheticEvent(DragEventInterface), FocusEventInterface = assign({}, UIEventInterface, { relatedTarget: 0 }), SyntheticFocusEvent = createSyntheticEvent(FocusEventInterface), AnimationEventInterface = assign({}, EventInterface, {
  animationName: 0,
  elapsedTime: 0,
  pseudoElement: 0
}), SyntheticAnimationEvent = createSyntheticEvent(AnimationEventInterface), ClipboardEventInterface = assign({}, EventInterface, {
  clipboardData: function(event) {
    return "clipboardData" in event ? event.clipboardData : window.clipboardData;
  }
}), SyntheticClipboardEvent = createSyntheticEvent(ClipboardEventInterface), CompositionEventInterface = assign({}, EventInterface, { data: 0 }), SyntheticCompositionEvent = createSyntheticEvent(CompositionEventInterface), normalizeKey = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, translateToKey = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, modifierKeyToProp = {
  Alt: "altKey",
  Control: "ctrlKey",
  Meta: "metaKey",
  Shift: "shiftKey"
};
function modifierStateGetter(keyArg) {
  var nativeEvent = this.nativeEvent;
  return nativeEvent.getModifierState ? nativeEvent.getModifierState(keyArg) : (keyArg = modifierKeyToProp[keyArg]) ? !!nativeEvent[keyArg] : false;
}
function getEventModifierState() {
  return modifierStateGetter;
}
var KeyboardEventInterface = assign({}, UIEventInterface, {
  key: function(nativeEvent) {
    if (nativeEvent.key) {
      var key = normalizeKey[nativeEvent.key] || nativeEvent.key;
      if ("Unidentified" !== key) return key;
    }
    return "keypress" === nativeEvent.type ? (nativeEvent = getEventCharCode(nativeEvent), 13 === nativeEvent ? "Enter" : String.fromCharCode(nativeEvent)) : "keydown" === nativeEvent.type || "keyup" === nativeEvent.type ? translateToKey[nativeEvent.keyCode] || "Unidentified" : "";
  },
  code: 0,
  location: 0,
  ctrlKey: 0,
  shiftKey: 0,
  altKey: 0,
  metaKey: 0,
  repeat: 0,
  locale: 0,
  getModifierState: getEventModifierState,
  charCode: function(event) {
    return "keypress" === event.type ? getEventCharCode(event) : 0;
  },
  keyCode: function(event) {
    return "keydown" === event.type || "keyup" === event.type ? event.keyCode : 0;
  },
  which: function(event) {
    return "keypress" === event.type ? getEventCharCode(event) : "keydown" === event.type || "keyup" === event.type ? event.keyCode : 0;
  }
}), SyntheticKeyboardEvent = createSyntheticEvent(KeyboardEventInterface), PointerEventInterface = assign({}, MouseEventInterface, {
  pointerId: 0,
  width: 0,
  height: 0,
  pressure: 0,
  tangentialPressure: 0,
  tiltX: 0,
  tiltY: 0,
  twist: 0,
  pointerType: 0,
  isPrimary: 0
}), SyntheticPointerEvent = createSyntheticEvent(PointerEventInterface), TouchEventInterface = assign({}, UIEventInterface, {
  touches: 0,
  targetTouches: 0,
  changedTouches: 0,
  altKey: 0,
  metaKey: 0,
  ctrlKey: 0,
  shiftKey: 0,
  getModifierState: getEventModifierState
}), SyntheticTouchEvent = createSyntheticEvent(TouchEventInterface), TransitionEventInterface = assign({}, EventInterface, {
  propertyName: 0,
  elapsedTime: 0,
  pseudoElement: 0
}), SyntheticTransitionEvent = createSyntheticEvent(TransitionEventInterface), WheelEventInterface = assign({}, MouseEventInterface, {
  deltaX: function(event) {
    return "deltaX" in event ? event.deltaX : "wheelDeltaX" in event ? -event.wheelDeltaX : 0;
  },
  deltaY: function(event) {
    return "deltaY" in event ? event.deltaY : "wheelDeltaY" in event ? -event.wheelDeltaY : "wheelDelta" in event ? -event.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), SyntheticWheelEvent = createSyntheticEvent(WheelEventInterface), ToggleEventInterface = assign({}, EventInterface, {
  newState: 0,
  oldState: 0
}), SyntheticToggleEvent = createSyntheticEvent(ToggleEventInterface), END_KEYCODES = [9, 13, 27, 32], canUseCompositionEvent = canUseDOM && "CompositionEvent" in window, documentMode = null;
canUseDOM && "documentMode" in document && (documentMode = document.documentMode);
var canUseTextInputEvent = canUseDOM && "TextEvent" in window && !documentMode, useFallbackCompositionData = canUseDOM && (!canUseCompositionEvent || documentMode && 8 < documentMode && 11 >= documentMode), SPACEBAR_CHAR = String.fromCharCode(32), hasSpaceKeypress = false;
function isFallbackCompositionEnd(domEventName, nativeEvent) {
  switch (domEventName) {
    case "keyup":
      return -1 !== END_KEYCODES.indexOf(nativeEvent.keyCode);
    case "keydown":
      return 229 !== nativeEvent.keyCode;
    case "keypress":
    case "mousedown":
    case "focusout":
      return true;
    default:
      return false;
  }
}
function getDataFromCustomEvent(nativeEvent) {
  nativeEvent = nativeEvent.detail;
  return "object" === typeof nativeEvent && "data" in nativeEvent ? nativeEvent.data : null;
}
var isComposing = false;
function getNativeBeforeInputChars(domEventName, nativeEvent) {
  switch (domEventName) {
    case "compositionend":
      return getDataFromCustomEvent(nativeEvent);
    case "keypress":
      if (32 !== nativeEvent.which) return null;
      hasSpaceKeypress = true;
      return SPACEBAR_CHAR;
    case "textInput":
      return domEventName = nativeEvent.data, domEventName === SPACEBAR_CHAR && hasSpaceKeypress ? null : domEventName;
    default:
      return null;
  }
}
function getFallbackBeforeInputChars(domEventName, nativeEvent) {
  if (isComposing)
    return "compositionend" === domEventName || !canUseCompositionEvent && isFallbackCompositionEnd(domEventName, nativeEvent) ? (domEventName = getData(), fallbackText = startText = root = null, isComposing = false, domEventName) : null;
  switch (domEventName) {
    case "paste":
      return null;
    case "keypress":
      if (!(nativeEvent.ctrlKey || nativeEvent.altKey || nativeEvent.metaKey) || nativeEvent.ctrlKey && nativeEvent.altKey) {
        if (nativeEvent.char && 1 < nativeEvent.char.length)
          return nativeEvent.char;
        if (nativeEvent.which) return String.fromCharCode(nativeEvent.which);
      }
      return null;
    case "compositionend":
      return useFallbackCompositionData && "ko" !== nativeEvent.locale ? null : nativeEvent.data;
    default:
      return null;
  }
}
var supportedInputTypes = {
  color: true,
  date: true,
  datetime: true,
  "datetime-local": true,
  email: true,
  month: true,
  number: true,
  password: true,
  range: true,
  search: true,
  tel: true,
  text: true,
  time: true,
  url: true,
  week: true
};
function isTextInputElement(elem) {
  var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
  return "input" === nodeName ? !!supportedInputTypes[elem.type] : "textarea" === nodeName ? true : false;
}
function createAndAccumulateChangeEvent(dispatchQueue, inst, nativeEvent, target) {
  restoreTarget ? restoreQueue ? restoreQueue.push(target) : restoreQueue = [target] : restoreTarget = target;
  inst = accumulateTwoPhaseListeners(inst, "onChange");
  0 < inst.length && (nativeEvent = new SyntheticEvent(
    "onChange",
    "change",
    null,
    nativeEvent,
    target
  ), dispatchQueue.push({ event: nativeEvent, listeners: inst }));
}
var activeElement$1 = null, activeElementInst$1 = null;
function runEventInBatch(dispatchQueue) {
  processDispatchQueue(dispatchQueue, 0);
}
function getInstIfValueChanged(targetInst) {
  var targetNode = getNodeFromInstance(targetInst);
  if (updateValueIfChanged(targetNode)) return targetInst;
}
function getTargetInstForChangeEvent(domEventName, targetInst) {
  if ("change" === domEventName) return targetInst;
}
var isInputEventSupported = false;
if (canUseDOM) {
  var JSCompiler_inline_result$jscomp$286;
  if (canUseDOM) {
    var isSupported$jscomp$inline_427 = "oninput" in document;
    if (!isSupported$jscomp$inline_427) {
      var element$jscomp$inline_428 = document.createElement("div");
      element$jscomp$inline_428.setAttribute("oninput", "return;");
      isSupported$jscomp$inline_427 = "function" === typeof element$jscomp$inline_428.oninput;
    }
    JSCompiler_inline_result$jscomp$286 = isSupported$jscomp$inline_427;
  } else JSCompiler_inline_result$jscomp$286 = false;
  isInputEventSupported = JSCompiler_inline_result$jscomp$286 && (!document.documentMode || 9 < document.documentMode);
}
function stopWatchingForValueChange() {
  activeElement$1 && (activeElement$1.detachEvent("onpropertychange", handlePropertyChange), activeElementInst$1 = activeElement$1 = null);
}
function handlePropertyChange(nativeEvent) {
  if ("value" === nativeEvent.propertyName && getInstIfValueChanged(activeElementInst$1)) {
    var dispatchQueue = [];
    createAndAccumulateChangeEvent(
      dispatchQueue,
      activeElementInst$1,
      nativeEvent,
      getEventTarget(nativeEvent)
    );
    batchedUpdates$1(runEventInBatch, dispatchQueue);
  }
}
function handleEventsForInputEventPolyfill(domEventName, target, targetInst) {
  "focusin" === domEventName ? (stopWatchingForValueChange(), activeElement$1 = target, activeElementInst$1 = targetInst, activeElement$1.attachEvent("onpropertychange", handlePropertyChange)) : "focusout" === domEventName && stopWatchingForValueChange();
}
function getTargetInstForInputEventPolyfill(domEventName) {
  if ("selectionchange" === domEventName || "keyup" === domEventName || "keydown" === domEventName)
    return getInstIfValueChanged(activeElementInst$1);
}
function getTargetInstForClickEvent(domEventName, targetInst) {
  if ("click" === domEventName) return getInstIfValueChanged(targetInst);
}
function getTargetInstForInputOrChangeEvent(domEventName, targetInst) {
  if ("input" === domEventName || "change" === domEventName)
    return getInstIfValueChanged(targetInst);
}
function is(x, y) {
  return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
}
var objectIs = "function" === typeof Object.is ? Object.is : is;
function shallowEqual(objA, objB) {
  if (objectIs(objA, objB)) return true;
  if ("object" !== typeof objA || null === objA || "object" !== typeof objB || null === objB)
    return false;
  var keysA = Object.keys(objA), keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;
  for (keysB = 0; keysB < keysA.length; keysB++) {
    var currentKey = keysA[keysB];
    if (!hasOwnProperty.call(objB, currentKey) || !objectIs(objA[currentKey], objB[currentKey]))
      return false;
  }
  return true;
}
function getLeafNode(node) {
  for (; node && node.firstChild; ) node = node.firstChild;
  return node;
}
function getNodeForCharacterOffset(root2, offset) {
  var node = getLeafNode(root2);
  root2 = 0;
  for (var nodeEnd; node; ) {
    if (3 === node.nodeType) {
      nodeEnd = root2 + node.textContent.length;
      if (root2 <= offset && nodeEnd >= offset)
        return { node, offset: offset - root2 };
      root2 = nodeEnd;
    }
    a: {
      for (; node; ) {
        if (node.nextSibling) {
          node = node.nextSibling;
          break a;
        }
        node = node.parentNode;
      }
      node = void 0;
    }
    node = getLeafNode(node);
  }
}
function containsNode(outerNode, innerNode) {
  return outerNode && innerNode ? outerNode === innerNode ? true : outerNode && 3 === outerNode.nodeType ? false : innerNode && 3 === innerNode.nodeType ? containsNode(outerNode, innerNode.parentNode) : "contains" in outerNode ? outerNode.contains(innerNode) : outerNode.compareDocumentPosition ? !!(outerNode.compareDocumentPosition(innerNode) & 16) : false : false;
}
function getActiveElementDeep(containerInfo) {
  containerInfo = null != containerInfo && null != containerInfo.ownerDocument && null != containerInfo.ownerDocument.defaultView ? containerInfo.ownerDocument.defaultView : window;
  for (var element = getActiveElement(containerInfo.document); element instanceof containerInfo.HTMLIFrameElement; ) {
    try {
      var JSCompiler_inline_result = "string" === typeof element.contentWindow.location.href;
    } catch (err) {
      JSCompiler_inline_result = false;
    }
    if (JSCompiler_inline_result) containerInfo = element.contentWindow;
    else break;
    element = getActiveElement(containerInfo.document);
  }
  return element;
}
function hasSelectionCapabilities(elem) {
  var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
  return nodeName && ("input" === nodeName && ("text" === elem.type || "search" === elem.type || "tel" === elem.type || "url" === elem.type || "password" === elem.type) || "textarea" === nodeName || "true" === elem.contentEditable);
}
var skipSelectionChangeEvent = canUseDOM && "documentMode" in document && 11 >= document.documentMode, activeElement = null, activeElementInst = null, lastSelection = null, mouseDown = false;
function constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget) {
  var doc = nativeEventTarget.window === nativeEventTarget ? nativeEventTarget.document : 9 === nativeEventTarget.nodeType ? nativeEventTarget : nativeEventTarget.ownerDocument;
  mouseDown || null == activeElement || activeElement !== getActiveElement(doc) || (doc = activeElement, "selectionStart" in doc && hasSelectionCapabilities(doc) ? doc = { start: doc.selectionStart, end: doc.selectionEnd } : (doc = (doc.ownerDocument && doc.ownerDocument.defaultView || window).getSelection(), doc = {
    anchorNode: doc.anchorNode,
    anchorOffset: doc.anchorOffset,
    focusNode: doc.focusNode,
    focusOffset: doc.focusOffset
  }), lastSelection && shallowEqual(lastSelection, doc) || (lastSelection = doc, doc = accumulateTwoPhaseListeners(activeElementInst, "onSelect"), 0 < doc.length && (nativeEvent = new SyntheticEvent(
    "onSelect",
    "select",
    null,
    nativeEvent,
    nativeEventTarget
  ), dispatchQueue.push({ event: nativeEvent, listeners: doc }), nativeEvent.target = activeElement)));
}
function makePrefixMap(styleProp, eventName) {
  var prefixes = {};
  prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
  prefixes["Webkit" + styleProp] = "webkit" + eventName;
  prefixes["Moz" + styleProp] = "moz" + eventName;
  return prefixes;
}
var vendorPrefixes = {
  animationend: makePrefixMap("Animation", "AnimationEnd"),
  animationiteration: makePrefixMap("Animation", "AnimationIteration"),
  animationstart: makePrefixMap("Animation", "AnimationStart"),
  transitionrun: makePrefixMap("Transition", "TransitionRun"),
  transitionstart: makePrefixMap("Transition", "TransitionStart"),
  transitioncancel: makePrefixMap("Transition", "TransitionCancel"),
  transitionend: makePrefixMap("Transition", "TransitionEnd")
}, prefixedEventNames = {}, style = {};
canUseDOM && (style = document.createElement("div").style, "AnimationEvent" in window || (delete vendorPrefixes.animationend.animation, delete vendorPrefixes.animationiteration.animation, delete vendorPrefixes.animationstart.animation), "TransitionEvent" in window || delete vendorPrefixes.transitionend.transition);
function getVendorPrefixedEventName(eventName) {
  if (prefixedEventNames[eventName]) return prefixedEventNames[eventName];
  if (!vendorPrefixes[eventName]) return eventName;
  var prefixMap = vendorPrefixes[eventName], styleProp;
  for (styleProp in prefixMap)
    if (prefixMap.hasOwnProperty(styleProp) && styleProp in style)
      return prefixedEventNames[eventName] = prefixMap[styleProp];
  return eventName;
}
var ANIMATION_END = getVendorPrefixedEventName("animationend"), ANIMATION_ITERATION = getVendorPrefixedEventName("animationiteration"), ANIMATION_START = getVendorPrefixedEventName("animationstart"), TRANSITION_RUN = getVendorPrefixedEventName("transitionrun"), TRANSITION_START = getVendorPrefixedEventName("transitionstart"), TRANSITION_CANCEL = getVendorPrefixedEventName("transitioncancel"), TRANSITION_END = getVendorPrefixedEventName("transitionend"), topLevelEventsToReactNames = /* @__PURE__ */ new Map(), simpleEventPluginEvents = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
  " "
);
simpleEventPluginEvents.push("scrollEnd");
function registerSimpleEvent(domEventName, reactName) {
  topLevelEventsToReactNames.set(domEventName, reactName);
  registerTwoPhaseEvent(reactName, [domEventName]);
}
var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
  if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
    var event = new window.ErrorEvent("error", {
      bubbles: true,
      cancelable: true,
      message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
      error
    });
    if (!window.dispatchEvent(event)) return;
  } else if ("object" === typeof process && "function" === typeof process.emit) {
    process.emit("uncaughtException", error);
    return;
  }
  console.error(error);
}, concurrentQueues = [], concurrentQueuesIndex = 0, concurrentlyUpdatedLanes = 0;
function finishQueueingConcurrentUpdates() {
  for (var endIndex = concurrentQueuesIndex, i = concurrentlyUpdatedLanes = concurrentQueuesIndex = 0; i < endIndex; ) {
    var fiber = concurrentQueues[i];
    concurrentQueues[i++] = null;
    var queue = concurrentQueues[i];
    concurrentQueues[i++] = null;
    var update = concurrentQueues[i];
    concurrentQueues[i++] = null;
    var lane = concurrentQueues[i];
    concurrentQueues[i++] = null;
    if (null !== queue && null !== update) {
      var pending = queue.pending;
      null === pending ? update.next = update : (update.next = pending.next, pending.next = update);
      queue.pending = update;
    }
    0 !== lane && markUpdateLaneFromFiberToRoot(fiber, update, lane);
  }
}
function enqueueUpdate$1(fiber, queue, update, lane) {
  concurrentQueues[concurrentQueuesIndex++] = fiber;
  concurrentQueues[concurrentQueuesIndex++] = queue;
  concurrentQueues[concurrentQueuesIndex++] = update;
  concurrentQueues[concurrentQueuesIndex++] = lane;
  concurrentlyUpdatedLanes |= lane;
  fiber.lanes |= lane;
  fiber = fiber.alternate;
  null !== fiber && (fiber.lanes |= lane);
}
function enqueueConcurrentHookUpdate(fiber, queue, update, lane) {
  enqueueUpdate$1(fiber, queue, update, lane);
  return getRootForUpdatedFiber(fiber);
}
function enqueueConcurrentRenderForLane(fiber, lane) {
  enqueueUpdate$1(fiber, null, null, lane);
  return getRootForUpdatedFiber(fiber);
}
function markUpdateLaneFromFiberToRoot(sourceFiber, update, lane) {
  sourceFiber.lanes |= lane;
  var alternate = sourceFiber.alternate;
  null !== alternate && (alternate.lanes |= lane);
  for (var isHidden = false, parent = sourceFiber.return; null !== parent; )
    parent.childLanes |= lane, alternate = parent.alternate, null !== alternate && (alternate.childLanes |= lane), 22 === parent.tag && (sourceFiber = parent.stateNode, null === sourceFiber || sourceFiber._visibility & 1 || (isHidden = true)), sourceFiber = parent, parent = parent.return;
  return 3 === sourceFiber.tag ? (parent = sourceFiber.stateNode, isHidden && null !== update && (isHidden = 31 - clz32(lane), sourceFiber = parent.hiddenUpdates, alternate = sourceFiber[isHidden], null === alternate ? sourceFiber[isHidden] = [update] : alternate.push(update), update.lane = lane | 536870912), parent) : null;
}
function getRootForUpdatedFiber(sourceFiber) {
  if (50 < nestedUpdateCount)
    throw nestedUpdateCount = 0, rootWithNestedUpdates = null, Error(formatProdErrorMessage(185));
  for (var parent = sourceFiber.return; null !== parent; )
    sourceFiber = parent, parent = sourceFiber.return;
  return 3 === sourceFiber.tag ? sourceFiber.stateNode : null;
}
var emptyContextObject = {};
function FiberNode(tag, pendingProps, key, mode) {
  this.tag = tag;
  this.key = key;
  this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
  this.index = 0;
  this.refCleanup = this.ref = null;
  this.pendingProps = pendingProps;
  this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
  this.mode = mode;
  this.subtreeFlags = this.flags = 0;
  this.deletions = null;
  this.childLanes = this.lanes = 0;
  this.alternate = null;
}
function createFiberImplClass(tag, pendingProps, key, mode) {
  return new FiberNode(tag, pendingProps, key, mode);
}
function shouldConstruct(Component2) {
  Component2 = Component2.prototype;
  return !(!Component2 || !Component2.isReactComponent);
}
function createWorkInProgress(current, pendingProps) {
  var workInProgress2 = current.alternate;
  null === workInProgress2 ? (workInProgress2 = createFiberImplClass(
    current.tag,
    pendingProps,
    current.key,
    current.mode
  ), workInProgress2.elementType = current.elementType, workInProgress2.type = current.type, workInProgress2.stateNode = current.stateNode, workInProgress2.alternate = current, current.alternate = workInProgress2) : (workInProgress2.pendingProps = pendingProps, workInProgress2.type = current.type, workInProgress2.flags = 0, workInProgress2.subtreeFlags = 0, workInProgress2.deletions = null);
  workInProgress2.flags = current.flags & 65011712;
  workInProgress2.childLanes = current.childLanes;
  workInProgress2.lanes = current.lanes;
  workInProgress2.child = current.child;
  workInProgress2.memoizedProps = current.memoizedProps;
  workInProgress2.memoizedState = current.memoizedState;
  workInProgress2.updateQueue = current.updateQueue;
  pendingProps = current.dependencies;
  workInProgress2.dependencies = null === pendingProps ? null : { lanes: pendingProps.lanes, firstContext: pendingProps.firstContext };
  workInProgress2.sibling = current.sibling;
  workInProgress2.index = current.index;
  workInProgress2.ref = current.ref;
  workInProgress2.refCleanup = current.refCleanup;
  return workInProgress2;
}
function resetWorkInProgress(workInProgress2, renderLanes2) {
  workInProgress2.flags &= 65011714;
  var current = workInProgress2.alternate;
  null === current ? (workInProgress2.childLanes = 0, workInProgress2.lanes = renderLanes2, workInProgress2.child = null, workInProgress2.subtreeFlags = 0, workInProgress2.memoizedProps = null, workInProgress2.memoizedState = null, workInProgress2.updateQueue = null, workInProgress2.dependencies = null, workInProgress2.stateNode = null) : (workInProgress2.childLanes = current.childLanes, workInProgress2.lanes = current.lanes, workInProgress2.child = current.child, workInProgress2.subtreeFlags = 0, workInProgress2.deletions = null, workInProgress2.memoizedProps = current.memoizedProps, workInProgress2.memoizedState = current.memoizedState, workInProgress2.updateQueue = current.updateQueue, workInProgress2.type = current.type, renderLanes2 = current.dependencies, workInProgress2.dependencies = null === renderLanes2 ? null : {
    lanes: renderLanes2.lanes,
    firstContext: renderLanes2.firstContext
  });
  return workInProgress2;
}
function createFiberFromTypeAndProps(type, key, pendingProps, owner, mode, lanes) {
  var fiberTag = 0;
  owner = type;
  if ("function" === typeof type) shouldConstruct(type) && (fiberTag = 1);
  else if ("string" === typeof type)
    fiberTag = isHostHoistableType(
      type,
      pendingProps,
      contextStackCursor.current
    ) ? 26 : "html" === type || "head" === type || "body" === type ? 27 : 5;
  else
    a: switch (type) {
      case REACT_ACTIVITY_TYPE:
        return type = createFiberImplClass(31, pendingProps, key, mode), type.elementType = REACT_ACTIVITY_TYPE, type.lanes = lanes, type;
      case REACT_FRAGMENT_TYPE:
        return createFiberFromFragment(pendingProps.children, mode, lanes, key);
      case REACT_STRICT_MODE_TYPE:
        fiberTag = 8;
        mode |= 24;
        break;
      case REACT_PROFILER_TYPE:
        return type = createFiberImplClass(12, pendingProps, key, mode | 2), type.elementType = REACT_PROFILER_TYPE, type.lanes = lanes, type;
      case REACT_SUSPENSE_TYPE:
        return type = createFiberImplClass(13, pendingProps, key, mode), type.elementType = REACT_SUSPENSE_TYPE, type.lanes = lanes, type;
      case REACT_SUSPENSE_LIST_TYPE:
        return type = createFiberImplClass(19, pendingProps, key, mode), type.elementType = REACT_SUSPENSE_LIST_TYPE, type.lanes = lanes, type;
      default:
        if ("object" === typeof type && null !== type)
          switch (type.$$typeof) {
            case REACT_CONTEXT_TYPE:
              fiberTag = 10;
              break a;
            case REACT_CONSUMER_TYPE:
              fiberTag = 9;
              break a;
            case REACT_FORWARD_REF_TYPE:
              fiberTag = 11;
              break a;
            case REACT_MEMO_TYPE:
              fiberTag = 14;
              break a;
            case REACT_LAZY_TYPE:
              fiberTag = 16;
              owner = null;
              break a;
          }
        fiberTag = 29;
        pendingProps = Error(
          formatProdErrorMessage(130, null === type ? "null" : typeof type, "")
        );
        owner = null;
    }
  key = createFiberImplClass(fiberTag, pendingProps, key, mode);
  key.elementType = type;
  key.type = owner;
  key.lanes = lanes;
  return key;
}
function createFiberFromFragment(elements, mode, lanes, key) {
  elements = createFiberImplClass(7, elements, key, mode);
  elements.lanes = lanes;
  return elements;
}
function createFiberFromText(content, mode, lanes) {
  content = createFiberImplClass(6, content, null, mode);
  content.lanes = lanes;
  return content;
}
function createFiberFromDehydratedFragment(dehydratedNode) {
  var fiber = createFiberImplClass(18, null, null, 0);
  fiber.stateNode = dehydratedNode;
  return fiber;
}
function createFiberFromPortal(portal, mode, lanes) {
  mode = createFiberImplClass(
    4,
    null !== portal.children ? portal.children : [],
    portal.key,
    mode
  );
  mode.lanes = lanes;
  mode.stateNode = {
    containerInfo: portal.containerInfo,
    pendingChildren: null,
    implementation: portal.implementation
  };
  return mode;
}
var CapturedStacks = /* @__PURE__ */ new WeakMap();
function createCapturedValueAtFiber(value, source) {
  if ("object" === typeof value && null !== value) {
    var existing = CapturedStacks.get(value);
    if (void 0 !== existing) return existing;
    source = {
      value,
      source,
      stack: getStackByFiberInDevAndProd(source)
    };
    CapturedStacks.set(value, source);
    return source;
  }
  return {
    value,
    source,
    stack: getStackByFiberInDevAndProd(source)
  };
}
var forkStack = [], forkStackIndex = 0, treeForkProvider = null, treeForkCount = 0, idStack = [], idStackIndex = 0, treeContextProvider = null, treeContextId = 1, treeContextOverflow = "";
function pushTreeFork(workInProgress2, totalChildren) {
  forkStack[forkStackIndex++] = treeForkCount;
  forkStack[forkStackIndex++] = treeForkProvider;
  treeForkProvider = workInProgress2;
  treeForkCount = totalChildren;
}
function pushTreeId(workInProgress2, totalChildren, index2) {
  idStack[idStackIndex++] = treeContextId;
  idStack[idStackIndex++] = treeContextOverflow;
  idStack[idStackIndex++] = treeContextProvider;
  treeContextProvider = workInProgress2;
  var baseIdWithLeadingBit = treeContextId;
  workInProgress2 = treeContextOverflow;
  var baseLength = 32 - clz32(baseIdWithLeadingBit) - 1;
  baseIdWithLeadingBit &= ~(1 << baseLength);
  index2 += 1;
  var length = 32 - clz32(totalChildren) + baseLength;
  if (30 < length) {
    var numberOfOverflowBits = baseLength - baseLength % 5;
    length = (baseIdWithLeadingBit & (1 << numberOfOverflowBits) - 1).toString(32);
    baseIdWithLeadingBit >>= numberOfOverflowBits;
    baseLength -= numberOfOverflowBits;
    treeContextId = 1 << 32 - clz32(totalChildren) + baseLength | index2 << baseLength | baseIdWithLeadingBit;
    treeContextOverflow = length + workInProgress2;
  } else
    treeContextId = 1 << length | index2 << baseLength | baseIdWithLeadingBit, treeContextOverflow = workInProgress2;
}
function pushMaterializedTreeId(workInProgress2) {
  null !== workInProgress2.return && (pushTreeFork(workInProgress2, 1), pushTreeId(workInProgress2, 1, 0));
}
function popTreeContext(workInProgress2) {
  for (; workInProgress2 === treeForkProvider; )
    treeForkProvider = forkStack[--forkStackIndex], forkStack[forkStackIndex] = null, treeForkCount = forkStack[--forkStackIndex], forkStack[forkStackIndex] = null;
  for (; workInProgress2 === treeContextProvider; )
    treeContextProvider = idStack[--idStackIndex], idStack[idStackIndex] = null, treeContextOverflow = idStack[--idStackIndex], idStack[idStackIndex] = null, treeContextId = idStack[--idStackIndex], idStack[idStackIndex] = null;
}
function restoreSuspendedTreeContext(workInProgress2, suspendedContext) {
  idStack[idStackIndex++] = treeContextId;
  idStack[idStackIndex++] = treeContextOverflow;
  idStack[idStackIndex++] = treeContextProvider;
  treeContextId = suspendedContext.id;
  treeContextOverflow = suspendedContext.overflow;
  treeContextProvider = workInProgress2;
}
var hydrationParentFiber = null, nextHydratableInstance = null, isHydrating = false, hydrationErrors = null, rootOrSingletonContext = false, HydrationMismatchException = Error(formatProdErrorMessage(519));
function throwOnHydrationMismatch(fiber) {
  var error = Error(
    formatProdErrorMessage(
      418,
      1 < arguments.length && void 0 !== arguments[1] && arguments[1] ? "text" : "HTML",
      ""
    )
  );
  queueHydrationError(createCapturedValueAtFiber(error, fiber));
  throw HydrationMismatchException;
}
function prepareToHydrateHostInstance(fiber) {
  var instance = fiber.stateNode, type = fiber.type, props = fiber.memoizedProps;
  instance[internalInstanceKey] = fiber;
  instance[internalPropsKey] = props;
  switch (type) {
    case "dialog":
      listenToNonDelegatedEvent("cancel", instance);
      listenToNonDelegatedEvent("close", instance);
      break;
    case "iframe":
    case "object":
    case "embed":
      listenToNonDelegatedEvent("load", instance);
      break;
    case "video":
    case "audio":
      for (type = 0; type < mediaEventTypes.length; type++)
        listenToNonDelegatedEvent(mediaEventTypes[type], instance);
      break;
    case "source":
      listenToNonDelegatedEvent("error", instance);
      break;
    case "img":
    case "image":
    case "link":
      listenToNonDelegatedEvent("error", instance);
      listenToNonDelegatedEvent("load", instance);
      break;
    case "details":
      listenToNonDelegatedEvent("toggle", instance);
      break;
    case "input":
      listenToNonDelegatedEvent("invalid", instance);
      initInput(
        instance,
        props.value,
        props.defaultValue,
        props.checked,
        props.defaultChecked,
        props.type,
        props.name,
        true
      );
      break;
    case "select":
      listenToNonDelegatedEvent("invalid", instance);
      break;
    case "textarea":
      listenToNonDelegatedEvent("invalid", instance), initTextarea(instance, props.value, props.defaultValue, props.children);
  }
  type = props.children;
  "string" !== typeof type && "number" !== typeof type && "bigint" !== typeof type || instance.textContent === "" + type || true === props.suppressHydrationWarning || checkForUnmatchedText(instance.textContent, type) ? (null != props.popover && (listenToNonDelegatedEvent("beforetoggle", instance), listenToNonDelegatedEvent("toggle", instance)), null != props.onScroll && listenToNonDelegatedEvent("scroll", instance), null != props.onScrollEnd && listenToNonDelegatedEvent("scrollend", instance), null != props.onClick && (instance.onclick = noop$1), instance = true) : instance = false;
  instance || throwOnHydrationMismatch(fiber, true);
}
function popToNextHostParent(fiber) {
  for (hydrationParentFiber = fiber.return; hydrationParentFiber; )
    switch (hydrationParentFiber.tag) {
      case 5:
      case 31:
      case 13:
        rootOrSingletonContext = false;
        return;
      case 27:
      case 3:
        rootOrSingletonContext = true;
        return;
      default:
        hydrationParentFiber = hydrationParentFiber.return;
    }
}
function popHydrationState(fiber) {
  if (fiber !== hydrationParentFiber) return false;
  if (!isHydrating) return popToNextHostParent(fiber), isHydrating = true, false;
  var tag = fiber.tag, JSCompiler_temp;
  if (JSCompiler_temp = 3 !== tag && 27 !== tag) {
    if (JSCompiler_temp = 5 === tag)
      JSCompiler_temp = fiber.type, JSCompiler_temp = !("form" !== JSCompiler_temp && "button" !== JSCompiler_temp) || shouldSetTextContent(fiber.type, fiber.memoizedProps);
    JSCompiler_temp = !JSCompiler_temp;
  }
  JSCompiler_temp && nextHydratableInstance && throwOnHydrationMismatch(fiber);
  popToNextHostParent(fiber);
  if (13 === tag) {
    fiber = fiber.memoizedState;
    fiber = null !== fiber ? fiber.dehydrated : null;
    if (!fiber) throw Error(formatProdErrorMessage(317));
    nextHydratableInstance = getNextHydratableInstanceAfterHydrationBoundary(fiber);
  } else if (31 === tag) {
    fiber = fiber.memoizedState;
    fiber = null !== fiber ? fiber.dehydrated : null;
    if (!fiber) throw Error(formatProdErrorMessage(317));
    nextHydratableInstance = getNextHydratableInstanceAfterHydrationBoundary(fiber);
  } else
    27 === tag ? (tag = nextHydratableInstance, isSingletonScope(fiber.type) ? (fiber = previousHydratableOnEnteringScopedSingleton, previousHydratableOnEnteringScopedSingleton = null, nextHydratableInstance = fiber) : nextHydratableInstance = tag) : nextHydratableInstance = hydrationParentFiber ? getNextHydratable(fiber.stateNode.nextSibling) : null;
  return true;
}
function resetHydrationState() {
  nextHydratableInstance = hydrationParentFiber = null;
  isHydrating = false;
}
function upgradeHydrationErrorsToRecoverable() {
  var queuedErrors = hydrationErrors;
  null !== queuedErrors && (null === workInProgressRootRecoverableErrors ? workInProgressRootRecoverableErrors = queuedErrors : workInProgressRootRecoverableErrors.push.apply(
    workInProgressRootRecoverableErrors,
    queuedErrors
  ), hydrationErrors = null);
  return queuedErrors;
}
function queueHydrationError(error) {
  null === hydrationErrors ? hydrationErrors = [error] : hydrationErrors.push(error);
}
var valueCursor = createCursor(null), currentlyRenderingFiber$1 = null, lastContextDependency = null;
function pushProvider(providerFiber, context, nextValue) {
  push(valueCursor, context._currentValue);
  context._currentValue = nextValue;
}
function popProvider(context) {
  context._currentValue = valueCursor.current;
  pop(valueCursor);
}
function scheduleContextWorkOnParentPath(parent, renderLanes2, propagationRoot) {
  for (; null !== parent; ) {
    var alternate = parent.alternate;
    (parent.childLanes & renderLanes2) !== renderLanes2 ? (parent.childLanes |= renderLanes2, null !== alternate && (alternate.childLanes |= renderLanes2)) : null !== alternate && (alternate.childLanes & renderLanes2) !== renderLanes2 && (alternate.childLanes |= renderLanes2);
    if (parent === propagationRoot) break;
    parent = parent.return;
  }
}
function propagateContextChanges(workInProgress2, contexts, renderLanes2, forcePropagateEntireTree) {
  var fiber = workInProgress2.child;
  null !== fiber && (fiber.return = workInProgress2);
  for (; null !== fiber; ) {
    var list = fiber.dependencies;
    if (null !== list) {
      var nextFiber = fiber.child;
      list = list.firstContext;
      a: for (; null !== list; ) {
        var dependency = list;
        list = fiber;
        for (var i = 0; i < contexts.length; i++)
          if (dependency.context === contexts[i]) {
            list.lanes |= renderLanes2;
            dependency = list.alternate;
            null !== dependency && (dependency.lanes |= renderLanes2);
            scheduleContextWorkOnParentPath(
              list.return,
              renderLanes2,
              workInProgress2
            );
            forcePropagateEntireTree || (nextFiber = null);
            break a;
          }
        list = dependency.next;
      }
    } else if (18 === fiber.tag) {
      nextFiber = fiber.return;
      if (null === nextFiber) throw Error(formatProdErrorMessage(341));
      nextFiber.lanes |= renderLanes2;
      list = nextFiber.alternate;
      null !== list && (list.lanes |= renderLanes2);
      scheduleContextWorkOnParentPath(nextFiber, renderLanes2, workInProgress2);
      nextFiber = null;
    } else nextFiber = fiber.child;
    if (null !== nextFiber) nextFiber.return = fiber;
    else
      for (nextFiber = fiber; null !== nextFiber; ) {
        if (nextFiber === workInProgress2) {
          nextFiber = null;
          break;
        }
        fiber = nextFiber.sibling;
        if (null !== fiber) {
          fiber.return = nextFiber.return;
          nextFiber = fiber;
          break;
        }
        nextFiber = nextFiber.return;
      }
    fiber = nextFiber;
  }
}
function propagateParentContextChanges(current, workInProgress2, renderLanes2, forcePropagateEntireTree) {
  current = null;
  for (var parent = workInProgress2, isInsidePropagationBailout = false; null !== parent; ) {
    if (!isInsidePropagationBailout) {
      if (0 !== (parent.flags & 524288)) isInsidePropagationBailout = true;
      else if (0 !== (parent.flags & 262144)) break;
    }
    if (10 === parent.tag) {
      var currentParent = parent.alternate;
      if (null === currentParent) throw Error(formatProdErrorMessage(387));
      currentParent = currentParent.memoizedProps;
      if (null !== currentParent) {
        var context = parent.type;
        objectIs(parent.pendingProps.value, currentParent.value) || (null !== current ? current.push(context) : current = [context]);
      }
    } else if (parent === hostTransitionProviderCursor.current) {
      currentParent = parent.alternate;
      if (null === currentParent) throw Error(formatProdErrorMessage(387));
      currentParent.memoizedState.memoizedState !== parent.memoizedState.memoizedState && (null !== current ? current.push(HostTransitionContext) : current = [HostTransitionContext]);
    }
    parent = parent.return;
  }
  null !== current && propagateContextChanges(
    workInProgress2,
    current,
    renderLanes2,
    forcePropagateEntireTree
  );
  workInProgress2.flags |= 262144;
}
function checkIfContextChanged(currentDependencies) {
  for (currentDependencies = currentDependencies.firstContext; null !== currentDependencies; ) {
    if (!objectIs(
      currentDependencies.context._currentValue,
      currentDependencies.memoizedValue
    ))
      return true;
    currentDependencies = currentDependencies.next;
  }
  return false;
}
function prepareToReadContext(workInProgress2) {
  currentlyRenderingFiber$1 = workInProgress2;
  lastContextDependency = null;
  workInProgress2 = workInProgress2.dependencies;
  null !== workInProgress2 && (workInProgress2.firstContext = null);
}
function readContext(context) {
  return readContextForConsumer(currentlyRenderingFiber$1, context);
}
function readContextDuringReconciliation(consumer, context) {
  null === currentlyRenderingFiber$1 && prepareToReadContext(consumer);
  return readContextForConsumer(consumer, context);
}
function readContextForConsumer(consumer, context) {
  var value = context._currentValue;
  context = { context, memoizedValue: value, next: null };
  if (null === lastContextDependency) {
    if (null === consumer) throw Error(formatProdErrorMessage(308));
    lastContextDependency = context;
    consumer.dependencies = { lanes: 0, firstContext: context };
    consumer.flags |= 524288;
  } else lastContextDependency = lastContextDependency.next = context;
  return value;
}
var AbortControllerLocal = "undefined" !== typeof AbortController ? AbortController : function() {
  var listeners = [], signal = this.signal = {
    aborted: false,
    addEventListener: function(type, listener) {
      listeners.push(listener);
    }
  };
  this.abort = function() {
    signal.aborted = true;
    listeners.forEach(function(listener) {
      return listener();
    });
  };
}, scheduleCallback$2 = Scheduler.unstable_scheduleCallback, NormalPriority = Scheduler.unstable_NormalPriority, CacheContext = {
  $$typeof: REACT_CONTEXT_TYPE,
  Consumer: null,
  Provider: null,
  _currentValue: null,
  _currentValue2: null,
  _threadCount: 0
};
function createCache() {
  return {
    controller: new AbortControllerLocal(),
    data: /* @__PURE__ */ new Map(),
    refCount: 0
  };
}
function releaseCache(cache) {
  cache.refCount--;
  0 === cache.refCount && scheduleCallback$2(NormalPriority, function() {
    cache.controller.abort();
  });
}
var currentEntangledListeners = null, currentEntangledPendingCount = 0, currentEntangledLane = 0, currentEntangledActionThenable = null;
function entangleAsyncAction(transition, thenable) {
  if (null === currentEntangledListeners) {
    var entangledListeners = currentEntangledListeners = [];
    currentEntangledPendingCount = 0;
    currentEntangledLane = requestTransitionLane();
    currentEntangledActionThenable = {
      status: "pending",
      value: void 0,
      then: function(resolve) {
        entangledListeners.push(resolve);
      }
    };
  }
  currentEntangledPendingCount++;
  thenable.then(pingEngtangledActionScope, pingEngtangledActionScope);
  return thenable;
}
function pingEngtangledActionScope() {
  if (0 === --currentEntangledPendingCount && null !== currentEntangledListeners) {
    null !== currentEntangledActionThenable && (currentEntangledActionThenable.status = "fulfilled");
    var listeners = currentEntangledListeners;
    currentEntangledListeners = null;
    currentEntangledLane = 0;
    currentEntangledActionThenable = null;
    for (var i = 0; i < listeners.length; i++) (0, listeners[i])();
  }
}
function chainThenableValue(thenable, result) {
  var listeners = [], thenableWithOverride = {
    status: "pending",
    value: null,
    reason: null,
    then: function(resolve) {
      listeners.push(resolve);
    }
  };
  thenable.then(
    function() {
      thenableWithOverride.status = "fulfilled";
      thenableWithOverride.value = result;
      for (var i = 0; i < listeners.length; i++) (0, listeners[i])(result);
    },
    function(error) {
      thenableWithOverride.status = "rejected";
      thenableWithOverride.reason = error;
      for (error = 0; error < listeners.length; error++)
        (0, listeners[error])(void 0);
    }
  );
  return thenableWithOverride;
}
var prevOnStartTransitionFinish = ReactSharedInternals.S;
ReactSharedInternals.S = function(transition, returnValue) {
  globalMostRecentTransitionTime = now();
  "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && entangleAsyncAction(transition, returnValue);
  null !== prevOnStartTransitionFinish && prevOnStartTransitionFinish(transition, returnValue);
};
var resumedCache = createCursor(null);
function peekCacheFromPool() {
  var cacheResumedFromPreviousRender = resumedCache.current;
  return null !== cacheResumedFromPreviousRender ? cacheResumedFromPreviousRender : workInProgressRoot.pooledCache;
}
function pushTransition(offscreenWorkInProgress, prevCachePool) {
  null === prevCachePool ? push(resumedCache, resumedCache.current) : push(resumedCache, prevCachePool.pool);
}
function getSuspendedCache() {
  var cacheFromPool = peekCacheFromPool();
  return null === cacheFromPool ? null : { parent: CacheContext._currentValue, pool: cacheFromPool };
}
var SuspenseException = Error(formatProdErrorMessage(460)), SuspenseyCommitException = Error(formatProdErrorMessage(474)), SuspenseActionException = Error(formatProdErrorMessage(542)), noopSuspenseyCommitThenable = { then: function() {
} };
function isThenableResolved(thenable) {
  thenable = thenable.status;
  return "fulfilled" === thenable || "rejected" === thenable;
}
function trackUsedThenable(thenableState2, thenable, index2) {
  index2 = thenableState2[index2];
  void 0 === index2 ? thenableState2.push(thenable) : index2 !== thenable && (thenable.then(noop$1, noop$1), thenable = index2);
  switch (thenable.status) {
    case "fulfilled":
      return thenable.value;
    case "rejected":
      throw thenableState2 = thenable.reason, checkIfUseWrappedInAsyncCatch(thenableState2), thenableState2;
    default:
      if ("string" === typeof thenable.status) thenable.then(noop$1, noop$1);
      else {
        thenableState2 = workInProgressRoot;
        if (null !== thenableState2 && 100 < thenableState2.shellSuspendCounter)
          throw Error(formatProdErrorMessage(482));
        thenableState2 = thenable;
        thenableState2.status = "pending";
        thenableState2.then(
          function(fulfilledValue) {
            if ("pending" === thenable.status) {
              var fulfilledThenable = thenable;
              fulfilledThenable.status = "fulfilled";
              fulfilledThenable.value = fulfilledValue;
            }
          },
          function(error) {
            if ("pending" === thenable.status) {
              var rejectedThenable = thenable;
              rejectedThenable.status = "rejected";
              rejectedThenable.reason = error;
            }
          }
        );
      }
      switch (thenable.status) {
        case "fulfilled":
          return thenable.value;
        case "rejected":
          throw thenableState2 = thenable.reason, checkIfUseWrappedInAsyncCatch(thenableState2), thenableState2;
      }
      suspendedThenable = thenable;
      throw SuspenseException;
  }
}
function resolveLazy(lazyType) {
  try {
    var init = lazyType._init;
    return init(lazyType._payload);
  } catch (x) {
    if (null !== x && "object" === typeof x && "function" === typeof x.then)
      throw suspendedThenable = x, SuspenseException;
    throw x;
  }
}
var suspendedThenable = null;
function getSuspendedThenable() {
  if (null === suspendedThenable) throw Error(formatProdErrorMessage(459));
  var thenable = suspendedThenable;
  suspendedThenable = null;
  return thenable;
}
function checkIfUseWrappedInAsyncCatch(rejectedReason) {
  if (rejectedReason === SuspenseException || rejectedReason === SuspenseActionException)
    throw Error(formatProdErrorMessage(483));
}
var thenableState$1 = null, thenableIndexCounter$1 = 0;
function unwrapThenable(thenable) {
  var index2 = thenableIndexCounter$1;
  thenableIndexCounter$1 += 1;
  null === thenableState$1 && (thenableState$1 = []);
  return trackUsedThenable(thenableState$1, thenable, index2);
}
function coerceRef(workInProgress2, element) {
  element = element.props.ref;
  workInProgress2.ref = void 0 !== element ? element : null;
}
function throwOnInvalidObjectTypeImpl(returnFiber, newChild) {
  if (newChild.$$typeof === REACT_LEGACY_ELEMENT_TYPE)
    throw Error(formatProdErrorMessage(525));
  returnFiber = Object.prototype.toString.call(newChild);
  throw Error(
    formatProdErrorMessage(
      31,
      "[object Object]" === returnFiber ? "object with keys {" + Object.keys(newChild).join(", ") + "}" : returnFiber
    )
  );
}
function createChildReconciler(shouldTrackSideEffects) {
  function deleteChild(returnFiber, childToDelete) {
    if (shouldTrackSideEffects) {
      var deletions = returnFiber.deletions;
      null === deletions ? (returnFiber.deletions = [childToDelete], returnFiber.flags |= 16) : deletions.push(childToDelete);
    }
  }
  function deleteRemainingChildren(returnFiber, currentFirstChild) {
    if (!shouldTrackSideEffects) return null;
    for (; null !== currentFirstChild; )
      deleteChild(returnFiber, currentFirstChild), currentFirstChild = currentFirstChild.sibling;
    return null;
  }
  function mapRemainingChildren(currentFirstChild) {
    for (var existingChildren = /* @__PURE__ */ new Map(); null !== currentFirstChild; )
      null !== currentFirstChild.key ? existingChildren.set(currentFirstChild.key, currentFirstChild) : existingChildren.set(currentFirstChild.index, currentFirstChild), currentFirstChild = currentFirstChild.sibling;
    return existingChildren;
  }
  function useFiber(fiber, pendingProps) {
    fiber = createWorkInProgress(fiber, pendingProps);
    fiber.index = 0;
    fiber.sibling = null;
    return fiber;
  }
  function placeChild(newFiber, lastPlacedIndex, newIndex) {
    newFiber.index = newIndex;
    if (!shouldTrackSideEffects)
      return newFiber.flags |= 1048576, lastPlacedIndex;
    newIndex = newFiber.alternate;
    if (null !== newIndex)
      return newIndex = newIndex.index, newIndex < lastPlacedIndex ? (newFiber.flags |= 67108866, lastPlacedIndex) : newIndex;
    newFiber.flags |= 67108866;
    return lastPlacedIndex;
  }
  function placeSingleChild(newFiber) {
    shouldTrackSideEffects && null === newFiber.alternate && (newFiber.flags |= 67108866);
    return newFiber;
  }
  function updateTextNode(returnFiber, current, textContent, lanes) {
    if (null === current || 6 !== current.tag)
      return current = createFiberFromText(textContent, returnFiber.mode, lanes), current.return = returnFiber, current;
    current = useFiber(current, textContent);
    current.return = returnFiber;
    return current;
  }
  function updateElement(returnFiber, current, element, lanes) {
    var elementType = element.type;
    if (elementType === REACT_FRAGMENT_TYPE)
      return updateFragment(
        returnFiber,
        current,
        element.props.children,
        lanes,
        element.key
      );
    if (null !== current && (current.elementType === elementType || "object" === typeof elementType && null !== elementType && elementType.$$typeof === REACT_LAZY_TYPE && resolveLazy(elementType) === current.type))
      return current = useFiber(current, element.props), coerceRef(current, element), current.return = returnFiber, current;
    current = createFiberFromTypeAndProps(
      element.type,
      element.key,
      element.props,
      null,
      returnFiber.mode,
      lanes
    );
    coerceRef(current, element);
    current.return = returnFiber;
    return current;
  }
  function updatePortal(returnFiber, current, portal, lanes) {
    if (null === current || 4 !== current.tag || current.stateNode.containerInfo !== portal.containerInfo || current.stateNode.implementation !== portal.implementation)
      return current = createFiberFromPortal(portal, returnFiber.mode, lanes), current.return = returnFiber, current;
    current = useFiber(current, portal.children || []);
    current.return = returnFiber;
    return current;
  }
  function updateFragment(returnFiber, current, fragment, lanes, key) {
    if (null === current || 7 !== current.tag)
      return current = createFiberFromFragment(
        fragment,
        returnFiber.mode,
        lanes,
        key
      ), current.return = returnFiber, current;
    current = useFiber(current, fragment);
    current.return = returnFiber;
    return current;
  }
  function createChild(returnFiber, newChild, lanes) {
    if ("string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild)
      return newChild = createFiberFromText(
        "" + newChild,
        returnFiber.mode,
        lanes
      ), newChild.return = returnFiber, newChild;
    if ("object" === typeof newChild && null !== newChild) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return lanes = createFiberFromTypeAndProps(
            newChild.type,
            newChild.key,
            newChild.props,
            null,
            returnFiber.mode,
            lanes
          ), coerceRef(lanes, newChild), lanes.return = returnFiber, lanes;
        case REACT_PORTAL_TYPE:
          return newChild = createFiberFromPortal(
            newChild,
            returnFiber.mode,
            lanes
          ), newChild.return = returnFiber, newChild;
        case REACT_LAZY_TYPE:
          return newChild = resolveLazy(newChild), createChild(returnFiber, newChild, lanes);
      }
      if (isArrayImpl(newChild) || getIteratorFn(newChild))
        return newChild = createFiberFromFragment(
          newChild,
          returnFiber.mode,
          lanes,
          null
        ), newChild.return = returnFiber, newChild;
      if ("function" === typeof newChild.then)
        return createChild(returnFiber, unwrapThenable(newChild), lanes);
      if (newChild.$$typeof === REACT_CONTEXT_TYPE)
        return createChild(
          returnFiber,
          readContextDuringReconciliation(returnFiber, newChild),
          lanes
        );
      throwOnInvalidObjectTypeImpl(returnFiber, newChild);
    }
    return null;
  }
  function updateSlot(returnFiber, oldFiber, newChild, lanes) {
    var key = null !== oldFiber ? oldFiber.key : null;
    if ("string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild)
      return null !== key ? null : updateTextNode(returnFiber, oldFiber, "" + newChild, lanes);
    if ("object" === typeof newChild && null !== newChild) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return newChild.key === key ? updateElement(returnFiber, oldFiber, newChild, lanes) : null;
        case REACT_PORTAL_TYPE:
          return newChild.key === key ? updatePortal(returnFiber, oldFiber, newChild, lanes) : null;
        case REACT_LAZY_TYPE:
          return newChild = resolveLazy(newChild), updateSlot(returnFiber, oldFiber, newChild, lanes);
      }
      if (isArrayImpl(newChild) || getIteratorFn(newChild))
        return null !== key ? null : updateFragment(returnFiber, oldFiber, newChild, lanes, null);
      if ("function" === typeof newChild.then)
        return updateSlot(
          returnFiber,
          oldFiber,
          unwrapThenable(newChild),
          lanes
        );
      if (newChild.$$typeof === REACT_CONTEXT_TYPE)
        return updateSlot(
          returnFiber,
          oldFiber,
          readContextDuringReconciliation(returnFiber, newChild),
          lanes
        );
      throwOnInvalidObjectTypeImpl(returnFiber, newChild);
    }
    return null;
  }
  function updateFromMap(existingChildren, returnFiber, newIdx, newChild, lanes) {
    if ("string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild)
      return existingChildren = existingChildren.get(newIdx) || null, updateTextNode(returnFiber, existingChildren, "" + newChild, lanes);
    if ("object" === typeof newChild && null !== newChild) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return existingChildren = existingChildren.get(
            null === newChild.key ? newIdx : newChild.key
          ) || null, updateElement(returnFiber, existingChildren, newChild, lanes);
        case REACT_PORTAL_TYPE:
          return existingChildren = existingChildren.get(
            null === newChild.key ? newIdx : newChild.key
          ) || null, updatePortal(returnFiber, existingChildren, newChild, lanes);
        case REACT_LAZY_TYPE:
          return newChild = resolveLazy(newChild), updateFromMap(
            existingChildren,
            returnFiber,
            newIdx,
            newChild,
            lanes
          );
      }
      if (isArrayImpl(newChild) || getIteratorFn(newChild))
        return existingChildren = existingChildren.get(newIdx) || null, updateFragment(returnFiber, existingChildren, newChild, lanes, null);
      if ("function" === typeof newChild.then)
        return updateFromMap(
          existingChildren,
          returnFiber,
          newIdx,
          unwrapThenable(newChild),
          lanes
        );
      if (newChild.$$typeof === REACT_CONTEXT_TYPE)
        return updateFromMap(
          existingChildren,
          returnFiber,
          newIdx,
          readContextDuringReconciliation(returnFiber, newChild),
          lanes
        );
      throwOnInvalidObjectTypeImpl(returnFiber, newChild);
    }
    return null;
  }
  function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, lanes) {
    for (var resultingFirstChild = null, previousNewFiber = null, oldFiber = currentFirstChild, newIdx = currentFirstChild = 0, nextOldFiber = null; null !== oldFiber && newIdx < newChildren.length; newIdx++) {
      oldFiber.index > newIdx ? (nextOldFiber = oldFiber, oldFiber = null) : nextOldFiber = oldFiber.sibling;
      var newFiber = updateSlot(
        returnFiber,
        oldFiber,
        newChildren[newIdx],
        lanes
      );
      if (null === newFiber) {
        null === oldFiber && (oldFiber = nextOldFiber);
        break;
      }
      shouldTrackSideEffects && oldFiber && null === newFiber.alternate && deleteChild(returnFiber, oldFiber);
      currentFirstChild = placeChild(newFiber, currentFirstChild, newIdx);
      null === previousNewFiber ? resultingFirstChild = newFiber : previousNewFiber.sibling = newFiber;
      previousNewFiber = newFiber;
      oldFiber = nextOldFiber;
    }
    if (newIdx === newChildren.length)
      return deleteRemainingChildren(returnFiber, oldFiber), isHydrating && pushTreeFork(returnFiber, newIdx), resultingFirstChild;
    if (null === oldFiber) {
      for (; newIdx < newChildren.length; newIdx++)
        oldFiber = createChild(returnFiber, newChildren[newIdx], lanes), null !== oldFiber && (currentFirstChild = placeChild(
          oldFiber,
          currentFirstChild,
          newIdx
        ), null === previousNewFiber ? resultingFirstChild = oldFiber : previousNewFiber.sibling = oldFiber, previousNewFiber = oldFiber);
      isHydrating && pushTreeFork(returnFiber, newIdx);
      return resultingFirstChild;
    }
    for (oldFiber = mapRemainingChildren(oldFiber); newIdx < newChildren.length; newIdx++)
      nextOldFiber = updateFromMap(
        oldFiber,
        returnFiber,
        newIdx,
        newChildren[newIdx],
        lanes
      ), null !== nextOldFiber && (shouldTrackSideEffects && null !== nextOldFiber.alternate && oldFiber.delete(
        null === nextOldFiber.key ? newIdx : nextOldFiber.key
      ), currentFirstChild = placeChild(
        nextOldFiber,
        currentFirstChild,
        newIdx
      ), null === previousNewFiber ? resultingFirstChild = nextOldFiber : previousNewFiber.sibling = nextOldFiber, previousNewFiber = nextOldFiber);
    shouldTrackSideEffects && oldFiber.forEach(function(child) {
      return deleteChild(returnFiber, child);
    });
    isHydrating && pushTreeFork(returnFiber, newIdx);
    return resultingFirstChild;
  }
  function reconcileChildrenIterator(returnFiber, currentFirstChild, newChildren, lanes) {
    if (null == newChildren) throw Error(formatProdErrorMessage(151));
    for (var resultingFirstChild = null, previousNewFiber = null, oldFiber = currentFirstChild, newIdx = currentFirstChild = 0, nextOldFiber = null, step = newChildren.next(); null !== oldFiber && !step.done; newIdx++, step = newChildren.next()) {
      oldFiber.index > newIdx ? (nextOldFiber = oldFiber, oldFiber = null) : nextOldFiber = oldFiber.sibling;
      var newFiber = updateSlot(returnFiber, oldFiber, step.value, lanes);
      if (null === newFiber) {
        null === oldFiber && (oldFiber = nextOldFiber);
        break;
      }
      shouldTrackSideEffects && oldFiber && null === newFiber.alternate && deleteChild(returnFiber, oldFiber);
      currentFirstChild = placeChild(newFiber, currentFirstChild, newIdx);
      null === previousNewFiber ? resultingFirstChild = newFiber : previousNewFiber.sibling = newFiber;
      previousNewFiber = newFiber;
      oldFiber = nextOldFiber;
    }
    if (step.done)
      return deleteRemainingChildren(returnFiber, oldFiber), isHydrating && pushTreeFork(returnFiber, newIdx), resultingFirstChild;
    if (null === oldFiber) {
      for (; !step.done; newIdx++, step = newChildren.next())
        step = createChild(returnFiber, step.value, lanes), null !== step && (currentFirstChild = placeChild(step, currentFirstChild, newIdx), null === previousNewFiber ? resultingFirstChild = step : previousNewFiber.sibling = step, previousNewFiber = step);
      isHydrating && pushTreeFork(returnFiber, newIdx);
      return resultingFirstChild;
    }
    for (oldFiber = mapRemainingChildren(oldFiber); !step.done; newIdx++, step = newChildren.next())
      step = updateFromMap(oldFiber, returnFiber, newIdx, step.value, lanes), null !== step && (shouldTrackSideEffects && null !== step.alternate && oldFiber.delete(null === step.key ? newIdx : step.key), currentFirstChild = placeChild(step, currentFirstChild, newIdx), null === previousNewFiber ? resultingFirstChild = step : previousNewFiber.sibling = step, previousNewFiber = step);
    shouldTrackSideEffects && oldFiber.forEach(function(child) {
      return deleteChild(returnFiber, child);
    });
    isHydrating && pushTreeFork(returnFiber, newIdx);
    return resultingFirstChild;
  }
  function reconcileChildFibersImpl(returnFiber, currentFirstChild, newChild, lanes) {
    "object" === typeof newChild && null !== newChild && newChild.type === REACT_FRAGMENT_TYPE && null === newChild.key && (newChild = newChild.props.children);
    if ("object" === typeof newChild && null !== newChild) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          a: {
            for (var key = newChild.key; null !== currentFirstChild; ) {
              if (currentFirstChild.key === key) {
                key = newChild.type;
                if (key === REACT_FRAGMENT_TYPE) {
                  if (7 === currentFirstChild.tag) {
                    deleteRemainingChildren(
                      returnFiber,
                      currentFirstChild.sibling
                    );
                    lanes = useFiber(
                      currentFirstChild,
                      newChild.props.children
                    );
                    lanes.return = returnFiber;
                    returnFiber = lanes;
                    break a;
                  }
                } else if (currentFirstChild.elementType === key || "object" === typeof key && null !== key && key.$$typeof === REACT_LAZY_TYPE && resolveLazy(key) === currentFirstChild.type) {
                  deleteRemainingChildren(
                    returnFiber,
                    currentFirstChild.sibling
                  );
                  lanes = useFiber(currentFirstChild, newChild.props);
                  coerceRef(lanes, newChild);
                  lanes.return = returnFiber;
                  returnFiber = lanes;
                  break a;
                }
                deleteRemainingChildren(returnFiber, currentFirstChild);
                break;
              } else deleteChild(returnFiber, currentFirstChild);
              currentFirstChild = currentFirstChild.sibling;
            }
            newChild.type === REACT_FRAGMENT_TYPE ? (lanes = createFiberFromFragment(
              newChild.props.children,
              returnFiber.mode,
              lanes,
              newChild.key
            ), lanes.return = returnFiber, returnFiber = lanes) : (lanes = createFiberFromTypeAndProps(
              newChild.type,
              newChild.key,
              newChild.props,
              null,
              returnFiber.mode,
              lanes
            ), coerceRef(lanes, newChild), lanes.return = returnFiber, returnFiber = lanes);
          }
          return placeSingleChild(returnFiber);
        case REACT_PORTAL_TYPE:
          a: {
            for (key = newChild.key; null !== currentFirstChild; ) {
              if (currentFirstChild.key === key)
                if (4 === currentFirstChild.tag && currentFirstChild.stateNode.containerInfo === newChild.containerInfo && currentFirstChild.stateNode.implementation === newChild.implementation) {
                  deleteRemainingChildren(
                    returnFiber,
                    currentFirstChild.sibling
                  );
                  lanes = useFiber(currentFirstChild, newChild.children || []);
                  lanes.return = returnFiber;
                  returnFiber = lanes;
                  break a;
                } else {
                  deleteRemainingChildren(returnFiber, currentFirstChild);
                  break;
                }
              else deleteChild(returnFiber, currentFirstChild);
              currentFirstChild = currentFirstChild.sibling;
            }
            lanes = createFiberFromPortal(newChild, returnFiber.mode, lanes);
            lanes.return = returnFiber;
            returnFiber = lanes;
          }
          return placeSingleChild(returnFiber);
        case REACT_LAZY_TYPE:
          return newChild = resolveLazy(newChild), reconcileChildFibersImpl(
            returnFiber,
            currentFirstChild,
            newChild,
            lanes
          );
      }
      if (isArrayImpl(newChild))
        return reconcileChildrenArray(
          returnFiber,
          currentFirstChild,
          newChild,
          lanes
        );
      if (getIteratorFn(newChild)) {
        key = getIteratorFn(newChild);
        if ("function" !== typeof key) throw Error(formatProdErrorMessage(150));
        newChild = key.call(newChild);
        return reconcileChildrenIterator(
          returnFiber,
          currentFirstChild,
          newChild,
          lanes
        );
      }
      if ("function" === typeof newChild.then)
        return reconcileChildFibersImpl(
          returnFiber,
          currentFirstChild,
          unwrapThenable(newChild),
          lanes
        );
      if (newChild.$$typeof === REACT_CONTEXT_TYPE)
        return reconcileChildFibersImpl(
          returnFiber,
          currentFirstChild,
          readContextDuringReconciliation(returnFiber, newChild),
          lanes
        );
      throwOnInvalidObjectTypeImpl(returnFiber, newChild);
    }
    return "string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild ? (newChild = "" + newChild, null !== currentFirstChild && 6 === currentFirstChild.tag ? (deleteRemainingChildren(returnFiber, currentFirstChild.sibling), lanes = useFiber(currentFirstChild, newChild), lanes.return = returnFiber, returnFiber = lanes) : (deleteRemainingChildren(returnFiber, currentFirstChild), lanes = createFiberFromText(newChild, returnFiber.mode, lanes), lanes.return = returnFiber, returnFiber = lanes), placeSingleChild(returnFiber)) : deleteRemainingChildren(returnFiber, currentFirstChild);
  }
  return function(returnFiber, currentFirstChild, newChild, lanes) {
    try {
      thenableIndexCounter$1 = 0;
      var firstChildFiber = reconcileChildFibersImpl(
        returnFiber,
        currentFirstChild,
        newChild,
        lanes
      );
      thenableState$1 = null;
      return firstChildFiber;
    } catch (x) {
      if (x === SuspenseException || x === SuspenseActionException) throw x;
      var fiber = createFiberImplClass(29, x, null, returnFiber.mode);
      fiber.lanes = lanes;
      fiber.return = returnFiber;
      return fiber;
    } finally {
    }
  };
}
var reconcileChildFibers = createChildReconciler(true), mountChildFibers = createChildReconciler(false), hasForceUpdate = false;
function initializeUpdateQueue(fiber) {
  fiber.updateQueue = {
    baseState: fiber.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: { pending: null, lanes: 0, hiddenCallbacks: null },
    callbacks: null
  };
}
function cloneUpdateQueue(current, workInProgress2) {
  current = current.updateQueue;
  workInProgress2.updateQueue === current && (workInProgress2.updateQueue = {
    baseState: current.baseState,
    firstBaseUpdate: current.firstBaseUpdate,
    lastBaseUpdate: current.lastBaseUpdate,
    shared: current.shared,
    callbacks: null
  });
}
function createUpdate(lane) {
  return { lane, tag: 0, payload: null, callback: null, next: null };
}
function enqueueUpdate(fiber, update, lane) {
  var updateQueue = fiber.updateQueue;
  if (null === updateQueue) return null;
  updateQueue = updateQueue.shared;
  if (0 !== (executionContext & 2)) {
    var pending = updateQueue.pending;
    null === pending ? update.next = update : (update.next = pending.next, pending.next = update);
    updateQueue.pending = update;
    update = getRootForUpdatedFiber(fiber);
    markUpdateLaneFromFiberToRoot(fiber, null, lane);
    return update;
  }
  enqueueUpdate$1(fiber, updateQueue, update, lane);
  return getRootForUpdatedFiber(fiber);
}
function entangleTransitions(root2, fiber, lane) {
  fiber = fiber.updateQueue;
  if (null !== fiber && (fiber = fiber.shared, 0 !== (lane & 4194048))) {
    var queueLanes = fiber.lanes;
    queueLanes &= root2.pendingLanes;
    lane |= queueLanes;
    fiber.lanes = lane;
    markRootEntangled(root2, lane);
  }
}
function enqueueCapturedUpdate(workInProgress2, capturedUpdate) {
  var queue = workInProgress2.updateQueue, current = workInProgress2.alternate;
  if (null !== current && (current = current.updateQueue, queue === current)) {
    var newFirst = null, newLast = null;
    queue = queue.firstBaseUpdate;
    if (null !== queue) {
      do {
        var clone = {
          lane: queue.lane,
          tag: queue.tag,
          payload: queue.payload,
          callback: null,
          next: null
        };
        null === newLast ? newFirst = newLast = clone : newLast = newLast.next = clone;
        queue = queue.next;
      } while (null !== queue);
      null === newLast ? newFirst = newLast = capturedUpdate : newLast = newLast.next = capturedUpdate;
    } else newFirst = newLast = capturedUpdate;
    queue = {
      baseState: current.baseState,
      firstBaseUpdate: newFirst,
      lastBaseUpdate: newLast,
      shared: current.shared,
      callbacks: current.callbacks
    };
    workInProgress2.updateQueue = queue;
    return;
  }
  workInProgress2 = queue.lastBaseUpdate;
  null === workInProgress2 ? queue.firstBaseUpdate = capturedUpdate : workInProgress2.next = capturedUpdate;
  queue.lastBaseUpdate = capturedUpdate;
}
var didReadFromEntangledAsyncAction = false;
function suspendIfUpdateReadFromEntangledAsyncAction() {
  if (didReadFromEntangledAsyncAction) {
    var entangledActionThenable = currentEntangledActionThenable;
    if (null !== entangledActionThenable) throw entangledActionThenable;
  }
}
function processUpdateQueue(workInProgress$jscomp$0, props, instance$jscomp$0, renderLanes2) {
  didReadFromEntangledAsyncAction = false;
  var queue = workInProgress$jscomp$0.updateQueue;
  hasForceUpdate = false;
  var firstBaseUpdate = queue.firstBaseUpdate, lastBaseUpdate = queue.lastBaseUpdate, pendingQueue = queue.shared.pending;
  if (null !== pendingQueue) {
    queue.shared.pending = null;
    var lastPendingUpdate = pendingQueue, firstPendingUpdate = lastPendingUpdate.next;
    lastPendingUpdate.next = null;
    null === lastBaseUpdate ? firstBaseUpdate = firstPendingUpdate : lastBaseUpdate.next = firstPendingUpdate;
    lastBaseUpdate = lastPendingUpdate;
    var current = workInProgress$jscomp$0.alternate;
    null !== current && (current = current.updateQueue, pendingQueue = current.lastBaseUpdate, pendingQueue !== lastBaseUpdate && (null === pendingQueue ? current.firstBaseUpdate = firstPendingUpdate : pendingQueue.next = firstPendingUpdate, current.lastBaseUpdate = lastPendingUpdate));
  }
  if (null !== firstBaseUpdate) {
    var newState = queue.baseState;
    lastBaseUpdate = 0;
    current = firstPendingUpdate = lastPendingUpdate = null;
    pendingQueue = firstBaseUpdate;
    do {
      var updateLane = pendingQueue.lane & -536870913, isHiddenUpdate = updateLane !== pendingQueue.lane;
      if (isHiddenUpdate ? (workInProgressRootRenderLanes & updateLane) === updateLane : (renderLanes2 & updateLane) === updateLane) {
        0 !== updateLane && updateLane === currentEntangledLane && (didReadFromEntangledAsyncAction = true);
        null !== current && (current = current.next = {
          lane: 0,
          tag: pendingQueue.tag,
          payload: pendingQueue.payload,
          callback: null,
          next: null
        });
        a: {
          var workInProgress2 = workInProgress$jscomp$0, update = pendingQueue;
          updateLane = props;
          var instance = instance$jscomp$0;
          switch (update.tag) {
            case 1:
              workInProgress2 = update.payload;
              if ("function" === typeof workInProgress2) {
                newState = workInProgress2.call(instance, newState, updateLane);
                break a;
              }
              newState = workInProgress2;
              break a;
            case 3:
              workInProgress2.flags = workInProgress2.flags & -65537 | 128;
            case 0:
              workInProgress2 = update.payload;
              updateLane = "function" === typeof workInProgress2 ? workInProgress2.call(instance, newState, updateLane) : workInProgress2;
              if (null === updateLane || void 0 === updateLane) break a;
              newState = assign({}, newState, updateLane);
              break a;
            case 2:
              hasForceUpdate = true;
          }
        }
        updateLane = pendingQueue.callback;
        null !== updateLane && (workInProgress$jscomp$0.flags |= 64, isHiddenUpdate && (workInProgress$jscomp$0.flags |= 8192), isHiddenUpdate = queue.callbacks, null === isHiddenUpdate ? queue.callbacks = [updateLane] : isHiddenUpdate.push(updateLane));
      } else
        isHiddenUpdate = {
          lane: updateLane,
          tag: pendingQueue.tag,
          payload: pendingQueue.payload,
          callback: pendingQueue.callback,
          next: null
        }, null === current ? (firstPendingUpdate = current = isHiddenUpdate, lastPendingUpdate = newState) : current = current.next = isHiddenUpdate, lastBaseUpdate |= updateLane;
      pendingQueue = pendingQueue.next;
      if (null === pendingQueue)
        if (pendingQueue = queue.shared.pending, null === pendingQueue)
          break;
        else
          isHiddenUpdate = pendingQueue, pendingQueue = isHiddenUpdate.next, isHiddenUpdate.next = null, queue.lastBaseUpdate = isHiddenUpdate, queue.shared.pending = null;
    } while (1);
    null === current && (lastPendingUpdate = newState);
    queue.baseState = lastPendingUpdate;
    queue.firstBaseUpdate = firstPendingUpdate;
    queue.lastBaseUpdate = current;
    null === firstBaseUpdate && (queue.shared.lanes = 0);
    workInProgressRootSkippedLanes |= lastBaseUpdate;
    workInProgress$jscomp$0.lanes = lastBaseUpdate;
    workInProgress$jscomp$0.memoizedState = newState;
  }
}
function callCallback(callback, context) {
  if ("function" !== typeof callback)
    throw Error(formatProdErrorMessage(191, callback));
  callback.call(context);
}
function commitCallbacks(updateQueue, context) {
  var callbacks = updateQueue.callbacks;
  if (null !== callbacks)
    for (updateQueue.callbacks = null, updateQueue = 0; updateQueue < callbacks.length; updateQueue++)
      callCallback(callbacks[updateQueue], context);
}
var currentTreeHiddenStackCursor = createCursor(null), prevEntangledRenderLanesCursor = createCursor(0);
function pushHiddenContext(fiber, context) {
  fiber = entangledRenderLanes;
  push(prevEntangledRenderLanesCursor, fiber);
  push(currentTreeHiddenStackCursor, context);
  entangledRenderLanes = fiber | context.baseLanes;
}
function reuseHiddenContextOnStack() {
  push(prevEntangledRenderLanesCursor, entangledRenderLanes);
  push(currentTreeHiddenStackCursor, currentTreeHiddenStackCursor.current);
}
function popHiddenContext() {
  entangledRenderLanes = prevEntangledRenderLanesCursor.current;
  pop(currentTreeHiddenStackCursor);
  pop(prevEntangledRenderLanesCursor);
}
var suspenseHandlerStackCursor = createCursor(null), shellBoundary = null;
function pushPrimaryTreeSuspenseHandler(handler) {
  var current = handler.alternate;
  push(suspenseStackCursor, suspenseStackCursor.current & 1);
  push(suspenseHandlerStackCursor, handler);
  null === shellBoundary && (null === current || null !== currentTreeHiddenStackCursor.current ? shellBoundary = handler : null !== current.memoizedState && (shellBoundary = handler));
}
function pushDehydratedActivitySuspenseHandler(fiber) {
  push(suspenseStackCursor, suspenseStackCursor.current);
  push(suspenseHandlerStackCursor, fiber);
  null === shellBoundary && (shellBoundary = fiber);
}
function pushOffscreenSuspenseHandler(fiber) {
  22 === fiber.tag ? (push(suspenseStackCursor, suspenseStackCursor.current), push(suspenseHandlerStackCursor, fiber), null === shellBoundary && (shellBoundary = fiber)) : reuseSuspenseHandlerOnStack();
}
function reuseSuspenseHandlerOnStack() {
  push(suspenseStackCursor, suspenseStackCursor.current);
  push(suspenseHandlerStackCursor, suspenseHandlerStackCursor.current);
}
function popSuspenseHandler(fiber) {
  pop(suspenseHandlerStackCursor);
  shellBoundary === fiber && (shellBoundary = null);
  pop(suspenseStackCursor);
}
var suspenseStackCursor = createCursor(0);
function findFirstSuspended(row) {
  for (var node = row; null !== node; ) {
    if (13 === node.tag) {
      var state = node.memoizedState;
      if (null !== state && (state = state.dehydrated, null === state || isSuspenseInstancePending(state) || isSuspenseInstanceFallback(state)))
        return node;
    } else if (19 === node.tag && ("forwards" === node.memoizedProps.revealOrder || "backwards" === node.memoizedProps.revealOrder || "unstable_legacy-backwards" === node.memoizedProps.revealOrder || "together" === node.memoizedProps.revealOrder)) {
      if (0 !== (node.flags & 128)) return node;
    } else if (null !== node.child) {
      node.child.return = node;
      node = node.child;
      continue;
    }
    if (node === row) break;
    for (; null === node.sibling; ) {
      if (null === node.return || node.return === row) return null;
      node = node.return;
    }
    node.sibling.return = node.return;
    node = node.sibling;
  }
  return null;
}
var renderLanes = 0, currentlyRenderingFiber = null, currentHook = null, workInProgressHook = null, didScheduleRenderPhaseUpdate = false, didScheduleRenderPhaseUpdateDuringThisPass = false, shouldDoubleInvokeUserFnsInHooksDEV = false, localIdCounter = 0, thenableIndexCounter = 0, thenableState = null, globalClientIdCounter = 0;
function throwInvalidHookError() {
  throw Error(formatProdErrorMessage(321));
}
function areHookInputsEqual(nextDeps, prevDeps) {
  if (null === prevDeps) return false;
  for (var i = 0; i < prevDeps.length && i < nextDeps.length; i++)
    if (!objectIs(nextDeps[i], prevDeps[i])) return false;
  return true;
}
function renderWithHooks(current, workInProgress2, Component2, props, secondArg, nextRenderLanes) {
  renderLanes = nextRenderLanes;
  currentlyRenderingFiber = workInProgress2;
  workInProgress2.memoizedState = null;
  workInProgress2.updateQueue = null;
  workInProgress2.lanes = 0;
  ReactSharedInternals.H = null === current || null === current.memoizedState ? HooksDispatcherOnMount : HooksDispatcherOnUpdate;
  shouldDoubleInvokeUserFnsInHooksDEV = false;
  nextRenderLanes = Component2(props, secondArg);
  shouldDoubleInvokeUserFnsInHooksDEV = false;
  didScheduleRenderPhaseUpdateDuringThisPass && (nextRenderLanes = renderWithHooksAgain(
    workInProgress2,
    Component2,
    props,
    secondArg
  ));
  finishRenderingHooks(current);
  return nextRenderLanes;
}
function finishRenderingHooks(current) {
  ReactSharedInternals.H = ContextOnlyDispatcher;
  var didRenderTooFewHooks = null !== currentHook && null !== currentHook.next;
  renderLanes = 0;
  workInProgressHook = currentHook = currentlyRenderingFiber = null;
  didScheduleRenderPhaseUpdate = false;
  thenableIndexCounter = 0;
  thenableState = null;
  if (didRenderTooFewHooks) throw Error(formatProdErrorMessage(300));
  null === current || didReceiveUpdate || (current = current.dependencies, null !== current && checkIfContextChanged(current) && (didReceiveUpdate = true));
}
function renderWithHooksAgain(workInProgress2, Component2, props, secondArg) {
  currentlyRenderingFiber = workInProgress2;
  var numberOfReRenders = 0;
  do {
    didScheduleRenderPhaseUpdateDuringThisPass && (thenableState = null);
    thenableIndexCounter = 0;
    didScheduleRenderPhaseUpdateDuringThisPass = false;
    if (25 <= numberOfReRenders) throw Error(formatProdErrorMessage(301));
    numberOfReRenders += 1;
    workInProgressHook = currentHook = null;
    if (null != workInProgress2.updateQueue) {
      var children = workInProgress2.updateQueue;
      children.lastEffect = null;
      children.events = null;
      children.stores = null;
      null != children.memoCache && (children.memoCache.index = 0);
    }
    ReactSharedInternals.H = HooksDispatcherOnRerender;
    children = Component2(props, secondArg);
  } while (didScheduleRenderPhaseUpdateDuringThisPass);
  return children;
}
function TransitionAwareHostComponent() {
  var dispatcher = ReactSharedInternals.H, maybeThenable = dispatcher.useState()[0];
  maybeThenable = "function" === typeof maybeThenable.then ? useThenable(maybeThenable) : maybeThenable;
  dispatcher = dispatcher.useState()[0];
  (null !== currentHook ? currentHook.memoizedState : null) !== dispatcher && (currentlyRenderingFiber.flags |= 1024);
  return maybeThenable;
}
function checkDidRenderIdHook() {
  var didRenderIdHook = 0 !== localIdCounter;
  localIdCounter = 0;
  return didRenderIdHook;
}
function bailoutHooks(current, workInProgress2, lanes) {
  workInProgress2.updateQueue = current.updateQueue;
  workInProgress2.flags &= -2053;
  current.lanes &= ~lanes;
}
function resetHooksOnUnwind(workInProgress2) {
  if (didScheduleRenderPhaseUpdate) {
    for (workInProgress2 = workInProgress2.memoizedState; null !== workInProgress2; ) {
      var queue = workInProgress2.queue;
      null !== queue && (queue.pending = null);
      workInProgress2 = workInProgress2.next;
    }
    didScheduleRenderPhaseUpdate = false;
  }
  renderLanes = 0;
  workInProgressHook = currentHook = currentlyRenderingFiber = null;
  didScheduleRenderPhaseUpdateDuringThisPass = false;
  thenableIndexCounter = localIdCounter = 0;
  thenableState = null;
}
function mountWorkInProgressHook() {
  var hook = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null
  };
  null === workInProgressHook ? currentlyRenderingFiber.memoizedState = workInProgressHook = hook : workInProgressHook = workInProgressHook.next = hook;
  return workInProgressHook;
}
function updateWorkInProgressHook() {
  if (null === currentHook) {
    var nextCurrentHook = currentlyRenderingFiber.alternate;
    nextCurrentHook = null !== nextCurrentHook ? nextCurrentHook.memoizedState : null;
  } else nextCurrentHook = currentHook.next;
  var nextWorkInProgressHook = null === workInProgressHook ? currentlyRenderingFiber.memoizedState : workInProgressHook.next;
  if (null !== nextWorkInProgressHook)
    workInProgressHook = nextWorkInProgressHook, currentHook = nextCurrentHook;
  else {
    if (null === nextCurrentHook) {
      if (null === currentlyRenderingFiber.alternate)
        throw Error(formatProdErrorMessage(467));
      throw Error(formatProdErrorMessage(310));
    }
    currentHook = nextCurrentHook;
    nextCurrentHook = {
      memoizedState: currentHook.memoizedState,
      baseState: currentHook.baseState,
      baseQueue: currentHook.baseQueue,
      queue: currentHook.queue,
      next: null
    };
    null === workInProgressHook ? currentlyRenderingFiber.memoizedState = workInProgressHook = nextCurrentHook : workInProgressHook = workInProgressHook.next = nextCurrentHook;
  }
  return workInProgressHook;
}
function createFunctionComponentUpdateQueue() {
  return { lastEffect: null, events: null, stores: null, memoCache: null };
}
function useThenable(thenable) {
  var index2 = thenableIndexCounter;
  thenableIndexCounter += 1;
  null === thenableState && (thenableState = []);
  thenable = trackUsedThenable(thenableState, thenable, index2);
  index2 = currentlyRenderingFiber;
  null === (null === workInProgressHook ? index2.memoizedState : workInProgressHook.next) && (index2 = index2.alternate, ReactSharedInternals.H = null === index2 || null === index2.memoizedState ? HooksDispatcherOnMount : HooksDispatcherOnUpdate);
  return thenable;
}
function use(usable) {
  if (null !== usable && "object" === typeof usable) {
    if ("function" === typeof usable.then) return useThenable(usable);
    if (usable.$$typeof === REACT_CONTEXT_TYPE) return readContext(usable);
  }
  throw Error(formatProdErrorMessage(438, String(usable)));
}
function useMemoCache(size) {
  var memoCache = null, updateQueue = currentlyRenderingFiber.updateQueue;
  null !== updateQueue && (memoCache = updateQueue.memoCache);
  if (null == memoCache) {
    var current = currentlyRenderingFiber.alternate;
    null !== current && (current = current.updateQueue, null !== current && (current = current.memoCache, null != current && (memoCache = {
      data: current.data.map(function(array) {
        return array.slice();
      }),
      index: 0
    })));
  }
  null == memoCache && (memoCache = { data: [], index: 0 });
  null === updateQueue && (updateQueue = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = updateQueue);
  updateQueue.memoCache = memoCache;
  updateQueue = memoCache.data[memoCache.index];
  if (void 0 === updateQueue)
    for (updateQueue = memoCache.data[memoCache.index] = Array(size), current = 0; current < size; current++)
      updateQueue[current] = REACT_MEMO_CACHE_SENTINEL;
  memoCache.index++;
  return updateQueue;
}
function basicStateReducer(state, action) {
  return "function" === typeof action ? action(state) : action;
}
function updateReducer(reducer) {
  var hook = updateWorkInProgressHook();
  return updateReducerImpl(hook, currentHook, reducer);
}
function updateReducerImpl(hook, current, reducer) {
  var queue = hook.queue;
  if (null === queue) throw Error(formatProdErrorMessage(311));
  queue.lastRenderedReducer = reducer;
  var baseQueue = hook.baseQueue, pendingQueue = queue.pending;
  if (null !== pendingQueue) {
    if (null !== baseQueue) {
      var baseFirst = baseQueue.next;
      baseQueue.next = pendingQueue.next;
      pendingQueue.next = baseFirst;
    }
    current.baseQueue = baseQueue = pendingQueue;
    queue.pending = null;
  }
  pendingQueue = hook.baseState;
  if (null === baseQueue) hook.memoizedState = pendingQueue;
  else {
    current = baseQueue.next;
    var newBaseQueueFirst = baseFirst = null, newBaseQueueLast = null, update = current, didReadFromEntangledAsyncAction$60 = false;
    do {
      var updateLane = update.lane & -536870913;
      if (updateLane !== update.lane ? (workInProgressRootRenderLanes & updateLane) === updateLane : (renderLanes & updateLane) === updateLane) {
        var revertLane = update.revertLane;
        if (0 === revertLane)
          null !== newBaseQueueLast && (newBaseQueueLast = newBaseQueueLast.next = {
            lane: 0,
            revertLane: 0,
            gesture: null,
            action: update.action,
            hasEagerState: update.hasEagerState,
            eagerState: update.eagerState,
            next: null
          }), updateLane === currentEntangledLane && (didReadFromEntangledAsyncAction$60 = true);
        else if ((renderLanes & revertLane) === revertLane) {
          update = update.next;
          revertLane === currentEntangledLane && (didReadFromEntangledAsyncAction$60 = true);
          continue;
        } else
          updateLane = {
            lane: 0,
            revertLane: update.revertLane,
            gesture: null,
            action: update.action,
            hasEagerState: update.hasEagerState,
            eagerState: update.eagerState,
            next: null
          }, null === newBaseQueueLast ? (newBaseQueueFirst = newBaseQueueLast = updateLane, baseFirst = pendingQueue) : newBaseQueueLast = newBaseQueueLast.next = updateLane, currentlyRenderingFiber.lanes |= revertLane, workInProgressRootSkippedLanes |= revertLane;
        updateLane = update.action;
        shouldDoubleInvokeUserFnsInHooksDEV && reducer(pendingQueue, updateLane);
        pendingQueue = update.hasEagerState ? update.eagerState : reducer(pendingQueue, updateLane);
      } else
        revertLane = {
          lane: updateLane,
          revertLane: update.revertLane,
          gesture: update.gesture,
          action: update.action,
          hasEagerState: update.hasEagerState,
          eagerState: update.eagerState,
          next: null
        }, null === newBaseQueueLast ? (newBaseQueueFirst = newBaseQueueLast = revertLane, baseFirst = pendingQueue) : newBaseQueueLast = newBaseQueueLast.next = revertLane, currentlyRenderingFiber.lanes |= updateLane, workInProgressRootSkippedLanes |= updateLane;
      update = update.next;
    } while (null !== update && update !== current);
    null === newBaseQueueLast ? baseFirst = pendingQueue : newBaseQueueLast.next = newBaseQueueFirst;
    if (!objectIs(pendingQueue, hook.memoizedState) && (didReceiveUpdate = true, didReadFromEntangledAsyncAction$60 && (reducer = currentEntangledActionThenable, null !== reducer)))
      throw reducer;
    hook.memoizedState = pendingQueue;
    hook.baseState = baseFirst;
    hook.baseQueue = newBaseQueueLast;
    queue.lastRenderedState = pendingQueue;
  }
  null === baseQueue && (queue.lanes = 0);
  return [hook.memoizedState, queue.dispatch];
}
function rerenderReducer(reducer) {
  var hook = updateWorkInProgressHook(), queue = hook.queue;
  if (null === queue) throw Error(formatProdErrorMessage(311));
  queue.lastRenderedReducer = reducer;
  var dispatch = queue.dispatch, lastRenderPhaseUpdate = queue.pending, newState = hook.memoizedState;
  if (null !== lastRenderPhaseUpdate) {
    queue.pending = null;
    var update = lastRenderPhaseUpdate = lastRenderPhaseUpdate.next;
    do
      newState = reducer(newState, update.action), update = update.next;
    while (update !== lastRenderPhaseUpdate);
    objectIs(newState, hook.memoizedState) || (didReceiveUpdate = true);
    hook.memoizedState = newState;
    null === hook.baseQueue && (hook.baseState = newState);
    queue.lastRenderedState = newState;
  }
  return [newState, dispatch];
}
function updateSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
  var fiber = currentlyRenderingFiber, hook = updateWorkInProgressHook(), isHydrating$jscomp$0 = isHydrating;
  if (isHydrating$jscomp$0) {
    if (void 0 === getServerSnapshot) throw Error(formatProdErrorMessage(407));
    getServerSnapshot = getServerSnapshot();
  } else getServerSnapshot = getSnapshot();
  var snapshotChanged = !objectIs(
    (currentHook || hook).memoizedState,
    getServerSnapshot
  );
  snapshotChanged && (hook.memoizedState = getServerSnapshot, didReceiveUpdate = true);
  hook = hook.queue;
  updateEffect(subscribeToStore.bind(null, fiber, hook, subscribe), [
    subscribe
  ]);
  if (hook.getSnapshot !== getSnapshot || snapshotChanged || null !== workInProgressHook && workInProgressHook.memoizedState.tag & 1) {
    fiber.flags |= 2048;
    pushSimpleEffect(
      9,
      { destroy: void 0 },
      updateStoreInstance.bind(
        null,
        fiber,
        hook,
        getServerSnapshot,
        getSnapshot
      ),
      null
    );
    if (null === workInProgressRoot) throw Error(formatProdErrorMessage(349));
    isHydrating$jscomp$0 || 0 !== (renderLanes & 127) || pushStoreConsistencyCheck(fiber, getSnapshot, getServerSnapshot);
  }
  return getServerSnapshot;
}
function pushStoreConsistencyCheck(fiber, getSnapshot, renderedSnapshot) {
  fiber.flags |= 16384;
  fiber = { getSnapshot, value: renderedSnapshot };
  getSnapshot = currentlyRenderingFiber.updateQueue;
  null === getSnapshot ? (getSnapshot = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = getSnapshot, getSnapshot.stores = [fiber]) : (renderedSnapshot = getSnapshot.stores, null === renderedSnapshot ? getSnapshot.stores = [fiber] : renderedSnapshot.push(fiber));
}
function updateStoreInstance(fiber, inst, nextSnapshot, getSnapshot) {
  inst.value = nextSnapshot;
  inst.getSnapshot = getSnapshot;
  checkIfSnapshotChanged(inst) && forceStoreRerender(fiber);
}
function subscribeToStore(fiber, inst, subscribe) {
  return subscribe(function() {
    checkIfSnapshotChanged(inst) && forceStoreRerender(fiber);
  });
}
function checkIfSnapshotChanged(inst) {
  var latestGetSnapshot = inst.getSnapshot;
  inst = inst.value;
  try {
    var nextValue = latestGetSnapshot();
    return !objectIs(inst, nextValue);
  } catch (error) {
    return true;
  }
}
function forceStoreRerender(fiber) {
  var root2 = enqueueConcurrentRenderForLane(fiber, 2);
  null !== root2 && scheduleUpdateOnFiber(root2, fiber, 2);
}
function mountStateImpl(initialState) {
  var hook = mountWorkInProgressHook();
  if ("function" === typeof initialState) {
    var initialStateInitializer = initialState;
    initialState = initialStateInitializer();
    if (shouldDoubleInvokeUserFnsInHooksDEV) {
      setIsStrictModeForDevtools(true);
      try {
        initialStateInitializer();
      } finally {
        setIsStrictModeForDevtools(false);
      }
    }
  }
  hook.memoizedState = hook.baseState = initialState;
  hook.queue = {
    pending: null,
    lanes: 0,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: initialState
  };
  return hook;
}
function updateOptimisticImpl(hook, current, passthrough, reducer) {
  hook.baseState = passthrough;
  return updateReducerImpl(
    hook,
    currentHook,
    "function" === typeof reducer ? reducer : basicStateReducer
  );
}
function dispatchActionState(fiber, actionQueue, setPendingState, setState, payload) {
  if (isRenderPhaseUpdate(fiber)) throw Error(formatProdErrorMessage(485));
  fiber = actionQueue.action;
  if (null !== fiber) {
    var actionNode = {
      payload,
      action: fiber,
      next: null,
      isTransition: true,
      status: "pending",
      value: null,
      reason: null,
      listeners: [],
      then: function(listener) {
        actionNode.listeners.push(listener);
      }
    };
    null !== ReactSharedInternals.T ? setPendingState(true) : actionNode.isTransition = false;
    setState(actionNode);
    setPendingState = actionQueue.pending;
    null === setPendingState ? (actionNode.next = actionQueue.pending = actionNode, runActionStateAction(actionQueue, actionNode)) : (actionNode.next = setPendingState.next, actionQueue.pending = setPendingState.next = actionNode);
  }
}
function runActionStateAction(actionQueue, node) {
  var action = node.action, payload = node.payload, prevState = actionQueue.state;
  if (node.isTransition) {
    var prevTransition = ReactSharedInternals.T, currentTransition = {};
    ReactSharedInternals.T = currentTransition;
    try {
      var returnValue = action(prevState, payload), onStartTransitionFinish = ReactSharedInternals.S;
      null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
      handleActionReturnValue(actionQueue, node, returnValue);
    } catch (error) {
      onActionError(actionQueue, node, error);
    } finally {
      null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
    }
  } else
    try {
      prevTransition = action(prevState, payload), handleActionReturnValue(actionQueue, node, prevTransition);
    } catch (error$66) {
      onActionError(actionQueue, node, error$66);
    }
}
function handleActionReturnValue(actionQueue, node, returnValue) {
  null !== returnValue && "object" === typeof returnValue && "function" === typeof returnValue.then ? returnValue.then(
    function(nextState) {
      onActionSuccess(actionQueue, node, nextState);
    },
    function(error) {
      return onActionError(actionQueue, node, error);
    }
  ) : onActionSuccess(actionQueue, node, returnValue);
}
function onActionSuccess(actionQueue, actionNode, nextState) {
  actionNode.status = "fulfilled";
  actionNode.value = nextState;
  notifyActionListeners(actionNode);
  actionQueue.state = nextState;
  actionNode = actionQueue.pending;
  null !== actionNode && (nextState = actionNode.next, nextState === actionNode ? actionQueue.pending = null : (nextState = nextState.next, actionNode.next = nextState, runActionStateAction(actionQueue, nextState)));
}
function onActionError(actionQueue, actionNode, error) {
  var last = actionQueue.pending;
  actionQueue.pending = null;
  if (null !== last) {
    last = last.next;
    do
      actionNode.status = "rejected", actionNode.reason = error, notifyActionListeners(actionNode), actionNode = actionNode.next;
    while (actionNode !== last);
  }
  actionQueue.action = null;
}
function notifyActionListeners(actionNode) {
  actionNode = actionNode.listeners;
  for (var i = 0; i < actionNode.length; i++) (0, actionNode[i])();
}
function actionStateReducer(oldState, newState) {
  return newState;
}
function mountActionState(action, initialStateProp) {
  if (isHydrating) {
    var ssrFormState = workInProgressRoot.formState;
    if (null !== ssrFormState) {
      a: {
        var JSCompiler_inline_result = currentlyRenderingFiber;
        if (isHydrating) {
          if (nextHydratableInstance) {
            b: {
              var JSCompiler_inline_result$jscomp$0 = nextHydratableInstance;
              for (var inRootOrSingleton = rootOrSingletonContext; 8 !== JSCompiler_inline_result$jscomp$0.nodeType; ) {
                if (!inRootOrSingleton) {
                  JSCompiler_inline_result$jscomp$0 = null;
                  break b;
                }
                JSCompiler_inline_result$jscomp$0 = getNextHydratable(
                  JSCompiler_inline_result$jscomp$0.nextSibling
                );
                if (null === JSCompiler_inline_result$jscomp$0) {
                  JSCompiler_inline_result$jscomp$0 = null;
                  break b;
                }
              }
              inRootOrSingleton = JSCompiler_inline_result$jscomp$0.data;
              JSCompiler_inline_result$jscomp$0 = "F!" === inRootOrSingleton || "F" === inRootOrSingleton ? JSCompiler_inline_result$jscomp$0 : null;
            }
            if (JSCompiler_inline_result$jscomp$0) {
              nextHydratableInstance = getNextHydratable(
                JSCompiler_inline_result$jscomp$0.nextSibling
              );
              JSCompiler_inline_result = "F!" === JSCompiler_inline_result$jscomp$0.data;
              break a;
            }
          }
          throwOnHydrationMismatch(JSCompiler_inline_result);
        }
        JSCompiler_inline_result = false;
      }
      JSCompiler_inline_result && (initialStateProp = ssrFormState[0]);
    }
  }
  ssrFormState = mountWorkInProgressHook();
  ssrFormState.memoizedState = ssrFormState.baseState = initialStateProp;
  JSCompiler_inline_result = {
    pending: null,
    lanes: 0,
    dispatch: null,
    lastRenderedReducer: actionStateReducer,
    lastRenderedState: initialStateProp
  };
  ssrFormState.queue = JSCompiler_inline_result;
  ssrFormState = dispatchSetState.bind(
    null,
    currentlyRenderingFiber,
    JSCompiler_inline_result
  );
  JSCompiler_inline_result.dispatch = ssrFormState;
  JSCompiler_inline_result = mountStateImpl(false);
  inRootOrSingleton = dispatchOptimisticSetState.bind(
    null,
    currentlyRenderingFiber,
    false,
    JSCompiler_inline_result.queue
  );
  JSCompiler_inline_result = mountWorkInProgressHook();
  JSCompiler_inline_result$jscomp$0 = {
    state: initialStateProp,
    dispatch: null,
    action,
    pending: null
  };
  JSCompiler_inline_result.queue = JSCompiler_inline_result$jscomp$0;
  ssrFormState = dispatchActionState.bind(
    null,
    currentlyRenderingFiber,
    JSCompiler_inline_result$jscomp$0,
    inRootOrSingleton,
    ssrFormState
  );
  JSCompiler_inline_result$jscomp$0.dispatch = ssrFormState;
  JSCompiler_inline_result.memoizedState = action;
  return [initialStateProp, ssrFormState, false];
}
function updateActionState(action) {
  var stateHook = updateWorkInProgressHook();
  return updateActionStateImpl(stateHook, currentHook, action);
}
function updateActionStateImpl(stateHook, currentStateHook, action) {
  currentStateHook = updateReducerImpl(
    stateHook,
    currentStateHook,
    actionStateReducer
  )[0];
  stateHook = updateReducer(basicStateReducer)[0];
  if ("object" === typeof currentStateHook && null !== currentStateHook && "function" === typeof currentStateHook.then)
    try {
      var state = useThenable(currentStateHook);
    } catch (x) {
      if (x === SuspenseException) throw SuspenseActionException;
      throw x;
    }
  else state = currentStateHook;
  currentStateHook = updateWorkInProgressHook();
  var actionQueue = currentStateHook.queue, dispatch = actionQueue.dispatch;
  action !== currentStateHook.memoizedState && (currentlyRenderingFiber.flags |= 2048, pushSimpleEffect(
    9,
    { destroy: void 0 },
    actionStateActionEffect.bind(null, actionQueue, action),
    null
  ));
  return [state, dispatch, stateHook];
}
function actionStateActionEffect(actionQueue, action) {
  actionQueue.action = action;
}
function rerenderActionState(action) {
  var stateHook = updateWorkInProgressHook(), currentStateHook = currentHook;
  if (null !== currentStateHook)
    return updateActionStateImpl(stateHook, currentStateHook, action);
  updateWorkInProgressHook();
  stateHook = stateHook.memoizedState;
  currentStateHook = updateWorkInProgressHook();
  var dispatch = currentStateHook.queue.dispatch;
  currentStateHook.memoizedState = action;
  return [stateHook, dispatch, false];
}
function pushSimpleEffect(tag, inst, create, deps) {
  tag = { tag, create, deps, inst, next: null };
  inst = currentlyRenderingFiber.updateQueue;
  null === inst && (inst = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = inst);
  create = inst.lastEffect;
  null === create ? inst.lastEffect = tag.next = tag : (deps = create.next, create.next = tag, tag.next = deps, inst.lastEffect = tag);
  return tag;
}
function updateRef() {
  return updateWorkInProgressHook().memoizedState;
}
function mountEffectImpl(fiberFlags, hookFlags, create, deps) {
  var hook = mountWorkInProgressHook();
  currentlyRenderingFiber.flags |= fiberFlags;
  hook.memoizedState = pushSimpleEffect(
    1 | hookFlags,
    { destroy: void 0 },
    create,
    void 0 === deps ? null : deps
  );
}
function updateEffectImpl(fiberFlags, hookFlags, create, deps) {
  var hook = updateWorkInProgressHook();
  deps = void 0 === deps ? null : deps;
  var inst = hook.memoizedState.inst;
  null !== currentHook && null !== deps && areHookInputsEqual(deps, currentHook.memoizedState.deps) ? hook.memoizedState = pushSimpleEffect(hookFlags, inst, create, deps) : (currentlyRenderingFiber.flags |= fiberFlags, hook.memoizedState = pushSimpleEffect(
    1 | hookFlags,
    inst,
    create,
    deps
  ));
}
function mountEffect(create, deps) {
  mountEffectImpl(8390656, 8, create, deps);
}
function updateEffect(create, deps) {
  updateEffectImpl(2048, 8, create, deps);
}
function useEffectEventImpl(payload) {
  currentlyRenderingFiber.flags |= 4;
  var componentUpdateQueue = currentlyRenderingFiber.updateQueue;
  if (null === componentUpdateQueue)
    componentUpdateQueue = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = componentUpdateQueue, componentUpdateQueue.events = [payload];
  else {
    var events = componentUpdateQueue.events;
    null === events ? componentUpdateQueue.events = [payload] : events.push(payload);
  }
}
function updateEvent(callback) {
  var ref = updateWorkInProgressHook().memoizedState;
  useEffectEventImpl({ ref, nextImpl: callback });
  return function() {
    if (0 !== (executionContext & 2)) throw Error(formatProdErrorMessage(440));
    return ref.impl.apply(void 0, arguments);
  };
}
function updateInsertionEffect(create, deps) {
  return updateEffectImpl(4, 2, create, deps);
}
function updateLayoutEffect(create, deps) {
  return updateEffectImpl(4, 4, create, deps);
}
function imperativeHandleEffect(create, ref) {
  if ("function" === typeof ref) {
    create = create();
    var refCleanup = ref(create);
    return function() {
      "function" === typeof refCleanup ? refCleanup() : ref(null);
    };
  }
  if (null !== ref && void 0 !== ref)
    return create = create(), ref.current = create, function() {
      ref.current = null;
    };
}
function updateImperativeHandle(ref, create, deps) {
  deps = null !== deps && void 0 !== deps ? deps.concat([ref]) : null;
  updateEffectImpl(4, 4, imperativeHandleEffect.bind(null, create, ref), deps);
}
function mountDebugValue() {
}
function updateCallback(callback, deps) {
  var hook = updateWorkInProgressHook();
  deps = void 0 === deps ? null : deps;
  var prevState = hook.memoizedState;
  if (null !== deps && areHookInputsEqual(deps, prevState[1]))
    return prevState[0];
  hook.memoizedState = [callback, deps];
  return callback;
}
function updateMemo(nextCreate, deps) {
  var hook = updateWorkInProgressHook();
  deps = void 0 === deps ? null : deps;
  var prevState = hook.memoizedState;
  if (null !== deps && areHookInputsEqual(deps, prevState[1]))
    return prevState[0];
  prevState = nextCreate();
  if (shouldDoubleInvokeUserFnsInHooksDEV) {
    setIsStrictModeForDevtools(true);
    try {
      nextCreate();
    } finally {
      setIsStrictModeForDevtools(false);
    }
  }
  hook.memoizedState = [prevState, deps];
  return prevState;
}
function mountDeferredValueImpl(hook, value, initialValue) {
  if (void 0 === initialValue || 0 !== (renderLanes & 1073741824) && 0 === (workInProgressRootRenderLanes & 261930))
    return hook.memoizedState = value;
  hook.memoizedState = initialValue;
  hook = requestDeferredLane();
  currentlyRenderingFiber.lanes |= hook;
  workInProgressRootSkippedLanes |= hook;
  return initialValue;
}
function updateDeferredValueImpl(hook, prevValue, value, initialValue) {
  if (objectIs(value, prevValue)) return value;
  if (null !== currentTreeHiddenStackCursor.current)
    return hook = mountDeferredValueImpl(hook, value, initialValue), objectIs(hook, prevValue) || (didReceiveUpdate = true), hook;
  if (0 === (renderLanes & 42) || 0 !== (renderLanes & 1073741824) && 0 === (workInProgressRootRenderLanes & 261930))
    return didReceiveUpdate = true, hook.memoizedState = value;
  hook = requestDeferredLane();
  currentlyRenderingFiber.lanes |= hook;
  workInProgressRootSkippedLanes |= hook;
  return prevValue;
}
function startTransition(fiber, queue, pendingState, finishedState, callback) {
  var previousPriority = ReactDOMSharedInternals.p;
  ReactDOMSharedInternals.p = 0 !== previousPriority && 8 > previousPriority ? previousPriority : 8;
  var prevTransition = ReactSharedInternals.T, currentTransition = {};
  ReactSharedInternals.T = currentTransition;
  dispatchOptimisticSetState(fiber, false, queue, pendingState);
  try {
    var returnValue = callback(), onStartTransitionFinish = ReactSharedInternals.S;
    null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
    if (null !== returnValue && "object" === typeof returnValue && "function" === typeof returnValue.then) {
      var thenableForFinishedState = chainThenableValue(
        returnValue,
        finishedState
      );
      dispatchSetStateInternal(
        fiber,
        queue,
        thenableForFinishedState,
        requestUpdateLane(fiber)
      );
    } else
      dispatchSetStateInternal(
        fiber,
        queue,
        finishedState,
        requestUpdateLane(fiber)
      );
  } catch (error) {
    dispatchSetStateInternal(
      fiber,
      queue,
      { then: function() {
      }, status: "rejected", reason: error },
      requestUpdateLane()
    );
  } finally {
    ReactDOMSharedInternals.p = previousPriority, null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
  }
}
function noop() {
}
function startHostTransition(formFiber, pendingState, action, formData) {
  if (5 !== formFiber.tag) throw Error(formatProdErrorMessage(476));
  var queue = ensureFormComponentIsStateful(formFiber).queue;
  startTransition(
    formFiber,
    queue,
    pendingState,
    sharedNotPendingObject,
    null === action ? noop : function() {
      requestFormReset$1(formFiber);
      return action(formData);
    }
  );
}
function ensureFormComponentIsStateful(formFiber) {
  var existingStateHook = formFiber.memoizedState;
  if (null !== existingStateHook) return existingStateHook;
  existingStateHook = {
    memoizedState: sharedNotPendingObject,
    baseState: sharedNotPendingObject,
    baseQueue: null,
    queue: {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: basicStateReducer,
      lastRenderedState: sharedNotPendingObject
    },
    next: null
  };
  var initialResetState = {};
  existingStateHook.next = {
    memoizedState: initialResetState,
    baseState: initialResetState,
    baseQueue: null,
    queue: {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: basicStateReducer,
      lastRenderedState: initialResetState
    },
    next: null
  };
  formFiber.memoizedState = existingStateHook;
  formFiber = formFiber.alternate;
  null !== formFiber && (formFiber.memoizedState = existingStateHook);
  return existingStateHook;
}
function requestFormReset$1(formFiber) {
  var stateHook = ensureFormComponentIsStateful(formFiber);
  null === stateHook.next && (stateHook = formFiber.alternate.memoizedState);
  dispatchSetStateInternal(
    formFiber,
    stateHook.next.queue,
    {},
    requestUpdateLane()
  );
}
function useHostTransitionStatus() {
  return readContext(HostTransitionContext);
}
function updateId() {
  return updateWorkInProgressHook().memoizedState;
}
function updateRefresh() {
  return updateWorkInProgressHook().memoizedState;
}
function refreshCache(fiber) {
  for (var provider = fiber.return; null !== provider; ) {
    switch (provider.tag) {
      case 24:
      case 3:
        var lane = requestUpdateLane();
        fiber = createUpdate(lane);
        var root$69 = enqueueUpdate(provider, fiber, lane);
        null !== root$69 && (scheduleUpdateOnFiber(root$69, provider, lane), entangleTransitions(root$69, provider, lane));
        provider = { cache: createCache() };
        fiber.payload = provider;
        return;
    }
    provider = provider.return;
  }
}
function dispatchReducerAction(fiber, queue, action) {
  var lane = requestUpdateLane();
  action = {
    lane,
    revertLane: 0,
    gesture: null,
    action,
    hasEagerState: false,
    eagerState: null,
    next: null
  };
  isRenderPhaseUpdate(fiber) ? enqueueRenderPhaseUpdate(queue, action) : (action = enqueueConcurrentHookUpdate(fiber, queue, action, lane), null !== action && (scheduleUpdateOnFiber(action, fiber, lane), entangleTransitionUpdate(action, queue, lane)));
}
function dispatchSetState(fiber, queue, action) {
  var lane = requestUpdateLane();
  dispatchSetStateInternal(fiber, queue, action, lane);
}
function dispatchSetStateInternal(fiber, queue, action, lane) {
  var update = {
    lane,
    revertLane: 0,
    gesture: null,
    action,
    hasEagerState: false,
    eagerState: null,
    next: null
  };
  if (isRenderPhaseUpdate(fiber)) enqueueRenderPhaseUpdate(queue, update);
  else {
    var alternate = fiber.alternate;
    if (0 === fiber.lanes && (null === alternate || 0 === alternate.lanes) && (alternate = queue.lastRenderedReducer, null !== alternate))
      try {
        var currentState = queue.lastRenderedState, eagerState = alternate(currentState, action);
        update.hasEagerState = true;
        update.eagerState = eagerState;
        if (objectIs(eagerState, currentState))
          return enqueueUpdate$1(fiber, queue, update, 0), null === workInProgressRoot && finishQueueingConcurrentUpdates(), false;
      } catch (error) {
      } finally {
      }
    action = enqueueConcurrentHookUpdate(fiber, queue, update, lane);
    if (null !== action)
      return scheduleUpdateOnFiber(action, fiber, lane), entangleTransitionUpdate(action, queue, lane), true;
  }
  return false;
}
function dispatchOptimisticSetState(fiber, throwIfDuringRender, queue, action) {
  action = {
    lane: 2,
    revertLane: requestTransitionLane(),
    gesture: null,
    action,
    hasEagerState: false,
    eagerState: null,
    next: null
  };
  if (isRenderPhaseUpdate(fiber)) {
    if (throwIfDuringRender) throw Error(formatProdErrorMessage(479));
  } else
    throwIfDuringRender = enqueueConcurrentHookUpdate(
      fiber,
      queue,
      action,
      2
    ), null !== throwIfDuringRender && scheduleUpdateOnFiber(throwIfDuringRender, fiber, 2);
}
function isRenderPhaseUpdate(fiber) {
  var alternate = fiber.alternate;
  return fiber === currentlyRenderingFiber || null !== alternate && alternate === currentlyRenderingFiber;
}
function enqueueRenderPhaseUpdate(queue, update) {
  didScheduleRenderPhaseUpdateDuringThisPass = didScheduleRenderPhaseUpdate = true;
  var pending = queue.pending;
  null === pending ? update.next = update : (update.next = pending.next, pending.next = update);
  queue.pending = update;
}
function entangleTransitionUpdate(root2, queue, lane) {
  if (0 !== (lane & 4194048)) {
    var queueLanes = queue.lanes;
    queueLanes &= root2.pendingLanes;
    lane |= queueLanes;
    queue.lanes = lane;
    markRootEntangled(root2, lane);
  }
}
var ContextOnlyDispatcher = {
  readContext,
  use,
  useCallback: throwInvalidHookError,
  useContext: throwInvalidHookError,
  useEffect: throwInvalidHookError,
  useImperativeHandle: throwInvalidHookError,
  useLayoutEffect: throwInvalidHookError,
  useInsertionEffect: throwInvalidHookError,
  useMemo: throwInvalidHookError,
  useReducer: throwInvalidHookError,
  useRef: throwInvalidHookError,
  useState: throwInvalidHookError,
  useDebugValue: throwInvalidHookError,
  useDeferredValue: throwInvalidHookError,
  useTransition: throwInvalidHookError,
  useSyncExternalStore: throwInvalidHookError,
  useId: throwInvalidHookError,
  useHostTransitionStatus: throwInvalidHookError,
  useFormState: throwInvalidHookError,
  useActionState: throwInvalidHookError,
  useOptimistic: throwInvalidHookError,
  useMemoCache: throwInvalidHookError,
  useCacheRefresh: throwInvalidHookError
};
ContextOnlyDispatcher.useEffectEvent = throwInvalidHookError;
var HooksDispatcherOnMount = {
  readContext,
  use,
  useCallback: function(callback, deps) {
    mountWorkInProgressHook().memoizedState = [
      callback,
      void 0 === deps ? null : deps
    ];
    return callback;
  },
  useContext: readContext,
  useEffect: mountEffect,
  useImperativeHandle: function(ref, create, deps) {
    deps = null !== deps && void 0 !== deps ? deps.concat([ref]) : null;
    mountEffectImpl(
      4194308,
      4,
      imperativeHandleEffect.bind(null, create, ref),
      deps
    );
  },
  useLayoutEffect: function(create, deps) {
    return mountEffectImpl(4194308, 4, create, deps);
  },
  useInsertionEffect: function(create, deps) {
    mountEffectImpl(4, 2, create, deps);
  },
  useMemo: function(nextCreate, deps) {
    var hook = mountWorkInProgressHook();
    deps = void 0 === deps ? null : deps;
    var nextValue = nextCreate();
    if (shouldDoubleInvokeUserFnsInHooksDEV) {
      setIsStrictModeForDevtools(true);
      try {
        nextCreate();
      } finally {
        setIsStrictModeForDevtools(false);
      }
    }
    hook.memoizedState = [nextValue, deps];
    return nextValue;
  },
  useReducer: function(reducer, initialArg, init) {
    var hook = mountWorkInProgressHook();
    if (void 0 !== init) {
      var initialState = init(initialArg);
      if (shouldDoubleInvokeUserFnsInHooksDEV) {
        setIsStrictModeForDevtools(true);
        try {
          init(initialArg);
        } finally {
          setIsStrictModeForDevtools(false);
        }
      }
    } else initialState = initialArg;
    hook.memoizedState = hook.baseState = initialState;
    reducer = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: reducer,
      lastRenderedState: initialState
    };
    hook.queue = reducer;
    reducer = reducer.dispatch = dispatchReducerAction.bind(
      null,
      currentlyRenderingFiber,
      reducer
    );
    return [hook.memoizedState, reducer];
  },
  useRef: function(initialValue) {
    var hook = mountWorkInProgressHook();
    initialValue = { current: initialValue };
    return hook.memoizedState = initialValue;
  },
  useState: function(initialState) {
    initialState = mountStateImpl(initialState);
    var queue = initialState.queue, dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue);
    queue.dispatch = dispatch;
    return [initialState.memoizedState, dispatch];
  },
  useDebugValue: mountDebugValue,
  useDeferredValue: function(value, initialValue) {
    var hook = mountWorkInProgressHook();
    return mountDeferredValueImpl(hook, value, initialValue);
  },
  useTransition: function() {
    var stateHook = mountStateImpl(false);
    stateHook = startTransition.bind(
      null,
      currentlyRenderingFiber,
      stateHook.queue,
      true,
      false
    );
    mountWorkInProgressHook().memoizedState = stateHook;
    return [false, stateHook];
  },
  useSyncExternalStore: function(subscribe, getSnapshot, getServerSnapshot) {
    var fiber = currentlyRenderingFiber, hook = mountWorkInProgressHook();
    if (isHydrating) {
      if (void 0 === getServerSnapshot)
        throw Error(formatProdErrorMessage(407));
      getServerSnapshot = getServerSnapshot();
    } else {
      getServerSnapshot = getSnapshot();
      if (null === workInProgressRoot)
        throw Error(formatProdErrorMessage(349));
      0 !== (workInProgressRootRenderLanes & 127) || pushStoreConsistencyCheck(fiber, getSnapshot, getServerSnapshot);
    }
    hook.memoizedState = getServerSnapshot;
    var inst = { value: getServerSnapshot, getSnapshot };
    hook.queue = inst;
    mountEffect(subscribeToStore.bind(null, fiber, inst, subscribe), [
      subscribe
    ]);
    fiber.flags |= 2048;
    pushSimpleEffect(
      9,
      { destroy: void 0 },
      updateStoreInstance.bind(
        null,
        fiber,
        inst,
        getServerSnapshot,
        getSnapshot
      ),
      null
    );
    return getServerSnapshot;
  },
  useId: function() {
    var hook = mountWorkInProgressHook(), identifierPrefix = workInProgressRoot.identifierPrefix;
    if (isHydrating) {
      var JSCompiler_inline_result = treeContextOverflow;
      var idWithLeadingBit = treeContextId;
      JSCompiler_inline_result = (idWithLeadingBit & ~(1 << 32 - clz32(idWithLeadingBit) - 1)).toString(32) + JSCompiler_inline_result;
      identifierPrefix = "_" + identifierPrefix + "R_" + JSCompiler_inline_result;
      JSCompiler_inline_result = localIdCounter++;
      0 < JSCompiler_inline_result && (identifierPrefix += "H" + JSCompiler_inline_result.toString(32));
      identifierPrefix += "_";
    } else
      JSCompiler_inline_result = globalClientIdCounter++, identifierPrefix = "_" + identifierPrefix + "r_" + JSCompiler_inline_result.toString(32) + "_";
    return hook.memoizedState = identifierPrefix;
  },
  useHostTransitionStatus,
  useFormState: mountActionState,
  useActionState: mountActionState,
  useOptimistic: function(passthrough) {
    var hook = mountWorkInProgressHook();
    hook.memoizedState = hook.baseState = passthrough;
    var queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: null,
      lastRenderedState: null
    };
    hook.queue = queue;
    hook = dispatchOptimisticSetState.bind(
      null,
      currentlyRenderingFiber,
      true,
      queue
    );
    queue.dispatch = hook;
    return [passthrough, hook];
  },
  useMemoCache,
  useCacheRefresh: function() {
    return mountWorkInProgressHook().memoizedState = refreshCache.bind(
      null,
      currentlyRenderingFiber
    );
  },
  useEffectEvent: function(callback) {
    var hook = mountWorkInProgressHook(), ref = { impl: callback };
    hook.memoizedState = ref;
    return function() {
      if (0 !== (executionContext & 2))
        throw Error(formatProdErrorMessage(440));
      return ref.impl.apply(void 0, arguments);
    };
  }
}, HooksDispatcherOnUpdate = {
  readContext,
  use,
  useCallback: updateCallback,
  useContext: readContext,
  useEffect: updateEffect,
  useImperativeHandle: updateImperativeHandle,
  useInsertionEffect: updateInsertionEffect,
  useLayoutEffect: updateLayoutEffect,
  useMemo: updateMemo,
  useReducer: updateReducer,
  useRef: updateRef,
  useState: function() {
    return updateReducer(basicStateReducer);
  },
  useDebugValue: mountDebugValue,
  useDeferredValue: function(value, initialValue) {
    var hook = updateWorkInProgressHook();
    return updateDeferredValueImpl(
      hook,
      currentHook.memoizedState,
      value,
      initialValue
    );
  },
  useTransition: function() {
    var booleanOrThenable = updateReducer(basicStateReducer)[0], start = updateWorkInProgressHook().memoizedState;
    return [
      "boolean" === typeof booleanOrThenable ? booleanOrThenable : useThenable(booleanOrThenable),
      start
    ];
  },
  useSyncExternalStore: updateSyncExternalStore,
  useId: updateId,
  useHostTransitionStatus,
  useFormState: updateActionState,
  useActionState: updateActionState,
  useOptimistic: function(passthrough, reducer) {
    var hook = updateWorkInProgressHook();
    return updateOptimisticImpl(hook, currentHook, passthrough, reducer);
  },
  useMemoCache,
  useCacheRefresh: updateRefresh
};
HooksDispatcherOnUpdate.useEffectEvent = updateEvent;
var HooksDispatcherOnRerender = {
  readContext,
  use,
  useCallback: updateCallback,
  useContext: readContext,
  useEffect: updateEffect,
  useImperativeHandle: updateImperativeHandle,
  useInsertionEffect: updateInsertionEffect,
  useLayoutEffect: updateLayoutEffect,
  useMemo: updateMemo,
  useReducer: rerenderReducer,
  useRef: updateRef,
  useState: function() {
    return rerenderReducer(basicStateReducer);
  },
  useDebugValue: mountDebugValue,
  useDeferredValue: function(value, initialValue) {
    var hook = updateWorkInProgressHook();
    return null === currentHook ? mountDeferredValueImpl(hook, value, initialValue) : updateDeferredValueImpl(
      hook,
      currentHook.memoizedState,
      value,
      initialValue
    );
  },
  useTransition: function() {
    var booleanOrThenable = rerenderReducer(basicStateReducer)[0], start = updateWorkInProgressHook().memoizedState;
    return [
      "boolean" === typeof booleanOrThenable ? booleanOrThenable : useThenable(booleanOrThenable),
      start
    ];
  },
  useSyncExternalStore: updateSyncExternalStore,
  useId: updateId,
  useHostTransitionStatus,
  useFormState: rerenderActionState,
  useActionState: rerenderActionState,
  useOptimistic: function(passthrough, reducer) {
    var hook = updateWorkInProgressHook();
    if (null !== currentHook)
      return updateOptimisticImpl(hook, currentHook, passthrough, reducer);
    hook.baseState = passthrough;
    return [passthrough, hook.queue.dispatch];
  },
  useMemoCache,
  useCacheRefresh: updateRefresh
};
HooksDispatcherOnRerender.useEffectEvent = updateEvent;
function applyDerivedStateFromProps(workInProgress2, ctor, getDerivedStateFromProps, nextProps) {
  ctor = workInProgress2.memoizedState;
  getDerivedStateFromProps = getDerivedStateFromProps(nextProps, ctor);
  getDerivedStateFromProps = null === getDerivedStateFromProps || void 0 === getDerivedStateFromProps ? ctor : assign({}, ctor, getDerivedStateFromProps);
  workInProgress2.memoizedState = getDerivedStateFromProps;
  0 === workInProgress2.lanes && (workInProgress2.updateQueue.baseState = getDerivedStateFromProps);
}
var classComponentUpdater = {
  enqueueSetState: function(inst, payload, callback) {
    inst = inst._reactInternals;
    var lane = requestUpdateLane(), update = createUpdate(lane);
    update.payload = payload;
    void 0 !== callback && null !== callback && (update.callback = callback);
    payload = enqueueUpdate(inst, update, lane);
    null !== payload && (scheduleUpdateOnFiber(payload, inst, lane), entangleTransitions(payload, inst, lane));
  },
  enqueueReplaceState: function(inst, payload, callback) {
    inst = inst._reactInternals;
    var lane = requestUpdateLane(), update = createUpdate(lane);
    update.tag = 1;
    update.payload = payload;
    void 0 !== callback && null !== callback && (update.callback = callback);
    payload = enqueueUpdate(inst, update, lane);
    null !== payload && (scheduleUpdateOnFiber(payload, inst, lane), entangleTransitions(payload, inst, lane));
  },
  enqueueForceUpdate: function(inst, callback) {
    inst = inst._reactInternals;
    var lane = requestUpdateLane(), update = createUpdate(lane);
    update.tag = 2;
    void 0 !== callback && null !== callback && (update.callback = callback);
    callback = enqueueUpdate(inst, update, lane);
    null !== callback && (scheduleUpdateOnFiber(callback, inst, lane), entangleTransitions(callback, inst, lane));
  }
};
function checkShouldComponentUpdate(workInProgress2, ctor, oldProps, newProps, oldState, newState, nextContext) {
  workInProgress2 = workInProgress2.stateNode;
  return "function" === typeof workInProgress2.shouldComponentUpdate ? workInProgress2.shouldComponentUpdate(newProps, newState, nextContext) : ctor.prototype && ctor.prototype.isPureReactComponent ? !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState) : true;
}
function callComponentWillReceiveProps(workInProgress2, instance, newProps, nextContext) {
  workInProgress2 = instance.state;
  "function" === typeof instance.componentWillReceiveProps && instance.componentWillReceiveProps(newProps, nextContext);
  "function" === typeof instance.UNSAFE_componentWillReceiveProps && instance.UNSAFE_componentWillReceiveProps(newProps, nextContext);
  instance.state !== workInProgress2 && classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
}
function resolveClassComponentProps(Component2, baseProps) {
  var newProps = baseProps;
  if ("ref" in baseProps) {
    newProps = {};
    for (var propName in baseProps)
      "ref" !== propName && (newProps[propName] = baseProps[propName]);
  }
  if (Component2 = Component2.defaultProps) {
    newProps === baseProps && (newProps = assign({}, newProps));
    for (var propName$73 in Component2)
      void 0 === newProps[propName$73] && (newProps[propName$73] = Component2[propName$73]);
  }
  return newProps;
}
function defaultOnUncaughtError(error) {
  reportGlobalError(error);
}
function defaultOnCaughtError(error) {
  console.error(error);
}
function defaultOnRecoverableError(error) {
  reportGlobalError(error);
}
function logUncaughtError(root2, errorInfo) {
  try {
    var onUncaughtError = root2.onUncaughtError;
    onUncaughtError(errorInfo.value, { componentStack: errorInfo.stack });
  } catch (e$74) {
    setTimeout(function() {
      throw e$74;
    });
  }
}
function logCaughtError(root2, boundary, errorInfo) {
  try {
    var onCaughtError = root2.onCaughtError;
    onCaughtError(errorInfo.value, {
      componentStack: errorInfo.stack,
      errorBoundary: 1 === boundary.tag ? boundary.stateNode : null
    });
  } catch (e$75) {
    setTimeout(function() {
      throw e$75;
    });
  }
}
function createRootErrorUpdate(root2, errorInfo, lane) {
  lane = createUpdate(lane);
  lane.tag = 3;
  lane.payload = { element: null };
  lane.callback = function() {
    logUncaughtError(root2, errorInfo);
  };
  return lane;
}
function createClassErrorUpdate(lane) {
  lane = createUpdate(lane);
  lane.tag = 3;
  return lane;
}
function initializeClassErrorUpdate(update, root2, fiber, errorInfo) {
  var getDerivedStateFromError = fiber.type.getDerivedStateFromError;
  if ("function" === typeof getDerivedStateFromError) {
    var error = errorInfo.value;
    update.payload = function() {
      return getDerivedStateFromError(error);
    };
    update.callback = function() {
      logCaughtError(root2, fiber, errorInfo);
    };
  }
  var inst = fiber.stateNode;
  null !== inst && "function" === typeof inst.componentDidCatch && (update.callback = function() {
    logCaughtError(root2, fiber, errorInfo);
    "function" !== typeof getDerivedStateFromError && (null === legacyErrorBoundariesThatAlreadyFailed ? legacyErrorBoundariesThatAlreadyFailed = /* @__PURE__ */ new Set([this]) : legacyErrorBoundariesThatAlreadyFailed.add(this));
    var stack = errorInfo.stack;
    this.componentDidCatch(errorInfo.value, {
      componentStack: null !== stack ? stack : ""
    });
  });
}
function throwException(root2, returnFiber, sourceFiber, value, rootRenderLanes) {
  sourceFiber.flags |= 32768;
  if (null !== value && "object" === typeof value && "function" === typeof value.then) {
    returnFiber = sourceFiber.alternate;
    null !== returnFiber && propagateParentContextChanges(
      returnFiber,
      sourceFiber,
      rootRenderLanes,
      true
    );
    sourceFiber = suspenseHandlerStackCursor.current;
    if (null !== sourceFiber) {
      switch (sourceFiber.tag) {
        case 31:
        case 13:
          return null === shellBoundary ? renderDidSuspendDelayIfPossible() : null === sourceFiber.alternate && 0 === workInProgressRootExitStatus && (workInProgressRootExitStatus = 3), sourceFiber.flags &= -257, sourceFiber.flags |= 65536, sourceFiber.lanes = rootRenderLanes, value === noopSuspenseyCommitThenable ? sourceFiber.flags |= 16384 : (returnFiber = sourceFiber.updateQueue, null === returnFiber ? sourceFiber.updateQueue = /* @__PURE__ */ new Set([value]) : returnFiber.add(value), attachPingListener(root2, value, rootRenderLanes)), false;
        case 22:
          return sourceFiber.flags |= 65536, value === noopSuspenseyCommitThenable ? sourceFiber.flags |= 16384 : (returnFiber = sourceFiber.updateQueue, null === returnFiber ? (returnFiber = {
            transitions: null,
            markerInstances: null,
            retryQueue: /* @__PURE__ */ new Set([value])
          }, sourceFiber.updateQueue = returnFiber) : (sourceFiber = returnFiber.retryQueue, null === sourceFiber ? returnFiber.retryQueue = /* @__PURE__ */ new Set([value]) : sourceFiber.add(value)), attachPingListener(root2, value, rootRenderLanes)), false;
      }
      throw Error(formatProdErrorMessage(435, sourceFiber.tag));
    }
    attachPingListener(root2, value, rootRenderLanes);
    renderDidSuspendDelayIfPossible();
    return false;
  }
  if (isHydrating)
    return returnFiber = suspenseHandlerStackCursor.current, null !== returnFiber ? (0 === (returnFiber.flags & 65536) && (returnFiber.flags |= 256), returnFiber.flags |= 65536, returnFiber.lanes = rootRenderLanes, value !== HydrationMismatchException && (root2 = Error(formatProdErrorMessage(422), { cause: value }), queueHydrationError(createCapturedValueAtFiber(root2, sourceFiber)))) : (value !== HydrationMismatchException && (returnFiber = Error(formatProdErrorMessage(423), {
      cause: value
    }), queueHydrationError(
      createCapturedValueAtFiber(returnFiber, sourceFiber)
    )), root2 = root2.current.alternate, root2.flags |= 65536, rootRenderLanes &= -rootRenderLanes, root2.lanes |= rootRenderLanes, value = createCapturedValueAtFiber(value, sourceFiber), rootRenderLanes = createRootErrorUpdate(
      root2.stateNode,
      value,
      rootRenderLanes
    ), enqueueCapturedUpdate(root2, rootRenderLanes), 4 !== workInProgressRootExitStatus && (workInProgressRootExitStatus = 2)), false;
  var wrapperError = Error(formatProdErrorMessage(520), { cause: value });
  wrapperError = createCapturedValueAtFiber(wrapperError, sourceFiber);
  null === workInProgressRootConcurrentErrors ? workInProgressRootConcurrentErrors = [wrapperError] : workInProgressRootConcurrentErrors.push(wrapperError);
  4 !== workInProgressRootExitStatus && (workInProgressRootExitStatus = 2);
  if (null === returnFiber) return true;
  value = createCapturedValueAtFiber(value, sourceFiber);
  sourceFiber = returnFiber;
  do {
    switch (sourceFiber.tag) {
      case 3:
        return sourceFiber.flags |= 65536, root2 = rootRenderLanes & -rootRenderLanes, sourceFiber.lanes |= root2, root2 = createRootErrorUpdate(sourceFiber.stateNode, value, root2), enqueueCapturedUpdate(sourceFiber, root2), false;
      case 1:
        if (returnFiber = sourceFiber.type, wrapperError = sourceFiber.stateNode, 0 === (sourceFiber.flags & 128) && ("function" === typeof returnFiber.getDerivedStateFromError || null !== wrapperError && "function" === typeof wrapperError.componentDidCatch && (null === legacyErrorBoundariesThatAlreadyFailed || !legacyErrorBoundariesThatAlreadyFailed.has(wrapperError))))
          return sourceFiber.flags |= 65536, rootRenderLanes &= -rootRenderLanes, sourceFiber.lanes |= rootRenderLanes, rootRenderLanes = createClassErrorUpdate(rootRenderLanes), initializeClassErrorUpdate(
            rootRenderLanes,
            root2,
            sourceFiber,
            value
          ), enqueueCapturedUpdate(sourceFiber, rootRenderLanes), false;
    }
    sourceFiber = sourceFiber.return;
  } while (null !== sourceFiber);
  return false;
}
var SelectiveHydrationException = Error(formatProdErrorMessage(461)), didReceiveUpdate = false;
function reconcileChildren(current, workInProgress2, nextChildren, renderLanes2) {
  workInProgress2.child = null === current ? mountChildFibers(workInProgress2, null, nextChildren, renderLanes2) : reconcileChildFibers(
    workInProgress2,
    current.child,
    nextChildren,
    renderLanes2
  );
}
function updateForwardRef(current, workInProgress2, Component2, nextProps, renderLanes2) {
  Component2 = Component2.render;
  var ref = workInProgress2.ref;
  if ("ref" in nextProps) {
    var propsWithoutRef = {};
    for (var key in nextProps)
      "ref" !== key && (propsWithoutRef[key] = nextProps[key]);
  } else propsWithoutRef = nextProps;
  prepareToReadContext(workInProgress2);
  nextProps = renderWithHooks(
    current,
    workInProgress2,
    Component2,
    propsWithoutRef,
    ref,
    renderLanes2
  );
  key = checkDidRenderIdHook();
  if (null !== current && !didReceiveUpdate)
    return bailoutHooks(current, workInProgress2, renderLanes2), bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
  isHydrating && key && pushMaterializedTreeId(workInProgress2);
  workInProgress2.flags |= 1;
  reconcileChildren(current, workInProgress2, nextProps, renderLanes2);
  return workInProgress2.child;
}
function updateMemoComponent(current, workInProgress2, Component2, nextProps, renderLanes2) {
  if (null === current) {
    var type = Component2.type;
    if ("function" === typeof type && !shouldConstruct(type) && void 0 === type.defaultProps && null === Component2.compare)
      return workInProgress2.tag = 15, workInProgress2.type = type, updateSimpleMemoComponent(
        current,
        workInProgress2,
        type,
        nextProps,
        renderLanes2
      );
    current = createFiberFromTypeAndProps(
      Component2.type,
      null,
      nextProps,
      workInProgress2,
      workInProgress2.mode,
      renderLanes2
    );
    current.ref = workInProgress2.ref;
    current.return = workInProgress2;
    return workInProgress2.child = current;
  }
  type = current.child;
  if (!checkScheduledUpdateOrContext(current, renderLanes2)) {
    var prevProps = type.memoizedProps;
    Component2 = Component2.compare;
    Component2 = null !== Component2 ? Component2 : shallowEqual;
    if (Component2(prevProps, nextProps) && current.ref === workInProgress2.ref)
      return bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
  }
  workInProgress2.flags |= 1;
  current = createWorkInProgress(type, nextProps);
  current.ref = workInProgress2.ref;
  current.return = workInProgress2;
  return workInProgress2.child = current;
}
function updateSimpleMemoComponent(current, workInProgress2, Component2, nextProps, renderLanes2) {
  if (null !== current) {
    var prevProps = current.memoizedProps;
    if (shallowEqual(prevProps, nextProps) && current.ref === workInProgress2.ref)
      if (didReceiveUpdate = false, workInProgress2.pendingProps = nextProps = prevProps, checkScheduledUpdateOrContext(current, renderLanes2))
        0 !== (current.flags & 131072) && (didReceiveUpdate = true);
      else
        return workInProgress2.lanes = current.lanes, bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
  }
  return updateFunctionComponent(
    current,
    workInProgress2,
    Component2,
    nextProps,
    renderLanes2
  );
}
function updateOffscreenComponent(current, workInProgress2, renderLanes2, nextProps) {
  var nextChildren = nextProps.children, prevState = null !== current ? current.memoizedState : null;
  null === current && null === workInProgress2.stateNode && (workInProgress2.stateNode = {
    _visibility: 1,
    _pendingMarkers: null,
    _retryCache: null,
    _transitions: null
  });
  if ("hidden" === nextProps.mode) {
    if (0 !== (workInProgress2.flags & 128)) {
      prevState = null !== prevState ? prevState.baseLanes | renderLanes2 : renderLanes2;
      if (null !== current) {
        nextProps = workInProgress2.child = current.child;
        for (nextChildren = 0; null !== nextProps; )
          nextChildren = nextChildren | nextProps.lanes | nextProps.childLanes, nextProps = nextProps.sibling;
        nextProps = nextChildren & ~prevState;
      } else nextProps = 0, workInProgress2.child = null;
      return deferHiddenOffscreenComponent(
        current,
        workInProgress2,
        prevState,
        renderLanes2,
        nextProps
      );
    }
    if (0 !== (renderLanes2 & 536870912))
      workInProgress2.memoizedState = { baseLanes: 0, cachePool: null }, null !== current && pushTransition(
        workInProgress2,
        null !== prevState ? prevState.cachePool : null
      ), null !== prevState ? pushHiddenContext(workInProgress2, prevState) : reuseHiddenContextOnStack(), pushOffscreenSuspenseHandler(workInProgress2);
    else
      return nextProps = workInProgress2.lanes = 536870912, deferHiddenOffscreenComponent(
        current,
        workInProgress2,
        null !== prevState ? prevState.baseLanes | renderLanes2 : renderLanes2,
        renderLanes2,
        nextProps
      );
  } else
    null !== prevState ? (pushTransition(workInProgress2, prevState.cachePool), pushHiddenContext(workInProgress2, prevState), reuseSuspenseHandlerOnStack(), workInProgress2.memoizedState = null) : (null !== current && pushTransition(workInProgress2, null), reuseHiddenContextOnStack(), reuseSuspenseHandlerOnStack());
  reconcileChildren(current, workInProgress2, nextChildren, renderLanes2);
  return workInProgress2.child;
}
function bailoutOffscreenComponent(current, workInProgress2) {
  null !== current && 22 === current.tag || null !== workInProgress2.stateNode || (workInProgress2.stateNode = {
    _visibility: 1,
    _pendingMarkers: null,
    _retryCache: null,
    _transitions: null
  });
  return workInProgress2.sibling;
}
function deferHiddenOffscreenComponent(current, workInProgress2, nextBaseLanes, renderLanes2, remainingChildLanes) {
  var JSCompiler_inline_result = peekCacheFromPool();
  JSCompiler_inline_result = null === JSCompiler_inline_result ? null : { parent: CacheContext._currentValue, pool: JSCompiler_inline_result };
  workInProgress2.memoizedState = {
    baseLanes: nextBaseLanes,
    cachePool: JSCompiler_inline_result
  };
  null !== current && pushTransition(workInProgress2, null);
  reuseHiddenContextOnStack();
  pushOffscreenSuspenseHandler(workInProgress2);
  null !== current && propagateParentContextChanges(current, workInProgress2, renderLanes2, true);
  workInProgress2.childLanes = remainingChildLanes;
  return null;
}
function mountActivityChildren(workInProgress2, nextProps) {
  nextProps = mountWorkInProgressOffscreenFiber(
    { mode: nextProps.mode, children: nextProps.children },
    workInProgress2.mode
  );
  nextProps.ref = workInProgress2.ref;
  workInProgress2.child = nextProps;
  nextProps.return = workInProgress2;
  return nextProps;
}
function retryActivityComponentWithoutHydrating(current, workInProgress2, renderLanes2) {
  reconcileChildFibers(workInProgress2, current.child, null, renderLanes2);
  current = mountActivityChildren(workInProgress2, workInProgress2.pendingProps);
  current.flags |= 2;
  popSuspenseHandler(workInProgress2);
  workInProgress2.memoizedState = null;
  return current;
}
function updateActivityComponent(current, workInProgress2, renderLanes2) {
  var nextProps = workInProgress2.pendingProps, didSuspend = 0 !== (workInProgress2.flags & 128);
  workInProgress2.flags &= -129;
  if (null === current) {
    if (isHydrating) {
      if ("hidden" === nextProps.mode)
        return current = mountActivityChildren(workInProgress2, nextProps), workInProgress2.lanes = 536870912, bailoutOffscreenComponent(null, current);
      pushDehydratedActivitySuspenseHandler(workInProgress2);
      (current = nextHydratableInstance) ? (current = canHydrateHydrationBoundary(
        current,
        rootOrSingletonContext
      ), current = null !== current && "&" === current.data ? current : null, null !== current && (workInProgress2.memoizedState = {
        dehydrated: current,
        treeContext: null !== treeContextProvider ? { id: treeContextId, overflow: treeContextOverflow } : null,
        retryLane: 536870912,
        hydrationErrors: null
      }, renderLanes2 = createFiberFromDehydratedFragment(current), renderLanes2.return = workInProgress2, workInProgress2.child = renderLanes2, hydrationParentFiber = workInProgress2, nextHydratableInstance = null)) : current = null;
      if (null === current) throw throwOnHydrationMismatch(workInProgress2);
      workInProgress2.lanes = 536870912;
      return null;
    }
    return mountActivityChildren(workInProgress2, nextProps);
  }
  var prevState = current.memoizedState;
  if (null !== prevState) {
    var dehydrated = prevState.dehydrated;
    pushDehydratedActivitySuspenseHandler(workInProgress2);
    if (didSuspend)
      if (workInProgress2.flags & 256)
        workInProgress2.flags &= -257, workInProgress2 = retryActivityComponentWithoutHydrating(
          current,
          workInProgress2,
          renderLanes2
        );
      else if (null !== workInProgress2.memoizedState)
        workInProgress2.child = current.child, workInProgress2.flags |= 128, workInProgress2 = null;
      else throw Error(formatProdErrorMessage(558));
    else if (didReceiveUpdate || propagateParentContextChanges(current, workInProgress2, renderLanes2, false), didSuspend = 0 !== (renderLanes2 & current.childLanes), didReceiveUpdate || didSuspend) {
      nextProps = workInProgressRoot;
      if (null !== nextProps && (dehydrated = getBumpedLaneForHydration(nextProps, renderLanes2), 0 !== dehydrated && dehydrated !== prevState.retryLane))
        throw prevState.retryLane = dehydrated, enqueueConcurrentRenderForLane(current, dehydrated), scheduleUpdateOnFiber(nextProps, current, dehydrated), SelectiveHydrationException;
      renderDidSuspendDelayIfPossible();
      workInProgress2 = retryActivityComponentWithoutHydrating(
        current,
        workInProgress2,
        renderLanes2
      );
    } else
      current = prevState.treeContext, nextHydratableInstance = getNextHydratable(dehydrated.nextSibling), hydrationParentFiber = workInProgress2, isHydrating = true, hydrationErrors = null, rootOrSingletonContext = false, null !== current && restoreSuspendedTreeContext(workInProgress2, current), workInProgress2 = mountActivityChildren(workInProgress2, nextProps), workInProgress2.flags |= 4096;
    return workInProgress2;
  }
  current = createWorkInProgress(current.child, {
    mode: nextProps.mode,
    children: nextProps.children
  });
  current.ref = workInProgress2.ref;
  workInProgress2.child = current;
  current.return = workInProgress2;
  return current;
}
function markRef(current, workInProgress2) {
  var ref = workInProgress2.ref;
  if (null === ref)
    null !== current && null !== current.ref && (workInProgress2.flags |= 4194816);
  else {
    if ("function" !== typeof ref && "object" !== typeof ref)
      throw Error(formatProdErrorMessage(284));
    if (null === current || current.ref !== ref)
      workInProgress2.flags |= 4194816;
  }
}
function updateFunctionComponent(current, workInProgress2, Component2, nextProps, renderLanes2) {
  prepareToReadContext(workInProgress2);
  Component2 = renderWithHooks(
    current,
    workInProgress2,
    Component2,
    nextProps,
    void 0,
    renderLanes2
  );
  nextProps = checkDidRenderIdHook();
  if (null !== current && !didReceiveUpdate)
    return bailoutHooks(current, workInProgress2, renderLanes2), bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
  isHydrating && nextProps && pushMaterializedTreeId(workInProgress2);
  workInProgress2.flags |= 1;
  reconcileChildren(current, workInProgress2, Component2, renderLanes2);
  return workInProgress2.child;
}
function replayFunctionComponent(current, workInProgress2, nextProps, Component2, secondArg, renderLanes2) {
  prepareToReadContext(workInProgress2);
  workInProgress2.updateQueue = null;
  nextProps = renderWithHooksAgain(
    workInProgress2,
    Component2,
    nextProps,
    secondArg
  );
  finishRenderingHooks(current);
  Component2 = checkDidRenderIdHook();
  if (null !== current && !didReceiveUpdate)
    return bailoutHooks(current, workInProgress2, renderLanes2), bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
  isHydrating && Component2 && pushMaterializedTreeId(workInProgress2);
  workInProgress2.flags |= 1;
  reconcileChildren(current, workInProgress2, nextProps, renderLanes2);
  return workInProgress2.child;
}
function updateClassComponent(current, workInProgress2, Component2, nextProps, renderLanes2) {
  prepareToReadContext(workInProgress2);
  if (null === workInProgress2.stateNode) {
    var context = emptyContextObject, contextType = Component2.contextType;
    "object" === typeof contextType && null !== contextType && (context = readContext(contextType));
    context = new Component2(nextProps, context);
    workInProgress2.memoizedState = null !== context.state && void 0 !== context.state ? context.state : null;
    context.updater = classComponentUpdater;
    workInProgress2.stateNode = context;
    context._reactInternals = workInProgress2;
    context = workInProgress2.stateNode;
    context.props = nextProps;
    context.state = workInProgress2.memoizedState;
    context.refs = {};
    initializeUpdateQueue(workInProgress2);
    contextType = Component2.contextType;
    context.context = "object" === typeof contextType && null !== contextType ? readContext(contextType) : emptyContextObject;
    context.state = workInProgress2.memoizedState;
    contextType = Component2.getDerivedStateFromProps;
    "function" === typeof contextType && (applyDerivedStateFromProps(
      workInProgress2,
      Component2,
      contextType,
      nextProps
    ), context.state = workInProgress2.memoizedState);
    "function" === typeof Component2.getDerivedStateFromProps || "function" === typeof context.getSnapshotBeforeUpdate || "function" !== typeof context.UNSAFE_componentWillMount && "function" !== typeof context.componentWillMount || (contextType = context.state, "function" === typeof context.componentWillMount && context.componentWillMount(), "function" === typeof context.UNSAFE_componentWillMount && context.UNSAFE_componentWillMount(), contextType !== context.state && classComponentUpdater.enqueueReplaceState(context, context.state, null), processUpdateQueue(workInProgress2, nextProps, context, renderLanes2), suspendIfUpdateReadFromEntangledAsyncAction(), context.state = workInProgress2.memoizedState);
    "function" === typeof context.componentDidMount && (workInProgress2.flags |= 4194308);
    nextProps = true;
  } else if (null === current) {
    context = workInProgress2.stateNode;
    var unresolvedOldProps = workInProgress2.memoizedProps, oldProps = resolveClassComponentProps(Component2, unresolvedOldProps);
    context.props = oldProps;
    var oldContext = context.context, contextType$jscomp$0 = Component2.contextType;
    contextType = emptyContextObject;
    "object" === typeof contextType$jscomp$0 && null !== contextType$jscomp$0 && (contextType = readContext(contextType$jscomp$0));
    var getDerivedStateFromProps = Component2.getDerivedStateFromProps;
    contextType$jscomp$0 = "function" === typeof getDerivedStateFromProps || "function" === typeof context.getSnapshotBeforeUpdate;
    unresolvedOldProps = workInProgress2.pendingProps !== unresolvedOldProps;
    contextType$jscomp$0 || "function" !== typeof context.UNSAFE_componentWillReceiveProps && "function" !== typeof context.componentWillReceiveProps || (unresolvedOldProps || oldContext !== contextType) && callComponentWillReceiveProps(
      workInProgress2,
      context,
      nextProps,
      contextType
    );
    hasForceUpdate = false;
    var oldState = workInProgress2.memoizedState;
    context.state = oldState;
    processUpdateQueue(workInProgress2, nextProps, context, renderLanes2);
    suspendIfUpdateReadFromEntangledAsyncAction();
    oldContext = workInProgress2.memoizedState;
    unresolvedOldProps || oldState !== oldContext || hasForceUpdate ? ("function" === typeof getDerivedStateFromProps && (applyDerivedStateFromProps(
      workInProgress2,
      Component2,
      getDerivedStateFromProps,
      nextProps
    ), oldContext = workInProgress2.memoizedState), (oldProps = hasForceUpdate || checkShouldComponentUpdate(
      workInProgress2,
      Component2,
      oldProps,
      nextProps,
      oldState,
      oldContext,
      contextType
    )) ? (contextType$jscomp$0 || "function" !== typeof context.UNSAFE_componentWillMount && "function" !== typeof context.componentWillMount || ("function" === typeof context.componentWillMount && context.componentWillMount(), "function" === typeof context.UNSAFE_componentWillMount && context.UNSAFE_componentWillMount()), "function" === typeof context.componentDidMount && (workInProgress2.flags |= 4194308)) : ("function" === typeof context.componentDidMount && (workInProgress2.flags |= 4194308), workInProgress2.memoizedProps = nextProps, workInProgress2.memoizedState = oldContext), context.props = nextProps, context.state = oldContext, context.context = contextType, nextProps = oldProps) : ("function" === typeof context.componentDidMount && (workInProgress2.flags |= 4194308), nextProps = false);
  } else {
    context = workInProgress2.stateNode;
    cloneUpdateQueue(current, workInProgress2);
    contextType = workInProgress2.memoizedProps;
    contextType$jscomp$0 = resolveClassComponentProps(Component2, contextType);
    context.props = contextType$jscomp$0;
    getDerivedStateFromProps = workInProgress2.pendingProps;
    oldState = context.context;
    oldContext = Component2.contextType;
    oldProps = emptyContextObject;
    "object" === typeof oldContext && null !== oldContext && (oldProps = readContext(oldContext));
    unresolvedOldProps = Component2.getDerivedStateFromProps;
    (oldContext = "function" === typeof unresolvedOldProps || "function" === typeof context.getSnapshotBeforeUpdate) || "function" !== typeof context.UNSAFE_componentWillReceiveProps && "function" !== typeof context.componentWillReceiveProps || (contextType !== getDerivedStateFromProps || oldState !== oldProps) && callComponentWillReceiveProps(
      workInProgress2,
      context,
      nextProps,
      oldProps
    );
    hasForceUpdate = false;
    oldState = workInProgress2.memoizedState;
    context.state = oldState;
    processUpdateQueue(workInProgress2, nextProps, context, renderLanes2);
    suspendIfUpdateReadFromEntangledAsyncAction();
    var newState = workInProgress2.memoizedState;
    contextType !== getDerivedStateFromProps || oldState !== newState || hasForceUpdate || null !== current && null !== current.dependencies && checkIfContextChanged(current.dependencies) ? ("function" === typeof unresolvedOldProps && (applyDerivedStateFromProps(
      workInProgress2,
      Component2,
      unresolvedOldProps,
      nextProps
    ), newState = workInProgress2.memoizedState), (contextType$jscomp$0 = hasForceUpdate || checkShouldComponentUpdate(
      workInProgress2,
      Component2,
      contextType$jscomp$0,
      nextProps,
      oldState,
      newState,
      oldProps
    ) || null !== current && null !== current.dependencies && checkIfContextChanged(current.dependencies)) ? (oldContext || "function" !== typeof context.UNSAFE_componentWillUpdate && "function" !== typeof context.componentWillUpdate || ("function" === typeof context.componentWillUpdate && context.componentWillUpdate(nextProps, newState, oldProps), "function" === typeof context.UNSAFE_componentWillUpdate && context.UNSAFE_componentWillUpdate(
      nextProps,
      newState,
      oldProps
    )), "function" === typeof context.componentDidUpdate && (workInProgress2.flags |= 4), "function" === typeof context.getSnapshotBeforeUpdate && (workInProgress2.flags |= 1024)) : ("function" !== typeof context.componentDidUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress2.flags |= 4), "function" !== typeof context.getSnapshotBeforeUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress2.flags |= 1024), workInProgress2.memoizedProps = nextProps, workInProgress2.memoizedState = newState), context.props = nextProps, context.state = newState, context.context = oldProps, nextProps = contextType$jscomp$0) : ("function" !== typeof context.componentDidUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress2.flags |= 4), "function" !== typeof context.getSnapshotBeforeUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress2.flags |= 1024), nextProps = false);
  }
  context = nextProps;
  markRef(current, workInProgress2);
  nextProps = 0 !== (workInProgress2.flags & 128);
  context || nextProps ? (context = workInProgress2.stateNode, Component2 = nextProps && "function" !== typeof Component2.getDerivedStateFromError ? null : context.render(), workInProgress2.flags |= 1, null !== current && nextProps ? (workInProgress2.child = reconcileChildFibers(
    workInProgress2,
    current.child,
    null,
    renderLanes2
  ), workInProgress2.child = reconcileChildFibers(
    workInProgress2,
    null,
    Component2,
    renderLanes2
  )) : reconcileChildren(current, workInProgress2, Component2, renderLanes2), workInProgress2.memoizedState = context.state, current = workInProgress2.child) : current = bailoutOnAlreadyFinishedWork(
    current,
    workInProgress2,
    renderLanes2
  );
  return current;
}
function mountHostRootWithoutHydrating(current, workInProgress2, nextChildren, renderLanes2) {
  resetHydrationState();
  workInProgress2.flags |= 256;
  reconcileChildren(current, workInProgress2, nextChildren, renderLanes2);
  return workInProgress2.child;
}
var SUSPENDED_MARKER = {
  dehydrated: null,
  treeContext: null,
  retryLane: 0,
  hydrationErrors: null
};
function mountSuspenseOffscreenState(renderLanes2) {
  return { baseLanes: renderLanes2, cachePool: getSuspendedCache() };
}
function getRemainingWorkInPrimaryTree(current, primaryTreeDidDefer, renderLanes2) {
  current = null !== current ? current.childLanes & ~renderLanes2 : 0;
  primaryTreeDidDefer && (current |= workInProgressDeferredLane);
  return current;
}
function updateSuspenseComponent(current, workInProgress2, renderLanes2) {
  var nextProps = workInProgress2.pendingProps, showFallback = false, didSuspend = 0 !== (workInProgress2.flags & 128), JSCompiler_temp;
  (JSCompiler_temp = didSuspend) || (JSCompiler_temp = null !== current && null === current.memoizedState ? false : 0 !== (suspenseStackCursor.current & 2));
  JSCompiler_temp && (showFallback = true, workInProgress2.flags &= -129);
  JSCompiler_temp = 0 !== (workInProgress2.flags & 32);
  workInProgress2.flags &= -33;
  if (null === current) {
    if (isHydrating) {
      showFallback ? pushPrimaryTreeSuspenseHandler(workInProgress2) : reuseSuspenseHandlerOnStack();
      (current = nextHydratableInstance) ? (current = canHydrateHydrationBoundary(
        current,
        rootOrSingletonContext
      ), current = null !== current && "&" !== current.data ? current : null, null !== current && (workInProgress2.memoizedState = {
        dehydrated: current,
        treeContext: null !== treeContextProvider ? { id: treeContextId, overflow: treeContextOverflow } : null,
        retryLane: 536870912,
        hydrationErrors: null
      }, renderLanes2 = createFiberFromDehydratedFragment(current), renderLanes2.return = workInProgress2, workInProgress2.child = renderLanes2, hydrationParentFiber = workInProgress2, nextHydratableInstance = null)) : current = null;
      if (null === current) throw throwOnHydrationMismatch(workInProgress2);
      isSuspenseInstanceFallback(current) ? workInProgress2.lanes = 32 : workInProgress2.lanes = 536870912;
      return null;
    }
    var nextPrimaryChildren = nextProps.children;
    nextProps = nextProps.fallback;
    if (showFallback)
      return reuseSuspenseHandlerOnStack(), showFallback = workInProgress2.mode, nextPrimaryChildren = mountWorkInProgressOffscreenFiber(
        { mode: "hidden", children: nextPrimaryChildren },
        showFallback
      ), nextProps = createFiberFromFragment(
        nextProps,
        showFallback,
        renderLanes2,
        null
      ), nextPrimaryChildren.return = workInProgress2, nextProps.return = workInProgress2, nextPrimaryChildren.sibling = nextProps, workInProgress2.child = nextPrimaryChildren, nextProps = workInProgress2.child, nextProps.memoizedState = mountSuspenseOffscreenState(renderLanes2), nextProps.childLanes = getRemainingWorkInPrimaryTree(
        current,
        JSCompiler_temp,
        renderLanes2
      ), workInProgress2.memoizedState = SUSPENDED_MARKER, bailoutOffscreenComponent(null, nextProps);
    pushPrimaryTreeSuspenseHandler(workInProgress2);
    return mountSuspensePrimaryChildren(workInProgress2, nextPrimaryChildren);
  }
  var prevState = current.memoizedState;
  if (null !== prevState && (nextPrimaryChildren = prevState.dehydrated, null !== nextPrimaryChildren)) {
    if (didSuspend)
      workInProgress2.flags & 256 ? (pushPrimaryTreeSuspenseHandler(workInProgress2), workInProgress2.flags &= -257, workInProgress2 = retrySuspenseComponentWithoutHydrating(
        current,
        workInProgress2,
        renderLanes2
      )) : null !== workInProgress2.memoizedState ? (reuseSuspenseHandlerOnStack(), workInProgress2.child = current.child, workInProgress2.flags |= 128, workInProgress2 = null) : (reuseSuspenseHandlerOnStack(), nextPrimaryChildren = nextProps.fallback, showFallback = workInProgress2.mode, nextProps = mountWorkInProgressOffscreenFiber(
        { mode: "visible", children: nextProps.children },
        showFallback
      ), nextPrimaryChildren = createFiberFromFragment(
        nextPrimaryChildren,
        showFallback,
        renderLanes2,
        null
      ), nextPrimaryChildren.flags |= 2, nextProps.return = workInProgress2, nextPrimaryChildren.return = workInProgress2, nextProps.sibling = nextPrimaryChildren, workInProgress2.child = nextProps, reconcileChildFibers(
        workInProgress2,
        current.child,
        null,
        renderLanes2
      ), nextProps = workInProgress2.child, nextProps.memoizedState = mountSuspenseOffscreenState(renderLanes2), nextProps.childLanes = getRemainingWorkInPrimaryTree(
        current,
        JSCompiler_temp,
        renderLanes2
      ), workInProgress2.memoizedState = SUSPENDED_MARKER, workInProgress2 = bailoutOffscreenComponent(null, nextProps));
    else if (pushPrimaryTreeSuspenseHandler(workInProgress2), isSuspenseInstanceFallback(nextPrimaryChildren)) {
      JSCompiler_temp = nextPrimaryChildren.nextSibling && nextPrimaryChildren.nextSibling.dataset;
      if (JSCompiler_temp) var digest = JSCompiler_temp.dgst;
      JSCompiler_temp = digest;
      nextProps = Error(formatProdErrorMessage(419));
      nextProps.stack = "";
      nextProps.digest = JSCompiler_temp;
      queueHydrationError({ value: nextProps, source: null, stack: null });
      workInProgress2 = retrySuspenseComponentWithoutHydrating(
        current,
        workInProgress2,
        renderLanes2
      );
    } else if (didReceiveUpdate || propagateParentContextChanges(current, workInProgress2, renderLanes2, false), JSCompiler_temp = 0 !== (renderLanes2 & current.childLanes), didReceiveUpdate || JSCompiler_temp) {
      JSCompiler_temp = workInProgressRoot;
      if (null !== JSCompiler_temp && (nextProps = getBumpedLaneForHydration(JSCompiler_temp, renderLanes2), 0 !== nextProps && nextProps !== prevState.retryLane))
        throw prevState.retryLane = nextProps, enqueueConcurrentRenderForLane(current, nextProps), scheduleUpdateOnFiber(JSCompiler_temp, current, nextProps), SelectiveHydrationException;
      isSuspenseInstancePending(nextPrimaryChildren) || renderDidSuspendDelayIfPossible();
      workInProgress2 = retrySuspenseComponentWithoutHydrating(
        current,
        workInProgress2,
        renderLanes2
      );
    } else
      isSuspenseInstancePending(nextPrimaryChildren) ? (workInProgress2.flags |= 192, workInProgress2.child = current.child, workInProgress2 = null) : (current = prevState.treeContext, nextHydratableInstance = getNextHydratable(
        nextPrimaryChildren.nextSibling
      ), hydrationParentFiber = workInProgress2, isHydrating = true, hydrationErrors = null, rootOrSingletonContext = false, null !== current && restoreSuspendedTreeContext(workInProgress2, current), workInProgress2 = mountSuspensePrimaryChildren(
        workInProgress2,
        nextProps.children
      ), workInProgress2.flags |= 4096);
    return workInProgress2;
  }
  if (showFallback)
    return reuseSuspenseHandlerOnStack(), nextPrimaryChildren = nextProps.fallback, showFallback = workInProgress2.mode, prevState = current.child, digest = prevState.sibling, nextProps = createWorkInProgress(prevState, {
      mode: "hidden",
      children: nextProps.children
    }), nextProps.subtreeFlags = prevState.subtreeFlags & 65011712, null !== digest ? nextPrimaryChildren = createWorkInProgress(
      digest,
      nextPrimaryChildren
    ) : (nextPrimaryChildren = createFiberFromFragment(
      nextPrimaryChildren,
      showFallback,
      renderLanes2,
      null
    ), nextPrimaryChildren.flags |= 2), nextPrimaryChildren.return = workInProgress2, nextProps.return = workInProgress2, nextProps.sibling = nextPrimaryChildren, workInProgress2.child = nextProps, bailoutOffscreenComponent(null, nextProps), nextProps = workInProgress2.child, nextPrimaryChildren = current.child.memoizedState, null === nextPrimaryChildren ? nextPrimaryChildren = mountSuspenseOffscreenState(renderLanes2) : (showFallback = nextPrimaryChildren.cachePool, null !== showFallback ? (prevState = CacheContext._currentValue, showFallback = showFallback.parent !== prevState ? { parent: prevState, pool: prevState } : showFallback) : showFallback = getSuspendedCache(), nextPrimaryChildren = {
      baseLanes: nextPrimaryChildren.baseLanes | renderLanes2,
      cachePool: showFallback
    }), nextProps.memoizedState = nextPrimaryChildren, nextProps.childLanes = getRemainingWorkInPrimaryTree(
      current,
      JSCompiler_temp,
      renderLanes2
    ), workInProgress2.memoizedState = SUSPENDED_MARKER, bailoutOffscreenComponent(current.child, nextProps);
  pushPrimaryTreeSuspenseHandler(workInProgress2);
  renderLanes2 = current.child;
  current = renderLanes2.sibling;
  renderLanes2 = createWorkInProgress(renderLanes2, {
    mode: "visible",
    children: nextProps.children
  });
  renderLanes2.return = workInProgress2;
  renderLanes2.sibling = null;
  null !== current && (JSCompiler_temp = workInProgress2.deletions, null === JSCompiler_temp ? (workInProgress2.deletions = [current], workInProgress2.flags |= 16) : JSCompiler_temp.push(current));
  workInProgress2.child = renderLanes2;
  workInProgress2.memoizedState = null;
  return renderLanes2;
}
function mountSuspensePrimaryChildren(workInProgress2, primaryChildren) {
  primaryChildren = mountWorkInProgressOffscreenFiber(
    { mode: "visible", children: primaryChildren },
    workInProgress2.mode
  );
  primaryChildren.return = workInProgress2;
  return workInProgress2.child = primaryChildren;
}
function mountWorkInProgressOffscreenFiber(offscreenProps, mode) {
  offscreenProps = createFiberImplClass(22, offscreenProps, null, mode);
  offscreenProps.lanes = 0;
  return offscreenProps;
}
function retrySuspenseComponentWithoutHydrating(current, workInProgress2, renderLanes2) {
  reconcileChildFibers(workInProgress2, current.child, null, renderLanes2);
  current = mountSuspensePrimaryChildren(
    workInProgress2,
    workInProgress2.pendingProps.children
  );
  current.flags |= 2;
  workInProgress2.memoizedState = null;
  return current;
}
function scheduleSuspenseWorkOnFiber(fiber, renderLanes2, propagationRoot) {
  fiber.lanes |= renderLanes2;
  var alternate = fiber.alternate;
  null !== alternate && (alternate.lanes |= renderLanes2);
  scheduleContextWorkOnParentPath(fiber.return, renderLanes2, propagationRoot);
}
function initSuspenseListRenderState(workInProgress2, isBackwards, tail, lastContentRow, tailMode, treeForkCount2) {
  var renderState = workInProgress2.memoizedState;
  null === renderState ? workInProgress2.memoizedState = {
    isBackwards,
    rendering: null,
    renderingStartTime: 0,
    last: lastContentRow,
    tail,
    tailMode,
    treeForkCount: treeForkCount2
  } : (renderState.isBackwards = isBackwards, renderState.rendering = null, renderState.renderingStartTime = 0, renderState.last = lastContentRow, renderState.tail = tail, renderState.tailMode = tailMode, renderState.treeForkCount = treeForkCount2);
}
function updateSuspenseListComponent(current, workInProgress2, renderLanes2) {
  var nextProps = workInProgress2.pendingProps, revealOrder = nextProps.revealOrder, tailMode = nextProps.tail;
  nextProps = nextProps.children;
  var suspenseContext = suspenseStackCursor.current, shouldForceFallback = 0 !== (suspenseContext & 2);
  shouldForceFallback ? (suspenseContext = suspenseContext & 1 | 2, workInProgress2.flags |= 128) : suspenseContext &= 1;
  push(suspenseStackCursor, suspenseContext);
  reconcileChildren(current, workInProgress2, nextProps, renderLanes2);
  nextProps = isHydrating ? treeForkCount : 0;
  if (!shouldForceFallback && null !== current && 0 !== (current.flags & 128))
    a: for (current = workInProgress2.child; null !== current; ) {
      if (13 === current.tag)
        null !== current.memoizedState && scheduleSuspenseWorkOnFiber(current, renderLanes2, workInProgress2);
      else if (19 === current.tag)
        scheduleSuspenseWorkOnFiber(current, renderLanes2, workInProgress2);
      else if (null !== current.child) {
        current.child.return = current;
        current = current.child;
        continue;
      }
      if (current === workInProgress2) break a;
      for (; null === current.sibling; ) {
        if (null === current.return || current.return === workInProgress2)
          break a;
        current = current.return;
      }
      current.sibling.return = current.return;
      current = current.sibling;
    }
  switch (revealOrder) {
    case "forwards":
      renderLanes2 = workInProgress2.child;
      for (revealOrder = null; null !== renderLanes2; )
        current = renderLanes2.alternate, null !== current && null === findFirstSuspended(current) && (revealOrder = renderLanes2), renderLanes2 = renderLanes2.sibling;
      renderLanes2 = revealOrder;
      null === renderLanes2 ? (revealOrder = workInProgress2.child, workInProgress2.child = null) : (revealOrder = renderLanes2.sibling, renderLanes2.sibling = null);
      initSuspenseListRenderState(
        workInProgress2,
        false,
        revealOrder,
        renderLanes2,
        tailMode,
        nextProps
      );
      break;
    case "backwards":
    case "unstable_legacy-backwards":
      renderLanes2 = null;
      revealOrder = workInProgress2.child;
      for (workInProgress2.child = null; null !== revealOrder; ) {
        current = revealOrder.alternate;
        if (null !== current && null === findFirstSuspended(current)) {
          workInProgress2.child = revealOrder;
          break;
        }
        current = revealOrder.sibling;
        revealOrder.sibling = renderLanes2;
        renderLanes2 = revealOrder;
        revealOrder = current;
      }
      initSuspenseListRenderState(
        workInProgress2,
        true,
        renderLanes2,
        null,
        tailMode,
        nextProps
      );
      break;
    case "together":
      initSuspenseListRenderState(
        workInProgress2,
        false,
        null,
        null,
        void 0,
        nextProps
      );
      break;
    default:
      workInProgress2.memoizedState = null;
  }
  return workInProgress2.child;
}
function bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2) {
  null !== current && (workInProgress2.dependencies = current.dependencies);
  workInProgressRootSkippedLanes |= workInProgress2.lanes;
  if (0 === (renderLanes2 & workInProgress2.childLanes))
    if (null !== current) {
      if (propagateParentContextChanges(
        current,
        workInProgress2,
        renderLanes2,
        false
      ), 0 === (renderLanes2 & workInProgress2.childLanes))
        return null;
    } else return null;
  if (null !== current && workInProgress2.child !== current.child)
    throw Error(formatProdErrorMessage(153));
  if (null !== workInProgress2.child) {
    current = workInProgress2.child;
    renderLanes2 = createWorkInProgress(current, current.pendingProps);
    workInProgress2.child = renderLanes2;
    for (renderLanes2.return = workInProgress2; null !== current.sibling; )
      current = current.sibling, renderLanes2 = renderLanes2.sibling = createWorkInProgress(current, current.pendingProps), renderLanes2.return = workInProgress2;
    renderLanes2.sibling = null;
  }
  return workInProgress2.child;
}
function checkScheduledUpdateOrContext(current, renderLanes2) {
  if (0 !== (current.lanes & renderLanes2)) return true;
  current = current.dependencies;
  return null !== current && checkIfContextChanged(current) ? true : false;
}
function attemptEarlyBailoutIfNoScheduledUpdate(current, workInProgress2, renderLanes2) {
  switch (workInProgress2.tag) {
    case 3:
      pushHostContainer(workInProgress2, workInProgress2.stateNode.containerInfo);
      pushProvider(workInProgress2, CacheContext, current.memoizedState.cache);
      resetHydrationState();
      break;
    case 27:
    case 5:
      pushHostContext(workInProgress2);
      break;
    case 4:
      pushHostContainer(workInProgress2, workInProgress2.stateNode.containerInfo);
      break;
    case 10:
      pushProvider(
        workInProgress2,
        workInProgress2.type,
        workInProgress2.memoizedProps.value
      );
      break;
    case 31:
      if (null !== workInProgress2.memoizedState)
        return workInProgress2.flags |= 128, pushDehydratedActivitySuspenseHandler(workInProgress2), null;
      break;
    case 13:
      var state$102 = workInProgress2.memoizedState;
      if (null !== state$102) {
        if (null !== state$102.dehydrated)
          return pushPrimaryTreeSuspenseHandler(workInProgress2), workInProgress2.flags |= 128, null;
        if (0 !== (renderLanes2 & workInProgress2.child.childLanes))
          return updateSuspenseComponent(current, workInProgress2, renderLanes2);
        pushPrimaryTreeSuspenseHandler(workInProgress2);
        current = bailoutOnAlreadyFinishedWork(
          current,
          workInProgress2,
          renderLanes2
        );
        return null !== current ? current.sibling : null;
      }
      pushPrimaryTreeSuspenseHandler(workInProgress2);
      break;
    case 19:
      var didSuspendBefore = 0 !== (current.flags & 128);
      state$102 = 0 !== (renderLanes2 & workInProgress2.childLanes);
      state$102 || (propagateParentContextChanges(
        current,
        workInProgress2,
        renderLanes2,
        false
      ), state$102 = 0 !== (renderLanes2 & workInProgress2.childLanes));
      if (didSuspendBefore) {
        if (state$102)
          return updateSuspenseListComponent(
            current,
            workInProgress2,
            renderLanes2
          );
        workInProgress2.flags |= 128;
      }
      didSuspendBefore = workInProgress2.memoizedState;
      null !== didSuspendBefore && (didSuspendBefore.rendering = null, didSuspendBefore.tail = null, didSuspendBefore.lastEffect = null);
      push(suspenseStackCursor, suspenseStackCursor.current);
      if (state$102) break;
      else return null;
    case 22:
      return workInProgress2.lanes = 0, updateOffscreenComponent(
        current,
        workInProgress2,
        renderLanes2,
        workInProgress2.pendingProps
      );
    case 24:
      pushProvider(workInProgress2, CacheContext, current.memoizedState.cache);
  }
  return bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
}
function beginWork(current, workInProgress2, renderLanes2) {
  if (null !== current)
    if (current.memoizedProps !== workInProgress2.pendingProps)
      didReceiveUpdate = true;
    else {
      if (!checkScheduledUpdateOrContext(current, renderLanes2) && 0 === (workInProgress2.flags & 128))
        return didReceiveUpdate = false, attemptEarlyBailoutIfNoScheduledUpdate(
          current,
          workInProgress2,
          renderLanes2
        );
      didReceiveUpdate = 0 !== (current.flags & 131072) ? true : false;
    }
  else
    didReceiveUpdate = false, isHydrating && 0 !== (workInProgress2.flags & 1048576) && pushTreeId(workInProgress2, treeForkCount, workInProgress2.index);
  workInProgress2.lanes = 0;
  switch (workInProgress2.tag) {
    case 16:
      a: {
        var props = workInProgress2.pendingProps;
        current = resolveLazy(workInProgress2.elementType);
        workInProgress2.type = current;
        if ("function" === typeof current)
          shouldConstruct(current) ? (props = resolveClassComponentProps(current, props), workInProgress2.tag = 1, workInProgress2 = updateClassComponent(
            null,
            workInProgress2,
            current,
            props,
            renderLanes2
          )) : (workInProgress2.tag = 0, workInProgress2 = updateFunctionComponent(
            null,
            workInProgress2,
            current,
            props,
            renderLanes2
          ));
        else {
          if (void 0 !== current && null !== current) {
            var $$typeof = current.$$typeof;
            if ($$typeof === REACT_FORWARD_REF_TYPE) {
              workInProgress2.tag = 11;
              workInProgress2 = updateForwardRef(
                null,
                workInProgress2,
                current,
                props,
                renderLanes2
              );
              break a;
            } else if ($$typeof === REACT_MEMO_TYPE) {
              workInProgress2.tag = 14;
              workInProgress2 = updateMemoComponent(
                null,
                workInProgress2,
                current,
                props,
                renderLanes2
              );
              break a;
            }
          }
          workInProgress2 = getComponentNameFromType(current) || current;
          throw Error(formatProdErrorMessage(306, workInProgress2, ""));
        }
      }
      return workInProgress2;
    case 0:
      return updateFunctionComponent(
        current,
        workInProgress2,
        workInProgress2.type,
        workInProgress2.pendingProps,
        renderLanes2
      );
    case 1:
      return props = workInProgress2.type, $$typeof = resolveClassComponentProps(
        props,
        workInProgress2.pendingProps
      ), updateClassComponent(
        current,
        workInProgress2,
        props,
        $$typeof,
        renderLanes2
      );
    case 3:
      a: {
        pushHostContainer(
          workInProgress2,
          workInProgress2.stateNode.containerInfo
        );
        if (null === current) throw Error(formatProdErrorMessage(387));
        props = workInProgress2.pendingProps;
        var prevState = workInProgress2.memoizedState;
        $$typeof = prevState.element;
        cloneUpdateQueue(current, workInProgress2);
        processUpdateQueue(workInProgress2, props, null, renderLanes2);
        var nextState = workInProgress2.memoizedState;
        props = nextState.cache;
        pushProvider(workInProgress2, CacheContext, props);
        props !== prevState.cache && propagateContextChanges(
          workInProgress2,
          [CacheContext],
          renderLanes2,
          true
        );
        suspendIfUpdateReadFromEntangledAsyncAction();
        props = nextState.element;
        if (prevState.isDehydrated)
          if (prevState = {
            element: props,
            isDehydrated: false,
            cache: nextState.cache
          }, workInProgress2.updateQueue.baseState = prevState, workInProgress2.memoizedState = prevState, workInProgress2.flags & 256) {
            workInProgress2 = mountHostRootWithoutHydrating(
              current,
              workInProgress2,
              props,
              renderLanes2
            );
            break a;
          } else if (props !== $$typeof) {
            $$typeof = createCapturedValueAtFiber(
              Error(formatProdErrorMessage(424)),
              workInProgress2
            );
            queueHydrationError($$typeof);
            workInProgress2 = mountHostRootWithoutHydrating(
              current,
              workInProgress2,
              props,
              renderLanes2
            );
            break a;
          } else {
            current = workInProgress2.stateNode.containerInfo;
            switch (current.nodeType) {
              case 9:
                current = current.body;
                break;
              default:
                current = "HTML" === current.nodeName ? current.ownerDocument.body : current;
            }
            nextHydratableInstance = getNextHydratable(current.firstChild);
            hydrationParentFiber = workInProgress2;
            isHydrating = true;
            hydrationErrors = null;
            rootOrSingletonContext = true;
            renderLanes2 = mountChildFibers(
              workInProgress2,
              null,
              props,
              renderLanes2
            );
            for (workInProgress2.child = renderLanes2; renderLanes2; )
              renderLanes2.flags = renderLanes2.flags & -3 | 4096, renderLanes2 = renderLanes2.sibling;
          }
        else {
          resetHydrationState();
          if (props === $$typeof) {
            workInProgress2 = bailoutOnAlreadyFinishedWork(
              current,
              workInProgress2,
              renderLanes2
            );
            break a;
          }
          reconcileChildren(current, workInProgress2, props, renderLanes2);
        }
        workInProgress2 = workInProgress2.child;
      }
      return workInProgress2;
    case 26:
      return markRef(current, workInProgress2), null === current ? (renderLanes2 = getResource(
        workInProgress2.type,
        null,
        workInProgress2.pendingProps,
        null
      )) ? workInProgress2.memoizedState = renderLanes2 : isHydrating || (renderLanes2 = workInProgress2.type, current = workInProgress2.pendingProps, props = getOwnerDocumentFromRootContainer(
        rootInstanceStackCursor.current
      ).createElement(renderLanes2), props[internalInstanceKey] = workInProgress2, props[internalPropsKey] = current, setInitialProperties(props, renderLanes2, current), markNodeAsHoistable(props), workInProgress2.stateNode = props) : workInProgress2.memoizedState = getResource(
        workInProgress2.type,
        current.memoizedProps,
        workInProgress2.pendingProps,
        current.memoizedState
      ), null;
    case 27:
      return pushHostContext(workInProgress2), null === current && isHydrating && (props = workInProgress2.stateNode = resolveSingletonInstance(
        workInProgress2.type,
        workInProgress2.pendingProps,
        rootInstanceStackCursor.current
      ), hydrationParentFiber = workInProgress2, rootOrSingletonContext = true, $$typeof = nextHydratableInstance, isSingletonScope(workInProgress2.type) ? (previousHydratableOnEnteringScopedSingleton = $$typeof, nextHydratableInstance = getNextHydratable(props.firstChild)) : nextHydratableInstance = $$typeof), reconcileChildren(
        current,
        workInProgress2,
        workInProgress2.pendingProps.children,
        renderLanes2
      ), markRef(current, workInProgress2), null === current && (workInProgress2.flags |= 4194304), workInProgress2.child;
    case 5:
      if (null === current && isHydrating) {
        if ($$typeof = props = nextHydratableInstance)
          props = canHydrateInstance(
            props,
            workInProgress2.type,
            workInProgress2.pendingProps,
            rootOrSingletonContext
          ), null !== props ? (workInProgress2.stateNode = props, hydrationParentFiber = workInProgress2, nextHydratableInstance = getNextHydratable(props.firstChild), rootOrSingletonContext = false, $$typeof = true) : $$typeof = false;
        $$typeof || throwOnHydrationMismatch(workInProgress2);
      }
      pushHostContext(workInProgress2);
      $$typeof = workInProgress2.type;
      prevState = workInProgress2.pendingProps;
      nextState = null !== current ? current.memoizedProps : null;
      props = prevState.children;
      shouldSetTextContent($$typeof, prevState) ? props = null : null !== nextState && shouldSetTextContent($$typeof, nextState) && (workInProgress2.flags |= 32);
      null !== workInProgress2.memoizedState && ($$typeof = renderWithHooks(
        current,
        workInProgress2,
        TransitionAwareHostComponent,
        null,
        null,
        renderLanes2
      ), HostTransitionContext._currentValue = $$typeof);
      markRef(current, workInProgress2);
      reconcileChildren(current, workInProgress2, props, renderLanes2);
      return workInProgress2.child;
    case 6:
      if (null === current && isHydrating) {
        if (current = renderLanes2 = nextHydratableInstance)
          renderLanes2 = canHydrateTextInstance(
            renderLanes2,
            workInProgress2.pendingProps,
            rootOrSingletonContext
          ), null !== renderLanes2 ? (workInProgress2.stateNode = renderLanes2, hydrationParentFiber = workInProgress2, nextHydratableInstance = null, current = true) : current = false;
        current || throwOnHydrationMismatch(workInProgress2);
      }
      return null;
    case 13:
      return updateSuspenseComponent(current, workInProgress2, renderLanes2);
    case 4:
      return pushHostContainer(
        workInProgress2,
        workInProgress2.stateNode.containerInfo
      ), props = workInProgress2.pendingProps, null === current ? workInProgress2.child = reconcileChildFibers(
        workInProgress2,
        null,
        props,
        renderLanes2
      ) : reconcileChildren(current, workInProgress2, props, renderLanes2), workInProgress2.child;
    case 11:
      return updateForwardRef(
        current,
        workInProgress2,
        workInProgress2.type,
        workInProgress2.pendingProps,
        renderLanes2
      );
    case 7:
      return reconcileChildren(
        current,
        workInProgress2,
        workInProgress2.pendingProps,
        renderLanes2
      ), workInProgress2.child;
    case 8:
      return reconcileChildren(
        current,
        workInProgress2,
        workInProgress2.pendingProps.children,
        renderLanes2
      ), workInProgress2.child;
    case 12:
      return reconcileChildren(
        current,
        workInProgress2,
        workInProgress2.pendingProps.children,
        renderLanes2
      ), workInProgress2.child;
    case 10:
      return props = workInProgress2.pendingProps, pushProvider(workInProgress2, workInProgress2.type, props.value), reconcileChildren(current, workInProgress2, props.children, renderLanes2), workInProgress2.child;
    case 9:
      return $$typeof = workInProgress2.type._context, props = workInProgress2.pendingProps.children, prepareToReadContext(workInProgress2), $$typeof = readContext($$typeof), props = props($$typeof), workInProgress2.flags |= 1, reconcileChildren(current, workInProgress2, props, renderLanes2), workInProgress2.child;
    case 14:
      return updateMemoComponent(
        current,
        workInProgress2,
        workInProgress2.type,
        workInProgress2.pendingProps,
        renderLanes2
      );
    case 15:
      return updateSimpleMemoComponent(
        current,
        workInProgress2,
        workInProgress2.type,
        workInProgress2.pendingProps,
        renderLanes2
      );
    case 19:
      return updateSuspenseListComponent(current, workInProgress2, renderLanes2);
    case 31:
      return updateActivityComponent(current, workInProgress2, renderLanes2);
    case 22:
      return updateOffscreenComponent(
        current,
        workInProgress2,
        renderLanes2,
        workInProgress2.pendingProps
      );
    case 24:
      return prepareToReadContext(workInProgress2), props = readContext(CacheContext), null === current ? ($$typeof = peekCacheFromPool(), null === $$typeof && ($$typeof = workInProgressRoot, prevState = createCache(), $$typeof.pooledCache = prevState, prevState.refCount++, null !== prevState && ($$typeof.pooledCacheLanes |= renderLanes2), $$typeof = prevState), workInProgress2.memoizedState = { parent: props, cache: $$typeof }, initializeUpdateQueue(workInProgress2), pushProvider(workInProgress2, CacheContext, $$typeof)) : (0 !== (current.lanes & renderLanes2) && (cloneUpdateQueue(current, workInProgress2), processUpdateQueue(workInProgress2, null, null, renderLanes2), suspendIfUpdateReadFromEntangledAsyncAction()), $$typeof = current.memoizedState, prevState = workInProgress2.memoizedState, $$typeof.parent !== props ? ($$typeof = { parent: props, cache: props }, workInProgress2.memoizedState = $$typeof, 0 === workInProgress2.lanes && (workInProgress2.memoizedState = workInProgress2.updateQueue.baseState = $$typeof), pushProvider(workInProgress2, CacheContext, props)) : (props = prevState.cache, pushProvider(workInProgress2, CacheContext, props), props !== $$typeof.cache && propagateContextChanges(
        workInProgress2,
        [CacheContext],
        renderLanes2,
        true
      ))), reconcileChildren(
        current,
        workInProgress2,
        workInProgress2.pendingProps.children,
        renderLanes2
      ), workInProgress2.child;
    case 29:
      throw workInProgress2.pendingProps;
  }
  throw Error(formatProdErrorMessage(156, workInProgress2.tag));
}
function markUpdate(workInProgress2) {
  workInProgress2.flags |= 4;
}
function preloadInstanceAndSuspendIfNeeded(workInProgress2, type, oldProps, newProps, renderLanes2) {
  if (type = 0 !== (workInProgress2.mode & 32)) type = false;
  if (type) {
    if (workInProgress2.flags |= 16777216, (renderLanes2 & 335544128) === renderLanes2)
      if (workInProgress2.stateNode.complete) workInProgress2.flags |= 8192;
      else if (shouldRemainOnPreviousScreen()) workInProgress2.flags |= 8192;
      else
        throw suspendedThenable = noopSuspenseyCommitThenable, SuspenseyCommitException;
  } else workInProgress2.flags &= -16777217;
}
function preloadResourceAndSuspendIfNeeded(workInProgress2, resource) {
  if ("stylesheet" !== resource.type || 0 !== (resource.state.loading & 4))
    workInProgress2.flags &= -16777217;
  else if (workInProgress2.flags |= 16777216, !preloadResource(resource))
    if (shouldRemainOnPreviousScreen()) workInProgress2.flags |= 8192;
    else
      throw suspendedThenable = noopSuspenseyCommitThenable, SuspenseyCommitException;
}
function scheduleRetryEffect(workInProgress2, retryQueue) {
  null !== retryQueue && (workInProgress2.flags |= 4);
  workInProgress2.flags & 16384 && (retryQueue = 22 !== workInProgress2.tag ? claimNextRetryLane() : 536870912, workInProgress2.lanes |= retryQueue, workInProgressSuspendedRetryLanes |= retryQueue);
}
function cutOffTailIfNeeded(renderState, hasRenderedATailFallback) {
  if (!isHydrating)
    switch (renderState.tailMode) {
      case "hidden":
        hasRenderedATailFallback = renderState.tail;
        for (var lastTailNode = null; null !== hasRenderedATailFallback; )
          null !== hasRenderedATailFallback.alternate && (lastTailNode = hasRenderedATailFallback), hasRenderedATailFallback = hasRenderedATailFallback.sibling;
        null === lastTailNode ? renderState.tail = null : lastTailNode.sibling = null;
        break;
      case "collapsed":
        lastTailNode = renderState.tail;
        for (var lastTailNode$106 = null; null !== lastTailNode; )
          null !== lastTailNode.alternate && (lastTailNode$106 = lastTailNode), lastTailNode = lastTailNode.sibling;
        null === lastTailNode$106 ? hasRenderedATailFallback || null === renderState.tail ? renderState.tail = null : renderState.tail.sibling = null : lastTailNode$106.sibling = null;
    }
}
function bubbleProperties(completedWork) {
  var didBailout = null !== completedWork.alternate && completedWork.alternate.child === completedWork.child, newChildLanes = 0, subtreeFlags = 0;
  if (didBailout)
    for (var child$107 = completedWork.child; null !== child$107; )
      newChildLanes |= child$107.lanes | child$107.childLanes, subtreeFlags |= child$107.subtreeFlags & 65011712, subtreeFlags |= child$107.flags & 65011712, child$107.return = completedWork, child$107 = child$107.sibling;
  else
    for (child$107 = completedWork.child; null !== child$107; )
      newChildLanes |= child$107.lanes | child$107.childLanes, subtreeFlags |= child$107.subtreeFlags, subtreeFlags |= child$107.flags, child$107.return = completedWork, child$107 = child$107.sibling;
  completedWork.subtreeFlags |= subtreeFlags;
  completedWork.childLanes = newChildLanes;
  return didBailout;
}
function completeWork(current, workInProgress2, renderLanes2) {
  var newProps = workInProgress2.pendingProps;
  popTreeContext(workInProgress2);
  switch (workInProgress2.tag) {
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return bubbleProperties(workInProgress2), null;
    case 1:
      return bubbleProperties(workInProgress2), null;
    case 3:
      renderLanes2 = workInProgress2.stateNode;
      newProps = null;
      null !== current && (newProps = current.memoizedState.cache);
      workInProgress2.memoizedState.cache !== newProps && (workInProgress2.flags |= 2048);
      popProvider(CacheContext);
      popHostContainer();
      renderLanes2.pendingContext && (renderLanes2.context = renderLanes2.pendingContext, renderLanes2.pendingContext = null);
      if (null === current || null === current.child)
        popHydrationState(workInProgress2) ? markUpdate(workInProgress2) : null === current || current.memoizedState.isDehydrated && 0 === (workInProgress2.flags & 256) || (workInProgress2.flags |= 1024, upgradeHydrationErrorsToRecoverable());
      bubbleProperties(workInProgress2);
      return null;
    case 26:
      var type = workInProgress2.type, nextResource = workInProgress2.memoizedState;
      null === current ? (markUpdate(workInProgress2), null !== nextResource ? (bubbleProperties(workInProgress2), preloadResourceAndSuspendIfNeeded(workInProgress2, nextResource)) : (bubbleProperties(workInProgress2), preloadInstanceAndSuspendIfNeeded(
        workInProgress2,
        type,
        null,
        newProps,
        renderLanes2
      ))) : nextResource ? nextResource !== current.memoizedState ? (markUpdate(workInProgress2), bubbleProperties(workInProgress2), preloadResourceAndSuspendIfNeeded(workInProgress2, nextResource)) : (bubbleProperties(workInProgress2), workInProgress2.flags &= -16777217) : (current = current.memoizedProps, current !== newProps && markUpdate(workInProgress2), bubbleProperties(workInProgress2), preloadInstanceAndSuspendIfNeeded(
        workInProgress2,
        type,
        current,
        newProps,
        renderLanes2
      ));
      return null;
    case 27:
      popHostContext(workInProgress2);
      renderLanes2 = rootInstanceStackCursor.current;
      type = workInProgress2.type;
      if (null !== current && null != workInProgress2.stateNode)
        current.memoizedProps !== newProps && markUpdate(workInProgress2);
      else {
        if (!newProps) {
          if (null === workInProgress2.stateNode)
            throw Error(formatProdErrorMessage(166));
          bubbleProperties(workInProgress2);
          return null;
        }
        current = contextStackCursor.current;
        popHydrationState(workInProgress2) ? prepareToHydrateHostInstance(workInProgress2) : (current = resolveSingletonInstance(type, newProps, renderLanes2), workInProgress2.stateNode = current, markUpdate(workInProgress2));
      }
      bubbleProperties(workInProgress2);
      return null;
    case 5:
      popHostContext(workInProgress2);
      type = workInProgress2.type;
      if (null !== current && null != workInProgress2.stateNode)
        current.memoizedProps !== newProps && markUpdate(workInProgress2);
      else {
        if (!newProps) {
          if (null === workInProgress2.stateNode)
            throw Error(formatProdErrorMessage(166));
          bubbleProperties(workInProgress2);
          return null;
        }
        nextResource = contextStackCursor.current;
        if (popHydrationState(workInProgress2))
          prepareToHydrateHostInstance(workInProgress2);
        else {
          var ownerDocument = getOwnerDocumentFromRootContainer(
            rootInstanceStackCursor.current
          );
          switch (nextResource) {
            case 1:
              nextResource = ownerDocument.createElementNS(
                "http://www.w3.org/2000/svg",
                type
              );
              break;
            case 2:
              nextResource = ownerDocument.createElementNS(
                "http://www.w3.org/1998/Math/MathML",
                type
              );
              break;
            default:
              switch (type) {
                case "svg":
                  nextResource = ownerDocument.createElementNS(
                    "http://www.w3.org/2000/svg",
                    type
                  );
                  break;
                case "math":
                  nextResource = ownerDocument.createElementNS(
                    "http://www.w3.org/1998/Math/MathML",
                    type
                  );
                  break;
                case "script":
                  nextResource = ownerDocument.createElement("div");
                  nextResource.innerHTML = "<script><\/script>";
                  nextResource = nextResource.removeChild(
                    nextResource.firstChild
                  );
                  break;
                case "select":
                  nextResource = "string" === typeof newProps.is ? ownerDocument.createElement("select", {
                    is: newProps.is
                  }) : ownerDocument.createElement("select");
                  newProps.multiple ? nextResource.multiple = true : newProps.size && (nextResource.size = newProps.size);
                  break;
                default:
                  nextResource = "string" === typeof newProps.is ? ownerDocument.createElement(type, { is: newProps.is }) : ownerDocument.createElement(type);
              }
          }
          nextResource[internalInstanceKey] = workInProgress2;
          nextResource[internalPropsKey] = newProps;
          a: for (ownerDocument = workInProgress2.child; null !== ownerDocument; ) {
            if (5 === ownerDocument.tag || 6 === ownerDocument.tag)
              nextResource.appendChild(ownerDocument.stateNode);
            else if (4 !== ownerDocument.tag && 27 !== ownerDocument.tag && null !== ownerDocument.child) {
              ownerDocument.child.return = ownerDocument;
              ownerDocument = ownerDocument.child;
              continue;
            }
            if (ownerDocument === workInProgress2) break a;
            for (; null === ownerDocument.sibling; ) {
              if (null === ownerDocument.return || ownerDocument.return === workInProgress2)
                break a;
              ownerDocument = ownerDocument.return;
            }
            ownerDocument.sibling.return = ownerDocument.return;
            ownerDocument = ownerDocument.sibling;
          }
          workInProgress2.stateNode = nextResource;
          a: switch (setInitialProperties(nextResource, type, newProps), type) {
            case "button":
            case "input":
            case "select":
            case "textarea":
              newProps = !!newProps.autoFocus;
              break a;
            case "img":
              newProps = true;
              break a;
            default:
              newProps = false;
          }
          newProps && markUpdate(workInProgress2);
        }
      }
      bubbleProperties(workInProgress2);
      preloadInstanceAndSuspendIfNeeded(
        workInProgress2,
        workInProgress2.type,
        null === current ? null : current.memoizedProps,
        workInProgress2.pendingProps,
        renderLanes2
      );
      return null;
    case 6:
      if (current && null != workInProgress2.stateNode)
        current.memoizedProps !== newProps && markUpdate(workInProgress2);
      else {
        if ("string" !== typeof newProps && null === workInProgress2.stateNode)
          throw Error(formatProdErrorMessage(166));
        current = rootInstanceStackCursor.current;
        if (popHydrationState(workInProgress2)) {
          current = workInProgress2.stateNode;
          renderLanes2 = workInProgress2.memoizedProps;
          newProps = null;
          type = hydrationParentFiber;
          if (null !== type)
            switch (type.tag) {
              case 27:
              case 5:
                newProps = type.memoizedProps;
            }
          current[internalInstanceKey] = workInProgress2;
          current = current.nodeValue === renderLanes2 || null !== newProps && true === newProps.suppressHydrationWarning || checkForUnmatchedText(current.nodeValue, renderLanes2) ? true : false;
          current || throwOnHydrationMismatch(workInProgress2, true);
        } else
          current = getOwnerDocumentFromRootContainer(current).createTextNode(
            newProps
          ), current[internalInstanceKey] = workInProgress2, workInProgress2.stateNode = current;
      }
      bubbleProperties(workInProgress2);
      return null;
    case 31:
      renderLanes2 = workInProgress2.memoizedState;
      if (null === current || null !== current.memoizedState) {
        newProps = popHydrationState(workInProgress2);
        if (null !== renderLanes2) {
          if (null === current) {
            if (!newProps) throw Error(formatProdErrorMessage(318));
            current = workInProgress2.memoizedState;
            current = null !== current ? current.dehydrated : null;
            if (!current) throw Error(formatProdErrorMessage(557));
            current[internalInstanceKey] = workInProgress2;
          } else
            resetHydrationState(), 0 === (workInProgress2.flags & 128) && (workInProgress2.memoizedState = null), workInProgress2.flags |= 4;
          bubbleProperties(workInProgress2);
          current = false;
        } else
          renderLanes2 = upgradeHydrationErrorsToRecoverable(), null !== current && null !== current.memoizedState && (current.memoizedState.hydrationErrors = renderLanes2), current = true;
        if (!current) {
          if (workInProgress2.flags & 256)
            return popSuspenseHandler(workInProgress2), workInProgress2;
          popSuspenseHandler(workInProgress2);
          return null;
        }
        if (0 !== (workInProgress2.flags & 128))
          throw Error(formatProdErrorMessage(558));
      }
      bubbleProperties(workInProgress2);
      return null;
    case 13:
      newProps = workInProgress2.memoizedState;
      if (null === current || null !== current.memoizedState && null !== current.memoizedState.dehydrated) {
        type = popHydrationState(workInProgress2);
        if (null !== newProps && null !== newProps.dehydrated) {
          if (null === current) {
            if (!type) throw Error(formatProdErrorMessage(318));
            type = workInProgress2.memoizedState;
            type = null !== type ? type.dehydrated : null;
            if (!type) throw Error(formatProdErrorMessage(317));
            type[internalInstanceKey] = workInProgress2;
          } else
            resetHydrationState(), 0 === (workInProgress2.flags & 128) && (workInProgress2.memoizedState = null), workInProgress2.flags |= 4;
          bubbleProperties(workInProgress2);
          type = false;
        } else
          type = upgradeHydrationErrorsToRecoverable(), null !== current && null !== current.memoizedState && (current.memoizedState.hydrationErrors = type), type = true;
        if (!type) {
          if (workInProgress2.flags & 256)
            return popSuspenseHandler(workInProgress2), workInProgress2;
          popSuspenseHandler(workInProgress2);
          return null;
        }
      }
      popSuspenseHandler(workInProgress2);
      if (0 !== (workInProgress2.flags & 128))
        return workInProgress2.lanes = renderLanes2, workInProgress2;
      renderLanes2 = null !== newProps;
      current = null !== current && null !== current.memoizedState;
      renderLanes2 && (newProps = workInProgress2.child, type = null, null !== newProps.alternate && null !== newProps.alternate.memoizedState && null !== newProps.alternate.memoizedState.cachePool && (type = newProps.alternate.memoizedState.cachePool.pool), nextResource = null, null !== newProps.memoizedState && null !== newProps.memoizedState.cachePool && (nextResource = newProps.memoizedState.cachePool.pool), nextResource !== type && (newProps.flags |= 2048));
      renderLanes2 !== current && renderLanes2 && (workInProgress2.child.flags |= 8192);
      scheduleRetryEffect(workInProgress2, workInProgress2.updateQueue);
      bubbleProperties(workInProgress2);
      return null;
    case 4:
      return popHostContainer(), null === current && listenToAllSupportedEvents(workInProgress2.stateNode.containerInfo), bubbleProperties(workInProgress2), null;
    case 10:
      return popProvider(workInProgress2.type), bubbleProperties(workInProgress2), null;
    case 19:
      pop(suspenseStackCursor);
      newProps = workInProgress2.memoizedState;
      if (null === newProps) return bubbleProperties(workInProgress2), null;
      type = 0 !== (workInProgress2.flags & 128);
      nextResource = newProps.rendering;
      if (null === nextResource)
        if (type) cutOffTailIfNeeded(newProps, false);
        else {
          if (0 !== workInProgressRootExitStatus || null !== current && 0 !== (current.flags & 128))
            for (current = workInProgress2.child; null !== current; ) {
              nextResource = findFirstSuspended(current);
              if (null !== nextResource) {
                workInProgress2.flags |= 128;
                cutOffTailIfNeeded(newProps, false);
                current = nextResource.updateQueue;
                workInProgress2.updateQueue = current;
                scheduleRetryEffect(workInProgress2, current);
                workInProgress2.subtreeFlags = 0;
                current = renderLanes2;
                for (renderLanes2 = workInProgress2.child; null !== renderLanes2; )
                  resetWorkInProgress(renderLanes2, current), renderLanes2 = renderLanes2.sibling;
                push(
                  suspenseStackCursor,
                  suspenseStackCursor.current & 1 | 2
                );
                isHydrating && pushTreeFork(workInProgress2, newProps.treeForkCount);
                return workInProgress2.child;
              }
              current = current.sibling;
            }
          null !== newProps.tail && now() > workInProgressRootRenderTargetTime && (workInProgress2.flags |= 128, type = true, cutOffTailIfNeeded(newProps, false), workInProgress2.lanes = 4194304);
        }
      else {
        if (!type)
          if (current = findFirstSuspended(nextResource), null !== current) {
            if (workInProgress2.flags |= 128, type = true, current = current.updateQueue, workInProgress2.updateQueue = current, scheduleRetryEffect(workInProgress2, current), cutOffTailIfNeeded(newProps, true), null === newProps.tail && "hidden" === newProps.tailMode && !nextResource.alternate && !isHydrating)
              return bubbleProperties(workInProgress2), null;
          } else
            2 * now() - newProps.renderingStartTime > workInProgressRootRenderTargetTime && 536870912 !== renderLanes2 && (workInProgress2.flags |= 128, type = true, cutOffTailIfNeeded(newProps, false), workInProgress2.lanes = 4194304);
        newProps.isBackwards ? (nextResource.sibling = workInProgress2.child, workInProgress2.child = nextResource) : (current = newProps.last, null !== current ? current.sibling = nextResource : workInProgress2.child = nextResource, newProps.last = nextResource);
      }
      if (null !== newProps.tail)
        return current = newProps.tail, newProps.rendering = current, newProps.tail = current.sibling, newProps.renderingStartTime = now(), current.sibling = null, renderLanes2 = suspenseStackCursor.current, push(
          suspenseStackCursor,
          type ? renderLanes2 & 1 | 2 : renderLanes2 & 1
        ), isHydrating && pushTreeFork(workInProgress2, newProps.treeForkCount), current;
      bubbleProperties(workInProgress2);
      return null;
    case 22:
    case 23:
      return popSuspenseHandler(workInProgress2), popHiddenContext(), newProps = null !== workInProgress2.memoizedState, null !== current ? null !== current.memoizedState !== newProps && (workInProgress2.flags |= 8192) : newProps && (workInProgress2.flags |= 8192), newProps ? 0 !== (renderLanes2 & 536870912) && 0 === (workInProgress2.flags & 128) && (bubbleProperties(workInProgress2), workInProgress2.subtreeFlags & 6 && (workInProgress2.flags |= 8192)) : bubbleProperties(workInProgress2), renderLanes2 = workInProgress2.updateQueue, null !== renderLanes2 && scheduleRetryEffect(workInProgress2, renderLanes2.retryQueue), renderLanes2 = null, null !== current && null !== current.memoizedState && null !== current.memoizedState.cachePool && (renderLanes2 = current.memoizedState.cachePool.pool), newProps = null, null !== workInProgress2.memoizedState && null !== workInProgress2.memoizedState.cachePool && (newProps = workInProgress2.memoizedState.cachePool.pool), newProps !== renderLanes2 && (workInProgress2.flags |= 2048), null !== current && pop(resumedCache), null;
    case 24:
      return renderLanes2 = null, null !== current && (renderLanes2 = current.memoizedState.cache), workInProgress2.memoizedState.cache !== renderLanes2 && (workInProgress2.flags |= 2048), popProvider(CacheContext), bubbleProperties(workInProgress2), null;
    case 25:
      return null;
    case 30:
      return null;
  }
  throw Error(formatProdErrorMessage(156, workInProgress2.tag));
}
function unwindWork(current, workInProgress2) {
  popTreeContext(workInProgress2);
  switch (workInProgress2.tag) {
    case 1:
      return current = workInProgress2.flags, current & 65536 ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
    case 3:
      return popProvider(CacheContext), popHostContainer(), current = workInProgress2.flags, 0 !== (current & 65536) && 0 === (current & 128) ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
    case 26:
    case 27:
    case 5:
      return popHostContext(workInProgress2), null;
    case 31:
      if (null !== workInProgress2.memoizedState) {
        popSuspenseHandler(workInProgress2);
        if (null === workInProgress2.alternate)
          throw Error(formatProdErrorMessage(340));
        resetHydrationState();
      }
      current = workInProgress2.flags;
      return current & 65536 ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
    case 13:
      popSuspenseHandler(workInProgress2);
      current = workInProgress2.memoizedState;
      if (null !== current && null !== current.dehydrated) {
        if (null === workInProgress2.alternate)
          throw Error(formatProdErrorMessage(340));
        resetHydrationState();
      }
      current = workInProgress2.flags;
      return current & 65536 ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
    case 19:
      return pop(suspenseStackCursor), null;
    case 4:
      return popHostContainer(), null;
    case 10:
      return popProvider(workInProgress2.type), null;
    case 22:
    case 23:
      return popSuspenseHandler(workInProgress2), popHiddenContext(), null !== current && pop(resumedCache), current = workInProgress2.flags, current & 65536 ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
    case 24:
      return popProvider(CacheContext), null;
    case 25:
      return null;
    default:
      return null;
  }
}
function unwindInterruptedWork(current, interruptedWork) {
  popTreeContext(interruptedWork);
  switch (interruptedWork.tag) {
    case 3:
      popProvider(CacheContext);
      popHostContainer();
      break;
    case 26:
    case 27:
    case 5:
      popHostContext(interruptedWork);
      break;
    case 4:
      popHostContainer();
      break;
    case 31:
      null !== interruptedWork.memoizedState && popSuspenseHandler(interruptedWork);
      break;
    case 13:
      popSuspenseHandler(interruptedWork);
      break;
    case 19:
      pop(suspenseStackCursor);
      break;
    case 10:
      popProvider(interruptedWork.type);
      break;
    case 22:
    case 23:
      popSuspenseHandler(interruptedWork);
      popHiddenContext();
      null !== current && pop(resumedCache);
      break;
    case 24:
      popProvider(CacheContext);
  }
}
function commitHookEffectListMount(flags, finishedWork) {
  try {
    var updateQueue = finishedWork.updateQueue, lastEffect = null !== updateQueue ? updateQueue.lastEffect : null;
    if (null !== lastEffect) {
      var firstEffect = lastEffect.next;
      updateQueue = firstEffect;
      do {
        if ((updateQueue.tag & flags) === flags) {
          lastEffect = void 0;
          var create = updateQueue.create, inst = updateQueue.inst;
          lastEffect = create();
          inst.destroy = lastEffect;
        }
        updateQueue = updateQueue.next;
      } while (updateQueue !== firstEffect);
    }
  } catch (error) {
    captureCommitPhaseError(finishedWork, finishedWork.return, error);
  }
}
function commitHookEffectListUnmount(flags, finishedWork, nearestMountedAncestor$jscomp$0) {
  try {
    var updateQueue = finishedWork.updateQueue, lastEffect = null !== updateQueue ? updateQueue.lastEffect : null;
    if (null !== lastEffect) {
      var firstEffect = lastEffect.next;
      updateQueue = firstEffect;
      do {
        if ((updateQueue.tag & flags) === flags) {
          var inst = updateQueue.inst, destroy = inst.destroy;
          if (void 0 !== destroy) {
            inst.destroy = void 0;
            lastEffect = finishedWork;
            var nearestMountedAncestor = nearestMountedAncestor$jscomp$0, destroy_ = destroy;
            try {
              destroy_();
            } catch (error) {
              captureCommitPhaseError(
                lastEffect,
                nearestMountedAncestor,
                error
              );
            }
          }
        }
        updateQueue = updateQueue.next;
      } while (updateQueue !== firstEffect);
    }
  } catch (error) {
    captureCommitPhaseError(finishedWork, finishedWork.return, error);
  }
}
function commitClassCallbacks(finishedWork) {
  var updateQueue = finishedWork.updateQueue;
  if (null !== updateQueue) {
    var instance = finishedWork.stateNode;
    try {
      commitCallbacks(updateQueue, instance);
    } catch (error) {
      captureCommitPhaseError(finishedWork, finishedWork.return, error);
    }
  }
}
function safelyCallComponentWillUnmount(current, nearestMountedAncestor, instance) {
  instance.props = resolveClassComponentProps(
    current.type,
    current.memoizedProps
  );
  instance.state = current.memoizedState;
  try {
    instance.componentWillUnmount();
  } catch (error) {
    captureCommitPhaseError(current, nearestMountedAncestor, error);
  }
}
function safelyAttachRef(current, nearestMountedAncestor) {
  try {
    var ref = current.ref;
    if (null !== ref) {
      switch (current.tag) {
        case 26:
        case 27:
        case 5:
          var instanceToUse = current.stateNode;
          break;
        case 30:
          instanceToUse = current.stateNode;
          break;
        default:
          instanceToUse = current.stateNode;
      }
      "function" === typeof ref ? current.refCleanup = ref(instanceToUse) : ref.current = instanceToUse;
    }
  } catch (error) {
    captureCommitPhaseError(current, nearestMountedAncestor, error);
  }
}
function safelyDetachRef(current, nearestMountedAncestor) {
  var ref = current.ref, refCleanup = current.refCleanup;
  if (null !== ref)
    if ("function" === typeof refCleanup)
      try {
        refCleanup();
      } catch (error) {
        captureCommitPhaseError(current, nearestMountedAncestor, error);
      } finally {
        current.refCleanup = null, current = current.alternate, null != current && (current.refCleanup = null);
      }
    else if ("function" === typeof ref)
      try {
        ref(null);
      } catch (error$140) {
        captureCommitPhaseError(current, nearestMountedAncestor, error$140);
      }
    else ref.current = null;
}
function commitHostMount(finishedWork) {
  var type = finishedWork.type, props = finishedWork.memoizedProps, instance = finishedWork.stateNode;
  try {
    a: switch (type) {
      case "button":
      case "input":
      case "select":
      case "textarea":
        props.autoFocus && instance.focus();
        break a;
      case "img":
        props.src ? instance.src = props.src : props.srcSet && (instance.srcset = props.srcSet);
    }
  } catch (error) {
    captureCommitPhaseError(finishedWork, finishedWork.return, error);
  }
}
function commitHostUpdate(finishedWork, newProps, oldProps) {
  try {
    var domElement = finishedWork.stateNode;
    updateProperties(domElement, finishedWork.type, oldProps, newProps);
    domElement[internalPropsKey] = newProps;
  } catch (error) {
    captureCommitPhaseError(finishedWork, finishedWork.return, error);
  }
}
function isHostParent(fiber) {
  return 5 === fiber.tag || 3 === fiber.tag || 26 === fiber.tag || 27 === fiber.tag && isSingletonScope(fiber.type) || 4 === fiber.tag;
}
function getHostSibling(fiber) {
  a: for (; ; ) {
    for (; null === fiber.sibling; ) {
      if (null === fiber.return || isHostParent(fiber.return)) return null;
      fiber = fiber.return;
    }
    fiber.sibling.return = fiber.return;
    for (fiber = fiber.sibling; 5 !== fiber.tag && 6 !== fiber.tag && 18 !== fiber.tag; ) {
      if (27 === fiber.tag && isSingletonScope(fiber.type)) continue a;
      if (fiber.flags & 2) continue a;
      if (null === fiber.child || 4 === fiber.tag) continue a;
      else fiber.child.return = fiber, fiber = fiber.child;
    }
    if (!(fiber.flags & 2)) return fiber.stateNode;
  }
}
function insertOrAppendPlacementNodeIntoContainer(node, before, parent) {
  var tag = node.tag;
  if (5 === tag || 6 === tag)
    node = node.stateNode, before ? (9 === parent.nodeType ? parent.body : "HTML" === parent.nodeName ? parent.ownerDocument.body : parent).insertBefore(node, before) : (before = 9 === parent.nodeType ? parent.body : "HTML" === parent.nodeName ? parent.ownerDocument.body : parent, before.appendChild(node), parent = parent._reactRootContainer, null !== parent && void 0 !== parent || null !== before.onclick || (before.onclick = noop$1));
  else if (4 !== tag && (27 === tag && isSingletonScope(node.type) && (parent = node.stateNode, before = null), node = node.child, null !== node))
    for (insertOrAppendPlacementNodeIntoContainer(node, before, parent), node = node.sibling; null !== node; )
      insertOrAppendPlacementNodeIntoContainer(node, before, parent), node = node.sibling;
}
function insertOrAppendPlacementNode(node, before, parent) {
  var tag = node.tag;
  if (5 === tag || 6 === tag)
    node = node.stateNode, before ? parent.insertBefore(node, before) : parent.appendChild(node);
  else if (4 !== tag && (27 === tag && isSingletonScope(node.type) && (parent = node.stateNode), node = node.child, null !== node))
    for (insertOrAppendPlacementNode(node, before, parent), node = node.sibling; null !== node; )
      insertOrAppendPlacementNode(node, before, parent), node = node.sibling;
}
function commitHostSingletonAcquisition(finishedWork) {
  var singleton = finishedWork.stateNode, props = finishedWork.memoizedProps;
  try {
    for (var type = finishedWork.type, attributes = singleton.attributes; attributes.length; )
      singleton.removeAttributeNode(attributes[0]);
    setInitialProperties(singleton, type, props);
    singleton[internalInstanceKey] = finishedWork;
    singleton[internalPropsKey] = props;
  } catch (error) {
    captureCommitPhaseError(finishedWork, finishedWork.return, error);
  }
}
var offscreenSubtreeIsHidden = false, offscreenSubtreeWasHidden = false, needsFormReset = false, PossiblyWeakSet = "function" === typeof WeakSet ? WeakSet : Set, nextEffect = null;
function commitBeforeMutationEffects(root2, firstChild) {
  root2 = root2.containerInfo;
  eventsEnabled = _enabled;
  root2 = getActiveElementDeep(root2);
  if (hasSelectionCapabilities(root2)) {
    if ("selectionStart" in root2)
      var JSCompiler_temp = {
        start: root2.selectionStart,
        end: root2.selectionEnd
      };
    else
      a: {
        JSCompiler_temp = (JSCompiler_temp = root2.ownerDocument) && JSCompiler_temp.defaultView || window;
        var selection = JSCompiler_temp.getSelection && JSCompiler_temp.getSelection();
        if (selection && 0 !== selection.rangeCount) {
          JSCompiler_temp = selection.anchorNode;
          var anchorOffset = selection.anchorOffset, focusNode = selection.focusNode;
          selection = selection.focusOffset;
          try {
            JSCompiler_temp.nodeType, focusNode.nodeType;
          } catch (e$20) {
            JSCompiler_temp = null;
            break a;
          }
          var length = 0, start = -1, end = -1, indexWithinAnchor = 0, indexWithinFocus = 0, node = root2, parentNode = null;
          b: for (; ; ) {
            for (var next; ; ) {
              node !== JSCompiler_temp || 0 !== anchorOffset && 3 !== node.nodeType || (start = length + anchorOffset);
              node !== focusNode || 0 !== selection && 3 !== node.nodeType || (end = length + selection);
              3 === node.nodeType && (length += node.nodeValue.length);
              if (null === (next = node.firstChild)) break;
              parentNode = node;
              node = next;
            }
            for (; ; ) {
              if (node === root2) break b;
              parentNode === JSCompiler_temp && ++indexWithinAnchor === anchorOffset && (start = length);
              parentNode === focusNode && ++indexWithinFocus === selection && (end = length);
              if (null !== (next = node.nextSibling)) break;
              node = parentNode;
              parentNode = node.parentNode;
            }
            node = next;
          }
          JSCompiler_temp = -1 === start || -1 === end ? null : { start, end };
        } else JSCompiler_temp = null;
      }
    JSCompiler_temp = JSCompiler_temp || { start: 0, end: 0 };
  } else JSCompiler_temp = null;
  selectionInformation = { focusedElem: root2, selectionRange: JSCompiler_temp };
  _enabled = false;
  for (nextEffect = firstChild; null !== nextEffect; )
    if (firstChild = nextEffect, root2 = firstChild.child, 0 !== (firstChild.subtreeFlags & 1028) && null !== root2)
      root2.return = firstChild, nextEffect = root2;
    else
      for (; null !== nextEffect; ) {
        firstChild = nextEffect;
        focusNode = firstChild.alternate;
        root2 = firstChild.flags;
        switch (firstChild.tag) {
          case 0:
            if (0 !== (root2 & 4) && (root2 = firstChild.updateQueue, root2 = null !== root2 ? root2.events : null, null !== root2))
              for (JSCompiler_temp = 0; JSCompiler_temp < root2.length; JSCompiler_temp++)
                anchorOffset = root2[JSCompiler_temp], anchorOffset.ref.impl = anchorOffset.nextImpl;
            break;
          case 11:
          case 15:
            break;
          case 1:
            if (0 !== (root2 & 1024) && null !== focusNode) {
              root2 = void 0;
              JSCompiler_temp = firstChild;
              anchorOffset = focusNode.memoizedProps;
              focusNode = focusNode.memoizedState;
              selection = JSCompiler_temp.stateNode;
              try {
                var resolvedPrevProps = resolveClassComponentProps(
                  JSCompiler_temp.type,
                  anchorOffset
                );
                root2 = selection.getSnapshotBeforeUpdate(
                  resolvedPrevProps,
                  focusNode
                );
                selection.__reactInternalSnapshotBeforeUpdate = root2;
              } catch (error) {
                captureCommitPhaseError(
                  JSCompiler_temp,
                  JSCompiler_temp.return,
                  error
                );
              }
            }
            break;
          case 3:
            if (0 !== (root2 & 1024)) {
              if (root2 = firstChild.stateNode.containerInfo, JSCompiler_temp = root2.nodeType, 9 === JSCompiler_temp)
                clearContainerSparingly(root2);
              else if (1 === JSCompiler_temp)
                switch (root2.nodeName) {
                  case "HEAD":
                  case "HTML":
                  case "BODY":
                    clearContainerSparingly(root2);
                    break;
                  default:
                    root2.textContent = "";
                }
            }
            break;
          case 5:
          case 26:
          case 27:
          case 6:
          case 4:
          case 17:
            break;
          default:
            if (0 !== (root2 & 1024)) throw Error(formatProdErrorMessage(163));
        }
        root2 = firstChild.sibling;
        if (null !== root2) {
          root2.return = firstChild.return;
          nextEffect = root2;
          break;
        }
        nextEffect = firstChild.return;
      }
}
function commitLayoutEffectOnFiber(finishedRoot, current, finishedWork) {
  var flags = finishedWork.flags;
  switch (finishedWork.tag) {
    case 0:
    case 11:
    case 15:
      recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
      flags & 4 && commitHookEffectListMount(5, finishedWork);
      break;
    case 1:
      recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
      if (flags & 4)
        if (finishedRoot = finishedWork.stateNode, null === current)
          try {
            finishedRoot.componentDidMount();
          } catch (error) {
            captureCommitPhaseError(finishedWork, finishedWork.return, error);
          }
        else {
          var prevProps = resolveClassComponentProps(
            finishedWork.type,
            current.memoizedProps
          );
          current = current.memoizedState;
          try {
            finishedRoot.componentDidUpdate(
              prevProps,
              current,
              finishedRoot.__reactInternalSnapshotBeforeUpdate
            );
          } catch (error$139) {
            captureCommitPhaseError(
              finishedWork,
              finishedWork.return,
              error$139
            );
          }
        }
      flags & 64 && commitClassCallbacks(finishedWork);
      flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
      break;
    case 3:
      recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
      if (flags & 64 && (finishedRoot = finishedWork.updateQueue, null !== finishedRoot)) {
        current = null;
        if (null !== finishedWork.child)
          switch (finishedWork.child.tag) {
            case 27:
            case 5:
              current = finishedWork.child.stateNode;
              break;
            case 1:
              current = finishedWork.child.stateNode;
          }
        try {
          commitCallbacks(finishedRoot, current);
        } catch (error) {
          captureCommitPhaseError(finishedWork, finishedWork.return, error);
        }
      }
      break;
    case 27:
      null === current && flags & 4 && commitHostSingletonAcquisition(finishedWork);
    case 26:
    case 5:
      recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
      null === current && flags & 4 && commitHostMount(finishedWork);
      flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
      break;
    case 12:
      recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
      break;
    case 31:
      recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
      flags & 4 && commitActivityHydrationCallbacks(finishedRoot, finishedWork);
      break;
    case 13:
      recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
      flags & 4 && commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
      flags & 64 && (finishedRoot = finishedWork.memoizedState, null !== finishedRoot && (finishedRoot = finishedRoot.dehydrated, null !== finishedRoot && (finishedWork = retryDehydratedSuspenseBoundary.bind(
        null,
        finishedWork
      ), registerSuspenseInstanceRetry(finishedRoot, finishedWork))));
      break;
    case 22:
      flags = null !== finishedWork.memoizedState || offscreenSubtreeIsHidden;
      if (!flags) {
        current = null !== current && null !== current.memoizedState || offscreenSubtreeWasHidden;
        prevProps = offscreenSubtreeIsHidden;
        var prevOffscreenSubtreeWasHidden = offscreenSubtreeWasHidden;
        offscreenSubtreeIsHidden = flags;
        (offscreenSubtreeWasHidden = current) && !prevOffscreenSubtreeWasHidden ? recursivelyTraverseReappearLayoutEffects(
          finishedRoot,
          finishedWork,
          0 !== (finishedWork.subtreeFlags & 8772)
        ) : recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
        offscreenSubtreeIsHidden = prevProps;
        offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden;
      }
      break;
    case 30:
      break;
    default:
      recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
  }
}
function detachFiberAfterEffects(fiber) {
  var alternate = fiber.alternate;
  null !== alternate && (fiber.alternate = null, detachFiberAfterEffects(alternate));
  fiber.child = null;
  fiber.deletions = null;
  fiber.sibling = null;
  5 === fiber.tag && (alternate = fiber.stateNode, null !== alternate && detachDeletedInstance(alternate));
  fiber.stateNode = null;
  fiber.return = null;
  fiber.dependencies = null;
  fiber.memoizedProps = null;
  fiber.memoizedState = null;
  fiber.pendingProps = null;
  fiber.stateNode = null;
  fiber.updateQueue = null;
}
var hostParent = null, hostParentIsContainer = false;
function recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, parent) {
  for (parent = parent.child; null !== parent; )
    commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, parent), parent = parent.sibling;
}
function commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, deletedFiber) {
  if (injectedHook && "function" === typeof injectedHook.onCommitFiberUnmount)
    try {
      injectedHook.onCommitFiberUnmount(rendererID, deletedFiber);
    } catch (err) {
    }
  switch (deletedFiber.tag) {
    case 26:
      offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
      recursivelyTraverseDeletionEffects(
        finishedRoot,
        nearestMountedAncestor,
        deletedFiber
      );
      deletedFiber.memoizedState ? deletedFiber.memoizedState.count-- : deletedFiber.stateNode && (deletedFiber = deletedFiber.stateNode, deletedFiber.parentNode.removeChild(deletedFiber));
      break;
    case 27:
      offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
      var prevHostParent = hostParent, prevHostParentIsContainer = hostParentIsContainer;
      isSingletonScope(deletedFiber.type) && (hostParent = deletedFiber.stateNode, hostParentIsContainer = false);
      recursivelyTraverseDeletionEffects(
        finishedRoot,
        nearestMountedAncestor,
        deletedFiber
      );
      releaseSingletonInstance(deletedFiber.stateNode);
      hostParent = prevHostParent;
      hostParentIsContainer = prevHostParentIsContainer;
      break;
    case 5:
      offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
    case 6:
      prevHostParent = hostParent;
      prevHostParentIsContainer = hostParentIsContainer;
      hostParent = null;
      recursivelyTraverseDeletionEffects(
        finishedRoot,
        nearestMountedAncestor,
        deletedFiber
      );
      hostParent = prevHostParent;
      hostParentIsContainer = prevHostParentIsContainer;
      if (null !== hostParent)
        if (hostParentIsContainer)
          try {
            (9 === hostParent.nodeType ? hostParent.body : "HTML" === hostParent.nodeName ? hostParent.ownerDocument.body : hostParent).removeChild(deletedFiber.stateNode);
          } catch (error) {
            captureCommitPhaseError(
              deletedFiber,
              nearestMountedAncestor,
              error
            );
          }
        else
          try {
            hostParent.removeChild(deletedFiber.stateNode);
          } catch (error) {
            captureCommitPhaseError(
              deletedFiber,
              nearestMountedAncestor,
              error
            );
          }
      break;
    case 18:
      null !== hostParent && (hostParentIsContainer ? (finishedRoot = hostParent, clearHydrationBoundary(
        9 === finishedRoot.nodeType ? finishedRoot.body : "HTML" === finishedRoot.nodeName ? finishedRoot.ownerDocument.body : finishedRoot,
        deletedFiber.stateNode
      ), retryIfBlockedOn(finishedRoot)) : clearHydrationBoundary(hostParent, deletedFiber.stateNode));
      break;
    case 4:
      prevHostParent = hostParent;
      prevHostParentIsContainer = hostParentIsContainer;
      hostParent = deletedFiber.stateNode.containerInfo;
      hostParentIsContainer = true;
      recursivelyTraverseDeletionEffects(
        finishedRoot,
        nearestMountedAncestor,
        deletedFiber
      );
      hostParent = prevHostParent;
      hostParentIsContainer = prevHostParentIsContainer;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      commitHookEffectListUnmount(2, deletedFiber, nearestMountedAncestor);
      offscreenSubtreeWasHidden || commitHookEffectListUnmount(4, deletedFiber, nearestMountedAncestor);
      recursivelyTraverseDeletionEffects(
        finishedRoot,
        nearestMountedAncestor,
        deletedFiber
      );
      break;
    case 1:
      offscreenSubtreeWasHidden || (safelyDetachRef(deletedFiber, nearestMountedAncestor), prevHostParent = deletedFiber.stateNode, "function" === typeof prevHostParent.componentWillUnmount && safelyCallComponentWillUnmount(
        deletedFiber,
        nearestMountedAncestor,
        prevHostParent
      ));
      recursivelyTraverseDeletionEffects(
        finishedRoot,
        nearestMountedAncestor,
        deletedFiber
      );
      break;
    case 21:
      recursivelyTraverseDeletionEffects(
        finishedRoot,
        nearestMountedAncestor,
        deletedFiber
      );
      break;
    case 22:
      offscreenSubtreeWasHidden = (prevHostParent = offscreenSubtreeWasHidden) || null !== deletedFiber.memoizedState;
      recursivelyTraverseDeletionEffects(
        finishedRoot,
        nearestMountedAncestor,
        deletedFiber
      );
      offscreenSubtreeWasHidden = prevHostParent;
      break;
    default:
      recursivelyTraverseDeletionEffects(
        finishedRoot,
        nearestMountedAncestor,
        deletedFiber
      );
  }
}
function commitActivityHydrationCallbacks(finishedRoot, finishedWork) {
  if (null === finishedWork.memoizedState && (finishedRoot = finishedWork.alternate, null !== finishedRoot && (finishedRoot = finishedRoot.memoizedState, null !== finishedRoot))) {
    finishedRoot = finishedRoot.dehydrated;
    try {
      retryIfBlockedOn(finishedRoot);
    } catch (error) {
      captureCommitPhaseError(finishedWork, finishedWork.return, error);
    }
  }
}
function commitSuspenseHydrationCallbacks(finishedRoot, finishedWork) {
  if (null === finishedWork.memoizedState && (finishedRoot = finishedWork.alternate, null !== finishedRoot && (finishedRoot = finishedRoot.memoizedState, null !== finishedRoot && (finishedRoot = finishedRoot.dehydrated, null !== finishedRoot))))
    try {
      retryIfBlockedOn(finishedRoot);
    } catch (error) {
      captureCommitPhaseError(finishedWork, finishedWork.return, error);
    }
}
function getRetryCache(finishedWork) {
  switch (finishedWork.tag) {
    case 31:
    case 13:
    case 19:
      var retryCache = finishedWork.stateNode;
      null === retryCache && (retryCache = finishedWork.stateNode = new PossiblyWeakSet());
      return retryCache;
    case 22:
      return finishedWork = finishedWork.stateNode, retryCache = finishedWork._retryCache, null === retryCache && (retryCache = finishedWork._retryCache = new PossiblyWeakSet()), retryCache;
    default:
      throw Error(formatProdErrorMessage(435, finishedWork.tag));
  }
}
function attachSuspenseRetryListeners(finishedWork, wakeables) {
  var retryCache = getRetryCache(finishedWork);
  wakeables.forEach(function(wakeable) {
    if (!retryCache.has(wakeable)) {
      retryCache.add(wakeable);
      var retry = resolveRetryWakeable.bind(null, finishedWork, wakeable);
      wakeable.then(retry, retry);
    }
  });
}
function recursivelyTraverseMutationEffects(root$jscomp$0, parentFiber) {
  var deletions = parentFiber.deletions;
  if (null !== deletions)
    for (var i = 0; i < deletions.length; i++) {
      var childToDelete = deletions[i], root2 = root$jscomp$0, returnFiber = parentFiber, parent = returnFiber;
      a: for (; null !== parent; ) {
        switch (parent.tag) {
          case 27:
            if (isSingletonScope(parent.type)) {
              hostParent = parent.stateNode;
              hostParentIsContainer = false;
              break a;
            }
            break;
          case 5:
            hostParent = parent.stateNode;
            hostParentIsContainer = false;
            break a;
          case 3:
          case 4:
            hostParent = parent.stateNode.containerInfo;
            hostParentIsContainer = true;
            break a;
        }
        parent = parent.return;
      }
      if (null === hostParent) throw Error(formatProdErrorMessage(160));
      commitDeletionEffectsOnFiber(root2, returnFiber, childToDelete);
      hostParent = null;
      hostParentIsContainer = false;
      root2 = childToDelete.alternate;
      null !== root2 && (root2.return = null);
      childToDelete.return = null;
    }
  if (parentFiber.subtreeFlags & 13886)
    for (parentFiber = parentFiber.child; null !== parentFiber; )
      commitMutationEffectsOnFiber(parentFiber, root$jscomp$0), parentFiber = parentFiber.sibling;
}
var currentHoistableRoot = null;
function commitMutationEffectsOnFiber(finishedWork, root2) {
  var current = finishedWork.alternate, flags = finishedWork.flags;
  switch (finishedWork.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      recursivelyTraverseMutationEffects(root2, finishedWork);
      commitReconciliationEffects(finishedWork);
      flags & 4 && (commitHookEffectListUnmount(3, finishedWork, finishedWork.return), commitHookEffectListMount(3, finishedWork), commitHookEffectListUnmount(5, finishedWork, finishedWork.return));
      break;
    case 1:
      recursivelyTraverseMutationEffects(root2, finishedWork);
      commitReconciliationEffects(finishedWork);
      flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
      flags & 64 && offscreenSubtreeIsHidden && (finishedWork = finishedWork.updateQueue, null !== finishedWork && (flags = finishedWork.callbacks, null !== flags && (current = finishedWork.shared.hiddenCallbacks, finishedWork.shared.hiddenCallbacks = null === current ? flags : current.concat(flags))));
      break;
    case 26:
      var hoistableRoot = currentHoistableRoot;
      recursivelyTraverseMutationEffects(root2, finishedWork);
      commitReconciliationEffects(finishedWork);
      flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
      if (flags & 4) {
        var currentResource = null !== current ? current.memoizedState : null;
        flags = finishedWork.memoizedState;
        if (null === current)
          if (null === flags)
            if (null === finishedWork.stateNode) {
              a: {
                flags = finishedWork.type;
                current = finishedWork.memoizedProps;
                hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
                b: switch (flags) {
                  case "title":
                    currentResource = hoistableRoot.getElementsByTagName("title")[0];
                    if (!currentResource || currentResource[internalHoistableMarker] || currentResource[internalInstanceKey] || "http://www.w3.org/2000/svg" === currentResource.namespaceURI || currentResource.hasAttribute("itemprop"))
                      currentResource = hoistableRoot.createElement(flags), hoistableRoot.head.insertBefore(
                        currentResource,
                        hoistableRoot.querySelector("head > title")
                      );
                    setInitialProperties(currentResource, flags, current);
                    currentResource[internalInstanceKey] = finishedWork;
                    markNodeAsHoistable(currentResource);
                    flags = currentResource;
                    break a;
                  case "link":
                    var maybeNodes = getHydratableHoistableCache(
                      "link",
                      "href",
                      hoistableRoot
                    ).get(flags + (current.href || ""));
                    if (maybeNodes) {
                      for (var i = 0; i < maybeNodes.length; i++)
                        if (currentResource = maybeNodes[i], currentResource.getAttribute("href") === (null == current.href || "" === current.href ? null : current.href) && currentResource.getAttribute("rel") === (null == current.rel ? null : current.rel) && currentResource.getAttribute("title") === (null == current.title ? null : current.title) && currentResource.getAttribute("crossorigin") === (null == current.crossOrigin ? null : current.crossOrigin)) {
                          maybeNodes.splice(i, 1);
                          break b;
                        }
                    }
                    currentResource = hoistableRoot.createElement(flags);
                    setInitialProperties(currentResource, flags, current);
                    hoistableRoot.head.appendChild(currentResource);
                    break;
                  case "meta":
                    if (maybeNodes = getHydratableHoistableCache(
                      "meta",
                      "content",
                      hoistableRoot
                    ).get(flags + (current.content || ""))) {
                      for (i = 0; i < maybeNodes.length; i++)
                        if (currentResource = maybeNodes[i], currentResource.getAttribute("content") === (null == current.content ? null : "" + current.content) && currentResource.getAttribute("name") === (null == current.name ? null : current.name) && currentResource.getAttribute("property") === (null == current.property ? null : current.property) && currentResource.getAttribute("http-equiv") === (null == current.httpEquiv ? null : current.httpEquiv) && currentResource.getAttribute("charset") === (null == current.charSet ? null : current.charSet)) {
                          maybeNodes.splice(i, 1);
                          break b;
                        }
                    }
                    currentResource = hoistableRoot.createElement(flags);
                    setInitialProperties(currentResource, flags, current);
                    hoistableRoot.head.appendChild(currentResource);
                    break;
                  default:
                    throw Error(formatProdErrorMessage(468, flags));
                }
                currentResource[internalInstanceKey] = finishedWork;
                markNodeAsHoistable(currentResource);
                flags = currentResource;
              }
              finishedWork.stateNode = flags;
            } else
              mountHoistable(
                hoistableRoot,
                finishedWork.type,
                finishedWork.stateNode
              );
          else
            finishedWork.stateNode = acquireResource(
              hoistableRoot,
              flags,
              finishedWork.memoizedProps
            );
        else
          currentResource !== flags ? (null === currentResource ? null !== current.stateNode && (current = current.stateNode, current.parentNode.removeChild(current)) : currentResource.count--, null === flags ? mountHoistable(
            hoistableRoot,
            finishedWork.type,
            finishedWork.stateNode
          ) : acquireResource(
            hoistableRoot,
            flags,
            finishedWork.memoizedProps
          )) : null === flags && null !== finishedWork.stateNode && commitHostUpdate(
            finishedWork,
            finishedWork.memoizedProps,
            current.memoizedProps
          );
      }
      break;
    case 27:
      recursivelyTraverseMutationEffects(root2, finishedWork);
      commitReconciliationEffects(finishedWork);
      flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
      null !== current && flags & 4 && commitHostUpdate(
        finishedWork,
        finishedWork.memoizedProps,
        current.memoizedProps
      );
      break;
    case 5:
      recursivelyTraverseMutationEffects(root2, finishedWork);
      commitReconciliationEffects(finishedWork);
      flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
      if (finishedWork.flags & 32) {
        hoistableRoot = finishedWork.stateNode;
        try {
          setTextContent(hoistableRoot, "");
        } catch (error) {
          captureCommitPhaseError(finishedWork, finishedWork.return, error);
        }
      }
      flags & 4 && null != finishedWork.stateNode && (hoistableRoot = finishedWork.memoizedProps, commitHostUpdate(
        finishedWork,
        hoistableRoot,
        null !== current ? current.memoizedProps : hoistableRoot
      ));
      flags & 1024 && (needsFormReset = true);
      break;
    case 6:
      recursivelyTraverseMutationEffects(root2, finishedWork);
      commitReconciliationEffects(finishedWork);
      if (flags & 4) {
        if (null === finishedWork.stateNode)
          throw Error(formatProdErrorMessage(162));
        flags = finishedWork.memoizedProps;
        current = finishedWork.stateNode;
        try {
          current.nodeValue = flags;
        } catch (error) {
          captureCommitPhaseError(finishedWork, finishedWork.return, error);
        }
      }
      break;
    case 3:
      tagCaches = null;
      hoistableRoot = currentHoistableRoot;
      currentHoistableRoot = getHoistableRoot(root2.containerInfo);
      recursivelyTraverseMutationEffects(root2, finishedWork);
      currentHoistableRoot = hoistableRoot;
      commitReconciliationEffects(finishedWork);
      if (flags & 4 && null !== current && current.memoizedState.isDehydrated)
        try {
          retryIfBlockedOn(root2.containerInfo);
        } catch (error) {
          captureCommitPhaseError(finishedWork, finishedWork.return, error);
        }
      needsFormReset && (needsFormReset = false, recursivelyResetForms(finishedWork));
      break;
    case 4:
      flags = currentHoistableRoot;
      currentHoistableRoot = getHoistableRoot(
        finishedWork.stateNode.containerInfo
      );
      recursivelyTraverseMutationEffects(root2, finishedWork);
      commitReconciliationEffects(finishedWork);
      currentHoistableRoot = flags;
      break;
    case 12:
      recursivelyTraverseMutationEffects(root2, finishedWork);
      commitReconciliationEffects(finishedWork);
      break;
    case 31:
      recursivelyTraverseMutationEffects(root2, finishedWork);
      commitReconciliationEffects(finishedWork);
      flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, flags)));
      break;
    case 13:
      recursivelyTraverseMutationEffects(root2, finishedWork);
      commitReconciliationEffects(finishedWork);
      finishedWork.child.flags & 8192 && null !== finishedWork.memoizedState !== (null !== current && null !== current.memoizedState) && (globalMostRecentFallbackTime = now());
      flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, flags)));
      break;
    case 22:
      hoistableRoot = null !== finishedWork.memoizedState;
      var wasHidden = null !== current && null !== current.memoizedState, prevOffscreenSubtreeIsHidden = offscreenSubtreeIsHidden, prevOffscreenSubtreeWasHidden = offscreenSubtreeWasHidden;
      offscreenSubtreeIsHidden = prevOffscreenSubtreeIsHidden || hoistableRoot;
      offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden || wasHidden;
      recursivelyTraverseMutationEffects(root2, finishedWork);
      offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden;
      offscreenSubtreeIsHidden = prevOffscreenSubtreeIsHidden;
      commitReconciliationEffects(finishedWork);
      if (flags & 8192)
        a: for (root2 = finishedWork.stateNode, root2._visibility = hoistableRoot ? root2._visibility & -2 : root2._visibility | 1, hoistableRoot && (null === current || wasHidden || offscreenSubtreeIsHidden || offscreenSubtreeWasHidden || recursivelyTraverseDisappearLayoutEffects(finishedWork)), current = null, root2 = finishedWork; ; ) {
          if (5 === root2.tag || 26 === root2.tag) {
            if (null === current) {
              wasHidden = current = root2;
              try {
                if (currentResource = wasHidden.stateNode, hoistableRoot)
                  maybeNodes = currentResource.style, "function" === typeof maybeNodes.setProperty ? maybeNodes.setProperty("display", "none", "important") : maybeNodes.display = "none";
                else {
                  i = wasHidden.stateNode;
                  var styleProp = wasHidden.memoizedProps.style, display = void 0 !== styleProp && null !== styleProp && styleProp.hasOwnProperty("display") ? styleProp.display : null;
                  i.style.display = null == display || "boolean" === typeof display ? "" : ("" + display).trim();
                }
              } catch (error) {
                captureCommitPhaseError(wasHidden, wasHidden.return, error);
              }
            }
          } else if (6 === root2.tag) {
            if (null === current) {
              wasHidden = root2;
              try {
                wasHidden.stateNode.nodeValue = hoistableRoot ? "" : wasHidden.memoizedProps;
              } catch (error) {
                captureCommitPhaseError(wasHidden, wasHidden.return, error);
              }
            }
          } else if (18 === root2.tag) {
            if (null === current) {
              wasHidden = root2;
              try {
                var instance = wasHidden.stateNode;
                hoistableRoot ? hideOrUnhideDehydratedBoundary(instance, true) : hideOrUnhideDehydratedBoundary(wasHidden.stateNode, false);
              } catch (error) {
                captureCommitPhaseError(wasHidden, wasHidden.return, error);
              }
            }
          } else if ((22 !== root2.tag && 23 !== root2.tag || null === root2.memoizedState || root2 === finishedWork) && null !== root2.child) {
            root2.child.return = root2;
            root2 = root2.child;
            continue;
          }
          if (root2 === finishedWork) break a;
          for (; null === root2.sibling; ) {
            if (null === root2.return || root2.return === finishedWork) break a;
            current === root2 && (current = null);
            root2 = root2.return;
          }
          current === root2 && (current = null);
          root2.sibling.return = root2.return;
          root2 = root2.sibling;
        }
      flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (current = flags.retryQueue, null !== current && (flags.retryQueue = null, attachSuspenseRetryListeners(finishedWork, current))));
      break;
    case 19:
      recursivelyTraverseMutationEffects(root2, finishedWork);
      commitReconciliationEffects(finishedWork);
      flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, flags)));
      break;
    case 30:
      break;
    case 21:
      break;
    default:
      recursivelyTraverseMutationEffects(root2, finishedWork), commitReconciliationEffects(finishedWork);
  }
}
function commitReconciliationEffects(finishedWork) {
  var flags = finishedWork.flags;
  if (flags & 2) {
    try {
      for (var hostParentFiber, parentFiber = finishedWork.return; null !== parentFiber; ) {
        if (isHostParent(parentFiber)) {
          hostParentFiber = parentFiber;
          break;
        }
        parentFiber = parentFiber.return;
      }
      if (null == hostParentFiber) throw Error(formatProdErrorMessage(160));
      switch (hostParentFiber.tag) {
        case 27:
          var parent = hostParentFiber.stateNode, before = getHostSibling(finishedWork);
          insertOrAppendPlacementNode(finishedWork, before, parent);
          break;
        case 5:
          var parent$141 = hostParentFiber.stateNode;
          hostParentFiber.flags & 32 && (setTextContent(parent$141, ""), hostParentFiber.flags &= -33);
          var before$142 = getHostSibling(finishedWork);
          insertOrAppendPlacementNode(finishedWork, before$142, parent$141);
          break;
        case 3:
        case 4:
          var parent$143 = hostParentFiber.stateNode.containerInfo, before$144 = getHostSibling(finishedWork);
          insertOrAppendPlacementNodeIntoContainer(
            finishedWork,
            before$144,
            parent$143
          );
          break;
        default:
          throw Error(formatProdErrorMessage(161));
      }
    } catch (error) {
      captureCommitPhaseError(finishedWork, finishedWork.return, error);
    }
    finishedWork.flags &= -3;
  }
  flags & 4096 && (finishedWork.flags &= -4097);
}
function recursivelyResetForms(parentFiber) {
  if (parentFiber.subtreeFlags & 1024)
    for (parentFiber = parentFiber.child; null !== parentFiber; ) {
      var fiber = parentFiber;
      recursivelyResetForms(fiber);
      5 === fiber.tag && fiber.flags & 1024 && fiber.stateNode.reset();
      parentFiber = parentFiber.sibling;
    }
}
function recursivelyTraverseLayoutEffects(root2, parentFiber) {
  if (parentFiber.subtreeFlags & 8772)
    for (parentFiber = parentFiber.child; null !== parentFiber; )
      commitLayoutEffectOnFiber(root2, parentFiber.alternate, parentFiber), parentFiber = parentFiber.sibling;
}
function recursivelyTraverseDisappearLayoutEffects(parentFiber) {
  for (parentFiber = parentFiber.child; null !== parentFiber; ) {
    var finishedWork = parentFiber;
    switch (finishedWork.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        commitHookEffectListUnmount(4, finishedWork, finishedWork.return);
        recursivelyTraverseDisappearLayoutEffects(finishedWork);
        break;
      case 1:
        safelyDetachRef(finishedWork, finishedWork.return);
        var instance = finishedWork.stateNode;
        "function" === typeof instance.componentWillUnmount && safelyCallComponentWillUnmount(
          finishedWork,
          finishedWork.return,
          instance
        );
        recursivelyTraverseDisappearLayoutEffects(finishedWork);
        break;
      case 27:
        releaseSingletonInstance(finishedWork.stateNode);
      case 26:
      case 5:
        safelyDetachRef(finishedWork, finishedWork.return);
        recursivelyTraverseDisappearLayoutEffects(finishedWork);
        break;
      case 22:
        null === finishedWork.memoizedState && recursivelyTraverseDisappearLayoutEffects(finishedWork);
        break;
      case 30:
        recursivelyTraverseDisappearLayoutEffects(finishedWork);
        break;
      default:
        recursivelyTraverseDisappearLayoutEffects(finishedWork);
    }
    parentFiber = parentFiber.sibling;
  }
}
function recursivelyTraverseReappearLayoutEffects(finishedRoot$jscomp$0, parentFiber, includeWorkInProgressEffects) {
  includeWorkInProgressEffects = includeWorkInProgressEffects && 0 !== (parentFiber.subtreeFlags & 8772);
  for (parentFiber = parentFiber.child; null !== parentFiber; ) {
    var current = parentFiber.alternate, finishedRoot = finishedRoot$jscomp$0, finishedWork = parentFiber, flags = finishedWork.flags;
    switch (finishedWork.tag) {
      case 0:
      case 11:
      case 15:
        recursivelyTraverseReappearLayoutEffects(
          finishedRoot,
          finishedWork,
          includeWorkInProgressEffects
        );
        commitHookEffectListMount(4, finishedWork);
        break;
      case 1:
        recursivelyTraverseReappearLayoutEffects(
          finishedRoot,
          finishedWork,
          includeWorkInProgressEffects
        );
        current = finishedWork;
        finishedRoot = current.stateNode;
        if ("function" === typeof finishedRoot.componentDidMount)
          try {
            finishedRoot.componentDidMount();
          } catch (error) {
            captureCommitPhaseError(current, current.return, error);
          }
        current = finishedWork;
        finishedRoot = current.updateQueue;
        if (null !== finishedRoot) {
          var instance = current.stateNode;
          try {
            var hiddenCallbacks = finishedRoot.shared.hiddenCallbacks;
            if (null !== hiddenCallbacks)
              for (finishedRoot.shared.hiddenCallbacks = null, finishedRoot = 0; finishedRoot < hiddenCallbacks.length; finishedRoot++)
                callCallback(hiddenCallbacks[finishedRoot], instance);
          } catch (error) {
            captureCommitPhaseError(current, current.return, error);
          }
        }
        includeWorkInProgressEffects && flags & 64 && commitClassCallbacks(finishedWork);
        safelyAttachRef(finishedWork, finishedWork.return);
        break;
      case 27:
        commitHostSingletonAcquisition(finishedWork);
      case 26:
      case 5:
        recursivelyTraverseReappearLayoutEffects(
          finishedRoot,
          finishedWork,
          includeWorkInProgressEffects
        );
        includeWorkInProgressEffects && null === current && flags & 4 && commitHostMount(finishedWork);
        safelyAttachRef(finishedWork, finishedWork.return);
        break;
      case 12:
        recursivelyTraverseReappearLayoutEffects(
          finishedRoot,
          finishedWork,
          includeWorkInProgressEffects
        );
        break;
      case 31:
        recursivelyTraverseReappearLayoutEffects(
          finishedRoot,
          finishedWork,
          includeWorkInProgressEffects
        );
        includeWorkInProgressEffects && flags & 4 && commitActivityHydrationCallbacks(finishedRoot, finishedWork);
        break;
      case 13:
        recursivelyTraverseReappearLayoutEffects(
          finishedRoot,
          finishedWork,
          includeWorkInProgressEffects
        );
        includeWorkInProgressEffects && flags & 4 && commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
        break;
      case 22:
        null === finishedWork.memoizedState && recursivelyTraverseReappearLayoutEffects(
          finishedRoot,
          finishedWork,
          includeWorkInProgressEffects
        );
        safelyAttachRef(finishedWork, finishedWork.return);
        break;
      case 30:
        break;
      default:
        recursivelyTraverseReappearLayoutEffects(
          finishedRoot,
          finishedWork,
          includeWorkInProgressEffects
        );
    }
    parentFiber = parentFiber.sibling;
  }
}
function commitOffscreenPassiveMountEffects(current, finishedWork) {
  var previousCache = null;
  null !== current && null !== current.memoizedState && null !== current.memoizedState.cachePool && (previousCache = current.memoizedState.cachePool.pool);
  current = null;
  null !== finishedWork.memoizedState && null !== finishedWork.memoizedState.cachePool && (current = finishedWork.memoizedState.cachePool.pool);
  current !== previousCache && (null != current && current.refCount++, null != previousCache && releaseCache(previousCache));
}
function commitCachePassiveMountEffect(current, finishedWork) {
  current = null;
  null !== finishedWork.alternate && (current = finishedWork.alternate.memoizedState.cache);
  finishedWork = finishedWork.memoizedState.cache;
  finishedWork !== current && (finishedWork.refCount++, null != current && releaseCache(current));
}
function recursivelyTraversePassiveMountEffects(root2, parentFiber, committedLanes, committedTransitions) {
  if (parentFiber.subtreeFlags & 10256)
    for (parentFiber = parentFiber.child; null !== parentFiber; )
      commitPassiveMountOnFiber(
        root2,
        parentFiber,
        committedLanes,
        committedTransitions
      ), parentFiber = parentFiber.sibling;
}
function commitPassiveMountOnFiber(finishedRoot, finishedWork, committedLanes, committedTransitions) {
  var flags = finishedWork.flags;
  switch (finishedWork.tag) {
    case 0:
    case 11:
    case 15:
      recursivelyTraversePassiveMountEffects(
        finishedRoot,
        finishedWork,
        committedLanes,
        committedTransitions
      );
      flags & 2048 && commitHookEffectListMount(9, finishedWork);
      break;
    case 1:
      recursivelyTraversePassiveMountEffects(
        finishedRoot,
        finishedWork,
        committedLanes,
        committedTransitions
      );
      break;
    case 3:
      recursivelyTraversePassiveMountEffects(
        finishedRoot,
        finishedWork,
        committedLanes,
        committedTransitions
      );
      flags & 2048 && (finishedRoot = null, null !== finishedWork.alternate && (finishedRoot = finishedWork.alternate.memoizedState.cache), finishedWork = finishedWork.memoizedState.cache, finishedWork !== finishedRoot && (finishedWork.refCount++, null != finishedRoot && releaseCache(finishedRoot)));
      break;
    case 12:
      if (flags & 2048) {
        recursivelyTraversePassiveMountEffects(
          finishedRoot,
          finishedWork,
          committedLanes,
          committedTransitions
        );
        finishedRoot = finishedWork.stateNode;
        try {
          var _finishedWork$memoize2 = finishedWork.memoizedProps, id = _finishedWork$memoize2.id, onPostCommit = _finishedWork$memoize2.onPostCommit;
          "function" === typeof onPostCommit && onPostCommit(
            id,
            null === finishedWork.alternate ? "mount" : "update",
            finishedRoot.passiveEffectDuration,
            -0
          );
        } catch (error) {
          captureCommitPhaseError(finishedWork, finishedWork.return, error);
        }
      } else
        recursivelyTraversePassiveMountEffects(
          finishedRoot,
          finishedWork,
          committedLanes,
          committedTransitions
        );
      break;
    case 31:
      recursivelyTraversePassiveMountEffects(
        finishedRoot,
        finishedWork,
        committedLanes,
        committedTransitions
      );
      break;
    case 13:
      recursivelyTraversePassiveMountEffects(
        finishedRoot,
        finishedWork,
        committedLanes,
        committedTransitions
      );
      break;
    case 23:
      break;
    case 22:
      _finishedWork$memoize2 = finishedWork.stateNode;
      id = finishedWork.alternate;
      null !== finishedWork.memoizedState ? _finishedWork$memoize2._visibility & 2 ? recursivelyTraversePassiveMountEffects(
        finishedRoot,
        finishedWork,
        committedLanes,
        committedTransitions
      ) : recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork) : _finishedWork$memoize2._visibility & 2 ? recursivelyTraversePassiveMountEffects(
        finishedRoot,
        finishedWork,
        committedLanes,
        committedTransitions
      ) : (_finishedWork$memoize2._visibility |= 2, recursivelyTraverseReconnectPassiveEffects(
        finishedRoot,
        finishedWork,
        committedLanes,
        committedTransitions,
        0 !== (finishedWork.subtreeFlags & 10256) || false
      ));
      flags & 2048 && commitOffscreenPassiveMountEffects(id, finishedWork);
      break;
    case 24:
      recursivelyTraversePassiveMountEffects(
        finishedRoot,
        finishedWork,
        committedLanes,
        committedTransitions
      );
      flags & 2048 && commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
      break;
    default:
      recursivelyTraversePassiveMountEffects(
        finishedRoot,
        finishedWork,
        committedLanes,
        committedTransitions
      );
  }
}
function recursivelyTraverseReconnectPassiveEffects(finishedRoot$jscomp$0, parentFiber, committedLanes$jscomp$0, committedTransitions$jscomp$0, includeWorkInProgressEffects) {
  includeWorkInProgressEffects = includeWorkInProgressEffects && (0 !== (parentFiber.subtreeFlags & 10256) || false);
  for (parentFiber = parentFiber.child; null !== parentFiber; ) {
    var finishedRoot = finishedRoot$jscomp$0, finishedWork = parentFiber, committedLanes = committedLanes$jscomp$0, committedTransitions = committedTransitions$jscomp$0, flags = finishedWork.flags;
    switch (finishedWork.tag) {
      case 0:
      case 11:
      case 15:
        recursivelyTraverseReconnectPassiveEffects(
          finishedRoot,
          finishedWork,
          committedLanes,
          committedTransitions,
          includeWorkInProgressEffects
        );
        commitHookEffectListMount(8, finishedWork);
        break;
      case 23:
        break;
      case 22:
        var instance = finishedWork.stateNode;
        null !== finishedWork.memoizedState ? instance._visibility & 2 ? recursivelyTraverseReconnectPassiveEffects(
          finishedRoot,
          finishedWork,
          committedLanes,
          committedTransitions,
          includeWorkInProgressEffects
        ) : recursivelyTraverseAtomicPassiveEffects(
          finishedRoot,
          finishedWork
        ) : (instance._visibility |= 2, recursivelyTraverseReconnectPassiveEffects(
          finishedRoot,
          finishedWork,
          committedLanes,
          committedTransitions,
          includeWorkInProgressEffects
        ));
        includeWorkInProgressEffects && flags & 2048 && commitOffscreenPassiveMountEffects(
          finishedWork.alternate,
          finishedWork
        );
        break;
      case 24:
        recursivelyTraverseReconnectPassiveEffects(
          finishedRoot,
          finishedWork,
          committedLanes,
          committedTransitions,
          includeWorkInProgressEffects
        );
        includeWorkInProgressEffects && flags & 2048 && commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
        break;
      default:
        recursivelyTraverseReconnectPassiveEffects(
          finishedRoot,
          finishedWork,
          committedLanes,
          committedTransitions,
          includeWorkInProgressEffects
        );
    }
    parentFiber = parentFiber.sibling;
  }
}
function recursivelyTraverseAtomicPassiveEffects(finishedRoot$jscomp$0, parentFiber) {
  if (parentFiber.subtreeFlags & 10256)
    for (parentFiber = parentFiber.child; null !== parentFiber; ) {
      var finishedRoot = finishedRoot$jscomp$0, finishedWork = parentFiber, flags = finishedWork.flags;
      switch (finishedWork.tag) {
        case 22:
          recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
          flags & 2048 && commitOffscreenPassiveMountEffects(
            finishedWork.alternate,
            finishedWork
          );
          break;
        case 24:
          recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
          flags & 2048 && commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
          break;
        default:
          recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
      }
      parentFiber = parentFiber.sibling;
    }
}
var suspenseyCommitFlag = 8192;
function recursivelyAccumulateSuspenseyCommit(parentFiber, committedLanes, suspendedState) {
  if (parentFiber.subtreeFlags & suspenseyCommitFlag)
    for (parentFiber = parentFiber.child; null !== parentFiber; )
      accumulateSuspenseyCommitOnFiber(
        parentFiber,
        committedLanes,
        suspendedState
      ), parentFiber = parentFiber.sibling;
}
function accumulateSuspenseyCommitOnFiber(fiber, committedLanes, suspendedState) {
  switch (fiber.tag) {
    case 26:
      recursivelyAccumulateSuspenseyCommit(
        fiber,
        committedLanes,
        suspendedState
      );
      fiber.flags & suspenseyCommitFlag && null !== fiber.memoizedState && suspendResource(
        suspendedState,
        currentHoistableRoot,
        fiber.memoizedState,
        fiber.memoizedProps
      );
      break;
    case 5:
      recursivelyAccumulateSuspenseyCommit(
        fiber,
        committedLanes,
        suspendedState
      );
      break;
    case 3:
    case 4:
      var previousHoistableRoot = currentHoistableRoot;
      currentHoistableRoot = getHoistableRoot(fiber.stateNode.containerInfo);
      recursivelyAccumulateSuspenseyCommit(
        fiber,
        committedLanes,
        suspendedState
      );
      currentHoistableRoot = previousHoistableRoot;
      break;
    case 22:
      null === fiber.memoizedState && (previousHoistableRoot = fiber.alternate, null !== previousHoistableRoot && null !== previousHoistableRoot.memoizedState ? (previousHoistableRoot = suspenseyCommitFlag, suspenseyCommitFlag = 16777216, recursivelyAccumulateSuspenseyCommit(
        fiber,
        committedLanes,
        suspendedState
      ), suspenseyCommitFlag = previousHoistableRoot) : recursivelyAccumulateSuspenseyCommit(
        fiber,
        committedLanes,
        suspendedState
      ));
      break;
    default:
      recursivelyAccumulateSuspenseyCommit(
        fiber,
        committedLanes,
        suspendedState
      );
  }
}
function detachAlternateSiblings(parentFiber) {
  var previousFiber = parentFiber.alternate;
  if (null !== previousFiber && (parentFiber = previousFiber.child, null !== parentFiber)) {
    previousFiber.child = null;
    do
      previousFiber = parentFiber.sibling, parentFiber.sibling = null, parentFiber = previousFiber;
    while (null !== parentFiber);
  }
}
function recursivelyTraversePassiveUnmountEffects(parentFiber) {
  var deletions = parentFiber.deletions;
  if (0 !== (parentFiber.flags & 16)) {
    if (null !== deletions)
      for (var i = 0; i < deletions.length; i++) {
        var childToDelete = deletions[i];
        nextEffect = childToDelete;
        commitPassiveUnmountEffectsInsideOfDeletedTree_begin(
          childToDelete,
          parentFiber
        );
      }
    detachAlternateSiblings(parentFiber);
  }
  if (parentFiber.subtreeFlags & 10256)
    for (parentFiber = parentFiber.child; null !== parentFiber; )
      commitPassiveUnmountOnFiber(parentFiber), parentFiber = parentFiber.sibling;
}
function commitPassiveUnmountOnFiber(finishedWork) {
  switch (finishedWork.tag) {
    case 0:
    case 11:
    case 15:
      recursivelyTraversePassiveUnmountEffects(finishedWork);
      finishedWork.flags & 2048 && commitHookEffectListUnmount(9, finishedWork, finishedWork.return);
      break;
    case 3:
      recursivelyTraversePassiveUnmountEffects(finishedWork);
      break;
    case 12:
      recursivelyTraversePassiveUnmountEffects(finishedWork);
      break;
    case 22:
      var instance = finishedWork.stateNode;
      null !== finishedWork.memoizedState && instance._visibility & 2 && (null === finishedWork.return || 13 !== finishedWork.return.tag) ? (instance._visibility &= -3, recursivelyTraverseDisconnectPassiveEffects(finishedWork)) : recursivelyTraversePassiveUnmountEffects(finishedWork);
      break;
    default:
      recursivelyTraversePassiveUnmountEffects(finishedWork);
  }
}
function recursivelyTraverseDisconnectPassiveEffects(parentFiber) {
  var deletions = parentFiber.deletions;
  if (0 !== (parentFiber.flags & 16)) {
    if (null !== deletions)
      for (var i = 0; i < deletions.length; i++) {
        var childToDelete = deletions[i];
        nextEffect = childToDelete;
        commitPassiveUnmountEffectsInsideOfDeletedTree_begin(
          childToDelete,
          parentFiber
        );
      }
    detachAlternateSiblings(parentFiber);
  }
  for (parentFiber = parentFiber.child; null !== parentFiber; ) {
    deletions = parentFiber;
    switch (deletions.tag) {
      case 0:
      case 11:
      case 15:
        commitHookEffectListUnmount(8, deletions, deletions.return);
        recursivelyTraverseDisconnectPassiveEffects(deletions);
        break;
      case 22:
        i = deletions.stateNode;
        i._visibility & 2 && (i._visibility &= -3, recursivelyTraverseDisconnectPassiveEffects(deletions));
        break;
      default:
        recursivelyTraverseDisconnectPassiveEffects(deletions);
    }
    parentFiber = parentFiber.sibling;
  }
}
function commitPassiveUnmountEffectsInsideOfDeletedTree_begin(deletedSubtreeRoot, nearestMountedAncestor) {
  for (; null !== nextEffect; ) {
    var fiber = nextEffect;
    switch (fiber.tag) {
      case 0:
      case 11:
      case 15:
        commitHookEffectListUnmount(8, fiber, nearestMountedAncestor);
        break;
      case 23:
      case 22:
        if (null !== fiber.memoizedState && null !== fiber.memoizedState.cachePool) {
          var cache = fiber.memoizedState.cachePool.pool;
          null != cache && cache.refCount++;
        }
        break;
      case 24:
        releaseCache(fiber.memoizedState.cache);
    }
    cache = fiber.child;
    if (null !== cache) cache.return = fiber, nextEffect = cache;
    else
      a: for (fiber = deletedSubtreeRoot; null !== nextEffect; ) {
        cache = nextEffect;
        var sibling = cache.sibling, returnFiber = cache.return;
        detachFiberAfterEffects(cache);
        if (cache === fiber) {
          nextEffect = null;
          break a;
        }
        if (null !== sibling) {
          sibling.return = returnFiber;
          nextEffect = sibling;
          break a;
        }
        nextEffect = returnFiber;
      }
  }
}
var DefaultAsyncDispatcher = {
  getCacheForType: function(resourceType) {
    var cache = readContext(CacheContext), cacheForType = cache.data.get(resourceType);
    void 0 === cacheForType && (cacheForType = resourceType(), cache.data.set(resourceType, cacheForType));
    return cacheForType;
  },
  cacheSignal: function() {
    return readContext(CacheContext).controller.signal;
  }
}, PossiblyWeakMap = "function" === typeof WeakMap ? WeakMap : Map, executionContext = 0, workInProgressRoot = null, workInProgress = null, workInProgressRootRenderLanes = 0, workInProgressSuspendedReason = 0, workInProgressThrownValue = null, workInProgressRootDidSkipSuspendedSiblings = false, workInProgressRootIsPrerendering = false, workInProgressRootDidAttachPingListener = false, entangledRenderLanes = 0, workInProgressRootExitStatus = 0, workInProgressRootSkippedLanes = 0, workInProgressRootInterleavedUpdatedLanes = 0, workInProgressRootPingedLanes = 0, workInProgressDeferredLane = 0, workInProgressSuspendedRetryLanes = 0, workInProgressRootConcurrentErrors = null, workInProgressRootRecoverableErrors = null, workInProgressRootDidIncludeRecursiveRenderUpdate = false, globalMostRecentFallbackTime = 0, globalMostRecentTransitionTime = 0, workInProgressRootRenderTargetTime = Infinity, workInProgressTransitions = null, legacyErrorBoundariesThatAlreadyFailed = null, pendingEffectsStatus = 0, pendingEffectsRoot = null, pendingFinishedWork = null, pendingEffectsLanes = 0, pendingEffectsRemainingLanes = 0, pendingPassiveTransitions = null, pendingRecoverableErrors = null, nestedUpdateCount = 0, rootWithNestedUpdates = null;
function requestUpdateLane() {
  return 0 !== (executionContext & 2) && 0 !== workInProgressRootRenderLanes ? workInProgressRootRenderLanes & -workInProgressRootRenderLanes : null !== ReactSharedInternals.T ? requestTransitionLane() : resolveUpdatePriority();
}
function requestDeferredLane() {
  if (0 === workInProgressDeferredLane)
    if (0 === (workInProgressRootRenderLanes & 536870912) || isHydrating) {
      var lane = nextTransitionDeferredLane;
      nextTransitionDeferredLane <<= 1;
      0 === (nextTransitionDeferredLane & 3932160) && (nextTransitionDeferredLane = 262144);
      workInProgressDeferredLane = lane;
    } else workInProgressDeferredLane = 536870912;
  lane = suspenseHandlerStackCursor.current;
  null !== lane && (lane.flags |= 32);
  return workInProgressDeferredLane;
}
function scheduleUpdateOnFiber(root2, fiber, lane) {
  if (root2 === workInProgressRoot && (2 === workInProgressSuspendedReason || 9 === workInProgressSuspendedReason) || null !== root2.cancelPendingCommit)
    prepareFreshStack(root2, 0), markRootSuspended(
      root2,
      workInProgressRootRenderLanes,
      workInProgressDeferredLane,
      false
    );
  markRootUpdated$1(root2, lane);
  if (0 === (executionContext & 2) || root2 !== workInProgressRoot)
    root2 === workInProgressRoot && (0 === (executionContext & 2) && (workInProgressRootInterleavedUpdatedLanes |= lane), 4 === workInProgressRootExitStatus && markRootSuspended(
      root2,
      workInProgressRootRenderLanes,
      workInProgressDeferredLane,
      false
    )), ensureRootIsScheduled(root2);
}
function performWorkOnRoot(root$jscomp$0, lanes, forceSync) {
  if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(327));
  var shouldTimeSlice = !forceSync && 0 === (lanes & 127) && 0 === (lanes & root$jscomp$0.expiredLanes) || checkIfRootIsPrerendering(root$jscomp$0, lanes), exitStatus = shouldTimeSlice ? renderRootConcurrent(root$jscomp$0, lanes) : renderRootSync(root$jscomp$0, lanes, true), renderWasConcurrent = shouldTimeSlice;
  do {
    if (0 === exitStatus) {
      workInProgressRootIsPrerendering && !shouldTimeSlice && markRootSuspended(root$jscomp$0, lanes, 0, false);
      break;
    } else {
      forceSync = root$jscomp$0.current.alternate;
      if (renderWasConcurrent && !isRenderConsistentWithExternalStores(forceSync)) {
        exitStatus = renderRootSync(root$jscomp$0, lanes, false);
        renderWasConcurrent = false;
        continue;
      }
      if (2 === exitStatus) {
        renderWasConcurrent = lanes;
        if (root$jscomp$0.errorRecoveryDisabledLanes & renderWasConcurrent)
          var JSCompiler_inline_result = 0;
        else
          JSCompiler_inline_result = root$jscomp$0.pendingLanes & -536870913, JSCompiler_inline_result = 0 !== JSCompiler_inline_result ? JSCompiler_inline_result : JSCompiler_inline_result & 536870912 ? 536870912 : 0;
        if (0 !== JSCompiler_inline_result) {
          lanes = JSCompiler_inline_result;
          a: {
            var root2 = root$jscomp$0;
            exitStatus = workInProgressRootConcurrentErrors;
            var wasRootDehydrated = root2.current.memoizedState.isDehydrated;
            wasRootDehydrated && (prepareFreshStack(root2, JSCompiler_inline_result).flags |= 256);
            JSCompiler_inline_result = renderRootSync(
              root2,
              JSCompiler_inline_result,
              false
            );
            if (2 !== JSCompiler_inline_result) {
              if (workInProgressRootDidAttachPingListener && !wasRootDehydrated) {
                root2.errorRecoveryDisabledLanes |= renderWasConcurrent;
                workInProgressRootInterleavedUpdatedLanes |= renderWasConcurrent;
                exitStatus = 4;
                break a;
              }
              renderWasConcurrent = workInProgressRootRecoverableErrors;
              workInProgressRootRecoverableErrors = exitStatus;
              null !== renderWasConcurrent && (null === workInProgressRootRecoverableErrors ? workInProgressRootRecoverableErrors = renderWasConcurrent : workInProgressRootRecoverableErrors.push.apply(
                workInProgressRootRecoverableErrors,
                renderWasConcurrent
              ));
            }
            exitStatus = JSCompiler_inline_result;
          }
          renderWasConcurrent = false;
          if (2 !== exitStatus) continue;
        }
      }
      if (1 === exitStatus) {
        prepareFreshStack(root$jscomp$0, 0);
        markRootSuspended(root$jscomp$0, lanes, 0, true);
        break;
      }
      a: {
        shouldTimeSlice = root$jscomp$0;
        renderWasConcurrent = exitStatus;
        switch (renderWasConcurrent) {
          case 0:
          case 1:
            throw Error(formatProdErrorMessage(345));
          case 4:
            if ((lanes & 4194048) !== lanes) break;
          case 6:
            markRootSuspended(
              shouldTimeSlice,
              lanes,
              workInProgressDeferredLane,
              !workInProgressRootDidSkipSuspendedSiblings
            );
            break a;
          case 2:
            workInProgressRootRecoverableErrors = null;
            break;
          case 3:
          case 5:
            break;
          default:
            throw Error(formatProdErrorMessage(329));
        }
        if ((lanes & 62914560) === lanes && (exitStatus = globalMostRecentFallbackTime + 300 - now(), 10 < exitStatus)) {
          markRootSuspended(
            shouldTimeSlice,
            lanes,
            workInProgressDeferredLane,
            !workInProgressRootDidSkipSuspendedSiblings
          );
          if (0 !== getNextLanes(shouldTimeSlice, 0, true)) break a;
          pendingEffectsLanes = lanes;
          shouldTimeSlice.timeoutHandle = scheduleTimeout(
            commitRootWhenReady.bind(
              null,
              shouldTimeSlice,
              forceSync,
              workInProgressRootRecoverableErrors,
              workInProgressTransitions,
              workInProgressRootDidIncludeRecursiveRenderUpdate,
              lanes,
              workInProgressDeferredLane,
              workInProgressRootInterleavedUpdatedLanes,
              workInProgressSuspendedRetryLanes,
              workInProgressRootDidSkipSuspendedSiblings,
              renderWasConcurrent,
              "Throttled",
              -0,
              0
            ),
            exitStatus
          );
          break a;
        }
        commitRootWhenReady(
          shouldTimeSlice,
          forceSync,
          workInProgressRootRecoverableErrors,
          workInProgressTransitions,
          workInProgressRootDidIncludeRecursiveRenderUpdate,
          lanes,
          workInProgressDeferredLane,
          workInProgressRootInterleavedUpdatedLanes,
          workInProgressSuspendedRetryLanes,
          workInProgressRootDidSkipSuspendedSiblings,
          renderWasConcurrent,
          null,
          -0,
          0
        );
      }
    }
    break;
  } while (1);
  ensureRootIsScheduled(root$jscomp$0);
}
function commitRootWhenReady(root2, finishedWork, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, lanes, spawnedLane, updatedLanes, suspendedRetryLanes, didSkipSuspendedSiblings, exitStatus, suspendedCommitReason, completedRenderStartTime, completedRenderEndTime) {
  root2.timeoutHandle = -1;
  suspendedCommitReason = finishedWork.subtreeFlags;
  if (suspendedCommitReason & 8192 || 16785408 === (suspendedCommitReason & 16785408)) {
    suspendedCommitReason = {
      stylesheets: null,
      count: 0,
      imgCount: 0,
      imgBytes: 0,
      suspenseyImages: [],
      waitingForImages: true,
      waitingForViewTransition: false,
      unsuspend: noop$1
    };
    accumulateSuspenseyCommitOnFiber(
      finishedWork,
      lanes,
      suspendedCommitReason
    );
    var timeoutOffset = (lanes & 62914560) === lanes ? globalMostRecentFallbackTime - now() : (lanes & 4194048) === lanes ? globalMostRecentTransitionTime - now() : 0;
    timeoutOffset = waitForCommitToBeReady(
      suspendedCommitReason,
      timeoutOffset
    );
    if (null !== timeoutOffset) {
      pendingEffectsLanes = lanes;
      root2.cancelPendingCommit = timeoutOffset(
        commitRoot.bind(
          null,
          root2,
          finishedWork,
          lanes,
          recoverableErrors,
          transitions,
          didIncludeRenderPhaseUpdate,
          spawnedLane,
          updatedLanes,
          suspendedRetryLanes,
          exitStatus,
          suspendedCommitReason,
          null,
          completedRenderStartTime,
          completedRenderEndTime
        )
      );
      markRootSuspended(root2, lanes, spawnedLane, !didSkipSuspendedSiblings);
      return;
    }
  }
  commitRoot(
    root2,
    finishedWork,
    lanes,
    recoverableErrors,
    transitions,
    didIncludeRenderPhaseUpdate,
    spawnedLane,
    updatedLanes,
    suspendedRetryLanes
  );
}
function isRenderConsistentWithExternalStores(finishedWork) {
  for (var node = finishedWork; ; ) {
    var tag = node.tag;
    if ((0 === tag || 11 === tag || 15 === tag) && node.flags & 16384 && (tag = node.updateQueue, null !== tag && (tag = tag.stores, null !== tag)))
      for (var i = 0; i < tag.length; i++) {
        var check = tag[i], getSnapshot = check.getSnapshot;
        check = check.value;
        try {
          if (!objectIs(getSnapshot(), check)) return false;
        } catch (error) {
          return false;
        }
      }
    tag = node.child;
    if (node.subtreeFlags & 16384 && null !== tag)
      tag.return = node, node = tag;
    else {
      if (node === finishedWork) break;
      for (; null === node.sibling; ) {
        if (null === node.return || node.return === finishedWork) return true;
        node = node.return;
      }
      node.sibling.return = node.return;
      node = node.sibling;
    }
  }
  return true;
}
function markRootSuspended(root2, suspendedLanes, spawnedLane, didAttemptEntireTree) {
  suspendedLanes &= ~workInProgressRootPingedLanes;
  suspendedLanes &= ~workInProgressRootInterleavedUpdatedLanes;
  root2.suspendedLanes |= suspendedLanes;
  root2.pingedLanes &= ~suspendedLanes;
  didAttemptEntireTree && (root2.warmLanes |= suspendedLanes);
  didAttemptEntireTree = root2.expirationTimes;
  for (var lanes = suspendedLanes; 0 < lanes; ) {
    var index$6 = 31 - clz32(lanes), lane = 1 << index$6;
    didAttemptEntireTree[index$6] = -1;
    lanes &= ~lane;
  }
  0 !== spawnedLane && markSpawnedDeferredLane(root2, spawnedLane, suspendedLanes);
}
function flushSyncWork$1() {
  return 0 === (executionContext & 6) ? (flushSyncWorkAcrossRoots_impl(0), false) : true;
}
function resetWorkInProgressStack() {
  if (null !== workInProgress) {
    if (0 === workInProgressSuspendedReason)
      var interruptedWork = workInProgress.return;
    else
      interruptedWork = workInProgress, lastContextDependency = currentlyRenderingFiber$1 = null, resetHooksOnUnwind(interruptedWork), thenableState$1 = null, thenableIndexCounter$1 = 0, interruptedWork = workInProgress;
    for (; null !== interruptedWork; )
      unwindInterruptedWork(interruptedWork.alternate, interruptedWork), interruptedWork = interruptedWork.return;
    workInProgress = null;
  }
}
function prepareFreshStack(root2, lanes) {
  var timeoutHandle = root2.timeoutHandle;
  -1 !== timeoutHandle && (root2.timeoutHandle = -1, cancelTimeout(timeoutHandle));
  timeoutHandle = root2.cancelPendingCommit;
  null !== timeoutHandle && (root2.cancelPendingCommit = null, timeoutHandle());
  pendingEffectsLanes = 0;
  resetWorkInProgressStack();
  workInProgressRoot = root2;
  workInProgress = timeoutHandle = createWorkInProgress(root2.current, null);
  workInProgressRootRenderLanes = lanes;
  workInProgressSuspendedReason = 0;
  workInProgressThrownValue = null;
  workInProgressRootDidSkipSuspendedSiblings = false;
  workInProgressRootIsPrerendering = checkIfRootIsPrerendering(root2, lanes);
  workInProgressRootDidAttachPingListener = false;
  workInProgressSuspendedRetryLanes = workInProgressDeferredLane = workInProgressRootPingedLanes = workInProgressRootInterleavedUpdatedLanes = workInProgressRootSkippedLanes = workInProgressRootExitStatus = 0;
  workInProgressRootRecoverableErrors = workInProgressRootConcurrentErrors = null;
  workInProgressRootDidIncludeRecursiveRenderUpdate = false;
  0 !== (lanes & 8) && (lanes |= lanes & 32);
  var allEntangledLanes = root2.entangledLanes;
  if (0 !== allEntangledLanes)
    for (root2 = root2.entanglements, allEntangledLanes &= lanes; 0 < allEntangledLanes; ) {
      var index$4 = 31 - clz32(allEntangledLanes), lane = 1 << index$4;
      lanes |= root2[index$4];
      allEntangledLanes &= ~lane;
    }
  entangledRenderLanes = lanes;
  finishQueueingConcurrentUpdates();
  return timeoutHandle;
}
function handleThrow(root2, thrownValue) {
  currentlyRenderingFiber = null;
  ReactSharedInternals.H = ContextOnlyDispatcher;
  thrownValue === SuspenseException || thrownValue === SuspenseActionException ? (thrownValue = getSuspendedThenable(), workInProgressSuspendedReason = 3) : thrownValue === SuspenseyCommitException ? (thrownValue = getSuspendedThenable(), workInProgressSuspendedReason = 4) : workInProgressSuspendedReason = thrownValue === SelectiveHydrationException ? 8 : null !== thrownValue && "object" === typeof thrownValue && "function" === typeof thrownValue.then ? 6 : 1;
  workInProgressThrownValue = thrownValue;
  null === workInProgress && (workInProgressRootExitStatus = 1, logUncaughtError(
    root2,
    createCapturedValueAtFiber(thrownValue, root2.current)
  ));
}
function shouldRemainOnPreviousScreen() {
  var handler = suspenseHandlerStackCursor.current;
  return null === handler ? true : (workInProgressRootRenderLanes & 4194048) === workInProgressRootRenderLanes ? null === shellBoundary ? true : false : (workInProgressRootRenderLanes & 62914560) === workInProgressRootRenderLanes || 0 !== (workInProgressRootRenderLanes & 536870912) ? handler === shellBoundary : false;
}
function pushDispatcher() {
  var prevDispatcher = ReactSharedInternals.H;
  ReactSharedInternals.H = ContextOnlyDispatcher;
  return null === prevDispatcher ? ContextOnlyDispatcher : prevDispatcher;
}
function pushAsyncDispatcher() {
  var prevAsyncDispatcher = ReactSharedInternals.A;
  ReactSharedInternals.A = DefaultAsyncDispatcher;
  return prevAsyncDispatcher;
}
function renderDidSuspendDelayIfPossible() {
  workInProgressRootExitStatus = 4;
  workInProgressRootDidSkipSuspendedSiblings || (workInProgressRootRenderLanes & 4194048) !== workInProgressRootRenderLanes && null !== suspenseHandlerStackCursor.current || (workInProgressRootIsPrerendering = true);
  0 === (workInProgressRootSkippedLanes & 134217727) && 0 === (workInProgressRootInterleavedUpdatedLanes & 134217727) || null === workInProgressRoot || markRootSuspended(
    workInProgressRoot,
    workInProgressRootRenderLanes,
    workInProgressDeferredLane,
    false
  );
}
function renderRootSync(root2, lanes, shouldYieldForPrerendering) {
  var prevExecutionContext = executionContext;
  executionContext |= 2;
  var prevDispatcher = pushDispatcher(), prevAsyncDispatcher = pushAsyncDispatcher();
  if (workInProgressRoot !== root2 || workInProgressRootRenderLanes !== lanes)
    workInProgressTransitions = null, prepareFreshStack(root2, lanes);
  lanes = false;
  var exitStatus = workInProgressRootExitStatus;
  a: do
    try {
      if (0 !== workInProgressSuspendedReason && null !== workInProgress) {
        var unitOfWork = workInProgress, thrownValue = workInProgressThrownValue;
        switch (workInProgressSuspendedReason) {
          case 8:
            resetWorkInProgressStack();
            exitStatus = 6;
            break a;
          case 3:
          case 2:
          case 9:
          case 6:
            null === suspenseHandlerStackCursor.current && (lanes = true);
            var reason = workInProgressSuspendedReason;
            workInProgressSuspendedReason = 0;
            workInProgressThrownValue = null;
            throwAndUnwindWorkLoop(root2, unitOfWork, thrownValue, reason);
            if (shouldYieldForPrerendering && workInProgressRootIsPrerendering) {
              exitStatus = 0;
              break a;
            }
            break;
          default:
            reason = workInProgressSuspendedReason, workInProgressSuspendedReason = 0, workInProgressThrownValue = null, throwAndUnwindWorkLoop(root2, unitOfWork, thrownValue, reason);
        }
      }
      workLoopSync();
      exitStatus = workInProgressRootExitStatus;
      break;
    } catch (thrownValue$165) {
      handleThrow(root2, thrownValue$165);
    }
  while (1);
  lanes && root2.shellSuspendCounter++;
  lastContextDependency = currentlyRenderingFiber$1 = null;
  executionContext = prevExecutionContext;
  ReactSharedInternals.H = prevDispatcher;
  ReactSharedInternals.A = prevAsyncDispatcher;
  null === workInProgress && (workInProgressRoot = null, workInProgressRootRenderLanes = 0, finishQueueingConcurrentUpdates());
  return exitStatus;
}
function workLoopSync() {
  for (; null !== workInProgress; ) performUnitOfWork(workInProgress);
}
function renderRootConcurrent(root2, lanes) {
  var prevExecutionContext = executionContext;
  executionContext |= 2;
  var prevDispatcher = pushDispatcher(), prevAsyncDispatcher = pushAsyncDispatcher();
  workInProgressRoot !== root2 || workInProgressRootRenderLanes !== lanes ? (workInProgressTransitions = null, workInProgressRootRenderTargetTime = now() + 500, prepareFreshStack(root2, lanes)) : workInProgressRootIsPrerendering = checkIfRootIsPrerendering(
    root2,
    lanes
  );
  a: do
    try {
      if (0 !== workInProgressSuspendedReason && null !== workInProgress) {
        lanes = workInProgress;
        var thrownValue = workInProgressThrownValue;
        b: switch (workInProgressSuspendedReason) {
          case 1:
            workInProgressSuspendedReason = 0;
            workInProgressThrownValue = null;
            throwAndUnwindWorkLoop(root2, lanes, thrownValue, 1);
            break;
          case 2:
          case 9:
            if (isThenableResolved(thrownValue)) {
              workInProgressSuspendedReason = 0;
              workInProgressThrownValue = null;
              replaySuspendedUnitOfWork(lanes);
              break;
            }
            lanes = function() {
              2 !== workInProgressSuspendedReason && 9 !== workInProgressSuspendedReason || workInProgressRoot !== root2 || (workInProgressSuspendedReason = 7);
              ensureRootIsScheduled(root2);
            };
            thrownValue.then(lanes, lanes);
            break a;
          case 3:
            workInProgressSuspendedReason = 7;
            break a;
          case 4:
            workInProgressSuspendedReason = 5;
            break a;
          case 7:
            isThenableResolved(thrownValue) ? (workInProgressSuspendedReason = 0, workInProgressThrownValue = null, replaySuspendedUnitOfWork(lanes)) : (workInProgressSuspendedReason = 0, workInProgressThrownValue = null, throwAndUnwindWorkLoop(root2, lanes, thrownValue, 7));
            break;
          case 5:
            var resource = null;
            switch (workInProgress.tag) {
              case 26:
                resource = workInProgress.memoizedState;
              case 5:
              case 27:
                var hostFiber = workInProgress;
                if (resource ? preloadResource(resource) : hostFiber.stateNode.complete) {
                  workInProgressSuspendedReason = 0;
                  workInProgressThrownValue = null;
                  var sibling = hostFiber.sibling;
                  if (null !== sibling) workInProgress = sibling;
                  else {
                    var returnFiber = hostFiber.return;
                    null !== returnFiber ? (workInProgress = returnFiber, completeUnitOfWork(returnFiber)) : workInProgress = null;
                  }
                  break b;
                }
            }
            workInProgressSuspendedReason = 0;
            workInProgressThrownValue = null;
            throwAndUnwindWorkLoop(root2, lanes, thrownValue, 5);
            break;
          case 6:
            workInProgressSuspendedReason = 0;
            workInProgressThrownValue = null;
            throwAndUnwindWorkLoop(root2, lanes, thrownValue, 6);
            break;
          case 8:
            resetWorkInProgressStack();
            workInProgressRootExitStatus = 6;
            break a;
          default:
            throw Error(formatProdErrorMessage(462));
        }
      }
      workLoopConcurrentByScheduler();
      break;
    } catch (thrownValue$167) {
      handleThrow(root2, thrownValue$167);
    }
  while (1);
  lastContextDependency = currentlyRenderingFiber$1 = null;
  ReactSharedInternals.H = prevDispatcher;
  ReactSharedInternals.A = prevAsyncDispatcher;
  executionContext = prevExecutionContext;
  if (null !== workInProgress) return 0;
  workInProgressRoot = null;
  workInProgressRootRenderLanes = 0;
  finishQueueingConcurrentUpdates();
  return workInProgressRootExitStatus;
}
function workLoopConcurrentByScheduler() {
  for (; null !== workInProgress && !shouldYield(); )
    performUnitOfWork(workInProgress);
}
function performUnitOfWork(unitOfWork) {
  var next = beginWork(unitOfWork.alternate, unitOfWork, entangledRenderLanes);
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  null === next ? completeUnitOfWork(unitOfWork) : workInProgress = next;
}
function replaySuspendedUnitOfWork(unitOfWork) {
  var next = unitOfWork;
  var current = next.alternate;
  switch (next.tag) {
    case 15:
    case 0:
      next = replayFunctionComponent(
        current,
        next,
        next.pendingProps,
        next.type,
        void 0,
        workInProgressRootRenderLanes
      );
      break;
    case 11:
      next = replayFunctionComponent(
        current,
        next,
        next.pendingProps,
        next.type.render,
        next.ref,
        workInProgressRootRenderLanes
      );
      break;
    case 5:
      resetHooksOnUnwind(next);
    default:
      unwindInterruptedWork(current, next), next = workInProgress = resetWorkInProgress(next, entangledRenderLanes), next = beginWork(current, next, entangledRenderLanes);
  }
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  null === next ? completeUnitOfWork(unitOfWork) : workInProgress = next;
}
function throwAndUnwindWorkLoop(root2, unitOfWork, thrownValue, suspendedReason) {
  lastContextDependency = currentlyRenderingFiber$1 = null;
  resetHooksOnUnwind(unitOfWork);
  thenableState$1 = null;
  thenableIndexCounter$1 = 0;
  var returnFiber = unitOfWork.return;
  try {
    if (throwException(
      root2,
      returnFiber,
      unitOfWork,
      thrownValue,
      workInProgressRootRenderLanes
    )) {
      workInProgressRootExitStatus = 1;
      logUncaughtError(
        root2,
        createCapturedValueAtFiber(thrownValue, root2.current)
      );
      workInProgress = null;
      return;
    }
  } catch (error) {
    if (null !== returnFiber) throw workInProgress = returnFiber, error;
    workInProgressRootExitStatus = 1;
    logUncaughtError(
      root2,
      createCapturedValueAtFiber(thrownValue, root2.current)
    );
    workInProgress = null;
    return;
  }
  if (unitOfWork.flags & 32768) {
    if (isHydrating || 1 === suspendedReason) root2 = true;
    else if (workInProgressRootIsPrerendering || 0 !== (workInProgressRootRenderLanes & 536870912))
      root2 = false;
    else if (workInProgressRootDidSkipSuspendedSiblings = root2 = true, 2 === suspendedReason || 9 === suspendedReason || 3 === suspendedReason || 6 === suspendedReason)
      suspendedReason = suspenseHandlerStackCursor.current, null !== suspendedReason && 13 === suspendedReason.tag && (suspendedReason.flags |= 16384);
    unwindUnitOfWork(unitOfWork, root2);
  } else completeUnitOfWork(unitOfWork);
}
function completeUnitOfWork(unitOfWork) {
  var completedWork = unitOfWork;
  do {
    if (0 !== (completedWork.flags & 32768)) {
      unwindUnitOfWork(
        completedWork,
        workInProgressRootDidSkipSuspendedSiblings
      );
      return;
    }
    unitOfWork = completedWork.return;
    var next = completeWork(
      completedWork.alternate,
      completedWork,
      entangledRenderLanes
    );
    if (null !== next) {
      workInProgress = next;
      return;
    }
    completedWork = completedWork.sibling;
    if (null !== completedWork) {
      workInProgress = completedWork;
      return;
    }
    workInProgress = completedWork = unitOfWork;
  } while (null !== completedWork);
  0 === workInProgressRootExitStatus && (workInProgressRootExitStatus = 5);
}
function unwindUnitOfWork(unitOfWork, skipSiblings) {
  do {
    var next = unwindWork(unitOfWork.alternate, unitOfWork);
    if (null !== next) {
      next.flags &= 32767;
      workInProgress = next;
      return;
    }
    next = unitOfWork.return;
    null !== next && (next.flags |= 32768, next.subtreeFlags = 0, next.deletions = null);
    if (!skipSiblings && (unitOfWork = unitOfWork.sibling, null !== unitOfWork)) {
      workInProgress = unitOfWork;
      return;
    }
    workInProgress = unitOfWork = next;
  } while (null !== unitOfWork);
  workInProgressRootExitStatus = 6;
  workInProgress = null;
}
function commitRoot(root2, finishedWork, lanes, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, spawnedLane, updatedLanes, suspendedRetryLanes) {
  root2.cancelPendingCommit = null;
  do
    flushPendingEffects();
  while (0 !== pendingEffectsStatus);
  if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(327));
  if (null !== finishedWork) {
    if (finishedWork === root2.current) throw Error(formatProdErrorMessage(177));
    didIncludeRenderPhaseUpdate = finishedWork.lanes | finishedWork.childLanes;
    didIncludeRenderPhaseUpdate |= concurrentlyUpdatedLanes;
    markRootFinished(
      root2,
      lanes,
      didIncludeRenderPhaseUpdate,
      spawnedLane,
      updatedLanes,
      suspendedRetryLanes
    );
    root2 === workInProgressRoot && (workInProgress = workInProgressRoot = null, workInProgressRootRenderLanes = 0);
    pendingFinishedWork = finishedWork;
    pendingEffectsRoot = root2;
    pendingEffectsLanes = lanes;
    pendingEffectsRemainingLanes = didIncludeRenderPhaseUpdate;
    pendingPassiveTransitions = transitions;
    pendingRecoverableErrors = recoverableErrors;
    0 !== (finishedWork.subtreeFlags & 10256) || 0 !== (finishedWork.flags & 10256) ? (root2.callbackNode = null, root2.callbackPriority = 0, scheduleCallback$1(NormalPriority$1, function() {
      flushPassiveEffects();
      return null;
    })) : (root2.callbackNode = null, root2.callbackPriority = 0);
    recoverableErrors = 0 !== (finishedWork.flags & 13878);
    if (0 !== (finishedWork.subtreeFlags & 13878) || recoverableErrors) {
      recoverableErrors = ReactSharedInternals.T;
      ReactSharedInternals.T = null;
      transitions = ReactDOMSharedInternals.p;
      ReactDOMSharedInternals.p = 2;
      spawnedLane = executionContext;
      executionContext |= 4;
      try {
        commitBeforeMutationEffects(root2, finishedWork, lanes);
      } finally {
        executionContext = spawnedLane, ReactDOMSharedInternals.p = transitions, ReactSharedInternals.T = recoverableErrors;
      }
    }
    pendingEffectsStatus = 1;
    flushMutationEffects();
    flushLayoutEffects();
    flushSpawnedWork();
  }
}
function flushMutationEffects() {
  if (1 === pendingEffectsStatus) {
    pendingEffectsStatus = 0;
    var root2 = pendingEffectsRoot, finishedWork = pendingFinishedWork, rootMutationHasEffect = 0 !== (finishedWork.flags & 13878);
    if (0 !== (finishedWork.subtreeFlags & 13878) || rootMutationHasEffect) {
      rootMutationHasEffect = ReactSharedInternals.T;
      ReactSharedInternals.T = null;
      var previousPriority = ReactDOMSharedInternals.p;
      ReactDOMSharedInternals.p = 2;
      var prevExecutionContext = executionContext;
      executionContext |= 4;
      try {
        commitMutationEffectsOnFiber(finishedWork, root2);
        var priorSelectionInformation = selectionInformation, curFocusedElem = getActiveElementDeep(root2.containerInfo), priorFocusedElem = priorSelectionInformation.focusedElem, priorSelectionRange = priorSelectionInformation.selectionRange;
        if (curFocusedElem !== priorFocusedElem && priorFocusedElem && priorFocusedElem.ownerDocument && containsNode(
          priorFocusedElem.ownerDocument.documentElement,
          priorFocusedElem
        )) {
          if (null !== priorSelectionRange && hasSelectionCapabilities(priorFocusedElem)) {
            var start = priorSelectionRange.start, end = priorSelectionRange.end;
            void 0 === end && (end = start);
            if ("selectionStart" in priorFocusedElem)
              priorFocusedElem.selectionStart = start, priorFocusedElem.selectionEnd = Math.min(
                end,
                priorFocusedElem.value.length
              );
            else {
              var doc = priorFocusedElem.ownerDocument || document, win = doc && doc.defaultView || window;
              if (win.getSelection) {
                var selection = win.getSelection(), length = priorFocusedElem.textContent.length, start$jscomp$0 = Math.min(priorSelectionRange.start, length), end$jscomp$0 = void 0 === priorSelectionRange.end ? start$jscomp$0 : Math.min(priorSelectionRange.end, length);
                !selection.extend && start$jscomp$0 > end$jscomp$0 && (curFocusedElem = end$jscomp$0, end$jscomp$0 = start$jscomp$0, start$jscomp$0 = curFocusedElem);
                var startMarker = getNodeForCharacterOffset(
                  priorFocusedElem,
                  start$jscomp$0
                ), endMarker = getNodeForCharacterOffset(
                  priorFocusedElem,
                  end$jscomp$0
                );
                if (startMarker && endMarker && (1 !== selection.rangeCount || selection.anchorNode !== startMarker.node || selection.anchorOffset !== startMarker.offset || selection.focusNode !== endMarker.node || selection.focusOffset !== endMarker.offset)) {
                  var range = doc.createRange();
                  range.setStart(startMarker.node, startMarker.offset);
                  selection.removeAllRanges();
                  start$jscomp$0 > end$jscomp$0 ? (selection.addRange(range), selection.extend(endMarker.node, endMarker.offset)) : (range.setEnd(endMarker.node, endMarker.offset), selection.addRange(range));
                }
              }
            }
          }
          doc = [];
          for (selection = priorFocusedElem; selection = selection.parentNode; )
            1 === selection.nodeType && doc.push({
              element: selection,
              left: selection.scrollLeft,
              top: selection.scrollTop
            });
          "function" === typeof priorFocusedElem.focus && priorFocusedElem.focus();
          for (priorFocusedElem = 0; priorFocusedElem < doc.length; priorFocusedElem++) {
            var info = doc[priorFocusedElem];
            info.element.scrollLeft = info.left;
            info.element.scrollTop = info.top;
          }
        }
        _enabled = !!eventsEnabled;
        selectionInformation = eventsEnabled = null;
      } finally {
        executionContext = prevExecutionContext, ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = rootMutationHasEffect;
      }
    }
    root2.current = finishedWork;
    pendingEffectsStatus = 2;
  }
}
function flushLayoutEffects() {
  if (2 === pendingEffectsStatus) {
    pendingEffectsStatus = 0;
    var root2 = pendingEffectsRoot, finishedWork = pendingFinishedWork, rootHasLayoutEffect = 0 !== (finishedWork.flags & 8772);
    if (0 !== (finishedWork.subtreeFlags & 8772) || rootHasLayoutEffect) {
      rootHasLayoutEffect = ReactSharedInternals.T;
      ReactSharedInternals.T = null;
      var previousPriority = ReactDOMSharedInternals.p;
      ReactDOMSharedInternals.p = 2;
      var prevExecutionContext = executionContext;
      executionContext |= 4;
      try {
        commitLayoutEffectOnFiber(root2, finishedWork.alternate, finishedWork);
      } finally {
        executionContext = prevExecutionContext, ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = rootHasLayoutEffect;
      }
    }
    pendingEffectsStatus = 3;
  }
}
function flushSpawnedWork() {
  if (4 === pendingEffectsStatus || 3 === pendingEffectsStatus) {
    pendingEffectsStatus = 0;
    requestPaint();
    var root2 = pendingEffectsRoot, finishedWork = pendingFinishedWork, lanes = pendingEffectsLanes, recoverableErrors = pendingRecoverableErrors;
    0 !== (finishedWork.subtreeFlags & 10256) || 0 !== (finishedWork.flags & 10256) ? pendingEffectsStatus = 5 : (pendingEffectsStatus = 0, pendingFinishedWork = pendingEffectsRoot = null, releaseRootPooledCache(root2, root2.pendingLanes));
    var remainingLanes = root2.pendingLanes;
    0 === remainingLanes && (legacyErrorBoundariesThatAlreadyFailed = null);
    lanesToEventPriority(lanes);
    finishedWork = finishedWork.stateNode;
    if (injectedHook && "function" === typeof injectedHook.onCommitFiberRoot)
      try {
        injectedHook.onCommitFiberRoot(
          rendererID,
          finishedWork,
          void 0,
          128 === (finishedWork.current.flags & 128)
        );
      } catch (err) {
      }
    if (null !== recoverableErrors) {
      finishedWork = ReactSharedInternals.T;
      remainingLanes = ReactDOMSharedInternals.p;
      ReactDOMSharedInternals.p = 2;
      ReactSharedInternals.T = null;
      try {
        for (var onRecoverableError = root2.onRecoverableError, i = 0; i < recoverableErrors.length; i++) {
          var recoverableError = recoverableErrors[i];
          onRecoverableError(recoverableError.value, {
            componentStack: recoverableError.stack
          });
        }
      } finally {
        ReactSharedInternals.T = finishedWork, ReactDOMSharedInternals.p = remainingLanes;
      }
    }
    0 !== (pendingEffectsLanes & 3) && flushPendingEffects();
    ensureRootIsScheduled(root2);
    remainingLanes = root2.pendingLanes;
    0 !== (lanes & 261930) && 0 !== (remainingLanes & 42) ? root2 === rootWithNestedUpdates ? nestedUpdateCount++ : (nestedUpdateCount = 0, rootWithNestedUpdates = root2) : nestedUpdateCount = 0;
    flushSyncWorkAcrossRoots_impl(0);
  }
}
function releaseRootPooledCache(root2, remainingLanes) {
  0 === (root2.pooledCacheLanes &= remainingLanes) && (remainingLanes = root2.pooledCache, null != remainingLanes && (root2.pooledCache = null, releaseCache(remainingLanes)));
}
function flushPendingEffects() {
  flushMutationEffects();
  flushLayoutEffects();
  flushSpawnedWork();
  return flushPassiveEffects();
}
function flushPassiveEffects() {
  if (5 !== pendingEffectsStatus) return false;
  var root2 = pendingEffectsRoot, remainingLanes = pendingEffectsRemainingLanes;
  pendingEffectsRemainingLanes = 0;
  var renderPriority = lanesToEventPriority(pendingEffectsLanes), prevTransition = ReactSharedInternals.T, previousPriority = ReactDOMSharedInternals.p;
  try {
    ReactDOMSharedInternals.p = 32 > renderPriority ? 32 : renderPriority;
    ReactSharedInternals.T = null;
    renderPriority = pendingPassiveTransitions;
    pendingPassiveTransitions = null;
    var root$jscomp$0 = pendingEffectsRoot, lanes = pendingEffectsLanes;
    pendingEffectsStatus = 0;
    pendingFinishedWork = pendingEffectsRoot = null;
    pendingEffectsLanes = 0;
    if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(331));
    var prevExecutionContext = executionContext;
    executionContext |= 4;
    commitPassiveUnmountOnFiber(root$jscomp$0.current);
    commitPassiveMountOnFiber(
      root$jscomp$0,
      root$jscomp$0.current,
      lanes,
      renderPriority
    );
    executionContext = prevExecutionContext;
    flushSyncWorkAcrossRoots_impl(0, false);
    if (injectedHook && "function" === typeof injectedHook.onPostCommitFiberRoot)
      try {
        injectedHook.onPostCommitFiberRoot(rendererID, root$jscomp$0);
      } catch (err) {
      }
    return true;
  } finally {
    ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = prevTransition, releaseRootPooledCache(root2, remainingLanes);
  }
}
function captureCommitPhaseErrorOnRoot(rootFiber, sourceFiber, error) {
  sourceFiber = createCapturedValueAtFiber(error, sourceFiber);
  sourceFiber = createRootErrorUpdate(rootFiber.stateNode, sourceFiber, 2);
  rootFiber = enqueueUpdate(rootFiber, sourceFiber, 2);
  null !== rootFiber && (markRootUpdated$1(rootFiber, 2), ensureRootIsScheduled(rootFiber));
}
function captureCommitPhaseError(sourceFiber, nearestMountedAncestor, error) {
  if (3 === sourceFiber.tag)
    captureCommitPhaseErrorOnRoot(sourceFiber, sourceFiber, error);
  else
    for (; null !== nearestMountedAncestor; ) {
      if (3 === nearestMountedAncestor.tag) {
        captureCommitPhaseErrorOnRoot(
          nearestMountedAncestor,
          sourceFiber,
          error
        );
        break;
      } else if (1 === nearestMountedAncestor.tag) {
        var instance = nearestMountedAncestor.stateNode;
        if ("function" === typeof nearestMountedAncestor.type.getDerivedStateFromError || "function" === typeof instance.componentDidCatch && (null === legacyErrorBoundariesThatAlreadyFailed || !legacyErrorBoundariesThatAlreadyFailed.has(instance))) {
          sourceFiber = createCapturedValueAtFiber(error, sourceFiber);
          error = createClassErrorUpdate(2);
          instance = enqueueUpdate(nearestMountedAncestor, error, 2);
          null !== instance && (initializeClassErrorUpdate(
            error,
            instance,
            nearestMountedAncestor,
            sourceFiber
          ), markRootUpdated$1(instance, 2), ensureRootIsScheduled(instance));
          break;
        }
      }
      nearestMountedAncestor = nearestMountedAncestor.return;
    }
}
function attachPingListener(root2, wakeable, lanes) {
  var pingCache = root2.pingCache;
  if (null === pingCache) {
    pingCache = root2.pingCache = new PossiblyWeakMap();
    var threadIDs = /* @__PURE__ */ new Set();
    pingCache.set(wakeable, threadIDs);
  } else
    threadIDs = pingCache.get(wakeable), void 0 === threadIDs && (threadIDs = /* @__PURE__ */ new Set(), pingCache.set(wakeable, threadIDs));
  threadIDs.has(lanes) || (workInProgressRootDidAttachPingListener = true, threadIDs.add(lanes), root2 = pingSuspendedRoot.bind(null, root2, wakeable, lanes), wakeable.then(root2, root2));
}
function pingSuspendedRoot(root2, wakeable, pingedLanes) {
  var pingCache = root2.pingCache;
  null !== pingCache && pingCache.delete(wakeable);
  root2.pingedLanes |= root2.suspendedLanes & pingedLanes;
  root2.warmLanes &= ~pingedLanes;
  workInProgressRoot === root2 && (workInProgressRootRenderLanes & pingedLanes) === pingedLanes && (4 === workInProgressRootExitStatus || 3 === workInProgressRootExitStatus && (workInProgressRootRenderLanes & 62914560) === workInProgressRootRenderLanes && 300 > now() - globalMostRecentFallbackTime ? 0 === (executionContext & 2) && prepareFreshStack(root2, 0) : workInProgressRootPingedLanes |= pingedLanes, workInProgressSuspendedRetryLanes === workInProgressRootRenderLanes && (workInProgressSuspendedRetryLanes = 0));
  ensureRootIsScheduled(root2);
}
function retryTimedOutBoundary(boundaryFiber, retryLane) {
  0 === retryLane && (retryLane = claimNextRetryLane());
  boundaryFiber = enqueueConcurrentRenderForLane(boundaryFiber, retryLane);
  null !== boundaryFiber && (markRootUpdated$1(boundaryFiber, retryLane), ensureRootIsScheduled(boundaryFiber));
}
function retryDehydratedSuspenseBoundary(boundaryFiber) {
  var suspenseState = boundaryFiber.memoizedState, retryLane = 0;
  null !== suspenseState && (retryLane = suspenseState.retryLane);
  retryTimedOutBoundary(boundaryFiber, retryLane);
}
function resolveRetryWakeable(boundaryFiber, wakeable) {
  var retryLane = 0;
  switch (boundaryFiber.tag) {
    case 31:
    case 13:
      var retryCache = boundaryFiber.stateNode;
      var suspenseState = boundaryFiber.memoizedState;
      null !== suspenseState && (retryLane = suspenseState.retryLane);
      break;
    case 19:
      retryCache = boundaryFiber.stateNode;
      break;
    case 22:
      retryCache = boundaryFiber.stateNode._retryCache;
      break;
    default:
      throw Error(formatProdErrorMessage(314));
  }
  null !== retryCache && retryCache.delete(wakeable);
  retryTimedOutBoundary(boundaryFiber, retryLane);
}
function scheduleCallback$1(priorityLevel, callback) {
  return scheduleCallback$3(priorityLevel, callback);
}
var firstScheduledRoot = null, lastScheduledRoot = null, didScheduleMicrotask = false, mightHavePendingSyncWork = false, isFlushingWork = false, currentEventTransitionLane = 0;
function ensureRootIsScheduled(root2) {
  root2 !== lastScheduledRoot && null === root2.next && (null === lastScheduledRoot ? firstScheduledRoot = lastScheduledRoot = root2 : lastScheduledRoot = lastScheduledRoot.next = root2);
  mightHavePendingSyncWork = true;
  didScheduleMicrotask || (didScheduleMicrotask = true, scheduleImmediateRootScheduleTask());
}
function flushSyncWorkAcrossRoots_impl(syncTransitionLanes, onlyLegacy) {
  if (!isFlushingWork && mightHavePendingSyncWork) {
    isFlushingWork = true;
    do {
      var didPerformSomeWork = false;
      for (var root$170 = firstScheduledRoot; null !== root$170; ) {
        if (0 !== syncTransitionLanes) {
          var pendingLanes = root$170.pendingLanes;
          if (0 === pendingLanes) var JSCompiler_inline_result = 0;
          else {
            var suspendedLanes = root$170.suspendedLanes, pingedLanes = root$170.pingedLanes;
            JSCompiler_inline_result = (1 << 31 - clz32(42 | syncTransitionLanes) + 1) - 1;
            JSCompiler_inline_result &= pendingLanes & ~(suspendedLanes & ~pingedLanes);
            JSCompiler_inline_result = JSCompiler_inline_result & 201326741 ? JSCompiler_inline_result & 201326741 | 1 : JSCompiler_inline_result ? JSCompiler_inline_result | 2 : 0;
          }
          0 !== JSCompiler_inline_result && (didPerformSomeWork = true, performSyncWorkOnRoot(root$170, JSCompiler_inline_result));
        } else
          JSCompiler_inline_result = workInProgressRootRenderLanes, JSCompiler_inline_result = getNextLanes(
            root$170,
            root$170 === workInProgressRoot ? JSCompiler_inline_result : 0,
            null !== root$170.cancelPendingCommit || -1 !== root$170.timeoutHandle
          ), 0 === (JSCompiler_inline_result & 3) || checkIfRootIsPrerendering(root$170, JSCompiler_inline_result) || (didPerformSomeWork = true, performSyncWorkOnRoot(root$170, JSCompiler_inline_result));
        root$170 = root$170.next;
      }
    } while (didPerformSomeWork);
    isFlushingWork = false;
  }
}
function processRootScheduleInImmediateTask() {
  processRootScheduleInMicrotask();
}
function processRootScheduleInMicrotask() {
  mightHavePendingSyncWork = didScheduleMicrotask = false;
  var syncTransitionLanes = 0;
  0 !== currentEventTransitionLane && shouldAttemptEagerTransition() && (syncTransitionLanes = currentEventTransitionLane);
  for (var currentTime = now(), prev = null, root2 = firstScheduledRoot; null !== root2; ) {
    var next = root2.next, nextLanes = scheduleTaskForRootDuringMicrotask(root2, currentTime);
    if (0 === nextLanes)
      root2.next = null, null === prev ? firstScheduledRoot = next : prev.next = next, null === next && (lastScheduledRoot = prev);
    else if (prev = root2, 0 !== syncTransitionLanes || 0 !== (nextLanes & 3))
      mightHavePendingSyncWork = true;
    root2 = next;
  }
  0 !== pendingEffectsStatus && 5 !== pendingEffectsStatus || flushSyncWorkAcrossRoots_impl(syncTransitionLanes);
  0 !== currentEventTransitionLane && (currentEventTransitionLane = 0);
}
function scheduleTaskForRootDuringMicrotask(root2, currentTime) {
  for (var suspendedLanes = root2.suspendedLanes, pingedLanes = root2.pingedLanes, expirationTimes = root2.expirationTimes, lanes = root2.pendingLanes & -62914561; 0 < lanes; ) {
    var index$5 = 31 - clz32(lanes), lane = 1 << index$5, expirationTime = expirationTimes[index$5];
    if (-1 === expirationTime) {
      if (0 === (lane & suspendedLanes) || 0 !== (lane & pingedLanes))
        expirationTimes[index$5] = computeExpirationTime(lane, currentTime);
    } else expirationTime <= currentTime && (root2.expiredLanes |= lane);
    lanes &= ~lane;
  }
  currentTime = workInProgressRoot;
  suspendedLanes = workInProgressRootRenderLanes;
  suspendedLanes = getNextLanes(
    root2,
    root2 === currentTime ? suspendedLanes : 0,
    null !== root2.cancelPendingCommit || -1 !== root2.timeoutHandle
  );
  pingedLanes = root2.callbackNode;
  if (0 === suspendedLanes || root2 === currentTime && (2 === workInProgressSuspendedReason || 9 === workInProgressSuspendedReason) || null !== root2.cancelPendingCommit)
    return null !== pingedLanes && null !== pingedLanes && cancelCallback$1(pingedLanes), root2.callbackNode = null, root2.callbackPriority = 0;
  if (0 === (suspendedLanes & 3) || checkIfRootIsPrerendering(root2, suspendedLanes)) {
    currentTime = suspendedLanes & -suspendedLanes;
    if (currentTime === root2.callbackPriority) return currentTime;
    null !== pingedLanes && cancelCallback$1(pingedLanes);
    switch (lanesToEventPriority(suspendedLanes)) {
      case 2:
      case 8:
        suspendedLanes = UserBlockingPriority;
        break;
      case 32:
        suspendedLanes = NormalPriority$1;
        break;
      case 268435456:
        suspendedLanes = IdlePriority;
        break;
      default:
        suspendedLanes = NormalPriority$1;
    }
    pingedLanes = performWorkOnRootViaSchedulerTask.bind(null, root2);
    suspendedLanes = scheduleCallback$3(suspendedLanes, pingedLanes);
    root2.callbackPriority = currentTime;
    root2.callbackNode = suspendedLanes;
    return currentTime;
  }
  null !== pingedLanes && null !== pingedLanes && cancelCallback$1(pingedLanes);
  root2.callbackPriority = 2;
  root2.callbackNode = null;
  return 2;
}
function performWorkOnRootViaSchedulerTask(root2, didTimeout) {
  if (0 !== pendingEffectsStatus && 5 !== pendingEffectsStatus)
    return root2.callbackNode = null, root2.callbackPriority = 0, null;
  var originalCallbackNode = root2.callbackNode;
  if (flushPendingEffects() && root2.callbackNode !== originalCallbackNode)
    return null;
  var workInProgressRootRenderLanes$jscomp$0 = workInProgressRootRenderLanes;
  workInProgressRootRenderLanes$jscomp$0 = getNextLanes(
    root2,
    root2 === workInProgressRoot ? workInProgressRootRenderLanes$jscomp$0 : 0,
    null !== root2.cancelPendingCommit || -1 !== root2.timeoutHandle
  );
  if (0 === workInProgressRootRenderLanes$jscomp$0) return null;
  performWorkOnRoot(root2, workInProgressRootRenderLanes$jscomp$0, didTimeout);
  scheduleTaskForRootDuringMicrotask(root2, now());
  return null != root2.callbackNode && root2.callbackNode === originalCallbackNode ? performWorkOnRootViaSchedulerTask.bind(null, root2) : null;
}
function performSyncWorkOnRoot(root2, lanes) {
  if (flushPendingEffects()) return null;
  performWorkOnRoot(root2, lanes, true);
}
function scheduleImmediateRootScheduleTask() {
  scheduleMicrotask(function() {
    0 !== (executionContext & 6) ? scheduleCallback$3(
      ImmediatePriority,
      processRootScheduleInImmediateTask
    ) : processRootScheduleInMicrotask();
  });
}
function requestTransitionLane() {
  if (0 === currentEventTransitionLane) {
    var actionScopeLane = currentEntangledLane;
    0 === actionScopeLane && (actionScopeLane = nextTransitionUpdateLane, nextTransitionUpdateLane <<= 1, 0 === (nextTransitionUpdateLane & 261888) && (nextTransitionUpdateLane = 256));
    currentEventTransitionLane = actionScopeLane;
  }
  return currentEventTransitionLane;
}
function coerceFormActionProp(actionProp) {
  return null == actionProp || "symbol" === typeof actionProp || "boolean" === typeof actionProp ? null : "function" === typeof actionProp ? actionProp : sanitizeURL("" + actionProp);
}
function createFormDataWithSubmitter(form, submitter) {
  var temp = submitter.ownerDocument.createElement("input");
  temp.name = submitter.name;
  temp.value = submitter.value;
  form.id && temp.setAttribute("form", form.id);
  submitter.parentNode.insertBefore(temp, submitter);
  form = new FormData(form);
  temp.parentNode.removeChild(temp);
  return form;
}
function extractEvents$1(dispatchQueue, domEventName, maybeTargetInst, nativeEvent, nativeEventTarget) {
  if ("submit" === domEventName && maybeTargetInst && maybeTargetInst.stateNode === nativeEventTarget) {
    var action = coerceFormActionProp(
      (nativeEventTarget[internalPropsKey] || null).action
    ), submitter = nativeEvent.submitter;
    submitter && (domEventName = (domEventName = submitter[internalPropsKey] || null) ? coerceFormActionProp(domEventName.formAction) : submitter.getAttribute("formAction"), null !== domEventName && (action = domEventName, submitter = null));
    var event = new SyntheticEvent(
      "action",
      "action",
      null,
      nativeEvent,
      nativeEventTarget
    );
    dispatchQueue.push({
      event,
      listeners: [
        {
          instance: null,
          listener: function() {
            if (nativeEvent.defaultPrevented) {
              if (0 !== currentEventTransitionLane) {
                var formData = submitter ? createFormDataWithSubmitter(nativeEventTarget, submitter) : new FormData(nativeEventTarget);
                startHostTransition(
                  maybeTargetInst,
                  {
                    pending: true,
                    data: formData,
                    method: nativeEventTarget.method,
                    action
                  },
                  null,
                  formData
                );
              }
            } else
              "function" === typeof action && (event.preventDefault(), formData = submitter ? createFormDataWithSubmitter(nativeEventTarget, submitter) : new FormData(nativeEventTarget), startHostTransition(
                maybeTargetInst,
                {
                  pending: true,
                  data: formData,
                  method: nativeEventTarget.method,
                  action
                },
                action,
                formData
              ));
          },
          currentTarget: nativeEventTarget
        }
      ]
    });
  }
}
for (var i$jscomp$inline_1577 = 0; i$jscomp$inline_1577 < simpleEventPluginEvents.length; i$jscomp$inline_1577++) {
  var eventName$jscomp$inline_1578 = simpleEventPluginEvents[i$jscomp$inline_1577], domEventName$jscomp$inline_1579 = eventName$jscomp$inline_1578.toLowerCase(), capitalizedEvent$jscomp$inline_1580 = eventName$jscomp$inline_1578[0].toUpperCase() + eventName$jscomp$inline_1578.slice(1);
  registerSimpleEvent(
    domEventName$jscomp$inline_1579,
    "on" + capitalizedEvent$jscomp$inline_1580
  );
}
registerSimpleEvent(ANIMATION_END, "onAnimationEnd");
registerSimpleEvent(ANIMATION_ITERATION, "onAnimationIteration");
registerSimpleEvent(ANIMATION_START, "onAnimationStart");
registerSimpleEvent("dblclick", "onDoubleClick");
registerSimpleEvent("focusin", "onFocus");
registerSimpleEvent("focusout", "onBlur");
registerSimpleEvent(TRANSITION_RUN, "onTransitionRun");
registerSimpleEvent(TRANSITION_START, "onTransitionStart");
registerSimpleEvent(TRANSITION_CANCEL, "onTransitionCancel");
registerSimpleEvent(TRANSITION_END, "onTransitionEnd");
registerDirectEvent("onMouseEnter", ["mouseout", "mouseover"]);
registerDirectEvent("onMouseLeave", ["mouseout", "mouseover"]);
registerDirectEvent("onPointerEnter", ["pointerout", "pointerover"]);
registerDirectEvent("onPointerLeave", ["pointerout", "pointerover"]);
registerTwoPhaseEvent(
  "onChange",
  "change click focusin focusout input keydown keyup selectionchange".split(" ")
);
registerTwoPhaseEvent(
  "onSelect",
  "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
    " "
  )
);
registerTwoPhaseEvent("onBeforeInput", [
  "compositionend",
  "keypress",
  "textInput",
  "paste"
]);
registerTwoPhaseEvent(
  "onCompositionEnd",
  "compositionend focusout keydown keypress keyup mousedown".split(" ")
);
registerTwoPhaseEvent(
  "onCompositionStart",
  "compositionstart focusout keydown keypress keyup mousedown".split(" ")
);
registerTwoPhaseEvent(
  "onCompositionUpdate",
  "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
);
var mediaEventTypes = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
  " "
), nonDelegatedEvents = new Set(
  "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(mediaEventTypes)
);
function processDispatchQueue(dispatchQueue, eventSystemFlags) {
  eventSystemFlags = 0 !== (eventSystemFlags & 4);
  for (var i = 0; i < dispatchQueue.length; i++) {
    var _dispatchQueue$i = dispatchQueue[i], event = _dispatchQueue$i.event;
    _dispatchQueue$i = _dispatchQueue$i.listeners;
    a: {
      var previousInstance = void 0;
      if (eventSystemFlags)
        for (var i$jscomp$0 = _dispatchQueue$i.length - 1; 0 <= i$jscomp$0; i$jscomp$0--) {
          var _dispatchListeners$i = _dispatchQueue$i[i$jscomp$0], instance = _dispatchListeners$i.instance, currentTarget = _dispatchListeners$i.currentTarget;
          _dispatchListeners$i = _dispatchListeners$i.listener;
          if (instance !== previousInstance && event.isPropagationStopped())
            break a;
          previousInstance = _dispatchListeners$i;
          event.currentTarget = currentTarget;
          try {
            previousInstance(event);
          } catch (error) {
            reportGlobalError(error);
          }
          event.currentTarget = null;
          previousInstance = instance;
        }
      else
        for (i$jscomp$0 = 0; i$jscomp$0 < _dispatchQueue$i.length; i$jscomp$0++) {
          _dispatchListeners$i = _dispatchQueue$i[i$jscomp$0];
          instance = _dispatchListeners$i.instance;
          currentTarget = _dispatchListeners$i.currentTarget;
          _dispatchListeners$i = _dispatchListeners$i.listener;
          if (instance !== previousInstance && event.isPropagationStopped())
            break a;
          previousInstance = _dispatchListeners$i;
          event.currentTarget = currentTarget;
          try {
            previousInstance(event);
          } catch (error) {
            reportGlobalError(error);
          }
          event.currentTarget = null;
          previousInstance = instance;
        }
    }
  }
}
function listenToNonDelegatedEvent(domEventName, targetElement) {
  var JSCompiler_inline_result = targetElement[internalEventHandlersKey];
  void 0 === JSCompiler_inline_result && (JSCompiler_inline_result = targetElement[internalEventHandlersKey] = /* @__PURE__ */ new Set());
  var listenerSetKey = domEventName + "__bubble";
  JSCompiler_inline_result.has(listenerSetKey) || (addTrappedEventListener(targetElement, domEventName, 2, false), JSCompiler_inline_result.add(listenerSetKey));
}
function listenToNativeEvent(domEventName, isCapturePhaseListener, target) {
  var eventSystemFlags = 0;
  isCapturePhaseListener && (eventSystemFlags |= 4);
  addTrappedEventListener(
    target,
    domEventName,
    eventSystemFlags,
    isCapturePhaseListener
  );
}
var listeningMarker = "_reactListening" + Math.random().toString(36).slice(2);
function listenToAllSupportedEvents(rootContainerElement) {
  if (!rootContainerElement[listeningMarker]) {
    rootContainerElement[listeningMarker] = true;
    allNativeEvents.forEach(function(domEventName) {
      "selectionchange" !== domEventName && (nonDelegatedEvents.has(domEventName) || listenToNativeEvent(domEventName, false, rootContainerElement), listenToNativeEvent(domEventName, true, rootContainerElement));
    });
    var ownerDocument = 9 === rootContainerElement.nodeType ? rootContainerElement : rootContainerElement.ownerDocument;
    null === ownerDocument || ownerDocument[listeningMarker] || (ownerDocument[listeningMarker] = true, listenToNativeEvent("selectionchange", false, ownerDocument));
  }
}
function addTrappedEventListener(targetContainer, domEventName, eventSystemFlags, isCapturePhaseListener) {
  switch (getEventPriority(domEventName)) {
    case 2:
      var listenerWrapper = dispatchDiscreteEvent;
      break;
    case 8:
      listenerWrapper = dispatchContinuousEvent;
      break;
    default:
      listenerWrapper = dispatchEvent;
  }
  eventSystemFlags = listenerWrapper.bind(
    null,
    domEventName,
    eventSystemFlags,
    targetContainer
  );
  listenerWrapper = void 0;
  !passiveBrowserEventsSupported || "touchstart" !== domEventName && "touchmove" !== domEventName && "wheel" !== domEventName || (listenerWrapper = true);
  isCapturePhaseListener ? void 0 !== listenerWrapper ? targetContainer.addEventListener(domEventName, eventSystemFlags, {
    capture: true,
    passive: listenerWrapper
  }) : targetContainer.addEventListener(domEventName, eventSystemFlags, true) : void 0 !== listenerWrapper ? targetContainer.addEventListener(domEventName, eventSystemFlags, {
    passive: listenerWrapper
  }) : targetContainer.addEventListener(domEventName, eventSystemFlags, false);
}
function dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, targetInst$jscomp$0, targetContainer) {
  var ancestorInst = targetInst$jscomp$0;
  if (0 === (eventSystemFlags & 1) && 0 === (eventSystemFlags & 2) && null !== targetInst$jscomp$0)
    a: for (; ; ) {
      if (null === targetInst$jscomp$0) return;
      var nodeTag = targetInst$jscomp$0.tag;
      if (3 === nodeTag || 4 === nodeTag) {
        var container = targetInst$jscomp$0.stateNode.containerInfo;
        if (container === targetContainer) break;
        if (4 === nodeTag)
          for (nodeTag = targetInst$jscomp$0.return; null !== nodeTag; ) {
            var grandTag = nodeTag.tag;
            if ((3 === grandTag || 4 === grandTag) && nodeTag.stateNode.containerInfo === targetContainer)
              return;
            nodeTag = nodeTag.return;
          }
        for (; null !== container; ) {
          nodeTag = getClosestInstanceFromNode(container);
          if (null === nodeTag) return;
          grandTag = nodeTag.tag;
          if (5 === grandTag || 6 === grandTag || 26 === grandTag || 27 === grandTag) {
            targetInst$jscomp$0 = ancestorInst = nodeTag;
            continue a;
          }
          container = container.parentNode;
        }
      }
      targetInst$jscomp$0 = targetInst$jscomp$0.return;
    }
  batchedUpdates$1(function() {
    var targetInst = ancestorInst, nativeEventTarget = getEventTarget(nativeEvent), dispatchQueue = [];
    a: {
      var reactName = topLevelEventsToReactNames.get(domEventName);
      if (void 0 !== reactName) {
        var SyntheticEventCtor = SyntheticEvent, reactEventType = domEventName;
        switch (domEventName) {
          case "keypress":
            if (0 === getEventCharCode(nativeEvent)) break a;
          case "keydown":
          case "keyup":
            SyntheticEventCtor = SyntheticKeyboardEvent;
            break;
          case "focusin":
            reactEventType = "focus";
            SyntheticEventCtor = SyntheticFocusEvent;
            break;
          case "focusout":
            reactEventType = "blur";
            SyntheticEventCtor = SyntheticFocusEvent;
            break;
          case "beforeblur":
          case "afterblur":
            SyntheticEventCtor = SyntheticFocusEvent;
            break;
          case "click":
            if (2 === nativeEvent.button) break a;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            SyntheticEventCtor = SyntheticMouseEvent;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            SyntheticEventCtor = SyntheticDragEvent;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            SyntheticEventCtor = SyntheticTouchEvent;
            break;
          case ANIMATION_END:
          case ANIMATION_ITERATION:
          case ANIMATION_START:
            SyntheticEventCtor = SyntheticAnimationEvent;
            break;
          case TRANSITION_END:
            SyntheticEventCtor = SyntheticTransitionEvent;
            break;
          case "scroll":
          case "scrollend":
            SyntheticEventCtor = SyntheticUIEvent;
            break;
          case "wheel":
            SyntheticEventCtor = SyntheticWheelEvent;
            break;
          case "copy":
          case "cut":
          case "paste":
            SyntheticEventCtor = SyntheticClipboardEvent;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            SyntheticEventCtor = SyntheticPointerEvent;
            break;
          case "toggle":
          case "beforetoggle":
            SyntheticEventCtor = SyntheticToggleEvent;
        }
        var inCapturePhase = 0 !== (eventSystemFlags & 4), accumulateTargetOnly = !inCapturePhase && ("scroll" === domEventName || "scrollend" === domEventName), reactEventName = inCapturePhase ? null !== reactName ? reactName + "Capture" : null : reactName;
        inCapturePhase = [];
        for (var instance = targetInst, lastHostComponent; null !== instance; ) {
          var _instance = instance;
          lastHostComponent = _instance.stateNode;
          _instance = _instance.tag;
          5 !== _instance && 26 !== _instance && 27 !== _instance || null === lastHostComponent || null === reactEventName || (_instance = getListener(instance, reactEventName), null != _instance && inCapturePhase.push(
            createDispatchListener(instance, _instance, lastHostComponent)
          ));
          if (accumulateTargetOnly) break;
          instance = instance.return;
        }
        0 < inCapturePhase.length && (reactName = new SyntheticEventCtor(
          reactName,
          reactEventType,
          null,
          nativeEvent,
          nativeEventTarget
        ), dispatchQueue.push({ event: reactName, listeners: inCapturePhase }));
      }
    }
    if (0 === (eventSystemFlags & 7)) {
      a: {
        reactName = "mouseover" === domEventName || "pointerover" === domEventName;
        SyntheticEventCtor = "mouseout" === domEventName || "pointerout" === domEventName;
        if (reactName && nativeEvent !== currentReplayingEvent && (reactEventType = nativeEvent.relatedTarget || nativeEvent.fromElement) && (getClosestInstanceFromNode(reactEventType) || reactEventType[internalContainerInstanceKey]))
          break a;
        if (SyntheticEventCtor || reactName) {
          reactName = nativeEventTarget.window === nativeEventTarget ? nativeEventTarget : (reactName = nativeEventTarget.ownerDocument) ? reactName.defaultView || reactName.parentWindow : window;
          if (SyntheticEventCtor) {
            if (reactEventType = nativeEvent.relatedTarget || nativeEvent.toElement, SyntheticEventCtor = targetInst, reactEventType = reactEventType ? getClosestInstanceFromNode(reactEventType) : null, null !== reactEventType && (accumulateTargetOnly = getNearestMountedFiber(reactEventType), inCapturePhase = reactEventType.tag, reactEventType !== accumulateTargetOnly || 5 !== inCapturePhase && 27 !== inCapturePhase && 6 !== inCapturePhase))
              reactEventType = null;
          } else SyntheticEventCtor = null, reactEventType = targetInst;
          if (SyntheticEventCtor !== reactEventType) {
            inCapturePhase = SyntheticMouseEvent;
            _instance = "onMouseLeave";
            reactEventName = "onMouseEnter";
            instance = "mouse";
            if ("pointerout" === domEventName || "pointerover" === domEventName)
              inCapturePhase = SyntheticPointerEvent, _instance = "onPointerLeave", reactEventName = "onPointerEnter", instance = "pointer";
            accumulateTargetOnly = null == SyntheticEventCtor ? reactName : getNodeFromInstance(SyntheticEventCtor);
            lastHostComponent = null == reactEventType ? reactName : getNodeFromInstance(reactEventType);
            reactName = new inCapturePhase(
              _instance,
              instance + "leave",
              SyntheticEventCtor,
              nativeEvent,
              nativeEventTarget
            );
            reactName.target = accumulateTargetOnly;
            reactName.relatedTarget = lastHostComponent;
            _instance = null;
            getClosestInstanceFromNode(nativeEventTarget) === targetInst && (inCapturePhase = new inCapturePhase(
              reactEventName,
              instance + "enter",
              reactEventType,
              nativeEvent,
              nativeEventTarget
            ), inCapturePhase.target = lastHostComponent, inCapturePhase.relatedTarget = accumulateTargetOnly, _instance = inCapturePhase);
            accumulateTargetOnly = _instance;
            if (SyntheticEventCtor && reactEventType)
              b: {
                inCapturePhase = getParent;
                reactEventName = SyntheticEventCtor;
                instance = reactEventType;
                lastHostComponent = 0;
                for (_instance = reactEventName; _instance; _instance = inCapturePhase(_instance))
                  lastHostComponent++;
                _instance = 0;
                for (var tempB = instance; tempB; tempB = inCapturePhase(tempB))
                  _instance++;
                for (; 0 < lastHostComponent - _instance; )
                  reactEventName = inCapturePhase(reactEventName), lastHostComponent--;
                for (; 0 < _instance - lastHostComponent; )
                  instance = inCapturePhase(instance), _instance--;
                for (; lastHostComponent--; ) {
                  if (reactEventName === instance || null !== instance && reactEventName === instance.alternate) {
                    inCapturePhase = reactEventName;
                    break b;
                  }
                  reactEventName = inCapturePhase(reactEventName);
                  instance = inCapturePhase(instance);
                }
                inCapturePhase = null;
              }
            else inCapturePhase = null;
            null !== SyntheticEventCtor && accumulateEnterLeaveListenersForEvent(
              dispatchQueue,
              reactName,
              SyntheticEventCtor,
              inCapturePhase,
              false
            );
            null !== reactEventType && null !== accumulateTargetOnly && accumulateEnterLeaveListenersForEvent(
              dispatchQueue,
              accumulateTargetOnly,
              reactEventType,
              inCapturePhase,
              true
            );
          }
        }
      }
      a: {
        reactName = targetInst ? getNodeFromInstance(targetInst) : window;
        SyntheticEventCtor = reactName.nodeName && reactName.nodeName.toLowerCase();
        if ("select" === SyntheticEventCtor || "input" === SyntheticEventCtor && "file" === reactName.type)
          var getTargetInstFunc = getTargetInstForChangeEvent;
        else if (isTextInputElement(reactName))
          if (isInputEventSupported)
            getTargetInstFunc = getTargetInstForInputOrChangeEvent;
          else {
            getTargetInstFunc = getTargetInstForInputEventPolyfill;
            var handleEventFunc = handleEventsForInputEventPolyfill;
          }
        else
          SyntheticEventCtor = reactName.nodeName, !SyntheticEventCtor || "input" !== SyntheticEventCtor.toLowerCase() || "checkbox" !== reactName.type && "radio" !== reactName.type ? targetInst && isCustomElement(targetInst.elementType) && (getTargetInstFunc = getTargetInstForChangeEvent) : getTargetInstFunc = getTargetInstForClickEvent;
        if (getTargetInstFunc && (getTargetInstFunc = getTargetInstFunc(domEventName, targetInst))) {
          createAndAccumulateChangeEvent(
            dispatchQueue,
            getTargetInstFunc,
            nativeEvent,
            nativeEventTarget
          );
          break a;
        }
        handleEventFunc && handleEventFunc(domEventName, reactName, targetInst);
        "focusout" === domEventName && targetInst && "number" === reactName.type && null != targetInst.memoizedProps.value && setDefaultValue(reactName, "number", reactName.value);
      }
      handleEventFunc = targetInst ? getNodeFromInstance(targetInst) : window;
      switch (domEventName) {
        case "focusin":
          if (isTextInputElement(handleEventFunc) || "true" === handleEventFunc.contentEditable)
            activeElement = handleEventFunc, activeElementInst = targetInst, lastSelection = null;
          break;
        case "focusout":
          lastSelection = activeElementInst = activeElement = null;
          break;
        case "mousedown":
          mouseDown = true;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          mouseDown = false;
          constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget);
          break;
        case "selectionchange":
          if (skipSelectionChangeEvent) break;
        case "keydown":
        case "keyup":
          constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget);
      }
      var fallbackData;
      if (canUseCompositionEvent)
        b: {
          switch (domEventName) {
            case "compositionstart":
              var eventType = "onCompositionStart";
              break b;
            case "compositionend":
              eventType = "onCompositionEnd";
              break b;
            case "compositionupdate":
              eventType = "onCompositionUpdate";
              break b;
          }
          eventType = void 0;
        }
      else
        isComposing ? isFallbackCompositionEnd(domEventName, nativeEvent) && (eventType = "onCompositionEnd") : "keydown" === domEventName && 229 === nativeEvent.keyCode && (eventType = "onCompositionStart");
      eventType && (useFallbackCompositionData && "ko" !== nativeEvent.locale && (isComposing || "onCompositionStart" !== eventType ? "onCompositionEnd" === eventType && isComposing && (fallbackData = getData()) : (root = nativeEventTarget, startText = "value" in root ? root.value : root.textContent, isComposing = true)), handleEventFunc = accumulateTwoPhaseListeners(targetInst, eventType), 0 < handleEventFunc.length && (eventType = new SyntheticCompositionEvent(
        eventType,
        domEventName,
        null,
        nativeEvent,
        nativeEventTarget
      ), dispatchQueue.push({ event: eventType, listeners: handleEventFunc }), fallbackData ? eventType.data = fallbackData : (fallbackData = getDataFromCustomEvent(nativeEvent), null !== fallbackData && (eventType.data = fallbackData))));
      if (fallbackData = canUseTextInputEvent ? getNativeBeforeInputChars(domEventName, nativeEvent) : getFallbackBeforeInputChars(domEventName, nativeEvent))
        eventType = accumulateTwoPhaseListeners(targetInst, "onBeforeInput"), 0 < eventType.length && (handleEventFunc = new SyntheticCompositionEvent(
          "onBeforeInput",
          "beforeinput",
          null,
          nativeEvent,
          nativeEventTarget
        ), dispatchQueue.push({
          event: handleEventFunc,
          listeners: eventType
        }), handleEventFunc.data = fallbackData);
      extractEvents$1(
        dispatchQueue,
        domEventName,
        targetInst,
        nativeEvent,
        nativeEventTarget
      );
    }
    processDispatchQueue(dispatchQueue, eventSystemFlags);
  });
}
function createDispatchListener(instance, listener, currentTarget) {
  return {
    instance,
    listener,
    currentTarget
  };
}
function accumulateTwoPhaseListeners(targetFiber, reactName) {
  for (var captureName = reactName + "Capture", listeners = []; null !== targetFiber; ) {
    var _instance2 = targetFiber, stateNode = _instance2.stateNode;
    _instance2 = _instance2.tag;
    5 !== _instance2 && 26 !== _instance2 && 27 !== _instance2 || null === stateNode || (_instance2 = getListener(targetFiber, captureName), null != _instance2 && listeners.unshift(
      createDispatchListener(targetFiber, _instance2, stateNode)
    ), _instance2 = getListener(targetFiber, reactName), null != _instance2 && listeners.push(
      createDispatchListener(targetFiber, _instance2, stateNode)
    ));
    if (3 === targetFiber.tag) return listeners;
    targetFiber = targetFiber.return;
  }
  return [];
}
function getParent(inst) {
  if (null === inst) return null;
  do
    inst = inst.return;
  while (inst && 5 !== inst.tag && 27 !== inst.tag);
  return inst ? inst : null;
}
function accumulateEnterLeaveListenersForEvent(dispatchQueue, event, target, common, inCapturePhase) {
  for (var registrationName = event._reactName, listeners = []; null !== target && target !== common; ) {
    var _instance3 = target, alternate = _instance3.alternate, stateNode = _instance3.stateNode;
    _instance3 = _instance3.tag;
    if (null !== alternate && alternate === common) break;
    5 !== _instance3 && 26 !== _instance3 && 27 !== _instance3 || null === stateNode || (alternate = stateNode, inCapturePhase ? (stateNode = getListener(target, registrationName), null != stateNode && listeners.unshift(
      createDispatchListener(target, stateNode, alternate)
    )) : inCapturePhase || (stateNode = getListener(target, registrationName), null != stateNode && listeners.push(
      createDispatchListener(target, stateNode, alternate)
    )));
    target = target.return;
  }
  0 !== listeners.length && dispatchQueue.push({ event, listeners });
}
var NORMALIZE_NEWLINES_REGEX = /\r\n?/g, NORMALIZE_NULL_AND_REPLACEMENT_REGEX = /\u0000|\uFFFD/g;
function normalizeMarkupForTextOrAttribute(markup) {
  return ("string" === typeof markup ? markup : "" + markup).replace(NORMALIZE_NEWLINES_REGEX, "\n").replace(NORMALIZE_NULL_AND_REPLACEMENT_REGEX, "");
}
function checkForUnmatchedText(serverText, clientText) {
  clientText = normalizeMarkupForTextOrAttribute(clientText);
  return normalizeMarkupForTextOrAttribute(serverText) === clientText ? true : false;
}
function setProp(domElement, tag, key, value, props, prevValue) {
  switch (key) {
    case "children":
      "string" === typeof value ? "body" === tag || "textarea" === tag && "" === value || setTextContent(domElement, value) : ("number" === typeof value || "bigint" === typeof value) && "body" !== tag && setTextContent(domElement, "" + value);
      break;
    case "className":
      setValueForKnownAttribute(domElement, "class", value);
      break;
    case "tabIndex":
      setValueForKnownAttribute(domElement, "tabindex", value);
      break;
    case "dir":
    case "role":
    case "viewBox":
    case "width":
    case "height":
      setValueForKnownAttribute(domElement, key, value);
      break;
    case "style":
      setValueForStyles(domElement, value, prevValue);
      break;
    case "data":
      if ("object" !== tag) {
        setValueForKnownAttribute(domElement, "data", value);
        break;
      }
    case "src":
    case "href":
      if ("" === value && ("a" !== tag || "href" !== key)) {
        domElement.removeAttribute(key);
        break;
      }
      if (null == value || "function" === typeof value || "symbol" === typeof value || "boolean" === typeof value) {
        domElement.removeAttribute(key);
        break;
      }
      value = sanitizeURL("" + value);
      domElement.setAttribute(key, value);
      break;
    case "action":
    case "formAction":
      if ("function" === typeof value) {
        domElement.setAttribute(
          key,
          "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
        );
        break;
      } else
        "function" === typeof prevValue && ("formAction" === key ? ("input" !== tag && setProp(domElement, tag, "name", props.name, props, null), setProp(
          domElement,
          tag,
          "formEncType",
          props.formEncType,
          props,
          null
        ), setProp(
          domElement,
          tag,
          "formMethod",
          props.formMethod,
          props,
          null
        ), setProp(
          domElement,
          tag,
          "formTarget",
          props.formTarget,
          props,
          null
        )) : (setProp(domElement, tag, "encType", props.encType, props, null), setProp(domElement, tag, "method", props.method, props, null), setProp(domElement, tag, "target", props.target, props, null)));
      if (null == value || "symbol" === typeof value || "boolean" === typeof value) {
        domElement.removeAttribute(key);
        break;
      }
      value = sanitizeURL("" + value);
      domElement.setAttribute(key, value);
      break;
    case "onClick":
      null != value && (domElement.onclick = noop$1);
      break;
    case "onScroll":
      null != value && listenToNonDelegatedEvent("scroll", domElement);
      break;
    case "onScrollEnd":
      null != value && listenToNonDelegatedEvent("scrollend", domElement);
      break;
    case "dangerouslySetInnerHTML":
      if (null != value) {
        if ("object" !== typeof value || !("__html" in value))
          throw Error(formatProdErrorMessage(61));
        key = value.__html;
        if (null != key) {
          if (null != props.children) throw Error(formatProdErrorMessage(60));
          domElement.innerHTML = key;
        }
      }
      break;
    case "multiple":
      domElement.multiple = value && "function" !== typeof value && "symbol" !== typeof value;
      break;
    case "muted":
      domElement.muted = value && "function" !== typeof value && "symbol" !== typeof value;
      break;
    case "suppressContentEditableWarning":
    case "suppressHydrationWarning":
    case "defaultValue":
    case "defaultChecked":
    case "innerHTML":
    case "ref":
      break;
    case "autoFocus":
      break;
    case "xlinkHref":
      if (null == value || "function" === typeof value || "boolean" === typeof value || "symbol" === typeof value) {
        domElement.removeAttribute("xlink:href");
        break;
      }
      key = sanitizeURL("" + value);
      domElement.setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "xlink:href",
        key
      );
      break;
    case "contentEditable":
    case "spellCheck":
    case "draggable":
    case "value":
    case "autoReverse":
    case "externalResourcesRequired":
    case "focusable":
    case "preserveAlpha":
      null != value && "function" !== typeof value && "symbol" !== typeof value ? domElement.setAttribute(key, "" + value) : domElement.removeAttribute(key);
      break;
    case "inert":
    case "allowFullScreen":
    case "async":
    case "autoPlay":
    case "controls":
    case "default":
    case "defer":
    case "disabled":
    case "disablePictureInPicture":
    case "disableRemotePlayback":
    case "formNoValidate":
    case "hidden":
    case "loop":
    case "noModule":
    case "noValidate":
    case "open":
    case "playsInline":
    case "readOnly":
    case "required":
    case "reversed":
    case "scoped":
    case "seamless":
    case "itemScope":
      value && "function" !== typeof value && "symbol" !== typeof value ? domElement.setAttribute(key, "") : domElement.removeAttribute(key);
      break;
    case "capture":
    case "download":
      true === value ? domElement.setAttribute(key, "") : false !== value && null != value && "function" !== typeof value && "symbol" !== typeof value ? domElement.setAttribute(key, value) : domElement.removeAttribute(key);
      break;
    case "cols":
    case "rows":
    case "size":
    case "span":
      null != value && "function" !== typeof value && "symbol" !== typeof value && !isNaN(value) && 1 <= value ? domElement.setAttribute(key, value) : domElement.removeAttribute(key);
      break;
    case "rowSpan":
    case "start":
      null == value || "function" === typeof value || "symbol" === typeof value || isNaN(value) ? domElement.removeAttribute(key) : domElement.setAttribute(key, value);
      break;
    case "popover":
      listenToNonDelegatedEvent("beforetoggle", domElement);
      listenToNonDelegatedEvent("toggle", domElement);
      setValueForAttribute(domElement, "popover", value);
      break;
    case "xlinkActuate":
      setValueForNamespacedAttribute(
        domElement,
        "http://www.w3.org/1999/xlink",
        "xlink:actuate",
        value
      );
      break;
    case "xlinkArcrole":
      setValueForNamespacedAttribute(
        domElement,
        "http://www.w3.org/1999/xlink",
        "xlink:arcrole",
        value
      );
      break;
    case "xlinkRole":
      setValueForNamespacedAttribute(
        domElement,
        "http://www.w3.org/1999/xlink",
        "xlink:role",
        value
      );
      break;
    case "xlinkShow":
      setValueForNamespacedAttribute(
        domElement,
        "http://www.w3.org/1999/xlink",
        "xlink:show",
        value
      );
      break;
    case "xlinkTitle":
      setValueForNamespacedAttribute(
        domElement,
        "http://www.w3.org/1999/xlink",
        "xlink:title",
        value
      );
      break;
    case "xlinkType":
      setValueForNamespacedAttribute(
        domElement,
        "http://www.w3.org/1999/xlink",
        "xlink:type",
        value
      );
      break;
    case "xmlBase":
      setValueForNamespacedAttribute(
        domElement,
        "http://www.w3.org/XML/1998/namespace",
        "xml:base",
        value
      );
      break;
    case "xmlLang":
      setValueForNamespacedAttribute(
        domElement,
        "http://www.w3.org/XML/1998/namespace",
        "xml:lang",
        value
      );
      break;
    case "xmlSpace":
      setValueForNamespacedAttribute(
        domElement,
        "http://www.w3.org/XML/1998/namespace",
        "xml:space",
        value
      );
      break;
    case "is":
      setValueForAttribute(domElement, "is", value);
      break;
    case "innerText":
    case "textContent":
      break;
    default:
      if (!(2 < key.length) || "o" !== key[0] && "O" !== key[0] || "n" !== key[1] && "N" !== key[1])
        key = aliases.get(key) || key, setValueForAttribute(domElement, key, value);
  }
}
function setPropOnCustomElement(domElement, tag, key, value, props, prevValue) {
  switch (key) {
    case "style":
      setValueForStyles(domElement, value, prevValue);
      break;
    case "dangerouslySetInnerHTML":
      if (null != value) {
        if ("object" !== typeof value || !("__html" in value))
          throw Error(formatProdErrorMessage(61));
        key = value.__html;
        if (null != key) {
          if (null != props.children) throw Error(formatProdErrorMessage(60));
          domElement.innerHTML = key;
        }
      }
      break;
    case "children":
      "string" === typeof value ? setTextContent(domElement, value) : ("number" === typeof value || "bigint" === typeof value) && setTextContent(domElement, "" + value);
      break;
    case "onScroll":
      null != value && listenToNonDelegatedEvent("scroll", domElement);
      break;
    case "onScrollEnd":
      null != value && listenToNonDelegatedEvent("scrollend", domElement);
      break;
    case "onClick":
      null != value && (domElement.onclick = noop$1);
      break;
    case "suppressContentEditableWarning":
    case "suppressHydrationWarning":
    case "innerHTML":
    case "ref":
      break;
    case "innerText":
    case "textContent":
      break;
    default:
      if (!registrationNameDependencies.hasOwnProperty(key))
        a: {
          if ("o" === key[0] && "n" === key[1] && (props = key.endsWith("Capture"), tag = key.slice(2, props ? key.length - 7 : void 0), prevValue = domElement[internalPropsKey] || null, prevValue = null != prevValue ? prevValue[key] : null, "function" === typeof prevValue && domElement.removeEventListener(tag, prevValue, props), "function" === typeof value)) {
            "function" !== typeof prevValue && null !== prevValue && (key in domElement ? domElement[key] = null : domElement.hasAttribute(key) && domElement.removeAttribute(key));
            domElement.addEventListener(tag, value, props);
            break a;
          }
          key in domElement ? domElement[key] = value : true === value ? domElement.setAttribute(key, "") : setValueForAttribute(domElement, key, value);
        }
  }
}
function setInitialProperties(domElement, tag, props) {
  switch (tag) {
    case "div":
    case "span":
    case "svg":
    case "path":
    case "a":
    case "g":
    case "p":
    case "li":
      break;
    case "img":
      listenToNonDelegatedEvent("error", domElement);
      listenToNonDelegatedEvent("load", domElement);
      var hasSrc = false, hasSrcSet = false, propKey;
      for (propKey in props)
        if (props.hasOwnProperty(propKey)) {
          var propValue = props[propKey];
          if (null != propValue)
            switch (propKey) {
              case "src":
                hasSrc = true;
                break;
              case "srcSet":
                hasSrcSet = true;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(formatProdErrorMessage(137, tag));
              default:
                setProp(domElement, tag, propKey, propValue, props, null);
            }
        }
      hasSrcSet && setProp(domElement, tag, "srcSet", props.srcSet, props, null);
      hasSrc && setProp(domElement, tag, "src", props.src, props, null);
      return;
    case "input":
      listenToNonDelegatedEvent("invalid", domElement);
      var defaultValue = propKey = propValue = hasSrcSet = null, checked = null, defaultChecked = null;
      for (hasSrc in props)
        if (props.hasOwnProperty(hasSrc)) {
          var propValue$184 = props[hasSrc];
          if (null != propValue$184)
            switch (hasSrc) {
              case "name":
                hasSrcSet = propValue$184;
                break;
              case "type":
                propValue = propValue$184;
                break;
              case "checked":
                checked = propValue$184;
                break;
              case "defaultChecked":
                defaultChecked = propValue$184;
                break;
              case "value":
                propKey = propValue$184;
                break;
              case "defaultValue":
                defaultValue = propValue$184;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (null != propValue$184)
                  throw Error(formatProdErrorMessage(137, tag));
                break;
              default:
                setProp(domElement, tag, hasSrc, propValue$184, props, null);
            }
        }
      initInput(
        domElement,
        propKey,
        defaultValue,
        checked,
        defaultChecked,
        propValue,
        hasSrcSet,
        false
      );
      return;
    case "select":
      listenToNonDelegatedEvent("invalid", domElement);
      hasSrc = propValue = propKey = null;
      for (hasSrcSet in props)
        if (props.hasOwnProperty(hasSrcSet) && (defaultValue = props[hasSrcSet], null != defaultValue))
          switch (hasSrcSet) {
            case "value":
              propKey = defaultValue;
              break;
            case "defaultValue":
              propValue = defaultValue;
              break;
            case "multiple":
              hasSrc = defaultValue;
            default:
              setProp(domElement, tag, hasSrcSet, defaultValue, props, null);
          }
      tag = propKey;
      props = propValue;
      domElement.multiple = !!hasSrc;
      null != tag ? updateOptions(domElement, !!hasSrc, tag, false) : null != props && updateOptions(domElement, !!hasSrc, props, true);
      return;
    case "textarea":
      listenToNonDelegatedEvent("invalid", domElement);
      propKey = hasSrcSet = hasSrc = null;
      for (propValue in props)
        if (props.hasOwnProperty(propValue) && (defaultValue = props[propValue], null != defaultValue))
          switch (propValue) {
            case "value":
              hasSrc = defaultValue;
              break;
            case "defaultValue":
              hasSrcSet = defaultValue;
              break;
            case "children":
              propKey = defaultValue;
              break;
            case "dangerouslySetInnerHTML":
              if (null != defaultValue) throw Error(formatProdErrorMessage(91));
              break;
            default:
              setProp(domElement, tag, propValue, defaultValue, props, null);
          }
      initTextarea(domElement, hasSrc, hasSrcSet, propKey);
      return;
    case "option":
      for (checked in props)
        if (props.hasOwnProperty(checked) && (hasSrc = props[checked], null != hasSrc))
          switch (checked) {
            case "selected":
              domElement.selected = hasSrc && "function" !== typeof hasSrc && "symbol" !== typeof hasSrc;
              break;
            default:
              setProp(domElement, tag, checked, hasSrc, props, null);
          }
      return;
    case "dialog":
      listenToNonDelegatedEvent("beforetoggle", domElement);
      listenToNonDelegatedEvent("toggle", domElement);
      listenToNonDelegatedEvent("cancel", domElement);
      listenToNonDelegatedEvent("close", domElement);
      break;
    case "iframe":
    case "object":
      listenToNonDelegatedEvent("load", domElement);
      break;
    case "video":
    case "audio":
      for (hasSrc = 0; hasSrc < mediaEventTypes.length; hasSrc++)
        listenToNonDelegatedEvent(mediaEventTypes[hasSrc], domElement);
      break;
    case "image":
      listenToNonDelegatedEvent("error", domElement);
      listenToNonDelegatedEvent("load", domElement);
      break;
    case "details":
      listenToNonDelegatedEvent("toggle", domElement);
      break;
    case "embed":
    case "source":
    case "link":
      listenToNonDelegatedEvent("error", domElement), listenToNonDelegatedEvent("load", domElement);
    case "area":
    case "base":
    case "br":
    case "col":
    case "hr":
    case "keygen":
    case "meta":
    case "param":
    case "track":
    case "wbr":
    case "menuitem":
      for (defaultChecked in props)
        if (props.hasOwnProperty(defaultChecked) && (hasSrc = props[defaultChecked], null != hasSrc))
          switch (defaultChecked) {
            case "children":
            case "dangerouslySetInnerHTML":
              throw Error(formatProdErrorMessage(137, tag));
            default:
              setProp(domElement, tag, defaultChecked, hasSrc, props, null);
          }
      return;
    default:
      if (isCustomElement(tag)) {
        for (propValue$184 in props)
          props.hasOwnProperty(propValue$184) && (hasSrc = props[propValue$184], void 0 !== hasSrc && setPropOnCustomElement(
            domElement,
            tag,
            propValue$184,
            hasSrc,
            props,
            void 0
          ));
        return;
      }
  }
  for (defaultValue in props)
    props.hasOwnProperty(defaultValue) && (hasSrc = props[defaultValue], null != hasSrc && setProp(domElement, tag, defaultValue, hasSrc, props, null));
}
function updateProperties(domElement, tag, lastProps, nextProps) {
  switch (tag) {
    case "div":
    case "span":
    case "svg":
    case "path":
    case "a":
    case "g":
    case "p":
    case "li":
      break;
    case "input":
      var name = null, type = null, value = null, defaultValue = null, lastDefaultValue = null, checked = null, defaultChecked = null;
      for (propKey in lastProps) {
        var lastProp = lastProps[propKey];
        if (lastProps.hasOwnProperty(propKey) && null != lastProp)
          switch (propKey) {
            case "checked":
              break;
            case "value":
              break;
            case "defaultValue":
              lastDefaultValue = lastProp;
            default:
              nextProps.hasOwnProperty(propKey) || setProp(domElement, tag, propKey, null, nextProps, lastProp);
          }
      }
      for (var propKey$201 in nextProps) {
        var propKey = nextProps[propKey$201];
        lastProp = lastProps[propKey$201];
        if (nextProps.hasOwnProperty(propKey$201) && (null != propKey || null != lastProp))
          switch (propKey$201) {
            case "type":
              type = propKey;
              break;
            case "name":
              name = propKey;
              break;
            case "checked":
              checked = propKey;
              break;
            case "defaultChecked":
              defaultChecked = propKey;
              break;
            case "value":
              value = propKey;
              break;
            case "defaultValue":
              defaultValue = propKey;
              break;
            case "children":
            case "dangerouslySetInnerHTML":
              if (null != propKey)
                throw Error(formatProdErrorMessage(137, tag));
              break;
            default:
              propKey !== lastProp && setProp(
                domElement,
                tag,
                propKey$201,
                propKey,
                nextProps,
                lastProp
              );
          }
      }
      updateInput(
        domElement,
        value,
        defaultValue,
        lastDefaultValue,
        checked,
        defaultChecked,
        type,
        name
      );
      return;
    case "select":
      propKey = value = defaultValue = propKey$201 = null;
      for (type in lastProps)
        if (lastDefaultValue = lastProps[type], lastProps.hasOwnProperty(type) && null != lastDefaultValue)
          switch (type) {
            case "value":
              break;
            case "multiple":
              propKey = lastDefaultValue;
            default:
              nextProps.hasOwnProperty(type) || setProp(
                domElement,
                tag,
                type,
                null,
                nextProps,
                lastDefaultValue
              );
          }
      for (name in nextProps)
        if (type = nextProps[name], lastDefaultValue = lastProps[name], nextProps.hasOwnProperty(name) && (null != type || null != lastDefaultValue))
          switch (name) {
            case "value":
              propKey$201 = type;
              break;
            case "defaultValue":
              defaultValue = type;
              break;
            case "multiple":
              value = type;
            default:
              type !== lastDefaultValue && setProp(
                domElement,
                tag,
                name,
                type,
                nextProps,
                lastDefaultValue
              );
          }
      tag = defaultValue;
      lastProps = value;
      nextProps = propKey;
      null != propKey$201 ? updateOptions(domElement, !!lastProps, propKey$201, false) : !!nextProps !== !!lastProps && (null != tag ? updateOptions(domElement, !!lastProps, tag, true) : updateOptions(domElement, !!lastProps, lastProps ? [] : "", false));
      return;
    case "textarea":
      propKey = propKey$201 = null;
      for (defaultValue in lastProps)
        if (name = lastProps[defaultValue], lastProps.hasOwnProperty(defaultValue) && null != name && !nextProps.hasOwnProperty(defaultValue))
          switch (defaultValue) {
            case "value":
              break;
            case "children":
              break;
            default:
              setProp(domElement, tag, defaultValue, null, nextProps, name);
          }
      for (value in nextProps)
        if (name = nextProps[value], type = lastProps[value], nextProps.hasOwnProperty(value) && (null != name || null != type))
          switch (value) {
            case "value":
              propKey$201 = name;
              break;
            case "defaultValue":
              propKey = name;
              break;
            case "children":
              break;
            case "dangerouslySetInnerHTML":
              if (null != name) throw Error(formatProdErrorMessage(91));
              break;
            default:
              name !== type && setProp(domElement, tag, value, name, nextProps, type);
          }
      updateTextarea(domElement, propKey$201, propKey);
      return;
    case "option":
      for (var propKey$217 in lastProps)
        if (propKey$201 = lastProps[propKey$217], lastProps.hasOwnProperty(propKey$217) && null != propKey$201 && !nextProps.hasOwnProperty(propKey$217))
          switch (propKey$217) {
            case "selected":
              domElement.selected = false;
              break;
            default:
              setProp(
                domElement,
                tag,
                propKey$217,
                null,
                nextProps,
                propKey$201
              );
          }
      for (lastDefaultValue in nextProps)
        if (propKey$201 = nextProps[lastDefaultValue], propKey = lastProps[lastDefaultValue], nextProps.hasOwnProperty(lastDefaultValue) && propKey$201 !== propKey && (null != propKey$201 || null != propKey))
          switch (lastDefaultValue) {
            case "selected":
              domElement.selected = propKey$201 && "function" !== typeof propKey$201 && "symbol" !== typeof propKey$201;
              break;
            default:
              setProp(
                domElement,
                tag,
                lastDefaultValue,
                propKey$201,
                nextProps,
                propKey
              );
          }
      return;
    case "img":
    case "link":
    case "area":
    case "base":
    case "br":
    case "col":
    case "embed":
    case "hr":
    case "keygen":
    case "meta":
    case "param":
    case "source":
    case "track":
    case "wbr":
    case "menuitem":
      for (var propKey$222 in lastProps)
        propKey$201 = lastProps[propKey$222], lastProps.hasOwnProperty(propKey$222) && null != propKey$201 && !nextProps.hasOwnProperty(propKey$222) && setProp(domElement, tag, propKey$222, null, nextProps, propKey$201);
      for (checked in nextProps)
        if (propKey$201 = nextProps[checked], propKey = lastProps[checked], nextProps.hasOwnProperty(checked) && propKey$201 !== propKey && (null != propKey$201 || null != propKey))
          switch (checked) {
            case "children":
            case "dangerouslySetInnerHTML":
              if (null != propKey$201)
                throw Error(formatProdErrorMessage(137, tag));
              break;
            default:
              setProp(
                domElement,
                tag,
                checked,
                propKey$201,
                nextProps,
                propKey
              );
          }
      return;
    default:
      if (isCustomElement(tag)) {
        for (var propKey$227 in lastProps)
          propKey$201 = lastProps[propKey$227], lastProps.hasOwnProperty(propKey$227) && void 0 !== propKey$201 && !nextProps.hasOwnProperty(propKey$227) && setPropOnCustomElement(
            domElement,
            tag,
            propKey$227,
            void 0,
            nextProps,
            propKey$201
          );
        for (defaultChecked in nextProps)
          propKey$201 = nextProps[defaultChecked], propKey = lastProps[defaultChecked], !nextProps.hasOwnProperty(defaultChecked) || propKey$201 === propKey || void 0 === propKey$201 && void 0 === propKey || setPropOnCustomElement(
            domElement,
            tag,
            defaultChecked,
            propKey$201,
            nextProps,
            propKey
          );
        return;
      }
  }
  for (var propKey$232 in lastProps)
    propKey$201 = lastProps[propKey$232], lastProps.hasOwnProperty(propKey$232) && null != propKey$201 && !nextProps.hasOwnProperty(propKey$232) && setProp(domElement, tag, propKey$232, null, nextProps, propKey$201);
  for (lastProp in nextProps)
    propKey$201 = nextProps[lastProp], propKey = lastProps[lastProp], !nextProps.hasOwnProperty(lastProp) || propKey$201 === propKey || null == propKey$201 && null == propKey || setProp(domElement, tag, lastProp, propKey$201, nextProps, propKey);
}
function isLikelyStaticResource(initiatorType) {
  switch (initiatorType) {
    case "css":
    case "script":
    case "font":
    case "img":
    case "image":
    case "input":
    case "link":
      return true;
    default:
      return false;
  }
}
function estimateBandwidth() {
  if ("function" === typeof performance.getEntriesByType) {
    for (var count = 0, bits = 0, resourceEntries = performance.getEntriesByType("resource"), i = 0; i < resourceEntries.length; i++) {
      var entry = resourceEntries[i], transferSize = entry.transferSize, initiatorType = entry.initiatorType, duration = entry.duration;
      if (transferSize && duration && isLikelyStaticResource(initiatorType)) {
        initiatorType = 0;
        duration = entry.responseEnd;
        for (i += 1; i < resourceEntries.length; i++) {
          var overlapEntry = resourceEntries[i], overlapStartTime = overlapEntry.startTime;
          if (overlapStartTime > duration) break;
          var overlapTransferSize = overlapEntry.transferSize, overlapInitiatorType = overlapEntry.initiatorType;
          overlapTransferSize && isLikelyStaticResource(overlapInitiatorType) && (overlapEntry = overlapEntry.responseEnd, initiatorType += overlapTransferSize * (overlapEntry < duration ? 1 : (duration - overlapStartTime) / (overlapEntry - overlapStartTime)));
        }
        --i;
        bits += 8 * (transferSize + initiatorType) / (entry.duration / 1e3);
        count++;
        if (10 < count) break;
      }
    }
    if (0 < count) return bits / count / 1e6;
  }
  return navigator.connection && (count = navigator.connection.downlink, "number" === typeof count) ? count : 5;
}
var eventsEnabled = null, selectionInformation = null;
function getOwnerDocumentFromRootContainer(rootContainerElement) {
  return 9 === rootContainerElement.nodeType ? rootContainerElement : rootContainerElement.ownerDocument;
}
function getOwnHostContext(namespaceURI) {
  switch (namespaceURI) {
    case "http://www.w3.org/2000/svg":
      return 1;
    case "http://www.w3.org/1998/Math/MathML":
      return 2;
    default:
      return 0;
  }
}
function getChildHostContextProd(parentNamespace, type) {
  if (0 === parentNamespace)
    switch (type) {
      case "svg":
        return 1;
      case "math":
        return 2;
      default:
        return 0;
    }
  return 1 === parentNamespace && "foreignObject" === type ? 0 : parentNamespace;
}
function shouldSetTextContent(type, props) {
  return "textarea" === type || "noscript" === type || "string" === typeof props.children || "number" === typeof props.children || "bigint" === typeof props.children || "object" === typeof props.dangerouslySetInnerHTML && null !== props.dangerouslySetInnerHTML && null != props.dangerouslySetInnerHTML.__html;
}
var currentPopstateTransitionEvent = null;
function shouldAttemptEagerTransition() {
  var event = window.event;
  if (event && "popstate" === event.type) {
    if (event === currentPopstateTransitionEvent) return false;
    currentPopstateTransitionEvent = event;
    return true;
  }
  currentPopstateTransitionEvent = null;
  return false;
}
var scheduleTimeout = "function" === typeof setTimeout ? setTimeout : void 0, cancelTimeout = "function" === typeof clearTimeout ? clearTimeout : void 0, localPromise = "function" === typeof Promise ? Promise : void 0, scheduleMicrotask = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof localPromise ? function(callback) {
  return localPromise.resolve(null).then(callback).catch(handleErrorInNextTick);
} : scheduleTimeout;
function handleErrorInNextTick(error) {
  setTimeout(function() {
    throw error;
  });
}
function isSingletonScope(type) {
  return "head" === type;
}
function clearHydrationBoundary(parentInstance, hydrationInstance) {
  var node = hydrationInstance, depth = 0;
  do {
    var nextNode = node.nextSibling;
    parentInstance.removeChild(node);
    if (nextNode && 8 === nextNode.nodeType)
      if (node = nextNode.data, "/$" === node || "/&" === node) {
        if (0 === depth) {
          parentInstance.removeChild(nextNode);
          retryIfBlockedOn(hydrationInstance);
          return;
        }
        depth--;
      } else if ("$" === node || "$?" === node || "$~" === node || "$!" === node || "&" === node)
        depth++;
      else if ("html" === node)
        releaseSingletonInstance(parentInstance.ownerDocument.documentElement);
      else if ("head" === node) {
        node = parentInstance.ownerDocument.head;
        releaseSingletonInstance(node);
        for (var node$jscomp$0 = node.firstChild; node$jscomp$0; ) {
          var nextNode$jscomp$0 = node$jscomp$0.nextSibling, nodeName = node$jscomp$0.nodeName;
          node$jscomp$0[internalHoistableMarker] || "SCRIPT" === nodeName || "STYLE" === nodeName || "LINK" === nodeName && "stylesheet" === node$jscomp$0.rel.toLowerCase() || node.removeChild(node$jscomp$0);
          node$jscomp$0 = nextNode$jscomp$0;
        }
      } else
        "body" === node && releaseSingletonInstance(parentInstance.ownerDocument.body);
    node = nextNode;
  } while (node);
  retryIfBlockedOn(hydrationInstance);
}
function hideOrUnhideDehydratedBoundary(suspenseInstance, isHidden) {
  var node = suspenseInstance;
  suspenseInstance = 0;
  do {
    var nextNode = node.nextSibling;
    1 === node.nodeType ? isHidden ? (node._stashedDisplay = node.style.display, node.style.display = "none") : (node.style.display = node._stashedDisplay || "", "" === node.getAttribute("style") && node.removeAttribute("style")) : 3 === node.nodeType && (isHidden ? (node._stashedText = node.nodeValue, node.nodeValue = "") : node.nodeValue = node._stashedText || "");
    if (nextNode && 8 === nextNode.nodeType)
      if (node = nextNode.data, "/$" === node)
        if (0 === suspenseInstance) break;
        else suspenseInstance--;
      else
        "$" !== node && "$?" !== node && "$~" !== node && "$!" !== node || suspenseInstance++;
    node = nextNode;
  } while (node);
}
function clearContainerSparingly(container) {
  var nextNode = container.firstChild;
  nextNode && 10 === nextNode.nodeType && (nextNode = nextNode.nextSibling);
  for (; nextNode; ) {
    var node = nextNode;
    nextNode = nextNode.nextSibling;
    switch (node.nodeName) {
      case "HTML":
      case "HEAD":
      case "BODY":
        clearContainerSparingly(node);
        detachDeletedInstance(node);
        continue;
      case "SCRIPT":
      case "STYLE":
        continue;
      case "LINK":
        if ("stylesheet" === node.rel.toLowerCase()) continue;
    }
    container.removeChild(node);
  }
}
function canHydrateInstance(instance, type, props, inRootOrSingleton) {
  for (; 1 === instance.nodeType; ) {
    var anyProps = props;
    if (instance.nodeName.toLowerCase() !== type.toLowerCase()) {
      if (!inRootOrSingleton && ("INPUT" !== instance.nodeName || "hidden" !== instance.type))
        break;
    } else if (!inRootOrSingleton)
      if ("input" === type && "hidden" === instance.type) {
        var name = null == anyProps.name ? null : "" + anyProps.name;
        if ("hidden" === anyProps.type && instance.getAttribute("name") === name)
          return instance;
      } else return instance;
    else if (!instance[internalHoistableMarker])
      switch (type) {
        case "meta":
          if (!instance.hasAttribute("itemprop")) break;
          return instance;
        case "link":
          name = instance.getAttribute("rel");
          if ("stylesheet" === name && instance.hasAttribute("data-precedence"))
            break;
          else if (name !== anyProps.rel || instance.getAttribute("href") !== (null == anyProps.href || "" === anyProps.href ? null : anyProps.href) || instance.getAttribute("crossorigin") !== (null == anyProps.crossOrigin ? null : anyProps.crossOrigin) || instance.getAttribute("title") !== (null == anyProps.title ? null : anyProps.title))
            break;
          return instance;
        case "style":
          if (instance.hasAttribute("data-precedence")) break;
          return instance;
        case "script":
          name = instance.getAttribute("src");
          if ((name !== (null == anyProps.src ? null : anyProps.src) || instance.getAttribute("type") !== (null == anyProps.type ? null : anyProps.type) || instance.getAttribute("crossorigin") !== (null == anyProps.crossOrigin ? null : anyProps.crossOrigin)) && name && instance.hasAttribute("async") && !instance.hasAttribute("itemprop"))
            break;
          return instance;
        default:
          return instance;
      }
    instance = getNextHydratable(instance.nextSibling);
    if (null === instance) break;
  }
  return null;
}
function canHydrateTextInstance(instance, text, inRootOrSingleton) {
  if ("" === text) return null;
  for (; 3 !== instance.nodeType; ) {
    if ((1 !== instance.nodeType || "INPUT" !== instance.nodeName || "hidden" !== instance.type) && !inRootOrSingleton)
      return null;
    instance = getNextHydratable(instance.nextSibling);
    if (null === instance) return null;
  }
  return instance;
}
function canHydrateHydrationBoundary(instance, inRootOrSingleton) {
  for (; 8 !== instance.nodeType; ) {
    if ((1 !== instance.nodeType || "INPUT" !== instance.nodeName || "hidden" !== instance.type) && !inRootOrSingleton)
      return null;
    instance = getNextHydratable(instance.nextSibling);
    if (null === instance) return null;
  }
  return instance;
}
function isSuspenseInstancePending(instance) {
  return "$?" === instance.data || "$~" === instance.data;
}
function isSuspenseInstanceFallback(instance) {
  return "$!" === instance.data || "$?" === instance.data && "loading" !== instance.ownerDocument.readyState;
}
function registerSuspenseInstanceRetry(instance, callback) {
  var ownerDocument = instance.ownerDocument;
  if ("$~" === instance.data) instance._reactRetry = callback;
  else if ("$?" !== instance.data || "loading" !== ownerDocument.readyState)
    callback();
  else {
    var listener = function() {
      callback();
      ownerDocument.removeEventListener("DOMContentLoaded", listener);
    };
    ownerDocument.addEventListener("DOMContentLoaded", listener);
    instance._reactRetry = listener;
  }
}
function getNextHydratable(node) {
  for (; null != node; node = node.nextSibling) {
    var nodeType = node.nodeType;
    if (1 === nodeType || 3 === nodeType) break;
    if (8 === nodeType) {
      nodeType = node.data;
      if ("$" === nodeType || "$!" === nodeType || "$?" === nodeType || "$~" === nodeType || "&" === nodeType || "F!" === nodeType || "F" === nodeType)
        break;
      if ("/$" === nodeType || "/&" === nodeType) return null;
    }
  }
  return node;
}
var previousHydratableOnEnteringScopedSingleton = null;
function getNextHydratableInstanceAfterHydrationBoundary(hydrationInstance) {
  hydrationInstance = hydrationInstance.nextSibling;
  for (var depth = 0; hydrationInstance; ) {
    if (8 === hydrationInstance.nodeType) {
      var data = hydrationInstance.data;
      if ("/$" === data || "/&" === data) {
        if (0 === depth)
          return getNextHydratable(hydrationInstance.nextSibling);
        depth--;
      } else
        "$" !== data && "$!" !== data && "$?" !== data && "$~" !== data && "&" !== data || depth++;
    }
    hydrationInstance = hydrationInstance.nextSibling;
  }
  return null;
}
function getParentHydrationBoundary(targetInstance) {
  targetInstance = targetInstance.previousSibling;
  for (var depth = 0; targetInstance; ) {
    if (8 === targetInstance.nodeType) {
      var data = targetInstance.data;
      if ("$" === data || "$!" === data || "$?" === data || "$~" === data || "&" === data) {
        if (0 === depth) return targetInstance;
        depth--;
      } else "/$" !== data && "/&" !== data || depth++;
    }
    targetInstance = targetInstance.previousSibling;
  }
  return null;
}
function resolveSingletonInstance(type, props, rootContainerInstance) {
  props = getOwnerDocumentFromRootContainer(rootContainerInstance);
  switch (type) {
    case "html":
      type = props.documentElement;
      if (!type) throw Error(formatProdErrorMessage(452));
      return type;
    case "head":
      type = props.head;
      if (!type) throw Error(formatProdErrorMessage(453));
      return type;
    case "body":
      type = props.body;
      if (!type) throw Error(formatProdErrorMessage(454));
      return type;
    default:
      throw Error(formatProdErrorMessage(451));
  }
}
function releaseSingletonInstance(instance) {
  for (var attributes = instance.attributes; attributes.length; )
    instance.removeAttributeNode(attributes[0]);
  detachDeletedInstance(instance);
}
var preloadPropsMap = /* @__PURE__ */ new Map(), preconnectsSet = /* @__PURE__ */ new Set();
function getHoistableRoot(container) {
  return "function" === typeof container.getRootNode ? container.getRootNode() : 9 === container.nodeType ? container : container.ownerDocument;
}
var previousDispatcher = ReactDOMSharedInternals.d;
ReactDOMSharedInternals.d = {
  f: flushSyncWork,
  r: requestFormReset,
  D: prefetchDNS,
  C: preconnect,
  L: preload,
  m: preloadModule,
  X: preinitScript,
  S: preinitStyle,
  M: preinitModuleScript
};
function flushSyncWork() {
  var previousWasRendering = previousDispatcher.f(), wasRendering = flushSyncWork$1();
  return previousWasRendering || wasRendering;
}
function requestFormReset(form) {
  var formInst = getInstanceFromNode(form);
  null !== formInst && 5 === formInst.tag && "form" === formInst.type ? requestFormReset$1(formInst) : previousDispatcher.r(form);
}
var globalDocument = "undefined" === typeof document ? null : document;
function preconnectAs(rel, href, crossOrigin) {
  var ownerDocument = globalDocument;
  if (ownerDocument && "string" === typeof href && href) {
    var limitedEscapedHref = escapeSelectorAttributeValueInsideDoubleQuotes(href);
    limitedEscapedHref = 'link[rel="' + rel + '"][href="' + limitedEscapedHref + '"]';
    "string" === typeof crossOrigin && (limitedEscapedHref += '[crossorigin="' + crossOrigin + '"]');
    preconnectsSet.has(limitedEscapedHref) || (preconnectsSet.add(limitedEscapedHref), rel = { rel, crossOrigin, href }, null === ownerDocument.querySelector(limitedEscapedHref) && (href = ownerDocument.createElement("link"), setInitialProperties(href, "link", rel), markNodeAsHoistable(href), ownerDocument.head.appendChild(href)));
  }
}
function prefetchDNS(href) {
  previousDispatcher.D(href);
  preconnectAs("dns-prefetch", href, null);
}
function preconnect(href, crossOrigin) {
  previousDispatcher.C(href, crossOrigin);
  preconnectAs("preconnect", href, crossOrigin);
}
function preload(href, as, options) {
  previousDispatcher.L(href, as, options);
  var ownerDocument = globalDocument;
  if (ownerDocument && href && as) {
    var preloadSelector = 'link[rel="preload"][as="' + escapeSelectorAttributeValueInsideDoubleQuotes(as) + '"]';
    "image" === as ? options && options.imageSrcSet ? (preloadSelector += '[imagesrcset="' + escapeSelectorAttributeValueInsideDoubleQuotes(
      options.imageSrcSet
    ) + '"]', "string" === typeof options.imageSizes && (preloadSelector += '[imagesizes="' + escapeSelectorAttributeValueInsideDoubleQuotes(
      options.imageSizes
    ) + '"]')) : preloadSelector += '[href="' + escapeSelectorAttributeValueInsideDoubleQuotes(href) + '"]' : preloadSelector += '[href="' + escapeSelectorAttributeValueInsideDoubleQuotes(href) + '"]';
    var key = preloadSelector;
    switch (as) {
      case "style":
        key = getStyleKey(href);
        break;
      case "script":
        key = getScriptKey(href);
    }
    preloadPropsMap.has(key) || (href = assign(
      {
        rel: "preload",
        href: "image" === as && options && options.imageSrcSet ? void 0 : href,
        as
      },
      options
    ), preloadPropsMap.set(key, href), null !== ownerDocument.querySelector(preloadSelector) || "style" === as && ownerDocument.querySelector(getStylesheetSelectorFromKey(key)) || "script" === as && ownerDocument.querySelector(getScriptSelectorFromKey(key)) || (as = ownerDocument.createElement("link"), setInitialProperties(as, "link", href), markNodeAsHoistable(as), ownerDocument.head.appendChild(as)));
  }
}
function preloadModule(href, options) {
  previousDispatcher.m(href, options);
  var ownerDocument = globalDocument;
  if (ownerDocument && href) {
    var as = options && "string" === typeof options.as ? options.as : "script", preloadSelector = 'link[rel="modulepreload"][as="' + escapeSelectorAttributeValueInsideDoubleQuotes(as) + '"][href="' + escapeSelectorAttributeValueInsideDoubleQuotes(href) + '"]', key = preloadSelector;
    switch (as) {
      case "audioworklet":
      case "paintworklet":
      case "serviceworker":
      case "sharedworker":
      case "worker":
      case "script":
        key = getScriptKey(href);
    }
    if (!preloadPropsMap.has(key) && (href = assign({ rel: "modulepreload", href }, options), preloadPropsMap.set(key, href), null === ownerDocument.querySelector(preloadSelector))) {
      switch (as) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          if (ownerDocument.querySelector(getScriptSelectorFromKey(key)))
            return;
      }
      as = ownerDocument.createElement("link");
      setInitialProperties(as, "link", href);
      markNodeAsHoistable(as);
      ownerDocument.head.appendChild(as);
    }
  }
}
function preinitStyle(href, precedence, options) {
  previousDispatcher.S(href, precedence, options);
  var ownerDocument = globalDocument;
  if (ownerDocument && href) {
    var styles = getResourcesFromRoot(ownerDocument).hoistableStyles, key = getStyleKey(href);
    precedence = precedence || "default";
    var resource = styles.get(key);
    if (!resource) {
      var state = { loading: 0, preload: null };
      if (resource = ownerDocument.querySelector(
        getStylesheetSelectorFromKey(key)
      ))
        state.loading = 5;
      else {
        href = assign(
          { rel: "stylesheet", href, "data-precedence": precedence },
          options
        );
        (options = preloadPropsMap.get(key)) && adoptPreloadPropsForStylesheet(href, options);
        var link = resource = ownerDocument.createElement("link");
        markNodeAsHoistable(link);
        setInitialProperties(link, "link", href);
        link._p = new Promise(function(resolve, reject) {
          link.onload = resolve;
          link.onerror = reject;
        });
        link.addEventListener("load", function() {
          state.loading |= 1;
        });
        link.addEventListener("error", function() {
          state.loading |= 2;
        });
        state.loading |= 4;
        insertStylesheet(resource, precedence, ownerDocument);
      }
      resource = {
        type: "stylesheet",
        instance: resource,
        count: 1,
        state
      };
      styles.set(key, resource);
    }
  }
}
function preinitScript(src, options) {
  previousDispatcher.X(src, options);
  var ownerDocument = globalDocument;
  if (ownerDocument && src) {
    var scripts = getResourcesFromRoot(ownerDocument).hoistableScripts, key = getScriptKey(src), resource = scripts.get(key);
    resource || (resource = ownerDocument.querySelector(getScriptSelectorFromKey(key)), resource || (src = assign({ src, async: true }, options), (options = preloadPropsMap.get(key)) && adoptPreloadPropsForScript(src, options), resource = ownerDocument.createElement("script"), markNodeAsHoistable(resource), setInitialProperties(resource, "link", src), ownerDocument.head.appendChild(resource)), resource = {
      type: "script",
      instance: resource,
      count: 1,
      state: null
    }, scripts.set(key, resource));
  }
}
function preinitModuleScript(src, options) {
  previousDispatcher.M(src, options);
  var ownerDocument = globalDocument;
  if (ownerDocument && src) {
    var scripts = getResourcesFromRoot(ownerDocument).hoistableScripts, key = getScriptKey(src), resource = scripts.get(key);
    resource || (resource = ownerDocument.querySelector(getScriptSelectorFromKey(key)), resource || (src = assign({ src, async: true, type: "module" }, options), (options = preloadPropsMap.get(key)) && adoptPreloadPropsForScript(src, options), resource = ownerDocument.createElement("script"), markNodeAsHoistable(resource), setInitialProperties(resource, "link", src), ownerDocument.head.appendChild(resource)), resource = {
      type: "script",
      instance: resource,
      count: 1,
      state: null
    }, scripts.set(key, resource));
  }
}
function getResource(type, currentProps, pendingProps, currentResource) {
  var JSCompiler_inline_result = (JSCompiler_inline_result = rootInstanceStackCursor.current) ? getHoistableRoot(JSCompiler_inline_result) : null;
  if (!JSCompiler_inline_result) throw Error(formatProdErrorMessage(446));
  switch (type) {
    case "meta":
    case "title":
      return null;
    case "style":
      return "string" === typeof pendingProps.precedence && "string" === typeof pendingProps.href ? (currentProps = getStyleKey(pendingProps.href), pendingProps = getResourcesFromRoot(
        JSCompiler_inline_result
      ).hoistableStyles, currentResource = pendingProps.get(currentProps), currentResource || (currentResource = {
        type: "style",
        instance: null,
        count: 0,
        state: null
      }, pendingProps.set(currentProps, currentResource)), currentResource) : { type: "void", instance: null, count: 0, state: null };
    case "link":
      if ("stylesheet" === pendingProps.rel && "string" === typeof pendingProps.href && "string" === typeof pendingProps.precedence) {
        type = getStyleKey(pendingProps.href);
        var styles$243 = getResourcesFromRoot(
          JSCompiler_inline_result
        ).hoistableStyles, resource$244 = styles$243.get(type);
        resource$244 || (JSCompiler_inline_result = JSCompiler_inline_result.ownerDocument || JSCompiler_inline_result, resource$244 = {
          type: "stylesheet",
          instance: null,
          count: 0,
          state: { loading: 0, preload: null }
        }, styles$243.set(type, resource$244), (styles$243 = JSCompiler_inline_result.querySelector(
          getStylesheetSelectorFromKey(type)
        )) && !styles$243._p && (resource$244.instance = styles$243, resource$244.state.loading = 5), preloadPropsMap.has(type) || (pendingProps = {
          rel: "preload",
          as: "style",
          href: pendingProps.href,
          crossOrigin: pendingProps.crossOrigin,
          integrity: pendingProps.integrity,
          media: pendingProps.media,
          hrefLang: pendingProps.hrefLang,
          referrerPolicy: pendingProps.referrerPolicy
        }, preloadPropsMap.set(type, pendingProps), styles$243 || preloadStylesheet(
          JSCompiler_inline_result,
          type,
          pendingProps,
          resource$244.state
        )));
        if (currentProps && null === currentResource)
          throw Error(formatProdErrorMessage(528, ""));
        return resource$244;
      }
      if (currentProps && null !== currentResource)
        throw Error(formatProdErrorMessage(529, ""));
      return null;
    case "script":
      return currentProps = pendingProps.async, pendingProps = pendingProps.src, "string" === typeof pendingProps && currentProps && "function" !== typeof currentProps && "symbol" !== typeof currentProps ? (currentProps = getScriptKey(pendingProps), pendingProps = getResourcesFromRoot(
        JSCompiler_inline_result
      ).hoistableScripts, currentResource = pendingProps.get(currentProps), currentResource || (currentResource = {
        type: "script",
        instance: null,
        count: 0,
        state: null
      }, pendingProps.set(currentProps, currentResource)), currentResource) : { type: "void", instance: null, count: 0, state: null };
    default:
      throw Error(formatProdErrorMessage(444, type));
  }
}
function getStyleKey(href) {
  return 'href="' + escapeSelectorAttributeValueInsideDoubleQuotes(href) + '"';
}
function getStylesheetSelectorFromKey(key) {
  return 'link[rel="stylesheet"][' + key + "]";
}
function stylesheetPropsFromRawProps(rawProps) {
  return assign({}, rawProps, {
    "data-precedence": rawProps.precedence,
    precedence: null
  });
}
function preloadStylesheet(ownerDocument, key, preloadProps, state) {
  ownerDocument.querySelector('link[rel="preload"][as="style"][' + key + "]") ? state.loading = 1 : (key = ownerDocument.createElement("link"), state.preload = key, key.addEventListener("load", function() {
    return state.loading |= 1;
  }), key.addEventListener("error", function() {
    return state.loading |= 2;
  }), setInitialProperties(key, "link", preloadProps), markNodeAsHoistable(key), ownerDocument.head.appendChild(key));
}
function getScriptKey(src) {
  return '[src="' + escapeSelectorAttributeValueInsideDoubleQuotes(src) + '"]';
}
function getScriptSelectorFromKey(key) {
  return "script[async]" + key;
}
function acquireResource(hoistableRoot, resource, props) {
  resource.count++;
  if (null === resource.instance)
    switch (resource.type) {
      case "style":
        var instance = hoistableRoot.querySelector(
          'style[data-href~="' + escapeSelectorAttributeValueInsideDoubleQuotes(props.href) + '"]'
        );
        if (instance)
          return resource.instance = instance, markNodeAsHoistable(instance), instance;
        var styleProps = assign({}, props, {
          "data-href": props.href,
          "data-precedence": props.precedence,
          href: null,
          precedence: null
        });
        instance = (hoistableRoot.ownerDocument || hoistableRoot).createElement(
          "style"
        );
        markNodeAsHoistable(instance);
        setInitialProperties(instance, "style", styleProps);
        insertStylesheet(instance, props.precedence, hoistableRoot);
        return resource.instance = instance;
      case "stylesheet":
        styleProps = getStyleKey(props.href);
        var instance$249 = hoistableRoot.querySelector(
          getStylesheetSelectorFromKey(styleProps)
        );
        if (instance$249)
          return resource.state.loading |= 4, resource.instance = instance$249, markNodeAsHoistable(instance$249), instance$249;
        instance = stylesheetPropsFromRawProps(props);
        (styleProps = preloadPropsMap.get(styleProps)) && adoptPreloadPropsForStylesheet(instance, styleProps);
        instance$249 = (hoistableRoot.ownerDocument || hoistableRoot).createElement("link");
        markNodeAsHoistable(instance$249);
        var linkInstance = instance$249;
        linkInstance._p = new Promise(function(resolve, reject) {
          linkInstance.onload = resolve;
          linkInstance.onerror = reject;
        });
        setInitialProperties(instance$249, "link", instance);
        resource.state.loading |= 4;
        insertStylesheet(instance$249, props.precedence, hoistableRoot);
        return resource.instance = instance$249;
      case "script":
        instance$249 = getScriptKey(props.src);
        if (styleProps = hoistableRoot.querySelector(
          getScriptSelectorFromKey(instance$249)
        ))
          return resource.instance = styleProps, markNodeAsHoistable(styleProps), styleProps;
        instance = props;
        if (styleProps = preloadPropsMap.get(instance$249))
          instance = assign({}, props), adoptPreloadPropsForScript(instance, styleProps);
        hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
        styleProps = hoistableRoot.createElement("script");
        markNodeAsHoistable(styleProps);
        setInitialProperties(styleProps, "link", instance);
        hoistableRoot.head.appendChild(styleProps);
        return resource.instance = styleProps;
      case "void":
        return null;
      default:
        throw Error(formatProdErrorMessage(443, resource.type));
    }
  else
    "stylesheet" === resource.type && 0 === (resource.state.loading & 4) && (instance = resource.instance, resource.state.loading |= 4, insertStylesheet(instance, props.precedence, hoistableRoot));
  return resource.instance;
}
function insertStylesheet(instance, precedence, root2) {
  for (var nodes = root2.querySelectorAll(
    'link[rel="stylesheet"][data-precedence],style[data-precedence]'
  ), last = nodes.length ? nodes[nodes.length - 1] : null, prior = last, i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    if (node.dataset.precedence === precedence) prior = node;
    else if (prior !== last) break;
  }
  prior ? prior.parentNode.insertBefore(instance, prior.nextSibling) : (precedence = 9 === root2.nodeType ? root2.head : root2, precedence.insertBefore(instance, precedence.firstChild));
}
function adoptPreloadPropsForStylesheet(stylesheetProps, preloadProps) {
  null == stylesheetProps.crossOrigin && (stylesheetProps.crossOrigin = preloadProps.crossOrigin);
  null == stylesheetProps.referrerPolicy && (stylesheetProps.referrerPolicy = preloadProps.referrerPolicy);
  null == stylesheetProps.title && (stylesheetProps.title = preloadProps.title);
}
function adoptPreloadPropsForScript(scriptProps, preloadProps) {
  null == scriptProps.crossOrigin && (scriptProps.crossOrigin = preloadProps.crossOrigin);
  null == scriptProps.referrerPolicy && (scriptProps.referrerPolicy = preloadProps.referrerPolicy);
  null == scriptProps.integrity && (scriptProps.integrity = preloadProps.integrity);
}
var tagCaches = null;
function getHydratableHoistableCache(type, keyAttribute, ownerDocument) {
  if (null === tagCaches) {
    var cache = /* @__PURE__ */ new Map();
    var caches = tagCaches = /* @__PURE__ */ new Map();
    caches.set(ownerDocument, cache);
  } else
    caches = tagCaches, cache = caches.get(ownerDocument), cache || (cache = /* @__PURE__ */ new Map(), caches.set(ownerDocument, cache));
  if (cache.has(type)) return cache;
  cache.set(type, null);
  ownerDocument = ownerDocument.getElementsByTagName(type);
  for (caches = 0; caches < ownerDocument.length; caches++) {
    var node = ownerDocument[caches];
    if (!(node[internalHoistableMarker] || node[internalInstanceKey] || "link" === type && "stylesheet" === node.getAttribute("rel")) && "http://www.w3.org/2000/svg" !== node.namespaceURI) {
      var nodeKey = node.getAttribute(keyAttribute) || "";
      nodeKey = type + nodeKey;
      var existing = cache.get(nodeKey);
      existing ? existing.push(node) : cache.set(nodeKey, [node]);
    }
  }
  return cache;
}
function mountHoistable(hoistableRoot, type, instance) {
  hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
  hoistableRoot.head.insertBefore(
    instance,
    "title" === type ? hoistableRoot.querySelector("head > title") : null
  );
}
function isHostHoistableType(type, props, hostContext) {
  if (1 === hostContext || null != props.itemProp) return false;
  switch (type) {
    case "meta":
    case "title":
      return true;
    case "style":
      if ("string" !== typeof props.precedence || "string" !== typeof props.href || "" === props.href)
        break;
      return true;
    case "link":
      if ("string" !== typeof props.rel || "string" !== typeof props.href || "" === props.href || props.onLoad || props.onError)
        break;
      switch (props.rel) {
        case "stylesheet":
          return type = props.disabled, "string" === typeof props.precedence && null == type;
        default:
          return true;
      }
    case "script":
      if (props.async && "function" !== typeof props.async && "symbol" !== typeof props.async && !props.onLoad && !props.onError && props.src && "string" === typeof props.src)
        return true;
  }
  return false;
}
function preloadResource(resource) {
  return "stylesheet" === resource.type && 0 === (resource.state.loading & 3) ? false : true;
}
function suspendResource(state, hoistableRoot, resource, props) {
  if ("stylesheet" === resource.type && ("string" !== typeof props.media || false !== matchMedia(props.media).matches) && 0 === (resource.state.loading & 4)) {
    if (null === resource.instance) {
      var key = getStyleKey(props.href), instance = hoistableRoot.querySelector(
        getStylesheetSelectorFromKey(key)
      );
      if (instance) {
        hoistableRoot = instance._p;
        null !== hoistableRoot && "object" === typeof hoistableRoot && "function" === typeof hoistableRoot.then && (state.count++, state = onUnsuspend.bind(state), hoistableRoot.then(state, state));
        resource.state.loading |= 4;
        resource.instance = instance;
        markNodeAsHoistable(instance);
        return;
      }
      instance = hoistableRoot.ownerDocument || hoistableRoot;
      props = stylesheetPropsFromRawProps(props);
      (key = preloadPropsMap.get(key)) && adoptPreloadPropsForStylesheet(props, key);
      instance = instance.createElement("link");
      markNodeAsHoistable(instance);
      var linkInstance = instance;
      linkInstance._p = new Promise(function(resolve, reject) {
        linkInstance.onload = resolve;
        linkInstance.onerror = reject;
      });
      setInitialProperties(instance, "link", props);
      resource.instance = instance;
    }
    null === state.stylesheets && (state.stylesheets = /* @__PURE__ */ new Map());
    state.stylesheets.set(resource, hoistableRoot);
    (hoistableRoot = resource.state.preload) && 0 === (resource.state.loading & 3) && (state.count++, resource = onUnsuspend.bind(state), hoistableRoot.addEventListener("load", resource), hoistableRoot.addEventListener("error", resource));
  }
}
var estimatedBytesWithinLimit = 0;
function waitForCommitToBeReady(state, timeoutOffset) {
  state.stylesheets && 0 === state.count && insertSuspendedStylesheets(state, state.stylesheets);
  return 0 < state.count || 0 < state.imgCount ? function(commit) {
    var stylesheetTimer = setTimeout(function() {
      state.stylesheets && insertSuspendedStylesheets(state, state.stylesheets);
      if (state.unsuspend) {
        var unsuspend = state.unsuspend;
        state.unsuspend = null;
        unsuspend();
      }
    }, 6e4 + timeoutOffset);
    0 < state.imgBytes && 0 === estimatedBytesWithinLimit && (estimatedBytesWithinLimit = 62500 * estimateBandwidth());
    var imgTimer = setTimeout(
      function() {
        state.waitingForImages = false;
        if (0 === state.count && (state.stylesheets && insertSuspendedStylesheets(state, state.stylesheets), state.unsuspend)) {
          var unsuspend = state.unsuspend;
          state.unsuspend = null;
          unsuspend();
        }
      },
      (state.imgBytes > estimatedBytesWithinLimit ? 50 : 800) + timeoutOffset
    );
    state.unsuspend = commit;
    return function() {
      state.unsuspend = null;
      clearTimeout(stylesheetTimer);
      clearTimeout(imgTimer);
    };
  } : null;
}
function onUnsuspend() {
  this.count--;
  if (0 === this.count && (0 === this.imgCount || !this.waitingForImages)) {
    if (this.stylesheets) insertSuspendedStylesheets(this, this.stylesheets);
    else if (this.unsuspend) {
      var unsuspend = this.unsuspend;
      this.unsuspend = null;
      unsuspend();
    }
  }
}
var precedencesByRoot = null;
function insertSuspendedStylesheets(state, resources) {
  state.stylesheets = null;
  null !== state.unsuspend && (state.count++, precedencesByRoot = /* @__PURE__ */ new Map(), resources.forEach(insertStylesheetIntoRoot, state), precedencesByRoot = null, onUnsuspend.call(state));
}
function insertStylesheetIntoRoot(root2, resource) {
  if (!(resource.state.loading & 4)) {
    var precedences = precedencesByRoot.get(root2);
    if (precedences) var last = precedences.get(null);
    else {
      precedences = /* @__PURE__ */ new Map();
      precedencesByRoot.set(root2, precedences);
      for (var nodes = root2.querySelectorAll(
        "link[data-precedence],style[data-precedence]"
      ), i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if ("LINK" === node.nodeName || "not all" !== node.getAttribute("media"))
          precedences.set(node.dataset.precedence, node), last = node;
      }
      last && precedences.set(null, last);
    }
    nodes = resource.instance;
    node = nodes.getAttribute("data-precedence");
    i = precedences.get(node) || last;
    i === last && precedences.set(null, nodes);
    precedences.set(node, nodes);
    this.count++;
    last = onUnsuspend.bind(this);
    nodes.addEventListener("load", last);
    nodes.addEventListener("error", last);
    i ? i.parentNode.insertBefore(nodes, i.nextSibling) : (root2 = 9 === root2.nodeType ? root2.head : root2, root2.insertBefore(nodes, root2.firstChild));
    resource.state.loading |= 4;
  }
}
var HostTransitionContext = {
  $$typeof: REACT_CONTEXT_TYPE,
  Provider: null,
  Consumer: null,
  _currentValue: sharedNotPendingObject,
  _currentValue2: sharedNotPendingObject,
  _threadCount: 0
};
function FiberRootNode(containerInfo, tag, hydrate, identifierPrefix, onUncaughtError, onCaughtError, onRecoverableError, onDefaultTransitionIndicator, formState) {
  this.tag = 1;
  this.containerInfo = containerInfo;
  this.pingCache = this.current = this.pendingChildren = null;
  this.timeoutHandle = -1;
  this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null;
  this.callbackPriority = 0;
  this.expirationTimes = createLaneMap(-1);
  this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
  this.entanglements = createLaneMap(0);
  this.hiddenUpdates = createLaneMap(null);
  this.identifierPrefix = identifierPrefix;
  this.onUncaughtError = onUncaughtError;
  this.onCaughtError = onCaughtError;
  this.onRecoverableError = onRecoverableError;
  this.pooledCache = null;
  this.pooledCacheLanes = 0;
  this.formState = formState;
  this.incompleteTransitions = /* @__PURE__ */ new Map();
}
function createFiberRoot(containerInfo, tag, hydrate, initialChildren, hydrationCallbacks, isStrictMode, identifierPrefix, formState, onUncaughtError, onCaughtError, onRecoverableError, onDefaultTransitionIndicator) {
  containerInfo = new FiberRootNode(
    containerInfo,
    tag,
    hydrate,
    identifierPrefix,
    onUncaughtError,
    onCaughtError,
    onRecoverableError,
    onDefaultTransitionIndicator,
    formState
  );
  tag = 1;
  true === isStrictMode && (tag |= 24);
  isStrictMode = createFiberImplClass(3, null, null, tag);
  containerInfo.current = isStrictMode;
  isStrictMode.stateNode = containerInfo;
  tag = createCache();
  tag.refCount++;
  containerInfo.pooledCache = tag;
  tag.refCount++;
  isStrictMode.memoizedState = {
    element: initialChildren,
    isDehydrated: hydrate,
    cache: tag
  };
  initializeUpdateQueue(isStrictMode);
  return containerInfo;
}
function getContextForSubtree(parentComponent) {
  if (!parentComponent) return emptyContextObject;
  parentComponent = emptyContextObject;
  return parentComponent;
}
function updateContainerImpl(rootFiber, lane, element, container, parentComponent, callback) {
  parentComponent = getContextForSubtree(parentComponent);
  null === container.context ? container.context = parentComponent : container.pendingContext = parentComponent;
  container = createUpdate(lane);
  container.payload = { element };
  callback = void 0 === callback ? null : callback;
  null !== callback && (container.callback = callback);
  element = enqueueUpdate(rootFiber, container, lane);
  null !== element && (scheduleUpdateOnFiber(element, rootFiber, lane), entangleTransitions(element, rootFiber, lane));
}
function markRetryLaneImpl(fiber, retryLane) {
  fiber = fiber.memoizedState;
  if (null !== fiber && null !== fiber.dehydrated) {
    var a = fiber.retryLane;
    fiber.retryLane = 0 !== a && a < retryLane ? a : retryLane;
  }
}
function markRetryLaneIfNotHydrated(fiber, retryLane) {
  markRetryLaneImpl(fiber, retryLane);
  (fiber = fiber.alternate) && markRetryLaneImpl(fiber, retryLane);
}
function attemptContinuousHydration(fiber) {
  if (13 === fiber.tag || 31 === fiber.tag) {
    var root2 = enqueueConcurrentRenderForLane(fiber, 67108864);
    null !== root2 && scheduleUpdateOnFiber(root2, fiber, 67108864);
    markRetryLaneIfNotHydrated(fiber, 67108864);
  }
}
function attemptHydrationAtCurrentPriority(fiber) {
  if (13 === fiber.tag || 31 === fiber.tag) {
    var lane = requestUpdateLane();
    lane = getBumpedLaneForHydrationByLane(lane);
    var root2 = enqueueConcurrentRenderForLane(fiber, lane);
    null !== root2 && scheduleUpdateOnFiber(root2, fiber, lane);
    markRetryLaneIfNotHydrated(fiber, lane);
  }
}
var _enabled = true;
function dispatchDiscreteEvent(domEventName, eventSystemFlags, container, nativeEvent) {
  var prevTransition = ReactSharedInternals.T;
  ReactSharedInternals.T = null;
  var previousPriority = ReactDOMSharedInternals.p;
  try {
    ReactDOMSharedInternals.p = 2, dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
  } finally {
    ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = prevTransition;
  }
}
function dispatchContinuousEvent(domEventName, eventSystemFlags, container, nativeEvent) {
  var prevTransition = ReactSharedInternals.T;
  ReactSharedInternals.T = null;
  var previousPriority = ReactDOMSharedInternals.p;
  try {
    ReactDOMSharedInternals.p = 8, dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
  } finally {
    ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = prevTransition;
  }
}
function dispatchEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent) {
  if (_enabled) {
    var blockedOn = findInstanceBlockingEvent(nativeEvent);
    if (null === blockedOn)
      dispatchEventForPluginEventSystem(
        domEventName,
        eventSystemFlags,
        nativeEvent,
        return_targetInst,
        targetContainer
      ), clearIfContinuousEvent(domEventName, nativeEvent);
    else if (queueIfContinuousEvent(
      blockedOn,
      domEventName,
      eventSystemFlags,
      targetContainer,
      nativeEvent
    ))
      nativeEvent.stopPropagation();
    else if (clearIfContinuousEvent(domEventName, nativeEvent), eventSystemFlags & 4 && -1 < discreteReplayableEvents.indexOf(domEventName)) {
      for (; null !== blockedOn; ) {
        var fiber = getInstanceFromNode(blockedOn);
        if (null !== fiber)
          switch (fiber.tag) {
            case 3:
              fiber = fiber.stateNode;
              if (fiber.current.memoizedState.isDehydrated) {
                var lanes = getHighestPriorityLanes(fiber.pendingLanes);
                if (0 !== lanes) {
                  var root2 = fiber;
                  root2.pendingLanes |= 2;
                  for (root2.entangledLanes |= 2; lanes; ) {
                    var lane = 1 << 31 - clz32(lanes);
                    root2.entanglements[1] |= lane;
                    lanes &= ~lane;
                  }
                  ensureRootIsScheduled(fiber);
                  0 === (executionContext & 6) && (workInProgressRootRenderTargetTime = now() + 500, flushSyncWorkAcrossRoots_impl(0));
                }
              }
              break;
            case 31:
            case 13:
              root2 = enqueueConcurrentRenderForLane(fiber, 2), null !== root2 && scheduleUpdateOnFiber(root2, fiber, 2), flushSyncWork$1(), markRetryLaneIfNotHydrated(fiber, 2);
          }
        fiber = findInstanceBlockingEvent(nativeEvent);
        null === fiber && dispatchEventForPluginEventSystem(
          domEventName,
          eventSystemFlags,
          nativeEvent,
          return_targetInst,
          targetContainer
        );
        if (fiber === blockedOn) break;
        blockedOn = fiber;
      }
      null !== blockedOn && nativeEvent.stopPropagation();
    } else
      dispatchEventForPluginEventSystem(
        domEventName,
        eventSystemFlags,
        nativeEvent,
        null,
        targetContainer
      );
  }
}
function findInstanceBlockingEvent(nativeEvent) {
  nativeEvent = getEventTarget(nativeEvent);
  return findInstanceBlockingTarget(nativeEvent);
}
var return_targetInst = null;
function findInstanceBlockingTarget(targetNode) {
  return_targetInst = null;
  targetNode = getClosestInstanceFromNode(targetNode);
  if (null !== targetNode) {
    var nearestMounted = getNearestMountedFiber(targetNode);
    if (null === nearestMounted) targetNode = null;
    else {
      var tag = nearestMounted.tag;
      if (13 === tag) {
        targetNode = getSuspenseInstanceFromFiber(nearestMounted);
        if (null !== targetNode) return targetNode;
        targetNode = null;
      } else if (31 === tag) {
        targetNode = getActivityInstanceFromFiber(nearestMounted);
        if (null !== targetNode) return targetNode;
        targetNode = null;
      } else if (3 === tag) {
        if (nearestMounted.stateNode.current.memoizedState.isDehydrated)
          return 3 === nearestMounted.tag ? nearestMounted.stateNode.containerInfo : null;
        targetNode = null;
      } else nearestMounted !== targetNode && (targetNode = null);
    }
  }
  return_targetInst = targetNode;
  return null;
}
function getEventPriority(domEventName) {
  switch (domEventName) {
    case "beforetoggle":
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "toggle":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 2;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 8;
    case "message":
      switch (getCurrentPriorityLevel()) {
        case ImmediatePriority:
          return 2;
        case UserBlockingPriority:
          return 8;
        case NormalPriority$1:
        case LowPriority:
          return 32;
        case IdlePriority:
          return 268435456;
        default:
          return 32;
      }
    default:
      return 32;
  }
}
var hasScheduledReplayAttempt = false, queuedFocus = null, queuedDrag = null, queuedMouse = null, queuedPointers = /* @__PURE__ */ new Map(), queuedPointerCaptures = /* @__PURE__ */ new Map(), queuedExplicitHydrationTargets = [], discreteReplayableEvents = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
  " "
);
function clearIfContinuousEvent(domEventName, nativeEvent) {
  switch (domEventName) {
    case "focusin":
    case "focusout":
      queuedFocus = null;
      break;
    case "dragenter":
    case "dragleave":
      queuedDrag = null;
      break;
    case "mouseover":
    case "mouseout":
      queuedMouse = null;
      break;
    case "pointerover":
    case "pointerout":
      queuedPointers.delete(nativeEvent.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      queuedPointerCaptures.delete(nativeEvent.pointerId);
  }
}
function accumulateOrCreateContinuousQueuedReplayableEvent(existingQueuedEvent, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
  if (null === existingQueuedEvent || existingQueuedEvent.nativeEvent !== nativeEvent)
    return existingQueuedEvent = {
      blockedOn,
      domEventName,
      eventSystemFlags,
      nativeEvent,
      targetContainers: [targetContainer]
    }, null !== blockedOn && (blockedOn = getInstanceFromNode(blockedOn), null !== blockedOn && attemptContinuousHydration(blockedOn)), existingQueuedEvent;
  existingQueuedEvent.eventSystemFlags |= eventSystemFlags;
  blockedOn = existingQueuedEvent.targetContainers;
  null !== targetContainer && -1 === blockedOn.indexOf(targetContainer) && blockedOn.push(targetContainer);
  return existingQueuedEvent;
}
function queueIfContinuousEvent(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
  switch (domEventName) {
    case "focusin":
      return queuedFocus = accumulateOrCreateContinuousQueuedReplayableEvent(
        queuedFocus,
        blockedOn,
        domEventName,
        eventSystemFlags,
        targetContainer,
        nativeEvent
      ), true;
    case "dragenter":
      return queuedDrag = accumulateOrCreateContinuousQueuedReplayableEvent(
        queuedDrag,
        blockedOn,
        domEventName,
        eventSystemFlags,
        targetContainer,
        nativeEvent
      ), true;
    case "mouseover":
      return queuedMouse = accumulateOrCreateContinuousQueuedReplayableEvent(
        queuedMouse,
        blockedOn,
        domEventName,
        eventSystemFlags,
        targetContainer,
        nativeEvent
      ), true;
    case "pointerover":
      var pointerId = nativeEvent.pointerId;
      queuedPointers.set(
        pointerId,
        accumulateOrCreateContinuousQueuedReplayableEvent(
          queuedPointers.get(pointerId) || null,
          blockedOn,
          domEventName,
          eventSystemFlags,
          targetContainer,
          nativeEvent
        )
      );
      return true;
    case "gotpointercapture":
      return pointerId = nativeEvent.pointerId, queuedPointerCaptures.set(
        pointerId,
        accumulateOrCreateContinuousQueuedReplayableEvent(
          queuedPointerCaptures.get(pointerId) || null,
          blockedOn,
          domEventName,
          eventSystemFlags,
          targetContainer,
          nativeEvent
        )
      ), true;
  }
  return false;
}
function attemptExplicitHydrationTarget(queuedTarget) {
  var targetInst = getClosestInstanceFromNode(queuedTarget.target);
  if (null !== targetInst) {
    var nearestMounted = getNearestMountedFiber(targetInst);
    if (null !== nearestMounted) {
      if (targetInst = nearestMounted.tag, 13 === targetInst) {
        if (targetInst = getSuspenseInstanceFromFiber(nearestMounted), null !== targetInst) {
          queuedTarget.blockedOn = targetInst;
          runWithPriority(queuedTarget.priority, function() {
            attemptHydrationAtCurrentPriority(nearestMounted);
          });
          return;
        }
      } else if (31 === targetInst) {
        if (targetInst = getActivityInstanceFromFiber(nearestMounted), null !== targetInst) {
          queuedTarget.blockedOn = targetInst;
          runWithPriority(queuedTarget.priority, function() {
            attemptHydrationAtCurrentPriority(nearestMounted);
          });
          return;
        }
      } else if (3 === targetInst && nearestMounted.stateNode.current.memoizedState.isDehydrated) {
        queuedTarget.blockedOn = 3 === nearestMounted.tag ? nearestMounted.stateNode.containerInfo : null;
        return;
      }
    }
  }
  queuedTarget.blockedOn = null;
}
function attemptReplayContinuousQueuedEvent(queuedEvent) {
  if (null !== queuedEvent.blockedOn) return false;
  for (var targetContainers = queuedEvent.targetContainers; 0 < targetContainers.length; ) {
    var nextBlockedOn = findInstanceBlockingEvent(queuedEvent.nativeEvent);
    if (null === nextBlockedOn) {
      nextBlockedOn = queuedEvent.nativeEvent;
      var nativeEventClone = new nextBlockedOn.constructor(
        nextBlockedOn.type,
        nextBlockedOn
      );
      currentReplayingEvent = nativeEventClone;
      nextBlockedOn.target.dispatchEvent(nativeEventClone);
      currentReplayingEvent = null;
    } else
      return targetContainers = getInstanceFromNode(nextBlockedOn), null !== targetContainers && attemptContinuousHydration(targetContainers), queuedEvent.blockedOn = nextBlockedOn, false;
    targetContainers.shift();
  }
  return true;
}
function attemptReplayContinuousQueuedEventInMap(queuedEvent, key, map) {
  attemptReplayContinuousQueuedEvent(queuedEvent) && map.delete(key);
}
function replayUnblockedEvents() {
  hasScheduledReplayAttempt = false;
  null !== queuedFocus && attemptReplayContinuousQueuedEvent(queuedFocus) && (queuedFocus = null);
  null !== queuedDrag && attemptReplayContinuousQueuedEvent(queuedDrag) && (queuedDrag = null);
  null !== queuedMouse && attemptReplayContinuousQueuedEvent(queuedMouse) && (queuedMouse = null);
  queuedPointers.forEach(attemptReplayContinuousQueuedEventInMap);
  queuedPointerCaptures.forEach(attemptReplayContinuousQueuedEventInMap);
}
function scheduleCallbackIfUnblocked(queuedEvent, unblocked) {
  queuedEvent.blockedOn === unblocked && (queuedEvent.blockedOn = null, hasScheduledReplayAttempt || (hasScheduledReplayAttempt = true, Scheduler.unstable_scheduleCallback(
    Scheduler.unstable_NormalPriority,
    replayUnblockedEvents
  )));
}
var lastScheduledReplayQueue = null;
function scheduleReplayQueueIfNeeded(formReplayingQueue) {
  lastScheduledReplayQueue !== formReplayingQueue && (lastScheduledReplayQueue = formReplayingQueue, Scheduler.unstable_scheduleCallback(
    Scheduler.unstable_NormalPriority,
    function() {
      lastScheduledReplayQueue === formReplayingQueue && (lastScheduledReplayQueue = null);
      for (var i = 0; i < formReplayingQueue.length; i += 3) {
        var form = formReplayingQueue[i], submitterOrAction = formReplayingQueue[i + 1], formData = formReplayingQueue[i + 2];
        if ("function" !== typeof submitterOrAction)
          if (null === findInstanceBlockingTarget(submitterOrAction || form))
            continue;
          else break;
        var formInst = getInstanceFromNode(form);
        null !== formInst && (formReplayingQueue.splice(i, 3), i -= 3, startHostTransition(
          formInst,
          {
            pending: true,
            data: formData,
            method: form.method,
            action: submitterOrAction
          },
          submitterOrAction,
          formData
        ));
      }
    }
  ));
}
function retryIfBlockedOn(unblocked) {
  function unblock(queuedEvent) {
    return scheduleCallbackIfUnblocked(queuedEvent, unblocked);
  }
  null !== queuedFocus && scheduleCallbackIfUnblocked(queuedFocus, unblocked);
  null !== queuedDrag && scheduleCallbackIfUnblocked(queuedDrag, unblocked);
  null !== queuedMouse && scheduleCallbackIfUnblocked(queuedMouse, unblocked);
  queuedPointers.forEach(unblock);
  queuedPointerCaptures.forEach(unblock);
  for (var i = 0; i < queuedExplicitHydrationTargets.length; i++) {
    var queuedTarget = queuedExplicitHydrationTargets[i];
    queuedTarget.blockedOn === unblocked && (queuedTarget.blockedOn = null);
  }
  for (; 0 < queuedExplicitHydrationTargets.length && (i = queuedExplicitHydrationTargets[0], null === i.blockedOn); )
    attemptExplicitHydrationTarget(i), null === i.blockedOn && queuedExplicitHydrationTargets.shift();
  i = (unblocked.ownerDocument || unblocked).$$reactFormReplay;
  if (null != i)
    for (queuedTarget = 0; queuedTarget < i.length; queuedTarget += 3) {
      var form = i[queuedTarget], submitterOrAction = i[queuedTarget + 1], formProps = form[internalPropsKey] || null;
      if ("function" === typeof submitterOrAction)
        formProps || scheduleReplayQueueIfNeeded(i);
      else if (formProps) {
        var action = null;
        if (submitterOrAction && submitterOrAction.hasAttribute("formAction"))
          if (form = submitterOrAction, formProps = submitterOrAction[internalPropsKey] || null)
            action = formProps.formAction;
          else {
            if (null !== findInstanceBlockingTarget(form)) continue;
          }
        else action = formProps.action;
        "function" === typeof action ? i[queuedTarget + 1] = action : (i.splice(queuedTarget, 3), queuedTarget -= 3);
        scheduleReplayQueueIfNeeded(i);
      }
    }
}
function defaultOnDefaultTransitionIndicator() {
  function handleNavigate(event) {
    event.canIntercept && "react-transition" === event.info && event.intercept({
      handler: function() {
        return new Promise(function(resolve) {
          return pendingResolve = resolve;
        });
      },
      focusReset: "manual",
      scroll: "manual"
    });
  }
  function handleNavigateComplete() {
    null !== pendingResolve && (pendingResolve(), pendingResolve = null);
    isCancelled || setTimeout(startFakeNavigation, 20);
  }
  function startFakeNavigation() {
    if (!isCancelled && !navigation.transition) {
      var currentEntry = navigation.currentEntry;
      currentEntry && null != currentEntry.url && navigation.navigate(currentEntry.url, {
        state: currentEntry.getState(),
        info: "react-transition",
        history: "replace"
      });
    }
  }
  if ("object" === typeof navigation) {
    var isCancelled = false, pendingResolve = null;
    navigation.addEventListener("navigate", handleNavigate);
    navigation.addEventListener("navigatesuccess", handleNavigateComplete);
    navigation.addEventListener("navigateerror", handleNavigateComplete);
    setTimeout(startFakeNavigation, 100);
    return function() {
      isCancelled = true;
      navigation.removeEventListener("navigate", handleNavigate);
      navigation.removeEventListener("navigatesuccess", handleNavigateComplete);
      navigation.removeEventListener("navigateerror", handleNavigateComplete);
      null !== pendingResolve && (pendingResolve(), pendingResolve = null);
    };
  }
}
function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot;
}
ReactDOMHydrationRoot.prototype.render = ReactDOMRoot.prototype.render = function(children) {
  var root2 = this._internalRoot;
  if (null === root2) throw Error(formatProdErrorMessage(409));
  var current = root2.current, lane = requestUpdateLane();
  updateContainerImpl(current, lane, children, root2, null, null);
};
ReactDOMHydrationRoot.prototype.unmount = ReactDOMRoot.prototype.unmount = function() {
  var root2 = this._internalRoot;
  if (null !== root2) {
    this._internalRoot = null;
    var container = root2.containerInfo;
    updateContainerImpl(root2.current, 2, null, root2, null, null);
    flushSyncWork$1();
    container[internalContainerInstanceKey] = null;
  }
};
function ReactDOMHydrationRoot(internalRoot) {
  this._internalRoot = internalRoot;
}
ReactDOMHydrationRoot.prototype.unstable_scheduleHydration = function(target) {
  if (target) {
    var updatePriority = resolveUpdatePriority();
    target = { blockedOn: null, target, priority: updatePriority };
    for (var i = 0; i < queuedExplicitHydrationTargets.length && 0 !== updatePriority && updatePriority < queuedExplicitHydrationTargets[i].priority; i++) ;
    queuedExplicitHydrationTargets.splice(i, 0, target);
    0 === i && attemptExplicitHydrationTarget(target);
  }
};
var isomorphicReactPackageVersion$jscomp$inline_1840 = React.version;
if ("19.2.4" !== isomorphicReactPackageVersion$jscomp$inline_1840)
  throw Error(
    formatProdErrorMessage(
      527,
      isomorphicReactPackageVersion$jscomp$inline_1840,
      "19.2.4"
    )
  );
ReactDOMSharedInternals.findDOMNode = function(componentOrElement) {
  var fiber = componentOrElement._reactInternals;
  if (void 0 === fiber) {
    if ("function" === typeof componentOrElement.render)
      throw Error(formatProdErrorMessage(188));
    componentOrElement = Object.keys(componentOrElement).join(",");
    throw Error(formatProdErrorMessage(268, componentOrElement));
  }
  componentOrElement = findCurrentFiberUsingSlowPath(fiber);
  componentOrElement = null !== componentOrElement ? findCurrentHostFiberImpl(componentOrElement) : null;
  componentOrElement = null === componentOrElement ? null : componentOrElement.stateNode;
  return componentOrElement;
};
var internals$jscomp$inline_2347 = {
  bundleType: 0,
  version: "19.2.4",
  rendererPackageName: "react-dom",
  currentDispatcherRef: ReactSharedInternals,
  reconcilerVersion: "19.2.4"
};
if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
  var hook$jscomp$inline_2348 = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!hook$jscomp$inline_2348.isDisabled && hook$jscomp$inline_2348.supportsFiber)
    try {
      rendererID = hook$jscomp$inline_2348.inject(
        internals$jscomp$inline_2347
      ), injectedHook = hook$jscomp$inline_2348;
    } catch (err) {
    }
}
reactDomClient_production.createRoot = function(container, options) {
  if (!isValidContainer(container)) throw Error(formatProdErrorMessage(299));
  var isStrictMode = false, identifierPrefix = "", onUncaughtError = defaultOnUncaughtError, onCaughtError = defaultOnCaughtError, onRecoverableError = defaultOnRecoverableError;
  null !== options && void 0 !== options && (true === options.unstable_strictMode && (isStrictMode = true), void 0 !== options.identifierPrefix && (identifierPrefix = options.identifierPrefix), void 0 !== options.onUncaughtError && (onUncaughtError = options.onUncaughtError), void 0 !== options.onCaughtError && (onCaughtError = options.onCaughtError), void 0 !== options.onRecoverableError && (onRecoverableError = options.onRecoverableError));
  options = createFiberRoot(
    container,
    1,
    false,
    null,
    null,
    isStrictMode,
    identifierPrefix,
    null,
    onUncaughtError,
    onCaughtError,
    onRecoverableError,
    defaultOnDefaultTransitionIndicator
  );
  container[internalContainerInstanceKey] = options.current;
  listenToAllSupportedEvents(container);
  return new ReactDOMRoot(options);
};
reactDomClient_production.hydrateRoot = function(container, initialChildren, options) {
  if (!isValidContainer(container)) throw Error(formatProdErrorMessage(299));
  var isStrictMode = false, identifierPrefix = "", onUncaughtError = defaultOnUncaughtError, onCaughtError = defaultOnCaughtError, onRecoverableError = defaultOnRecoverableError, formState = null;
  null !== options && void 0 !== options && (true === options.unstable_strictMode && (isStrictMode = true), void 0 !== options.identifierPrefix && (identifierPrefix = options.identifierPrefix), void 0 !== options.onUncaughtError && (onUncaughtError = options.onUncaughtError), void 0 !== options.onCaughtError && (onCaughtError = options.onCaughtError), void 0 !== options.onRecoverableError && (onRecoverableError = options.onRecoverableError), void 0 !== options.formState && (formState = options.formState));
  initialChildren = createFiberRoot(
    container,
    1,
    true,
    initialChildren,
    null != options ? options : null,
    isStrictMode,
    identifierPrefix,
    formState,
    onUncaughtError,
    onCaughtError,
    onRecoverableError,
    defaultOnDefaultTransitionIndicator
  );
  initialChildren.context = getContextForSubtree(null);
  options = initialChildren.current;
  isStrictMode = requestUpdateLane();
  isStrictMode = getBumpedLaneForHydrationByLane(isStrictMode);
  identifierPrefix = createUpdate(isStrictMode);
  identifierPrefix.callback = null;
  enqueueUpdate(options, identifierPrefix, isStrictMode);
  options = isStrictMode;
  initialChildren.current.lanes = options;
  markRootUpdated$1(initialChildren, options);
  ensureRootIsScheduled(initialChildren);
  container[internalContainerInstanceKey] = initialChildren.current;
  listenToAllSupportedEvents(container);
  return new ReactDOMHydrationRoot(initialChildren);
};
reactDomClient_production.version = "19.2.4";
function checkDCE() {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
    return;
  }
  try {
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    console.error(err);
  }
}
{
  checkDCE();
  client.exports = reactDomClient_production;
}
var clientExports = client.exports;
const ReactDOM = /* @__PURE__ */ getDefaultExportFromCjs(clientExports);
const scriptRel = function detectScriptRel() {
  const relList = typeof document !== "undefined" && document.createElement("link").relList;
  return relList && relList.supports && relList.supports("modulepreload") ? "modulepreload" : "preload";
}();
const assetsURL = function(dep, importerUrl) {
  return new URL(dep, importerUrl).href;
};
const seen = {};
const __vitePreload = function preload2(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (deps && deps.length > 0) {
    const links = document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector(
      "meta[property=csp-nonce]"
    );
    const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
    promise = Promise.allSettled(
      deps.map((dep) => {
        dep = assetsURL(dep, importerUrl);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        const isBaseRelative = !!importerUrl;
        if (isBaseRelative) {
          for (let i = links.length - 1; i >= 0; i--) {
            const link2 = links[i];
            if (link2.href === dep && (!isCss || link2.rel === "stylesheet")) {
              return;
            }
          }
        } else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
          return;
        }
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) {
          link.as = "script";
        }
        link.crossOrigin = "";
        link.href = dep;
        if (cspNonce) {
          link.setAttribute("nonce", cspNonce);
        }
        document.head.appendChild(link);
        if (isCss) {
          return new Promise((res, rej) => {
            link.addEventListener("load", res);
            link.addEventListener(
              "error",
              () => rej(new Error(`Unable to preload CSS for ${dep}`))
            );
          });
        }
      })
    );
  }
  function handlePreloadError(err) {
    const e = new Event("vite:preloadError", {
      cancelable: true
    });
    e.payload = err;
    window.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw err;
    }
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};
function detectPlatform() {
  if (typeof window === "undefined") return "web";
  const cap = window.Capacitor;
  if (cap && (cap.isNativePlatform?.() || cap.isPluginAvailable || cap.platform === "android" || cap.platform === "ios")) {
    return "capacitor";
  }
  if (window.openNow) {
    return "electron";
  }
  return "web";
}
let _platform = null;
function getPlatform() {
  if (_platform) return _platform;
  _platform = detectPlatform();
  return _platform;
}
const PLATFORM = detectPlatform();
const isElectron = () => getPlatform() === "electron";
const isAndroid = () => getPlatform() === "capacitor";
const isWeb = () => getPlatform() === "web";
const detect = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PLATFORM,
  getPlatform,
  isAndroid,
  isElectron,
  isWeb
}, Symbol.toStringTag, { value: "Module" }));
function randomUUID() {
  return globalThis.crypto.randomUUID();
}
const crypto = { randomUUID };
function colorQualityBitDepth(cq) {
  return cq.startsWith("10bit") ? 10 : 0;
}
function colorQualityChromaFormat(cq) {
  return cq.endsWith("444") ? 2 : 0;
}
function colorQualityRequiresHevc(cq) {
  return cq !== "8bit_420";
}
var GfnErrorCode = /* @__PURE__ */ ((GfnErrorCode2) => {
  GfnErrorCode2[GfnErrorCode2["Success"] = 15859712] = "Success";
  GfnErrorCode2[GfnErrorCode2["InvalidOperation"] = 3237085186] = "InvalidOperation";
  GfnErrorCode2[GfnErrorCode2["NetworkError"] = 3237089282] = "NetworkError";
  GfnErrorCode2[GfnErrorCode2["GetActiveSessionServerError"] = 3237089283] = "GetActiveSessionServerError";
  GfnErrorCode2[GfnErrorCode2["AuthTokenNotUpdated"] = 3237093377] = "AuthTokenNotUpdated";
  GfnErrorCode2[GfnErrorCode2["SessionFinishedState"] = 3237093378] = "SessionFinishedState";
  GfnErrorCode2[GfnErrorCode2["ResponseParseFailure"] = 3237093379] = "ResponseParseFailure";
  GfnErrorCode2[GfnErrorCode2["InvalidServerResponse"] = 3237093381] = "InvalidServerResponse";
  GfnErrorCode2[GfnErrorCode2["PutOrPostInProgress"] = 3237093382] = "PutOrPostInProgress";
  GfnErrorCode2[GfnErrorCode2["GridServerNotInitialized"] = 3237093383] = "GridServerNotInitialized";
  GfnErrorCode2[GfnErrorCode2["DOMExceptionInSessionControl"] = 3237093384] = "DOMExceptionInSessionControl";
  GfnErrorCode2[GfnErrorCode2["InvalidAdStateTransition"] = 3237093386] = "InvalidAdStateTransition";
  GfnErrorCode2[GfnErrorCode2["AuthTokenUpdateTimeout"] = 3237093387] = "AuthTokenUpdateTimeout";
  GfnErrorCode2[GfnErrorCode2["SessionServerErrorBegin"] = 3237093632] = "SessionServerErrorBegin";
  GfnErrorCode2[GfnErrorCode2["RequestForbidden"] = 3237093634] = "RequestForbidden";
  GfnErrorCode2[GfnErrorCode2["ServerInternalTimeout"] = 3237093635] = "ServerInternalTimeout";
  GfnErrorCode2[GfnErrorCode2["ServerInternalError"] = 3237093636] = "ServerInternalError";
  GfnErrorCode2[GfnErrorCode2["ServerInvalidRequest"] = 3237093637] = "ServerInvalidRequest";
  GfnErrorCode2[GfnErrorCode2["ServerInvalidRequestVersion"] = 3237093638] = "ServerInvalidRequestVersion";
  GfnErrorCode2[GfnErrorCode2["SessionListLimitExceeded"] = 3237093639] = "SessionListLimitExceeded";
  GfnErrorCode2[GfnErrorCode2["InvalidRequestDataMalformed"] = 3237093640] = "InvalidRequestDataMalformed";
  GfnErrorCode2[GfnErrorCode2["InvalidRequestDataMissing"] = 3237093641] = "InvalidRequestDataMissing";
  GfnErrorCode2[GfnErrorCode2["RequestLimitExceeded"] = 3237093642] = "RequestLimitExceeded";
  GfnErrorCode2[GfnErrorCode2["SessionLimitExceeded"] = 3237093643] = "SessionLimitExceeded";
  GfnErrorCode2[GfnErrorCode2["InvalidRequestVersionOutOfDate"] = 3237093644] = "InvalidRequestVersionOutOfDate";
  GfnErrorCode2[GfnErrorCode2["SessionEntitledTimeExceeded"] = 3237093645] = "SessionEntitledTimeExceeded";
  GfnErrorCode2[GfnErrorCode2["AuthFailure"] = 3237093646] = "AuthFailure";
  GfnErrorCode2[GfnErrorCode2["InvalidAuthenticationMalformed"] = 3237093647] = "InvalidAuthenticationMalformed";
  GfnErrorCode2[GfnErrorCode2["InvalidAuthenticationExpired"] = 3237093648] = "InvalidAuthenticationExpired";
  GfnErrorCode2[GfnErrorCode2["InvalidAuthenticationNotFound"] = 3237093649] = "InvalidAuthenticationNotFound";
  GfnErrorCode2[GfnErrorCode2["EntitlementFailure"] = 3237093650] = "EntitlementFailure";
  GfnErrorCode2[GfnErrorCode2["InvalidAppIdNotAvailable"] = 3237093651] = "InvalidAppIdNotAvailable";
  GfnErrorCode2[GfnErrorCode2["InvalidAppIdNotFound"] = 3237093652] = "InvalidAppIdNotFound";
  GfnErrorCode2[GfnErrorCode2["InvalidSessionIdMalformed"] = 3237093653] = "InvalidSessionIdMalformed";
  GfnErrorCode2[GfnErrorCode2["InvalidSessionIdNotFound"] = 3237093654] = "InvalidSessionIdNotFound";
  GfnErrorCode2[GfnErrorCode2["EulaUnAccepted"] = 3237093655] = "EulaUnAccepted";
  GfnErrorCode2[GfnErrorCode2["MaintenanceStatus"] = 3237093656] = "MaintenanceStatus";
  GfnErrorCode2[GfnErrorCode2["ServiceUnAvailable"] = 3237093657] = "ServiceUnAvailable";
  GfnErrorCode2[GfnErrorCode2["SteamGuardRequired"] = 3237093658] = "SteamGuardRequired";
  GfnErrorCode2[GfnErrorCode2["SteamLoginRequired"] = 3237093659] = "SteamLoginRequired";
  GfnErrorCode2[GfnErrorCode2["SteamGuardInvalid"] = 3237093660] = "SteamGuardInvalid";
  GfnErrorCode2[GfnErrorCode2["SteamProfilePrivate"] = 3237093661] = "SteamProfilePrivate";
  GfnErrorCode2[GfnErrorCode2["InvalidCountryCode"] = 3237093662] = "InvalidCountryCode";
  GfnErrorCode2[GfnErrorCode2["InvalidLanguageCode"] = 3237093663] = "InvalidLanguageCode";
  GfnErrorCode2[GfnErrorCode2["MissingCountryCode"] = 3237093664] = "MissingCountryCode";
  GfnErrorCode2[GfnErrorCode2["MissingLanguageCode"] = 3237093665] = "MissingLanguageCode";
  GfnErrorCode2[GfnErrorCode2["SessionNotPaused"] = 3237093666] = "SessionNotPaused";
  GfnErrorCode2[GfnErrorCode2["EmailNotVerified"] = 3237093667] = "EmailNotVerified";
  GfnErrorCode2[GfnErrorCode2["InvalidAuthenticationUnsupportedProtocol"] = 3237093668] = "InvalidAuthenticationUnsupportedProtocol";
  GfnErrorCode2[GfnErrorCode2["InvalidAuthenticationUnknownToken"] = 3237093669] = "InvalidAuthenticationUnknownToken";
  GfnErrorCode2[GfnErrorCode2["InvalidAuthenticationCredentials"] = 3237093670] = "InvalidAuthenticationCredentials";
  GfnErrorCode2[GfnErrorCode2["SessionNotPlaying"] = 3237093671] = "SessionNotPlaying";
  GfnErrorCode2[GfnErrorCode2["InvalidServiceResponse"] = 3237093672] = "InvalidServiceResponse";
  GfnErrorCode2[GfnErrorCode2["AppPatching"] = 3237093673] = "AppPatching";
  GfnErrorCode2[GfnErrorCode2["GameNotFound"] = 3237093674] = "GameNotFound";
  GfnErrorCode2[GfnErrorCode2["NotEnoughCredits"] = 3237093675] = "NotEnoughCredits";
  GfnErrorCode2[GfnErrorCode2["InvitationOnlyRegistration"] = 3237093676] = "InvitationOnlyRegistration";
  GfnErrorCode2[GfnErrorCode2["RegionNotSupportedForRegistration"] = 3237093677] = "RegionNotSupportedForRegistration";
  GfnErrorCode2[GfnErrorCode2["SessionTerminatedByAnotherClient"] = 3237093678] = "SessionTerminatedByAnotherClient";
  GfnErrorCode2[GfnErrorCode2["DeviceIdAlreadyUsed"] = 3237093679] = "DeviceIdAlreadyUsed";
  GfnErrorCode2[GfnErrorCode2["ServiceNotExist"] = 3237093680] = "ServiceNotExist";
  GfnErrorCode2[GfnErrorCode2["SessionExpired"] = 3237093681] = "SessionExpired";
  GfnErrorCode2[GfnErrorCode2["SessionLimitPerDeviceReached"] = 3237093682] = "SessionLimitPerDeviceReached";
  GfnErrorCode2[GfnErrorCode2["ForwardingZoneOutOfCapacity"] = 3237093683] = "ForwardingZoneOutOfCapacity";
  GfnErrorCode2[GfnErrorCode2["RegionNotSupportedIndefinitely"] = 3237093684] = "RegionNotSupportedIndefinitely";
  GfnErrorCode2[GfnErrorCode2["RegionBanned"] = 3237093685] = "RegionBanned";
  GfnErrorCode2[GfnErrorCode2["RegionOnHoldForFree"] = 3237093686] = "RegionOnHoldForFree";
  GfnErrorCode2[GfnErrorCode2["RegionOnHoldForPaid"] = 3237093687] = "RegionOnHoldForPaid";
  GfnErrorCode2[GfnErrorCode2["AppMaintenanceStatus"] = 3237093688] = "AppMaintenanceStatus";
  GfnErrorCode2[GfnErrorCode2["ResourcePoolNotConfigured"] = 3237093689] = "ResourcePoolNotConfigured";
  GfnErrorCode2[GfnErrorCode2["InsufficientVmCapacity"] = 3237093690] = "InsufficientVmCapacity";
  GfnErrorCode2[GfnErrorCode2["InsufficientRouteCapacity"] = 3237093691] = "InsufficientRouteCapacity";
  GfnErrorCode2[GfnErrorCode2["InsufficientScratchSpaceCapacity"] = 3237093692] = "InsufficientScratchSpaceCapacity";
  GfnErrorCode2[GfnErrorCode2["RequiredSeatInstanceTypeNotSupported"] = 3237093693] = "RequiredSeatInstanceTypeNotSupported";
  GfnErrorCode2[GfnErrorCode2["ServerSessionQueueLengthExceeded"] = 3237093694] = "ServerSessionQueueLengthExceeded";
  GfnErrorCode2[GfnErrorCode2["RegionNotSupportedForStreaming"] = 3237093695] = "RegionNotSupportedForStreaming";
  GfnErrorCode2[GfnErrorCode2["SessionForwardRequestAllocationTimeExpired"] = 3237093696] = "SessionForwardRequestAllocationTimeExpired";
  GfnErrorCode2[GfnErrorCode2["SessionForwardGameBinariesNotAvailable"] = 3237093697] = "SessionForwardGameBinariesNotAvailable";
  GfnErrorCode2[GfnErrorCode2["GameBinariesNotAvailableInRegion"] = 3237093698] = "GameBinariesNotAvailableInRegion";
  GfnErrorCode2[GfnErrorCode2["UekRetrievalFailed"] = 3237093699] = "UekRetrievalFailed";
  GfnErrorCode2[GfnErrorCode2["EntitlementFailureForResource"] = 3237093700] = "EntitlementFailureForResource";
  GfnErrorCode2[GfnErrorCode2["SessionInQueueAbandoned"] = 3237093701] = "SessionInQueueAbandoned";
  GfnErrorCode2[GfnErrorCode2["MemberTerminated"] = 3237093702] = "MemberTerminated";
  GfnErrorCode2[GfnErrorCode2["SessionRemovedFromQueueMaintenance"] = 3237093703] = "SessionRemovedFromQueueMaintenance";
  GfnErrorCode2[GfnErrorCode2["ZoneMaintenanceStatus"] = 3237093704] = "ZoneMaintenanceStatus";
  GfnErrorCode2[GfnErrorCode2["GuestModeCampaignDisabled"] = 3237093705] = "GuestModeCampaignDisabled";
  GfnErrorCode2[GfnErrorCode2["RegionNotSupportedAnonymousAccess"] = 3237093706] = "RegionNotSupportedAnonymousAccess";
  GfnErrorCode2[GfnErrorCode2["InstanceTypeNotSupportedInSingleRegion"] = 3237093707] = "InstanceTypeNotSupportedInSingleRegion";
  GfnErrorCode2[GfnErrorCode2["InvalidZoneForQueuedSession"] = 3237093710] = "InvalidZoneForQueuedSession";
  GfnErrorCode2[GfnErrorCode2["SessionWaitingAdsTimeExpired"] = 3237093711] = "SessionWaitingAdsTimeExpired";
  GfnErrorCode2[GfnErrorCode2["UserCancelledWatchingAds"] = 3237093712] = "UserCancelledWatchingAds";
  GfnErrorCode2[GfnErrorCode2["StreamingNotAllowedInLimitedMode"] = 3237093713] = "StreamingNotAllowedInLimitedMode";
  GfnErrorCode2[GfnErrorCode2["ForwardRequestJPMFailed"] = 3237093714] = "ForwardRequestJPMFailed";
  GfnErrorCode2[GfnErrorCode2["MaxSessionNumberLimitExceeded"] = 3237093715] = "MaxSessionNumberLimitExceeded";
  GfnErrorCode2[GfnErrorCode2["GuestModePartnerCapacityDisabled"] = 3237093716] = "GuestModePartnerCapacityDisabled";
  GfnErrorCode2[GfnErrorCode2["SessionRejectedNoCapacity"] = 3237093717] = "SessionRejectedNoCapacity";
  GfnErrorCode2[GfnErrorCode2["SessionInsufficientPlayabilityLevel"] = 3237093718] = "SessionInsufficientPlayabilityLevel";
  GfnErrorCode2[GfnErrorCode2["ForwardRequestLOFNFailed"] = 3237093719] = "ForwardRequestLOFNFailed";
  GfnErrorCode2[GfnErrorCode2["InvalidTransportRequest"] = 3237093720] = "InvalidTransportRequest";
  GfnErrorCode2[GfnErrorCode2["UserStorageNotAvailable"] = 3237093721] = "UserStorageNotAvailable";
  GfnErrorCode2[GfnErrorCode2["GfnStorageNotAvailable"] = 3237093722] = "GfnStorageNotAvailable";
  GfnErrorCode2[GfnErrorCode2["SessionServerErrorEnd"] = 3237093887] = "SessionServerErrorEnd";
  GfnErrorCode2[GfnErrorCode2["SessionSetupCancelled"] = 15867905] = "SessionSetupCancelled";
  GfnErrorCode2[GfnErrorCode2["SessionSetupCancelledDuringQueuing"] = 15867906] = "SessionSetupCancelledDuringQueuing";
  GfnErrorCode2[GfnErrorCode2["RequestCancelled"] = 15867907] = "RequestCancelled";
  GfnErrorCode2[GfnErrorCode2["SystemSleepDuringSessionSetup"] = 15867909] = "SystemSleepDuringSessionSetup";
  GfnErrorCode2[GfnErrorCode2["NoInternetDuringSessionSetup"] = 15868417] = "NoInternetDuringSessionSetup";
  GfnErrorCode2[GfnErrorCode2["SocketError"] = 3237101580] = "SocketError";
  GfnErrorCode2[GfnErrorCode2["AddressResolveFailed"] = 3237101581] = "AddressResolveFailed";
  GfnErrorCode2[GfnErrorCode2["ConnectFailed"] = 3237101582] = "ConnectFailed";
  GfnErrorCode2[GfnErrorCode2["SslError"] = 3237101583] = "SslError";
  GfnErrorCode2[GfnErrorCode2["ConnectionTimeout"] = 3237101584] = "ConnectionTimeout";
  GfnErrorCode2[GfnErrorCode2["DataReceiveTimeout"] = 3237101585] = "DataReceiveTimeout";
  GfnErrorCode2[GfnErrorCode2["PeerNoResponse"] = 3237101586] = "PeerNoResponse";
  GfnErrorCode2[GfnErrorCode2["UnexpectedHttpRedirect"] = 3237101587] = "UnexpectedHttpRedirect";
  GfnErrorCode2[GfnErrorCode2["DataSendFailure"] = 3237101588] = "DataSendFailure";
  GfnErrorCode2[GfnErrorCode2["DataReceiveFailure"] = 3237101589] = "DataReceiveFailure";
  GfnErrorCode2[GfnErrorCode2["CertificateRejected"] = 3237101590] = "CertificateRejected";
  GfnErrorCode2[GfnErrorCode2["DataNotAllowed"] = 3237101591] = "DataNotAllowed";
  GfnErrorCode2[GfnErrorCode2["NetworkErrorUnknown"] = 3237101592] = "NetworkErrorUnknown";
  return GfnErrorCode2;
})(GfnErrorCode || {});
const ERROR_MESSAGES = /* @__PURE__ */ new Map([
  // Success
  [15859712, { title: "Success", description: "Session started successfully." }],
  // Client errors
  [
    3237085186,
    {
      title: "Invalid Operation",
      description: "The requested operation is not valid at this time."
    }
  ],
  [
    3237089282,
    {
      title: "Network Error",
      description: "A network error occurred. Please check your internet connection."
    }
  ],
  [
    3237093377,
    {
      title: "Authentication Required",
      description: "Your session has expired. Please log in again."
    }
  ],
  [
    3237093379,
    {
      title: "Server Response Error",
      description: "Failed to parse server response. Please try again."
    }
  ],
  [
    3237093381,
    {
      title: "Invalid Server Response",
      description: "The server returned an invalid response."
    }
  ],
  [
    3237093384,
    {
      title: "Session Error",
      description: "An error occurred during session setup."
    }
  ],
  [
    3237093387,
    {
      title: "Authentication Timeout",
      description: "Authentication token update timed out. Please log in again."
    }
  ],
  // Server errors
  [
    3237093634,
    {
      title: "Access Forbidden",
      description: "Access to this service is forbidden."
    }
  ],
  [
    3237093635,
    {
      title: "Server Timeout",
      description: "The server timed out. Please try again."
    }
  ],
  [
    3237093636,
    {
      title: "Server Error",
      description: "An internal server error occurred. Please try again later."
    }
  ],
  [
    3237093637,
    {
      title: "Invalid Request",
      description: "The request was invalid."
    }
  ],
  [
    3237093639,
    {
      title: "Too Many Sessions",
      description: "You have too many active sessions. Please close some sessions and try again."
    }
  ],
  [
    3237093643,
    {
      title: "Session Limit Exceeded",
      description: "You have reached your session limit. Another session may already be running on your account."
    }
  ],
  [
    3237093645,
    {
      title: "Session Time Exceeded",
      description: "Your session time has been exceeded."
    }
  ],
  [
    3237093646,
    {
      title: "Authentication Failed",
      description: "Authentication failed. Please log in again."
    }
  ],
  [
    3237093648,
    {
      title: "Session Expired",
      description: "Your authentication has expired. Please log in again."
    }
  ],
  [
    3237093650,
    {
      title: "Entitlement Error",
      description: "You don't have access to this game or service."
    }
  ],
  [
    3237093651,
    {
      title: "Game Not Available",
      description: "This game is not currently available."
    }
  ],
  [
    3237093652,
    {
      title: "Game Not Found",
      description: "This game was not found in the library."
    }
  ],
  [
    3237093655,
    {
      title: "EULA Required",
      description: "You must accept the End User License Agreement to continue."
    }
  ],
  [
    3237093656,
    {
      title: "Under Maintenance",
      description: "GeForce NOW is currently under maintenance. Please try again later."
    }
  ],
  [
    3237093657,
    {
      title: "Service Unavailable",
      description: "The service is temporarily unavailable. Please try again later."
    }
  ],
  [
    3237093658,
    {
      title: "Steam Guard Required",
      description: "Steam Guard authentication is required. Please complete Steam Guard verification."
    }
  ],
  [
    3237093659,
    {
      title: "Steam Login Required",
      description: "You need to link your Steam account to play this game."
    }
  ],
  [
    3237093660,
    {
      title: "Steam Guard Invalid",
      description: "Steam Guard code is invalid. Please try again."
    }
  ],
  [
    3237093661,
    {
      title: "Steam Profile Private",
      description: "Your Steam profile is private. Please make it public or friends-only."
    }
  ],
  [
    3237093667,
    {
      title: "Email Not Verified",
      description: "Please verify your email address to continue."
    }
  ],
  [
    3237093673,
    {
      title: "Game Updating",
      description: "This game is currently being updated. Please try again later."
    }
  ],
  [
    3237093674,
    {
      title: "Game Not Found",
      description: "This game was not found."
    }
  ],
  [
    3237093675,
    {
      title: "Insufficient Credits",
      description: "You don't have enough credits for this session."
    }
  ],
  [
    3237093678,
    {
      title: "Session Taken Over",
      description: "Your session was taken over by another device."
    }
  ],
  [
    3237093681,
    {
      title: "Session Expired",
      description: "Your session has expired."
    }
  ],
  [
    3237093682,
    {
      title: "Device Limit Reached",
      description: "You have reached the session limit for this device."
    }
  ],
  [
    3237093683,
    {
      title: "Region At Capacity",
      description: "Your region is currently at capacity. Please try again later."
    }
  ],
  [
    3237093684,
    {
      title: "Region Not Supported",
      description: "GeForce NOW is not available in your region."
    }
  ],
  [
    3237093685,
    {
      title: "Region Banned",
      description: "GeForce NOW is not available in your region."
    }
  ],
  [
    3237093686,
    {
      title: "Free Tier On Hold",
      description: "Free tier is temporarily unavailable in your region."
    }
  ],
  [
    3237093687,
    {
      title: "Paid Tier On Hold",
      description: "Paid tier is temporarily unavailable in your region."
    }
  ],
  [
    3237093688,
    {
      title: "Game Maintenance",
      description: "This game is currently under maintenance."
    }
  ],
  [
    3237093690,
    {
      title: "No Capacity",
      description: "No gaming rigs are available right now. Please try again later or join the queue."
    }
  ],
  [
    3237093694,
    {
      title: "Queue Full",
      description: "The queue is currently full. Please try again later."
    }
  ],
  [
    3237093695,
    {
      title: "Region Not Supported",
      description: "Streaming is not supported in your region."
    }
  ],
  [
    3237093698,
    {
      title: "Game Not Available",
      description: "This game is not available in your region."
    }
  ],
  [
    3237093701,
    {
      title: "Queue Abandoned",
      description: "Your session in queue was abandoned."
    }
  ],
  [
    3237093702,
    {
      title: "Account Terminated",
      description: "Your account has been terminated."
    }
  ],
  [
    3237093703,
    {
      title: "Queue Maintenance",
      description: "The queue was cleared due to maintenance."
    }
  ],
  [
    3237093704,
    {
      title: "Zone Maintenance",
      description: "This server zone is under maintenance."
    }
  ],
  [
    3237093711,
    {
      title: "Ads Timeout",
      description: "Session expired while waiting for ads. Free tier users must watch ads to play. Please start a new session."
    }
  ],
  [
    3237093712,
    {
      title: "Ads Cancelled",
      description: "Session cancelled because ads were skipped. Free tier users must watch ads to play."
    }
  ],
  [
    3237093713,
    {
      title: "Limited Mode",
      description: "Streaming is not allowed in limited mode."
    }
  ],
  [
    3237093715,
    {
      title: "Session Limit",
      description: "Maximum number of sessions reached."
    }
  ],
  [
    3237093717,
    {
      title: "No Capacity",
      description: "No gaming rigs are available. Please try again later."
    }
  ],
  [
    3237093718,
    {
      title: "Playability Level Issue",
      description: "Your account's playability level is insufficient. This may mean another session is already running, or there's a subscription issue."
    }
  ],
  [
    3237093721,
    {
      title: "Storage Unavailable",
      description: "User storage is not available."
    }
  ],
  [
    3237093722,
    {
      title: "Storage Error",
      description: "GFN storage is not available."
    }
  ],
  // Cancellation
  [
    15867905,
    {
      title: "Session Cancelled",
      description: "Session setup was cancelled."
    }
  ],
  [
    15867906,
    {
      title: "Queue Cancelled",
      description: "You left the queue."
    }
  ],
  [
    15867907,
    {
      title: "Request Cancelled",
      description: "The request was cancelled."
    }
  ],
  [
    15867909,
    {
      title: "System Sleep",
      description: "Session setup was interrupted by system sleep."
    }
  ],
  [
    15868417,
    {
      title: "No Internet",
      description: "No internet connection during session setup."
    }
  ],
  // Network errors
  [
    3237101580,
    {
      title: "Socket Error",
      description: "A socket error occurred. Please check your network."
    }
  ],
  [
    3237101581,
    {
      title: "DNS Error",
      description: "Failed to resolve server address. Please check your network."
    }
  ],
  [
    3237101582,
    {
      title: "Connection Failed",
      description: "Failed to connect to the server. Please check your network."
    }
  ],
  [
    3237101583,
    {
      title: "SSL Error",
      description: "A secure connection error occurred."
    }
  ],
  [
    3237101584,
    {
      title: "Connection Timeout",
      description: "Connection timed out. Please check your network."
    }
  ],
  [
    3237101585,
    {
      title: "Receive Timeout",
      description: "Data receive timed out. Please check your network."
    }
  ],
  [
    3237101586,
    {
      title: "No Response",
      description: "Server not responding. Please try again."
    }
  ],
  [
    3237101590,
    {
      title: "Certificate Error",
      description: "Server certificate was rejected."
    }
  ]
]);
class SessionError extends Error {
  /** HTTP status code */
  httpStatus;
  /** CloudMatch status code from requestStatus.statusCode */
  statusCode;
  /** Status description from requestStatus.statusDescription */
  statusDescription;
  /** Unified error code from requestStatus.unifiedErrorCode */
  unifiedErrorCode;
  /** Session error code from session.errorCode */
  sessionErrorCode;
  /** Computed GFN error code */
  gfnErrorCode;
  /** User-friendly title */
  title;
  constructor(info) {
    super(info.description);
    this.name = "SessionError";
    this.httpStatus = info.httpStatus;
    this.statusCode = info.statusCode;
    this.statusDescription = info.statusDescription;
    this.unifiedErrorCode = info.unifiedErrorCode;
    this.sessionErrorCode = info.sessionErrorCode;
    this.gfnErrorCode = info.gfnErrorCode;
    this.title = info.title;
  }
  /** Get error type as a string (e.g., "SessionLimitExceeded") */
  get errorType() {
    const entry = Object.entries(GfnErrorCode).find(([, value]) => value === this.gfnErrorCode);
    if (entry) {
      return entry[0];
    }
    if (this.statusCode > 0) {
      return `StatusCode${this.statusCode}`;
    }
    return "UnknownError";
  }
  /** Get user-friendly error message */
  get errorDescription() {
    return this.message;
  }
  /**
   * Parse error from CloudMatch response JSON
   */
  static fromResponse(httpStatus, responseBody) {
    let json = {};
    try {
      json = JSON.parse(responseBody);
    } catch {
    }
    const statusCode = json.requestStatus?.statusCode ?? 0;
    const statusDescription = json.requestStatus?.statusDescription;
    const unifiedErrorCode = json.requestStatus?.unifiedErrorCode;
    const sessionErrorCode = json.session?.errorCode;
    const gfnErrorCode = SessionError.computeErrorCode(statusCode, unifiedErrorCode);
    const { title, description } = SessionError.getErrorMessage(
      gfnErrorCode,
      statusDescription,
      httpStatus
    );
    return new SessionError({
      httpStatus,
      statusCode,
      statusDescription,
      unifiedErrorCode,
      sessionErrorCode,
      gfnErrorCode,
      title,
      description
    });
  }
  /**
   * Compute GFN error code from CloudMatch response (matching official client logic)
   */
  static computeErrorCode(statusCode, unifiedErrorCode) {
    let errorCode = 3237093632;
    if (statusCode === 1) {
      errorCode = 15859712;
    } else if (statusCode > 0 && statusCode < 255) {
      errorCode = 3237093632 + statusCode;
    }
    if (unifiedErrorCode !== void 0) {
      switch (errorCode) {
        case 3237093632:
        case 3237093636:
        case 3237093381:
          errorCode = unifiedErrorCode;
          break;
      }
    }
    return errorCode;
  }
  /**
   * Get user-friendly error message
   */
  static getErrorMessage(errorCode, statusDescription, httpStatus) {
    const knownError = ERROR_MESSAGES.get(errorCode);
    if (knownError) {
      return knownError;
    }
    if (statusDescription) {
      const descUpper = statusDescription.toUpperCase();
      if (descUpper.includes("INSUFFICIENT_PLAYABILITY")) {
        return {
          title: "Session Already Active",
          description: "Another session is already running on your account. Please close it first or wait for it to timeout."
        };
      }
      if (descUpper.includes("SESSION_LIMIT")) {
        return {
          title: "Session Limit Exceeded",
          description: "You have reached your maximum number of concurrent sessions."
        };
      }
      if (descUpper.includes("MAINTENANCE")) {
        return {
          title: "Under Maintenance",
          description: "The service is currently under maintenance. Please try again later."
        };
      }
      if (descUpper.includes("CAPACITY") || descUpper.includes("QUEUE")) {
        return {
          title: "No Capacity Available",
          description: "All gaming rigs are currently in use. Please try again later."
        };
      }
      if (descUpper.includes("AUTH") || descUpper.includes("TOKEN")) {
        return {
          title: "Authentication Error",
          description: "Please log in again."
        };
      }
      if (descUpper.includes("ENTITLEMENT")) {
        return {
          title: "Access Denied",
          description: "You don't have access to this game or service."
        };
      }
    }
    switch (httpStatus) {
      case 401:
        return {
          title: "Unauthorized",
          description: "Please log in again."
        };
      case 403:
        return {
          title: "Access Denied",
          description: "Access to this resource was denied."
        };
      case 404:
        return {
          title: "Not Found",
          description: "The requested resource was not found."
        };
      case 429:
        return {
          title: "Too Many Requests",
          description: "Please wait a moment and try again."
        };
    }
    if (httpStatus >= 500 && httpStatus < 600) {
      return {
        title: "Server Error",
        description: "A server error occurred. Please try again later."
      };
    }
    return {
      title: "Error",
      description: `An error occurred (HTTP ${httpStatus}).`
    };
  }
  /**
   * Check if this error indicates another session is running
   */
  isSessionConflict() {
    const sessionConflictCodes = [
      3237093643,
      // 3237093643
      3237093682,
      // 3237093682
      3237093715,
      // 3237093715
      3237093718
      /* SessionInsufficientPlayabilityLevel */
      // 3237093718
    ];
    if (sessionConflictCodes.includes(this.gfnErrorCode)) {
      return true;
    }
    if (this.statusDescription?.toUpperCase().includes("INSUFFICIENT_PLAYABILITY")) {
      return true;
    }
    return false;
  }
  /**
   * Check if this is a temporary error that might resolve with retry
   */
  isRetryable() {
    const retryableCodes = [
      3237089282,
      // 3237089282
      3237093635,
      // 3237093635
      3237093636,
      // 3237093636
      3237093683,
      // 3237093683
      3237093690,
      // 3237093690
      3237093717,
      // 3237093717
      3237101584,
      // 3237101584
      3237101585,
      // 3237101585
      3237101586
      /* PeerNoResponse */
      // 3237101586
    ];
    return retryableCodes.includes(this.gfnErrorCode);
  }
  /**
   * Check if user needs to log in again
   */
  needsReauth() {
    const reauthCodes = [
      3237093377,
      // 3237093377
      3237093387,
      // 3237093387
      3237093646,
      // 3237093646
      3237093647,
      // 3237093647
      3237093648,
      // 3237093648
      3237093649,
      // 3237093649
      3237093668,
      // 3237093668
      3237093669,
      // 3237093669
      3237093670
      /* InvalidAuthenticationCredentials */
      // 3237093670
    ];
    if (reauthCodes.includes(this.gfnErrorCode)) {
      return true;
    }
    if (this.httpStatus === 401) {
      return true;
    }
    return false;
  }
  /**
   * Convert to a plain object for serialization
   */
  toJSON() {
    return {
      httpStatus: this.httpStatus,
      statusCode: this.statusCode,
      statusDescription: this.statusDescription,
      unifiedErrorCode: this.unifiedErrorCode,
      sessionErrorCode: this.sessionErrorCode,
      gfnErrorCode: this.gfnErrorCode,
      title: this.title,
      description: this.message
    };
  }
}
const DESKTOP_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 NVIDIACEFClient/HEAD/debb5919f6 GFN-PC/2.0.80.173";
function getDeviceProfile(forAndroid) {
  let os = "WINDOWS";
  if (typeof process !== "undefined") {
    if (process.platform === "darwin") os = "MACOS";
    else if (process.platform === "linux") os = "LINUX";
  }
  return {
    os,
    deviceType: "DESKTOP",
    clientType: "NATIVE",
    userAgent: DESKTOP_USER_AGENT,
    clientPlatformName: "windows"
    // GFN server expects this even on Mac/Linux for desktop sessions
  };
}
function buildDeviceHeaders(token, clientId, deviceId, forAndroid) {
  const profile = getDeviceProfile();
  const GFN_CLIENT_VERSION2 = "2.0.80.173";
  return {
    "User-Agent": profile.userAgent,
    Authorization: `GFNJWT ${token}`,
    "Content-Type": "application/json",
    Origin: "https://play.geforcenow.com",
    Referer: "https://play.geforcenow.com/",
    "nv-browser-type": "CHROME",
    "nv-client-id": clientId,
    "nv-client-streamer": "NVIDIA-CLASSIC",
    "nv-client-type": profile.clientType,
    "nv-client-version": GFN_CLIENT_VERSION2,
    "nv-device-make": "UNKNOWN",
    "nv-device-model": "UNKNOWN",
    "nv-device-os": profile.os,
    "nv-device-type": profile.deviceType,
    "x-device-id": deviceId
  };
}
function normalizeIceServers(response) {
  const raw = response.session.iceServerConfiguration?.iceServers ?? [];
  const servers = raw.map((entry) => {
    const urls = Array.isArray(entry.urls) ? entry.urls : [entry.urls];
    return {
      urls,
      username: entry.username,
      credential: entry.credential
    };
  }).filter((entry) => entry.urls.length > 0);
  if (servers.length > 0) {
    return servers;
  }
  return [
    { urls: ["stun:s1.stun.gamestream.nvidia.com:19308"] },
    { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] }
  ];
}
function streamingServerIp(response) {
  const connections = response.session.connectionInfo ?? [];
  const sigConn = connections.find((conn) => conn.usage === 14);
  if (sigConn) {
    const rawIp = sigConn.ip;
    const directIp = Array.isArray(rawIp) ? rawIp[0] : rawIp;
    if (directIp && directIp.length > 0) {
      return directIp;
    }
    if (sigConn.resourcePath) {
      const host = extractHostFromUrl(sigConn.resourcePath);
      if (host) return host;
    }
  }
  const controlIp = response.session.sessionControlInfo?.ip;
  if (controlIp && controlIp.length > 0) {
    return Array.isArray(controlIp) ? controlIp[0] : controlIp;
  }
  return null;
}
function extractHostFromUrl(url) {
  const prefixes = ["rtsps://", "rtsp://", "wss://", "https://"];
  let afterProto = null;
  for (const prefix2 of prefixes) {
    if (url.startsWith(prefix2)) {
      afterProto = url.slice(prefix2.length);
      break;
    }
  }
  if (!afterProto) return null;
  const host = afterProto.split(":")[0]?.split("/")[0];
  if (!host || host.length === 0 || host.startsWith(".")) return null;
  return host;
}
function isZoneHostname(ip) {
  return ip.includes("cloudmatchbeta.nvidiagrid.net") || ip.includes("cloudmatch.nvidiagrid.net");
}
function resolveSignaling(response) {
  const connections = response.session.connectionInfo ?? [];
  const signalingConnection = connections.find((conn) => conn.usage === 14 && conn.ip) ?? connections.find((conn) => conn.ip);
  const serverIp = streamingServerIp(response);
  if (!serverIp) {
    throw new Error("CloudMatch response did not include a signaling host");
  }
  const resourcePath = signalingConnection?.resourcePath ?? "/nvst/";
  const { signalingUrl, signalingHost } = buildSignalingUrl(resourcePath, serverIp);
  const effectiveHost = signalingHost ?? serverIp;
  const signalingServer = effectiveHost.includes(":") ? effectiveHost : `${effectiveHost}:443`;
  return {
    serverIp,
    signalingServer,
    signalingUrl,
    mediaConnectionInfo: resolveMediaConnectionInfo(connections, serverIp)
  };
}
function resolveMediaConnectionInfo(connections, serverIp) {
  const extractIp = (conn) => {
    const rawIp = conn.ip;
    const directIp = Array.isArray(rawIp) ? rawIp[0] : rawIp;
    if (directIp && directIp.length > 0) return directIp;
    if (conn.resourcePath) {
      const host = extractHostFromUrl(conn.resourcePath);
      if (host) return host;
    }
    return null;
  };
  const extractPort = (conn) => {
    if (conn.port > 0) return conn.port;
    if (conn.resourcePath) {
      try {
        const url = new URL(conn.resourcePath.replace("rtsps://", "https://").replace("rtsp://", "http://"));
        const portStr = url.port;
        if (portStr) return parseInt(portStr, 10);
      } catch {
      }
    }
    return 0;
  };
  const primary = connections.find((c) => c.usage === 2);
  if (primary) {
    const ip = extractIp(primary);
    const port = extractPort(primary);
    console.log(`[CloudMatch] resolveMediaConnectionInfo: usage=2 candidate: ip=${ip}, port=${port}`);
    if (ip && port > 0) return { ip, port };
  }
  const alt = connections.find((c) => c.usage === 17);
  if (alt) {
    const ip = extractIp(alt);
    const port = extractPort(alt);
    console.log(`[CloudMatch] resolveMediaConnectionInfo: usage=17 candidate: ip=${ip}, port=${port}`);
    if (ip && port > 0) return { ip, port };
  }
  const alliance = connections.filter((c) => c.usage === 14).sort((a, b) => b.port - a.port);
  for (const conn of alliance) {
    const ip = extractIp(conn) ?? serverIp;
    const port = extractPort(conn);
    console.log(`[CloudMatch] resolveMediaConnectionInfo: usage=14 candidate: ip=${ip}, port=${port} (serverIp fallback=${serverIp})`);
    if (ip && port > 0) return { ip, port };
  }
  console.log("[CloudMatch] resolveMediaConnectionInfo: NO valid media connection info found");
  return void 0;
}
function buildSignalingUrl(raw, serverIp) {
  if (raw.startsWith("rtsps://") || raw.startsWith("rtsp://")) {
    const withoutScheme = raw.startsWith("rtsps://") ? raw.slice("rtsps://".length) : raw.slice("rtsp://".length);
    const host = withoutScheme.split(":")[0]?.split("/")[0];
    if (host && host.length > 0 && !host.startsWith(".")) {
      return {
        signalingUrl: `wss://${host}/nvst/`,
        signalingHost: host
      };
    }
    return {
      signalingUrl: `wss://${serverIp}:443/nvst/`,
      signalingHost: null
    };
  }
  if (raw.startsWith("wss://")) {
    const withoutScheme = raw.slice("wss://".length);
    const host = withoutScheme.split("/")[0] ?? null;
    return { signalingUrl: raw, signalingHost: host };
  }
  if (raw.startsWith("/")) {
    return {
      signalingUrl: `wss://${serverIp}:443${raw}`,
      signalingHost: null
    };
  }
  return {
    signalingUrl: `wss://${serverIp}:443/nvst/`,
    signalingHost: null
  };
}
function requestHeaders(token) {
  const clientId = crypto.randomUUID();
  const deviceId = crypto.randomUUID();
  return buildDeviceHeaders(token, clientId, deviceId);
}
function parseResolution$1(input) {
  const [rawWidth, rawHeight] = input.split("x");
  const width = Number.parseInt(rawWidth ?? "", 10);
  const height = Number.parseInt(rawHeight ?? "", 10);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return { width: 1920, height: 1080 };
  }
  return { width, height };
}
function timezoneOffsetMs() {
  return -(/* @__PURE__ */ new Date()).getTimezoneOffset() * 60 * 1e3;
}
function buildSessionRequestBody(input) {
  const { width, height } = parseResolution$1(input.settings.resolution);
  const cq = input.settings.colorQuality;
  const hdrEnabled = false;
  const bitDepth = colorQualityBitDepth(cq);
  const chromaFormat = colorQualityChromaFormat(cq);
  const accountLinked = input.accountLinked ?? true;
  return {
    sessionRequestData: {
      appId: input.appId,
      internalTitle: input.internalTitle || null,
      availableSupportedControllers: [],
      networkTestSessionId: null,
      parentSessionId: null,
      clientIdentification: "GFN-PC",
      deviceHashId: crypto.randomUUID(),
      clientVersion: "30.0",
      sdkVersion: "1.0",
      streamerVersion: 1,
      clientPlatformName: "windows",
      clientRequestMonitorSettings: [
        {
          widthInPixels: width,
          heightInPixels: height,
          framesPerSecond: input.settings.fps,
          sdrHdrMode: hdrEnabled ? 1 : 0,
          displayData: {
            desiredContentMaxLuminance: hdrEnabled ? 1e3 : 0,
            desiredContentMinLuminance: 0,
            desiredContentMaxFrameAverageLuminance: hdrEnabled ? 500 : 0
          },
          dpi: 100
        }
      ],
      useOps: true,
      audioMode: 2,
      metaData: [
        { key: "SubSessionId", value: crypto.randomUUID() },
        { key: "wssignaling", value: "1" },
        { key: "GSStreamerType", value: "WebRTC" },
        { key: "networkType", value: "Unknown" },
        { key: "ClientImeSupport", value: "0" },
        {
          key: "clientPhysicalResolution",
          value: JSON.stringify({ horizontalPixels: width, verticalPixels: height })
        },
        { key: "surroundAudioInfo", value: "2" }
      ],
      sdrHdrMode: hdrEnabled ? 1 : 0,
      clientDisplayHdrCapabilities: hdrEnabled ? {
        version: 1,
        hdrEdrSupportedFlagsInUint32: 1,
        staticMetadataDescriptorId: 0
      } : null,
      surroundAudioInfo: 0,
      remoteControllersBitmap: 0,
      clientTimezoneOffset: timezoneOffsetMs(),
      enhancedStreamMode: 1,
      appLaunchMode: 1,
      secureRTSPSupported: false,
      partnerCustomData: "",
      accountLinked,
      enablePersistingInGameSettings: true,
      userAge: 26,
      requestedStreamingFeatures: {
        reflex: input.settings.fps >= 120,
        bitDepth,
        cloudGsync: false,
        enabledL4S: false,
        mouseMovementFlags: 0,
        trueHdr: hdrEnabled,
        supportedHidDevices: 0,
        profile: 0,
        fallbackToLogicalResolution: false,
        hidDevices: null,
        chromaFormat,
        prefilterMode: 0,
        prefilterSharpness: 0,
        prefilterNoiseReduction: 0,
        hudStreamingMode: 0,
        sdrColorSpace: 2,
        hdrColorSpace: hdrEnabled ? 4 : 0
      }
    }
  };
}
function cloudmatchUrl(zone) {
  return `https://${zone}.cloudmatchbeta.nvidiagrid.net`;
}
function resolveStreamingBaseUrl(zone, provided) {
  if (provided && provided.trim()) {
    const trimmed = provided.trim();
    return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
  }
  return cloudmatchUrl(zone);
}
function shouldUseServerIp(baseUrl) {
  return baseUrl.includes("cloudmatchbeta.nvidiagrid.net");
}
function resolvePollStopBase(zone, provided, serverIp) {
  const base = resolveStreamingBaseUrl(zone, provided);
  if (serverIp && shouldUseServerIp(base) && !isZoneHostname(serverIp)) {
    return `https://${serverIp}`;
  }
  return base;
}
function toPositiveInt(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    const normalized = Math.trunc(value);
    return normalized > 0 ? normalized : void 0;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : void 0;
  }
  return void 0;
}
function extractQueuePosition(payload) {
  const direct = toPositiveInt(payload.session.queuePosition);
  if (direct !== void 0) {
    return direct;
  }
  const nestedSessionProgress = payload.session.sessionProgress;
  if (nestedSessionProgress) {
    const nested = toPositiveInt(nestedSessionProgress.queuePosition);
    if (nested !== void 0) {
      return nested;
    }
  }
  const nestedProgressInfo = payload.session.progressInfo;
  if (nestedProgressInfo) {
    const nested = toPositiveInt(nestedProgressInfo.queuePosition);
    if (nested !== void 0) {
      return nested;
    }
  }
  return void 0;
}
function toSessionInfo(zone, streamingBaseUrl, payload) {
  if (payload.requestStatus.statusCode !== 1) {
    const errorJson = JSON.stringify(payload);
    throw SessionError.fromResponse(200, errorJson);
  }
  const signaling = resolveSignaling(payload);
  const queuePosition = extractQueuePosition(payload);
  const connections = payload.session.connectionInfo ?? [];
  console.log(
    `[CloudMatch] toSessionInfo: status=${payload.session.status}, queuePosition=${queuePosition ?? "n/a"}, connectionInfo=${connections.length} entries, serverIp=${signaling.serverIp}, signalingServer=${signaling.signalingServer}, signalingUrl=${signaling.signalingUrl}`
  );
  for (const conn of connections) {
    console.log(
      `[CloudMatch]   conn: usage=${conn.usage} ip=${conn.ip ?? "null"} port=${conn.port} resourcePath=${conn.resourcePath ?? "null"}`
    );
  }
  return {
    sessionId: payload.session.sessionId,
    status: payload.session.status,
    queuePosition,
    zone,
    streamingBaseUrl,
    serverIp: signaling.serverIp,
    signalingServer: signaling.signalingServer,
    signalingUrl: signaling.signalingUrl,
    gpuType: payload.session.gpuType,
    iceServers: normalizeIceServers(payload),
    mediaConnectionInfo: signaling.mediaConnectionInfo
  };
}
async function createSession(input) {
  if (!input.token) {
    throw new Error("Missing token for session creation");
  }
  if (!/^\d+$/.test(input.appId)) {
    throw new Error(`Invalid launch appId '${input.appId}' (must be numeric)`);
  }
  const body = buildSessionRequestBody(input);
  const base = resolveStreamingBaseUrl(input.zone, input.streamingBaseUrl);
  const url = `${base}/v2/session?keyboardLayout=en-US&languageCode=en_US`;
  const response = await fetch(url, {
    method: "POST",
    headers: requestHeaders(input.token),
    body: JSON.stringify(body)
  });
  const text = await response.text();
  if (!response.ok) {
    throw SessionError.fromResponse(response.status, text);
  }
  const payload = JSON.parse(text);
  return toSessionInfo(input.zone, base, payload);
}
async function pollSession(input) {
  if (!input.token) {
    throw new Error("Missing token for session polling");
  }
  const base = resolvePollStopBase(input.zone, input.streamingBaseUrl, input.serverIp);
  const url = `${base}/v2/session/${input.sessionId}`;
  const headers = requestHeaders(input.token);
  const response = await fetch(url, {
    method: "GET",
    headers
  });
  const text = await response.text();
  if (!response.ok) {
    throw SessionError.fromResponse(response.status, text);
  }
  const payload = JSON.parse(text);
  const realServerIp = streamingServerIp(payload);
  const polledViaZone = isZoneHostname(new URL(base).hostname);
  const realIpDiffers = realServerIp && realServerIp.length > 0 && !isZoneHostname(realServerIp) && realServerIp !== input.serverIp;
  if (polledViaZone && realIpDiffers && (payload.session.status === 2 || payload.session.status === 3)) {
    console.log(
      `[CloudMatch] Session ready: re-polling via real server IP ${realServerIp} (was: ${new URL(base).hostname})`
    );
    const directBase = `https://${realServerIp}`;
    const directUrl = `${directBase}/v2/session/${input.sessionId}`;
    try {
      const directResponse = await fetch(directUrl, {
        method: "GET",
        headers
      });
      if (directResponse.ok) {
        const directText = await directResponse.text();
        const directPayload = JSON.parse(directText);
        if (directPayload.requestStatus.statusCode === 1) {
          console.log("[CloudMatch] Direct re-poll succeeded, using direct response for signaling info");
          return toSessionInfo(input.zone, directBase, directPayload);
        }
      }
    } catch (e) {
      console.warn("[CloudMatch] Direct re-poll failed, using zone LB response:", e);
    }
  }
  return toSessionInfo(input.zone, base, payload);
}
async function stopSession(input) {
  if (!input.token) {
    throw new Error("Missing token for session stop");
  }
  const base = resolvePollStopBase(input.zone, input.streamingBaseUrl, input.serverIp);
  const url = `${base}/v2/session/${input.sessionId}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: requestHeaders(input.token)
  });
  if (!response.ok) {
    const text = await response.text();
    throw SessionError.fromResponse(response.status, text);
  }
}
async function getActiveSessions(token, streamingBaseUrl) {
  if (!token) {
    throw new Error("Missing token for getting active sessions");
  }
  const deviceId = crypto.randomUUID();
  const clientId = crypto.randomUUID();
  const base = streamingBaseUrl.trim().endsWith("/") ? streamingBaseUrl.trim().slice(0, -1) : streamingBaseUrl.trim();
  const url = `${base}/v2/session`;
  const headers = buildDeviceHeaders(token, clientId, deviceId);
  const response = await fetch(url, {
    method: "GET",
    headers
  });
  const text = await response.text();
  if (!response.ok) {
    console.warn(`Get sessions failed: ${response.status} - ${text.slice(0, 200)}`);
    return [];
  }
  let sessionsResponse;
  try {
    sessionsResponse = JSON.parse(text);
  } catch {
    return [];
  }
  if (sessionsResponse.requestStatus.statusCode !== 1) {
    console.warn(`Get sessions API error: ${sessionsResponse.requestStatus.statusDescription}`);
    return [];
  }
  const activeSessions = sessionsResponse.sessions.filter((s) => s.status === 2 || s.status === 3).map((s) => {
    const appId = s.sessionRequestData?.appId ? Number(s.sessionRequestData.appId) : 0;
    const serverIp = s.sessionControlInfo?.ip;
    const connInfo = s.connectionInfo?.find((conn) => conn.usage === 14 && conn.ip);
    const connIp = connInfo?.ip;
    const signalingUrl = Array.isArray(connIp) ? connIp.map((ip) => `wss://${ip}:443/nvst/`) : typeof connIp === "string" ? [`wss://${connIp}:443/nvst/`] : Array.isArray(serverIp) ? serverIp.map((ip) => `wss://${ip}:443/nvst/`) : typeof serverIp === "string" ? [`wss://${serverIp}:443/nvst/`] : void 0;
    const monitorSettings = s.monitorSettings?.[0];
    const resolution = monitorSettings ? `${monitorSettings.widthInPixels ?? 0}x${monitorSettings.heightInPixels ?? 0}` : void 0;
    const fps = monitorSettings?.framesPerSecond ?? void 0;
    return {
      sessionId: s.sessionId,
      appId,
      gpuType: s.gpuType,
      status: s.status,
      serverIp,
      signalingUrl: Array.isArray(signalingUrl) ? signalingUrl[0] : signalingUrl,
      resolution,
      fps
    };
  });
  return activeSessions;
}
function buildClaimRequestBody(sessionId, appId, settings) {
  const { width, height } = parseResolution$1(settings.resolution);
  const cq = settings.colorQuality;
  const chromaFormat = colorQualityChromaFormat(cq);
  const hdrEnabled = false;
  const deviceId = crypto.randomUUID();
  const subSessionId = crypto.randomUUID();
  const timezoneMs = timezoneOffsetMs();
  const hdrCapabilities = hdrEnabled ? {
    version: 1,
    hdrEdrSupportedFlagsInUint32: 3,
    // 1=HDR10, 2=EDR, 3=both
    staticMetadataDescriptorId: 0,
    displayData: {
      maxLuminance: 1e3,
      minLuminance: 0.01,
      maxFrameAverageLuminance: 500
    }
  } : null;
  return {
    action: 2,
    data: "RESUME",
    sessionRequestData: {
      audioMode: 2,
      remoteControllersBitmap: 0,
      sdrHdrMode: hdrEnabled ? 1 : 0,
      networkTestSessionId: null,
      availableSupportedControllers: [],
      clientVersion: "30.0",
      deviceHashId: deviceId,
      internalTitle: null,
      clientPlatformName: "windows",
      metaData: [
        { key: "SubSessionId", value: subSessionId },
        { key: "wssignaling", value: "1" },
        { key: "GSStreamerType", value: "WebRTC" },
        { key: "networkType", value: "Unknown" },
        { key: "ClientImeSupport", value: "0" },
        {
          key: "clientPhysicalResolution",
          value: JSON.stringify({ horizontalPixels: width, verticalPixels: height })
        },
        { key: "surroundAudioInfo", value: "2" }
      ],
      surroundAudioInfo: 0,
      clientTimezoneOffset: timezoneMs,
      clientIdentification: "GFN-PC",
      parentSessionId: null,
      appId,
      streamerVersion: 1,
      clientRequestMonitorSettings: [
        {
          widthInPixels: width,
          heightInPixels: height,
          framesPerSecond: settings.fps,
          sdrHdrMode: hdrEnabled ? 1 : 0,
          displayData: {
            desiredContentMaxLuminance: hdrEnabled ? 1e3 : 0,
            desiredContentMinLuminance: 0,
            desiredContentMaxFrameAverageLuminance: hdrEnabled ? 500 : 0
          },
          dpi: 0
        }
      ],
      appLaunchMode: 1,
      sdkVersion: "1.0",
      enhancedStreamMode: 1,
      useOps: true,
      clientDisplayHdrCapabilities: hdrCapabilities,
      accountLinked: true,
      partnerCustomData: "",
      enablePersistingInGameSettings: true,
      secureRTSPSupported: false,
      userAge: 26,
      requestedStreamingFeatures: {
        reflex: settings.fps >= 120,
        bitDepth: 0,
        cloudGsync: false,
        enabledL4S: false,
        profile: 0,
        fallbackToLogicalResolution: false,
        chromaFormat,
        prefilterMode: 0,
        hudStreamingMode: 0
      }
    },
    metaData: []
  };
}
async function claimSession(input) {
  if (!input.token) {
    throw new Error("Missing token for session claim");
  }
  const deviceId = crypto.randomUUID();
  const clientId = crypto.randomUUID();
  const claimUrl = `https://${input.serverIp}/v2/session/${input.sessionId}?keyboardLayout=en-US&languageCode=en_US`;
  const appId = input.appId ?? "0";
  const settings = input.settings ?? {
    resolution: "1920x1080",
    fps: 60,
    colorQuality: "8bit_420"
  };
  const payload = buildClaimRequestBody(input.sessionId, appId, settings);
  const headers = buildDeviceHeaders(input.token, clientId, deviceId);
  const response = await fetch(claimUrl, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload)
  });
  const text = await response.text();
  if (!response.ok) {
    throw SessionError.fromResponse(response.status, text);
  }
  const apiResponse = JSON.parse(text);
  if (apiResponse.requestStatus.statusCode !== 1) {
    throw SessionError.fromResponse(200, text);
  }
  const getUrl = `https://${input.serverIp}/v2/session/${input.sessionId}`;
  const maxAttempts = 60;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (attempt > 1) {
      await new Promise((resolve) => setTimeout(resolve, 1e3));
    }
    const pollHeaders = { ...headers };
    delete pollHeaders["Origin"];
    delete pollHeaders["Referer"];
    const pollResponse = await fetch(getUrl, {
      method: "GET",
      headers: pollHeaders
    });
    if (!pollResponse.ok) {
      continue;
    }
    const pollText = await pollResponse.text();
    let pollApiResponse;
    try {
      pollApiResponse = JSON.parse(pollText);
    } catch {
      continue;
    }
    const sessionData = pollApiResponse.session;
    if (sessionData.status === 2 || sessionData.status === 3) {
      const signaling = resolveSignaling(pollApiResponse);
      const queuePosition = extractQueuePosition(pollApiResponse);
      return {
        sessionId: sessionData.sessionId,
        status: sessionData.status,
        queuePosition,
        zone: "",
        // Zone not applicable for claimed sessions
        streamingBaseUrl: `https://${input.serverIp}`,
        serverIp: signaling.serverIp,
        signalingServer: signaling.signalingServer,
        signalingUrl: signaling.signalingUrl,
        gpuType: sessionData.gpuType,
        iceServers: normalizeIceServers(pollApiResponse),
        mediaConnectionInfo: signaling.mediaConnectionInfo
      };
    }
    if (sessionData.status !== 6) {
      break;
    }
  }
  throw new Error("Session did not become ready after claiming");
}
const GRAPHQL_URL = "https://games.geforce.com/graphql";
const PANELS_QUERY_HASH = "f8e26265a5db5c20e1334a6872cf04b6e3970507697f6ae55a6ddefa5420daf0";
const APP_METADATA_QUERY_HASH = "39187e85b6dcf60b7279a5f233288b0a8b69a8b1dbcfb5b25555afdcb988f0d7";
const DEFAULT_LOCALE = "en_US";
const LCARS_CLIENT_ID = "ec7e38d4-03af-4b58-b131-cfb0495903ab";
const GFN_CLIENT_VERSION = "2.0.80.173";
const GFN_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 NVIDIACEFClient/HEAD/debb5919f6 GFN-PC/2.0.80.173";
function optimizeImage(url) {
  if (url.includes("img.nvidiagrid.net")) {
    return `${url};f=webp;w=272`;
  }
  return url;
}
function isNumericId$1(value) {
  if (!value) {
    return false;
  }
  return /^\d+$/.test(value);
}
function randomHuId() {
  return `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`;
}
async function getVpcId(token, providerStreamingBaseUrl) {
  const base = providerStreamingBaseUrl?.trim() || "https://prod.cloudmatchbeta.nvidiagrid.net/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  const response = await fetch(`${normalizedBase}v2/serverInfo`, {
    headers: {
      Accept: "application/json",
      Authorization: `GFNJWT ${token}`,
      "nv-client-id": LCARS_CLIENT_ID,
      "nv-client-type": "NATIVE",
      "nv-client-version": GFN_CLIENT_VERSION,
      "nv-client-streamer": "NVIDIA-CLASSIC",
      "nv-device-os": "WINDOWS",
      "nv-device-type": "DESKTOP",
      "User-Agent": GFN_USER_AGENT
    }
  });
  if (!response.ok) {
    return "GFN-PC";
  }
  const payload = await response.json();
  return payload.requestStatus?.serverId ?? "GFN-PC";
}
function appToGame(app) {
  const variants = app.variants?.map((variant) => ({
    id: variant.id,
    store: variant.appStore,
    supportedControls: variant.supportedControls ?? []
  })) ?? [];
  const selectedVariantIndex = app.variants?.findIndex((variant) => variant.gfn?.library?.selected === true) ?? 0;
  const safeIndex = Math.max(0, selectedVariantIndex);
  const selectedVariant = variants[safeIndex];
  const selectedVariantId = selectedVariant?.id;
  const fallbackNumericVariantId = variants.find((variant) => isNumericId$1(variant.id))?.id;
  const launchAppId = isNumericId$1(selectedVariantId) ? selectedVariantId : fallbackNumericVariantId ?? (isNumericId$1(app.id) ? app.id : void 0);
  const id = `${app.id}:${selectedVariantId ?? "default"}`;
  const imageUrl = app.images?.GAME_BOX_ART ?? app.images?.TV_BANNER ?? app.images?.HERO_IMAGE ?? void 0;
  return {
    id,
    uuid: app.id,
    launchAppId,
    title: app.title,
    description: app.description ?? app.longDescription,
    imageUrl: imageUrl ? optimizeImage(imageUrl) : void 0,
    playType: app.gfn?.playType,
    membershipTierLabel: app.gfn?.minimumMembershipTierLabel,
    selectedVariantIndex: Math.max(0, selectedVariantIndex),
    variants
  };
}
async function fetchAppMetaData(token, appIdOrUuid, vpcId) {
  const variables = JSON.stringify({
    vpcId,
    locale: DEFAULT_LOCALE,
    appIds: [appIdOrUuid]
  });
  const extensions = JSON.stringify({
    persistedQuery: {
      sha256Hash: APP_METADATA_QUERY_HASH
    }
  });
  const params = new URLSearchParams({
    requestType: "appMetaData",
    extensions,
    huId: randomHuId(),
    variables
  });
  const response = await fetch(`${GRAPHQL_URL}?${params.toString()}`, {
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/graphql",
      Origin: "https://play.geforcenow.com",
      Referer: "https://play.geforcenow.com/",
      Authorization: `GFNJWT ${token}`,
      "nv-client-id": LCARS_CLIENT_ID,
      "nv-client-type": "NATIVE",
      "nv-client-version": GFN_CLIENT_VERSION,
      "nv-client-streamer": "NVIDIA-CLASSIC",
      "nv-device-os": "WINDOWS",
      "nv-device-type": "DESKTOP",
      "nv-device-make": "UNKNOWN",
      "nv-device-model": "UNKNOWN",
      "nv-browser-type": "CHROME",
      "User-Agent": GFN_USER_AGENT
    }
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`App metadata failed (${response.status}): ${text.slice(0, 400)}`);
  }
  return await response.json();
}
async function fetchPanels(token, panelNames, vpcId) {
  const variables = JSON.stringify({
    vpcId,
    locale: DEFAULT_LOCALE,
    panelNames
  });
  const extensions = JSON.stringify({
    persistedQuery: {
      sha256Hash: PANELS_QUERY_HASH
    }
  });
  const requestType = panelNames.includes("LIBRARY") ? "panels/Library" : "panels/MainV2";
  const params = new URLSearchParams({
    requestType,
    extensions,
    huId: randomHuId(),
    variables
  });
  const response = await fetch(`${GRAPHQL_URL}?${params.toString()}`, {
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/graphql",
      Origin: "https://play.geforcenow.com",
      Referer: "https://play.geforcenow.com/",
      Authorization: `GFNJWT ${token}`,
      "nv-client-id": LCARS_CLIENT_ID,
      "nv-client-type": "NATIVE",
      "nv-client-version": GFN_CLIENT_VERSION,
      "nv-client-streamer": "NVIDIA-CLASSIC",
      "nv-device-os": "WINDOWS",
      "nv-device-type": "DESKTOP",
      "nv-device-make": "UNKNOWN",
      "nv-device-model": "UNKNOWN",
      "nv-browser-type": "CHROME",
      "User-Agent": GFN_USER_AGENT
    }
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Games GraphQL failed (${response.status}): ${text.slice(0, 400)}`);
  }
  return await response.json();
}
function flattenPanels(payload) {
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join(", "));
  }
  const games = [];
  for (const panel of payload.data?.panels ?? []) {
    for (const section of panel.sections ?? []) {
      for (const item of section.items ?? []) {
        if (item.__typename === "GameItem" && item.app) {
          games.push(appToGame(item.app));
        }
      }
    }
  }
  return games;
}
async function fetchMainGames(token, providerStreamingBaseUrl) {
  const vpcId = await getVpcId(token, providerStreamingBaseUrl);
  const payload = await fetchPanels(token, ["MAIN"], vpcId);
  return flattenPanels(payload);
}
async function fetchLibraryGames(token, providerStreamingBaseUrl) {
  const vpcId = await getVpcId(token, providerStreamingBaseUrl);
  const payload = await fetchPanels(token, ["LIBRARY"], vpcId);
  return flattenPanels(payload);
}
async function fetchPublicGames() {
  const response = await fetch(
    "https://static.nvidiagrid.net/supported-public-game-list/locales/gfnpc-en-US.json",
    {
      headers: {
        "User-Agent": GFN_USER_AGENT
      }
    }
  );
  if (!response.ok) {
    throw new Error(`Public games fetch failed (${response.status})`);
  }
  const payload = await response.json();
  return payload.filter((item) => item.status === "AVAILABLE" && item.title).map((item) => {
    const id = String(item.id ?? item.title ?? "unknown");
    const steamAppId = item.steamUrl?.split("/app/")[1]?.split("/")[0];
    const imageUrl = steamAppId ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${steamAppId}/library_600x900.jpg` : void 0;
    return {
      id,
      uuid: id,
      launchAppId: isNumericId$1(id) ? id : void 0,
      title: item.title ?? id,
      selectedVariantIndex: 0,
      variants: [{ id, store: "Unknown", supportedControls: [] }],
      imageUrl
    };
  });
}
async function resolveLaunchAppId(token, appIdOrUuid, providerStreamingBaseUrl) {
  if (isNumericId$1(appIdOrUuid)) {
    return appIdOrUuid;
  }
  const vpcId = await getVpcId(token, providerStreamingBaseUrl);
  const payload = await fetchAppMetaData(token, appIdOrUuid, vpcId);
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join(", "));
  }
  const app = payload.data?.apps.items?.[0];
  if (!app) {
    return null;
  }
  const variants = app.variants ?? [];
  const selected = variants.find((variant) => variant.gfn?.library?.selected === true);
  if (isNumericId$1(selected?.id)) {
    return selected.id;
  }
  const firstNumeric = variants.find((variant) => isNumericId$1(variant.id));
  if (firstNumeric) {
    return firstNumeric.id;
  }
  return isNumericId$1(app.id) ? app.id : null;
}
class BrowserSignalingClient {
  constructor(signalingServer, sessionId, signalingUrl) {
    this.signalingServer = signalingServer;
    this.sessionId = sessionId;
    this.signalingUrl = signalingUrl;
  }
  ws = null;
  peerId = 2;
  peerName = `peer-${Math.floor(Math.random() * 1e10)}`;
  ackCounter = 0;
  heartbeatTimer = null;
  listeners = /* @__PURE__ */ new Set();
  buildSignInUrl() {
    let serverWithPort;
    if (this.signalingUrl) {
      const withoutScheme = this.signalingUrl.replace(/^wss?:\/\//, "");
      const hostPort = withoutScheme.split("/")[0];
      serverWithPort = hostPort && hostPort.length > 0 ? hostPort.includes(":") ? hostPort : `${hostPort}:443` : this.signalingServer.includes(":") ? this.signalingServer : `${this.signalingServer}:443`;
    } else {
      serverWithPort = this.signalingServer.includes(":") ? this.signalingServer : `${this.signalingServer}:443`;
    }
    return `wss://${serverWithPort}/nvst/sign_in?peer_id=${this.peerName}&version=2`;
  }
  onEvent(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  emit(event) {
    for (const listener of this.listeners) listener(event);
  }
  nextAckId() {
    return ++this.ackCounter;
  }
  sendJson(payload) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }
  setupHeartbeat() {
    this.clearHeartbeat();
    this.heartbeatTimer = setInterval(() => this.sendJson({ hb: 1 }), 5e3);
  }
  clearHeartbeat() {
    if (this.heartbeatTimer !== null) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
  sendPeerInfo() {
    this.sendJson({
      ackid: this.nextAckId(),
      peer_info: {
        browser: "Chrome",
        browserVersion: "131",
        connected: true,
        id: this.peerId,
        name: this.peerName,
        peerRole: 0,
        resolution: "1920x1080",
        version: 2
      }
    });
  }
  connect() {
    return new Promise((resolve, reject) => {
      const url = this.buildSignInUrl();
      const protocol = `x-nv-sessionid.${this.sessionId}`;
      console.log("[BrowserSignaling] Connecting to:", url);
      const ws = new WebSocket(url, protocol);
      this.ws = ws;
      ws.onopen = () => {
        this.sendPeerInfo();
        this.setupHeartbeat();
        this.emit({ type: "connected" });
        resolve();
      };
      ws.onerror = (e) => {
        this.emit({ type: "error", message: `Signaling connect failed: ${String(e)}` });
        reject(new Error("WebSocket connection failed"));
      };
      ws.onclose = (e) => {
        this.clearHeartbeat();
        this.emit({ type: "disconnected", reason: e.reason || "socket closed" });
      };
      ws.onmessage = (e) => {
        this.handleMessage(e.data);
      };
    });
  }
  handleMessage(text) {
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return;
    }
    if (typeof parsed.ackid === "number" && parsed.peer_info?.id !== this.peerId) {
      this.sendJson({ ack: parsed.ackid });
    }
    if (parsed.hb) {
      this.sendJson({ hb: 1 });
      return;
    }
    if (!parsed.peer_msg?.msg) return;
    let peerPayload;
    try {
      peerPayload = JSON.parse(parsed.peer_msg.msg);
    } catch {
      return;
    }
    if (peerPayload.type === "offer" && typeof peerPayload.sdp === "string") {
      console.log(`[BrowserSignaling] Received OFFER (${peerPayload.sdp.length} chars)`);
      this.emit({ type: "offer", sdp: peerPayload.sdp });
      return;
    }
    if (typeof peerPayload.candidate === "string") {
      this.emit({
        type: "remote-ice",
        candidate: {
          candidate: peerPayload.candidate,
          sdpMid: typeof peerPayload.sdpMid === "string" || peerPayload.sdpMid === null ? peerPayload.sdpMid : void 0,
          sdpMLineIndex: typeof peerPayload.sdpMLineIndex === "number" || peerPayload.sdpMLineIndex === null ? peerPayload.sdpMLineIndex : void 0
        }
      });
    }
  }
  sendAnswer(payload) {
    const answer = {
      type: "answer",
      sdp: payload.sdp,
      ...payload.nvstSdp ? { nvstSdp: payload.nvstSdp } : {}
    };
    this.sendJson({
      peer_msg: { from: this.peerId, to: 1, msg: JSON.stringify(answer) },
      ackid: this.nextAckId()
    });
  }
  sendIceCandidate(candidate) {
    this.sendJson({
      peer_msg: {
        from: this.peerId,
        to: 1,
        msg: JSON.stringify({
          candidate: candidate.candidate,
          sdpMid: candidate.sdpMid,
          sdpMLineIndex: candidate.sdpMLineIndex
        })
      },
      ackid: this.nextAckId()
    });
  }
  disconnect() {
    this.clearHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
function callCapacitor(plugin, method, args = {}) {
  return new Promise((resolve, reject) => {
    const cap = window.Capacitor;
    if (!cap) {
      reject(new Error("Capacitor bridge not available"));
      return;
    }
    if (cap.nativePromise) {
      cap.nativePromise(plugin, method, args).then(resolve).catch(reject);
      return;
    }
    if (cap.Plugins?.[plugin]?.[method]) {
      cap.Plugins[plugin][method](args).then(resolve).catch(reject);
      return;
    }
    reject(new Error(`Plugin ${plugin}.${method} not found on bridge`));
  });
}
function withTimeout(promise, ms, fallback) {
  return Promise.race([
    promise,
    new Promise((resolve) => setTimeout(() => resolve(fallback), ms))
  ]);
}
function getElectronApi() {
  const api = window.openNow;
  if (!api) {
    throw new Error("window.openNow is not available -- are you running outside of Electron?");
  }
  return api;
}
async function callNativePlugin(method, args) {
  return callCapacitor("GfnPlugin", method, args ?? {});
}
function buildCapacitorApi() {
  let browserSignaling = null;
  const signalingListeners = /* @__PURE__ */ new Set();
  const fullscreenListeners = /* @__PURE__ */ new Set();
  return {
    getAuthSession: (input) => withTimeout(
      callNativePlugin("getAuthSession", input),
      8e3,
      { session: null, refresh: { attempted: false, forced: false, outcome: "not_attempted", message: "Plugin timeout" } }
    ),
    getLoginProviders: () => callNativePlugin("getLoginProviders").then((r) => r.providers ?? []),
    getRegions: (input) => {
      const token = input?.token;
      const baseUrl = input?.providerStreamingBaseUrl ?? input?.streamingBaseUrl ?? "";
      return callNativePlugin("getRegions", { token, streamingBaseUrl: baseUrl }).then((r) => r.regions ?? []);
    },
    login: (input) => callNativePlugin("login", input),
    logout: () => callNativePlugin("logout"),
    fetchSubscription: () => Promise.resolve(null),
    fetchMainGames: (input) => fetchMainGames(input.token, input.providerStreamingBaseUrl),
    fetchLibraryGames: (input) => fetchLibraryGames(input.token, input.providerStreamingBaseUrl),
    fetchPublicGames: () => fetchPublicGames(),
    resolveLaunchAppId: (input) => resolveLaunchAppId(input.token, input.appIdOrUuid, input.providerStreamingBaseUrl),
    createSession: (input) => createSession(input),
    pollSession: (input) => pollSession(input),
    stopSession: (input) => stopSession(input),
    getActiveSessions: (token, streamingBaseUrl) => getActiveSessions(token ?? "", streamingBaseUrl ?? ""),
    claimSession: (input) => claimSession(input),
    showSessionConflictDialog: () => callNativePlugin("showSessionConflictDialog"),
    connectSignaling: async (input) => {
      browserSignaling?.disconnect();
      browserSignaling = new BrowserSignalingClient(
        input.signalingServer,
        input.sessionId,
        input.signalingUrl
      );
      browserSignaling.onEvent((event) => {
        for (const cb of signalingListeners) cb(event);
      });
      await browserSignaling.connect();
    },
    disconnectSignaling: async () => {
      browserSignaling?.disconnect();
      browserSignaling = null;
    },
    sendAnswer: async (input) => {
      browserSignaling?.sendAnswer(input);
    },
    sendIceCandidate: async (input) => {
      browserSignaling?.sendIceCandidate(input);
    },
    onSignalingEvent: (listener) => {
      signalingListeners.add(listener);
      return () => signalingListeners.delete(listener);
    },
    // Fullscreen on Android is handled by the WebView / native layer.
    // We expose no-op implementations so the renderer code compiles unchanged.
    onToggleFullscreen: (listener) => {
      fullscreenListeners.add(listener);
      return () => fullscreenListeners.delete(listener);
    },
    toggleFullscreen: () => callNativePlugin("toggleFullscreen"),
    setOrientation: (mode) => callNativePlugin("setOrientation", { mode }),
    togglePointerLock: () => Promise.resolve(),
    // no pointer lock on touch screens
    getSettings: () => withTimeout(
      callNativePlugin("getSettings"),
      8e3,
      // Default settings returned if the plugin hangs
      {
        resolution: "1920x1080",
        fps: 60,
        maxBitrateMbps: 75,
        codec: "H264",
        decoderPreference: "auto",
        encoderPreference: "auto",
        colorQuality: "10bit_420",
        region: "",
        clipboardPaste: false,
        mouseSensitivity: 1,
        shortcutToggleStats: "F3",
        shortcutTogglePointerLock: "F8",
        shortcutStopStream: "Ctrl+Shift+Q",
        shortcutToggleAntiAfk: "Ctrl+Shift+K",
        shortcutToggleMicrophone: "Ctrl+Shift+M",
        microphoneMode: "disabled",
        microphoneDeviceId: "",
        hideStreamButtons: false,
        sessionClockShowEveryMinutes: 60,
        sessionClockShowDurationSeconds: 30,
        windowWidth: 1400,
        windowHeight: 900
      }
    ),
    setSetting: (key, value) => callNativePlugin("setSetting", { key, value }),
    resetSettings: () => callNativePlugin("resetSettings")
  };
}
let _api = null;
function getPlatformApi() {
  if (_api) return _api;
  const platform = getPlatform();
  if (platform === "electron") {
    _api = getElectronApi();
  } else if (platform === "capacitor") {
    _api = buildCapacitorApi();
  } else {
    try {
      _api = getElectronApi();
    } catch {
      throw new Error(
        "No platform API found. Run the app inside Electron or a Capacitor shell."
      );
    }
  }
  return _api;
}
const INPUT_HEARTBEAT = 2;
const INPUT_KEY_DOWN = 3;
const INPUT_KEY_UP = 4;
const INPUT_MOUSE_REL = 7;
const INPUT_MOUSE_BUTTON_DOWN = 8;
const INPUT_MOUSE_BUTTON_UP = 9;
const INPUT_MOUSE_WHEEL = 10;
const INPUT_GAMEPAD = 12;
const GAMEPAD_DPAD_UP = 1;
const GAMEPAD_DPAD_DOWN = 2;
const GAMEPAD_DPAD_LEFT = 4;
const GAMEPAD_DPAD_RIGHT = 8;
const GAMEPAD_START = 16;
const GAMEPAD_BACK = 32;
const GAMEPAD_LS = 64;
const GAMEPAD_RS = 128;
const GAMEPAD_LB = 256;
const GAMEPAD_RB = 512;
const GAMEPAD_GUIDE = 1024;
const GAMEPAD_A = 4096;
const GAMEPAD_B = 8192;
const GAMEPAD_X = 16384;
const GAMEPAD_Y = 32768;
const GAMEPAD_MAX_CONTROLLERS = 4;
const GAMEPAD_PACKET_SIZE = 38;
const GAMEPAD_DEADZONE = 0.15;
const codeMap = {
  // Letters
  KeyA: { vk: 65, scancode: 4 },
  KeyB: { vk: 66, scancode: 5 },
  KeyC: { vk: 67, scancode: 6 },
  KeyD: { vk: 68, scancode: 7 },
  KeyE: { vk: 69, scancode: 8 },
  KeyF: { vk: 70, scancode: 9 },
  KeyG: { vk: 71, scancode: 10 },
  KeyH: { vk: 72, scancode: 11 },
  KeyI: { vk: 73, scancode: 12 },
  KeyJ: { vk: 74, scancode: 13 },
  KeyK: { vk: 75, scancode: 14 },
  KeyL: { vk: 76, scancode: 15 },
  KeyM: { vk: 77, scancode: 16 },
  KeyN: { vk: 78, scancode: 17 },
  KeyO: { vk: 79, scancode: 18 },
  KeyP: { vk: 80, scancode: 19 },
  KeyQ: { vk: 81, scancode: 20 },
  KeyR: { vk: 82, scancode: 21 },
  KeyS: { vk: 83, scancode: 22 },
  KeyT: { vk: 84, scancode: 23 },
  KeyU: { vk: 85, scancode: 24 },
  KeyV: { vk: 86, scancode: 25 },
  KeyW: { vk: 87, scancode: 26 },
  KeyX: { vk: 88, scancode: 27 },
  KeyY: { vk: 89, scancode: 28 },
  KeyZ: { vk: 90, scancode: 29 },
  // Numbers
  Digit1: { vk: 49, scancode: 30 },
  Digit2: { vk: 50, scancode: 31 },
  Digit3: { vk: 51, scancode: 32 },
  Digit4: { vk: 52, scancode: 33 },
  Digit5: { vk: 53, scancode: 34 },
  Digit6: { vk: 54, scancode: 35 },
  Digit7: { vk: 55, scancode: 36 },
  Digit8: { vk: 56, scancode: 37 },
  Digit9: { vk: 57, scancode: 38 },
  Digit0: { vk: 48, scancode: 39 },
  // Special keys
  Enter: { vk: 13, scancode: 40 },
  Escape: { vk: 27, scancode: 41 },
  Backspace: { vk: 8, scancode: 42 },
  Tab: { vk: 9, scancode: 43 },
  Space: { vk: 32, scancode: 44 },
  // Punctuation
  Minus: { vk: 189, scancode: 45 },
  Equal: { vk: 187, scancode: 46 },
  BracketLeft: { vk: 219, scancode: 47 },
  BracketRight: { vk: 221, scancode: 48 },
  Backslash: { vk: 220, scancode: 49 },
  Semicolon: { vk: 186, scancode: 51 },
  Quote: { vk: 222, scancode: 52 },
  Backquote: { vk: 192, scancode: 53 },
  Comma: { vk: 188, scancode: 54 },
  Period: { vk: 190, scancode: 55 },
  Slash: { vk: 191, scancode: 56 },
  // Function keys
  F1: { vk: 112, scancode: 58 },
  F2: { vk: 113, scancode: 59 },
  F3: { vk: 114, scancode: 60 },
  F4: { vk: 115, scancode: 61 },
  F5: { vk: 116, scancode: 62 },
  F6: { vk: 117, scancode: 63 },
  F7: { vk: 118, scancode: 64 },
  F8: { vk: 119, scancode: 65 },
  F9: { vk: 120, scancode: 66 },
  F10: { vk: 121, scancode: 67 },
  F11: { vk: 122, scancode: 68 },
  F12: { vk: 123, scancode: 69 },
  F13: { vk: 124, scancode: 100 },
  // Navigation keys
  ArrowRight: { vk: 39, scancode: 79 },
  ArrowLeft: { vk: 37, scancode: 80 },
  ArrowDown: { vk: 40, scancode: 81 },
  ArrowUp: { vk: 38, scancode: 82 },
  // Modifier keys
  ControlLeft: { vk: 162, scancode: 224 },
  ShiftLeft: { vk: 160, scancode: 225 },
  AltLeft: { vk: 164, scancode: 226 },
  MetaLeft: { vk: 91, scancode: 227 },
  ControlRight: { vk: 163, scancode: 228 },
  ShiftRight: { vk: 161, scancode: 229 },
  AltRight: { vk: 165, scancode: 230 },
  MetaRight: { vk: 92, scancode: 231 },
  // Caps Lock and Num Lock
  CapsLock: { vk: 20, scancode: 57 },
  NumLock: { vk: 144, scancode: 83 },
  // Navigation cluster
  Insert: { vk: 45, scancode: 73 },
  Delete: { vk: 46, scancode: 76 },
  Home: { vk: 36, scancode: 74 },
  End: { vk: 35, scancode: 77 },
  PageUp: { vk: 33, scancode: 75 },
  PageDown: { vk: 34, scancode: 78 },
  // System keys
  PrintScreen: { vk: 44, scancode: 70 },
  ScrollLock: { vk: 145, scancode: 71 },
  Pause: { vk: 19, scancode: 72 },
  // Context Menu key
  ContextMenu: { vk: 93, scancode: 101 },
  // Numpad keys
  Numpad0: { vk: 96, scancode: 98 },
  Numpad1: { vk: 97, scancode: 89 },
  Numpad2: { vk: 98, scancode: 90 },
  Numpad3: { vk: 99, scancode: 91 },
  Numpad4: { vk: 100, scancode: 92 },
  Numpad5: { vk: 101, scancode: 93 },
  Numpad6: { vk: 102, scancode: 94 },
  Numpad7: { vk: 103, scancode: 95 },
  Numpad8: { vk: 104, scancode: 96 },
  Numpad9: { vk: 105, scancode: 97 },
  NumpadAdd: { vk: 107, scancode: 87 },
  NumpadSubtract: { vk: 109, scancode: 86 },
  NumpadMultiply: { vk: 106, scancode: 85 },
  NumpadDivide: { vk: 111, scancode: 84 },
  NumpadDecimal: { vk: 110, scancode: 99 },
  NumpadEnter: { vk: 13, scancode: 88 }
};
const keyFallbackMap = {
  Escape: { vk: 27, scancode: 41 },
  Esc: { vk: 27, scancode: 41 }
};
function writeTimestamp(view, offset) {
  const tsUs = performance.now() * 1e3;
  const lo = Math.floor(tsUs) & 4294967295;
  const hi = Math.floor(tsUs / 4294967296);
  view.setUint32(offset, hi, false);
  view.setUint32(offset + 4, lo, false);
}
function wrapSingleEvent(payload, protocolVersion) {
  if (protocolVersion <= 2) {
    return payload;
  }
  const wrapped = new Uint8Array(9 + 1 + payload.length);
  const view = new DataView(wrapped.buffer);
  wrapped[0] = 35;
  writeTimestamp(view, 1);
  wrapped[9] = 34;
  wrapped.set(payload, 10);
  return wrapped;
}
function wrapMouseMoveEvent(payload, protocolVersion) {
  if (protocolVersion <= 2) {
    return payload;
  }
  const wrapped = new Uint8Array(9 + 1 + 2 + payload.length);
  const view = new DataView(wrapped.buffer);
  wrapped[0] = 35;
  writeTimestamp(view, 1);
  wrapped[9] = 33;
  view.setUint16(10, payload.length, false);
  wrapped.set(payload, 12);
  return wrapped;
}
function wrapGamepadReliable(payload, protocolVersion) {
  if (protocolVersion <= 2) {
    return payload;
  }
  const wrapped = new Uint8Array(9 + 1 + 2 + payload.length);
  const view = new DataView(wrapped.buffer);
  wrapped[0] = 35;
  writeTimestamp(view, 1);
  wrapped[9] = 33;
  view.setUint16(10, payload.length, false);
  wrapped.set(payload, 12);
  return wrapped;
}
function wrapGamepadPartiallyReliable(payload, protocolVersion, gamepadIndex, sequenceNumber) {
  if (protocolVersion <= 2) {
    return payload;
  }
  const wrapped = new Uint8Array(9 + 1 + 1 + 2 + 1 + 2 + payload.length);
  const view = new DataView(wrapped.buffer);
  wrapped[0] = 35;
  writeTimestamp(view, 1);
  wrapped[9] = 38;
  wrapped[10] = gamepadIndex & 255;
  view.setUint16(11, sequenceNumber, false);
  wrapped[13] = 33;
  view.setUint16(14, payload.length, false);
  wrapped.set(payload, 16);
  return wrapped;
}
class InputEncoder {
  protocolVersion = 2;
  // Per-gamepad sequence numbers for partially reliable channel framing.
  // Official GFN client tracks this per-gamepad-index via this.tc Map.
  gamepadSequence = /* @__PURE__ */ new Map();
  setProtocolVersion(version) {
    this.protocolVersion = version;
  }
  /** Get and increment the sequence number for a gamepad on the PR channel.
   *  Wraps at 65536 (uint16 range), matching official client's cl() function. */
  getNextGamepadSequence(gamepadIndex) {
    const current = this.gamepadSequence.get(gamepadIndex) ?? 1;
    this.gamepadSequence.set(gamepadIndex, (current + 1) % 65536);
    return current;
  }
  resetGamepadSequences() {
    this.gamepadSequence.clear();
  }
  encodeHeartbeat() {
    const payload = new Uint8Array(4);
    const view = new DataView(payload.buffer);
    view.setUint32(0, INPUT_HEARTBEAT, true);
    return payload;
  }
  encodeKeyDown(payload) {
    return this.encodeKey(INPUT_KEY_DOWN, payload);
  }
  encodeKeyUp(payload) {
    return this.encodeKey(INPUT_KEY_UP, payload);
  }
  encodeMouseMove(payload) {
    const bytes = new Uint8Array(22);
    const view = new DataView(bytes.buffer);
    view.setUint32(0, INPUT_MOUSE_REL, true);
    view.setInt16(4, payload.dx, false);
    view.setInt16(6, payload.dy, false);
    view.setUint16(8, 0, false);
    view.setUint32(10, 0, false);
    view.setBigUint64(14, payload.timestampUs, false);
    return wrapMouseMoveEvent(bytes, this.protocolVersion);
  }
  encodeMouseButtonDown(payload) {
    return this.encodeMouseButton(INPUT_MOUSE_BUTTON_DOWN, payload);
  }
  encodeMouseButtonUp(payload) {
    return this.encodeMouseButton(INPUT_MOUSE_BUTTON_UP, payload);
  }
  encodeMouseWheel(payload) {
    const bytes = new Uint8Array(22);
    const view = new DataView(bytes.buffer);
    view.setUint32(0, INPUT_MOUSE_WHEEL, true);
    view.setInt16(4, 0, false);
    view.setInt16(6, payload.delta, false);
    view.setUint16(8, 0, false);
    view.setUint32(10, 0, false);
    view.setBigUint64(14, payload.timestampUs, false);
    return wrapSingleEvent(bytes, this.protocolVersion);
  }
  encodeGamepadState(payload, bitmap, usePartiallyReliable) {
    const bytes = new Uint8Array(GAMEPAD_PACKET_SIZE);
    const view = new DataView(bytes.buffer);
    view.setUint32(0, INPUT_GAMEPAD, true);
    view.setUint16(4, 26, true);
    view.setUint16(6, payload.controllerId & 3, true);
    view.setUint16(8, bitmap, true);
    view.setUint16(10, 20, true);
    view.setUint16(12, payload.buttons, true);
    const packedTriggers = payload.leftTrigger & 255 | (payload.rightTrigger & 255) << 8;
    view.setUint16(14, packedTriggers, true);
    view.setInt16(16, payload.leftStickX, true);
    view.setInt16(18, payload.leftStickY, true);
    view.setInt16(20, payload.rightStickX, true);
    view.setInt16(22, payload.rightStickY, true);
    view.setUint16(24, 0, true);
    view.setUint16(26, 85, true);
    view.setUint16(28, 0, true);
    view.setBigUint64(30, payload.timestampUs, true);
    if (usePartiallyReliable) {
      const seq = this.getNextGamepadSequence(payload.controllerId);
      return wrapGamepadPartiallyReliable(bytes, this.protocolVersion, payload.controllerId, seq);
    }
    return wrapGamepadReliable(bytes, this.protocolVersion);
  }
  encodeKey(type, payload) {
    const bytes = new Uint8Array(18);
    const view = new DataView(bytes.buffer);
    view.setUint32(0, type, true);
    view.setUint16(4, payload.keycode, false);
    view.setUint16(6, payload.modifiers, false);
    view.setUint16(8, payload.scancode, false);
    view.setBigUint64(10, payload.timestampUs, false);
    return wrapSingleEvent(bytes, this.protocolVersion);
  }
  encodeMouseButton(type, payload) {
    const bytes = new Uint8Array(18);
    const view = new DataView(bytes.buffer);
    view.setUint32(0, type, true);
    view.setUint8(4, payload.button);
    view.setUint8(5, 0);
    view.setUint32(6, 0, false);
    view.setBigUint64(10, payload.timestampUs, false);
    return wrapSingleEvent(bytes, this.protocolVersion);
  }
}
function modifierFlags(event) {
  let flags = 0;
  if (event.shiftKey) flags |= 1;
  if (event.ctrlKey) flags |= 2;
  if (event.altKey) flags |= 4;
  if (event.metaKey) flags |= 8;
  if (event.getModifierState("CapsLock")) flags |= 16;
  if (event.getModifierState("NumLock")) flags |= 32;
  return flags;
}
function mapKeyboardEvent(event) {
  const mapped = codeMap[event.code];
  if (mapped) {
    return mapped;
  }
  const fallbackMapped = keyFallbackMap[event.key];
  if (fallbackMapped) {
    return fallbackMapped;
  }
  const key = event.key;
  if (key.length === 1) {
    const upper = key.toUpperCase();
    if (upper >= "A" && upper <= "Z") {
      return { vk: upper.charCodeAt(0), scancode: 0 };
    }
    if (key >= "0" && key <= "9") {
      return { vk: key.charCodeAt(0), scancode: 0 };
    }
  }
  return null;
}
function toMouseButton(button) {
  return button + 1;
}
function applyDeadzone(x, y, deadzone = GAMEPAD_DEADZONE) {
  const magnitude = Math.sqrt(x * x + y * y);
  if (magnitude < deadzone) {
    return { x: 0, y: 0 };
  }
  const normalizedX = x / magnitude;
  const normalizedY = y / magnitude;
  const scaledMagnitude = (magnitude - deadzone) / (1 - deadzone);
  const clampedMagnitude = Math.min(1, scaledMagnitude);
  return {
    x: normalizedX * clampedMagnitude,
    y: normalizedY * clampedMagnitude
  };
}
function normalizeToInt16(value) {
  return Math.max(-32768, Math.min(32767, Math.round(value * 32767)));
}
function normalizeToUint8(value) {
  return Math.max(0, Math.min(255, Math.round(value * 255)));
}
function mapGamepadButtons(gamepad) {
  let buttons = 0;
  const b = gamepad.buttons;
  if (b[0]?.value) buttons |= GAMEPAD_A;
  if (b[1]?.value) buttons |= GAMEPAD_B;
  if (b[2]?.value) buttons |= GAMEPAD_X;
  if (b[3]?.value) buttons |= GAMEPAD_Y;
  if (b[4]?.value) buttons |= GAMEPAD_LB;
  if (b[5]?.value) buttons |= GAMEPAD_RB;
  if (b[8]?.value) buttons |= GAMEPAD_BACK;
  if (b[9]?.value) buttons |= GAMEPAD_START;
  if (b[10]?.value) buttons |= GAMEPAD_LS;
  if (b[11]?.value) buttons |= GAMEPAD_RS;
  if (b[12]?.value) buttons |= GAMEPAD_DPAD_UP;
  if (b[13]?.value) buttons |= GAMEPAD_DPAD_DOWN;
  if (b[14]?.value) buttons |= GAMEPAD_DPAD_LEFT;
  if (b[15]?.value) buttons |= GAMEPAD_DPAD_RIGHT;
  if (b[16]?.value) buttons |= GAMEPAD_GUIDE;
  return buttons;
}
function readGamepadAxes(gamepad) {
  const lx = gamepad.axes[0] ?? 0;
  const ly = gamepad.axes[1] ?? 0;
  const leftStick = applyDeadzone(lx, ly);
  const rx = gamepad.axes[2] ?? 0;
  const ry = gamepad.axes[3] ?? 0;
  const rightStick = applyDeadzone(rx, ry);
  let leftTrigger = 0;
  let rightTrigger = 0;
  if (gamepad.buttons[6]) {
    leftTrigger = gamepad.buttons[6].value;
  } else if (gamepad.axes[4] !== void 0 && gamepad.axes[4] > 0) {
    leftTrigger = gamepad.axes[4];
  }
  if (gamepad.buttons[7]) {
    rightTrigger = gamepad.buttons[7].value;
  } else if (gamepad.axes[5] !== void 0 && gamepad.axes[5] > 0) {
    rightTrigger = gamepad.axes[5];
  }
  return {
    leftStickX: leftStick.x,
    leftStickY: -leftStick.y,
    // Invert Y to match XInput convention
    rightStickX: rightStick.x,
    rightStickY: -rightStick.y,
    // Invert Y to match XInput convention
    leftTrigger,
    rightTrigger
  };
}
function clamp(v) {
  return Math.max(-1, Math.min(1, v));
}
function FaceButton({ label, color, xinputFlag, clientRef }) {
  const [pressed, setPressed] = reactExports.useState(false);
  const onPress = reactExports.useCallback(() => {
    setPressed(true);
    clientRef.current?.sendGamepadButton(xinputFlag, true);
  }, [clientRef, xinputFlag]);
  const onRelease = reactExports.useCallback(() => {
    setPressed(false);
    clientRef.current?.sendGamepadButton(xinputFlag, false);
  }, [clientRef, xinputFlag]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      className: `tgp-face-btn ${pressed ? "tgp-face-btn--pressed" : ""}`,
      style: {
        borderColor: color,
        color: pressed ? "#000" : color,
        background: pressed ? color : "rgba(0,0,0,0.5)"
      },
      onTouchStart: (e) => {
        e.preventDefault();
        onPress();
      },
      onTouchEnd: (e) => {
        e.preventDefault();
        onRelease();
      },
      onTouchCancel: (e) => {
        e.preventDefault();
        onRelease();
      },
      children: label
    }
  );
}
function Dpad({ clientRef }) {
  const pressed = reactExports.useRef(/* @__PURE__ */ new Set());
  const press = reactExports.useCallback((flag) => {
    if (pressed.current.has(flag)) return;
    pressed.current.add(flag);
    clientRef.current?.sendGamepadButton(flag, true);
  }, [clientRef]);
  const release = reactExports.useCallback((flag) => {
    if (!pressed.current.has(flag)) return;
    pressed.current.delete(flag);
    clientRef.current?.sendGamepadButton(flag, false);
  }, [clientRef]);
  const releaseAll = reactExports.useCallback(() => {
    for (const flag of pressed.current) {
      clientRef.current?.sendGamepadButton(flag, false);
    }
    pressed.current.clear();
  }, [clientRef]);
  const flagsFromPosition = (el, cx, cy) => {
    const rect = el.getBoundingClientRect();
    const x = (cx - rect.left) / rect.width - 0.5;
    const y = (cy - rect.top) / rect.height - 0.5;
    const flags = [];
    if (y < -0.2) flags.push(GAMEPAD_DPAD_UP);
    if (y > 0.2) flags.push(GAMEPAD_DPAD_DOWN);
    if (x < -0.2) flags.push(GAMEPAD_DPAD_LEFT);
    if (x > 0.2) flags.push(GAMEPAD_DPAD_RIGHT);
    return flags;
  };
  const handleTouchStart = (e) => {
    e.preventDefault();
    const target = e.currentTarget;
    for (const t of Array.from(e.changedTouches)) {
      for (const f of flagsFromPosition(target, t.clientX, t.clientY)) press(f);
    }
  };
  const handleTouchMove = (e) => {
    e.preventDefault();
    const target = e.currentTarget;
    const next = /* @__PURE__ */ new Set();
    for (const t of Array.from(e.touches)) {
      for (const f of flagsFromPosition(target, t.clientX, t.clientY)) next.add(f);
    }
    for (const f of pressed.current) {
      if (!next.has(f)) release(f);
    }
    for (const f of next) {
      press(f);
    }
  };
  const handleTouchEnd = (e) => {
    e.preventDefault();
    if (e.touches.length === 0) releaseAll();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "tgp-dpad",
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchEnd,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tgp-dpad-cross", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tgp-dpad-up" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tgp-dpad-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tgp-dpad-left" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tgp-dpad-center" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tgp-dpad-right" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tgp-dpad-down" })
      ] })
    }
  );
}
function Thumbstick({ side, clientRef }) {
  const stickRef = reactExports.useRef(null);
  const knobRef = reactExports.useRef(null);
  const activeId = reactExports.useRef(null);
  const [offset, setOffset] = reactExports.useState({ x: 0, y: 0 });
  const RADIUS = 36;
  const handleTouchStart = (e) => {
    e.preventDefault();
    if (activeId.current !== null) return;
    const touch = e.changedTouches[0];
    if (!touch) return;
    activeId.current = touch.identifier;
  };
  const handleTouchMove = (e) => {
    e.preventDefault();
    const base = stickRef.current;
    if (!base || activeId.current === null) return;
    let touch;
    for (const t of Array.from(e.touches)) {
      if (t.identifier === activeId.current) {
        touch = t;
        break;
      }
    }
    if (!touch) return;
    const rect = base.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = touch.clientX - cx;
    let dy = touch.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > RADIUS) {
      dx = dx / dist * RADIUS;
      dy = dy / dist * RADIUS;
    }
    setOffset({ x: dx, y: dy });
    const nx = clamp(dx / RADIUS);
    const ny = clamp(dy / RADIUS);
    clientRef.current?.sendGamepadStick(side, nx, ny);
  };
  const handleTouchEnd = (e) => {
    e.preventDefault();
    let found = false;
    for (const t of Array.from(e.changedTouches)) {
      if (t.identifier === activeId.current) {
        found = true;
        break;
      }
    }
    if (!found) return;
    activeId.current = null;
    setOffset({ x: 0, y: 0 });
    clientRef.current?.sendGamepadStick(side, 0, 0);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref: stickRef,
      className: "tgp-stick",
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchEnd,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          ref: knobRef,
          className: "tgp-stick-knob",
          style: { transform: `translate(${offset.x}px, ${offset.y}px)` }
        }
      )
    }
  );
}
function ShoulderButton({ label, xinputFlag, clientRef }) {
  const [pressed, setPressed] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      className: `tgp-shoulder ${pressed ? "tgp-shoulder--pressed" : ""}`,
      onTouchStart: (e) => {
        e.preventDefault();
        setPressed(true);
        clientRef.current?.sendGamepadButton(xinputFlag, true);
      },
      onTouchEnd: (e) => {
        e.preventDefault();
        setPressed(false);
        clientRef.current?.sendGamepadButton(xinputFlag, false);
      },
      onTouchCancel: (e) => {
        e.preventDefault();
        setPressed(false);
        clientRef.current?.sendGamepadButton(xinputFlag, false);
      },
      children: label
    }
  );
}
function CentreButton({ label, xinputFlag, clientRef }) {
  const [pressed, setPressed] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      className: `tgp-centre ${pressed ? "tgp-centre--pressed" : ""}`,
      onTouchStart: (e) => {
        e.preventDefault();
        setPressed(true);
        clientRef.current?.sendGamepadButton(xinputFlag, true);
      },
      onTouchEnd: (e) => {
        e.preventDefault();
        setPressed(false);
        clientRef.current?.sendGamepadButton(xinputFlag, false);
      },
      onTouchCancel: (e) => {
        e.preventDefault();
        setPressed(false);
        clientRef.current?.sendGamepadButton(xinputFlag, false);
      },
      children: label
    }
  );
}
function TouchGamepad({ clientRef, visible }) {
  if (!visible) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tgp", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tgp-side tgp-side--left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tgp-shoulders", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoulderButton, { label: "LT", xinputFlag: GAMEPAD_LB, clientRef }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoulderButton, { label: "LB", xinputFlag: GAMEPAD_LB, clientRef })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tgp-lower-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dpad, { clientRef }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Thumbstick, { side: "left", clientRef })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tgp-centre-cluster", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CentreButton, { label: "☰", xinputFlag: GAMEPAD_BACK, clientRef }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CentreButton, { label: "▶", xinputFlag: GAMEPAD_START, clientRef })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tgp-side tgp-side--right", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tgp-shoulders", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoulderButton, { label: "RB", xinputFlag: GAMEPAD_RB, clientRef }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoulderButton, { label: "RT", xinputFlag: GAMEPAD_RB, clientRef })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tgp-lower-right", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Thumbstick, { side: "right", clientRef }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tgp-face", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FaceButton, { label: "Y", color: "#f5c518", xinputFlag: GAMEPAD_Y, clientRef }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tgp-face-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FaceButton, { label: "X", color: "#5b9bd5", xinputFlag: GAMEPAD_X, clientRef }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FaceButton, { label: "B", color: "#e05c5c", xinputFlag: GAMEPAD_B, clientRef })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FaceButton, { label: "A", color: "#58d98a", xinputFlag: GAMEPAD_A, clientRef })
        ] })
      ] })
    ] })
  ] });
}
const TAP_MOVE_THRESHOLD_PX = 8;
const TAP_MAX_DURATION_MS = 300;
const DOUBLE_TAP_WINDOW_MS = 350;
class TouchInputHandler {
  video;
  client;
  // Per-identifier touch state (supports up to 2 fingers).
  touches = /* @__PURE__ */ new Map();
  // Timestamp of the last tap (for double-tap detection).
  lastTapTimeMs = 0;
  // Whether a left-mouse-button-down was sent (so we can always send the matching up).
  leftButtonDown = false;
  rightButtonDown = false;
  // Cleanup functions registered on install.
  cleanups = [];
  constructor(video, client2) {
    this.video = video;
    this.client = client2;
    this.install();
  }
  // Public helpers (called by the on-screen gamepad component)
  /** Send an on-screen button press (XInput button flag). */
  pressButton(xinputFlag) {
    this.client.sendGamepadButton(xinputFlag, true);
  }
  releaseButton(xinputFlag) {
    this.client.sendGamepadButton(xinputFlag, false);
  }
  setStick(side, x, y) {
    this.client.sendGamepadStick(side, x, y);
  }
  // Installation / teardown
  install() {
    const opts = { passive: false };
    const onStart = (e) => this.onTouchStart(e);
    const onMove = (e) => this.onTouchMove(e);
    const onEnd = (e) => this.onTouchEnd(e);
    const onCancel = (e) => this.onTouchCancel(e);
    this.video.addEventListener("touchstart", onStart, opts);
    this.video.addEventListener("touchmove", onMove, opts);
    this.video.addEventListener("touchend", onEnd, opts);
    this.video.addEventListener("touchcancel", onCancel, opts);
    this.cleanups.push(
      () => this.video.removeEventListener("touchstart", onStart),
      () => this.video.removeEventListener("touchmove", onMove),
      () => this.video.removeEventListener("touchend", onEnd),
      () => this.video.removeEventListener("touchcancel", onCancel)
    );
  }
  dispose() {
    for (const fn of this.cleanups.splice(0)) fn();
    this.releaseAllButtons();
  }
  releaseAllButtons() {
    if (this.leftButtonDown) {
      this.client.sendMouseButtonUp(1);
      this.leftButtonDown = false;
    }
    if (this.rightButtonDown) {
      this.client.sendMouseButtonUp(3);
      this.rightButtonDown = false;
    }
  }
  // Touch event handlers
  onTouchStart(e) {
    e.preventDefault();
    for (const touch of Array.from(e.changedTouches)) {
      this.touches.set(touch.identifier, {
        startX: touch.clientX,
        startY: touch.clientY,
        lastX: touch.clientX,
        lastY: touch.clientY,
        startTimeMs: Date.now(),
        moved: false
      });
    }
  }
  onTouchMove(e) {
    e.preventDefault();
    if (e.touches.length === 2) {
      this.handleTwoFingerScroll(e);
      return;
    }
    const touch = e.changedTouches[0];
    if (!touch) return;
    const state = this.touches.get(touch.identifier);
    if (!state) return;
    const dx = touch.clientX - state.lastX;
    const dy = touch.clientY - state.lastY;
    const dist = Math.sqrt(
      (touch.clientX - state.startX) ** 2 + (touch.clientY - state.startY) ** 2
    );
    if (dist > TAP_MOVE_THRESHOLD_PX) {
      state.moved = true;
    }
    state.lastX = touch.clientX;
    state.lastY = touch.clientY;
    const scale = 0.7;
    this.client.sendRelativeMouseMove(
      Math.round(dx * scale),
      Math.round(dy * scale)
    );
  }
  onTouchEnd(e) {
    e.preventDefault();
    for (const touch of Array.from(e.changedTouches)) {
      const state = this.touches.get(touch.identifier);
      if (!state) continue;
      const duration = Date.now() - state.startTimeMs;
      const wasTap = !state.moved && duration < TAP_MAX_DURATION_MS;
      if (wasTap) {
        this.handleTap();
      }
      this.touches.delete(touch.identifier);
    }
  }
  onTouchCancel(e) {
    for (const touch of Array.from(e.changedTouches)) {
      this.touches.delete(touch.identifier);
    }
    this.releaseAllButtons();
  }
  // Gesture interpretation
  handleTap() {
    const now2 = Date.now();
    const sinceLastTap = now2 - this.lastTapTimeMs;
    this.lastTapTimeMs = now2;
    if (sinceLastTap < DOUBLE_TAP_WINDOW_MS) {
      this.client.sendMouseButtonDown(3);
      this.rightButtonDown = true;
      setTimeout(() => {
        this.client.sendMouseButtonUp(3);
        this.rightButtonDown = false;
      }, 80);
    } else {
      this.client.sendMouseButtonDown(1);
      this.leftButtonDown = true;
      setTimeout(() => {
        this.client.sendMouseButtonUp(1);
        this.leftButtonDown = false;
      }, 80);
    }
  }
  handleTwoFingerScroll(e) {
    const t1 = e.touches[0];
    const t2 = e.touches[1];
    if (!t1 || !t2) return;
    const s1 = this.touches.get(t1.identifier);
    const s2 = this.touches.get(t2.identifier);
    if (!s1 || !s2) return;
    const avgDy = (t1.clientY - s1.lastY + (t2.clientY - s2.lastY)) / 2;
    s1.lastX = t1.clientX;
    s1.lastY = t1.clientY;
    s2.lastX = t2.clientX;
    s2.lastY = t2.clientY;
    if (Math.abs(avgDy) > 1) {
      this.client.sendMouseWheel(Math.round(-avgDy * 3));
    }
  }
}
function extractPublicIp(hostOrIp) {
  if (!hostOrIp) return null;
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostOrIp)) {
    return hostOrIp;
  }
  const firstLabel = hostOrIp.split(".")[0] ?? "";
  const parts = firstLabel.split("-");
  if (parts.length === 4 && parts.every((p) => /^\d{1,3}$/.test(p))) {
    return parts.join(".");
  }
  return null;
}
function fixServerIp(sdp, serverIp) {
  const ip = extractPublicIp(serverIp);
  if (!ip) {
    console.log(`[SDP] fixServerIp: could not extract IP from "${serverIp}"`);
    return sdp;
  }
  const cCount = (sdp.match(/c=IN IP4 0\.0\.0\.0/g) ?? []).length;
  let fixed = sdp.replace(/c=IN IP4 0\.0\.0\.0/g, `c=IN IP4 ${ip}`);
  console.log(`[SDP] fixServerIp: replaced ${cCount} c= lines with ${ip}`);
  const candidateCount = (fixed.match(/(a=candidate:\S+\s+\d+\s+\w+\s+\d+\s+)0\.0\.0\.0(\s+)/g) ?? []).length;
  if (candidateCount > 0) {
    fixed = fixed.replace(
      /(a=candidate:\S+\s+\d+\s+\w+\s+\d+\s+)0\.0\.0\.0(\s+)/g,
      `$1${ip}$2`
    );
    console.log(`[SDP] fixServerIp: replaced ${candidateCount} a=candidate lines with ${ip}`);
  }
  return fixed;
}
function extractIceUfragFromOffer(sdp) {
  const match = sdp.match(/a=ice-ufrag:([^\r\n]+)/);
  return match?.[1]?.trim() ?? "";
}
function extractIceCredentials(sdp) {
  const ufrag = sdp.split(/\r?\n/).find((line) => line.startsWith("a=ice-ufrag:"))?.replace("a=ice-ufrag:", "").trim();
  const pwd = sdp.split(/\r?\n/).find((line) => line.startsWith("a=ice-pwd:"))?.replace("a=ice-pwd:", "").trim();
  const fingerprint = sdp.split(/\r?\n/).find((line) => line.startsWith("a=fingerprint:sha-256 "))?.replace("a=fingerprint:sha-256 ", "").trim();
  return {
    ufrag: ufrag ?? "",
    pwd: pwd ?? "",
    fingerprint: fingerprint ?? ""
  };
}
function normalizeCodec(name) {
  const upper = name.toUpperCase();
  return upper === "HEVC" ? "H265" : upper;
}
function rewriteH265TierFlag(sdp, tierFlag) {
  const lineEnding = sdp.includes("\r\n") ? "\r\n" : "\n";
  const lines = sdp.split(/\r?\n/);
  const h265Payloads = /* @__PURE__ */ new Set();
  let inVideoSection = false;
  for (const line of lines) {
    if (line.startsWith("m=video")) {
      inVideoSection = true;
      continue;
    }
    if (line.startsWith("m=") && inVideoSection) {
      inVideoSection = false;
    }
    if (!inVideoSection || !line.startsWith("a=rtpmap:")) {
      continue;
    }
    const [, rest = ""] = line.split(":", 2);
    const [pt = "", codecPart = ""] = rest.split(/\s+/, 2);
    const codecName = normalizeCodec((codecPart.split("/")[0] ?? "").trim());
    if (pt && codecName === "H265") {
      h265Payloads.add(pt);
    }
  }
  if (h265Payloads.size === 0) {
    return { sdp, replacements: 0 };
  }
  let replacements = 0;
  const rewritten = lines.map((line) => {
    if (!line.startsWith("a=fmtp:")) {
      return line;
    }
    const [, rest = ""] = line.split(":", 2);
    const [pt = ""] = rest.split(/\s+/, 1);
    if (!pt || !h265Payloads.has(pt)) {
      return line;
    }
    const next = line.replace(/tier-flag=1/gi, `tier-flag=${tierFlag}`);
    if (next !== line) {
      replacements += 1;
    }
    return next;
  });
  return {
    sdp: rewritten.join(lineEnding),
    replacements
  };
}
function rewriteH265LevelIdByProfile(sdp, maxLevelByProfile) {
  const lineEnding = sdp.includes("\r\n") ? "\r\n" : "\n";
  const lines = sdp.split(/\r?\n/);
  const h265Payloads = /* @__PURE__ */ new Set();
  let inVideoSection = false;
  for (const line of lines) {
    if (line.startsWith("m=video")) {
      inVideoSection = true;
      continue;
    }
    if (line.startsWith("m=") && inVideoSection) {
      inVideoSection = false;
    }
    if (!inVideoSection || !line.startsWith("a=rtpmap:")) {
      continue;
    }
    const [, rest = ""] = line.split(":", 2);
    const [pt = "", codecPart = ""] = rest.split(/\s+/, 2);
    const codecName = normalizeCodec((codecPart.split("/")[0] ?? "").trim());
    if (pt && codecName === "H265") {
      h265Payloads.add(pt);
    }
  }
  if (h265Payloads.size === 0) {
    return { sdp, replacements: 0 };
  }
  let replacements = 0;
  const rewritten = lines.map((line) => {
    if (!line.startsWith("a=fmtp:")) {
      return line;
    }
    const [, rest = ""] = line.split(":", 2);
    const [pt = "", params = ""] = rest.split(/\s+/, 2);
    if (!pt || !params || !h265Payloads.has(pt)) {
      return line;
    }
    const profileMatch = params.match(/(?:^|;)\s*profile-id=(\d+)/i);
    const levelMatch = params.match(/(?:^|;)\s*level-id=(\d+)/i);
    if (!profileMatch?.[1] || !levelMatch?.[1]) {
      return line;
    }
    const profileNum = Number.parseInt(profileMatch[1], 10);
    const offeredLevel = Number.parseInt(levelMatch[1], 10);
    const maxLevel = maxLevelByProfile[profileNum];
    if (!Number.isFinite(offeredLevel) || !maxLevel || offeredLevel <= maxLevel) {
      return line;
    }
    const next = line.replace(/(level-id=)(\d+)/i, `$1${maxLevel}`);
    if (next !== line) {
      replacements += 1;
    }
    return next;
  });
  return {
    sdp: rewritten.join(lineEnding),
    replacements
  };
}
function preferCodec(sdp, codec, options) {
  console.log(`[SDP] preferCodec: filtering SDP for codec "${codec}"`);
  const lineEnding = sdp.includes("\r\n") ? "\r\n" : "\n";
  const lines = sdp.split(/\r?\n/);
  let inVideoSection = false;
  const payloadTypesByCodec = /* @__PURE__ */ new Map();
  const codecByPayloadType = /* @__PURE__ */ new Map();
  const rtxAptByPayloadType = /* @__PURE__ */ new Map();
  const fmtpByPayloadType = /* @__PURE__ */ new Map();
  for (const line of lines) {
    if (line.startsWith("m=video")) {
      inVideoSection = true;
      continue;
    }
    if (line.startsWith("m=") && inVideoSection) {
      inVideoSection = false;
    }
    if (!inVideoSection || !line.startsWith("a=rtpmap:")) {
      continue;
    }
    const [, rest = ""] = line.split("a=rtpmap:");
    const [pt, codecPart] = rest.split(/\s+/, 2);
    const codecName = normalizeCodec((codecPart ?? "").split("/")[0] ?? "");
    if (!pt || !codecName) {
      continue;
    }
    const list = payloadTypesByCodec.get(codecName) ?? [];
    list.push(pt);
    payloadTypesByCodec.set(codecName, list);
    codecByPayloadType.set(pt, codecName);
    continue;
  }
  inVideoSection = false;
  for (const line of lines) {
    if (line.startsWith("m=video")) {
      inVideoSection = true;
      continue;
    }
    if (line.startsWith("m=") && inVideoSection) {
      inVideoSection = false;
    }
    if (!inVideoSection || !line.startsWith("a=fmtp:")) {
      continue;
    }
    const [, rest = ""] = line.split(":", 2);
    const [pt = "", params = ""] = rest.split(/\s+/, 2);
    if (!pt || !params) {
      continue;
    }
    const aptMatch = params.match(/(?:^|;)\s*apt=(\d+)/i);
    if (aptMatch?.[1]) {
      rtxAptByPayloadType.set(pt, aptMatch[1]);
    }
    fmtpByPayloadType.set(pt, params);
  }
  for (const [name, pts] of payloadTypesByCodec.entries()) {
    console.log(`[SDP] preferCodec: found codec ${name} with payload types [${pts.join(", ")}]`);
  }
  const preferredPayloads = payloadTypesByCodec.get(codec) ?? [];
  if (preferredPayloads.length === 0) {
    console.log(`[SDP] preferCodec: codec "${codec}" NOT found in offer — returning SDP unmodified`);
    return sdp;
  }
  const orderedPreferredPayloads = codec === "H265" && options?.preferHevcProfileId ? [...preferredPayloads].sort((a, b) => {
    const pa = fmtpByPayloadType.get(a) ?? "";
    const pb = fmtpByPayloadType.get(b) ?? "";
    const score = (fmtp) => {
      const profile = fmtp.match(/(?:^|;)\s*profile-id=(\d+)/i)?.[1];
      if (profile === String(options.preferHevcProfileId)) return 0;
      if (!profile) return 1;
      return 2;
    };
    return score(pa) - score(pb);
  }) : preferredPayloads;
  const preferred = new Set(orderedPreferredPayloads);
  const allowed = new Set(preferred);
  for (const [rtxPt, apt] of rtxAptByPayloadType.entries()) {
    if (preferred.has(apt) && codecByPayloadType.get(rtxPt) === "RTX") {
      allowed.add(rtxPt);
    }
  }
  console.log(`[SDP] preferCodec: preferred ordered payloads [${orderedPreferredPayloads.join(", ")}] for ${codec}`);
  console.log(`[SDP] preferCodec: keeping payload types [${Array.from(allowed).join(", ")}] for ${codec}`);
  const filtered = [];
  inVideoSection = false;
  for (const line of lines) {
    if (line.startsWith("m=video")) {
      inVideoSection = true;
      const parts = line.split(/\s+/);
      const header = parts.slice(0, 3);
      const available = parts.slice(3).filter((pt) => allowed.has(pt));
      const ordered = [];
      for (const pt of orderedPreferredPayloads) {
        if (available.includes(pt)) {
          ordered.push(pt);
        }
      }
      for (const pt of available) {
        if (!preferred.has(pt)) {
          ordered.push(pt);
        }
      }
      filtered.push(ordered.length > 0 ? [...header, ...ordered].join(" ") : line);
      continue;
    }
    if (line.startsWith("m=") && inVideoSection) {
      inVideoSection = false;
    }
    if (inVideoSection) {
      if (line.startsWith("a=rtpmap:") || line.startsWith("a=fmtp:") || line.startsWith("a=rtcp-fb:")) {
        const [, rest = ""] = line.split(":", 2);
        const [pt = ""] = rest.split(/\s+/, 1);
        if (pt && !allowed.has(pt)) {
          continue;
        }
      }
    }
    filtered.push(line);
  }
  return filtered.join(lineEnding);
}
function mungeAnswerSdp(sdp, maxBitrateKbps) {
  const lineEnding = sdp.includes("\r\n") ? "\r\n" : "\n";
  const lines = sdp.split(/\r?\n/);
  const result = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    result.push(line);
    if (line.startsWith("m=video") || line.startsWith("m=audio")) {
      const bitrateForSection = line.startsWith("m=video") ? maxBitrateKbps : 128;
      const nextLine = lines[i + 1] ?? "";
      if (!nextLine.startsWith("b=")) {
        result.push(`b=AS:${bitrateForSection}`);
      }
    }
    if (line.startsWith("a=fmtp:") && line.includes("minptime=") && !line.includes("stereo=1")) {
      result[result.length - 1] = line + ";stereo=1";
    }
  }
  console.log(`[SDP] mungeAnswerSdp: injected b=AS:${maxBitrateKbps} for video, b=AS:128 for audio, stereo=1 for opus`);
  return result.join(lineEnding);
}
function buildNvstSdp(params) {
  console.log(`[SDP] buildNvstSdp: ${params.width}x${params.height}@${params.fps}fps, codec=${params.codec}, colorQuality=${params.colorQuality}, maxBitrate=${params.maxBitrateKbps}kbps`);
  console.log(`[SDP] buildNvstSdp: ICE ufrag=${params.credentials.ufrag}, pwd=${params.credentials.pwd.slice(0, 8)}..., fingerprint=${params.credentials.fingerprint.slice(0, 20)}...`);
  const minBitrate = Math.max(5e3, Math.floor(params.maxBitrateKbps * 0.35));
  const initialBitrate = Math.max(minBitrate, Math.floor(params.maxBitrateKbps * 0.7));
  const isHighFps = params.fps >= 90;
  const is120Fps = params.fps === 120;
  const is240Fps = params.fps >= 240;
  const isAv1 = params.codec === "AV1";
  const bitDepth = params.colorQuality.startsWith("10bit") ? 10 : 8;
  const lines = [
    "v=0",
    "o=SdpTest test_id_13 14 IN IPv4 127.0.0.1",
    "s=-",
    "t=0 0",
    `a=general.icePassword:${params.credentials.pwd}`,
    `a=general.iceUserNameFragment:${params.credentials.ufrag}`,
    `a=general.dtlsFingerprint:${params.credentials.fingerprint}`,
    "m=video 0 RTP/AVP",
    "a=msid:fbc-video-0",
    // FEC settings
    "a=vqos.fec.rateDropWindow:10",
    "a=vqos.fec.minRequiredFecPackets:2",
    "a=vqos.fec.repairMinPercent:5",
    "a=vqos.fec.repairPercent:5",
    "a=vqos.fec.repairMaxPercent:35",
    // DRC — always disabled to allow full bitrate
    "a=vqos.drc.enable:0"
  ];
  lines.push("a=vqos.dfc.enable:0");
  lines.push(
    "a=video.dx9EnableNv12:1",
    "a=video.dx9EnableHdr:1",
    "a=vqos.qpg.enable:1",
    "a=vqos.resControl.qp.qpg.featureSetting:7",
    "a=bwe.useOwdCongestionControl:1",
    "a=video.enableRtpNack:1",
    "a=vqos.bw.txRxLag.minFeedbackTxDeltaMs:200",
    "a=vqos.drc.bitrateIirFilterFactor:18",
    "a=video.packetSize:1140",
    "a=packetPacing.minNumPacketsPerGroup:15"
  );
  if (isHighFps) {
    lines.push(
      "a=bwe.iirFilterFactor:8",
      "a=video.encoderFeatureSetting:47",
      "a=video.encoderPreset:6",
      "a=vqos.resControl.cpmRtc.badNwSkipFramesCount:600",
      "a=vqos.resControl.cpmRtc.decodeTimeThresholdMs:9",
      `a=video.fbcDynamicFpsGrabTimeoutMs:${is120Fps ? 6 : 18}`,
      `a=vqos.resControl.cpmRtc.serverResolutionUpdateCoolDownCount:${is120Fps ? 6e3 : 12e3}`
    );
  }
  if (is240Fps) {
    lines.push(
      "a=video.enableNextCaptureMode:1",
      "a=vqos.maxStreamFpsEstimate:240",
      "a=video.videoSplitEncodeStripsPerFrame:3",
      "a=video.updateSplitEncodeStateDynamically:1"
    );
  }
  lines.push(
    "a=vqos.adjustStreamingFpsDuringOutOfFocus:1",
    "a=vqos.resControl.cpmRtc.ignoreOutOfFocusWindowState:1",
    "a=vqos.resControl.perfHistory.rtcIgnoreOutOfFocusWindowState:1",
    // Disable CPM-based resolution changes (prevents SSRC switches)
    "a=vqos.resControl.cpmRtc.featureMask:0",
    "a=vqos.resControl.cpmRtc.enable:0",
    // Never scale down resolution
    "a=vqos.resControl.cpmRtc.minResolutionPercent:100",
    // Infinite cooldown to prevent resolution changes
    "a=vqos.resControl.cpmRtc.resolutionChangeHoldonMs:999999",
    // Packet pacing
    `a=packetPacing.numGroups:${is120Fps ? 3 : 5}`,
    "a=packetPacing.maxDelayUs:1000",
    "a=packetPacing.minNumPacketsFrame:10",
    // NACK queue settings
    "a=video.rtpNackQueueLength:1024",
    "a=video.rtpNackQueueMaxPackets:512",
    "a=video.rtpNackMaxPacketCount:25",
    // Resolution/quality thresholds — high values prevent downscaling
    "a=vqos.drc.qpMaxResThresholdAdj:4",
    "a=vqos.grc.qpMaxResThresholdAdj:4",
    "a=vqos.drc.iirFilterFactor:100"
  );
  if (isAv1) {
    lines.push(
      "a=vqos.drc.minQpHeadroom:20",
      "a=vqos.drc.lowerQpThreshold:100",
      "a=vqos.drc.upperQpThreshold:200",
      "a=vqos.drc.minAdaptiveQpThreshold:180",
      "a=vqos.drc.qpCodecThresholdAdj:0",
      // official client scales this up for AV1
      "a=vqos.drc.qpMaxResThresholdAdj:20",
      // mirror to DFC/GRC
      "a=vqos.dfc.minQpHeadroom:20",
      "a=vqos.dfc.qpLowerLimit:100",
      "a=vqos.dfc.qpMaxUpperLimit:200",
      "a=vqos.dfc.qpMinUpperLimit:180",
      "a=vqos.dfc.qpMaxResThresholdAdj:20",
      "a=vqos.dfc.qpCodecThresholdAdj:0",
      "a=vqos.grc.minQpHeadroom:20",
      "a=vqos.grc.lowerQpThreshold:100",
      "a=vqos.grc.upperQpThreshold:200",
      "a=vqos.grc.minAdaptiveQpThreshold:180",
      "a=vqos.grc.qpMaxResThresholdAdj:20",
      "a=vqos.grc.qpCodecThresholdAdj:0",
      "a=video.minQp:25",
      // official client can enable this for AV1 depending on resolution class
      "a=video.enableAv1RcPrecisionFactor:1"
    );
  }
  lines.push(
    `a=video.clientViewportWd:${params.width}`,
    `a=video.clientViewportHt:${params.height}`,
    `a=video.maxFPS:${params.fps}`,
    `a=video.initialBitrateKbps:${initialBitrate}`,
    `a=video.initialPeakBitrateKbps:${params.maxBitrateKbps}`,
    `a=vqos.bw.maximumBitrateKbps:${params.maxBitrateKbps}`,
    `a=vqos.bw.minimumBitrateKbps:${minBitrate}`,
    `a=vqos.bw.peakBitrateKbps:${params.maxBitrateKbps}`,
    `a=vqos.bw.serverPeakBitrateKbps:${params.maxBitrateKbps}`,
    "a=vqos.bw.enableBandwidthEstimation:1",
    "a=vqos.bw.disableBitrateLimit:0",
    // GRC — disabled
    `a=vqos.grc.maximumBitrateKbps:${params.maxBitrateKbps}`,
    "a=vqos.grc.enable:0",
    // Encoder settings
    "a=video.maxNumReferenceFrames:4",
    "a=video.mapRtpTimestampsToFrames:1",
    "a=video.encoderCscMode:3",
    "a=video.dynamicRangeMode:0",
    `a=video.bitDepth:${bitDepth}`,
    // Disable server-side scaling and prefilter (prevents resolution downgrade)
    `a=video.scalingFeature1:${isAv1 ? 1 : 0}`,
    "a=video.prefilterParams.prefilterModel:0",
    // Audio track (receive-only from server)
    "m=audio 0 RTP/AVP",
    "a=msid:audio",
    // Mic track (send to server)
    "m=mic 0 RTP/AVP",
    "a=msid:mic",
    "a=rtpmap:0 PCMU/8000",
    // Input/application track
    "m=application 0 RTP/AVP",
    "a=msid:input_1",
    `a=ri.partialReliableThresholdMs:${params.partialReliableThresholdMs}`,
    ""
  );
  return lines.join("\n");
}
class MicrophoneManager {
  micStream = null;
  placeholderStream = null;
  currentState = "uninitialized";
  pc = null;
  micSender = null;
  deviceId = "";
  onStateChangeCallback = null;
  sampleRate = 48e3;
  // Official client uses 48kHz
  // Track if we should auto-retry with different devices on failure
  attemptedDevices = /* @__PURE__ */ new Set();
  /**
   * Check if microphone is supported in this browser
   */
  static isSupported() {
    return !!(navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === "function" && typeof navigator.mediaDevices.enumerateDevices === "function");
  }
  /**
   * Check microphone permission state without prompting
   */
  async checkPermissionState() {
    if (!navigator.permissions) {
      return null;
    }
    try {
      const result = await navigator.permissions.query({ name: "microphone" });
      return result.state;
    } catch {
      return null;
    }
  }
  /**
   * Set callback for state changes
   */
  setOnStateChange(callback) {
    this.onStateChangeCallback = callback;
  }
  /**
   * Get current microphone state
   */
  getState() {
    return this.currentState;
  }
  /**
   * Set the peer connection to use for adding mic tracks
   */
  setPeerConnection(pc) {
    this.pc = pc;
  }
  /**
   * Attach microphone sender to the peer connection.
   * If real mic is not ready yet, arm a silent placeholder so m=audio(mid=3)
   * negotiates as sendrecv/sendonly in the initial answer.
   */
  async attachTrackToPeerConnection() {
    if (!this.pc) {
      return;
    }
    const track2 = this.micStream?.getAudioTracks()[0];
    if (!track2) {
      await this.ensurePlaceholderSender();
      return;
    }
    await this.addTrackToPeerConnection(track2);
  }
  /**
   * Set device ID to use (empty = default)
   */
  setDeviceId(deviceId) {
    this.deviceId = deviceId;
  }
  /**
   * Enumerate available audio input devices
   */
  async enumerateDevices() {
    try {
      const tempStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      tempStream.getTracks().forEach((track2) => track2.stop());
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter((device) => device.kind === "audioinput");
    } catch {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return devices.filter((device) => device.kind === "audioinput");
      } catch {
        return [];
      }
    }
  }
  /**
   * Initialize microphone with specified device
   */
  async initialize() {
    if (!MicrophoneManager.isSupported()) {
      this.setState("unsupported");
      return false;
    }
    const permission = await this.checkPermissionState();
    if (permission === "denied") {
      this.setState("permission_denied");
      return false;
    }
    this.setState("permission_pending");
    this.attemptedDevices.clear();
    try {
      await this.startCapture();
      return true;
    } catch (error) {
      console.error("[Microphone] Failed to initialize:", error);
      return false;
    }
  }
  /**
   * Start microphone capture
   */
  async startCapture() {
    const constraints = {
      audio: {
        sampleRate: { ideal: this.sampleRate },
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        channelCount: 1
      }
    };
    if (this.deviceId) {
      constraints.audio.deviceId = { exact: this.deviceId };
    }
    try {
      this.micStream = await navigator.mediaDevices.getUserMedia(constraints);
      const track2 = this.micStream.getAudioTracks()[0];
      if (!track2) {
        throw new Error("No audio track available");
      }
      track2.onended = () => {
        console.log("[Microphone] Track ended");
        this.stop();
      };
      this.micStream.addEventListener("inactive", () => {
        console.log("[Microphone] Stream inactive");
        this.attemptedDevices.clear();
        this.micStream = null;
      });
      if (this.pc) {
        await this.addTrackToPeerConnection(track2);
      }
      this.setState("started", track2.label);
    } catch (error) {
      await this.handleCaptureError(error, constraints);
    }
  }
  /**
   * Handle capture errors with fallback logic
   */
  async handleCaptureError(error, constraints) {
    const deviceId = constraints.audio?.deviceId;
    const attemptedDevice = typeof deviceId === "object" && "exact" in deviceId ? deviceId.exact : "default";
    if (error instanceof DOMException) {
      switch (error.name) {
        case "NotAllowedError":
          console.error("[Microphone] Permission denied");
          this.setState("permission_denied");
          throw error;
        case "NotFoundError":
          console.error("[Microphone] No suitable device found");
          this.setState("no_suitable_device");
          throw error;
        case "NotReadableError":
          this.attemptedDevices.add(attemptedDevice);
          console.warn("[Microphone] Device not readable, trying alternative:", attemptedDevice);
          try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const audioInputs = devices.filter((d) => d.kind === "audioinput" && !this.attemptedDevices.has(d.deviceId));
            if (audioInputs.length > 0 && audioInputs[0]?.deviceId) {
              console.log("[Microphone] Trying device:", audioInputs[0].label);
              this.deviceId = audioInputs[0].deviceId;
              await this.startCapture();
              return;
            }
          } catch (enumError) {
            console.error("[Microphone] Enumerate devices failed:", enumError);
          }
          this.setState("error");
          throw error;
        case "OverconstrainedError":
          console.warn("[Microphone] Constraints not supported, trying with basic constraints");
          try {
            this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const track2 = this.micStream.getAudioTracks()[0];
            if (this.pc && track2) {
              await this.addTrackToPeerConnection(track2);
            }
            this.setState("started", track2?.label);
            return;
          } catch (fallbackError) {
            this.setState("error");
            throw fallbackError;
          }
        default:
          console.error("[Microphone] Capture error:", error.name, error.message);
          this.setState("error");
          throw error;
      }
    }
    this.setState("error");
    throw error;
  }
  /**
   * Add audio track to peer connection
   */
  async addTrackToPeerConnection(track2) {
    if (!this.pc) {
      console.warn("[Microphone] No peer connection available");
      return;
    }
    const transceivers = this.pc.getTransceivers();
    const audioTransceivers = transceivers.filter((t) => {
      const receiverKind = t.receiver?.track?.kind;
      const senderKind = t.sender?.track?.kind;
      return receiverKind === "audio" || senderKind === "audio";
    });
    const micTransceiver = audioTransceivers.find((t) => t.mid === "3") ?? audioTransceivers.find((t) => !t.sender.track) ?? audioTransceivers.find(
      (t) => t.direction === "sendrecv" || t.direction === "recvonly" || t.direction === "inactive"
    );
    if (micTransceiver) {
      if (micTransceiver.direction === "recvonly") {
        micTransceiver.direction = "sendrecv";
      } else if (micTransceiver.direction === "inactive") {
        micTransceiver.direction = "sendonly";
      }
      console.log("[Microphone] Attaching track to mic transceiver", micTransceiver.mid ?? "(no mid)");
      await micTransceiver.sender.replaceTrack(track2);
      this.micSender = micTransceiver.sender;
      return;
    }
    const senders = this.pc.getSenders();
    const existingAudioSender = senders.find((s) => s.track?.kind === "audio");
    if (existingAudioSender) {
      console.log("[Microphone] Replacing existing audio track");
      await existingAudioSender.replaceTrack(track2);
      this.micSender = existingAudioSender;
    } else {
      console.warn("[Microphone] No negotiated audio sender found; adding new track (may require renegotiation)");
      this.micSender = this.pc.addTrack(track2, new MediaStream([track2]));
    }
  }
  /**
   * Ensure a negotiated sender exists even before mic permission/capture succeeds.
   * This mirrors official behavior: seed sender with a silent track, then replaceTrack(realMic).
   */
  async ensurePlaceholderSender() {
    if (!this.pc) {
      return;
    }
    const placeholderTrack = this.getOrCreatePlaceholderTrack();
    if (!placeholderTrack) {
      console.warn("[Microphone] Failed to create placeholder mic track");
      return;
    }
    await this.addTrackToPeerConnection(placeholderTrack);
  }
  getOrCreatePlaceholderTrack() {
    let track2 = this.placeholderStream?.getAudioTracks()[0] ?? null;
    if (track2) {
      return track2;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      return null;
    }
    try {
      const ctx = new AudioCtx({ sampleRate: this.sampleRate });
      const destination = ctx.createMediaStreamDestination();
      track2 = destination.stream.getAudioTracks()[0] ?? null;
      void ctx.close();
      if (!track2) {
        return null;
      }
      track2.enabled = true;
      this.placeholderStream = new MediaStream([track2]);
      return track2;
    } catch (error) {
      console.warn("[Microphone] Placeholder stream creation failed:", error);
      return null;
    }
  }
  /**
   * Enable/disable microphone track (mute/unmute)
   */
  setEnabled(enabled) {
    if (!this.micStream) {
      if (enabled && this.currentState !== "started") {
        this.initialize();
      }
      return;
    }
    const track2 = this.micStream.getAudioTracks()[0];
    if (track2) {
      track2.enabled = enabled;
      console.log(`[Microphone] ${enabled ? "Unmuted" : "Muted"}`);
      if (enabled && this.currentState === "stopped") {
        this.setState("started", track2.label);
      } else if (!enabled && this.currentState === "started") {
        this.setState("stopped");
      }
    }
  }
  /**
   * Check if microphone is currently enabled (unmuted)
   */
  isEnabled() {
    if (!this.micStream) return false;
    const track2 = this.micStream.getAudioTracks()[0];
    return track2?.enabled ?? false;
  }
  /**
   * Stop microphone capture
   */
  stop() {
    console.log("[Microphone] Stopping capture");
    if (this.micSender && this.pc) {
      try {
        const placeholderTrack = this.getOrCreatePlaceholderTrack();
        if (placeholderTrack) {
          this.micSender.replaceTrack(placeholderTrack).catch(() => {
          });
        } else {
          this.micSender.replaceTrack(null).catch(() => {
          });
        }
      } catch {
      }
    }
    if (this.micStream) {
      this.micStream.getTracks().forEach((track2) => {
        track2.onended = null;
        track2.stop();
      });
      this.micStream = null;
    }
    this.attemptedDevices.clear();
    this.setState("stopped");
  }
  /**
   * Dispose and cleanup
   */
  dispose() {
    this.stop();
    if (this.placeholderStream) {
      this.placeholderStream.getTracks().forEach((track2) => track2.stop());
      this.placeholderStream = null;
    }
    this.micSender = null;
    this.pc = null;
    this.onStateChangeCallback = null;
  }
  /**
   * Get active microphone track if available
   */
  getTrack() {
    return this.micStream?.getAudioTracks()[0] ?? null;
  }
  /**
   * Update state and notify callback
   */
  setState(state, deviceLabel) {
    if (this.currentState === state) return;
    this.currentState = state;
    console.log(`[Microphone] State changed: ${state}${deviceLabel ? ` (${deviceLabel})` : ""}`);
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback({ state, deviceLabel });
    }
  }
}
const baseCharKeyMap = {
  " ": { vk: 32, scancode: 44 },
  "\n": { vk: 13, scancode: 40 },
  "\r": { vk: 13, scancode: 40 },
  "	": { vk: 9, scancode: 43 },
  "0": { vk: 48, scancode: 39 },
  "1": { vk: 49, scancode: 30 },
  "2": { vk: 50, scancode: 31 },
  "3": { vk: 51, scancode: 32 },
  "4": { vk: 52, scancode: 33 },
  "5": { vk: 53, scancode: 34 },
  "6": { vk: 54, scancode: 35 },
  "7": { vk: 55, scancode: 36 },
  "8": { vk: 56, scancode: 37 },
  "9": { vk: 57, scancode: 38 },
  "-": { vk: 189, scancode: 45 },
  "=": { vk: 187, scancode: 46 },
  "[": { vk: 219, scancode: 47 },
  "]": { vk: 221, scancode: 48 },
  "\\": { vk: 220, scancode: 49 },
  ";": { vk: 186, scancode: 51 },
  "'": { vk: 222, scancode: 52 },
  "`": { vk: 192, scancode: 53 },
  ",": { vk: 188, scancode: 54 },
  ".": { vk: 190, scancode: 55 },
  "/": { vk: 191, scancode: 56 }
};
const shiftedCharKeyMap = {
  "!": { vk: 49, scancode: 30, shift: true },
  "@": { vk: 50, scancode: 31, shift: true },
  "#": { vk: 51, scancode: 32, shift: true },
  "$": { vk: 52, scancode: 33, shift: true },
  "%": { vk: 53, scancode: 34, shift: true },
  "^": { vk: 54, scancode: 35, shift: true },
  "&": { vk: 55, scancode: 36, shift: true },
  "*": { vk: 56, scancode: 37, shift: true },
  "(": { vk: 57, scancode: 38, shift: true },
  ")": { vk: 48, scancode: 39, shift: true },
  "_": { vk: 189, scancode: 45, shift: true },
  "+": { vk: 187, scancode: 46, shift: true },
  "{": { vk: 219, scancode: 47, shift: true },
  "}": { vk: 221, scancode: 48, shift: true },
  "|": { vk: 220, scancode: 49, shift: true },
  ":": { vk: 186, scancode: 51, shift: true },
  '"': { vk: 222, scancode: 52, shift: true },
  "~": { vk: 192, scancode: 53, shift: true },
  "<": { vk: 188, scancode: 54, shift: true },
  ">": { vk: 190, scancode: 55, shift: true },
  "?": { vk: 191, scancode: 56, shift: true }
};
function mapTextCharToKeySpec(char) {
  if (baseCharKeyMap[char]) {
    return baseCharKeyMap[char];
  }
  if (shiftedCharKeyMap[char]) {
    return shiftedCharKeyMap[char];
  }
  if (char >= "a" && char <= "z") {
    const code = char.charCodeAt(0);
    return { vk: code - 32, scancode: 4 + (code - 97) };
  }
  if (char >= "A" && char <= "Z") {
    const code = char.charCodeAt(0);
    return { vk: code, scancode: 4 + (code - 65), shift: true };
  }
  return null;
}
function hevcPreferredProfileId(colorQuality) {
  return colorQuality.startsWith("10bit") ? 2 : 1;
}
function timestampUs(sourceTimestampMs) {
  const base = typeof sourceTimestampMs === "number" && Number.isFinite(sourceTimestampMs) && sourceTimestampMs >= 0 ? sourceTimestampMs : performance.now();
  return BigInt(Math.floor(base * 1e3));
}
function parsePartialReliableThresholdMs(sdp) {
  const match = sdp.match(/a=ri\.partialReliableThresholdMs:(\d+)/i);
  if (!match?.[1]) {
    return null;
  }
  const parsed = Number.parseInt(match[1], 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return Math.max(1, Math.min(5e3, parsed));
}
class MouseDeltaFilter {
  x = 0;
  y = 0;
  lastTsMs = 0;
  velocityX = 0;
  velocityY = 0;
  rejectedX = 0;
  rejectedY = 0;
  pendingX = 0;
  pendingY = 0;
  sawZero = false;
  getX() {
    return this.x;
  }
  getY() {
    return this.y;
  }
  reset() {
    this.x = 0;
    this.y = 0;
    this.lastTsMs = 0;
    this.velocityX = 0;
    this.velocityY = 0;
    this.rejectedX = 0;
    this.rejectedY = 0;
    this.pendingX = 0;
    this.pendingY = 0;
    this.sawZero = false;
  }
  update(dx, dy, tsMs) {
    if (dx === 0 && dy === 0) {
      if (this.sawZero) {
        this.pendingX = 0;
        this.pendingY = 0;
      } else {
        this.sawZero = true;
      }
      return false;
    }
    this.sawZero = false;
    if (this.pendingX === 0 && this.pendingY === 0) {
      if (tsMs < this.lastTsMs) {
        this.pendingX = dx;
        this.pendingY = dy;
        return false;
      }
    } else {
      dx += this.pendingX;
      dy += this.pendingY;
      this.pendingX = 0;
      this.pendingY = 0;
    }
    const dot = dx * this.x + dy * this.y;
    const magIncoming = dx * dx + dy * dy;
    const magPrev = this.x * this.x + this.y * this.y;
    let accept = true;
    const dtMs = tsMs - this.lastTsMs;
    if (dtMs < 0.95 && dot < 0 && magPrev !== 0 && dot * dot > 0.81 * magIncoming * magPrev) {
      const ratio = Math.sqrt(magIncoming) / Math.sqrt(magPrev);
      let distToInt = Math.abs(ratio - Math.trunc(ratio));
      if (distToInt > 0.5) {
        distToInt = 1 - distToInt;
      }
      if (distToInt < 0.1) {
        accept = false;
      }
    }
    const diffX = dx - this.x;
    const diffY = dy - this.y;
    const diffMag = diffX * diffX + diffY * diffY;
    if (accept) {
      const scale = 1 + 0.1 * Math.max(1, Math.min(16, dtMs));
      const vx2 = 2 * scale * Math.abs(this.velocityX);
      const vy2 = 2 * scale * Math.abs(this.velocityY);
      const threshold = Math.max(8100, vx2 * vx2 + vy2 * vy2);
      accept = diffMag < threshold;
      if (!accept && (this.rejectedX !== 0 || this.rejectedY !== 0)) {
        const rx = dx - this.rejectedX;
        const ry = dy - this.rejectedY;
        accept = rx * rx + ry * ry < threshold;
      }
    }
    if (accept) {
      this.velocityX = 0.4 * this.velocityX + 0.6 * diffX;
      this.velocityY = 0.4 * this.velocityY + 0.6 * diffY;
      this.x = dx;
      this.y = dy;
      this.lastTsMs = tsMs;
      this.rejectedX = 0;
      this.rejectedY = 0;
      return true;
    }
    this.rejectedX = dx;
    this.rejectedY = dy;
    return false;
  }
}
function parseResolution(resolution) {
  const [rawWidth, rawHeight] = resolution.split("x");
  const width = Number.parseInt(rawWidth ?? "", 10);
  const height = Number.parseInt(rawHeight ?? "", 10);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return { width: 1920, height: 1080 };
  }
  return { width, height };
}
function toRtcIceServers(iceServers) {
  return iceServers.map((server) => ({
    urls: server.urls,
    username: server.username,
    credential: server.credential
  }));
}
async function toBytes(data) {
  if (typeof data === "string") {
    return new TextEncoder().encode(data);
  }
  if (data instanceof ArrayBuffer) {
    return new Uint8Array(data);
  }
  const arrayBuffer = await data.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}
function detectGpuType() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) {
      return "Unknown";
    }
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (debugInfo) {
      const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      let gpuName = renderer;
      gpuName = gpuName.replace(/\(R\)/g, "").replace(/\(TM\)/g, "").replace(/NVIDIA /i, "").replace(/AMD /i, "").replace(/Intel /i, "").replace(/Microsoft Corporation - /i, "").replace(/D3D12 /i, "").replace(/Direct3D11 /i, "").replace(/OpenGL Engine/i, "").trim();
      if (gpuName.length > 30) {
        gpuName = gpuName.substring(0, 27) + "...";
      }
      return gpuName || vendor || "Unknown";
    }
    return "Unknown";
  } catch {
    return "Unknown";
  }
}
function normalizeCodecName(codecId) {
  const upper = codecId.toUpperCase();
  if (upper.startsWith("H264") || upper === "H264") {
    return "H264";
  }
  if (upper.startsWith("H265") || upper === "H265" || upper.startsWith("HEVC")) {
    return "H265";
  }
  if (upper.startsWith("AV1")) {
    return "AV1";
  }
  if (upper.startsWith("VP9") || upper.startsWith("VP09")) {
    return "VP9";
  }
  if (upper.startsWith("VP8")) {
    return "VP8";
  }
  return codecId;
}
class GfnWebRtcClient {
  constructor(options) {
    this.options = options;
    options.videoElement.srcObject = this.videoStream;
    options.audioElement.srcObject = this.audioStream;
    options.audioElement.muted = true;
    this.configureVideoElementForLowLatency(options.videoElement);
    this.gpuType = detectGpuType();
    this.diagnostics.gpuType = this.gpuType;
    const micMode = options.microphoneMode ?? "disabled";
    if (micMode !== "disabled" && MicrophoneManager.isSupported()) {
      this.micManager = new MicrophoneManager();
      this.micManager.setOnStateChange((state) => {
        this.micState = state.state;
        this.diagnostics.micState = state.state;
        this.diagnostics.micEnabled = this.micManager?.isEnabled() ?? false;
        this.emitStats();
        this.options.onMicStateChange?.(state);
      });
      if (options.microphoneDeviceId) {
        this.micManager.setDeviceId(options.microphoneDeviceId);
      }
    }
  }
  videoStream = new MediaStream();
  audioStream = new MediaStream();
  inputEncoder = new InputEncoder();
  pc = null;
  reliableInputChannel = null;
  mouseInputChannel = null;
  controlChannel = null;
  audioContext = null;
  inputReady = false;
  inputProtocolVersion = 2;
  heartbeatTimer = null;
  mouseFlushTimer = null;
  statsTimer = null;
  statsPollInFlight = false;
  gamepadPollTimer = null;
  pendingMouseDx = 0;
  pendingMouseDy = 0;
  inputCleanup = [];
  queuedCandidates = [];
  // Input mode: auto-switches between mouse+keyboard and gamepad
  // When gamepad has activity, mouse/keyboard are suppressed (and vice versa)
  activeInputMode = "mkb";
  // Timestamp of last gamepad state change — used for mode-switch lockout
  lastGamepadActivityMs = 0;
  // Timestamp of last gamepad packet sent — used for keepalive
  lastGamepadSendMs = 0;
  // Gamepad keepalive interval: resend last state every 100ms to keep server controller alive
  static GAMEPAD_KEEPALIVE_MS = 100;
  // How long to wait after last gamepad activity before allowing switch to mkb (seconds)
  // Prevents accidental key/mouse events from disrupting controller gameplay
  static GAMEPAD_MODE_LOCKOUT_MS = 3e3;
  static MOUSE_FLUSH_FAST_MS = 4;
  static MOUSE_FLUSH_NORMAL_MS = 8;
  static MOUSE_FLUSH_SAFE_MS = 16;
  static DEFAULT_PARTIAL_RELIABLE_THRESHOLD_MS = 300;
  static RELIABLE_MOUSE_BACKPRESSURE_BYTES = 64 * 1024;
  static BACKPRESSURE_LOG_INTERVAL_MS = 2e3;
  // Gamepad bitmap: tracks which gamepads are connected, matching official client's this.nu field.
  // Bit i (0-3) = gamepad i is connected. Sent in every gamepad packet at offset 8.
  gamepadBitmap = 0;
  // Stats tracking
  lastStatsSample = null;
  renderFpsCounter = { frames: 0, lastUpdate: 0, fps: 0 };
  connectedGamepads = /* @__PURE__ */ new Set();
  previousGamepadStates = /* @__PURE__ */ new Map();
  // Track currently pressed keys (VK codes) for synthetic Escape detection
  pressedKeys = /* @__PURE__ */ new Set();
  // Video element reference for pointer lock re-acquisition
  videoElement = null;
  // Timer for synthetic Escape on pointer lock loss
  pointerLockEscapeTimer = null;
  // Fallback keyup if browser swallows Escape keyup while keyboard lock is active.
  escapeAutoKeyUpTimer = null;
  // True when we already sent an immediate Escape tap for the current physical hold.
  escapeTapDispatchedForCurrentHold = false;
  // Skip one synthetic Escape when pointer lock was intentionally released via hold.
  suppressNextSyntheticEscape = false;
  // Hold Escape for 4 seconds to intentionally release mouse lock
  escapeHoldReleaseTimer = null;
  escapeHoldIndicatorDelayTimer = null;
  escapeHoldProgressTimer = null;
  escapeHoldStartedAtMs = null;
  mouseBackpressureLoggedAtMs = 0;
  mouseFlushIntervalMs = GfnWebRtcClient.MOUSE_FLUSH_NORMAL_MS;
  mouseFlushLastTickMs = 0;
  pendingMouseTimestampUs = null;
  mouseDeltaFilter = new MouseDeltaFilter();
  partialReliableThresholdMs = GfnWebRtcClient.DEFAULT_PARTIAL_RELIABLE_THRESHOLD_MS;
  inputQueuePeakBufferedBytesWindow = 0;
  inputQueueMaxSchedulingDelayMsWindow = 0;
  inputQueuePressureLoggedAtMs = 0;
  inputQueueDropCount = 0;
  // Microphone
  micManager = null;
  micState = "uninitialized";
  // Stream info
  currentCodec = "";
  currentResolution = "";
  isHdr = false;
  videoDecodeStallWarningSent = false;
  serverRegion = "";
  gpuType = "";
  diagnostics = {
    connectionState: "closed",
    inputReady: false,
    connectedGamepads: 0,
    resolution: "",
    codec: "",
    isHdr: false,
    bitrateKbps: 0,
    decodeFps: 0,
    renderFps: 0,
    packetsLost: 0,
    packetsReceived: 0,
    packetLossPercent: 0,
    jitterMs: 0,
    rttMs: 0,
    framesReceived: 0,
    framesDecoded: 0,
    framesDropped: 0,
    decodeTimeMs: 0,
    renderTimeMs: 0,
    jitterBufferDelayMs: 0,
    inputQueueBufferedBytes: 0,
    inputQueuePeakBufferedBytes: 0,
    inputQueueDropCount: 0,
    inputQueueMaxSchedulingDelayMs: 0,
    gpuType: "",
    serverRegion: "",
    micState: "uninitialized",
    micEnabled: false
  };
  /**
   * Configure the video element for minimum latency streaming.
   * Sets attributes that reduce internal buffering and prioritize
   * immediate frame display over smooth playback.
   */
  configureVideoElementForLowLatency(video) {
    video.disableRemotePlayback = true;
    video.disablePictureInPicture = true;
    video.preload = "none";
    video.playbackRate = 1;
    video.defaultPlaybackRate = 1;
    this.log("Video element configured for low-latency playback");
  }
  /**
   * Configure an RTCRtpReceiver for minimum jitter buffer delay.
   *
   * jitterBufferTarget controls how long Chrome holds decoded frames before
   * displaying them. Setting to 0 tells the browser to use the absolute
   * minimum buffer — effectively "display as soon as decoded". This is
   * aggressive but correct for cloud gaming where we prioritize latency
   * over smoothness.
   *
   * The official GFN browser client doesn't set this at all (defaulting to
   * ~100-200ms). As an Electron app we can be more aggressive.
   *
   */
  configureReceiverForLowLatency(receiver, kind) {
    try {
      const targetMs = kind === "video" ? 12 : 20;
      const rawReceiver = receiver;
      if ("jitterBufferTarget" in receiver) {
        rawReceiver.jitterBufferTarget = targetMs;
        this.log(`${kind} receiver: jitterBufferTarget set to ${targetMs}ms`);
      }
      if ("playoutDelayHint" in receiver) {
        const playoutDelaySeconds = kind === "video" ? 0.012 : 0.02;
        rawReceiver.playoutDelayHint = playoutDelaySeconds;
        this.log(`${kind} receiver: playoutDelayHint set to ${playoutDelaySeconds}s`);
      }
      if (kind === "video" && "contentHint" in receiver.track) {
        receiver.track.contentHint = "motion";
      }
    } catch (error) {
      this.log(`Warning: could not apply ${kind} low-latency receiver tuning: ${String(error)}`);
    }
  }
  log(message) {
    this.options.onLog(message);
  }
  emitStats() {
    if (this.options.onStats) {
      this.options.onStats({ ...this.diagnostics });
    }
  }
  resetDiagnostics() {
    this.lastStatsSample = null;
    this.currentCodec = "";
    this.currentResolution = "";
    this.isHdr = false;
    this.videoDecodeStallWarningSent = false;
    this.diagnostics = {
      connectionState: this.pc?.connectionState ?? "closed",
      inputReady: false,
      connectedGamepads: 0,
      resolution: "",
      codec: "",
      isHdr: false,
      bitrateKbps: 0,
      decodeFps: 0,
      renderFps: 0,
      packetsLost: 0,
      packetsReceived: 0,
      packetLossPercent: 0,
      jitterMs: 0,
      rttMs: 0,
      framesReceived: 0,
      framesDecoded: 0,
      framesDropped: 0,
      decodeTimeMs: 0,
      renderTimeMs: 0,
      jitterBufferDelayMs: 0,
      inputQueueBufferedBytes: 0,
      inputQueuePeakBufferedBytes: 0,
      inputQueueDropCount: 0,
      inputQueueMaxSchedulingDelayMs: 0,
      gpuType: this.gpuType,
      serverRegion: this.serverRegion,
      micState: this.micState,
      micEnabled: this.micManager?.isEnabled() ?? false
    };
    this.emitStats();
  }
  resetInputState() {
    this.inputReady = false;
    this.inputProtocolVersion = 2;
    this.inputEncoder.setProtocolVersion(2);
    this.diagnostics.inputReady = false;
    this.emitStats();
  }
  closeDataChannels() {
    if (this.controlChannel) {
      this.controlChannel.onmessage = null;
      this.controlChannel.onclose = null;
      this.controlChannel.onerror = null;
    }
    this.reliableInputChannel?.close();
    this.mouseInputChannel?.close();
    this.controlChannel?.close();
    this.reliableInputChannel = null;
    this.mouseInputChannel = null;
    this.controlChannel = null;
  }
  clearTimers() {
    if (this.heartbeatTimer !== null) {
      window.clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.mouseFlushTimer !== null) {
      window.clearInterval(this.mouseFlushTimer);
      this.mouseFlushTimer = null;
    }
    if (this.statsTimer !== null) {
      window.clearInterval(this.statsTimer);
      this.statsTimer = null;
    }
    if (this.gamepadPollTimer !== null) {
      window.clearInterval(this.gamepadPollTimer);
      this.gamepadPollTimer = null;
    }
  }
  setupStatsPolling() {
    if (this.statsTimer !== null) {
      window.clearInterval(this.statsTimer);
    }
    this.statsTimer = window.setInterval(() => {
      if (this.statsPollInFlight) {
        return;
      }
      this.statsPollInFlight = true;
      void this.collectStats().finally(() => {
        this.statsPollInFlight = false;
      });
    }, 500);
  }
  updateRenderFps() {
    const now2 = performance.now();
    this.renderFpsCounter.frames++;
    if (now2 - this.renderFpsCounter.lastUpdate >= 500) {
      const elapsed = (now2 - this.renderFpsCounter.lastUpdate) / 1e3;
      this.renderFpsCounter.fps = Math.round(this.renderFpsCounter.frames / elapsed);
      this.renderFpsCounter.frames = 0;
      this.renderFpsCounter.lastUpdate = now2;
      this.diagnostics.renderFps = this.renderFpsCounter.fps;
    }
  }
  async collectStats() {
    if (!this.pc) {
      return;
    }
    const report = await this.pc.getStats();
    const now2 = performance.now();
    let inboundVideo = null;
    let activePair = null;
    const codecs = /* @__PURE__ */ new Map();
    for (const entry of report.values()) {
      const stats = entry;
      if (entry.type === "inbound-rtp" && stats.kind === "video") {
        inboundVideo = stats;
      }
      if (entry.type === "candidate-pair") {
        if (stats.state === "succeeded" && stats.nominated === true) {
          activePair = stats;
        }
      }
      if (entry.type === "codec") {
        const codecId = stats.id;
        codecs.set(codecId, stats);
      }
    }
    if (inboundVideo) {
      const bytes = Number(inboundVideo.bytesReceived ?? 0);
      const framesReceived = Number(inboundVideo.framesReceived ?? 0);
      const framesDecoded = Number(inboundVideo.framesDecoded ?? 0);
      const framesDropped = Number(inboundVideo.framesDropped ?? 0);
      const packetsReceived = Number(inboundVideo.packetsReceived ?? 0);
      const packetsLost = Number(inboundVideo.packetsLost ?? 0);
      if (this.lastStatsSample) {
        const bytesDelta = bytes - this.lastStatsSample.bytesReceived;
        const timeDeltaMs = now2 - this.lastStatsSample.atMs;
        if (bytesDelta >= 0 && timeDeltaMs > 0) {
          const kbps = bytesDelta * 8 / (timeDeltaMs / 1e3) / 1e3;
          this.diagnostics.bitrateKbps = Math.max(0, Math.round(kbps));
        }
        const packetsDelta = packetsReceived - this.lastStatsSample.packetsReceived;
        const lostDelta = packetsLost - this.lastStatsSample.packetsLost;
        if (packetsDelta > 0) {
          const totalPackets = packetsDelta + lostDelta;
          this.diagnostics.packetLossPercent = totalPackets > 0 ? lostDelta / totalPackets * 100 : 0;
        }
      }
      this.lastStatsSample = {
        bytesReceived: bytes,
        framesReceived,
        framesDecoded,
        framesDropped,
        packetsReceived,
        packetsLost,
        atMs: now2
      };
      this.diagnostics.framesReceived = framesReceived;
      this.diagnostics.framesDecoded = framesDecoded;
      this.diagnostics.framesDropped = framesDropped;
      if (!this.videoDecodeStallWarningSent && framesReceived > 100 && framesDecoded === 0) {
        this.videoDecodeStallWarningSent = true;
        this.log("Warning: inbound video packets received but 0 frames decoded (decoder stall)");
      }
      this.diagnostics.decodeFps = Math.round(Number(inboundVideo.framesPerSecond ?? 0));
      this.diagnostics.packetsLost = packetsLost;
      this.diagnostics.packetsReceived = packetsReceived;
      this.diagnostics.jitterMs = Math.round(Number(inboundVideo.jitter ?? 0) * 1e3 * 10) / 10;
      const jbDelay = Number(inboundVideo.jitterBufferDelay ?? 0);
      const jbEmitted = Number(inboundVideo.jitterBufferEmittedCount ?? 0);
      if (jbEmitted > 0) {
        this.diagnostics.jitterBufferDelayMs = Math.round(jbDelay / jbEmitted * 1e3 * 10) / 10;
      }
      const codecId = inboundVideo.codecId;
      if (codecId && codecs.has(codecId)) {
        const codecStats = codecs.get(codecId);
        const mimeType = codecStats.mimeType || "";
        const sdpFmtpLine = codecStats.sdpFmtpLine || "";
        if (mimeType.includes("H264")) {
          this.currentCodec = "H264";
        } else if (mimeType.includes("H265") || mimeType.includes("HEVC")) {
          this.currentCodec = "H265";
        } else if (mimeType.includes("AV1")) {
          this.currentCodec = "AV1";
        } else if (mimeType.includes("VP9")) {
          this.currentCodec = "VP9";
        } else if (mimeType.includes("VP8")) {
          this.currentCodec = "VP8";
        } else {
          this.currentCodec = normalizeCodecName(codecId);
        }
        this.isHdr = sdpFmtpLine.includes("transfer-characteristics=16") || sdpFmtpLine.includes("hdr") || sdpFmtpLine.includes("HDR");
        this.diagnostics.codec = this.currentCodec;
        this.diagnostics.isHdr = this.isHdr;
      }
      const videoTrack = this.videoStream.getVideoTracks()[0];
      if (videoTrack) {
        const settings = videoTrack.getSettings();
        if (settings.width && settings.height) {
          this.currentResolution = `${settings.width}x${settings.height}`;
          this.diagnostics.resolution = this.currentResolution;
        }
      }
      const totalDecodeTime = Number(inboundVideo.totalDecodeTime ?? 0);
      const totalInterFrameDelay = Number(inboundVideo.totalInterFrameDelay ?? 0);
      const framesDecodedForTiming = Number(inboundVideo.framesDecoded ?? 1);
      if (framesDecodedForTiming > 0) {
        this.diagnostics.decodeTimeMs = Math.round(totalDecodeTime / framesDecodedForTiming * 1e3 * 10) / 10;
      }
      if (totalInterFrameDelay > 0 && framesDecodedForTiming > 1) {
        const avgFrameDelay = totalInterFrameDelay / (framesDecodedForTiming - 1);
        this.diagnostics.renderTimeMs = Math.round(avgFrameDelay * 1e3 * 10) / 10;
      }
    }
    if (activePair?.currentRoundTripTime !== void 0) {
      const rtt = Number(activePair.currentRoundTripTime);
      this.diagnostics.rttMs = Math.round(rtt * 1e3 * 10) / 10;
    }
    const reliableBufferedAmount = this.reliableInputChannel?.bufferedAmount ?? 0;
    this.inputQueuePeakBufferedBytesWindow = Math.max(
      this.inputQueuePeakBufferedBytesWindow,
      reliableBufferedAmount
    );
    this.diagnostics.inputQueueBufferedBytes = reliableBufferedAmount;
    this.diagnostics.inputQueuePeakBufferedBytes = this.inputQueuePeakBufferedBytesWindow;
    this.diagnostics.inputQueueDropCount = this.inputQueueDropCount;
    this.diagnostics.inputQueueMaxSchedulingDelayMs = Math.round(this.inputQueueMaxSchedulingDelayMsWindow * 10) / 10;
    const shouldLogQueuePressure = reliableBufferedAmount > GfnWebRtcClient.RELIABLE_MOUSE_BACKPRESSURE_BYTES / 2 || this.inputQueueMaxSchedulingDelayMsWindow >= 4 || this.inputQueueDropCount > 0;
    if (shouldLogQueuePressure) {
      const nowMs = performance.now();
      if (nowMs - this.inputQueuePressureLoggedAtMs >= GfnWebRtcClient.BACKPRESSURE_LOG_INTERVAL_MS) {
        this.inputQueuePressureLoggedAtMs = nowMs;
        this.log(
          `Input queue pressure: buffered=${reliableBufferedAmount}B peak=${this.inputQueuePeakBufferedBytesWindow}B drops=${this.inputQueueDropCount} maxSchedDelay=${this.diagnostics.inputQueueMaxSchedulingDelayMs.toFixed(1)}ms`
        );
      }
    }
    this.inputQueuePeakBufferedBytesWindow = reliableBufferedAmount;
    this.inputQueueMaxSchedulingDelayMsWindow = 0;
    this.emitStats();
  }
  detachInputCapture() {
    for (const cleanup of this.inputCleanup.splice(0)) {
      cleanup();
    }
  }
  replaceTrackInStream(stream, track2) {
    const existingTracks = track2.kind === "video" ? stream.getVideoTracks() : stream.getAudioTracks();
    for (const existingTrack of existingTracks) {
      stream.removeTrack(existingTrack);
    }
    stream.addTrack(track2);
  }
  cleanupPeerConnection() {
    this.clearTimers();
    this.detachInputCapture();
    this.closeDataChannels();
    if (this.audioContext) {
      void this.audioContext.close();
      this.audioContext = null;
    }
    this.options.audioElement.pause();
    this.options.audioElement.muted = true;
    if (this.pc) {
      this.pc.onicecandidate = null;
      this.pc.ontrack = null;
      this.pc.onconnectionstatechange = null;
      this.pc.ondatachannel = null;
      this.pc.close();
      this.pc = null;
    }
    for (const track2 of this.videoStream.getTracks()) {
      this.videoStream.removeTrack(track2);
    }
    for (const track2 of this.audioStream.getTracks()) {
      this.audioStream.removeTrack(track2);
    }
    this.resetInputState();
    this.resetDiagnostics();
    this.connectedGamepads.clear();
    this.previousGamepadStates.clear();
    this.gamepadSendCount = 0;
    this.lastGamepadSendMs = 0;
    this.lastGamepadActivityMs = 0;
    this.reliableDropLogged = false;
    this.activeInputMode = "mkb";
    this.gamepadBitmap = 0;
    this.pendingMouseDx = 0;
    this.pendingMouseDy = 0;
    this.pendingMouseTimestampUs = null;
    this.mouseDeltaFilter.reset();
    this.mouseFlushLastTickMs = 0;
    this.inputQueuePeakBufferedBytesWindow = 0;
    this.inputQueueMaxSchedulingDelayMsWindow = 0;
    this.inputQueueDropCount = 0;
    this.inputQueuePressureLoggedAtMs = 0;
    this.inputEncoder.resetGamepadSequences();
  }
  attachTrack(track2) {
    if (track2.kind === "video") {
      this.replaceTrackInStream(this.videoStream, track2);
      const video = this.options.videoElement;
      const frameCallback = () => {
        this.updateRenderFps();
        if (this.videoStream.active) {
          video.requestVideoFrameCallback(frameCallback);
        }
      };
      video.requestVideoFrameCallback(frameCallback);
      this.log(
        `Video element before play: paused=${video.paused}, readyState=${video.readyState}, size=${video.videoWidth}x${video.videoHeight}`
      );
      video.play().then(() => {
        this.log("Video element playback started");
      }).catch((playError) => {
        this.log(`Video play() failed: ${String(playError)}`);
      });
      window.setTimeout(() => {
        this.log(
          `Video element post-play: paused=${video.paused}, readyState=${video.readyState}, size=${video.videoWidth}x${video.videoHeight}`
        );
      }, 1500);
      track2.onunmute = () => {
        this.log("Video track unmuted");
      };
      track2.onmute = () => {
        this.log("Warning: video track muted by sender");
      };
      track2.onended = () => {
        this.log("Warning: video track ended");
      };
      this.log("Video track attached");
      return;
    }
    if (track2.kind === "audio") {
      this.replaceTrackInStream(this.audioStream, track2);
      if (this.audioContext) {
        void this.audioContext.close();
        this.audioContext = null;
      }
      this.options.audioElement.pause();
      this.options.audioElement.muted = true;
      try {
        const ctx = new AudioContext({
          latencyHint: "interactive",
          sampleRate: 48e3
        });
        this.audioContext = ctx;
        const source = ctx.createMediaStreamSource(this.audioStream);
        source.connect(ctx.destination);
        if (ctx.state === "suspended") {
          void ctx.resume();
        }
        this.log(`Audio routed through AudioContext (latency: ${(ctx.baseLatency * 1e3).toFixed(1)}ms, sampleRate: ${ctx.sampleRate}Hz)`);
      } catch (error) {
        this.log(`AudioContext creation failed, falling back to audio element: ${String(error)}`);
        this.options.audioElement.muted = false;
        this.options.audioElement.play().then(() => {
          this.log("Audio track attached (fallback)");
        }).catch((playError) => {
          this.log(`Audio autoplay blocked: ${String(playError)}`);
        });
      }
    }
  }
  async waitForIceGathering(pc, timeoutMs) {
    if (pc.iceGatheringState === "complete" && pc.localDescription?.sdp) {
      return pc.localDescription.sdp;
    }
    await new Promise((resolve) => {
      let settled = false;
      const done = () => {
        if (!settled) {
          settled = true;
          pc.removeEventListener("icegatheringstatechange", onStateChange);
          resolve();
        }
      };
      const onStateChange = () => {
        if (pc.iceGatheringState === "complete") {
          done();
        }
      };
      pc.addEventListener("icegatheringstatechange", onStateChange);
      window.setTimeout(done, timeoutMs);
    });
    const sdp = pc.localDescription?.sdp;
    if (!sdp) {
      throw new Error("Missing local SDP after ICE gathering");
    }
    return sdp;
  }
  setupInputHeartbeat() {
    if (this.heartbeatTimer !== null) {
      window.clearInterval(this.heartbeatTimer);
    }
    this.heartbeatTimer = window.setInterval(() => {
      if (!this.inputReady) {
        return;
      }
      const bytes = this.inputEncoder.encodeHeartbeat();
      this.sendReliable(bytes);
    }, 2e3);
  }
  setupGamepadPolling() {
    if (this.gamepadPollTimer !== null) {
      window.clearInterval(this.gamepadPollTimer);
    }
    this.log("Gamepad polling started (250Hz)");
    this.gamepadPollTimer = window.setInterval(() => {
      if (!this.inputReady) {
        return;
      }
      this.pollGamepads();
    }, 4);
  }
  gamepadSendCount = 0;
  pollGamepads() {
    const gamepads = navigator.getGamepads();
    if (!gamepads) {
      return;
    }
    let connectedCount = 0;
    const nowMs = performance.now();
    for (let i = 0; i < Math.min(gamepads.length, GAMEPAD_MAX_CONTROLLERS); i++) {
      const gamepad = gamepads[i];
      if (gamepad && gamepad.connected) {
        connectedCount++;
        if (!this.connectedGamepads.has(i)) {
          this.connectedGamepads.add(i);
          this.gamepadBitmap |= 1 << i;
          this.log(`Gamepad ${i} connected: ${gamepad.id}`);
          this.log(`  Buttons: ${gamepad.buttons.length}, Axes: ${gamepad.axes.length}, Mapping: ${gamepad.mapping}`);
          this.log(`  Bitmap now: 0x${this.gamepadBitmap.toString(16)}`);
          this.diagnostics.connectedGamepads = this.connectedGamepads.size;
          this.emitStats();
        }
        const gamepadInput = this.readGamepadState(gamepad, i);
        const stateChanged = this.hasGamepadStateChanged(i, gamepadInput);
        const needsKeepalive = this.activeInputMode === "gamepad" && !stateChanged && nowMs - this.lastGamepadSendMs >= GfnWebRtcClient.GAMEPAD_KEEPALIVE_MS;
        if (stateChanged || needsKeepalive) {
          const usePR = this.mouseInputChannel?.readyState === "open";
          const bytes = this.inputEncoder.encodeGamepadState(gamepadInput, this.gamepadBitmap, usePR);
          this.sendGamepad(bytes);
          this.lastGamepadSendMs = nowMs;
          if (stateChanged) {
            this.previousGamepadStates.set(i, { ...gamepadInput });
            this.lastGamepadActivityMs = nowMs;
          }
          if (this.activeInputMode !== "gamepad") {
            this.activeInputMode = "gamepad";
            this.pendingMouseDx = 0;
            this.pendingMouseDy = 0;
            this.log("Input mode → gamepad");
          }
          if (stateChanged) {
            this.gamepadSendCount++;
            if (this.gamepadSendCount <= 20) {
              this.log(`Gamepad send #${this.gamepadSendCount}: pad=${i} btns=0x${gamepadInput.buttons.toString(16)} lt=${gamepadInput.leftTrigger} rt=${gamepadInput.rightTrigger} lx=${gamepadInput.leftStickX} ly=${gamepadInput.leftStickY} rx=${gamepadInput.rightStickX} ry=${gamepadInput.rightStickY} bytes=${bytes.length}`);
            }
          }
        }
      } else if (this.connectedGamepads.has(i)) {
        this.connectedGamepads.delete(i);
        this.previousGamepadStates.delete(i);
        this.gamepadBitmap &= ~(1 << i);
        this.log(`Gamepad ${i} disconnected, bitmap now: 0x${this.gamepadBitmap.toString(16)}`);
        this.diagnostics.connectedGamepads = this.connectedGamepads.size;
        this.emitStats();
        const disconnectState = {
          controllerId: i,
          buttons: 0,
          leftTrigger: 0,
          rightTrigger: 0,
          leftStickX: 0,
          leftStickY: 0,
          rightStickX: 0,
          rightStickY: 0,
          connected: false,
          timestampUs: timestampUs()
        };
        const usePR = this.mouseInputChannel?.readyState === "open";
        const bytes = this.inputEncoder.encodeGamepadState(disconnectState, this.gamepadBitmap, usePR);
        this.sendGamepad(bytes);
      }
    }
    this.diagnostics.connectedGamepads = connectedCount;
  }
  readGamepadState(gamepad, controllerId) {
    const buttons = mapGamepadButtons(gamepad);
    const axes = readGamepadAxes(gamepad);
    return {
      controllerId,
      buttons,
      leftTrigger: normalizeToUint8(axes.leftTrigger),
      rightTrigger: normalizeToUint8(axes.rightTrigger),
      leftStickX: normalizeToInt16(axes.leftStickX),
      leftStickY: normalizeToInt16(axes.leftStickY),
      rightStickX: normalizeToInt16(axes.rightStickX),
      rightStickY: normalizeToInt16(axes.rightStickY),
      connected: true,
      timestampUs: timestampUs()
    };
  }
  hasGamepadStateChanged(controllerId, newState) {
    const prevState = this.previousGamepadStates.get(controllerId);
    if (!prevState) {
      return true;
    }
    return prevState.buttons !== newState.buttons || prevState.leftTrigger !== newState.leftTrigger || prevState.rightTrigger !== newState.rightTrigger || prevState.leftStickX !== newState.leftStickX || prevState.leftStickY !== newState.leftStickY || prevState.rightStickX !== newState.rightStickX || prevState.rightStickY !== newState.rightStickY;
  }
  onGamepadConnected = (event) => {
    this.log(`Gamepad connected event: ${event.gamepad.id}`);
  };
  onGamepadDisconnected = (event) => {
    this.log(`Gamepad disconnected event: ${event.gamepad.id}`);
  };
  onInputHandshakeMessage(bytes) {
    if (bytes.length < 2) {
      this.log(`Input handshake: ignoring short message (${bytes.length} bytes)`);
      return;
    }
    const hex = Array.from(bytes.slice(0, Math.min(bytes.length, 16))).map((b) => b.toString(16).padStart(2, "0")).join(" ");
    this.log(`Input channel message: ${bytes.length} bytes [${hex}]`);
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const firstWord = view.getUint16(0, true);
    let version = 2;
    if (firstWord === 526) {
      version = bytes.length >= 4 ? view.getUint16(2, true) : 2;
      this.log(`Handshake detected: firstWord=526 (0x020e), version=${version}`);
    } else if (bytes[0] === 14) {
      version = firstWord;
      this.log(`Handshake detected: byte[0]=0x0e, version=${version}`);
    } else {
      this.log(`Input channel message not a handshake: firstWord=${firstWord} (0x${firstWord.toString(16)})`);
      return;
    }
    if (!this.inputReady) {
      this.inputReady = true;
      this.inputProtocolVersion = version;
      this.inputEncoder.setProtocolVersion(version);
      this.diagnostics.inputReady = true;
      this.emitStats();
      this.log(`Input handshake complete (protocol v${version}) — starting heartbeat + gamepad polling`);
      this.setupInputHeartbeat();
      this.setupGamepadPolling();
    }
  }
  createDataChannels(pc) {
    this.reliableInputChannel = pc.createDataChannel("input_channel_v1", {
      ordered: true
    });
    this.reliableInputChannel.onopen = () => {
      this.log("Reliable input channel open");
    };
    this.reliableInputChannel.onmessage = async (event) => {
      const bytes = await toBytes(event.data);
      this.onInputHandshakeMessage(bytes);
    };
    this.mouseInputChannel = pc.createDataChannel("input_channel_partially_reliable", {
      ordered: false,
      maxPacketLifeTime: this.partialReliableThresholdMs
    });
    this.mouseInputChannel.onopen = () => {
      this.log(`Mouse channel open (partially reliable, maxPacketLifeTime=${this.partialReliableThresholdMs}ms)`);
    };
  }
  mapTimerNotificationCode(rawCode) {
    if (rawCode === 1 || rawCode === 2) {
      return 1;
    }
    if (rawCode === 4) {
      return 2;
    }
    if (rawCode === 6) {
      return 3;
    }
    return null;
  }
  async onControlChannelMessage(data) {
    let payloadText;
    if (typeof data === "string") {
      payloadText = data;
    } else if (data instanceof Blob) {
      payloadText = await data.text();
    } else if (data instanceof ArrayBuffer) {
      payloadText = new TextDecoder().decode(data);
    } else {
      return;
    }
    let parsed;
    try {
      parsed = JSON.parse(payloadText);
    } catch {
      return;
    }
    if (!parsed || typeof parsed !== "object" || !("timerNotification" in parsed)) {
      return;
    }
    const timerNotification = parsed.timerNotification;
    if (!timerNotification || typeof timerNotification !== "object") {
      return;
    }
    const rawCode = Number(timerNotification.code);
    const mappedCode = this.mapTimerNotificationCode(rawCode);
    if (mappedCode === null) {
      this.log(`Control timer notification ignored: code=${rawCode}`);
      return;
    }
    const rawSecondsLeft = Number(timerNotification.secondsLeft);
    const secondsLeft = Number.isFinite(rawSecondsLeft) && rawSecondsLeft >= 0 ? Math.floor(rawSecondsLeft) : void 0;
    this.log(
      `Control timer warning: rawCode=${rawCode} mappedCode=${mappedCode} secondsLeft=${secondsLeft ?? "n/a"}`
    );
    this.options.onTimeWarning?.({ code: mappedCode, secondsLeft });
  }
  async flushQueuedCandidates() {
    if (!this.pc || !this.pc.remoteDescription) {
      return;
    }
    while (this.queuedCandidates.length > 0) {
      const candidate = this.queuedCandidates.shift();
      if (!candidate) {
        continue;
      }
      await this.pc.addIceCandidate(candidate);
    }
  }
  reliableDropLogged = false;
  sendReliable(payload) {
    if (this.reliableInputChannel?.readyState === "open") {
      const safePayload = Uint8Array.from(payload);
      this.reliableInputChannel.send(safePayload.buffer);
    } else if (!this.reliableDropLogged) {
      this.reliableDropLogged = true;
      this.log(`Reliable channel not open (state=${this.reliableInputChannel?.readyState ?? "null"}), dropping event (${payload.length} bytes)`);
    }
  }
  async lockEscapeInFullscreen() {
    const nav = navigator;
    if (!document.fullscreenElement) {
      return;
    }
    if (!nav.keyboard?.lock) {
      return;
    }
    try {
      await nav.keyboard.lock([
        "Escape",
        "F11",
        "BrowserBack",
        "BrowserForward",
        "BrowserRefresh"
      ]);
      this.log("Keyboard lock acquired (Escape captured in fullscreen)");
    } catch (error) {
      this.log(`Keyboard lock failed: ${String(error)}`);
    }
  }
  async requestPointerLockWithEscGuard(videoElement, ensureFullscreen) {
    if (ensureFullscreen && !document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
      } catch (error) {
        this.log(`Fullscreen request failed: ${String(error)}`);
      }
    }
    await this.lockEscapeInFullscreen();
    try {
      await videoElement.requestPointerLock({ unadjustedMovement: true });
      this.log("Pointer lock acquired with unadjustedMovement=true (raw/unaccelerated)");
    } catch (err) {
      const domErr = err;
      if (domErr?.name === "NotSupportedError") {
        this.log("unadjustedMovement not supported, falling back to standard pointer lock (accelerated)");
        await videoElement.requestPointerLock();
      } else {
        throw err;
      }
    }
  }
  clearEscapeHoldTimer() {
    if (this.escapeHoldReleaseTimer !== null) {
      window.clearTimeout(this.escapeHoldReleaseTimer);
      this.escapeHoldReleaseTimer = null;
    }
    if (this.escapeHoldIndicatorDelayTimer !== null) {
      window.clearTimeout(this.escapeHoldIndicatorDelayTimer);
      this.escapeHoldIndicatorDelayTimer = null;
    }
    if (this.escapeHoldProgressTimer !== null) {
      window.clearInterval(this.escapeHoldProgressTimer);
      this.escapeHoldProgressTimer = null;
    }
    this.escapeHoldStartedAtMs = null;
    this.options.onEscHoldProgress?.(false, 0);
  }
  clearEscapeAutoKeyUpTimer() {
    if (this.escapeAutoKeyUpTimer !== null) {
      window.clearTimeout(this.escapeAutoKeyUpTimer);
      this.escapeAutoKeyUpTimer = null;
    }
  }
  scheduleEscapeAutoKeyUp(scancode) {
    this.clearEscapeAutoKeyUpTimer();
    this.escapeAutoKeyUpTimer = window.setTimeout(() => {
      this.escapeAutoKeyUpTimer = null;
      if (!this.inputReady) {
        return;
      }
      if (!this.pressedKeys.has(27)) {
        return;
      }
      this.pressedKeys.delete(27);
      const payload = this.inputEncoder.encodeKeyUp({
        keycode: 27,
        scancode,
        modifiers: 0,
        timestampUs: timestampUs()
      });
      this.sendReliable(payload);
      this.log("Sent Escape keyup fallback (browser suppressed keyup)");
    }, 120);
  }
  startEscapeHoldRelease(videoElement) {
    if (this.escapeHoldReleaseTimer !== null) {
      return;
    }
    this.escapeHoldStartedAtMs = performance.now();
    this.options.onEscHoldProgress?.(false, 0);
    this.escapeHoldIndicatorDelayTimer = window.setTimeout(() => {
      this.escapeHoldIndicatorDelayTimer = null;
    }, 300);
    this.escapeHoldProgressTimer = window.setInterval(() => {
      if (this.escapeHoldStartedAtMs === null) {
        return;
      }
      const elapsedMs = performance.now() - this.escapeHoldStartedAtMs;
      if (elapsedMs < 300) {
        return;
      }
      const progress = Math.min(1, (elapsedMs - 300) / 4700);
      this.options.onEscHoldProgress?.(true, progress);
    }, 50);
    this.escapeHoldReleaseTimer = window.setTimeout(() => {
      this.escapeHoldReleaseTimer = null;
      this.clearEscapeHoldTimer();
      if (document.pointerLockElement === videoElement) {
        this.log("Escape held for 5s, releasing pointer lock");
        this.suppressNextSyntheticEscape = true;
        this.pressedKeys.delete(27);
        document.exitPointerLock();
      }
    }, 5e3);
  }
  shouldSendSyntheticEscapeOnPointerLockLoss() {
    if (document.visibilityState !== "visible") {
      return false;
    }
    if (typeof document.hasFocus === "function" && !document.hasFocus()) {
      return false;
    }
    return true;
  }
  releasePressedKeys(reason) {
    this.clearEscapeAutoKeyUpTimer();
    if (this.pressedKeys.size === 0 || !this.inputReady) {
      this.pressedKeys.clear();
      return;
    }
    this.log(`Releasing ${this.pressedKeys.size} key(s): ${reason}`);
    for (const vk of this.pressedKeys) {
      const payload = this.inputEncoder.encodeKeyUp({
        keycode: vk,
        scancode: 0,
        modifiers: 0,
        timestampUs: timestampUs()
      });
      this.sendReliable(payload);
    }
    this.pressedKeys.clear();
  }
  sendKeyPacket(vk, scancode, modifiers, isDown) {
    const payload = isDown ? this.inputEncoder.encodeKeyDown({
      keycode: vk,
      scancode,
      modifiers,
      timestampUs: timestampUs()
    }) : this.inputEncoder.encodeKeyUp({
      keycode: vk,
      scancode,
      modifiers,
      timestampUs: timestampUs()
    });
    this.sendReliable(payload);
  }
  ensureKeyboardInputMode() {
    if (this.activeInputMode !== "gamepad") {
      return true;
    }
    const idleMs = performance.now() - this.lastGamepadActivityMs;
    if (idleMs < GfnWebRtcClient.GAMEPAD_MODE_LOCKOUT_MS) {
      return false;
    }
    this.activeInputMode = "mkb";
    this.log("Input mode → mouse+keyboard (gamepad idle)");
    return true;
  }
  sendAntiAfkPulse() {
    if (!this.inputReady) {
      return false;
    }
    this.sendKeyPacket(124, 100, 0, true);
    window.setTimeout(() => this.sendKeyPacket(124, 100, 0, false), 50);
    return true;
  }
  sendPasteShortcut(useMeta) {
    if (!this.inputReady || !this.ensureKeyboardInputMode()) {
      return false;
    }
    const modifier = useMeta ? { vk: 91, scancode: 227, flag: 8 } : { vk: 162, scancode: 224, flag: 2 };
    this.sendKeyPacket(modifier.vk, modifier.scancode, modifier.flag, true);
    this.sendKeyPacket(86, 25, modifier.flag, true);
    this.sendKeyPacket(86, 25, modifier.flag, false);
    this.sendKeyPacket(modifier.vk, modifier.scancode, 0, false);
    return true;
  }
  sendText(text) {
    if (!this.inputReady || !text || !this.ensureKeyboardInputMode()) {
      return 0;
    }
    let sent = 0;
    const maxChars = 4096;
    for (const char of text.slice(0, maxChars)) {
      const key = mapTextCharToKeySpec(char);
      if (!key) {
        continue;
      }
      if (key.shift) {
        this.sendKeyPacket(160, 225, 1, true);
      }
      const mods = key.shift ? 1 : 0;
      this.sendKeyPacket(key.vk, key.scancode, mods, true);
      this.sendKeyPacket(key.vk, key.scancode, mods, false);
      if (key.shift) {
        this.sendKeyPacket(160, 225, 0, false);
      }
      sent++;
    }
    return sent;
  }
  /** Send gamepad data on the partially reliable channel (unordered, maxPacketLifeTime).
   *  Falls back to reliable channel if partially reliable isn't available.
   *  Official GFN client uses partially reliable ONLY for gamepad, not mouse. */
  sendGamepad(payload) {
    if (this.mouseInputChannel?.readyState === "open") {
      const safePayload = Uint8Array.from(payload);
      this.mouseInputChannel.send(safePayload.buffer);
      return;
    }
    this.sendReliable(payload);
  }
  installInputCapture(videoElement) {
    this.detachInputCapture();
    const hasPointerRawUpdate = "onpointerrawupdate" in videoElement;
    const hasCoalescedEvents = typeof PointerEvent !== "undefined" && "getCoalescedEvents" in PointerEvent.prototype;
    const pointerMoveEventName = hasPointerRawUpdate ? "pointerrawupdate" : typeof PointerEvent !== "undefined" ? "pointermove" : null;
    this.mouseFlushIntervalMs = hasPointerRawUpdate ? GfnWebRtcClient.MOUSE_FLUSH_FAST_MS : hasCoalescedEvents ? GfnWebRtcClient.MOUSE_FLUSH_NORMAL_MS : GfnWebRtcClient.MOUSE_FLUSH_SAFE_MS;
    this.mouseFlushLastTickMs = performance.now();
    this.pendingMouseDx = 0;
    this.pendingMouseDy = 0;
    this.pendingMouseTimestampUs = null;
    this.mouseDeltaFilter.reset();
    this.log(
      `Mouse input mode: ${pointerMoveEventName ?? "mousemove"}, coalesced=${hasCoalescedEvents ? "yes" : "no"}, flush=${this.mouseFlushIntervalMs}ms`
    );
    const flushMouse = () => {
      const tickNow = performance.now();
      if (this.mouseFlushLastTickMs > 0) {
        const expected = this.mouseFlushLastTickMs + this.mouseFlushIntervalMs;
        const schedulingDelay = Math.max(0, tickNow - expected);
        this.inputQueueMaxSchedulingDelayMsWindow = Math.max(
          this.inputQueueMaxSchedulingDelayMsWindow,
          schedulingDelay
        );
      }
      this.mouseFlushLastTickMs = tickNow;
      if (!this.inputReady) {
        return;
      }
      if (this.activeInputMode === "gamepad") {
        this.pendingMouseDx = 0;
        this.pendingMouseDy = 0;
        this.pendingMouseTimestampUs = null;
        return;
      }
      if (this.pendingMouseDx === 0 && this.pendingMouseDy === 0) {
        return;
      }
      const reliable = this.reliableInputChannel;
      if (reliable?.readyState === "open" && reliable.bufferedAmount > GfnWebRtcClient.RELIABLE_MOUSE_BACKPRESSURE_BYTES) {
        const now2 = performance.now();
        this.inputQueueDropCount++;
        if (now2 - this.mouseBackpressureLoggedAtMs >= GfnWebRtcClient.BACKPRESSURE_LOG_INTERVAL_MS) {
          this.mouseBackpressureLoggedAtMs = now2;
          this.log(`Dropping stale mouse movement (reliable bufferedAmount=${reliable.bufferedAmount})`);
        }
        this.pendingMouseDx = 0;
        this.pendingMouseDy = 0;
        this.pendingMouseTimestampUs = null;
        return;
      }
      const payload = this.inputEncoder.encodeMouseMove({
        dx: Math.max(-32768, Math.min(32767, this.pendingMouseDx)),
        dy: Math.max(-32768, Math.min(32767, this.pendingMouseDy)),
        timestampUs: this.pendingMouseTimestampUs ?? timestampUs()
      });
      this.pendingMouseDx = 0;
      this.pendingMouseDy = 0;
      this.pendingMouseTimestampUs = null;
      this.sendReliable(payload);
    };
    this.mouseFlushTimer = window.setInterval(flushMouse, this.mouseFlushIntervalMs);
    const queueMouseMovement = (dx, dy, eventTimestampMs) => {
      if (!this.inputReady || document.pointerLockElement !== videoElement) {
        return;
      }
      if (this.activeInputMode === "gamepad") {
        return;
      }
      if (!this.mouseDeltaFilter.update(dx, dy, eventTimestampMs)) {
        return;
      }
      this.pendingMouseDx += Math.round(this.mouseDeltaFilter.getX());
      this.pendingMouseDy += Math.round(this.mouseDeltaFilter.getY());
      this.pendingMouseTimestampUs = timestampUs(eventTimestampMs);
    };
    const onPointerMove = (event) => {
      if (event.pointerType && event.pointerType !== "mouse") {
        return;
      }
      const samples = hasCoalescedEvents ? event.getCoalescedEvents() : [];
      if (samples.length > 0) {
        for (const sample of samples) {
          queueMouseMovement(sample.movementX, sample.movementY, sample.timeStamp);
        }
        return;
      }
      queueMouseMovement(event.movementX, event.movementY, event.timeStamp);
    };
    const onMouseMove = (event) => {
      queueMouseMovement(event.movementX, event.movementY, event.timeStamp);
    };
    const onKeyDown = (event) => {
      if (!this.inputReady) {
        return;
      }
      const isEscapeEvent = event.key === "Escape" || event.key === "Esc" || event.code === "Escape" || event.keyCode === 27;
      const mapped = mapKeyboardEvent(event) ?? (isEscapeEvent ? { vk: 27, scancode: 41 } : null);
      if (event.repeat) {
        if (document.pointerLockElement === videoElement || mapped) {
          event.preventDefault();
        }
        return;
      }
      if (document.pointerLockElement === videoElement) {
        event.preventDefault();
      }
      if (!mapped) {
        return;
      }
      if (this.activeInputMode === "gamepad") {
        const idleMs = performance.now() - this.lastGamepadActivityMs;
        if (idleMs < GfnWebRtcClient.GAMEPAD_MODE_LOCKOUT_MS) {
          return;
        }
        this.activeInputMode = "mkb";
        this.log("Input mode → mouse+keyboard (gamepad idle)");
      }
      event.preventDefault();
      this.pressedKeys.add(mapped.vk);
      if (mapped.vk === 27 && document.pointerLockElement === videoElement) {
        this.escapeTapDispatchedForCurrentHold = false;
        this.clearEscapeAutoKeyUpTimer();
        this.startEscapeHoldRelease(videoElement);
        return;
      }
      const payload = this.inputEncoder.encodeKeyDown({
        keycode: mapped.vk,
        scancode: mapped.scancode,
        modifiers: modifierFlags(event),
        // Use a fresh monotonic timestamp for keyboard events. In some
        // fullscreen/keyboard-lock paths, event.timeStamp can be unstable.
        timestampUs: timestampUs()
      });
      this.sendReliable(payload);
    };
    const onKeyUp = (event) => {
      if (!this.inputReady || this.activeInputMode === "gamepad") {
        return;
      }
      const isEscapeEvent = event.key === "Escape" || event.key === "Esc" || event.code === "Escape" || event.keyCode === 27;
      const mapped = mapKeyboardEvent(event) ?? (isEscapeEvent ? { vk: 27, scancode: 41 } : null);
      if (!mapped) {
        return;
      }
      event.preventDefault();
      if (mapped.vk === 27) {
        this.clearEscapeAutoKeyUpTimer();
        const wasTap = this.escapeHoldReleaseTimer !== null;
        this.clearEscapeHoldTimer();
        if (wasTap && this.pressedKeys.has(27)) {
          this.log("Escape tap detected - sending to stream");
          this.sendKeyPacket(27, mapped.scancode || 41, 0, true);
          this.sendKeyPacket(27, mapped.scancode || 41, 0, false);
        }
        this.pressedKeys.delete(mapped.vk);
        return;
      }
      this.pressedKeys.delete(mapped.vk);
      const payload = this.inputEncoder.encodeKeyUp({
        keycode: mapped.vk,
        scancode: mapped.scancode,
        modifiers: modifierFlags(event),
        timestampUs: timestampUs()
      });
      this.sendReliable(payload);
    };
    const onMouseDown = (event) => {
      if (!this.inputReady) {
        return;
      }
      if (this.activeInputMode === "gamepad") {
        const idleMs = performance.now() - this.lastGamepadActivityMs;
        if (idleMs < GfnWebRtcClient.GAMEPAD_MODE_LOCKOUT_MS) {
          return;
        }
        this.activeInputMode = "mkb";
        this.log("Input mode → mouse+keyboard (gamepad idle)");
      }
      event.preventDefault();
      const payload = this.inputEncoder.encodeMouseButtonDown({
        button: toMouseButton(event.button),
        timestampUs: timestampUs(event.timeStamp)
      });
      this.sendReliable(payload);
    };
    const onMouseUp = (event) => {
      if (!this.inputReady || this.activeInputMode === "gamepad") {
        return;
      }
      event.preventDefault();
      const payload = this.inputEncoder.encodeMouseButtonUp({
        button: toMouseButton(event.button),
        timestampUs: timestampUs(event.timeStamp)
      });
      this.sendReliable(payload);
    };
    const onWheel = (event) => {
      if (!this.inputReady || this.activeInputMode === "gamepad") {
        return;
      }
      event.preventDefault();
      const delta = Math.max(-32768, Math.min(32767, Math.round(-event.deltaY)));
      const payload = this.inputEncoder.encodeMouseWheel({
        delta,
        timestampUs: timestampUs(event.timeStamp)
      });
      this.sendReliable(payload);
    };
    const onClick = () => {
      void this.requestPointerLockWithEscGuard(videoElement, true).catch((err) => {
        this.log(`Pointer lock request failed: ${err.name}: ${err.message}`);
      });
      videoElement.focus();
    };
    this.videoElement = videoElement;
    const onPointerLockChange = () => {
      if (document.pointerLockElement) {
        if (this.pointerLockEscapeTimer !== null) {
          window.clearTimeout(this.pointerLockEscapeTimer);
          this.pointerLockEscapeTimer = null;
        }
        this.suppressNextSyntheticEscape = false;
        this.escapeTapDispatchedForCurrentHold = false;
        this.clearEscapeHoldTimer();
        return;
      }
      this.clearEscapeHoldTimer();
      if (!this.inputReady) return;
      if (this.suppressNextSyntheticEscape) {
        this.suppressNextSyntheticEscape = false;
        this.releasePressedKeys("pointer lock intentionally released");
        return;
      }
      if (!this.shouldSendSyntheticEscapeOnPointerLockLoss()) {
        this.releasePressedKeys("pointer lock lost while unfocused");
        return;
      }
      const escapeWasPressed = this.pressedKeys.has(27);
      if (escapeWasPressed) {
        return;
      }
      this.pointerLockEscapeTimer = window.setTimeout(() => {
        this.pointerLockEscapeTimer = null;
        if (!this.inputReady) return;
        if (!this.shouldSendSyntheticEscapeOnPointerLockLoss()) {
          this.releasePressedKeys("focus changed before synthetic Escape");
          return;
        }
        this.releasePressedKeys("pointer lock lost before synthetic Escape");
        this.log("Sending synthetic Escape (pointer lock lost by browser)");
        const escDown = this.inputEncoder.encodeKeyDown({
          keycode: 27,
          scancode: 41,
          // Escape scancode
          modifiers: 0,
          timestampUs: timestampUs()
        });
        this.sendReliable(escDown);
        const escUp = this.inputEncoder.encodeKeyUp({
          keycode: 27,
          scancode: 41,
          modifiers: 0,
          timestampUs: timestampUs()
        });
        this.sendReliable(escUp);
        if (this.videoElement && this.activeInputMode !== "gamepad") {
          void this.requestPointerLockWithEscGuard(this.videoElement, false).catch(() => {
          });
        }
      }, 50);
    };
    const onWindowBlur = () => {
      if (this.micState === "permission_pending") {
        this.log("Window blur during mic permission - keeping keys pressed");
        return;
      }
      this.clearEscapeHoldTimer();
      this.releasePressedKeys("window blur");
    };
    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible") {
        this.clearEscapeHoldTimer();
        this.releasePressedKeys(`visibility ${document.visibilityState}`);
      }
    };
    const onFullscreenChange = () => {
      const nav = navigator;
      if (document.fullscreenElement) {
        void this.lockEscapeInFullscreen();
      } else {
        if (nav.keyboard?.unlock) {
          nav.keyboard.unlock();
        }
      }
    };
    window.addEventListener("gamepadconnected", this.onGamepadConnected);
    window.addEventListener("gamepaddisconnected", this.onGamepadDisconnected);
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("keyup", onKeyUp, true);
    if (pointerMoveEventName) {
      document.addEventListener(pointerMoveEventName, onPointerMove);
    } else {
      window.addEventListener("mousemove", onMouseMove);
    }
    videoElement.addEventListener("mousedown", onMouseDown);
    videoElement.addEventListener("mouseup", onMouseUp);
    videoElement.addEventListener("wheel", onWheel, { passive: false });
    videoElement.addEventListener("click", onClick);
    document.addEventListener("pointerlockchange", onPointerLockChange);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    window.addEventListener("blur", onWindowBlur);
    document.addEventListener("visibilitychange", onVisibilityChange);
    if (document.fullscreenElement) {
      onFullscreenChange();
    }
    this.inputCleanup.push(() => window.removeEventListener("gamepadconnected", this.onGamepadConnected));
    this.inputCleanup.push(() => window.removeEventListener("gamepaddisconnected", this.onGamepadDisconnected));
    this.inputCleanup.push(() => document.removeEventListener("keydown", onKeyDown, true));
    this.inputCleanup.push(() => document.removeEventListener("keyup", onKeyUp, true));
    if (pointerMoveEventName) {
      this.inputCleanup.push(() => document.removeEventListener(pointerMoveEventName, onPointerMove));
    } else {
      this.inputCleanup.push(() => window.removeEventListener("mousemove", onMouseMove));
    }
    this.inputCleanup.push(() => videoElement.removeEventListener("mousedown", onMouseDown));
    this.inputCleanup.push(() => videoElement.removeEventListener("mouseup", onMouseUp));
    this.inputCleanup.push(() => videoElement.removeEventListener("wheel", onWheel));
    this.inputCleanup.push(() => videoElement.removeEventListener("click", onClick));
    this.inputCleanup.push(() => document.removeEventListener("pointerlockchange", onPointerLockChange));
    this.inputCleanup.push(() => document.removeEventListener("fullscreenchange", onFullscreenChange));
    this.inputCleanup.push(() => window.removeEventListener("blur", onWindowBlur));
    this.inputCleanup.push(() => document.removeEventListener("visibilitychange", onVisibilityChange));
    this.inputCleanup.push(() => {
      if (this.pointerLockEscapeTimer !== null) {
        window.clearTimeout(this.pointerLockEscapeTimer);
        this.pointerLockEscapeTimer = null;
      }
      this.escapeTapDispatchedForCurrentHold = false;
      this.clearEscapeAutoKeyUpTimer();
      this.clearEscapeHoldTimer();
      this.releasePressedKeys("input cleanup");
      this.pendingMouseDx = 0;
      this.pendingMouseDy = 0;
      this.pendingMouseTimestampUs = null;
      this.mouseDeltaFilter.reset();
      this.videoElement = null;
      const nav = navigator;
      if (nav.keyboard?.unlock) {
        nav.keyboard.unlock();
      }
    });
  }
  /**
   * Query browser for supported video codecs via RTCRtpReceiver.getCapabilities.
   * Returns normalized names like "H264", "H265", "AV1", "VP9", "VP8".
   */
  getSupportedVideoCodecs() {
    try {
      const capabilities = RTCRtpReceiver.getCapabilities("video");
      if (!capabilities) return [];
      const codecs = /* @__PURE__ */ new Set();
      for (const codec of capabilities.codecs) {
        const mime = codec.mimeType.toUpperCase();
        if (mime.includes("H264")) codecs.add("H264");
        else if (mime.includes("H265") || mime.includes("HEVC")) codecs.add("H265");
        else if (mime.includes("AV1")) codecs.add("AV1");
        else if (mime.includes("VP9")) codecs.add("VP9");
        else if (mime.includes("VP8")) codecs.add("VP8");
      }
      return Array.from(codecs);
    } catch {
      return [];
    }
  }
  /** Get supported HEVC profile-id values from RTCRtpReceiver capabilities (e.g. "1", "2"). */
  getSupportedHevcProfiles() {
    const profiles = /* @__PURE__ */ new Set();
    try {
      const capabilities = RTCRtpReceiver.getCapabilities("video");
      if (!capabilities) return profiles;
      for (const codec of capabilities.codecs) {
        const mime = codec.mimeType.toUpperCase();
        if (!mime.includes("H265") && !mime.includes("HEVC")) {
          continue;
        }
        const fmtp = codec.sdpFmtpLine ?? "";
        const match = fmtp.match(/(?:^|;)\s*profile-id=(\d+)/i);
        if (match?.[1]) {
          profiles.add(match[1]);
        }
      }
    } catch {
    }
    return profiles;
  }
  /** Maximum HEVC level-id by profile-id from receiver capabilities. */
  getHevcMaxLevelsByProfile() {
    const result = {};
    try {
      const capabilities = RTCRtpReceiver.getCapabilities("video");
      if (!capabilities) return result;
      for (const codec of capabilities.codecs) {
        const mime = codec.mimeType.toUpperCase();
        if (!mime.includes("H265") && !mime.includes("HEVC")) {
          continue;
        }
        const fmtp = codec.sdpFmtpLine ?? "";
        const profileMatch = fmtp.match(/(?:^|;)\s*profile-id=(\d+)/i);
        const levelMatch = fmtp.match(/(?:^|;)\s*level-id=(\d+)/i);
        if (!profileMatch?.[1] || !levelMatch?.[1]) {
          continue;
        }
        const profile = Number.parseInt(profileMatch[1], 10);
        const level = Number.parseInt(levelMatch[1], 10);
        if (!Number.isFinite(level) || profile !== 1 && profile !== 2) {
          continue;
        }
        const current = result[profile];
        if (!current || level > current) {
          result[profile] = level;
        }
      }
    } catch {
    }
    return result;
  }
  /** Whether receiver capabilities explicitly expose HEVC tier-flag=1 support. */
  supportsHevcTierFlagOne() {
    try {
      const capabilities = RTCRtpReceiver.getCapabilities("video");
      if (!capabilities) return false;
      return capabilities.codecs.some((codec) => {
        const mime = codec.mimeType.toUpperCase();
        if (!mime.includes("H265") && !mime.includes("HEVC")) {
          return false;
        }
        return /(?:^|;)\s*tier-flag=1/i.test(codec.sdpFmtpLine ?? "");
      });
    } catch {
      return false;
    }
  }
  /**
   * Apply setCodecPreferences roughly matching GFN web client behavior:
   * preferred codec + RTX/FlexFEC only (receiver capabilities first).
   * On failure, retry with sender capabilities appended.
   */
  applyCodecPreferences(pc, codec, preferredHevcProfileId) {
    try {
      const transceivers = pc.getTransceivers();
      const videoTransceiver = transceivers.find(
        (t) => t.receiver.track.kind === "video"
      );
      if (!videoTransceiver) {
        this.log("setCodecPreferences: no video transceiver found, skipping");
        return;
      }
      const receiverCaps = RTCRtpReceiver.getCapabilities("video")?.codecs;
      if (!receiverCaps) {
        this.log("setCodecPreferences: RTCRtpReceiver.getCapabilities returned null, skipping");
        return;
      }
      const senderCaps = RTCRtpSender.getCapabilities?.("video")?.codecs ?? [];
      const codecMimeMap = {
        H264: "video/H264",
        H265: "video/H265",
        AV1: "video/AV1",
        VP9: "video/VP9",
        VP8: "video/VP8"
      };
      const preferredMime = codecMimeMap[codec];
      if (!preferredMime) {
        this.log(`setCodecPreferences: unknown codec "${codec}", skipping`);
        return;
      }
      const preferred = receiverCaps.filter(
        (c) => c.mimeType.toLowerCase() === preferredMime.toLowerCase()
      );
      const auxiliary = receiverCaps.filter((c) => {
        const mime = c.mimeType.toLowerCase();
        return mime.includes("rtx") || mime.includes("flexfec-03");
      });
      if (preferred.length === 0) {
        this.log(`setCodecPreferences: ${codec} (${preferredMime}) not in receiver capabilities, skipping`);
        return;
      }
      if (codec === "H265" && preferredHevcProfileId) {
        preferred.sort((a, b) => {
          const getScore = (c) => {
            const fmtp = (c.sdpFmtpLine ?? "").toLowerCase();
            const match = fmtp.match(/(?:^|;)\s*profile-id=(\d+)/);
            const profile = match?.[1];
            if (profile === String(preferredHevcProfileId)) return 0;
            if (!profile) return 1;
            return 2;
          };
          return getScore(a) - getScore(b);
        });
      }
      let codecList = [...preferred, ...auxiliary];
      try {
        videoTransceiver.setCodecPreferences(codecList);
        this.log(
          `setCodecPreferences: set ${codec} (${preferred.length} preferred + ${auxiliary.length} auxiliary receiver codecs)`
        );
      } catch (e) {
        this.log(`setCodecPreferences: receiver-only failed (${String(e)}), retrying with sender capabilities`);
        try {
          codecList = codecList.concat(senderCaps);
          videoTransceiver.setCodecPreferences(codecList);
          this.log(
            `setCodecPreferences: retry succeeded with sender capabilities (+${senderCaps.length})`
          );
        } catch (retryErr) {
          this.log(`setCodecPreferences: retry failed (${String(retryErr)}), falling back to SDP-only approach`);
        }
      }
    } catch (e) {
      this.log(`setCodecPreferences: failed (${String(e)}), falling back to SDP-only approach`);
    }
  }
  async handleOffer(offerSdp, session, settings) {
    this.cleanupPeerConnection();
    this.log("=== handleOffer START ===");
    this.log(`Session: id=${session.sessionId}, status=${session.status}, serverIp=${session.serverIp}`);
    this.log(`Signaling: server=${session.signalingServer}, url=${session.signalingUrl}`);
    this.log(`MediaConnectionInfo: ${session.mediaConnectionInfo ? `ip=${session.mediaConnectionInfo.ip}, port=${session.mediaConnectionInfo.port}` : "NONE"}`);
    this.log(
      `Settings: codec=${settings.codec}, colorQuality=${settings.colorQuality}, resolution=${settings.resolution}, fps=${settings.fps}, maxBitrate=${settings.maxBitrateKbps}kbps`
    );
    this.log(`ICE servers: ${session.iceServers.length} (${session.iceServers.map((s) => s.urls.join(",")).join(" | ")})`);
    this.log(`Offer SDP length: ${offerSdp.length} chars`);
    this.log(`=== FULL OFFER SDP START ===`);
    for (const line of offerSdp.split(/\r?\n/)) {
      this.log(`  SDP> ${line}`);
    }
    this.log(`=== FULL OFFER SDP END ===`);
    const negotiatedPartialReliable = parsePartialReliableThresholdMs(offerSdp);
    this.partialReliableThresholdMs = negotiatedPartialReliable ?? GfnWebRtcClient.DEFAULT_PARTIAL_RELIABLE_THRESHOLD_MS;
    this.log(
      `Input channel policy: partial reliable threshold=${this.partialReliableThresholdMs}ms${negotiatedPartialReliable === null ? " (fallback)" : ""}`
    );
    this.serverRegion = session.signalingServer || session.streamingBaseUrl || "";
    if (this.serverRegion) {
      try {
        const url = new URL(this.serverRegion);
        this.serverRegion = url.hostname;
      } catch {
      }
    }
    const rtcConfig = {
      iceServers: toRtcIceServers(session.iceServers),
      bundlePolicy: "max-bundle",
      rtcpMuxPolicy: "require"
    };
    const pc = new RTCPeerConnection(rtcConfig);
    this.pc = pc;
    this.diagnostics.connectionState = pc.connectionState;
    this.diagnostics.serverRegion = this.serverRegion;
    this.diagnostics.gpuType = this.gpuType;
    this.emitStats();
    this.resetInputState();
    this.resetDiagnostics();
    this.createDataChannels(pc);
    this.installInputCapture(this.options.videoElement);
    this.setupStatsPolling();
    pc.onicecandidate = (event) => {
      if (!event.candidate) {
        this.log("ICE gathering complete (null candidate)");
        return;
      }
      const payload = event.candidate.toJSON();
      if (!payload.candidate) {
        return;
      }
      this.log(`Local ICE candidate: ${payload.candidate}`);
      const candidate = {
        candidate: payload.candidate,
        sdpMid: payload.sdpMid,
        sdpMLineIndex: payload.sdpMLineIndex,
        usernameFragment: payload.usernameFragment
      };
      const sendFn = window.openNow?.sendIceCandidate ?? getPlatformApi().sendIceCandidate.bind(getPlatformApi());
      sendFn(candidate).catch((error) => {
        this.log(`Failed to send local ICE candidate: ${String(error)}`);
      });
    };
    pc.onconnectionstatechange = () => {
      this.diagnostics.connectionState = pc.connectionState;
      this.emitStats();
      this.log(`Peer connection state: ${pc.connectionState}`);
    };
    pc.ondatachannel = (event) => {
      const channel = event.channel;
      this.log(`Remote data channel received: label=${channel.label}, ordered=${channel.ordered}`);
      if (channel.label !== "control_channel") {
        return;
      }
      this.controlChannel = channel;
      this.controlChannel.binaryType = "arraybuffer";
      this.controlChannel.onmessage = (msgEvent) => {
        void this.onControlChannelMessage(msgEvent.data);
      };
      this.controlChannel.onclose = () => {
        this.log("Control channel closed");
        if (this.controlChannel === channel) {
          this.controlChannel = null;
        }
      };
      this.controlChannel.onerror = () => {
        this.log("Control channel error");
      };
    };
    pc.onicecandidateerror = (event) => {
      const e = event;
      const hostCandidate = "hostCandidate" in e ? e.hostCandidate : void 0;
      this.log(`ICE candidate error: ${e.errorCode} ${e.errorText} (${e.url ?? "no url"}) hostCandidate=${hostCandidate ?? "?"}`);
    };
    pc.oniceconnectionstatechange = () => {
      this.log(`ICE connection state: ${pc.iceConnectionState}`);
    };
    pc.onicegatheringstatechange = () => {
      this.log(`ICE gathering state: ${pc.iceGatheringState}`);
    };
    pc.onsignalingstatechange = () => {
      this.log(`Signaling state: ${pc.signalingState}`);
    };
    pc.ontrack = (event) => {
      this.log(`Track received: kind=${event.track.kind}, id=${event.track.id}, readyState=${event.track.readyState}`);
      this.attachTrack(event.track);
      this.configureReceiverForLowLatency(event.receiver, event.track.kind);
    };
    const serverIpForSdp = session.mediaConnectionInfo?.ip || session.serverIp || "";
    let processedOffer = offerSdp;
    if (serverIpForSdp) {
      processedOffer = fixServerIp(processedOffer, serverIpForSdp);
      this.log(`Fixed server IP in SDP offer: ${serverIpForSdp}`);
      const remaining = (processedOffer.match(/0\.0\.0\.0/g) ?? []).length;
      if (remaining > 0) {
        this.log(`Warning: ${remaining} occurrences of 0.0.0.0 still remain in SDP after fix`);
      }
    }
    const serverIceUfrag = extractIceUfragFromOffer(processedOffer);
    this.log(`Server ICE ufrag: "${serverIceUfrag}"`);
    const preferredHevcProfileId = hevcPreferredProfileId(settings.colorQuality);
    let effectiveCodec = settings.codec;
    const supported = this.getSupportedVideoCodecs();
    this.log(`Browser supported video codecs: ${supported.join(", ") || "unknown"}`);
    if (settings.codec === "H265") {
      const hevcProfiles = this.getSupportedHevcProfiles();
      if (hevcProfiles.size > 0) {
        this.log(`Browser HEVC profile-id support: ${Array.from(hevcProfiles).join(", ")}`);
      }
      const hevcMaxLevels = this.getHevcMaxLevelsByProfile();
      if (hevcMaxLevels[1] || hevcMaxLevels[2]) {
        this.log(
          `Browser HEVC max level-id by profile: p1=${hevcMaxLevels[1] ?? "?"}, p2=${hevcMaxLevels[2] ?? "?"}`
        );
        const rewrittenLevel = rewriteH265LevelIdByProfile(processedOffer, hevcMaxLevels);
        if (rewrittenLevel.replacements > 0) {
          this.log(
            `HEVC level compatibility: rewrote ${rewrittenLevel.replacements} fmtp lines to receiver max level-id`
          );
          processedOffer = rewrittenLevel.sdp;
        }
      }
      const tierFlagOneSupported = this.supportsHevcTierFlagOne();
      this.log(`Browser HEVC tier-flag=1 support: ${tierFlagOneSupported ? "yes" : "no"}`);
      if (!tierFlagOneSupported) {
        const rewritten = rewriteH265TierFlag(processedOffer, 0);
        if (rewritten.replacements > 0) {
          this.log(
            `HEVC tier compatibility: rewrote ${rewritten.replacements} fmtp lines tier-flag=1 -> tier-flag=0`
          );
          processedOffer = rewritten.sdp;
        }
      }
      if (hevcProfiles.size > 0 && !hevcProfiles.has(String(preferredHevcProfileId))) {
        this.log(
          `Warning: requested H265 profile-id=${preferredHevcProfileId} not reported in browser capabilities; forcing H265 anyway per user preference`
        );
      }
    }
    if (supported.length > 0 && !supported.includes(settings.codec)) {
      this.log(`Warning: ${settings.codec} not reported in browser codec list; forcing requested codec anyway`);
    }
    this.log(`Effective codec: ${effectiveCodec} (preferred HEVC profile-id=${preferredHevcProfileId})`);
    const filteredOffer = preferCodec(processedOffer, effectiveCodec, {
      preferHevcProfileId: preferredHevcProfileId
    });
    this.log(`Filtered offer SDP length: ${filteredOffer.length} chars`);
    this.log("Setting remote description (offer)...");
    await pc.setRemoteDescription({ type: "offer", sdp: filteredOffer });
    this.log("Remote description set successfully");
    await this.flushQueuedCandidates();
    if (this.micManager) {
      this.micManager.setPeerConnection(pc);
      await this.micManager.attachTrackToPeerConnection();
    }
    this.applyCodecPreferences(pc, effectiveCodec, preferredHevcProfileId);
    this.log("Creating answer...");
    const answer = await pc.createAnswer();
    this.log(`Answer created, SDP length: ${answer.sdp?.length ?? 0} chars`);
    if (answer.sdp) {
      answer.sdp = mungeAnswerSdp(answer.sdp, settings.maxBitrateKbps);
      this.log(`Answer SDP munged (b=AS:${settings.maxBitrateKbps}, stereo=1)`);
    }
    await pc.setLocalDescription(answer);
    this.log("Local description set, waiting for ICE gathering...");
    const finalSdp = await this.waitForIceGathering(pc, 5e3);
    this.log(`ICE gathering done, final SDP length: ${finalSdp.length} chars`);
    {
      const lines = finalSdp.split(/\r?\n/);
      let inVideo = false;
      const negotiatedVideoLines = [];
      let hasNegotiatedH265 = false;
      for (const line of lines) {
        if (line.startsWith("m=video")) {
          inVideo = true;
          negotiatedVideoLines.push(line);
          continue;
        }
        if (line.startsWith("m=") && inVideo) {
          break;
        }
        if (inVideo && (line.startsWith("a=rtpmap:") || line.startsWith("a=fmtp:") || line.startsWith("a=rtcp-fb:"))) {
          negotiatedVideoLines.push(line);
          if (line.startsWith("a=rtpmap:") && /\sH(?:265|EVC)\//i.test(line)) {
            hasNegotiatedH265 = true;
          }
        }
      }
      if (negotiatedVideoLines.length > 0) {
        this.log("Negotiated local video SDP lines:");
        for (const l of negotiatedVideoLines) {
          this.log(`  SDP< ${l}`);
        }
      }
      if (effectiveCodec === "H265" && !hasNegotiatedH265) {
        throw new Error("H265 requested but not negotiated in local SDP (no H265 rtpmap in answer)");
      }
    }
    const credentials = extractIceCredentials(finalSdp);
    this.log(`Extracted ICE credentials: ufrag=${credentials.ufrag}, pwd=${credentials.pwd.slice(0, 8)}...`);
    const { width, height } = parseResolution(settings.resolution);
    const nvstSdp = buildNvstSdp({
      width,
      height,
      fps: settings.fps,
      maxBitrateKbps: settings.maxBitrateKbps,
      partialReliableThresholdMs: this.partialReliableThresholdMs,
      codec: effectiveCodec,
      colorQuality: settings.colorQuality,
      credentials
    });
    const sendAnswerFn = window.openNow?.sendAnswer ?? getPlatformApi().sendAnswer.bind(getPlatformApi());
    await sendAnswerFn({ sdp: finalSdp, nvstSdp });
    this.log("Sent SDP answer and nvstSdp");
    if (session.mediaConnectionInfo) {
      const mci = session.mediaConnectionInfo;
      const rawIp = extractPublicIp(mci.ip);
      if (rawIp && mci.port > 0) {
        const candidateStr = `candidate:1 1 udp 2130706431 ${rawIp} ${mci.port} typ host`;
        this.log(`Injecting manual ICE candidate: ${rawIp}:${mci.port}`);
        const mids = ["0", "1", "2", "3"];
        let injected = false;
        for (const mid of mids) {
          try {
            await pc.addIceCandidate({
              candidate: candidateStr,
              sdpMid: mid,
              sdpMLineIndex: parseInt(mid, 10),
              usernameFragment: serverIceUfrag || void 0
            });
            this.log(`Manual ICE candidate injected (sdpMid=${mid})`);
            injected = true;
            break;
          } catch (error) {
            this.log(`Manual ICE candidate failed for sdpMid=${mid}: ${String(error)}`);
          }
        }
        if (!injected) {
          this.log("Warning: Could not inject manual ICE candidate on any sdpMid");
        }
      } else {
        this.log(`Warning: mediaConnectionInfo present but no valid IP (ip=${mci.ip}, port=${mci.port})`);
      }
    } else {
      this.log("No mediaConnectionInfo available — relying on trickle ICE only");
    }
    this.log("=== handleOffer COMPLETE — waiting for ICE connectivity and tracks ===");
  }
  async addRemoteCandidate(candidate) {
    this.log(`Remote ICE candidate received: ${candidate.candidate} (sdpMid=${candidate.sdpMid})`);
    const init = {
      candidate: candidate.candidate,
      sdpMid: candidate.sdpMid ?? void 0,
      sdpMLineIndex: candidate.sdpMLineIndex ?? void 0,
      usernameFragment: candidate.usernameFragment ?? void 0
    };
    if (!this.pc || !this.pc.remoteDescription) {
      this.queuedCandidates.push(init);
      return;
    }
    await this.pc.addIceCandidate(init);
  }
  isStreaming() {
    return this.pc !== null && (this.pc.connectionState === "connected" || this.pc.connectionState === "connecting");
  }
  dispose() {
    this.cleanupPeerConnection();
    if (this.micManager) {
      this.micManager.dispose();
      this.micManager = null;
    }
    for (const track2 of this.videoStream.getTracks()) {
      this.videoStream.removeTrack(track2);
    }
    for (const track2 of this.audioStream.getTracks()) {
      this.audioStream.removeTrack(track2);
    }
  }
  /**
   * Initialize and start microphone capture
   */
  async startMicrophone() {
    if (!this.micManager) {
      this.log("Microphone not available (mode disabled or not supported)");
      return false;
    }
    if (this.pc) {
      this.micManager.setPeerConnection(this.pc);
    }
    const result = await this.micManager.initialize();
    if (result) {
      this.log("Microphone initialized successfully");
    } else {
      this.log("Microphone initialization failed");
    }
    return result;
  }
  /**
   * Stop microphone capture
   */
  stopMicrophone() {
    if (!this.micManager) return;
    this.micManager.stop();
    this.log("Microphone stopped");
  }
  /**
   * Toggle microphone mute/unmute
   */
  toggleMicrophone() {
    if (!this.micManager) return;
    const isEnabled = this.micManager.isEnabled();
    this.micManager.setEnabled(!isEnabled);
    this.log(`Microphone ${!isEnabled ? "unmuted" : "muted"}`);
  }
  /**
   * Set microphone enabled state
   */
  setMicrophoneEnabled(enabled) {
    if (!this.micManager) return;
    this.micManager.setEnabled(enabled);
    this.log(`Microphone ${enabled ? "enabled" : "disabled"}`);
  }
  /**
   * Check if microphone is currently enabled (unmuted)
   */
  isMicrophoneEnabled() {
    return this.micManager?.isEnabled() ?? false;
  }
  /**
   * Get current microphone state
   */
  getMicrophoneState() {
    return this.micState;
  }
  // ── Touch / Android input helpers ───────────────────────────────────────
  // These are thin public wrappers so TouchInputHandler can drive the same
  // encoding path as keyboard/mouse without duplicating protocol details.
  /**
   * Send a relative mouse movement (used by touch drag).
   * dx/dy are in pixels, already scaled by the caller.
   */
  sendRelativeMouseMove(dx, dy) {
    if (!this.inputReady) return;
    const payload = this.inputEncoder.encodeMouseMove({
      dx: Math.max(-32768, Math.min(32767, dx)),
      dy: Math.max(-32768, Math.min(32767, dy)),
      timestampUs: BigInt(Math.floor(performance.now() * 1e3))
    });
    this.sendReliable(payload);
  }
  /**
   * Send a mouse button down event (1=left, 2=middle, 3=right).
   * Used by the touch tap handler.
   */
  sendMouseButtonDown(button) {
    if (!this.inputReady) return;
    const payload = this.inputEncoder.encodeMouseButtonDown({
      button,
      timestampUs: BigInt(Math.floor(performance.now() * 1e3))
    });
    this.sendReliable(payload);
  }
  /**
   * Send a mouse button up event (1=left, 2=middle, 3=right).
   */
  sendMouseButtonUp(button) {
    if (!this.inputReady) return;
    const payload = this.inputEncoder.encodeMouseButtonUp({
      button,
      timestampUs: BigInt(Math.floor(performance.now() * 1e3))
    });
    this.sendReliable(payload);
  }
  /**
   * Send a mouse wheel event (used by two-finger scroll).
   * delta is an integer, positive = scroll up.
   */
  sendMouseWheel(delta) {
    if (!this.inputReady) return;
    const payload = this.inputEncoder.encodeMouseWheel({
      delta: Math.max(-32768, Math.min(32767, delta)),
      timestampUs: BigInt(Math.floor(performance.now() * 1e3))
    });
    this.sendReliable(payload);
  }
  /**
   * Set a single XInput gamepad button pressed or released.
   * Used by the on-screen virtual gamepad for Android.
   * xinputFlag is one of the GAMEPAD_* constants from inputProtocol.ts.
   */
  sendGamepadButton(xinputFlag, pressed) {
    if (!this.inputReady) return;
    const prev = this.previousGamepadStates.get(0);
    const newButtons = pressed ? (prev?.buttons ?? 0) | xinputFlag : (prev?.buttons ?? 0) & ~xinputFlag;
    const state = {
      controllerId: 0,
      buttons: newButtons,
      leftTrigger: prev?.leftTrigger ?? 0,
      rightTrigger: prev?.rightTrigger ?? 0,
      leftStickX: prev?.leftStickX ?? 0,
      leftStickY: prev?.leftStickY ?? 0,
      rightStickX: prev?.rightStickX ?? 0,
      rightStickY: prev?.rightStickY ?? 0,
      connected: true,
      timestampUs: BigInt(Math.floor(performance.now() * 1e3))
    };
    this.previousGamepadStates.set(0, state);
    const usePR = this.mouseInputChannel?.readyState === "open";
    const bytes = this.inputEncoder.encodeGamepadState(state, this.gamepadBitmap | 1, usePR);
    this.sendGamepad(bytes);
  }
  /**
   * Set an analog stick value for on-screen thumbstick controls.
   * x and y are normalised floats in [-1, 1].
   */
  sendGamepadStick(side, x, y) {
    if (!this.inputReady) return;
    const prev = this.previousGamepadStates.get(0);
    const clamp16 = (v) => Math.max(-32768, Math.min(32767, Math.round(v * 32767)));
    const state = {
      controllerId: 0,
      buttons: prev?.buttons ?? 0,
      leftTrigger: prev?.leftTrigger ?? 0,
      rightTrigger: prev?.rightTrigger ?? 0,
      leftStickX: side === "left" ? clamp16(x) : prev?.leftStickX ?? 0,
      leftStickY: side === "left" ? clamp16(-y) : prev?.leftStickY ?? 0,
      rightStickX: side === "right" ? clamp16(x) : prev?.rightStickX ?? 0,
      rightStickY: side === "right" ? clamp16(-y) : prev?.rightStickY ?? 0,
      connected: true,
      timestampUs: BigInt(Math.floor(performance.now() * 1e3))
    };
    this.previousGamepadStates.set(0, state);
    const usePR = this.mouseInputChannel?.readyState === "open";
    const bytes = this.inputEncoder.encodeGamepadState(state, this.gamepadBitmap | 1, usePR);
    this.sendGamepad(bytes);
  }
  /**
   * Enumerate available microphone devices
   */
  async enumerateMicrophones() {
    if (!MicrophoneManager.isSupported()) {
      return [];
    }
    const manager = new MicrophoneManager();
    return await manager.enumerateDevices();
  }
}
function normalizeKeyToken(token) {
  const upper = token.toUpperCase();
  const alias = {
    ESC: "ESCAPE",
    RETURN: "ENTER",
    DEL: "DELETE",
    INS: "INSERT",
    PGUP: "PAGEUP",
    PGDN: "PAGEDOWN",
    SPACEBAR: "SPACE",
    " ": "SPACE"
  };
  if (alias[upper]) {
    return alias[upper];
  }
  if (upper.length === 1) {
    return upper;
  }
  if (/^F\d{1,2}$/.test(upper)) {
    return upper;
  }
  if (upper.startsWith("ARROW")) {
    return upper;
  }
  if (/^[A-Z0-9_]+$/.test(upper)) {
    return upper;
  }
  return null;
}
function normalizeEventKey(key) {
  const upper = key.toUpperCase();
  const alias = {
    ESC: "ESCAPE",
    " ": "SPACE"
  };
  if (alias[upper]) {
    return alias[upper];
  }
  return upper;
}
function normalizeEventCode(code) {
  if (!code) return null;
  const upper = code.toUpperCase();
  if (upper.startsWith("KEY") && upper.length === 4) {
    return upper.slice(3);
  }
  if (upper.startsWith("DIGIT") && upper.length === 6) {
    return upper.slice(5);
  }
  if (upper.startsWith("NUMPAD")) {
    return upper;
  }
  if (/^F\d{1,2}$/.test(upper)) {
    return upper;
  }
  if (upper.startsWith("ARROW")) {
    return upper;
  }
  if (upper === "SPACE") {
    return "SPACE";
  }
  if (upper === "ENTER" || upper === "NUMPADENTER") {
    return "ENTER";
  }
  if (/^[A-Z0-9_]+$/.test(upper)) {
    return upper;
  }
  return null;
}
function isKeyMatch(event, shortcutKey) {
  const byKey = normalizeEventKey(event.key) === shortcutKey;
  if (byKey) return true;
  const code = normalizeEventCode(event.code);
  if (!code) return false;
  if (code === shortcutKey) return true;
  if (shortcutKey.length === 1 && (code === `KEY${shortcutKey}` || code === `DIGIT${shortcutKey}`)) {
    return true;
  }
  if (shortcutKey === "ENTER" && code === "NUMPADENTER") {
    return true;
  }
  return false;
}
function isShortcutMatch(event, shortcut) {
  if (!shortcut.valid) return false;
  if (event.ctrlKey !== shortcut.ctrl) return false;
  if (event.altKey !== shortcut.alt) return false;
  if (event.shiftKey !== shortcut.shift) return false;
  if (event.metaKey !== shortcut.meta) return false;
  return isKeyMatch(event, shortcut.key);
}
function normalizeShortcut(raw) {
  const tokens = raw.split("+").map((part) => part.trim()).filter(Boolean);
  let ctrl = false;
  let alt = false;
  let shift = false;
  let meta = false;
  let keyToken = null;
  for (const token of tokens) {
    const upper = token.toUpperCase();
    if (upper === "CTRL" || upper === "CONTROL") {
      ctrl = true;
      continue;
    }
    if (upper === "ALT" || upper === "OPTION") {
      alt = true;
      continue;
    }
    if (upper === "SHIFT") {
      shift = true;
      continue;
    }
    if (upper === "META" || upper === "CMD" || upper === "COMMAND") {
      meta = true;
      continue;
    }
    if (keyToken) {
      return {
        key: "",
        ctrl,
        alt,
        shift,
        meta,
        valid: false,
        canonical: raw.trim()
      };
    }
    keyToken = token;
  }
  if (!keyToken) {
    return {
      key: "",
      ctrl,
      alt,
      shift,
      meta,
      valid: false,
      canonical: raw.trim()
    };
  }
  const normalizedKey = normalizeKeyToken(keyToken);
  if (!normalizedKey) {
    return {
      key: "",
      ctrl,
      alt,
      shift,
      meta,
      valid: false,
      canonical: raw.trim()
    };
  }
  const parts = [];
  if (ctrl) parts.push("Ctrl");
  if (alt) parts.push("Alt");
  if (shift) parts.push("Shift");
  if (meta) parts.push("Meta");
  parts.push(normalizedKey);
  return {
    key: normalizedKey,
    ctrl,
    alt,
    shift,
    meta,
    valid: true,
    canonical: parts.join("+")
  };
}
function formatShortcutForDisplay(raw, isMac2) {
  const parsed = normalizeShortcut(raw);
  if (!parsed.valid) {
    return raw;
  }
  const parts = [];
  if (parsed.ctrl) parts.push("Ctrl");
  if (parsed.alt) parts.push(isMac2 ? "Option" : "Alt");
  if (parsed.shift) parts.push("Shift");
  if (parsed.meta) parts.push(isMac2 ? "Cmd" : "Meta");
  parts.push(parsed.key);
  return parts.join("+");
}
const INTERACTIVE_SELECTOR = [
  "button",
  "a[href]",
  "input:not([type='hidden'])",
  "select",
  "textarea",
  "[role='button']",
  "[tabindex]:not([tabindex='-1'])"
].join(",");
const DIRECTION_INITIAL_REPEAT_MS = 240;
const DIRECTION_REPEAT_MS = 110;
function isElementInteractive(el) {
  return el instanceof HTMLElement;
}
function isElementVisible(el) {
  if (el.getClientRects().length === 0) return false;
  const style2 = window.getComputedStyle(el);
  if (style2.visibility === "hidden" || style2.display === "none") return false;
  return true;
}
function isElementDisabled(el) {
  if (el.getAttribute("aria-disabled") === "true") return true;
  if ("disabled" in el) {
    return Boolean(el.disabled);
  }
  return false;
}
function getFocusScopeRoot() {
  const exitDialog = document.querySelector(".sv-exit");
  if (exitDialog) return exitDialog;
  const navbarModal = document.querySelector(".navbar-modal");
  if (navbarModal) return navbarModal;
  const loginDropdown = document.querySelector(".login-dropdown");
  if (loginDropdown?.parentElement) return loginDropdown.parentElement;
  const regionDropdown = document.querySelector(".region-dropdown");
  if (regionDropdown?.parentElement) return regionDropdown.parentElement;
  const streamLoading = document.querySelector(".sload");
  if (streamLoading) return streamLoading;
  return document;
}
function listInteractiveElements() {
  const scopeRoot = getFocusScopeRoot();
  const candidates = Array.from(scopeRoot.querySelectorAll(INTERACTIVE_SELECTOR)).filter(isElementInteractive).filter((el) => el.tabIndex >= 0).filter((el) => !isElementDisabled(el) && isElementVisible(el));
  return candidates;
}
function getElementCenter(el) {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  };
}
function setControllerFocus(el) {
  document.querySelectorAll(".controller-focus").forEach((node) => {
    node.classList.remove("controller-focus");
  });
  el.classList.add("controller-focus");
  el.focus({ preventScroll: true });
  el.scrollIntoView({ block: "nearest", inline: "nearest" });
}
function adjustRangeInput(input, direction) {
  if (input.type !== "range") return false;
  if (direction !== "left" && direction !== "right" && direction !== "up" && direction !== "down") return false;
  const min = Number.parseFloat(input.min || "0");
  const max = Number.parseFloat(input.max || "100");
  const step = Number.parseFloat(input.step || "1");
  const current = Number.parseFloat(input.value || "0");
  if (!Number.isFinite(min) || !Number.isFinite(max) || !Number.isFinite(step) || !Number.isFinite(current)) {
    return false;
  }
  const delta = direction === "left" || direction === "down" ? -step : step;
  const next = Math.max(min, Math.min(max, current + delta));
  if (next === current) return true;
  input.value = String(next);
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
}
function setRangeEditMode(input) {
  document.querySelectorAll(".controller-range-editing").forEach((node) => {
    node.classList.remove("controller-range-editing");
  });
  if (input) {
    input.classList.add("controller-range-editing");
  }
}
function moveFocus(direction) {
  const current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  if (current instanceof HTMLInputElement && current.type === "range" && current.classList.contains("controller-range-editing") && adjustRangeInput(current, direction)) {
    return;
  }
  const items = listInteractiveElements();
  if (items.length === 0) return;
  const active = current && items.includes(current) ? current : null;
  if (!active) {
    setControllerFocus(items[0]);
    return;
  }
  const origin = getElementCenter(active);
  let best = null;
  for (const candidate of items) {
    if (candidate === active) continue;
    const center = getElementCenter(candidate);
    const dx = center.x - origin.x;
    const dy = center.y - origin.y;
    const inDirection = direction === "up" && dy < -4 || direction === "down" && dy > 4 || direction === "left" && dx < -4 || direction === "right" && dx > 4;
    if (!inDirection) continue;
    const primary = direction === "up" || direction === "down" ? Math.abs(dy) : Math.abs(dx);
    const secondary = direction === "up" || direction === "down" ? Math.abs(dx) : Math.abs(dy);
    const alignment = secondary / Math.max(primary, 1);
    const score = primary + secondary * 0.55 + alignment * 140;
    if (!best || score < best.score) {
      best = { element: candidate, score };
    }
  }
  if (best) {
    setControllerFocus(best.element);
    return;
  }
  if (direction === "left" || direction === "up") {
    setControllerFocus(items[items.length - 1]);
  } else {
    setControllerFocus(items[0]);
  }
}
function activateFocusedElement() {
  const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  if (!active || isElementDisabled(active) || !isElementVisible(active)) {
    const items = listInteractiveElements();
    if (items.length > 0) {
      setControllerFocus(items[0]);
    }
    return;
  }
  if (active instanceof HTMLInputElement) {
    if (active.type === "checkbox" || active.type === "radio") {
      active.click();
      return;
    }
    if (active.type === "range") {
      if (active.classList.contains("controller-range-editing")) {
        setRangeEditMode(null);
      } else {
        setRangeEditMode(active);
      }
      return;
    }
  }
  if (active.classList.contains("game-card")) {
    const playButton = active.querySelector(".game-card-play-button");
    if (playButton && !playButton.disabled) {
      playButton.click();
      return;
    }
  }
  active.click();
}
function triggerBackAction(onBackAction) {
  const openNavbarModalClose = document.querySelector(".navbar-modal-close");
  if (openNavbarModalClose) {
    openNavbarModalClose.click();
    return;
  }
  const openRegionToggle = document.querySelector(".region-selected.open");
  if (openRegionToggle) {
    openRegionToggle.click();
    return;
  }
  const openLoginToggle = document.querySelector(".login-select.open");
  if (openLoginToggle) {
    openLoginToggle.click();
    return;
  }
  const active = document.activeElement;
  if (active instanceof HTMLInputElement && active.type === "range" && active.classList.contains("controller-range-editing")) {
    setRangeEditMode(null);
    return;
  }
  if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) {
    active.blur();
    return;
  }
  if (onBackAction?.()) {
    return;
  }
  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
}
function useControllerNavigation({
  enabled,
  onNavigatePage,
  onBackAction
}) {
  const [controllerConnected, setControllerConnected] = reactExports.useState(false);
  const connectedRef = reactExports.useRef(false);
  const frameRef = reactExports.useRef(null);
  const directionStateRef = reactExports.useRef({
    up: { pressed: false, nextRepeatAt: 0 },
    down: { pressed: false, nextRepeatAt: 0 },
    left: { pressed: false, nextRepeatAt: 0 },
    right: { pressed: false, nextRepeatAt: 0 }
  });
  const actionStateRef = reactExports.useRef({
    a: false,
    b: false,
    lb: false,
    rb: false
  });
  reactExports.useEffect(() => {
    if (!controllerConnected || !enabled) return;
    const items = listInteractiveElements();
    if (items.length === 0) return;
    const current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (!current || !items.includes(current) || !isElementVisible(current) || isElementDisabled(current)) {
      setControllerFocus(items[0]);
    }
  }, [controllerConnected, enabled]);
  reactExports.useEffect(() => {
    function updateConnected(next) {
      if (connectedRef.current !== next) {
        connectedRef.current = next;
        setControllerConnected(next);
      }
    }
    const tick = () => {
      const pads = navigator.getGamepads ? navigator.getGamepads() : [];
      const pad = Array.from(pads).find((candidate) => candidate?.connected) ?? null;
      updateConnected(Boolean(pad));
      if (!pad || !enabled) {
        for (const state of Object.values(directionStateRef.current)) {
          state.pressed = false;
        }
        actionStateRef.current = { a: false, b: false, lb: false, rb: false };
        frameRef.current = window.requestAnimationFrame(tick);
        return;
      }
      const now2 = performance.now();
      const up = Boolean(pad.buttons[12]?.pressed || pad.axes[1] < -0.55);
      const down = Boolean(pad.buttons[13]?.pressed || pad.axes[1] > 0.55);
      const left = Boolean(pad.buttons[14]?.pressed || pad.axes[0] < -0.55);
      const right = Boolean(pad.buttons[15]?.pressed || pad.axes[0] > 0.55);
      const a = Boolean(pad.buttons[0]?.pressed);
      const b = Boolean(pad.buttons[1]?.pressed);
      const lb = Boolean(pad.buttons[4]?.pressed);
      const rb = Boolean(pad.buttons[5]?.pressed);
      const scopedToDocument = getFocusScopeRoot() === document;
      const handleDirection = (direction, pressed) => {
        const state = directionStateRef.current[direction];
        if (!pressed) {
          state.pressed = false;
          return;
        }
        if (!state.pressed) {
          state.pressed = true;
          state.nextRepeatAt = now2 + DIRECTION_INITIAL_REPEAT_MS;
          moveFocus(direction);
          return;
        }
        if (now2 >= state.nextRepeatAt) {
          state.nextRepeatAt = now2 + DIRECTION_REPEAT_MS;
          moveFocus(direction);
        }
      };
      handleDirection("up", up);
      handleDirection("down", down);
      handleDirection("left", left);
      handleDirection("right", right);
      if (a && !actionStateRef.current.a) {
        activateFocusedElement();
      }
      if (b && !actionStateRef.current.b) {
        triggerBackAction(onBackAction);
      }
      if (scopedToDocument && lb && !actionStateRef.current.lb) {
        onNavigatePage?.("prev");
      }
      if (scopedToDocument && rb && !actionStateRef.current.rb) {
        onNavigatePage?.("next");
      }
      actionStateRef.current = { a, b, lb, rb };
      frameRef.current = window.requestAnimationFrame(tick);
    };
    frameRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      setRangeEditMode(null);
      document.querySelectorAll(".controller-focus").forEach((node) => {
        node.classList.remove("controller-focus");
      });
    };
  }, [enabled, onBackAction, onNavigatePage]);
  return controllerConnected;
}
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const mergeClasses = (...classes) => classes.filter((className, index2, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index2;
}).join(" ").trim();
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
  return false;
};
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Icon = reactExports.forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => reactExports.createElement(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const createLucideIcon = (iconName, iconNode) => {
  const Component2 = reactExports.forwardRef(
    ({ className, ...props }, ref) => reactExports.createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component2.displayName = toPascalCase(iconName);
  return Component2;
};
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$v = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]];
const Check = createLucideIcon("check", __iconNode$v);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$u = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = createLucideIcon("chevron-down", __iconNode$u);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$t = [
  [
    "path",
    {
      d: "M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z",
      key: "kmsa83"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
];
const CirclePlay = createLucideIcon("circle-play", __iconNode$t);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$s = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode$s);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$r = [
  ["path", { d: "M12 6v6h4", key: "135r8i" }],
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
];
const Clock3 = createLucideIcon("clock-3", __iconNode$r);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$q = [
  ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }],
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
];
const Clock = createLucideIcon("clock", __iconNode$q);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$p = [
  ["path", { d: "M12 20v2", key: "1lh1kg" }],
  ["path", { d: "M12 2v2", key: "tus03m" }],
  ["path", { d: "M17 20v2", key: "1rnc9c" }],
  ["path", { d: "M17 2v2", key: "11trls" }],
  ["path", { d: "M2 12h2", key: "1t8f8n" }],
  ["path", { d: "M2 17h2", key: "7oei6x" }],
  ["path", { d: "M2 7h2", key: "asdhe0" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  ["path", { d: "M20 17h2", key: "1fpfkl" }],
  ["path", { d: "M20 7h2", key: "1o8tra" }],
  ["path", { d: "M7 20v2", key: "4gnj0m" }],
  ["path", { d: "M7 2v2", key: "1i4yhu" }],
  ["rect", { x: "4", y: "4", width: "16", height: "16", rx: "2", key: "1vbyd7" }],
  ["rect", { x: "8", y: "8", width: "8", height: "8", rx: "1", key: "z9xiuo" }]
];
const Cpu = createLucideIcon("cpu", __iconNode$p);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$o = [
  ["line", { x1: "6", x2: "10", y1: "11", y2: "11", key: "1gktln" }],
  ["line", { x1: "8", x2: "8", y1: "9", y2: "13", key: "qnk9ow" }],
  ["line", { x1: "15", x2: "15.01", y1: "12", y2: "12", key: "krot7o" }],
  ["line", { x1: "18", x2: "18.01", y1: "10", y2: "10", key: "1lcuu1" }],
  [
    "path",
    {
      d: "M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z",
      key: "mfqc10"
    }
  ]
];
const Gamepad2 = createLucideIcon("gamepad-2", __iconNode$o);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$n = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
  ["path", { d: "M2 12h20", key: "9i4pu4" }]
];
const Globe = createLucideIcon("globe", __iconNode$n);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$m = [
  ["line", { x1: "22", x2: "2", y1: "12", y2: "12", key: "1y58io" }],
  [
    "path",
    {
      d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
      key: "oot6mr"
    }
  ],
  ["line", { x1: "6", x2: "6.01", y1: "16", y2: "16", key: "sgf278" }],
  ["line", { x1: "10", x2: "10.01", y1: "16", y2: "16", key: "1l4acy" }]
];
const HardDrive = createLucideIcon("hard-drive", __iconNode$m);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$l = [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "r6nss1"
    }
  ]
];
const House = createLucideIcon("house", __iconNode$l);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$k = [
  ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" }],
  ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1", key: "6d4xhi" }],
  ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1", key: "nxv5o0" }],
  ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" }]
];
const LayoutGrid = createLucideIcon("layout-grid", __iconNode$k);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$j = [
  ["path", { d: "m16 6 4 14", key: "ji33uf" }],
  ["path", { d: "M12 6v14", key: "1n7gus" }],
  ["path", { d: "M8 8v12", key: "1gg7y9" }],
  ["path", { d: "M4 4v16", key: "6qkkli" }]
];
const Library = createLucideIcon("library", __iconNode$j);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$i = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode$i);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$h = [
  ["path", { d: "M12 2v4", key: "3427ic" }],
  ["path", { d: "m16.2 7.8 2.9-2.9", key: "r700ao" }],
  ["path", { d: "M18 12h4", key: "wj9ykh" }],
  ["path", { d: "m16.2 16.2 2.9 2.9", key: "1bxg5t" }],
  ["path", { d: "M12 18v4", key: "jadmvz" }],
  ["path", { d: "m4.9 19.1 2.9-2.9", key: "bwix9q" }],
  ["path", { d: "M2 12h4", key: "j09sii" }],
  ["path", { d: "m4.9 4.9 2.9 2.9", key: "giyufr" }]
];
const Loader = createLucideIcon("loader", __iconNode$h);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$g = [
  ["path", { d: "m10 17 5-5-5-5", key: "1bsop3" }],
  ["path", { d: "M15 12H3", key: "6jk70r" }],
  ["path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4", key: "u53s6r" }]
];
const LogIn = createLucideIcon("log-in", __iconNode$g);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$f = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
];
const LogOut = createLucideIcon("log-out", __iconNode$f);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$e = [
  ["path", { d: "M8 3H5a2 2 0 0 0-2 2v3", key: "1dcmit" }],
  ["path", { d: "M21 8V5a2 2 0 0 0-2-2h-3", key: "1e4gt3" }],
  ["path", { d: "M3 16v3a2 2 0 0 0 2 2h3", key: "wsl5sc" }],
  ["path", { d: "M16 21h3a2 2 0 0 0 2-2v-3", key: "18trek" }]
];
const Maximize = createLucideIcon("maximize", __iconNode$e);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$d = [
  ["path", { d: "M12 19v3", key: "npa21l" }],
  ["path", { d: "M15 9.34V5a3 3 0 0 0-5.68-1.33", key: "1gzdoj" }],
  ["path", { d: "M16.95 16.95A7 7 0 0 1 5 12v-2", key: "cqa7eg" }],
  ["path", { d: "M18.89 13.23A7 7 0 0 0 19 12v-2", key: "16hl24" }],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  ["path", { d: "M9 9v3a3 3 0 0 0 5.12 2.12", key: "r2i35w" }]
];
const MicOff = createLucideIcon("mic-off", __iconNode$d);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$c = [
  ["path", { d: "M12 19v3", key: "npa21l" }],
  ["path", { d: "M19 10v2a7 7 0 0 1-14 0v-2", key: "1vc78b" }],
  ["rect", { x: "9", y: "2", width: "6", height: "13", rx: "3", key: "s6n7sd" }]
];
const Mic = createLucideIcon("mic", __iconNode$c);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$b = [
  ["path", { d: "M8 3v3a2 2 0 0 1-2 2H3", key: "hohbtr" }],
  ["path", { d: "M21 8h-3a2 2 0 0 1-2-2V3", key: "5jw1f3" }],
  ["path", { d: "M3 16h3a2 2 0 0 1 2 2v3", key: "198tvr" }],
  ["path", { d: "M16 21v-3a2 2 0 0 1 2-2h3", key: "ph8mxp" }]
];
const Minimize = createLucideIcon("minimize", __iconNode$b);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$a = [
  ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2", key: "48i651" }],
  ["line", { x1: "8", x2: "16", y1: "21", y2: "21", key: "1svkeh" }],
  ["line", { x1: "12", x2: "12", y1: "17", y2: "21", key: "vw1qmm" }]
];
const Monitor = createLucideIcon("monitor", __iconNode$a);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$9 = [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
];
const Play = createLucideIcon("play", __iconNode$9);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$8 = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode$8);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$7 = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode$7);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings = createLucideIcon("settings", __iconNode$6);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["line", { x1: "10", x2: "14", y1: "2", y2: "2", key: "14vaq8" }],
  ["line", { x1: "12", x2: "15", y1: "14", y2: "11", key: "17fdiu" }],
  ["circle", { cx: "12", cy: "14", r: "8", key: "1e1u0o" }]
];
const Timer = createLucideIcon("timer", __iconNode$5);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const TriangleAlert = createLucideIcon("triangle-alert", __iconNode$4);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode$3);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M12 20h.01", key: "zekei9" }],
  ["path", { d: "M2 8.82a15 15 0 0 1 20 0", key: "dnpr2z" }],
  ["path", { d: "M5 12.859a10 10 0 0 1 14 0", key: "1x1e6c" }],
  ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0", key: "1bycff" }]
];
const Wifi = createLucideIcon("wifi", __iconNode$2);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode$1);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
];
const Zap = createLucideIcon("zap", __iconNode);
function LoginScreen({
  providers,
  selectedProviderId,
  onProviderChange,
  onLogin,
  isLoading,
  error,
  isInitializing = false,
  statusMessage
}) {
  const [isDropdownOpen, setIsDropdownOpen] = reactExports.useState(false);
  const dropdownRef = reactExports.useRef(null);
  const selectedProvider = providers.find((p) => p.idpId === selectedProviderId);
  reactExports.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleProviderSelect = (providerId) => {
    onProviderChange(providerId);
    setIsDropdownOpen(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "login-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "login-bg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "login-bg-orb login-bg-orb--1" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "login-bg-orb login-bg-orb--2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "login-bg-orb login-bg-orb--3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "login-bg-noise" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "login-content", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "login-brand", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "login-brand-mark", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 20, strokeWidth: 2.5 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "login-brand-name", children: "OpenNOW" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "login-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "login-card-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Sign in" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Cloud gaming, open source." })
        ] }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "login-error", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "login-error-dot" }),
          error
        ] }),
        isInitializing && statusMessage && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "login-status", role: "status", "aria-live": "polite", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "login-status-dot" }),
          statusMessage
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "login-field", ref: dropdownRef, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "login-label", children: "Provider" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: `login-select ${isDropdownOpen ? "open" : ""}`,
              onClick: () => setIsDropdownOpen(!isDropdownOpen),
              disabled: isLoading || isInitializing,
              type: "button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "login-select-text", children: isInitializing ? "Loading..." : selectedProvider?.displayName ?? "Select provider" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ChevronDown,
                  {
                    size: 16,
                    className: `login-select-chevron ${isDropdownOpen ? "rotated" : ""}`
                  }
                )
              ]
            }
          ),
          isDropdownOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "login-dropdown", children: providers.map((provider) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: `login-dropdown-item ${provider.idpId === selectedProviderId ? "selected" : ""}`,
              onClick: () => handleProviderSelect(provider.idpId),
              type: "button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: provider.displayName }),
                provider.idpId === selectedProviderId && /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" }) })
              ]
            },
            provider.idpId
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `login-button ${isLoading || isInitializing ? "loading" : ""}`,
            onClick: onLogin,
            disabled: isLoading || isInitializing || !selectedProviderId,
            type: "button",
            children: isLoading || isInitializing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "login-spinner" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isInitializing ? "Restoring Session..." : "Connecting..." })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { size: 18 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sign In" })
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "login-footer", children: "Open-source cloud gaming client" })
    ] })
  ] });
}
function getTierDisplay(tier) {
  const t = tier.toUpperCase();
  if (t === "ULTIMATE") return { label: "Ultimate", className: "tier-ultimate" };
  if (t === "PRIORITY" || t === "PERFORMANCE") return { label: "Priority", className: "tier-priority" };
  return { label: "Free", className: "tier-free" };
}
function Navbar({
  currentPage,
  onNavigate,
  user,
  subscription,
  activeSession,
  activeSessionGameTitle,
  isResumingSession,
  onResumeSession,
  onLogout
}) {
  const [modalType, setModalType] = reactExports.useState(null);
  const navItems = [
    { id: "home", label: "Store", icon: House },
    { id: "library", label: "Library", icon: Library },
    { id: "settings", label: "Settings", icon: Settings }
  ];
  const tierInfo = user ? getTierDisplay(user.membershipTier) : null;
  const formatHours = (value) => {
    if (!Number.isFinite(value)) return "0";
    const rounded = value >= 10 ? Math.round(value) : Math.round(value * 10) / 10;
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  };
  const formatGb = (value) => {
    if (!Number.isFinite(value)) return "0";
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
  };
  const formatPercent = (value) => {
    if (!Number.isFinite(value)) return "0%";
    const rounded = Math.max(0, Math.min(100, Math.round(value)));
    return `${rounded}%`;
  };
  const formatDateTime = (value) => {
    if (!value) return null;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed.toLocaleString();
  };
  const clamp2 = (value) => Math.min(1, Math.max(0, value));
  const toneByLeftRatio = (ratio) => {
    if (ratio <= 0.15) return "critical";
    if (ratio <= 0.4) return "warn";
    return "good";
  };
  const timeTotal = subscription?.totalHours ?? 0;
  const timeLeft = subscription?.remainingHours ?? 0;
  const timeUsed = subscription?.usedHours ?? Math.max(timeTotal - timeLeft, 0);
  const allottedHours = subscription?.allottedHours ?? 0;
  const purchasedHours = subscription?.purchasedHours ?? 0;
  const rolledOverHours = subscription?.rolledOverHours ?? 0;
  const timeUsedRatio = subscription && !subscription.isUnlimited && timeTotal > 0 ? clamp2(timeUsed / timeTotal) : 0;
  const timeLeftRatio = subscription && !subscription.isUnlimited && timeTotal > 0 ? clamp2(timeLeft / timeTotal) : 1;
  const timeTone = subscription?.isUnlimited ? "good" : toneByLeftRatio(timeLeftRatio);
  const timeLabel = subscription ? subscription.isUnlimited ? "Unlimited time" : `${formatHours(timeLeft)}h left` : null;
  const storageTotal = subscription?.storageAddon?.sizeGb;
  const storageUsed = subscription?.storageAddon?.usedGb;
  const storageHasData = storageTotal !== void 0 && storageUsed !== void 0;
  const storageLeft = storageHasData ? Math.max(storageTotal - storageUsed, 0) : void 0;
  const storageUsedRatio = storageHasData && storageTotal > 0 ? clamp2(storageUsed / storageTotal) : 0;
  const storageLeftRatio = storageHasData && storageTotal > 0 ? clamp2((storageLeft ?? 0) / storageTotal) : 1;
  const storageTone = toneByLeftRatio(storageLeftRatio);
  const storageLabel = storageHasData ? `${formatGb(storageLeft ?? 0)} GB left` : storageTotal !== void 0 ? `${formatGb(storageTotal)} GB total` : null;
  const spanStart = formatDateTime(subscription?.currentSpanStartDateTime);
  const spanEnd = formatDateTime(subscription?.currentSpanEndDateTime);
  const firstEntitlementStart = formatDateTime(subscription?.firstEntitlementStartDateTime);
  const modalTitle = modalType === "time" ? "Playtime Details" : "Storage Details";
  const activeSessionTitle = activeSessionGameTitle?.trim() || null;
  reactExports.useEffect(() => {
    if (!modalType) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setModalType(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [modalType]);
  const modal = modalType && subscription ? reactDomExports.createPortal(
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "navbar-modal-backdrop", onClick: () => setModalType(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "navbar-modal",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": modalTitle,
        onClick: (event) => event.stopPropagation(),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-modal-header", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: modalTitle }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "navbar-modal-close",
                onClick: () => setModalType(null),
                title: "Close",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
              }
            )
          ] }),
          modalType === "time" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-modal-body", children: [
            !subscription.isUnlimited && timeTotal > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-meter", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-meter-head", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Time Usage" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                  formatPercent(timeUsedRatio * 100),
                  " used"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "navbar-meter-track", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `navbar-meter-fill navbar-meter-fill--${timeTone}`,
                  style: { width: `${timeUsedRatio * 100}%` }
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-meter-legend", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  formatHours(timeUsed),
                  "h used"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  formatHours(timeLeft),
                  "h left"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-modal-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Tier" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: subscription.membershipTier })
            ] }),
            subscription.subscriptionType && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-modal-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: subscription.subscriptionType })
            ] }),
            subscription.subscriptionSubType && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-modal-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sub Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: subscription.subscriptionSubType })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-modal-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Time Left" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: subscription.isUnlimited ? "Unlimited" : `${formatHours(timeLeft)}h` })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-modal-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total Time" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: subscription.isUnlimited ? "Unlimited" : `${formatHours(timeTotal)}h` })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-modal-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Used Time" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                formatHours(timeUsed),
                "h"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-modal-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Allotted" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                formatHours(allottedHours),
                "h"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-modal-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Purchased" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                formatHours(purchasedHours),
                "h"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-modal-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Rolled Over" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                formatHours(rolledOverHours),
                "h"
              ] })
            ] }),
            firstEntitlementStart && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-modal-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "First Entitlement" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: firstEntitlementStart })
            ] }),
            spanStart && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-modal-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Period Start" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: spanStart })
            ] }),
            spanEnd && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-modal-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Period End" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: spanEnd })
            ] }),
            subscription.notifyUserWhenTimeRemainingInMinutes !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-modal-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Notify At (General)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                subscription.notifyUserWhenTimeRemainingInMinutes,
                " min"
              ] })
            ] }),
            subscription.notifyUserOnSessionWhenRemainingTimeInMinutes !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-modal-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Notify At (In Session)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                subscription.notifyUserOnSessionWhenRemainingTimeInMinutes,
                " min"
              ] })
            ] }),
            subscription.state && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-modal-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Plan State" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: subscription.state })
            ] }),
            subscription.isGamePlayAllowed !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-modal-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Gameplay Allowed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: subscription.isGamePlayAllowed ? "Yes" : "No" })
            ] })
          ] }),
          modalType === "storage" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-modal-body", children: [
            storageHasData && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-meter", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-meter-head", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Storage Usage" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                  formatPercent(storageUsedRatio * 100),
                  " used"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "navbar-meter-track", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `navbar-meter-fill navbar-meter-fill--${storageTone}`,
                  style: { width: `${storageUsedRatio * 100}%` }
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-meter-legend", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  formatGb(storageUsed ?? 0),
                  " GB used"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  formatGb(storageLeft ?? 0),
                  " GB left"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-modal-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Storage Left" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: storageLeft !== void 0 ? `${formatGb(storageLeft)} GB` : "N/A" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-modal-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Storage Used" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: storageUsed !== void 0 ? `${formatGb(storageUsed)} GB` : "N/A" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-modal-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Storage Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: storageTotal !== void 0 ? `${formatGb(storageTotal)} GB` : "N/A" })
            ] }),
            subscription.storageAddon?.regionName && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-modal-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Storage Region" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: subscription.storageAddon.regionName })
            ] }),
            subscription.storageAddon?.regionCode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-modal-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Storage Region Code" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: subscription.storageAddon.regionCode })
            ] }),
            subscription.serverRegionId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-modal-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Server Region (VPC)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: subscription.serverRegionId })
            ] })
          ] })
        ]
      }
    ) }),
    document.body
  ) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "navbar", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "navbar-brand", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 16, strokeWidth: 2.5 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "navbar-logo-text", children: "OpenNOW" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "navbar-nav", children: navItems.map((item) => {
      const Icon2 = item.icon;
      const isActive = currentPage === item.id;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => onNavigate(item.id),
          className: `navbar-link ${isActive ? "active" : ""}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon2, { size: 16 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.label })
          ]
        },
        item.id
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-right", children: [
      activeSession && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: `navbar-session-resume${isResumingSession ? " is-loading" : ""}`,
          title: activeSession.serverIp ? activeSessionTitle ? `Resume active cloud session: ${activeSessionTitle}` : "Resume active cloud session" : "Active session found (missing server address)",
          onClick: onResumeSession,
          disabled: isResumingSession || !activeSession.serverIp,
          children: [
            isResumingSession ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "navbar-session-resume-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlay, { size: 14 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "navbar-session-resume-text", children: "Resume" }),
            activeSessionTitle && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "navbar-session-resume-game", children: activeSessionTitle })
          ]
        }
      ),
      (timeLabel || storageLabel) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-subscription", "aria-label": "Subscription details", children: [
        timeLabel && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: `navbar-subscription-chip navbar-subscription-chip--${timeTone}`,
            title: "Show playtime details",
            onClick: () => setModalType("time"),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { size: 14 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: timeLabel })
            ]
          }
        ),
        storageLabel && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: `navbar-subscription-chip navbar-subscription-chip--${storageTone}`,
            title: "Show storage details",
            onClick: () => setModalType("storage"),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { size: 14 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: storageLabel })
            ]
          }
        )
      ] }),
      user ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-user", children: [
          user.avatarUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: user.avatarUrl, alt: user.displayName, className: "navbar-avatar" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "navbar-avatar-fallback", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 14 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-user-info", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "navbar-username", children: user.displayName }),
            tierInfo && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `navbar-tier ${tierInfo.className}`, children: tierInfo.label })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onLogout, className: "navbar-logout", title: "Sign out", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 16 }) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-guest", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 14 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Guest" })
      ] })
    ] }),
    modal
  ] });
}
function SteamIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", width: "14", height: "14", fill: "currentColor", className: "store-svg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z" }) });
}
function EpicIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", width: "14", height: "14", fill: "currentColor", className: "store-svg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M3.537 0C2.165 0 1.66.506 1.66 1.879V18.44a4.262 4.262 0 00.02.433c.031.3.037.59.316.92.027.033.311.245.311.245.153.075.258.13.43.2l8.335 3.491c.433.199.614.276.928.27h.002c.314.006.495-.071.928-.27l8.335-3.492c.172-.07.277-.124.43-.2 0 0 .284-.211.311-.243.28-.33.285-.621.316-.92a4.261 4.261 0 00.02-.434V1.879c0-1.373-.506-1.88-1.878-1.88zm13.366 3.11h.68c1.138 0 1.688.553 1.688 1.696v1.88h-1.374v-1.8c0-.369-.17-.54-.523-.54h-.235c-.367 0-.537.17-.537.539v5.81c0 .369.17.54.537.54h.262c.353 0 .523-.171.523-.54V8.619h1.373v2.143c0 1.144-.562 1.71-1.7 1.71h-.694c-1.138 0-1.7-.566-1.7-1.71V4.82c0-1.144.562-1.709 1.7-1.709zm-12.186.08h3.114v1.274H6.117v2.603h1.648v1.275H6.117v2.774h1.74v1.275h-3.14zm3.816 0h2.198c1.138 0 1.7.564 1.7 1.708v2.445c0 1.144-.562 1.71-1.7 1.71h-.799v3.338h-1.4zm4.53 0h1.4v9.201h-1.4zm-3.13 1.235v3.392h.575c.354 0 .523-.171.523-.54V4.965c0-.368-.17-.54-.523-.54zm-3.74 10.147a1.708 1.708 0 01.591.108 1.745 1.745 0 01.49.299l-.452.546a1.247 1.247 0 00-.308-.195.91.91 0 00-.363-.068.658.658 0 00-.28.06.703.703 0 00-.224.163.783.783 0 00-.151.243.799.799 0 00-.056.299v.008a.852.852 0 00.056.31.7.7 0 00.157.245.736.736 0 00.238.16.774.774 0 00.303.058.79.79 0 00.445-.116v-.339h-.548v-.565H7.37v1.255a2.019 2.019 0 01-.524.307 1.789 1.789 0 01-.683.123 1.642 1.642 0 01-.602-.107 1.46 1.46 0 01-.478-.3 1.371 1.371 0 01-.318-.455 1.438 1.438 0 01-.115-.58v-.008a1.426 1.426 0 01.113-.57 1.449 1.449 0 01.312-.46 1.418 1.418 0 01.474-.309 1.58 1.58 0 01.598-.111 1.708 1.708 0 01.045 0zm11.963.008a2.006 2.006 0 01.612.094 1.61 1.61 0 01.507.277l-.386.546a1.562 1.562 0 00-.39-.205 1.178 1.178 0 00-.388-.07.347.347 0 00-.208.052.154.154 0 00-.07.127v.008a.158.158 0 00.022.084.198.198 0 00.076.066.831.831 0 00.147.06c.062.02.14.04.236.061a3.389 3.389 0 01.43.122 1.292 1.292 0 01.328.17.678.678 0 01.207.24.739.739 0 01.071.337v.008a.865.865 0 01-.081.382.82.82 0 01-.229.285 1.032 1.032 0 01-.353.18 1.606 1.606 0 01-.46.061 2.16 2.16 0 01-.71-.116 1.718 1.718 0 01-.593-.346l.43-.514c.277.223.578.335.9.335a.457.457 0 00.236-.05.157.157 0 00.082-.142v-.008a.15.15 0 00-.02-.077.204.204 0 00-.073-.066.753.753 0 00-.143-.062 2.45 2.45 0 00-.233-.062 5.036 5.036 0 01-.413-.113 1.26 1.26 0 01-.331-.16.72.72 0 01-.222-.243.73.73 0 01-.082-.36v-.008a.863.863 0 01.074-.359.794.794 0 01.214-.283 1.007 1.007 0 01.34-.185 1.423 1.423 0 01.448-.066 2.006 2.006 0 01.025 0zm-9.358.025h.742l1.183 2.81h-.825l-.203-.499H8.623l-.198.498h-.81zm2.197.02h.814l.663 1.08.663-1.08h.814v2.79h-.766v-1.602l-.711 1.091h-.016l-.707-1.083v1.593h-.754zm3.469 0h2.235v.658h-1.473v.422h1.334v.61h-1.334v.442h1.493v.658h-2.255zm-5.3.897l-.315.793h.624zm-1.145 5.19h8.014l-4.09 1.348z" }) });
}
function UbisoftIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", width: "14", height: "14", fill: "currentColor", className: "store-svg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M23.561 11.988C23.301-.304 6.954-4.89.656 6.634c.282.206.661.477.943.672a11.747 11.747 0 00-.976 3.067 11.885 11.885 0 00-.184 2.071C.439 18.818 5.621 24 12.005 24c6.385 0 11.556-5.17 11.556-11.556v-.455zm-20.27 2.06c-.152 1.246-.054 1.636-.054 1.788l-.282.098c-.108-.206-.37-.932-.488-1.908C2.163 10.308 4.7 6.96 8.57 6.33c3.544-.52 6.937 1.68 7.728 4.758l-.282.098c-.087-.087-.228-.336-.77-.878-4.281-4.281-11.002-2.32-11.956 3.74zm11.002 2.081a3.145 3.145 0 01-2.59 1.355 3.15 3.15 0 01-3.155-3.155 3.159 3.159 0 012.927-3.144c1.018-.043 1.972.51 2.416 1.398a2.58 2.58 0 01-.455 2.95c.293.205.575.4.856.595zm6.58.12c-1.669 3.782-5.106 5.766-8.77 5.712-7.034-.347-9.083-8.466-4.38-11.393l.207.206c-.076.108-.358.325-.791 1.182-.51 1.041-.672 2.081-.607 2.732.369 5.67 8.314 6.83 11.045 1.214C21.057 8.217 11.822.401 3.626 6.374l-.184-.184C5.599 2.808 9.816 1.3 13.837 2.309c6.147 1.55 9.453 7.956 7.035 13.94z" }) });
}
function EaIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", width: "14", height: "14", fill: "currentColor", className: "store-svg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16.635 6.162l-5.928 9.377H4.24l1.508-2.3h4.024l1.474-2.335H2.264L.79 13.239h2.156L0 17.84h12.072l4.563-7.259 1.652 2.66h-1.401l-1.473 2.299h4.347l1.473 2.3H24zm-11.461.107L3.7 8.604l9.52-.035 1.474-2.3z" }) });
}
function GogIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", width: "14", height: "14", fill: "currentColor", className: "store-svg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M7.15 15.24H4.36a.4.4 0 0 0-.4.4v2c0 .21.18.4.4.4h2.8v1.32h-3.5c-.56 0-1.02-.46-1.02-1.03v-3.39c0-.56.46-1.02 1.03-1.02h3.48v1.32zM8.16 11.54c0 .58-.47 1.05-1.05 1.05H2.63v-1.35h3.78a.4.4 0 0 0 .4-.4V6.39a.4.4 0 0 0-.4-.4H4.39a.4.4 0 0 0-.41.4v2.02c0 .23.18.4.4.4H6v1.35H3.68c-.58 0-1.05-.46-1.05-1.04V5.68c0-.57.47-1.04 1.05-1.04H7.1c.58 0 1.05.47 1.05 1.04v5.86zM21.36 19.36h-1.32v-4.12h-.93a.4.4 0 0 0-.4.4v3.72h-1.33v-4.12h-.93a.4.4 0 0 0-.4.4v3.72h-1.33v-4.42c0-.56.46-1.02 1.03-1.02h5.61v5.44zM21.37 11.54c0 .58-.47 1.05-1.05 1.05h-4.48v-1.35h3.78a.4.4 0 0 0 .4-.4V6.39a.4.4 0 0 0-.4-.4h-2.03a.4.4 0 0 0-.4.4v2.02c0 .23.18.4.4.4h1.62v1.35H16.9c-.58 0-1.05-.46-1.05-1.04V5.68c0-.57.47-1.04 1.05-1.04h3.43c.58 0 1.05.47 1.05 1.04v5.86zM13.72 4.64h-3.44c-.58 0-1.04.47-1.04 1.04v3.44c0 .58.46 1.04 1.04 1.04h3.44c.57 0 1.04-.46 1.04-1.04V5.68c0-.57-.47-1.04-1.04-1.04m-.3 1.75v2.02a.4.4 0 0 1-.4.4h-2.03a.4.4 0 0 1-.4-.4V6.4c0-.22.17-.4.4-.4H13c.23 0 .4.18.4.4zM12.63 13.92H9.24c-.57 0-1.03.46-1.03 1.02v3.39c0 .57.46 1.03 1.03 1.03h3.39c.57 0 1.03-.46 1.03-1.03v-3.39c0-.56-.46-1.02-1.03-1.02m-.3 1.72v2a.4.4 0 0 1-.4.4v-.01H9.94a.4.4 0 0 1-.4-.4v-1.99c0-.22.18-.4.4-.4h2c.22 0 .4.18.4.4zM23.49 1.1a1.74 1.74 0 0 0-1.24-.52H1.75A1.74 1.74 0 0 0 0 2.33v19.34a1.74 1.74 0 0 0 1.75 1.75h20.5A1.74 1.74 0 0 0 24 21.67V2.33c0-.48-.2-.92-.51-1.24m0 20.58a1.23 1.23 0 0 1-1.24 1.24H1.75A1.23 1.23 0 0 1 .5 21.67V2.33a1.23 1.23 0 0 1 1.24-1.24h20.5a1.24 1.24 0 0 1 1.24 1.24v19.34z" }) });
}
function XboxIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", width: "14", height: "14", fill: "currentColor", className: "store-svg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M6.43,3.72C6.5,3.66 6.57,3.6 6.62,3.56C8.18,2.55 10,2 12,2C13.88,2 15.64,2.5 17.14,3.42C17.25,3.5 17.54,3.69 17.7,3.88C16.25,2.28 12,5.7 12,5.7C10.5,4.57 9.17,3.8 8.16,3.5C7.31,3.29 6.73,3.5 6.46,3.7M19.34,5.21C19.29,5.16 19.24,5.11 19.2,5.06C18.84,4.66 18.38,4.56 18,4.59C17.61,4.71 15.9,5.32 13.8,7.31C13.8,7.31 16.17,9.61 17.62,11.96C19.07,14.31 19.93,16.16 19.4,18.73C21,16.95 22,14.59 22,12C22,9.38 21,7 19.34,5.21M15.73,12.96C15.08,12.24 14.13,11.21 12.86,9.95C12.59,9.68 12.3,9.4 12,9.1C12,9.1 11.53,9.56 10.93,10.17C10.16,10.94 9.17,11.95 8.61,12.54C7.63,13.59 4.81,16.89 4.65,18.74C4.65,18.74 4,17.28 5.4,13.89C6.3,11.68 9,8.36 10.15,7.28C10.15,7.28 9.12,6.14 7.82,5.35L7.77,5.32C7.14,4.95 6.46,4.66 5.8,4.62C5.13,4.67 4.71,5.16 4.71,5.16C3.03,6.95 2,9.35 2,12A10,10 0 0,0 12,22C14.93,22 17.57,20.74 19.4,18.73C19.4,18.73 19.19,17.4 17.84,15.5C17.53,15.07 16.37,13.69 15.73,12.96Z" }) });
}
function BattleNetIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", width: "14", height: "14", fill: "currentColor", className: "store-svg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M18.94 8.296C15.9 6.892 11.534 6 7.426 6.332c.206-1.36.714-2.308 1.548-2.508 1.148-.275 2.4.48 3.594 1.854.782.102 1.71.28 2.355.429C12.747 2.013 9.828-.282 7.607.565c-1.688.644-2.553 2.97-2.448 6.094-2.2.468-3.915 1.3-5.013 2.495-.056.065-.181.227-.137.305.034.058.146-.008.194-.04 1.274-.89 2.904-1.373 5.027-1.676.303 3.333 1.713 7.56 4.055 10.952-1.28.502-2.356.536-2.946-.087-.812-.856-.784-2.318-.19-4.04a26.764 26.764 0 01-.807-2.254c-2.459 3.934-2.986 7.61-1.143 9.11 1.402 1.14 3.847.725 6.502-.926 1.505 1.672 3.083 2.74 4.667 3.094.084.015.287.043.332-.034.034-.06-.08-.124-.131-.149-1.408-.657-2.64-1.828-3.964-3.515 2.735-1.929 5.691-5.263 7.457-8.988 1.076.86 1.64 1.773 1.398 2.595-.336 1.131-1.615 1.84-3.403 2.185a27.697 27.697 0 01-1.548 1.826c4.634.16 8.08-1.22 8.458-3.565.286-1.786-1.295-3.696-4.053-5.17.696-2.139.832-4.04.346-5.588-.029-.08-.106-.27-.196-.27-.068 0-.067.13-.063.187.135 1.547-.263 3.2-1.062 5.19zm-8.533 9.869c-1.96-3.145-3.09-6.849-3.082-10.594 3.702-.124 7.474.748 10.714 2.627-1.743 3.269-4.385 6.1-7.633 7.966h.001z" }) });
}
function DefaultStoreIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", width: "14", height: "14", fill: "currentColor", className: "store-svg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" }) });
}
const STORE_ICON_MAP = {
  STEAM: SteamIcon,
  EPIC_GAMES_STORE: EpicIcon,
  EPIC: EpicIcon,
  EGS: EpicIcon,
  UPLAY: UbisoftIcon,
  UBISOFT: UbisoftIcon,
  UBISOFT_CONNECT: UbisoftIcon,
  EA_APP: EaIcon,
  EA: EaIcon,
  ORIGIN: EaIcon,
  GOG_COM: GogIcon,
  GOG: GogIcon,
  XBOX_GAME_PASS: XboxIcon,
  XBOX: XboxIcon,
  MICROSOFT_STORE: XboxIcon,
  MICROSOFT: XboxIcon,
  BATTLE_NET: BattleNetIcon,
  BATTLENET: BattleNetIcon
};
const STORE_DISPLAY_NAME = {
  STEAM: "Steam",
  EPIC_GAMES_STORE: "Epic",
  EPIC: "Epic",
  EGS: "Epic",
  UPLAY: "Ubisoft",
  UBISOFT: "Ubisoft",
  UBISOFT_CONNECT: "Ubisoft",
  EA_APP: "EA",
  EA: "EA",
  ORIGIN: "EA",
  GOG_COM: "GOG",
  GOG: "GOG",
  XBOX_GAME_PASS: "Xbox",
  XBOX: "Xbox",
  MICROSOFT_STORE: "Xbox",
  MICROSOFT: "Xbox",
  BATTLE_NET: "Battle.net",
  BATTLENET: "Battle.net"
};
function normalizeStoreKey(raw) {
  return raw.toUpperCase().replace(/[\s-]+/g, "_");
}
function getUniqueStores(game) {
  const seen2 = /* @__PURE__ */ new Set();
  const stores = [];
  for (const v of game.variants) {
    const key = normalizeStoreKey(v.store);
    if (key !== "UNKNOWN" && key !== "NONE" && !seen2.has(key)) {
      seen2.add(key);
      stores.push(key);
    }
  }
  return stores;
}
const GameCard = reactExports.memo(function GameCard2({ game, isSelected = false, onPlay, onSelect }) {
  const stores = getUniqueStores(game);
  const handlePlayClick = (event) => {
    event.stopPropagation();
    onPlay();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `game-card ${isSelected ? "selected" : ""}`,
      onClick: onSelect,
      onKeyDown: (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onPlay();
        }
      },
      role: "button",
      tabIndex: 0,
      "aria-label": `Select ${game.title}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-card-image-wrapper", children: [
          game.imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: game.imageUrl,
              alt: game.title,
              className: "game-card-image",
              loading: "lazy"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "game-card-image-placeholder", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { size: 40 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-card-overlay", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "game-card-gradient" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "game-card-play-button",
                onClick: handlePlayClick,
                "aria-label": `Play ${game.title}`,
                tabIndex: -1,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 24, fill: "currentColor" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-card-info", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "game-card-title", title: game.title, children: game.title }),
          stores.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "game-card-stores", children: stores.map((store) => {
            const IconComponent = STORE_ICON_MAP[store] ?? DefaultStoreIcon;
            const displayName = STORE_DISPLAY_NAME[store] ?? store;
            return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "game-card-store-chip", title: displayName, children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconComponent, {}) }, store);
          }) })
        ] })
      ]
    }
  );
});
function HomePage({
  games,
  source,
  onSourceChange,
  searchQuery,
  onSearchChange,
  onPlayGame,
  isLoading,
  selectedGameId,
  onSelectGame
}) {
  const hasGames = games.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "home-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "home-toolbar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "home-tabs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: `home-tab ${source === "main" ? "active" : ""}`,
            onClick: () => onSourceChange("main"),
            disabled: isLoading,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { size: 15 }),
              "Catalog"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: `home-tab ${source === "public" ? "active" : ""}`,
            onClick: () => onSourceChange("public"),
            disabled: isLoading,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 15 }),
              "Public"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "home-search", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "home-search-icon", size: 16 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            className: "home-search-input",
            placeholder: "Search games...",
            value: searchQuery,
            onChange: (e) => onSearchChange(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "home-count", children: isLoading ? "Loading..." : `${games.length} game${games.length !== 1 ? "s" : ""}` })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "home-grid-area", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "home-empty-state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "home-spinner", size: 36 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Loading games..." })
    ] }) : !hasGames ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "home-empty-state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { size: 44, className: "home-empty-icon" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "No games found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: searchQuery ? "Try adjusting your search terms" : "Check back later for new additions" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "game-grid", children: games.map((game, index2) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      GameCard,
      {
        game,
        isSelected: game.id === selectedGameId,
        onSelect: () => onSelectGame(game.id),
        onPlay: () => onPlayGame(game)
      },
      `${game.id}-${index2}`
    )) }) })
  ] });
}
function formatLastPlayed(date) {
  if (!date) return "Never played";
  const lastPlayed = new Date(date);
  const now2 = /* @__PURE__ */ new Date();
  const diffMs = now2.getTime() - lastPlayed.getTime();
  const diffMins = Math.floor(diffMs / 6e4);
  const diffHours = Math.floor(diffMs / 36e5);
  const diffDays = Math.floor(diffMs / 864e5);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return lastPlayed.toLocaleDateString();
}
function LibraryPage({
  games,
  searchQuery,
  onSearchChange,
  onPlayGame,
  isLoading,
  selectedGameId,
  onSelectGame
}) {
  const filteredGames = searchQuery.trim() ? games.filter(
    (game) => game.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
  ) : games;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "library-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "library-toolbar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "library-title", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Library, { className: "library-title-icon", size: 22 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "My Library" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "library-search", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "library-search-icon", size: 16 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: searchQuery,
            onChange: (e) => onSearchChange(e.target.value),
            placeholder: "Search your library...",
            className: "library-search-input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "library-count", children: [
        games.length,
        " game",
        games.length !== 1 ? "s" : ""
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "library-grid-area", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "library-empty-state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "library-spinner", size: 36 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Loading your library..." })
    ] }) : games.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "library-empty-state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Gamepad2, { className: "library-empty-icon", size: 44 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Your library is empty" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Games you own will appear here. Browse the catalog to find games." })
    ] }) : filteredGames.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "library-empty-state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "library-empty-icon", size: 44 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "No results" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "No games match “",
        searchQuery,
        "”"
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "game-grid", children: filteredGames.map((game, index2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "library-game-wrapper", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        GameCard,
        {
          game,
          isSelected: game.id === selectedGameId,
          onSelect: () => onSelectGame(game.id),
          onPlay: () => onPlayGame(game)
        }
      ),
      game.lastPlayed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "library-last-played", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 12 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatLastPlayed(game.lastPlayed) })
      ] })
    ] }, `${game.id}-${index2}`)) }) })
  ] });
}
const codecOptions = ["H264", "H265", "AV1"];
const accelerationOptions = [
  { value: "auto", label: "Auto" },
  { value: "hardware", label: "Hardware" },
  { value: "software", label: "Software (CPU)" }
];
const colorQualityOptions = [
  { value: "8bit_420", label: "8-bit 4:2:0", description: "Most compatible" },
  { value: "8bit_444", label: "8-bit 4:4:4", description: "Better color" },
  { value: "10bit_420", label: "10-bit 4:2:0", description: "HDR ready" },
  { value: "10bit_444", label: "10-bit 4:4:4", description: "Best quality" }
];
const STATIC_RESOLUTION_PRESETS = [
  { value: "1280x720", label: "720p" },
  { value: "1920x1080", label: "1080p" },
  { value: "2560x1440", label: "1440p" },
  { value: "3840x2160", label: "4K" },
  { value: "2560x1080", label: "Ultrawide 1080p" },
  { value: "3440x1440", label: "Ultrawide 1440p" },
  { value: "5120x1440", label: "Super Ultrawide" }
];
const STATIC_FPS_PRESETS = [
  { value: 30 },
  { value: 60 },
  { value: 90 },
  { value: 120 },
  { value: 144 },
  { value: 165 },
  { value: 240 },
  { value: 360 }
];
const isMac$1 = navigator.platform.toLowerCase().includes("mac");
const shortcutExamples = "Examples: F3, Ctrl+Shift+Q, Ctrl+Shift+K";
const shortcutDefaults = {
  shortcutToggleStats: "F3",
  shortcutTogglePointerLock: "F8",
  shortcutStopStream: "Ctrl+Shift+Q",
  shortcutToggleAntiAfk: "Ctrl+Shift+K",
  shortcutToggleMicrophone: "Ctrl+Shift+M"
};
const microphoneModeOptions = [
  { value: "disabled", label: "Disabled" },
  { value: "push-to-talk", label: "Push-to-Talk" },
  { value: "voice-activity", label: "Voice Activity" }
];
const ASPECT_RATIO_ORDER = [
  "16:9 Standard",
  "16:10 Widescreen",
  "21:9 Ultrawide",
  "32:9 Super Ultrawide",
  "4:3 Legacy",
  "Other"
];
function classifyAspectRatio(width, height) {
  const ratio = width / height;
  if (Math.abs(ratio - 16 / 9) < 0.05) return "16:9 Standard";
  if (Math.abs(ratio - 16 / 10) < 0.05) return "16:10 Widescreen";
  if (Math.abs(ratio - 21 / 9) < 0.05) return "21:9 Ultrawide";
  if (Math.abs(ratio - 32 / 9) < 0.05) return "32:9 Super Ultrawide";
  if (Math.abs(ratio - 4 / 3) < 0.05) return "4:3 Legacy";
  return "Other";
}
function friendlyResolutionName(width, height) {
  if (width === 1280 && height === 720) return "720p (HD)";
  if (width === 1920 && height === 1080) return "1080p (FHD)";
  if (width === 2560 && height === 1440) return "1440p (QHD)";
  if (width === 3840 && height === 2160) return "4K (UHD)";
  if (width === 2560 && height === 1080) return "2560x1080 (UW)";
  if (width === 3440 && height === 1440) return "3440x1440 (UW)";
  if (width === 5120 && height === 1440) return "5120x1440 (SUW)";
  return `${width}x${height}`;
}
function groupResolutions(entitled) {
  const seen2 = /* @__PURE__ */ new Set();
  const unique = [];
  const sorted = [...entitled].sort((a, b) => b.width - a.width || b.height - a.height);
  for (const res of sorted) {
    const key = `${res.width}x${res.height}`;
    if (seen2.has(key)) continue;
    seen2.add(key);
    unique.push(res);
  }
  const groupMap = /* @__PURE__ */ new Map();
  for (const res of unique) {
    const cat = classifyAspectRatio(res.width, res.height);
    const value = `${res.width}x${res.height}`;
    const label = friendlyResolutionName(res.width, res.height);
    if (!groupMap.has(cat)) groupMap.set(cat, []);
    groupMap.get(cat).push({ width: res.width, height: res.height, value, label });
  }
  const result = [];
  for (const cat of ASPECT_RATIO_ORDER) {
    const items = groupMap.get(cat);
    if (items && items.length > 0) {
      result.push({ category: cat, resolutions: items });
    }
  }
  return result;
}
function getFpsForResolution(entitled, resolution) {
  const parts = resolution.split("x");
  const w = parseInt(parts[0], 10);
  const h = parseInt(parts[1], 10);
  let fpsList = entitled.filter((r) => r.width === w && r.height === h).map((r) => r.fps);
  if (fpsList.length === 0) {
    fpsList = entitled.map((r) => r.fps);
  }
  return [...new Set(fpsList)].sort((a, b) => a - b);
}
const CODEC_TEST_CONFIGS = [
  {
    name: "H264",
    webrtcMime: "video/H264",
    decodeContentType: 'video/mp4; codecs="avc1.42E01E"',
    encodeContentType: 'video/mp4; codecs="avc1.42E01E"',
    profiles: [
      { label: "Baseline", contentType: 'video/mp4; codecs="avc1.42E01E"' },
      { label: "Main", contentType: 'video/mp4; codecs="avc1.4D401E"' },
      { label: "High", contentType: 'video/mp4; codecs="avc1.64001E"' }
    ]
  },
  {
    name: "H265",
    webrtcMime: "video/H265",
    decodeContentType: 'video/mp4; codecs="hev1.1.6.L93.B0"',
    encodeContentType: 'video/mp4; codecs="hev1.1.6.L93.B0"',
    profiles: [
      { label: "Main", contentType: 'video/mp4; codecs="hev1.1.6.L93.B0"' },
      { label: "Main 10", contentType: 'video/mp4; codecs="hev1.2.4.L93.B0"' }
    ]
  },
  {
    name: "AV1",
    webrtcMime: "video/AV1",
    decodeContentType: 'video/mp4; codecs="av01.0.08M.08"',
    encodeContentType: 'video/mp4; codecs="av01.0.08M.08"',
    profiles: [
      { label: "Main 8-bit", contentType: 'video/mp4; codecs="av01.0.08M.08"' },
      { label: "Main 10-bit", contentType: 'video/mp4; codecs="av01.0.08M.10"' }
    ]
  }
];
const CODEC_TEST_RESULTS_STORAGE_KEY = "opennow.codec-test-results.v1";
const ENTITLED_RESOLUTIONS_STORAGE_KEY = "opennow.entitled-resolutions.v1";
function loadStoredCodecResults() {
  try {
    const raw = window.sessionStorage.getItem(CODEC_TEST_RESULTS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}
function loadCachedEntitledResolutions() {
  try {
    const raw = window.sessionStorage.getItem(ENTITLED_RESOLUTIONS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.userId !== "string" || !Array.isArray(parsed.entitledResolutions)) {
      return null;
    }
    return {
      userId: parsed.userId,
      entitledResolutions: parsed.entitledResolutions
    };
  } catch {
    return null;
  }
}
function saveCachedEntitledResolutions(cache) {
  try {
    window.sessionStorage.setItem(ENTITLED_RESOLUTIONS_STORAGE_KEY, JSON.stringify(cache));
  } catch {
  }
}
function isLinuxArmClient() {
  const platform = navigator.platform?.toLowerCase() ?? "";
  const ua = navigator.userAgent?.toLowerCase() ?? "";
  const linux = platform.includes("linux") || ua.includes("linux");
  const arm = /(aarch64|arm64|armv\d|arm)/.test(platform) || /(aarch64|arm64|armv\d|arm)/.test(ua);
  return linux && arm;
}
function guessDecodeBackend(hwAccelerated) {
  if (!hwAccelerated) return "Software (CPU)";
  const platform = navigator.platform?.toLowerCase() ?? "";
  const ua = navigator.userAgent?.toLowerCase() ?? "";
  if (platform.includes("win") || ua.includes("windows")) return "D3D11 (GPU)";
  if (platform.includes("mac") || ua.includes("macintosh")) return "VideoToolbox (GPU)";
  if (platform.includes("linux") || ua.includes("linux")) {
    return isLinuxArmClient() ? "V4L2 (GPU)" : "VA-API (GPU)";
  }
  return "Hardware (GPU)";
}
function guessEncodeBackend(hwAccelerated) {
  if (!hwAccelerated) return "Software (CPU)";
  const platform = navigator.platform?.toLowerCase() ?? "";
  const ua = navigator.userAgent?.toLowerCase() ?? "";
  if (platform.includes("win") || ua.includes("windows")) return "Media Foundation (GPU)";
  if (platform.includes("mac") || ua.includes("macintosh")) return "VideoToolbox (GPU)";
  if (platform.includes("linux") || ua.includes("linux")) {
    return isLinuxArmClient() ? "V4L2 (GPU)" : "VA-API (GPU)";
  }
  return "Hardware (GPU)";
}
async function testCodecSupport() {
  const results = [];
  const webrtcCaps = RTCRtpReceiver.getCapabilities?.("video");
  const webrtcCodecMimes = new Set(
    webrtcCaps?.codecs.map((c) => c.mimeType.toLowerCase()) ?? []
  );
  const webrtcProfiles = /* @__PURE__ */ new Map();
  if (webrtcCaps) {
    for (const c of webrtcCaps.codecs) {
      const mime = c.mimeType.toLowerCase();
      const sdpLine = c.sdpFmtpLine ?? "";
      if (!mime.includes("rtx") && !mime.includes("red") && !mime.includes("ulpfec")) {
        const existing = webrtcProfiles.get(mime) ?? [];
        if (sdpLine) existing.push(sdpLine);
        webrtcProfiles.set(mime, existing);
      }
    }
  }
  for (const config of CODEC_TEST_CONFIGS) {
    const webrtcSupported = webrtcCodecMimes.has(config.webrtcMime.toLowerCase());
    const profiles = webrtcProfiles.get(config.webrtcMime.toLowerCase()) ?? [];
    let decodeSupported = false;
    let hwAccelerated = false;
    try {
      const decodeResult = await navigator.mediaCapabilities.decodingInfo({
        type: "webrtc",
        video: {
          contentType: config.webrtcMime === "video/H265" ? "video/h265" : config.webrtcMime.toLowerCase(),
          width: 1920,
          height: 1080,
          framerate: 60,
          bitrate: 2e7
        }
      });
      decodeSupported = decodeResult.supported;
      hwAccelerated = decodeResult.powerEfficient;
    } catch {
      try {
        const decodeResult = await navigator.mediaCapabilities.decodingInfo({
          type: "file",
          video: {
            contentType: config.decodeContentType,
            width: 1920,
            height: 1080,
            framerate: 60,
            bitrate: 2e7
          }
        });
        decodeSupported = decodeResult.supported;
        hwAccelerated = decodeResult.powerEfficient;
      } catch {
      }
    }
    let encodeSupported = false;
    let encodeHwAccelerated = false;
    try {
      const encodeResult = await navigator.mediaCapabilities.encodingInfo({
        type: "webrtc",
        video: {
          contentType: config.webrtcMime === "video/H265" ? "video/h265" : config.webrtcMime.toLowerCase(),
          width: 1920,
          height: 1080,
          framerate: 60,
          bitrate: 2e7
        }
      });
      encodeSupported = encodeResult.supported;
      encodeHwAccelerated = encodeResult.powerEfficient;
    } catch {
      try {
        const encodeResult = await navigator.mediaCapabilities.encodingInfo({
          type: "record",
          video: {
            contentType: config.encodeContentType,
            width: 1920,
            height: 1080,
            framerate: 60,
            bitrate: 2e7
          }
        });
        encodeSupported = encodeResult.supported;
        encodeHwAccelerated = encodeResult.powerEfficient;
      } catch {
      }
    }
    results.push({
      codec: config.name,
      webrtcSupported,
      decodeSupported: decodeSupported || webrtcSupported,
      // WebRTC support implies decode
      hwAccelerated,
      encodeSupported,
      encodeHwAccelerated,
      decodeVia: decodeSupported || webrtcSupported ? guessDecodeBackend(hwAccelerated) : "Unsupported",
      encodeVia: encodeSupported ? guessEncodeBackend(encodeHwAccelerated) : "Unsupported",
      profiles
    });
  }
  return results;
}
function SettingsPage({ settings, regions, onSettingChange }) {
  const [savedIndicator, setSavedIndicator] = reactExports.useState(false);
  const [regionSearch, setRegionSearch] = reactExports.useState("");
  const [regionDropdownOpen, setRegionDropdownOpen] = reactExports.useState(false);
  const initialCodecResults = reactExports.useMemo(() => loadStoredCodecResults(), []);
  const [codecResults, setCodecResults] = reactExports.useState(initialCodecResults);
  const [codecTesting, setCodecTesting] = reactExports.useState(false);
  const [codecTestOpen, setCodecTestOpen] = reactExports.useState(() => initialCodecResults !== null);
  const platformHardwareLabel = reactExports.useMemo(() => {
    const platform = navigator.platform.toLowerCase();
    if (platform.includes("win")) return "D3D11 / DXVA";
    if (platform.includes("mac")) return "VideoToolbox";
    if (platform.includes("linux")) return isLinuxArmClient() ? "V4L2" : "VA-API";
    return "Hardware";
  }, []);
  const runCodecTest = reactExports.useCallback(async () => {
    setCodecTesting(true);
    setCodecTestOpen(true);
    try {
      const results = await testCodecSupport();
      setCodecResults(results);
    } catch (err) {
      console.error("Codec test failed:", err);
    } finally {
      setCodecTesting(false);
    }
  }, []);
  reactExports.useEffect(() => {
    try {
      if (codecResults && codecResults.length > 0) {
        window.sessionStorage.setItem(CODEC_TEST_RESULTS_STORAGE_KEY, JSON.stringify(codecResults));
      } else {
        window.sessionStorage.removeItem(CODEC_TEST_RESULTS_STORAGE_KEY);
      }
    } catch {
    }
  }, [codecResults]);
  const [toggleStatsInput, setToggleStatsInput] = reactExports.useState(settings.shortcutToggleStats);
  const [togglePointerLockInput, setTogglePointerLockInput] = reactExports.useState(settings.shortcutTogglePointerLock);
  const [stopStreamInput, setStopStreamInput] = reactExports.useState(settings.shortcutStopStream);
  const [toggleAntiAfkInput, setToggleAntiAfkInput] = reactExports.useState(settings.shortcutToggleAntiAfk);
  const [toggleMicrophoneInput, setToggleMicrophoneInput] = reactExports.useState(settings.shortcutToggleMicrophone);
  const [toggleStatsError, setToggleStatsError] = reactExports.useState(false);
  const [togglePointerLockError, setTogglePointerLockError] = reactExports.useState(false);
  const [stopStreamError, setStopStreamError] = reactExports.useState(false);
  const [toggleAntiAfkError, setToggleAntiAfkError] = reactExports.useState(false);
  const [toggleMicrophoneError, setToggleMicrophoneError] = reactExports.useState(false);
  const [entitledResolutions, setEntitledResolutions] = reactExports.useState([]);
  const [subscriptionLoading, setSubscriptionLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    setToggleStatsInput(settings.shortcutToggleStats);
  }, [settings.shortcutToggleStats]);
  reactExports.useEffect(() => {
    setTogglePointerLockInput(settings.shortcutTogglePointerLock);
  }, [settings.shortcutTogglePointerLock]);
  reactExports.useEffect(() => {
    setStopStreamInput(settings.shortcutStopStream);
  }, [settings.shortcutStopStream]);
  reactExports.useEffect(() => {
    setToggleAntiAfkInput(settings.shortcutToggleAntiAfk);
  }, [settings.shortcutToggleAntiAfk]);
  reactExports.useEffect(() => {
    setToggleMicrophoneInput(settings.shortcutToggleMicrophone);
  }, [settings.shortcutToggleMicrophone]);
  reactExports.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const sessionResult = await window.openNow.getAuthSession();
        const session = sessionResult.session;
        if (!session || cancelled) {
          setEntitledResolutions([]);
          setSubscriptionLoading(false);
          return;
        }
        const userId = session.user.userId;
        const cached = loadCachedEntitledResolutions();
        if (cached && cached.userId === userId) {
          setEntitledResolutions(cached.entitledResolutions);
          setSubscriptionLoading(false);
          return;
        }
        const sub = await window.openNow.fetchSubscription({
          userId
        });
        if (!cancelled) {
          setEntitledResolutions(sub.entitledResolutions);
          saveCachedEntitledResolutions({
            userId,
            entitledResolutions: sub.entitledResolutions
          });
        }
      } catch (err) {
        console.warn("Failed to fetch subscription for settings:", err);
      } finally {
        if (!cancelled) setSubscriptionLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);
  const hasDynamic = entitledResolutions.length > 0;
  const resolutionGroups = reactExports.useMemo(
    () => hasDynamic ? groupResolutions(entitledResolutions) : [],
    [entitledResolutions, hasDynamic]
  );
  const dynamicFpsOptions = reactExports.useMemo(
    () => hasDynamic ? getFpsForResolution(entitledResolutions, settings.resolution) : [],
    [entitledResolutions, settings.resolution, hasDynamic]
  );
  const handleChange = reactExports.useCallback(
    (key, value) => {
      onSettingChange(key, value);
      setSavedIndicator(true);
      setTimeout(() => setSavedIndicator(false), 1500);
    },
    [onSettingChange]
  );
  const handleColorQualityChange = reactExports.useCallback(
    (cq) => {
      handleChange("colorQuality", cq);
      if (colorQualityRequiresHevc(cq) && settings.codec === "H264") {
        handleChange("codec", "H265");
      }
    },
    [handleChange, settings.codec]
  );
  const [microphoneDevices, setMicrophoneDevices] = reactExports.useState([]);
  const [microphonePermissionError, setMicrophonePermissionError] = reactExports.useState(null);
  const [microphoneModeDropdownOpen, setMicrophoneModeDropdownOpen] = reactExports.useState(false);
  const [microphoneDeviceDropdownOpen, setMicrophoneDeviceDropdownOpen] = reactExports.useState(false);
  const microphoneModeDropdownRef = reactExports.useRef(null);
  const microphoneDeviceDropdownRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (settings.microphoneMode === "disabled") {
      setMicrophoneDevices([]);
      return;
    }
    let cancelled = false;
    async function enumerateDevices() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
        const devices = await navigator.mediaDevices.enumerateDevices();
        if (!cancelled) {
          const audioInputs = devices.filter((d) => d.kind === "audioinput");
          setMicrophoneDevices(audioInputs);
          setMicrophonePermissionError(null);
        }
      } catch (err) {
        console.error("[SettingsPage] Failed to enumerate microphone devices:", err);
        if (!cancelled) {
          setMicrophonePermissionError("Microphone access denied. Please allow microphone permission in your system settings.");
          setMicrophoneDevices([]);
        }
      }
    }
    enumerateDevices();
    return () => {
      cancelled = true;
    };
  }, [settings.microphoneMode]);
  const filteredRegions = reactExports.useMemo(() => {
    if (!regionSearch.trim()) return regions;
    const q = regionSearch.trim().toLowerCase();
    return regions.filter((r) => r.name.toLowerCase().includes(q));
  }, [regions, regionSearch]);
  const selectedRegionName = reactExports.useMemo(() => {
    if (!settings.region) return "Auto (Best)";
    const found = regions.find((r) => r.url === settings.region);
    return found?.name ?? settings.region;
  }, [settings.region, regions]);
  const selectedMicrophoneModeName = reactExports.useMemo(() => {
    return microphoneModeOptions.find((option) => option.value === settings.microphoneMode)?.label ?? "Disabled";
  }, [settings.microphoneMode]);
  const selectedMicrophoneDeviceName = reactExports.useMemo(() => {
    if (!settings.microphoneDeviceId) return "Default Device";
    const found = microphoneDevices.find((device) => device.deviceId === settings.microphoneDeviceId);
    return found?.label || "Selected Device";
  }, [settings.microphoneDeviceId, microphoneDevices]);
  reactExports.useEffect(() => {
    if (settings.microphoneMode === "disabled") {
      setMicrophoneDeviceDropdownOpen(false);
    }
  }, [settings.microphoneMode]);
  reactExports.useEffect(() => {
    const handlePointerDown = (event) => {
      const target = event.target;
      if (microphoneModeDropdownRef.current && !microphoneModeDropdownRef.current.contains(target)) {
        setMicrophoneModeDropdownOpen(false);
      }
      if (microphoneDeviceDropdownRef.current && !microphoneDeviceDropdownRef.current.contains(target)) {
        setMicrophoneDeviceDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);
  const handleShortcutBlur = (key, rawValue, setInput, setError) => {
    const normalized = normalizeShortcut(rawValue.trim());
    if (!normalized.valid) {
      setError(true);
      return;
    }
    setError(false);
    setInput(normalized.canonical);
    if (settings[key] !== normalized.canonical) {
      handleChange(key, normalized.canonical);
    }
  };
  const handleShortcutKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  };
  const areShortcutsDefault = reactExports.useMemo(
    () => settings.shortcutToggleStats === shortcutDefaults.shortcutToggleStats && settings.shortcutTogglePointerLock === shortcutDefaults.shortcutTogglePointerLock && settings.shortcutStopStream === shortcutDefaults.shortcutStopStream && settings.shortcutToggleAntiAfk === shortcutDefaults.shortcutToggleAntiAfk && settings.shortcutToggleMicrophone === shortcutDefaults.shortcutToggleMicrophone,
    [
      settings.shortcutToggleStats,
      settings.shortcutTogglePointerLock,
      settings.shortcutStopStream,
      settings.shortcutToggleAntiAfk,
      settings.shortcutToggleMicrophone
    ]
  );
  const handleResetShortcuts = reactExports.useCallback(() => {
    setToggleStatsInput(shortcutDefaults.shortcutToggleStats);
    setTogglePointerLockInput(shortcutDefaults.shortcutTogglePointerLock);
    setStopStreamInput(shortcutDefaults.shortcutStopStream);
    setToggleAntiAfkInput(shortcutDefaults.shortcutToggleAntiAfk);
    setToggleMicrophoneInput(shortcutDefaults.shortcutToggleMicrophone);
    setToggleStatsError(false);
    setTogglePointerLockError(false);
    setStopStreamError(false);
    setToggleAntiAfkError(false);
    setToggleMicrophoneError(false);
    const shortcutKeys = [
      "shortcutToggleStats",
      "shortcutTogglePointerLock",
      "shortcutStopStream",
      "shortcutToggleAntiAfk",
      "shortcutToggleMicrophone"
    ];
    for (const key of shortcutKeys) {
      const value = shortcutDefaults[key];
      if (settings[key] !== value) {
        handleChange(key, value);
      }
    }
  }, [handleChange, settings]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "settings-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `settings-saved ${savedIndicator ? "visible" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14 }),
        "Saved"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-sections", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "settings-section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-section-header", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Video" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-rows", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-row settings-row--column", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "settings-label", children: [
              "Resolution",
              subscriptionLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(Loader, { size: 12, className: "settings-loading-icon" })
            ] }),
            hasDynamic ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-preset-groups", children: resolutionGroups.map((group) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-preset-group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-preset-group-label", children: group.category }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-chip-row", children: group.resolutions.map((res) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: `settings-chip ${settings.resolution === res.value ? "active" : ""}`,
                  onClick: () => {
                    handleChange("resolution", res.value);
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: res.label })
                },
                res.value
              )) })
            ] }, group.category)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-chip-row", children: STATIC_RESOLUTION_PRESETS.map((preset) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: `settings-chip ${settings.resolution === preset.value ? "active" : ""}`,
                onClick: () => {
                  handleChange("resolution", preset.value);
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: preset.label })
              },
              preset.value
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "settings-label", children: "FPS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-chip-row", children: (hasDynamic ? dynamicFpsOptions.map((v) => ({ value: v })) : STATIC_FPS_PRESETS).map(
              (preset) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: `settings-chip ${settings.fps === preset.value ? "active" : ""}`,
                  onClick: () => {
                    handleChange("fps", preset.value);
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: preset.value })
                },
                preset.value
              )
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "settings-label", children: "Codec" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-chip-row", children: codecOptions.map((codec) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: `settings-chip ${settings.codec === codec ? "active" : ""}`,
                onClick: () => handleChange("codec", codec),
                children: codec
              },
              codec
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-row settings-row--column", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "settings-label", children: "Decoder" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-chip-row", children: accelerationOptions.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: `settings-chip ${settings.decoderPreference === option.value ? "active" : ""}`,
                onClick: () => handleChange("decoderPreference", option.value),
                title: option.value === "hardware" ? platformHardwareLabel : option.label,
                children: option.value === "hardware" ? platformHardwareLabel : option.label
              },
              `decoder-${option.value}`
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-subtle-hint", children: "Applies after app restart." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-row settings-row--column", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "settings-label", children: "Encoder" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-chip-row", children: accelerationOptions.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: `settings-chip ${settings.encoderPreference === option.value ? "active" : ""}`,
                onClick: () => handleChange("encoderPreference", option.value),
                title: option.value === "hardware" ? platformHardwareLabel : option.label,
                children: option.value === "hardware" ? platformHardwareLabel : option.label
              },
              `encoder-${option.value}`
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-subtle-hint", children: "Applies after app restart." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-row settings-row--column", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "settings-label", children: "Color Depth" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-chip-row", children: colorQualityOptions.map((opt) => {
              const needsHevc = colorQualityRequiresHevc(opt.value);
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: `settings-chip ${settings.colorQuality === opt.value ? "active" : ""}`,
                  onClick: () => handleColorQualityChange(opt.value),
                  title: `${opt.description}${needsHevc ? " — requires H265/AV1" : ""}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: opt.label })
                },
                opt.value
              );
            }) }),
            colorQualityRequiresHevc(settings.colorQuality) && settings.codec === "H264" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-input-hint", children: "This mode requires H265 or AV1. Codec will be auto-switched." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-row settings-row--column", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-row-top", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "settings-label", children: "Max Bitrate" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "settings-value-badge", children: [
                settings.maxBitrateMbps,
                " Mbps"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "range",
                className: "settings-slider",
                min: 5,
                max: 150,
                step: 5,
                value: settings.maxBitrateMbps,
                onChange: (e) => handleChange("maxBitrateMbps", parseInt(e.target.value, 10))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-row settings-row--column", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-row-top", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "settings-label", children: "Session Timer Reappear" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-value-badge", children: settings.sessionClockShowEveryMinutes === 0 ? "Off" : `Every ${settings.sessionClockShowEveryMinutes} min` })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "range",
                className: "settings-slider",
                min: 0,
                max: 120,
                step: 5,
                value: settings.sessionClockShowEveryMinutes,
                onChange: (e) => handleChange("sessionClockShowEveryMinutes", parseInt(e.target.value, 10))
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-subtle-hint", children: "How often the session timer pops back up while streaming (0 disables repeats)." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-row settings-row--column", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-row-top", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "settings-label", children: "Session Timer Visible Time" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "settings-value-badge", children: [
                settings.sessionClockShowDurationSeconds,
                "s"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "range",
                className: "settings-slider",
                min: 5,
                max: 120,
                step: 5,
                value: settings.sessionClockShowDurationSeconds,
                onChange: (e) => handleChange("sessionClockShowDurationSeconds", parseInt(e.target.value, 10))
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-subtle-hint", children: "How long the session timer stays visible each time it appears." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "settings-section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-section-header", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Codec Diagnostics" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-rows", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-row codec-test-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "settings-label codec-test-description", children: "Test which codecs your system can decode/encode and whether they use GPU or CPU" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "codec-test-btn",
                onClick: runCodecTest,
                disabled: codecTesting,
                type: "button",
                children: codecTesting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Loader, { size: 16, className: "settings-loading-icon" }),
                  "Testing..."
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 16 }),
                  codecResults ? "Retest" : "Test Codecs"
                ] })
              }
            )
          ] }),
          codecTestOpen && codecResults && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "codec-results", children: codecResults.map((result) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "codec-result-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "codec-result-header", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "codec-result-name", children: result.codec }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `codec-result-badge ${result.webrtcSupported ? "supported" : "unsupported"}`, children: result.webrtcSupported ? "WebRTC Ready" : "Not in WebRTC" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "codec-result-rows", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "codec-result-row", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "codec-result-direction", children: "Decode" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `codec-result-status ${result.decodeSupported ? result.hwAccelerated ? "hw" : "sw" : "none"}`, children: result.decodeSupported ? result.hwAccelerated ? "GPU" : "CPU" : "No" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "codec-result-via", children: result.decodeVia })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "codec-result-row", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "codec-result-direction", children: "Encode" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `codec-result-status ${result.encodeSupported ? result.encodeHwAccelerated ? "hw" : "sw" : "none"}`, children: result.encodeSupported ? result.encodeHwAccelerated ? "GPU" : "CPU" : "No" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "codec-result-via", children: result.encodeVia })
              ] })
            ] }),
            result.profiles.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "codec-result-profiles", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "codec-result-profiles-label", children: "Profiles:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "codec-result-profiles-list", children: result.profiles.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "codec-result-profile", children: p }, i)) })
            ] })
          ] }, result.codec)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "settings-section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-section-header", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Audio" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-rows", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "settings-label", children: [
              "Microphone",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-hint", children: "Enable voice chat during streaming" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-dropdown", ref: microphoneModeDropdownRef, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: `settings-dropdown-selected ${microphoneModeDropdownOpen ? "open" : ""}`,
                  onClick: () => {
                    setMicrophoneModeDropdownOpen((open) => !open);
                    setMicrophoneDeviceDropdownOpen(false);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-dropdown-selected-name", children: selectedMicrophoneModeName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 16 16", width: "14", height: "14", fill: "currentColor", className: `settings-dropdown-chevron ${microphoneModeDropdownOpen ? "flipped" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4.47 5.97a.75.75 0 0 1 1.06 0L8 8.44l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 0-1.06Z" }) })
                  ]
                }
              ),
              microphoneModeDropdownOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-dropdown-menu", children: microphoneModeOptions.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: `settings-dropdown-item ${settings.microphoneMode === option.value ? "active" : ""}`,
                  onClick: () => {
                    handleChange("microphoneMode", option.value);
                    setMicrophoneModeDropdownOpen(false);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: option.label }),
                    settings.microphoneMode === option.value && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14, className: "settings-dropdown-check" })
                  ]
                },
                option.value
              )) })
            ] })
          ] }),
          settings.microphoneMode !== "disabled" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "settings-label", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { size: 14 }),
                "Microphone Device"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-hint", children: "Select input device for voice chat" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-mic-device-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-dropdown", ref: microphoneDeviceDropdownRef, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    className: `settings-dropdown-selected ${microphoneDeviceDropdownOpen ? "open" : ""}`,
                    onClick: () => {
                      if (microphoneDevices.length === 0) return;
                      setMicrophoneDeviceDropdownOpen((open) => !open);
                      setMicrophoneModeDropdownOpen(false);
                    },
                    disabled: microphoneDevices.length === 0,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-dropdown-selected-name", children: selectedMicrophoneDeviceName }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 16 16", width: "14", height: "14", fill: "currentColor", className: `settings-dropdown-chevron ${microphoneDeviceDropdownOpen ? "flipped" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4.47 5.97a.75.75 0 0 1 1.06 0L8 8.44l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 0-1.06Z" }) })
                    ]
                  }
                ),
                microphoneDeviceDropdownOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-dropdown-menu settings-dropdown-menu--tall", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      className: `settings-dropdown-item ${settings.microphoneDeviceId === "" ? "active" : ""}`,
                      onClick: () => {
                        handleChange("microphoneDeviceId", "");
                        setMicrophoneDeviceDropdownOpen(false);
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Default Device" }),
                        settings.microphoneDeviceId === "" && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14, className: "settings-dropdown-check" })
                      ]
                    }
                  ),
                  microphoneDevices.map((device, index2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      className: `settings-dropdown-item ${settings.microphoneDeviceId === device.deviceId ? "active" : ""}`,
                      onClick: () => {
                        handleChange("microphoneDeviceId", device.deviceId);
                        setMicrophoneDeviceDropdownOpen(false);
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: device.label || `Microphone ${index2 + 1}` }),
                        settings.microphoneDeviceId === device.deviceId && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14, className: "settings-dropdown-check" })
                      ]
                    },
                    device.deviceId
                  ))
                ] })
              ] }),
              microphonePermissionError && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400 text-xs mt-1", children: microphonePermissionError }),
              microphoneDevices.length === 0 && !microphonePermissionError && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-yellow-400 text-xs mt-1", children: "No microphone devices found" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "settings-section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-section-header", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Input" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-rows", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "settings-label", children: "Clipboard Paste" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "settings-toggle", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: settings.clipboardPaste,
                  onChange: (e) => handleChange("clipboardPaste", e.target.checked)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-toggle-track" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "settings-label", children: [
              "Hide Stream Overlay Buttons",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-hint", children: "Hide microphone, fullscreen, and end-session buttons while streaming." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "settings-toggle", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: settings.hideStreamButtons,
                  onChange: (e) => handleChange("hideStreamButtons", e.target.checked)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-toggle-track" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-row settings-row--column", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-row-top", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "settings-label", children: "Shortcuts" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-shortcut-actions", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-value-badge", children: "Editable" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "settings-shortcut-reset-btn",
                    onClick: handleResetShortcuts,
                    disabled: areShortcutsDefault,
                    children: "Reset to defaults"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-shortcut-grid", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "settings-shortcut-row", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-shortcut-label", children: "Toggle Stats" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    className: `settings-text-input settings-shortcut-input ${toggleStatsError ? "error" : ""}`,
                    value: toggleStatsInput,
                    onChange: (e) => setToggleStatsInput(e.target.value),
                    onBlur: () => handleShortcutBlur("shortcutToggleStats", toggleStatsInput, setToggleStatsInput, setToggleStatsError),
                    onKeyDown: handleShortcutKeyDown,
                    placeholder: "F3",
                    spellCheck: false
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "settings-shortcut-row", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-shortcut-label", children: "Mouse Lock" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    className: `settings-text-input settings-shortcut-input ${togglePointerLockError ? "error" : ""}`,
                    value: togglePointerLockInput,
                    onChange: (e) => setTogglePointerLockInput(e.target.value),
                    onBlur: () => handleShortcutBlur("shortcutTogglePointerLock", togglePointerLockInput, setTogglePointerLockInput, setTogglePointerLockError),
                    onKeyDown: handleShortcutKeyDown,
                    placeholder: "F8",
                    spellCheck: false
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "settings-shortcut-row", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-shortcut-label", children: "Stop Stream" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    className: `settings-text-input settings-shortcut-input ${stopStreamError ? "error" : ""}`,
                    value: stopStreamInput,
                    onChange: (e) => setStopStreamInput(e.target.value),
                    onBlur: () => handleShortcutBlur("shortcutStopStream", stopStreamInput, setStopStreamInput, setStopStreamError),
                    onKeyDown: handleShortcutKeyDown,
                    placeholder: "Ctrl+Shift+Q",
                    spellCheck: false
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "settings-shortcut-row", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-shortcut-label", children: "Toggle Anti-AFK" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    className: `settings-text-input settings-shortcut-input ${toggleAntiAfkError ? "error" : ""}`,
                    value: toggleAntiAfkInput,
                    onChange: (e) => setToggleAntiAfkInput(e.target.value),
                    onBlur: () => handleShortcutBlur("shortcutToggleAntiAfk", toggleAntiAfkInput, setToggleAntiAfkInput, setToggleAntiAfkError),
                    onKeyDown: handleShortcutKeyDown,
                    placeholder: "Ctrl+Shift+K",
                    spellCheck: false
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "settings-shortcut-row", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-shortcut-label", children: "Toggle Microphone" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    className: `settings-text-input settings-shortcut-input ${toggleMicrophoneError ? "error" : ""}`,
                    value: toggleMicrophoneInput,
                    onChange: (e) => setToggleMicrophoneInput(e.target.value),
                    onBlur: () => handleShortcutBlur("shortcutToggleMicrophone", toggleMicrophoneInput, setToggleMicrophoneInput, setToggleMicrophoneError),
                    onKeyDown: handleShortcutKeyDown,
                    placeholder: "Ctrl+Shift+M",
                    spellCheck: false
                  }
                )
              ] })
            ] }),
            (toggleStatsError || togglePointerLockError || stopStreamError || toggleAntiAfkError || toggleMicrophoneError) && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "settings-input-hint", children: [
              "Invalid shortcut. Use ",
              shortcutExamples
            ] }),
            !toggleStatsError && !togglePointerLockError && !stopStreamError && !toggleAntiAfkError && !toggleMicrophoneError && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "settings-shortcut-hint", children: [
              shortcutExamples,
              ". Stop: ",
              formatShortcutForDisplay(settings.shortcutStopStream, isMac$1),
              ". Mic: ",
              formatShortcutForDisplay(settings.shortcutToggleMicrophone, isMac$1),
              "."
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "settings-section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-section-header", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Region" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-rows", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "region-selector", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: `region-selected ${regionDropdownOpen ? "open" : ""}`,
              onClick: () => setRegionDropdownOpen(!regionDropdownOpen),
              type: "button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "region-selected-name", children: selectedRegionName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 16 16", width: "14", height: "14", fill: "currentColor", className: `region-chevron ${regionDropdownOpen ? "flipped" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4.47 5.97a.75.75 0 0 1 1.06 0L8 8.44l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 0-1.06Z" }) })
              ]
            }
          ),
          regionDropdownOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "region-dropdown", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "region-dropdown-search", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 14, className: "region-dropdown-search-icon" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  className: "region-dropdown-search-input",
                  placeholder: "Search regions...",
                  value: regionSearch,
                  onChange: (e) => setRegionSearch(e.target.value),
                  autoFocus: true
                }
              ),
              regionSearch && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "region-dropdown-clear", onClick: () => setRegionSearch(""), type: "button", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12 }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "region-dropdown-list", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: `region-dropdown-item ${!settings.region ? "active" : ""}`,
                  onClick: () => {
                    handleChange("region", "");
                    setRegionDropdownOpen(false);
                    setRegionSearch("");
                  },
                  type: "button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 14 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Auto (Best)" }),
                    !settings.region && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14, className: "region-check" })
                  ]
                }
              ),
              filteredRegions.map((region) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: `region-dropdown-item ${settings.region === region.url ? "active" : ""}`,
                  onClick: () => {
                    handleChange("region", region.url);
                    setRegionDropdownOpen(false);
                    setRegionSearch("");
                  },
                  type: "button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 14 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: region.name }),
                    settings.region === region.url && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14, className: "region-check" })
                  ]
                },
                region.url
              )),
              filteredRegions.length === 0 && regions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "region-dropdown-empty", children: [
                "No regions match “",
                regionSearch,
                "”"
              ] })
            ] })
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-footer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        className: "settings-save-btn",
        onClick: () => {
          setSavedIndicator(true);
          setTimeout(() => setSavedIndicator(false), 1500);
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 16 }),
          "Save Settings"
        ]
      }
    ) })
  ] });
}
const steps = [
  { id: "queue", label: "Queue", icon: Monitor },
  { id: "setup", label: "Setup", icon: Cpu },
  { id: "ready", label: "Ready", icon: Wifi }
];
function getStatusMessage(status, queuePosition, isError = false) {
  if (isError) {
    return "Game launch failed";
  }
  switch (status) {
    case "queue":
      return queuePosition ? `Position #${queuePosition} in queue` : "Waiting in queue...";
    case "setup":
      return "Setting up your gaming rig...";
    case "starting":
      return "Starting stream...";
    case "connecting":
      return "Connecting to server...";
    default:
      return "Loading...";
  }
}
function getActiveStepIndex(status) {
  switch (status) {
    case "queue":
      return 0;
    case "setup":
      return 1;
    case "starting":
    case "connecting":
      return 2;
    default:
      return 0;
  }
}
function StreamLoading({
  gameTitle,
  gameCover,
  status,
  queuePosition,
  estimatedWait,
  error,
  onCancel
}) {
  const hasError = Boolean(error);
  const activeStepIndex = getActiveStepIndex(status);
  const statusMessage = getStatusMessage(status, queuePosition, hasError);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `sload${hasError ? " sload--error" : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sload-backdrop" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sload-glow" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sload-content", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sload-game", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sload-cover", children: [
          gameCover ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: gameCover, alt: gameTitle, className: "sload-cover-img" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sload-cover-empty", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { size: 28 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sload-cover-shine" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sload-game-meta", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sload-label", children: hasError ? "Launch Error" : "Now Loading" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "sload-title", title: gameTitle, children: gameTitle })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sload-steps", children: steps.map((step, index2) => {
        const StepIcon = step.icon;
        const isFailed = hasError && index2 === activeStepIndex;
        const isActive = !isFailed && index2 === activeStepIndex;
        const isCompleted = index2 < activeStepIndex;
        const isPending = index2 > activeStepIndex;
        const nextIsFailed = hasError && index2 + 1 === activeStepIndex;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `sload-step${isActive ? " active" : ""}${isCompleted ? " completed" : ""}${isPending ? " pending" : ""}${isFailed ? " failed" : ""}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sload-step-dot", children: isFailed ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(StepIcon, { size: 18 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sload-step-name", children: step.label }),
              index2 < steps.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `sload-step-line${nextIsFailed ? " failed" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sload-step-line-fill" }) })
            ]
          },
          step.id
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `sload-status${hasError ? " sload-status--error" : ""}`, children: [
        hasError ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 28, className: "sload-error-icon" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 28, className: "sload-spin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sload-status-text", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "sload-message", children: statusMessage }),
          hasError && error && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "sload-error-title", children: error.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "sload-error-desc", children: error.description }),
            error.code && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "sload-error-code", children: error.code })
          ] }),
          status === "queue" && queuePosition !== void 0 && queuePosition > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "sload-queue", children: [
            "Position ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sload-queue-num", children: [
              "#",
              queuePosition
            ] }),
            estimatedWait && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sload-wait", children: [
              " · ~",
              estimatedWait
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "sload-cancel", onClick: onCancel, "aria-label": "Cancel loading", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: hasError ? "Close" : "Cancel" })
      ] })
    ] })
  ] });
}
function getRttColor(rttMs) {
  if (rttMs <= 0) return "var(--ink-muted)";
  if (rttMs < 30) return "var(--success)";
  if (rttMs < 60) return "var(--warning)";
  return "var(--error)";
}
function getPacketLossColor(lossPercent) {
  if (lossPercent <= 0.15) return "var(--success)";
  if (lossPercent < 1) return "var(--warning)";
  return "var(--error)";
}
function getTimingColor(valueMs, goodMax, warningMax) {
  if (valueMs <= 0) return "var(--ink-muted)";
  if (valueMs <= goodMax) return "var(--success)";
  if (valueMs <= warningMax) return "var(--warning)";
  return "var(--error)";
}
function getInputQueueColor(bufferedBytes, dropCount) {
  if (dropCount > 0 || bufferedBytes >= 65536) return "var(--error)";
  if (bufferedBytes >= 32768) return "var(--warning)";
  return "var(--success)";
}
function formatElapsed(totalSeconds) {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor(safe % 3600 / 60);
  const seconds = safe % 60;
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
function formatWarningSeconds(value) {
  if (value === void 0 || !Number.isFinite(value) || value < 0) {
    return null;
  }
  const total = Math.floor(value);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  if (minutes > 0) {
    return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
  }
  return `${seconds}s`;
}
function StreamView({
  videoRef,
  audioRef,
  stats,
  showStats,
  shortcuts,
  serverRegion,
  connectedControllers,
  antiAfkEnabled,
  escHoldReleaseIndicator,
  exitPrompt,
  sessionElapsedSeconds,
  sessionClockShowEveryMinutes,
  sessionClockShowDurationSeconds,
  streamWarning,
  isConnecting,
  gameTitle,
  onToggleFullscreen,
  onConfirmExit,
  onCancelExit,
  onEndSession,
  onToggleMicrophone,
  hideStreamButtons = false
}) {
  const [isFullscreen, setIsFullscreen] = reactExports.useState(false);
  const [showHints, setShowHints] = reactExports.useState(true);
  const [showSessionClock, setShowSessionClock] = reactExports.useState(false);
  const micState = stats.micState ?? "uninitialized";
  const micEnabled = stats.micEnabled ?? false;
  const hasMicrophone = micState === "started" || micState === "stopped";
  const showMicIndicator = hasMicrophone && !isConnecting && !hideStreamButtons;
  const handleFullscreenToggle = reactExports.useCallback(() => {
    onToggleFullscreen();
  }, [onToggleFullscreen]);
  reactExports.useEffect(() => {
    const timer = setTimeout(() => setShowHints(false), 5e3);
    return () => clearTimeout(timer);
  }, []);
  reactExports.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);
  reactExports.useEffect(() => {
    if (isConnecting) {
      setShowSessionClock(false);
      return;
    }
    const intervalMinutes = Math.max(0, Math.floor(sessionClockShowEveryMinutes || 0));
    const durationSeconds = Math.max(1, Math.floor(sessionClockShowDurationSeconds || 1));
    const intervalMs = intervalMinutes * 60 * 1e3;
    const durationMs = durationSeconds * 1e3;
    let hideTimer;
    let periodicTimer;
    const showFor = (durationMs2) => {
      setShowSessionClock(true);
      if (hideTimer !== void 0) {
        window.clearTimeout(hideTimer);
      }
      hideTimer = window.setTimeout(() => {
        setShowSessionClock(false);
      }, durationMs2);
    };
    showFor(durationMs);
    if (intervalMs > 0) {
      periodicTimer = window.setInterval(() => {
        showFor(durationMs);
      }, intervalMs);
    }
    return () => {
      if (hideTimer !== void 0) {
        window.clearTimeout(hideTimer);
      }
      if (periodicTimer !== void 0) {
        window.clearInterval(periodicTimer);
      }
    };
  }, [isConnecting, sessionClockShowDurationSeconds, sessionClockShowEveryMinutes]);
  const bitrateMbps = (stats.bitrateKbps / 1e3).toFixed(1);
  const hasResolution = stats.resolution && stats.resolution !== "";
  const hasCodec = stats.codec && stats.codec !== "";
  const regionLabel = stats.serverRegion || serverRegion || "";
  const decodeColor = getTimingColor(stats.decodeTimeMs, 8, 16);
  const renderColor = getTimingColor(stats.renderTimeMs, 12, 22);
  const jitterBufferColor = getTimingColor(stats.jitterBufferDelayMs, 10, 24);
  const lossColor = getPacketLossColor(stats.packetLossPercent);
  const dText = stats.decodeTimeMs > 0 ? `${stats.decodeTimeMs.toFixed(1)}ms` : "--";
  const rText = stats.renderTimeMs > 0 ? `${stats.renderTimeMs.toFixed(1)}ms` : "--";
  const jbText = stats.jitterBufferDelayMs > 0 ? `${stats.jitterBufferDelayMs.toFixed(1)}ms` : "--";
  const inputLive = stats.inputReady && stats.connectionState === "connected";
  const escHoldProgress = Math.max(0, Math.min(1, escHoldReleaseIndicator.progress));
  const escHoldSecondsLeft = Math.max(0, 5 - Math.floor(escHoldProgress * 5));
  const inputQueueColor = getInputQueueColor(stats.inputQueueBufferedBytes, stats.inputQueueDropCount);
  const inputQueueText = `${(stats.inputQueueBufferedBytes / 1024).toFixed(1)}KB`;
  const warningSeconds = formatWarningSeconds(streamWarning?.secondsLeft);
  const sessionTimeText = formatElapsed(sessionElapsedSeconds);
  const localVideoRef = reactExports.useRef(null);
  const setVideoRef = reactExports.useCallback((element) => {
    localVideoRef.current = element;
    if (typeof videoRef === "function") {
      videoRef(element);
    } else if (videoRef && "current" in videoRef) {
      videoRef.current = element;
    }
  }, [videoRef]);
  reactExports.useEffect(() => {
    if (!isConnecting && localVideoRef.current && hasResolution) {
      const timer = window.setTimeout(() => {
        if (localVideoRef.current && document.activeElement !== localVideoRef.current) {
          localVideoRef.current.focus();
          console.log("[StreamView] Focused video element");
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isConnecting, hasResolution]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sv", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "video",
      {
        ref: setVideoRef,
        autoPlay: true,
        playsInline: true,
        muted: true,
        tabIndex: 0,
        className: "sv-video",
        onClick: () => {
          if (localVideoRef.current && document.activeElement !== localVideoRef.current) {
            localVideoRef.current.focus();
          }
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("audio", { ref: audioRef, autoPlay: true, playsInline: true }),
    !hasResolution && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sv-empty", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sv-empty-grad" }) }),
    isConnecting && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sv-connect", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sv-connect-inner", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "sv-connect-spin", size: 44 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "sv-connect-title", children: [
        "Connecting to ",
        gameTitle
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "sv-connect-sub", children: "Setting up stream..." })
    ] }) }),
    !isConnecting && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `sv-session-clock${showSessionClock ? " is-visible" : ""}`,
        title: "Current gaming session elapsed time",
        "aria-hidden": !showSessionClock,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock3, { size: 14 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Session ",
            sessionTimeText
          ] })
        ]
      }
    ),
    streamWarning && !isConnecting && !exitPrompt.open && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `sv-time-warning sv-time-warning--${streamWarning.tone}`,
        title: "Session time warning",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 14 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            streamWarning.message,
            warningSeconds ? ` · ${warningSeconds} left` : ""
          ] })
        ]
      }
    ),
    showStats && !isConnecting && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sv-stats", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sv-stats-head", children: [
        hasResolution ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sv-stats-primary", children: [
          stats.resolution,
          " · ",
          stats.decodeFps,
          "fps"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sv-stats-primary sv-stats-wait", children: "Connecting..." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `sv-stats-live ${inputLive ? "is-live" : "is-pending"}`, children: inputLive ? "Live" : "Sync" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sv-stats-sub", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sv-stats-sub-left", children: [
          hasCodec ? stats.codec : "N/A",
          stats.isHdr && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sv-stats-hdr", children: "HDR" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sv-stats-sub-right", children: [
          bitrateMbps,
          " Mbps"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sv-stats-metrics", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sv-stats-chip", title: "Round-trip network latency", children: [
          "RTT ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sv-stats-chip-val", style: { color: getRttColor(stats.rttMs) }, children: stats.rttMs > 0 ? `${stats.rttMs.toFixed(0)}ms` : "--" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sv-stats-chip", title: "D = decode time", children: [
          "D ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sv-stats-chip-val", style: { color: decodeColor }, children: dText })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sv-stats-chip", title: "R = render time", children: [
          "R ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sv-stats-chip-val", style: { color: renderColor }, children: rText })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sv-stats-chip", title: "JB = jitter buffer delay", children: [
          "JB ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sv-stats-chip-val", style: { color: jitterBufferColor }, children: jbText })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sv-stats-chip", title: "Packet loss percentage", children: [
          "Loss ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sv-stats-chip-val", style: { color: lossColor }, children: [
            stats.packetLossPercent.toFixed(2),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sv-stats-chip", title: "Input queue pressure (buffered bytes and delayed flush)", children: [
          "IQ ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sv-stats-chip-val", style: { color: inputQueueColor }, children: inputQueueText })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sv-stats-foot", children: [
        "Input queue peak ",
        (stats.inputQueuePeakBufferedBytes / 1024).toFixed(1),
        "KB · drops ",
        stats.inputQueueDropCount,
        " · sched ",
        stats.inputQueueMaxSchedulingDelayMs.toFixed(1),
        "ms"
      ] }),
      (stats.gpuType || regionLabel) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sv-stats-foot", children: [stats.gpuType, regionLabel].filter(Boolean).join(" · ") })
    ] }),
    connectedControllers > 0 && !isConnecting && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sv-ctrl", title: `${connectedControllers} controller(s) connected`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Gamepad2, { size: 18 }),
      connectedControllers > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sv-ctrl-n", children: connectedControllers })
    ] }),
    showMicIndicator && onToggleMicrophone && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        className: `sv-mic${connectedControllers > 0 || antiAfkEnabled ? " sv-mic--stacked" : ""}`,
        onClick: onToggleMicrophone,
        "data-enabled": micEnabled,
        title: micEnabled ? "Mute microphone" : "Unmute microphone",
        "aria-label": micEnabled ? "Mute microphone" : "Unmute microphone",
        "aria-pressed": micEnabled,
        children: micEnabled ? /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { size: 18 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MicOff, { size: 18 })
      }
    ),
    antiAfkEnabled && !isConnecting && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `sv-afk${connectedControllers > 0 ? " sv-afk--stacked" : ""}`, title: "Anti-AFK is enabled", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sv-afk-dot" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sv-afk-label", children: "ANTI-AFK ON" })
    ] }),
    escHoldReleaseIndicator.visible && !isConnecting && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sv-esc-hold-backdrop" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sv-esc-hold", title: "Keep holding Escape to release mouse lock", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sv-esc-hold-title", children: "Hold Escape to Release Mouse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sv-esc-hold-head", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Keep holding…" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            escHoldSecondsLeft,
            "s"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sv-esc-hold-track", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sv-esc-hold-fill", style: { transform: `scaleX(${escHoldProgress})` } }) })
      ] })
    ] }),
    exitPrompt.open && !isConnecting && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sv-exit", role: "dialog", "aria-modal": "true", "aria-label": "Exit stream confirmation", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: "sv-exit-backdrop",
          onClick: onCancelExit,
          "aria-label": "Cancel exit"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sv-exit-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sv-exit-kicker", children: "Session Control" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "sv-exit-title", children: "Exit Stream?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "sv-exit-text", children: [
          "Do you really want to exit ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: exitPrompt.gameTitle }),
          "?"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "sv-exit-subtext", children: "Your current cloud gaming session will be closed." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sv-exit-actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "sv-exit-btn sv-exit-btn-cancel", onClick: onCancelExit, children: "Keep Playing" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "sv-exit-btn sv-exit-btn-confirm", onClick: onConfirmExit, children: "Exit Stream" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sv-exit-hint", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: "Enter" }),
          " confirm · ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: "Esc" }),
          " cancel"
        ] })
      ] })
    ] }),
    !hideStreamButtons && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: "sv-fs",
        onClick: handleFullscreenToggle,
        title: isFullscreen ? "Exit fullscreen" : "Enter fullscreen",
        "aria-label": isFullscreen ? "Exit fullscreen" : "Enter fullscreen",
        children: isFullscreen ? /* @__PURE__ */ jsxRuntimeExports.jsx(Minimize, { size: 18 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize, { size: 18 })
      }
    ),
    !hideStreamButtons && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: "sv-end",
        onClick: onEndSession,
        title: "End session",
        "aria-label": "End session",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 18 })
      }
    ),
    showHints && !isConnecting && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sv-hints", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sv-hint", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: shortcuts.toggleStats }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Stats" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sv-hint", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: shortcuts.togglePointerLock }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Mouse lock" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sv-hint", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: shortcuts.stopStream }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Stop" })
      ] }),
      shortcuts.toggleMicrophone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sv-hint", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: shortcuts.toggleMicrophone }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Mic" })
      ] })
    ] }),
    hasResolution && showHints && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sv-title-bar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: gameTitle }) })
  ] });
}
const SESSION_READY_POLL_INTERVAL_MS = 2e3;
const SESSION_READY_TIMEOUT_MS = 18e4;
const APP_PAGE_ORDER = ["home", "library", "settings"];
const isMac = navigator.platform.toLowerCase().includes("mac");
const DEFAULT_SHORTCUTS = {
  shortcutToggleStats: "F3",
  shortcutTogglePointerLock: "F8",
  shortcutStopStream: "Ctrl+Shift+Q",
  shortcutToggleAntiAfk: "Ctrl+Shift+K",
  shortcutToggleMicrophone: "Ctrl+Shift+M"
};
function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
function isSessionReadyForConnect(status) {
  return status === 2 || status === 3;
}
function isNumericId(value) {
  if (!value) return false;
  return /^\d+$/.test(value);
}
function parseNumericId(value) {
  if (!isNumericId(value)) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
function defaultVariantId(game) {
  const fallback = game.variants[0]?.id;
  const preferred = game.variants[game.selectedVariantIndex]?.id;
  return preferred ?? fallback ?? game.id;
}
function defaultDiagnostics() {
  return {
    connectionState: "closed",
    inputReady: false,
    connectedGamepads: 0,
    resolution: "",
    codec: "",
    isHdr: false,
    bitrateKbps: 0,
    decodeFps: 0,
    renderFps: 0,
    packetsLost: 0,
    packetsReceived: 0,
    packetLossPercent: 0,
    jitterMs: 0,
    rttMs: 0,
    framesReceived: 0,
    framesDecoded: 0,
    framesDropped: 0,
    decodeTimeMs: 0,
    renderTimeMs: 0,
    jitterBufferDelayMs: 0,
    inputQueueBufferedBytes: 0,
    inputQueuePeakBufferedBytes: 0,
    inputQueueDropCount: 0,
    inputQueueMaxSchedulingDelayMs: 0,
    gpuType: "",
    serverRegion: "",
    micState: "uninitialized",
    micEnabled: false
  };
}
function isSessionLimitError(error) {
  if (error && typeof error === "object" && "gfnErrorCode" in error) {
    const candidate = error.gfnErrorCode;
    if (typeof candidate === "number") {
      return candidate === 3237093643 || candidate === 3237093718;
    }
  }
  if (error instanceof Error) {
    const msg = error.message.toUpperCase();
    return msg.includes("SESSION LIMIT") || msg.includes("INSUFFICIENT_PLAYABILITY") || msg.includes("DUPLICATE SESSION");
  }
  return false;
}
function warningTone(code) {
  if (code === 3) {
    return "critical";
  }
  return "warn";
}
function warningMessage(code) {
  if (code === 1) return "Session time limit approaching";
  if (code === 2) return "Idle timeout approaching";
  return "Maximum session time approaching";
}
function toLoadingStatus(status) {
  switch (status) {
    case "queue":
    case "setup":
    case "starting":
    case "connecting":
      return status;
    default:
      return "queue";
  }
}
function toCodeLabel(code) {
  if (code === void 0) return void 0;
  if (code === 3237093643) return `SessionLimitExceeded (${code})`;
  if (code === 3237093718) return `SessionInsufficientPlayabilityLevel (${code})`;
  return `GFN Error ${code}`;
}
function extractLaunchErrorCode(error) {
  if (error && typeof error === "object") {
    if ("gfnErrorCode" in error) {
      const directCode = error.gfnErrorCode;
      if (typeof directCode === "number") return directCode;
    }
    if ("statusCode" in error) {
      const statusCode = error.statusCode;
      if (typeof statusCode === "number" && statusCode > 0 && statusCode < 255) {
        return 3237093632 + statusCode;
      }
    }
  }
  if (error instanceof Error) {
    const match = error.message.match(/\b(3237\d{6,})\b/);
    if (match) {
      const code = Number(match[1]);
      if (Number.isFinite(code)) return code;
    }
  }
  return void 0;
}
function toLaunchErrorState(error, stage) {
  const unknownMessage = "The game could not start. Please try again.";
  const titleFromError = error && typeof error === "object" && "title" in error && typeof error.title === "string" ? error.title.trim() : "";
  const descriptionFromError = error && typeof error === "object" && "description" in error && typeof error.description === "string" ? error.description.trim() : "";
  const statusDescription = error && typeof error === "object" && "statusDescription" in error && typeof error.statusDescription === "string" ? error.statusDescription.trim() : "";
  const messageFromError = error instanceof Error ? error.message.trim() : "";
  const combined = `${statusDescription} ${messageFromError}`.toUpperCase();
  const code = extractLaunchErrorCode(error);
  if (isSessionLimitError(error) || combined.includes("INSUFFICIENT_PLAYABILITY") || combined.includes("SESSION_LIMIT") || combined.includes("DUPLICATE SESSION")) {
    return {
      stage,
      title: "Duplicate Session Detected",
      description: "Another session is already running on your account. Close it first or wait for it to timeout, then launch again.",
      codeLabel: toCodeLabel(code)
    };
  }
  return {
    stage,
    title: titleFromError || "Launch Failed",
    description: descriptionFromError || messageFromError || statusDescription || unknownMessage,
    codeLabel: toCodeLabel(code)
  };
}
function App() {
  const [authSession, setAuthSession] = reactExports.useState(null);
  const [providers, setProviders] = reactExports.useState([]);
  const [providerIdpId, setProviderIdpId] = reactExports.useState("");
  const [isLoggingIn, setIsLoggingIn] = reactExports.useState(false);
  const [loginError, setLoginError] = reactExports.useState(null);
  const [isInitializing, setIsInitializing] = reactExports.useState(true);
  const [startupStatusMessage, setStartupStatusMessage] = reactExports.useState("Restoring saved session...");
  const [startupRefreshNotice, setStartupRefreshNotice] = reactExports.useState(null);
  const [currentPage, setCurrentPage] = reactExports.useState("home");
  const [games, setGames] = reactExports.useState([]);
  const [libraryGames, setLibraryGames] = reactExports.useState([]);
  const [source, setSource] = reactExports.useState("main");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [selectedGameId, setSelectedGameId] = reactExports.useState("");
  const [variantByGameId, setVariantByGameId] = reactExports.useState({});
  const [isLoadingGames, setIsLoadingGames] = reactExports.useState(false);
  const [settings, setSettings] = reactExports.useState({
    resolution: "1920x1080",
    fps: 60,
    maxBitrateMbps: 75,
    codec: "H264",
    decoderPreference: "auto",
    encoderPreference: "auto",
    colorQuality: "10bit_420",
    region: "",
    clipboardPaste: false,
    mouseSensitivity: 1,
    shortcutToggleStats: DEFAULT_SHORTCUTS.shortcutToggleStats,
    shortcutTogglePointerLock: DEFAULT_SHORTCUTS.shortcutTogglePointerLock,
    shortcutStopStream: DEFAULT_SHORTCUTS.shortcutStopStream,
    shortcutToggleAntiAfk: DEFAULT_SHORTCUTS.shortcutToggleAntiAfk,
    shortcutToggleMicrophone: DEFAULT_SHORTCUTS.shortcutToggleMicrophone,
    microphoneMode: "disabled",
    microphoneDeviceId: "",
    hideStreamButtons: false,
    sessionClockShowEveryMinutes: 60,
    sessionClockShowDurationSeconds: 30,
    windowWidth: 1400,
    windowHeight: 900
  });
  const [settingsLoaded, setSettingsLoaded] = reactExports.useState(false);
  const [regions, setRegions] = reactExports.useState([]);
  const [subscriptionInfo, setSubscriptionInfo] = reactExports.useState(null);
  const [session, setSession] = reactExports.useState(null);
  const [streamStatus, setStreamStatus] = reactExports.useState("idle");
  const [diagnostics, setDiagnostics] = reactExports.useState(defaultDiagnostics());
  const [showStatsOverlay, setShowStatsOverlay] = reactExports.useState(true);
  const [antiAfkEnabled, setAntiAfkEnabled] = reactExports.useState(false);
  const [escHoldReleaseIndicator, setEscHoldReleaseIndicator] = reactExports.useState({
    visible: false,
    progress: 0
  });
  const [exitPrompt, setExitPrompt] = reactExports.useState({ open: false, gameTitle: "Game" });
  const [streamingGame, setStreamingGame] = reactExports.useState(null);
  const [queuePosition, setQueuePosition] = reactExports.useState();
  const [navbarActiveSession, setNavbarActiveSession] = reactExports.useState(null);
  const [isResumingNavbarSession, setIsResumingNavbarSession] = reactExports.useState(false);
  const [launchError, setLaunchError] = reactExports.useState(null);
  const [sessionStartedAtMs, setSessionStartedAtMs] = reactExports.useState(null);
  const [sessionElapsedSeconds, setSessionElapsedSeconds] = reactExports.useState(0);
  const [streamWarning, setStreamWarning] = reactExports.useState(null);
  const handleControllerPageNavigate = reactExports.useCallback((direction) => {
    if (!authSession || streamStatus !== "idle") {
      return;
    }
    const currentIndex = APP_PAGE_ORDER.indexOf(currentPage);
    const step = direction === "next" ? 1 : -1;
    const nextIndex = (currentIndex + step + APP_PAGE_ORDER.length) % APP_PAGE_ORDER.length;
    setCurrentPage(APP_PAGE_ORDER[nextIndex]);
  }, [authSession, currentPage, streamStatus]);
  const handleControllerBackAction = reactExports.useCallback(() => {
    if (!authSession || streamStatus !== "idle") {
      return false;
    }
    if (currentPage !== "home") {
      setCurrentPage("home");
      return true;
    }
    return false;
  }, [authSession, currentPage, streamStatus]);
  const controllerConnected = useControllerNavigation({
    enabled: streamStatus !== "streaming" || exitPrompt.open,
    onNavigatePage: handleControllerPageNavigate,
    onBackAction: handleControllerBackAction
  });
  const videoRef = reactExports.useRef(null);
  const audioRef = reactExports.useRef(null);
  const clientRef = reactExports.useRef(null);
  const touchHandlerRef = reactExports.useRef(null);
  const sessionRef = reactExports.useRef(null);
  const hasInitializedRef = reactExports.useRef(false);
  reactExports.useRef(0);
  const launchInFlightRef = reactExports.useRef(false);
  const exitPromptResolverRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    sessionRef.current = session;
  }, [session]);
  reactExports.useEffect(() => {
    document.body.classList.toggle("controller-mode", controllerConnected);
    return () => {
      document.body.classList.remove("controller-mode");
    };
  }, [controllerConnected]);
  const selectedProvider = reactExports.useMemo(() => {
    return providers.find((p) => p.idpId === providerIdpId) ?? authSession?.provider ?? null;
  }, [providers, providerIdpId, authSession]);
  const effectiveStreamingBaseUrl = reactExports.useMemo(() => {
    return selectedProvider?.streamingServiceUrl ?? "";
  }, [selectedProvider]);
  const loadSubscriptionInfo = reactExports.useCallback(
    async (session2) => {
      const token = session2.tokens.idToken ?? session2.tokens.accessToken;
      const subscription = await getPlatformApi().fetchSubscription({
        token,
        providerStreamingBaseUrl: session2.provider.streamingServiceUrl,
        userId: session2.user.userId
      });
      setSubscriptionInfo(subscription);
    },
    []
  );
  const refreshNavbarActiveSession = reactExports.useCallback(async () => {
    if (!authSession) {
      setNavbarActiveSession(null);
      return;
    }
    const token = authSession.tokens.idToken ?? authSession.tokens.accessToken;
    if (!token || !effectiveStreamingBaseUrl) {
      setNavbarActiveSession(null);
      return;
    }
    try {
      const activeSessions = await getPlatformApi().getActiveSessions(token, effectiveStreamingBaseUrl);
      const candidate = activeSessions.find((entry) => entry.status === 3 || entry.status === 2) ?? null;
      setNavbarActiveSession(candidate);
    } catch (error) {
      console.warn("Failed to refresh active sessions:", error);
    }
  }, [authSession, effectiveStreamingBaseUrl]);
  reactExports.useEffect(() => {
    if (!startupRefreshNotice) return;
    const timer = window.setTimeout(() => setStartupRefreshNotice(null), 7e3);
    return () => window.clearTimeout(timer);
  }, [startupRefreshNotice]);
  reactExports.useEffect(() => {
    if (!authSession || streamStatus !== "idle") {
      return;
    }
    void refreshNavbarActiveSession();
    const timer = window.setInterval(() => {
      void refreshNavbarActiveSession();
    }, 1e4);
    return () => window.clearInterval(timer);
  }, [authSession, refreshNavbarActiveSession, streamStatus]);
  reactExports.useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;
    const initialize = async () => {
      try {
        const { getPlatform: getPlatform2 } = await __vitePreload(async () => {
          const { getPlatform: getPlatform3 } = await Promise.resolve().then(() => detect);
          return { getPlatform: getPlatform3 };
        }, true ? void 0 : void 0, import.meta.url);
        const plat = getPlatform2();
        setStartupStatusMessage(`Platform: ${plat} | Capacitor: ${!!window.Capacitor}`);
        await new Promise((r) => setTimeout(r, 600));
        if (window.Capacitor) {
          setStartupStatusMessage("Waiting for Capacitor bridge...");
          await new Promise((resolve) => {
            if (window.Capacitor?.isNativePlatform?.()) {
              resolve();
            } else {
              document.addEventListener("deviceready", () => resolve(), { once: true });
              setTimeout(resolve, 1e3);
            }
          });
        }
        setStartupStatusMessage("Step 3: loading settings...");
        const loadedSettings = await getPlatformApi().getSettings();
        setSettings(loadedSettings);
        setSettingsLoaded(true);
        setStartupStatusMessage("Step 3: settings OK");
        await new Promise((r) => setTimeout(r, 300));
        setStartupStatusMessage("Step 4: calling getLoginProviders...");
        let providerList = [];
        try {
          const providerResult = await Promise.race([
            getPlatformApi().getLoginProviders(),
            new Promise((_, reject) => setTimeout(() => reject(new Error("providers timeout")), 5e3))
          ]);
          providerList = Array.isArray(providerResult) ? providerResult : [];
          setStartupStatusMessage(`Step 4: got ${providerList.length} providers`);
        } catch (e) {
          setStartupStatusMessage(`Step 4: failed (${e}) -- using default`);
          providerList = [{ idpId: "PDiAhv2kJTFeQ7WOPqiQ2tRZ7lGhR2X11dXvM4TZSxg", code: "NVIDIA", displayName: "NVIDIA", streamingServiceUrl: "https://prod.cloudmatchbeta.nvidiagrid.net/", priority: 0 }];
        }
        await new Promise((r) => setTimeout(r, 600));
        setStartupStatusMessage("Step 5: restoring session...");
        const sessionResult = await getPlatformApi().getAuthSession({ forceRefresh: false });
        setStartupStatusMessage(`Step 5: session=${sessionResult.session ? "found" : "none"} outcome=${sessionResult.refresh.outcome}`);
        await new Promise((r) => setTimeout(r, 300));
        const persistedSession = sessionResult.session;
        if (sessionResult.refresh.outcome === "refreshed") {
          setStartupRefreshNotice({
            tone: "success",
            text: "Session restored. Token refreshed."
          });
          setStartupStatusMessage("Token refreshed. Loading your account...");
        } else if (sessionResult.refresh.outcome === "failed") {
          setStartupRefreshNotice({
            tone: "warn",
            text: "Token refresh failed. Using saved session token."
          });
          setStartupStatusMessage("Token refresh failed. Continuing with saved session...");
        } else if (sessionResult.refresh.outcome === "missing_refresh_token") {
          setStartupStatusMessage("Saved session has no refresh token. Continuing...");
        } else if (persistedSession) {
          setStartupStatusMessage("Session restored.");
        } else {
          setStartupStatusMessage("No saved session found.");
        }
        setIsInitializing(false);
        setProviders(providerList);
        setAuthSession(persistedSession);
        const activeProviderId = persistedSession?.provider?.idpId ?? providerList[0]?.idpId ?? "";
        setProviderIdpId(activeProviderId);
        if (persistedSession) {
          const token = persistedSession.tokens.idToken ?? persistedSession.tokens.accessToken;
          const discovered = await getPlatformApi().getRegions({ token, providerStreamingBaseUrl: persistedSession.provider.streamingServiceUrl });
          setRegions(discovered);
          try {
            await loadSubscriptionInfo(persistedSession);
          } catch (error) {
            console.warn("Failed to load subscription info:", error);
            setSubscriptionInfo(null);
          }
          try {
            const mainGames = await getPlatformApi().fetchMainGames({
              token,
              providerStreamingBaseUrl: persistedSession.provider.streamingServiceUrl
            });
            setGames(mainGames);
            setSource("main");
            setSelectedGameId(mainGames[0]?.id ?? "");
            setVariantByGameId(
              mainGames.reduce((acc, g) => {
                acc[g.id] = defaultVariantId(g);
                return acc;
              }, {})
            );
            const libGames = await getPlatformApi().fetchLibraryGames({
              token,
              providerStreamingBaseUrl: persistedSession.provider.streamingServiceUrl
            });
            setLibraryGames(libGames);
          } catch {
            const publicGames = await getPlatformApi().fetchPublicGames();
            setGames(publicGames);
            setSource("public");
          }
        } else {
          const publicGames = await getPlatformApi().fetchPublicGames();
          setGames(publicGames);
          setSource("public");
          setSubscriptionInfo(null);
        }
      } catch (error) {
        console.error("Initialization failed:", error);
        setStartupStatusMessage("Session restore failed. Please sign in again.");
        setIsInitializing(false);
      }
    };
    void initialize();
  }, []);
  const shortcuts = reactExports.useMemo(() => {
    const parseWithFallback = (value, fallback) => {
      const parsed = normalizeShortcut(value);
      return parsed.valid ? parsed : normalizeShortcut(fallback);
    };
    const toggleStats = parseWithFallback(settings.shortcutToggleStats, DEFAULT_SHORTCUTS.shortcutToggleStats);
    const togglePointerLock = parseWithFallback(settings.shortcutTogglePointerLock, DEFAULT_SHORTCUTS.shortcutTogglePointerLock);
    const stopStream = parseWithFallback(settings.shortcutStopStream, DEFAULT_SHORTCUTS.shortcutStopStream);
    const toggleAntiAfk = parseWithFallback(settings.shortcutToggleAntiAfk, DEFAULT_SHORTCUTS.shortcutToggleAntiAfk);
    const toggleMicrophone = parseWithFallback(settings.shortcutToggleMicrophone, DEFAULT_SHORTCUTS.shortcutToggleMicrophone);
    return { toggleStats, togglePointerLock, stopStream, toggleAntiAfk, toggleMicrophone };
  }, [
    settings.shortcutToggleStats,
    settings.shortcutTogglePointerLock,
    settings.shortcutStopStream,
    settings.shortcutToggleAntiAfk,
    settings.shortcutToggleMicrophone
  ]);
  const requestEscLockedPointerCapture = reactExports.useCallback(async (target) => {
    if (isAndroid()) return;
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen().catch(() => {
      });
    }
    const nav = navigator;
    if (document.fullscreenElement && nav.keyboard?.lock) {
      await nav.keyboard.lock([
        "Escape",
        "F11",
        "BrowserBack",
        "BrowserForward",
        "BrowserRefresh"
      ]).catch(() => {
      });
    }
    await target.requestPointerLock({ unadjustedMovement: true }).catch((err) => {
      if (err.name === "NotSupportedError") {
        return target.requestPointerLock();
      }
      throw err;
    }).catch(() => {
    });
  }, []);
  const resolveExitPrompt = reactExports.useCallback((confirmed) => {
    const resolver = exitPromptResolverRef.current;
    exitPromptResolverRef.current = null;
    setExitPrompt((prev) => prev.open ? { ...prev, open: false } : prev);
    resolver?.(confirmed);
  }, []);
  const requestExitPrompt = reactExports.useCallback((gameTitle) => {
    return new Promise((resolve) => {
      if (exitPromptResolverRef.current) {
        exitPromptResolverRef.current(false);
      }
      exitPromptResolverRef.current = resolve;
      setExitPrompt({
        open: true,
        gameTitle: gameTitle || "this game"
      });
    });
  }, []);
  const handleExitPromptConfirm = reactExports.useCallback(() => {
    resolveExitPrompt(true);
  }, [resolveExitPrompt]);
  const handleExitPromptCancel = reactExports.useCallback(() => {
    resolveExitPrompt(false);
  }, [resolveExitPrompt]);
  reactExports.useEffect(() => {
    return () => {
      if (exitPromptResolverRef.current) {
        exitPromptResolverRef.current(false);
        exitPromptResolverRef.current = null;
      }
    };
  }, []);
  reactExports.useEffect(() => {
    if (!isAndroid()) return;
    const api = getPlatformApi();
    if (typeof api.setOrientation !== "function") return;
    if (streamStatus === "streaming") {
      api.setOrientation("landscape");
    } else if (streamStatus === "idle") {
      api.setOrientation("sensor");
    }
  }, [streamStatus]);
  reactExports.useEffect(() => {
    const unsubscribe = getPlatformApi().onToggleFullscreen(() => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {
        });
      } else {
        document.documentElement.requestFullscreen().catch(() => {
        });
      }
    });
    return () => unsubscribe();
  }, []);
  reactExports.useEffect(() => {
    if (!antiAfkEnabled || streamStatus !== "streaming") return;
    const interval = window.setInterval(() => {
      clientRef.current?.sendAntiAfkPulse();
    }, 24e4);
    return () => clearInterval(interval);
  }, [antiAfkEnabled, streamStatus]);
  reactExports.useEffect(() => {
    if (streamStatus === "streaming" && currentPage !== "settings" && videoRef.current) {
      const timer = window.setTimeout(() => {
        if (videoRef.current && document.activeElement !== videoRef.current) {
          videoRef.current.focus();
          console.log("[App] Restored focus to video element after leaving Settings");
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentPage, streamStatus]);
  reactExports.useEffect(() => {
    if (streamStatus === "idle" || sessionStartedAtMs === null) {
      setSessionElapsedSeconds(0);
      return;
    }
    const updateElapsed = () => {
      const elapsed = Math.max(0, Math.floor((Date.now() - sessionStartedAtMs) / 1e3));
      setSessionElapsedSeconds(elapsed);
    };
    updateElapsed();
    const timer = window.setInterval(updateElapsed, 1e3);
    return () => window.clearInterval(timer);
  }, [sessionStartedAtMs, streamStatus]);
  reactExports.useEffect(() => {
    if (!streamWarning) return;
    const warning = streamWarning;
    const timer = window.setTimeout(() => {
      setStreamWarning((current) => current === warning ? null : current);
    }, 12e3);
    return () => window.clearTimeout(timer);
  }, [streamWarning]);
  reactExports.useEffect(() => {
    const unsubscribe = getPlatformApi().onSignalingEvent(async (event) => {
      console.log(`[App] Signaling event: ${event.type}`, event.type === "offer" ? `(SDP ${event.sdp.length} chars)` : "", event.type === "remote-ice" ? event.candidate : "");
      try {
        if (event.type === "offer") {
          const activeSession = sessionRef.current;
          if (!activeSession) {
            console.warn("[App] Received offer but no active session in sessionRef!");
            return;
          }
          console.log("[App] Active session for offer:", JSON.stringify({
            sessionId: activeSession.sessionId,
            serverIp: activeSession.serverIp,
            signalingServer: activeSession.signalingServer,
            mediaConnectionInfo: activeSession.mediaConnectionInfo,
            iceServersCount: activeSession.iceServers?.length
          }));
          if (!clientRef.current && videoRef.current && audioRef.current) {
            clientRef.current = new GfnWebRtcClient({
              videoElement: videoRef.current,
              audioElement: audioRef.current,
              microphoneMode: settings.microphoneMode,
              microphoneDeviceId: settings.microphoneDeviceId || void 0,
              onLog: (line) => console.log(`[WebRTC] ${line}`),
              onStats: (stats) => setDiagnostics(stats),
              onEscHoldProgress: (visible, progress) => {
                setEscHoldReleaseIndicator({ visible, progress });
              },
              onTimeWarning: (warning) => {
                setStreamWarning({
                  code: warning.code,
                  message: warningMessage(warning.code),
                  tone: warningTone(warning.code),
                  secondsLeft: warning.secondsLeft
                });
              },
              onMicStateChange: (state) => {
                console.log(`[App] Mic state: ${state.state}${state.deviceLabel ? ` (${state.deviceLabel})` : ""}`);
              }
            });
            if (settings.microphoneMode !== "disabled") {
              void clientRef.current.startMicrophone();
            }
          }
          if (clientRef.current) {
            await clientRef.current.handleOffer(event.sdp, activeSession, {
              codec: settings.codec,
              colorQuality: settings.colorQuality,
              resolution: settings.resolution,
              fps: settings.fps,
              maxBitrateKbps: settings.maxBitrateMbps * 1e3
            });
            setLaunchError(null);
            setStreamStatus("streaming");
            setSessionStartedAtMs((current) => current ?? Date.now());
            if (isAndroid() && videoRef.current && clientRef.current) {
              touchHandlerRef.current?.dispose();
              touchHandlerRef.current = new TouchInputHandler(videoRef.current, clientRef.current);
            }
          }
        } else if (event.type === "remote-ice") {
          await clientRef.current?.addRemoteCandidate(event.candidate);
        } else if (event.type === "disconnected") {
          console.warn("Signaling disconnected:", event.reason);
          if (clientRef.current?.isStreaming?.()) {
            console.warn("[App] Signaling closed after stream established -- ignoring (WebRTC media still active)");
            return;
          }
          touchHandlerRef.current?.dispose();
          touchHandlerRef.current = null;
          clientRef.current?.dispose();
          clientRef.current = null;
          setStreamStatus("idle");
          setSession(null);
          setStreamingGame(null);
          setLaunchError(null);
          setSessionStartedAtMs(null);
          setSessionElapsedSeconds(0);
          setStreamWarning(null);
          setEscHoldReleaseIndicator({ visible: false, progress: 0 });
          setDiagnostics(defaultDiagnostics());
          launchInFlightRef.current = false;
        } else if (event.type === "error") {
          console.error("Signaling error:", event.message);
        }
      } catch (error) {
        console.error("Signaling event error:", error);
      }
    });
    return () => unsubscribe();
  }, [settings]);
  const updateSetting = reactExports.useCallback(async (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    if (settingsLoaded) {
      await getPlatformApi().setSetting(key, value);
    }
  }, [settingsLoaded]);
  const handleLogin = reactExports.useCallback(async () => {
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const session2 = await getPlatformApi().login({ providerIdpId: providerIdpId || void 0 });
      setAuthSession(session2);
      if (session2?.provider?.idpId) setProviderIdpId(session2.provider.idpId);
      setIsLoggingIn(false);
      const token = session2.tokens.idToken ?? session2.tokens.accessToken;
      getPlatformApi().getRegions({ token, providerStreamingBaseUrl: session2.provider?.streamingServiceUrl }).then(setRegions).catch(() => {
      });
      loadSubscriptionInfo(session2).catch(() => setSubscriptionInfo(null));
      getPlatformApi().fetchMainGames({
        token,
        providerStreamingBaseUrl: session2.provider.streamingServiceUrl
      }).then((mainGames) => {
        setGames(mainGames);
        setSource("main");
        setSelectedGameId(mainGames[0]?.id ?? "");
      }).catch((e) => {
        setLoginError("games: " + (e?.message ?? String(e)));
        setTimeout(() => setLoginError(null), 8e3);
        getPlatformApi().fetchPublicGames().then((g) => {
          setGames(g);
          setSource("public");
        }).catch(() => {
        });
      });
      getPlatformApi().fetchLibraryGames({
        token,
        providerStreamingBaseUrl: session2.provider.streamingServiceUrl
      }).then(setLibraryGames).catch(() => {
      });
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Login failed");
      setIsLoggingIn(false);
    }
  }, [loadSubscriptionInfo, providerIdpId]);
  const handleLogout = reactExports.useCallback(async () => {
    await getPlatformApi().logout();
    setAuthSession(null);
    setGames([]);
    setLibraryGames([]);
    setNavbarActiveSession(null);
    setIsResumingNavbarSession(false);
    setLaunchError(null);
    setSubscriptionInfo(null);
    setCurrentPage("home");
    const publicGames = await getPlatformApi().fetchPublicGames();
    setGames(publicGames);
    setSource("public");
  }, []);
  const loadGames = reactExports.useCallback(async (targetSource) => {
    setIsLoadingGames(true);
    try {
      const token = authSession?.tokens.idToken ?? authSession?.tokens.accessToken;
      const baseUrl = effectiveStreamingBaseUrl;
      let result = [];
      if (targetSource === "main" && token) {
        result = await getPlatformApi().fetchMainGames({ token, providerStreamingBaseUrl: baseUrl });
      } else if (targetSource === "library" && token) {
        result = await getPlatformApi().fetchLibraryGames({ token, providerStreamingBaseUrl: baseUrl });
        setLibraryGames(result);
      } else if (targetSource === "public") {
        result = await getPlatformApi().fetchPublicGames();
      }
      if (targetSource !== "library") {
        setGames(result);
        setSource(targetSource);
        setSelectedGameId(result[0]?.id ?? "");
      }
    } catch (error) {
      console.error("Failed to load games:", error);
    } finally {
      setIsLoadingGames(false);
    }
  }, [authSession, effectiveStreamingBaseUrl]);
  const claimAndConnectSession = reactExports.useCallback(async (existingSession) => {
    const token = authSession?.tokens.idToken ?? authSession?.tokens.accessToken;
    if (!token) {
      throw new Error("Missing token for session resume");
    }
    if (!existingSession.serverIp) {
      throw new Error("Active session is missing server address. Start the game again to create a new session.");
    }
    const claimed = await getPlatformApi().claimSession({
      token,
      streamingBaseUrl: effectiveStreamingBaseUrl,
      serverIp: existingSession.serverIp,
      sessionId: existingSession.sessionId,
      settings: {
        resolution: settings.resolution,
        fps: settings.fps,
        maxBitrateMbps: settings.maxBitrateMbps,
        codec: settings.codec,
        colorQuality: settings.colorQuality
      }
    });
    console.log("Claimed session:", {
      sessionId: claimed.sessionId,
      signalingServer: claimed.signalingServer,
      signalingUrl: claimed.signalingUrl,
      status: claimed.status
    });
    await sleep(1e3);
    setSession(claimed);
    sessionRef.current = claimed;
    setQueuePosition(void 0);
    setStreamStatus("connecting");
    await getPlatformApi().connectSignaling({
      sessionId: claimed.sessionId,
      signalingServer: claimed.signalingServer,
      signalingUrl: claimed.signalingUrl
    });
  }, [authSession, effectiveStreamingBaseUrl, settings]);
  const handlePlayGame = reactExports.useCallback(async (game) => {
    if (!selectedProvider) return;
    if (launchInFlightRef.current || streamStatus !== "idle") {
      console.warn("Ignoring play request: launch already in progress or stream not idle", {
        inFlight: launchInFlightRef.current,
        streamStatus
      });
      return;
    }
    launchInFlightRef.current = true;
    let loadingStep = "queue";
    const updateLoadingStep = (next) => {
      loadingStep = next;
      setStreamStatus(next);
    };
    setSessionStartedAtMs(Date.now());
    setSessionElapsedSeconds(0);
    setStreamWarning(null);
    setLaunchError(null);
    setStreamingGame(game);
    updateLoadingStep("queue");
    setQueuePosition(void 0);
    try {
      const token = authSession?.tokens.idToken ?? authSession?.tokens.accessToken;
      const selectedVariantId = variantByGameId[game.id] ?? defaultVariantId(game);
      let appId = null;
      if (isNumericId(selectedVariantId)) {
        appId = selectedVariantId;
      } else if (isNumericId(game.launchAppId)) {
        appId = game.launchAppId;
      }
      if (!appId && token) {
        try {
          const resolved = await getPlatformApi().resolveLaunchAppId({
            token,
            providerStreamingBaseUrl: effectiveStreamingBaseUrl,
            appIdOrUuid: game.uuid ?? selectedVariantId
          });
          if (resolved && isNumericId(resolved)) {
            appId = resolved;
          }
        } catch {
        }
      }
      if (!appId) {
        throw new Error("Could not resolve numeric appId for this game");
      }
      if (token) {
        try {
          const activeSessions = await getPlatformApi().getActiveSessions(token, effectiveStreamingBaseUrl);
          if (activeSessions.length > 0) {
            const existingSession = activeSessions[0];
            await claimAndConnectSession(existingSession);
            setNavbarActiveSession(null);
            return;
          }
        } catch (error) {
          console.error("Failed to claim/resume session:", error);
        }
      }
      const newSession = await getPlatformApi().createSession({
        token: token || void 0,
        streamingBaseUrl: effectiveStreamingBaseUrl,
        appId,
        internalTitle: game.title,
        accountLinked: game.playType !== "INSTALL_TO_PLAY",
        zone: "prod",
        settings: {
          resolution: settings.resolution,
          fps: settings.fps,
          maxBitrateMbps: settings.maxBitrateMbps,
          codec: settings.codec,
          colorQuality: settings.colorQuality
        }
      });
      setSession(newSession);
      setQueuePosition(newSession.queuePosition);
      let finalSession = null;
      let isInQueueMode = (newSession.queuePosition ?? 0) > 1;
      let timeoutStartAttempt = 1;
      const maxAttempts = Math.ceil(SESSION_READY_TIMEOUT_MS / SESSION_READY_POLL_INTERVAL_MS);
      let attempt = 0;
      while (true) {
        attempt++;
        await sleep(SESSION_READY_POLL_INTERVAL_MS);
        const polled = await getPlatformApi().pollSession({
          token: token || void 0,
          streamingBaseUrl: newSession.streamingBaseUrl ?? effectiveStreamingBaseUrl,
          serverIp: newSession.serverIp,
          zone: newSession.zone,
          sessionId: newSession.sessionId
        });
        setSession(polled);
        setQueuePosition(polled.queuePosition);
        const wasInQueueMode = isInQueueMode;
        isInQueueMode = (polled.queuePosition ?? 0) > 1;
        if (wasInQueueMode && !isInQueueMode) {
          timeoutStartAttempt = attempt;
        }
        console.log(
          `Poll attempt ${attempt}: status=${polled.status}, queuePosition=${polled.queuePosition ?? "n/a"}, serverIp=${polled.serverIp}, queueMode=${isInQueueMode}`
        );
        if (isSessionReadyForConnect(polled.status)) {
          finalSession = polled;
          break;
        }
        if (isInQueueMode) {
          updateLoadingStep("queue");
        } else if (polled.status === 1) {
          updateLoadingStep("setup");
        }
        if (!isInQueueMode && attempt - timeoutStartAttempt >= maxAttempts) {
          throw new Error(`Session did not become ready in time (${Math.round(SESSION_READY_TIMEOUT_MS / 1e3)}s)`);
        }
      }
      setQueuePosition(void 0);
      updateLoadingStep("connecting");
      const sessionToConnect = sessionRef.current ?? finalSession ?? newSession;
      console.log("Connecting signaling with:", {
        sessionId: sessionToConnect.sessionId,
        signalingServer: sessionToConnect.signalingServer,
        signalingUrl: sessionToConnect.signalingUrl,
        status: sessionToConnect.status
      });
      await getPlatformApi().connectSignaling({
        sessionId: sessionToConnect.sessionId,
        signalingServer: sessionToConnect.signalingServer,
        signalingUrl: sessionToConnect.signalingUrl
      });
    } catch (error) {
      console.error("Launch failed:", error);
      setLaunchError(toLaunchErrorState(error, loadingStep));
      await getPlatformApi().disconnectSignaling().catch(() => {
      });
      clientRef.current?.dispose();
      clientRef.current = null;
      setSession(null);
      setStreamStatus("idle");
      setQueuePosition(void 0);
      setSessionStartedAtMs(null);
      setSessionElapsedSeconds(0);
      setStreamWarning(null);
      setEscHoldReleaseIndicator({ visible: false, progress: 0 });
      setDiagnostics(defaultDiagnostics());
      void refreshNavbarActiveSession();
    } finally {
      launchInFlightRef.current = false;
    }
  }, [
    authSession,
    claimAndConnectSession,
    effectiveStreamingBaseUrl,
    refreshNavbarActiveSession,
    selectedProvider,
    settings,
    streamStatus,
    variantByGameId
  ]);
  const handleResumeFromNavbar = reactExports.useCallback(async () => {
    if (!selectedProvider || !navbarActiveSession || isResumingNavbarSession) {
      return;
    }
    if (launchInFlightRef.current || streamStatus !== "idle") {
      return;
    }
    launchInFlightRef.current = true;
    setIsResumingNavbarSession(true);
    let loadingStep = "setup";
    const updateLoadingStep = (next) => {
      loadingStep = next;
      setStreamStatus(next);
    };
    setLaunchError(null);
    setQueuePosition(void 0);
    setSessionStartedAtMs(Date.now());
    setSessionElapsedSeconds(0);
    setStreamWarning(null);
    updateLoadingStep("setup");
    try {
      await claimAndConnectSession(navbarActiveSession);
      setNavbarActiveSession(null);
    } catch (error) {
      console.error("Navbar resume failed:", error);
      setLaunchError(toLaunchErrorState(error, loadingStep));
      await getPlatformApi().disconnectSignaling().catch(() => {
      });
      clientRef.current?.dispose();
      clientRef.current = null;
      setSession(null);
      setStreamStatus("idle");
      setQueuePosition(void 0);
      setSessionStartedAtMs(null);
      setSessionElapsedSeconds(0);
      setStreamWarning(null);
      setEscHoldReleaseIndicator({ visible: false, progress: 0 });
      setDiagnostics(defaultDiagnostics());
      void refreshNavbarActiveSession();
    } finally {
      launchInFlightRef.current = false;
      setIsResumingNavbarSession(false);
    }
  }, [
    claimAndConnectSession,
    isResumingNavbarSession,
    navbarActiveSession,
    refreshNavbarActiveSession,
    selectedProvider,
    streamStatus
  ]);
  const handleStopStream = reactExports.useCallback(async () => {
    try {
      resolveExitPrompt(false);
      await getPlatformApi().disconnectSignaling();
      const current = sessionRef.current;
      if (current) {
        const token = authSession?.tokens.idToken ?? authSession?.tokens.accessToken;
        await getPlatformApi().stopSession({
          token: token || void 0,
          streamingBaseUrl: current.streamingBaseUrl,
          serverIp: current.serverIp,
          zone: current.zone,
          sessionId: current.sessionId
        });
      }
      touchHandlerRef.current?.dispose();
      touchHandlerRef.current = null;
      clientRef.current?.dispose();
      clientRef.current = null;
      setSession(null);
      setStreamStatus("idle");
      setStreamingGame(null);
      setNavbarActiveSession(null);
      setLaunchError(null);
      setSessionStartedAtMs(null);
      setSessionElapsedSeconds(0);
      setStreamWarning(null);
      setEscHoldReleaseIndicator({ visible: false, progress: 0 });
      setDiagnostics(defaultDiagnostics());
      void refreshNavbarActiveSession();
    } catch (error) {
      console.error("Stop failed:", error);
    }
  }, [authSession, refreshNavbarActiveSession, resolveExitPrompt]);
  const handleDismissLaunchError = reactExports.useCallback(async () => {
    await getPlatformApi().disconnectSignaling().catch(() => {
    });
    clientRef.current?.dispose();
    clientRef.current = null;
    setSession(null);
    setLaunchError(null);
    setStreamingGame(null);
    setQueuePosition(void 0);
    setSessionStartedAtMs(null);
    setSessionElapsedSeconds(0);
    setStreamWarning(null);
    setEscHoldReleaseIndicator({ visible: false, progress: 0 });
    setDiagnostics(defaultDiagnostics());
    void refreshNavbarActiveSession();
  }, [refreshNavbarActiveSession]);
  const releasePointerLockIfNeeded = reactExports.useCallback(async () => {
    if (document.pointerLockElement) {
      document.exitPointerLock();
      setEscHoldReleaseIndicator({ visible: false, progress: 0 });
      await sleep(75);
    }
  }, []);
  const handlePromptedStopStream = reactExports.useCallback(async () => {
    if (streamStatus === "idle") {
      return;
    }
    await releasePointerLockIfNeeded();
    const gameName = (streamingGame?.title || "this game").trim();
    const shouldExit = await requestExitPrompt(gameName);
    if (!shouldExit) {
      return;
    }
    await handleStopStream();
  }, [handleStopStream, releasePointerLockIfNeeded, requestExitPrompt, streamStatus, streamingGame?.title]);
  reactExports.useEffect(() => {
    const handleKeyDown = (e) => {
      if (isAndroid()) return;
      const target = e.target;
      const isTyping = !!target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (isTyping) {
        return;
      }
      if (exitPrompt.open) {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          handleExitPromptCancel();
        } else if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          handleExitPromptConfirm();
        }
        return;
      }
      const isPasteShortcut = e.key.toLowerCase() === "v" && !e.altKey && (isMac ? e.metaKey : e.ctrlKey);
      if (streamStatus === "streaming" && isPasteShortcut) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (settings.clipboardPaste) {
          void (async () => {
            const client2 = clientRef.current;
            if (!client2) return;
            try {
              const text = await navigator.clipboard.readText();
              if (text && client2.sendText(text) > 0) {
                return;
              }
            } catch (error) {
              console.warn("Clipboard read failed, falling back to paste shortcut:", error);
            }
            client2.sendPasteShortcut(isMac);
          })();
        }
        return;
      }
      if (isShortcutMatch(e, shortcuts.toggleStats)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        setShowStatsOverlay((prev) => !prev);
        return;
      }
      if (isShortcutMatch(e, shortcuts.togglePointerLock)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (streamStatus === "streaming" && videoRef.current) {
          if (document.pointerLockElement === videoRef.current) {
            document.exitPointerLock();
          } else {
            void requestEscLockedPointerCapture(videoRef.current);
          }
        }
        return;
      }
      if (isShortcutMatch(e, shortcuts.stopStream)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        void handlePromptedStopStream();
        return;
      }
      if (isShortcutMatch(e, shortcuts.toggleAntiAfk)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (streamStatus === "streaming") {
          setAntiAfkEnabled((prev) => !prev);
        }
        return;
      }
      if (isShortcutMatch(e, shortcuts.toggleMicrophone)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (streamStatus === "streaming") {
          clientRef.current?.toggleMicrophone();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [
    exitPrompt.open,
    handleExitPromptCancel,
    handleExitPromptConfirm,
    handlePromptedStopStream,
    requestEscLockedPointerCapture,
    settings.clipboardPaste,
    shortcuts,
    streamStatus
  ]);
  const filteredGames = reactExports.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return games;
    return games.filter((g) => g.title.toLowerCase().includes(query));
  }, [games, searchQuery]);
  const filteredLibraryGames = reactExports.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return libraryGames;
    return libraryGames.filter((g) => g.title.toLowerCase().includes(query));
  }, [libraryGames, searchQuery]);
  const gameTitleByAppId = reactExports.useMemo(() => {
    const titles = /* @__PURE__ */ new Map();
    const allKnownGames = [...games, ...libraryGames];
    for (const game of allKnownGames) {
      const idsForGame = /* @__PURE__ */ new Set();
      const launchId = parseNumericId(game.launchAppId);
      if (launchId !== null) {
        idsForGame.add(launchId);
      }
      for (const variant of game.variants) {
        const variantId = parseNumericId(variant.id);
        if (variantId !== null) {
          idsForGame.add(variantId);
        }
      }
      for (const appId of idsForGame) {
        if (!titles.has(appId)) {
          titles.set(appId, game.title);
        }
      }
    }
    return titles;
  }, [games, libraryGames]);
  const activeSessionGameTitle = reactExports.useMemo(() => {
    if (!navbarActiveSession) return null;
    const mappedTitle = gameTitleByAppId.get(navbarActiveSession.appId);
    if (mappedTitle) {
      return mappedTitle;
    }
    if (session?.sessionId === navbarActiveSession.sessionId && streamingGame?.title) {
      return streamingGame.title;
    }
    return null;
  }, [gameTitleByAppId, navbarActiveSession, session?.sessionId, streamingGame?.title]);
  if (!authSession) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        LoginScreen,
        {
          providers,
          selectedProviderId: providerIdpId,
          onProviderChange: setProviderIdpId,
          onLogin: handleLogin,
          isLoading: isLoggingIn,
          error: loginError,
          isInitializing,
          statusMessage: startupStatusMessage
        }
      ),
      controllerConnected && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "controller-hint", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "D-pad Navigate" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "A Select" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "B Back" })
      ] })
    ] });
  }
  const showLaunchOverlay = streamStatus !== "idle" || launchError !== null;
  if (showLaunchOverlay) {
    const loadingStatus = launchError ? launchError.stage : toLoadingStatus(streamStatus);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      streamStatus !== "idle" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        StreamView,
        {
          videoRef,
          audioRef,
          stats: diagnostics,
          showStats: showStatsOverlay,
          shortcuts: {
            toggleStats: formatShortcutForDisplay(settings.shortcutToggleStats, isMac),
            togglePointerLock: formatShortcutForDisplay(settings.shortcutTogglePointerLock, isMac),
            stopStream: formatShortcutForDisplay(settings.shortcutStopStream, isMac),
            toggleMicrophone: formatShortcutForDisplay(settings.shortcutToggleMicrophone, isMac)
          },
          hideStreamButtons: settings.hideStreamButtons,
          serverRegion: session?.serverIp,
          connectedControllers: diagnostics.connectedGamepads,
          antiAfkEnabled,
          escHoldReleaseIndicator,
          exitPrompt,
          sessionElapsedSeconds,
          sessionClockShowEveryMinutes: settings.sessionClockShowEveryMinutes,
          sessionClockShowDurationSeconds: settings.sessionClockShowDurationSeconds,
          streamWarning,
          isConnecting: streamStatus === "connecting",
          gameTitle: streamingGame?.title ?? "Game",
          onToggleFullscreen: () => {
            if (document.fullscreenElement) {
              document.exitFullscreen().catch(() => {
              });
            } else {
              document.documentElement.requestFullscreen().catch(() => {
              });
            }
          },
          onConfirmExit: handleExitPromptConfirm,
          onCancelExit: handleExitPromptCancel,
          onEndSession: () => {
            void handlePromptedStopStream();
          },
          onToggleMicrophone: () => {
            clientRef.current?.toggleMicrophone();
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TouchGamepad,
        {
          clientRef,
          visible: isAndroid() && streamStatus === "streaming"
        }
      ),
      streamStatus !== "streaming" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        StreamLoading,
        {
          gameTitle: streamingGame?.title ?? "Game",
          gameCover: streamingGame?.imageUrl,
          status: loadingStatus,
          queuePosition,
          error: launchError ? {
            title: launchError.title,
            description: launchError.description,
            code: launchError.codeLabel
          } : void 0,
          onCancel: () => {
            if (launchError) {
              void handleDismissLaunchError();
              return;
            }
            void handleStopStream();
          }
        }
      ),
      controllerConnected && streamStatus !== "streaming" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "controller-hint controller-hint--overlay", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "D-pad Navigate" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "A Select" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "B Back" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "app-container", children: [
    startupRefreshNotice && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `auth-refresh-notice auth-refresh-notice--${startupRefreshNotice.tone}`, children: startupRefreshNotice.text }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Navbar,
      {
        currentPage,
        onNavigate: setCurrentPage,
        user: authSession.user,
        subscription: subscriptionInfo,
        activeSession: navbarActiveSession,
        activeSessionGameTitle,
        isResumingSession: isResumingNavbarSession,
        onResumeSession: () => {
          void handleResumeFromNavbar();
        },
        onLogout: handleLogout
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "main-content", children: [
      currentPage === "home" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        HomePage,
        {
          games: filteredGames,
          source,
          onSourceChange: loadGames,
          searchQuery,
          onSearchChange: setSearchQuery,
          onPlayGame: handlePlayGame,
          isLoading: isLoadingGames,
          selectedGameId,
          onSelectGame: setSelectedGameId
        }
      ),
      currentPage === "library" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        LibraryPage,
        {
          games: filteredLibraryGames,
          searchQuery,
          onSearchChange: setSearchQuery,
          onPlayGame: handlePlayGame,
          isLoading: isLoadingGames,
          selectedGameId,
          onSelectGame: setSelectedGameId
        }
      ),
      currentPage === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingsPage,
        {
          settings,
          regions,
          onSettingChange: updateSetting
        }
      )
    ] }),
    controllerConnected && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "controller-hint", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "D-pad Navigate" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "A Select" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "B Back" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "LB/RB Tabs" })
    ] })
  ] });
}
ReactDOM.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React$2.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
);

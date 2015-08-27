/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(1);
	var UsernameModal = __webpack_require__(2);
	var TitleBar = __webpack_require__(13)
	var $ = __webpack_require__(14)
	var Hub = __webpack_require__(5)
	var Const = __webpack_require__(10)
	var Actions = __webpack_require__(4)
	var Socket = __webpack_require__(12)
	var UserStore = __webpack_require__(15);
	var TaskStore = __webpack_require__(18)
	var UsersList = __webpack_require__(21);
	var TaskBtn = __webpack_require__(22)
	var TaskModal = __webpack_require__(23);
	var TasksList = __webpack_require__(24);


	$(function(){

		console.log('ready');

		React.render(React.createElement(UsernameModal), document.getElementById("modal-username"));
		React.render(React.createElement(UsersList), document.getElementById("user-area"));
		React.render(React.createElement(TasksList), document.getElementById("content-area"));

		path = window.location.pathname
		results=path.match('\/room\/([0-9]*)');

		if (results && results[1]){
			roomId = results[1];
			// var socket = io.connect();
			Socket.on('connect', function() {
		    console.log('connected via', Socket.io.engine.transport.name);

		    React.render(React.createElement(TitleBar, {name: roomId}),document.getElementById("header"))

		    $("#userNameInputModal").modal({backdrop:'static', keyboard: false})
		    
		    $("#userNameInputModal").modal('show');
			});

			Socket.on('room changed',function(data){
				console.log('room changed receive data', data);
				if (data.isAdmin){
					_setupAdminTools();
				}
				console.log('connected via', Socket.io.engine.transport.name);
				Actions.joinRoomSuccess(data.users);
			})

			Socket.on('user joined', function(data){
				console.log('room changed receive data', data);
				Actions.joinRoomSuccess(data.users);
			});

			Socket.on('task created',function(data){
				console.log('task created, receive data', data);
				Actions.createTaskSuccess(data.taskInfo, data.status);
			})

			Socket.on('task update', function(data){
				console.log('task update, receive data', data);
				Actions.updateTask(data.taskInfo, data.status);
			})

			Socket.on('all polled', function(data){
				console.log('task update, receive data', data);
				Actions.updateTask(data.taskInfo, data.status);
			})

			Socket.on('user status update', function(data){
				console.log('user status update received data', data)
				Actions.updateUserStatus(data.users);
			})

	  }

	  // Register callback to handle all updates
	  Hub.register(function(action) {
	  	console.log('main.js dispatch');

	  	if (action.actionType == Const.USER_JOIN_ROOM){
	  		_joinRoom(roomId, action.uname);
	  	}

		  if (action.actionType == Const.USER_JOIN_ROOM_SUCCESS) {
		  	$("#userNameInputModal").modal('hide');
		  	console.log('dispatch: join room success', action.users)
		  	UserStore.updateUsers(action.users);
		  }

		  if (action.actionType == Const.CREATE_TASK){
		  	_createTask(action.taskName, action.desc);
		  }

		  if (action.actionType == Const.CREATE_TASK_SUCCESS){
		  	TaskStore.updateTask(action.taskInfo, action.status);
		  	$("#newTaskInputModal").modal('hide');
		  	console.log('dispatch: add new task success', action.taskInfo);
		  }

		  if (action.actionType == Const.SUBMIT_POLL){
		  	_submitPoll(action.tid, action.point);
		  }

		  if (action.actionType == Const.SUBMIT_POLL_SUCCESS){
		  	TaskStore.updateTask(action.taskInfo, action.status);
		  	console.log('dispatch: update task info', action.taskInfo);
		  }

		  if (action.actionType == Const.USER_STATUS_UPDATE){
		  	UserStore.updateUsers(action.users);
		  	console.log('dispatch: update user status', action.users);
		  }

		  if (action.actionType == Const.CLOSING_POLL){
		  	_closePoll(action.tid);
		  }

		})

	})
	var _setupAdminTools = function(){
		var showModal=function(){
			$("#newTaskInputModal").modal('show');
		}
		React.render(React.createElement(TaskModal), document.getElementById("modal-task"));
		React.render(React.createElement(TaskBtn, {onclick:showModal}), document.getElementById("button-area"));
	}

	var _joinRoom = function(roomId, uname){
		Socket.emit('subscribe', roomId, uname);
		console.log('send out subscribe command');
	}

	var _createTask = function(taskName, desc){
		Socket.emit('createTask', taskName, desc);
		console.log('send out createTask command');	
	}

	var _submitPoll = function(tid, point){
		Socket.emit('submitPoll', tid, point);
		console.log('send out submitPoll command');		
	}

	var _closePoll = function(tid){
		Socket.emit('closingPoll', tid);
		console.log('send out closing poll command');
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOMharmony */var React = __webpack_require__(1);
	var SubmitBtn = __webpack_require__(3)
	var Actions = __webpack_require__(4);

	var UsernameModal = React.createClass({displayName: "UsernameModal",
		getInitialState: function() {
			return {enable: false, submitting: false, uname:''};
		},

		handleSubmit: function(){

			this.setState({enable: false, submitting: true});
			console.log('fire joinRoom action');
			Actions.joinRoom(this.state.uname);
			
			return;
		},

		handleUsername: function(e){
			console.log(e.target.value);
			if (e.target.value.trim().length >= 3 && e.target.value.trim().length<=16){
				this.setState({enable: true, uname: e.target.value.trim()});
			}else{
				this.setState({enable: false, uname: e.target.value.trim()});
			}

		},

		render: function(){

			return React.createElement("div", {className: "modal fade", id: "userNameInputModal", tabindex: "-1", role: "dialog", "aria-labelledby": "userNameInputModalLabel"}, 
	    	React.createElement("div", {className: "modal-dialog", role: "document"}, 
	        React.createElement("div", {className: "modal-content"}, 
	          React.createElement("div", {className: "modal-header"}, 
	            React.createElement("h4", {className: "modal-title", id: "userNameInputModalLabel"}, "Please input your name")
	          ), 
	          React.createElement("div", {className: "modal-body"}, 
	              React.createElement("div", {className: "form-group"}, 
	                React.createElement("label", {for: "user-name", className: "control-label"}, "User name:"), 
	                React.createElement("input", {type: "text", className: "form-control", disabled: this.state.submitting ? 'disabled':'', onChange: this.handleUsername})
	              )
	          ), 
	          React.createElement("div", {className: "modal-footer"}, 
	            React.createElement(SubmitBtn, {enable: this.state.enable, onClick: this.handleSubmit})
	          )
	        )
	    	)
		  )
		}
	})

	module.exports = UsernameModal;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOMharmony */var React = __webpack_require__(1);
	var SubmitBtn = React.createClass({displayName: "SubmitBtn",
		getInitialState: function() {
			return {status:this.props.status||0};
		},
		
		_handleClick:function(){
			this.setState({status: 1})
			console.log('SubmitBtn: Clicked, change status to 1');
			this.props.onClick();
		},

		componentWillReceiveProps: function(nextProps) {
			this.setState({status: nextProps.status});
		},

		render: function() {
			var className = ''
			var disabled = this.props.enable? '':'disabled';
			console.log("SubmitBtn: status %s enable %s", this.state.status, this.props.enable);
			var label = 'Submit';
			switch (this.state.status){
				case 0:
					className = 'fa fa-circle-o-notch fa-spin hidden';
					break;
				case 1:
					className = 'fa fa-circle-o-notch fa-spin';
					disabled = 'disabled';
					break;
				case 2:
					className = 'fa fa-circle-o-notch fa-spin hidden';
					disabled = 'disabled';
					label = 'Submited';
					break;
			}

			return React.createElement("button", {type: "button", className: "btn btn-primary btn-lg", disabled: disabled, 
				onClick: this._handleClick}, label, " ", React.createElement("i", {className: className}))		

		}
	})

	module.exports = SubmitBtn;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Hub = __webpack_require__(5);
	var Const = __webpack_require__(10)

	var socket = __webpack_require__(12)


	module.exports = {

		joinRoom: function(username){
			Hub.dispatch({
				actionType: Const.USER_JOIN_ROOM,
				uname: username 
			})

		},

		joinRoomSuccess: function(users){
			Hub.dispatch({
				actionType: Const.USER_JOIN_ROOM_SUCCESS,
				users: users
			})
		},

		leaveRoom: function(username){
			Hub.dispatch({
				actionType: Const.USER_LEAVE_ROOM,
				uname: username
			})
		},

		createTask: function(taskName, desc){
			Hub.dispatch({
				actionType: Const.CREATE_TASK,
				taskName: taskName,
				desc: desc
			})
		}, 

		createTaskSuccess: function(taskInfo, status){
			Hub.dispatch({
				actionType: Const.CREATE_TASK_SUCCESS,
				taskInfo: taskInfo,
				status: status
			})
		},

		submitPoll: function(tid, point){
			Hub.dispatch({
				actionType: Const.SUBMIT_POLL,
				tid: tid,
				point: point
			})
		}, 

		updateTask: function(taskInfo, status){
			Hub.dispatch({
				actionType: Const.SUBMIT_POLL_SUCCESS,
				taskInfo: taskInfo,
				status: status
			})
		},

		updateUserStatus: function(users){
			Hub.dispatch({
				actionType: Const.USER_STATUS_UPDATE,
				users: users
			})
		}, 

		closePoll: function(tid) {
			Hub.dispatch({
				actionType: Const.CLOSING_POLL,
				tid: tid
			})
		}
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Dispatcher = __webpack_require__(6).Dispatcher;

	module.exports = new Dispatcher();

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	module.exports.Dispatcher = __webpack_require__(7);


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule Dispatcher
	 * 
	 * @preventMunge
	 */

	'use strict';

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var invariant = __webpack_require__(9);

	var _prefix = 'ID_';

	/**
	 * Dispatcher is used to broadcast payloads to registered callbacks. This is
	 * different from generic pub-sub systems in two ways:
	 *
	 *   1) Callbacks are not subscribed to particular events. Every payload is
	 *      dispatched to every registered callback.
	 *   2) Callbacks can be deferred in whole or part until other callbacks have
	 *      been executed.
	 *
	 * For example, consider this hypothetical flight destination form, which
	 * selects a default city when a country is selected:
	 *
	 *   var flightDispatcher = new Dispatcher();
	 *
	 *   // Keeps track of which country is selected
	 *   var CountryStore = {country: null};
	 *
	 *   // Keeps track of which city is selected
	 *   var CityStore = {city: null};
	 *
	 *   // Keeps track of the base flight price of the selected city
	 *   var FlightPriceStore = {price: null}
	 *
	 * When a user changes the selected city, we dispatch the payload:
	 *
	 *   flightDispatcher.dispatch({
	 *     actionType: 'city-update',
	 *     selectedCity: 'paris'
	 *   });
	 *
	 * This payload is digested by `CityStore`:
	 *
	 *   flightDispatcher.register(function(payload) {
	 *     if (payload.actionType === 'city-update') {
	 *       CityStore.city = payload.selectedCity;
	 *     }
	 *   });
	 *
	 * When the user selects a country, we dispatch the payload:
	 *
	 *   flightDispatcher.dispatch({
	 *     actionType: 'country-update',
	 *     selectedCountry: 'australia'
	 *   });
	 *
	 * This payload is digested by both stores:
	 *
	 *   CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
	 *     if (payload.actionType === 'country-update') {
	 *       CountryStore.country = payload.selectedCountry;
	 *     }
	 *   });
	 *
	 * When the callback to update `CountryStore` is registered, we save a reference
	 * to the returned token. Using this token with `waitFor()`, we can guarantee
	 * that `CountryStore` is updated before the callback that updates `CityStore`
	 * needs to query its data.
	 *
	 *   CityStore.dispatchToken = flightDispatcher.register(function(payload) {
	 *     if (payload.actionType === 'country-update') {
	 *       // `CountryStore.country` may not be updated.
	 *       flightDispatcher.waitFor([CountryStore.dispatchToken]);
	 *       // `CountryStore.country` is now guaranteed to be updated.
	 *
	 *       // Select the default city for the new country
	 *       CityStore.city = getDefaultCityForCountry(CountryStore.country);
	 *     }
	 *   });
	 *
	 * The usage of `waitFor()` can be chained, for example:
	 *
	 *   FlightPriceStore.dispatchToken =
	 *     flightDispatcher.register(function(payload) {
	 *       switch (payload.actionType) {
	 *         case 'country-update':
	 *         case 'city-update':
	 *           flightDispatcher.waitFor([CityStore.dispatchToken]);
	 *           FlightPriceStore.price =
	 *             getFlightPriceStore(CountryStore.country, CityStore.city);
	 *           break;
	 *     }
	 *   });
	 *
	 * The `country-update` payload will be guaranteed to invoke the stores'
	 * registered callbacks in order: `CountryStore`, `CityStore`, then
	 * `FlightPriceStore`.
	 */

	var Dispatcher = (function () {
	  function Dispatcher() {
	    _classCallCheck(this, Dispatcher);

	    this._callbacks = {};
	    this._isDispatching = false;
	    this._isHandled = {};
	    this._isPending = {};
	    this._lastID = 1;
	  }

	  /**
	   * Registers a callback to be invoked with every dispatched payload. Returns
	   * a token that can be used with `waitFor()`.
	   */

	  Dispatcher.prototype.register = function register(callback) {
	    var id = _prefix + this._lastID++;
	    this._callbacks[id] = callback;
	    return id;
	  };

	  /**
	   * Removes a callback based on its token.
	   */

	  Dispatcher.prototype.unregister = function unregister(id) {
	    !this._callbacks[id] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.unregister(...): `%s` does not map to a registered callback.', id) : invariant(false) : undefined;
	    delete this._callbacks[id];
	  };

	  /**
	   * Waits for the callbacks specified to be invoked before continuing execution
	   * of the current callback. This method should only be used by a callback in
	   * response to a dispatched payload.
	   */

	  Dispatcher.prototype.waitFor = function waitFor(ids) {
	    !this._isDispatching ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.waitFor(...): Must be invoked while dispatching.') : invariant(false) : undefined;
	    for (var ii = 0; ii < ids.length; ii++) {
	      var id = ids[ii];
	      if (this._isPending[id]) {
	        !this._isHandled[id] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.waitFor(...): Circular dependency detected while ' + 'waiting for `%s`.', id) : invariant(false) : undefined;
	        continue;
	      }
	      !this._callbacks[id] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.waitFor(...): `%s` does not map to a registered callback.', id) : invariant(false) : undefined;
	      this._invokeCallback(id);
	    }
	  };

	  /**
	   * Dispatches a payload to all registered callbacks.
	   */

	  Dispatcher.prototype.dispatch = function dispatch(payload) {
	    !!this._isDispatching ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.') : invariant(false) : undefined;
	    this._startDispatching(payload);
	    try {
	      for (var id in this._callbacks) {
	        if (this._isPending[id]) {
	          continue;
	        }
	        this._invokeCallback(id);
	      }
	    } finally {
	      this._stopDispatching();
	    }
	  };

	  /**
	   * Is this Dispatcher currently dispatching.
	   */

	  Dispatcher.prototype.isDispatching = function isDispatching() {
	    return this._isDispatching;
	  };

	  /**
	   * Call the callback stored with the given id. Also do some internal
	   * bookkeeping.
	   *
	   * @internal
	   */

	  Dispatcher.prototype._invokeCallback = function _invokeCallback(id) {
	    this._isPending[id] = true;
	    this._callbacks[id](this._pendingPayload);
	    this._isHandled[id] = true;
	  };

	  /**
	   * Set up bookkeeping needed when dispatching.
	   *
	   * @internal
	   */

	  Dispatcher.prototype._startDispatching = function _startDispatching(payload) {
	    for (var id in this._callbacks) {
	      this._isPending[id] = false;
	      this._isHandled[id] = false;
	    }
	    this._pendingPayload = payload;
	    this._isDispatching = true;
	  };

	  /**
	   * Clear bookkeeping used for dispatching.
	   *
	   * @internal
	   */

	  Dispatcher.prototype._stopDispatching = function _stopDispatching() {
	    delete this._pendingPayload;
	    this._isDispatching = false;
	  };

	  return Dispatcher;
	})();

	module.exports = Dispatcher;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ },
/* 8 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            currentQueue[queueIndex].run();
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	// TODO(shtylman)
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule invariant
	 */

	"use strict";

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var invariant = function (condition, format, a, b, c, d, e, f) {
	  if (process.env.NODE_ENV !== 'production') {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error('Invariant Violation: ' + format.replace(/%s/g, function () {
	        return args[argIndex++];
	      }));
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};

	module.exports = invariant;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var keyMirror = __webpack_require__(11);

	module.exports = keyMirror({
	  USER_JOIN_ROOM: null,
	  USER_LEAVE_ROOM: null,
	  USER_JOIN_ROOM_SUCCESS: null,
	  CREATE_TASK: null,
	  CREATE_TASK_SUCCESS: null,
	  SUBMIT_POLL: null,
	  SUBMIT_POLL_SUCCESS: null,
	  TASK_POLL_FINISH: null,
	  USER_STATUS_UPDATE: null,
	  CLOSING_POLL: null
	});

/***/ },
/* 11 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2014 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 */

	"use strict";

	/**
	 * Constructs an enumeration with keys equal to their value.
	 *
	 * For example:
	 *
	 *   var COLORS = keyMirror({blue: null, red: null});
	 *   var myColor = COLORS.blue;
	 *   var isColorValid = !!COLORS[myColor];
	 *
	 * The last line could not be performed if the values of the generated enum were
	 * not equal to their keys.
	 *
	 *   Input:  {key1: val1, key2: val2}
	 *   Output: {key1: key1, key2: key2}
	 *
	 * @param {object} obj
	 * @return {object}
	 */
	var keyMirror = function(obj) {
	  var ret = {};
	  var key;
	  if (!(obj instanceof Object && !Array.isArray(obj))) {
	    throw new Error('keyMirror(...): Argument must be an object.');
	  }
	  for (key in obj) {
	    if (!obj.hasOwnProperty(key)) {
	      continue;
	    }
	    ret[key] = key;
	  }
	  return ret;
	};

	module.exports = keyMirror;


/***/ },
/* 12 */
/***/ function(module, exports) {

	

	var socket = io.connect();

	module.exports = socket;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOMharmony */var React = __webpack_require__(1);

	var TitleBar = React.createClass({displayName: "TitleBar",
	  render: function() {
	    return React.createElement("h2", null, "Planning Poker Room: ", this.props.name);
	  }
	});

	module.exports = TitleBar;

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = $;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var Hub = __webpack_require__(5)
	var EventEmitter = __webpack_require__(16).EventEmitter;
	var assign = __webpack_require__(17);
	var Const = __webpack_require__(10)


	var CHANGE_EVENT = 'uesr_change';

	var _users = [];


	var UsersStore = assign({}, EventEmitter.prototype, {

		getAllUsers: function(){
			return _users;
		},

		updateUsers: function(users){
			_users = users;
			console.log('UserStore: update users success, emit changes');
			this.emit(CHANGE_EVENT);
		},

		emitChange: function() {
			this.emit(CHANGE_EVENT);
	  },

	  addChangeListener: function(callback) {
	  	console.log('UserStore: add listener:',callback);
	    this.on(CHANGE_EVENT, callback);
	  },

	  removeChangeListener: function(callback) {
	    this.removeListener(CHANGE_EVENT, callback);
	  }

	})

	module.exports = UsersStore;

/***/ },
/* 16 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      }
	      throw TypeError('Uncaught, unspecified "error" event.');
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        len = arguments.length;
	        args = new Array(len - 1);
	        for (i = 1; i < len; i++)
	          args[i - 1] = arguments[i];
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    len = arguments.length;
	    args = new Array(len - 1);
	    for (i = 1; i < len; i++)
	      args[i - 1] = arguments[i];

	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    var m;
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  var ret;
	  if (!emitter._events || !emitter._events[type])
	    ret = 0;
	  else if (isFunction(emitter._events[type]))
	    ret = 1;
	  else
	    ret = emitter._events[type].length;
	  return ret;
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function ownEnumerableKeys(obj) {
		var keys = Object.getOwnPropertyNames(obj);

		if (Object.getOwnPropertySymbols) {
			keys = keys.concat(Object.getOwnPropertySymbols(obj));
		}

		return keys.filter(function (key) {
			return propIsEnumerable.call(obj, key);
		});
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);

		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = ownEnumerableKeys(Object(from));

			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}

		return to;
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var Hub = __webpack_require__(5)
	var EventEmitter = __webpack_require__(16).EventEmitter;
	var assign = __webpack_require__(17);
	var Const = __webpack_require__(10);
	var _ = __webpack_require__(19);


	var CHANGE_EVENT = 'task_change';

	var _tasks = {};

	var TaskStore = assign({}, EventEmitter.prototype, {

		getAllTasks: function(){
			return (_.values(_tasks)).reverse();
		},

		updateTask: function(task, status){
			_tasks[task.tid] = {taskInfo:task, status:status};
			console.log('TaskStore: update tasks success, emit changes');
			this.emitChange();
		},

		emitChange: function() {
			this.emit(CHANGE_EVENT);
	  },

	  addChangeListener: function(callback) {
	  	console.log('TaskStore: add listener:', callback);
	    this.on(CHANGE_EVENT, callback);
	  },

	  removeChangeListener: function(callback) {
	    this.removeListener(CHANGE_EVENT, callback);
	  }

	})

	module.exports = TaskStore;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.8.3
	//     http://underscorejs.org
	//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	//     Underscore may be freely distributed under the MIT license.
	(function(){function n(n){function t(t,r,e,u,i,o){for(;i>=0&&o>i;i+=n){var a=u?u[i]:i;e=r(e,t[a],a,t)}return e}return function(r,e,u,i){e=b(e,i,4);var o=!k(r)&&m.keys(r),a=(o||r).length,c=n>0?0:a-1;return arguments.length<3&&(u=r[o?o[c]:c],c+=n),t(r,e,u,o,c,a)}}function t(n){return function(t,r,e){r=x(r,e);for(var u=O(t),i=n>0?0:u-1;i>=0&&u>i;i+=n)if(r(t[i],i,t))return i;return-1}}function r(n,t,r){return function(e,u,i){var o=0,a=O(e);if("number"==typeof i)n>0?o=i>=0?i:Math.max(i+a,o):a=i>=0?Math.min(i+1,a):i+a+1;else if(r&&i&&a)return i=r(e,u),e[i]===u?i:-1;if(u!==u)return i=t(l.call(e,o,a),m.isNaN),i>=0?i+o:-1;for(i=n>0?o:a-1;i>=0&&a>i;i+=n)if(e[i]===u)return i;return-1}}function e(n,t){var r=I.length,e=n.constructor,u=m.isFunction(e)&&e.prototype||a,i="constructor";for(m.has(n,i)&&!m.contains(t,i)&&t.push(i);r--;)i=I[r],i in n&&n[i]!==u[i]&&!m.contains(t,i)&&t.push(i)}var u=this,i=u._,o=Array.prototype,a=Object.prototype,c=Function.prototype,f=o.push,l=o.slice,s=a.toString,p=a.hasOwnProperty,h=Array.isArray,v=Object.keys,g=c.bind,y=Object.create,d=function(){},m=function(n){return n instanceof m?n:this instanceof m?void(this._wrapped=n):new m(n)}; true?("undefined"!=typeof module&&module.exports&&(exports=module.exports=m),exports._=m):u._=m,m.VERSION="1.8.3";var b=function(n,t,r){if(t===void 0)return n;switch(null==r?3:r){case 1:return function(r){return n.call(t,r)};case 2:return function(r,e){return n.call(t,r,e)};case 3:return function(r,e,u){return n.call(t,r,e,u)};case 4:return function(r,e,u,i){return n.call(t,r,e,u,i)}}return function(){return n.apply(t,arguments)}},x=function(n,t,r){return null==n?m.identity:m.isFunction(n)?b(n,t,r):m.isObject(n)?m.matcher(n):m.property(n)};m.iteratee=function(n,t){return x(n,t,1/0)};var _=function(n,t){return function(r){var e=arguments.length;if(2>e||null==r)return r;for(var u=1;e>u;u++)for(var i=arguments[u],o=n(i),a=o.length,c=0;a>c;c++){var f=o[c];t&&r[f]!==void 0||(r[f]=i[f])}return r}},j=function(n){if(!m.isObject(n))return{};if(y)return y(n);d.prototype=n;var t=new d;return d.prototype=null,t},w=function(n){return function(t){return null==t?void 0:t[n]}},A=Math.pow(2,53)-1,O=w("length"),k=function(n){var t=O(n);return"number"==typeof t&&t>=0&&A>=t};m.each=m.forEach=function(n,t,r){t=b(t,r);var e,u;if(k(n))for(e=0,u=n.length;u>e;e++)t(n[e],e,n);else{var i=m.keys(n);for(e=0,u=i.length;u>e;e++)t(n[i[e]],i[e],n)}return n},m.map=m.collect=function(n,t,r){t=x(t,r);for(var e=!k(n)&&m.keys(n),u=(e||n).length,i=Array(u),o=0;u>o;o++){var a=e?e[o]:o;i[o]=t(n[a],a,n)}return i},m.reduce=m.foldl=m.inject=n(1),m.reduceRight=m.foldr=n(-1),m.find=m.detect=function(n,t,r){var e;return e=k(n)?m.findIndex(n,t,r):m.findKey(n,t,r),e!==void 0&&e!==-1?n[e]:void 0},m.filter=m.select=function(n,t,r){var e=[];return t=x(t,r),m.each(n,function(n,r,u){t(n,r,u)&&e.push(n)}),e},m.reject=function(n,t,r){return m.filter(n,m.negate(x(t)),r)},m.every=m.all=function(n,t,r){t=x(t,r);for(var e=!k(n)&&m.keys(n),u=(e||n).length,i=0;u>i;i++){var o=e?e[i]:i;if(!t(n[o],o,n))return!1}return!0},m.some=m.any=function(n,t,r){t=x(t,r);for(var e=!k(n)&&m.keys(n),u=(e||n).length,i=0;u>i;i++){var o=e?e[i]:i;if(t(n[o],o,n))return!0}return!1},m.contains=m.includes=m.include=function(n,t,r,e){return k(n)||(n=m.values(n)),("number"!=typeof r||e)&&(r=0),m.indexOf(n,t,r)>=0},m.invoke=function(n,t){var r=l.call(arguments,2),e=m.isFunction(t);return m.map(n,function(n){var u=e?t:n[t];return null==u?u:u.apply(n,r)})},m.pluck=function(n,t){return m.map(n,m.property(t))},m.where=function(n,t){return m.filter(n,m.matcher(t))},m.findWhere=function(n,t){return m.find(n,m.matcher(t))},m.max=function(n,t,r){var e,u,i=-1/0,o=-1/0;if(null==t&&null!=n){n=k(n)?n:m.values(n);for(var a=0,c=n.length;c>a;a++)e=n[a],e>i&&(i=e)}else t=x(t,r),m.each(n,function(n,r,e){u=t(n,r,e),(u>o||u===-1/0&&i===-1/0)&&(i=n,o=u)});return i},m.min=function(n,t,r){var e,u,i=1/0,o=1/0;if(null==t&&null!=n){n=k(n)?n:m.values(n);for(var a=0,c=n.length;c>a;a++)e=n[a],i>e&&(i=e)}else t=x(t,r),m.each(n,function(n,r,e){u=t(n,r,e),(o>u||1/0===u&&1/0===i)&&(i=n,o=u)});return i},m.shuffle=function(n){for(var t,r=k(n)?n:m.values(n),e=r.length,u=Array(e),i=0;e>i;i++)t=m.random(0,i),t!==i&&(u[i]=u[t]),u[t]=r[i];return u},m.sample=function(n,t,r){return null==t||r?(k(n)||(n=m.values(n)),n[m.random(n.length-1)]):m.shuffle(n).slice(0,Math.max(0,t))},m.sortBy=function(n,t,r){return t=x(t,r),m.pluck(m.map(n,function(n,r,e){return{value:n,index:r,criteria:t(n,r,e)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index-t.index}),"value")};var F=function(n){return function(t,r,e){var u={};return r=x(r,e),m.each(t,function(e,i){var o=r(e,i,t);n(u,e,o)}),u}};m.groupBy=F(function(n,t,r){m.has(n,r)?n[r].push(t):n[r]=[t]}),m.indexBy=F(function(n,t,r){n[r]=t}),m.countBy=F(function(n,t,r){m.has(n,r)?n[r]++:n[r]=1}),m.toArray=function(n){return n?m.isArray(n)?l.call(n):k(n)?m.map(n,m.identity):m.values(n):[]},m.size=function(n){return null==n?0:k(n)?n.length:m.keys(n).length},m.partition=function(n,t,r){t=x(t,r);var e=[],u=[];return m.each(n,function(n,r,i){(t(n,r,i)?e:u).push(n)}),[e,u]},m.first=m.head=m.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:m.initial(n,n.length-t)},m.initial=function(n,t,r){return l.call(n,0,Math.max(0,n.length-(null==t||r?1:t)))},m.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:m.rest(n,Math.max(0,n.length-t))},m.rest=m.tail=m.drop=function(n,t,r){return l.call(n,null==t||r?1:t)},m.compact=function(n){return m.filter(n,m.identity)};var S=function(n,t,r,e){for(var u=[],i=0,o=e||0,a=O(n);a>o;o++){var c=n[o];if(k(c)&&(m.isArray(c)||m.isArguments(c))){t||(c=S(c,t,r));var f=0,l=c.length;for(u.length+=l;l>f;)u[i++]=c[f++]}else r||(u[i++]=c)}return u};m.flatten=function(n,t){return S(n,t,!1)},m.without=function(n){return m.difference(n,l.call(arguments,1))},m.uniq=m.unique=function(n,t,r,e){m.isBoolean(t)||(e=r,r=t,t=!1),null!=r&&(r=x(r,e));for(var u=[],i=[],o=0,a=O(n);a>o;o++){var c=n[o],f=r?r(c,o,n):c;t?(o&&i===f||u.push(c),i=f):r?m.contains(i,f)||(i.push(f),u.push(c)):m.contains(u,c)||u.push(c)}return u},m.union=function(){return m.uniq(S(arguments,!0,!0))},m.intersection=function(n){for(var t=[],r=arguments.length,e=0,u=O(n);u>e;e++){var i=n[e];if(!m.contains(t,i)){for(var o=1;r>o&&m.contains(arguments[o],i);o++);o===r&&t.push(i)}}return t},m.difference=function(n){var t=S(arguments,!0,!0,1);return m.filter(n,function(n){return!m.contains(t,n)})},m.zip=function(){return m.unzip(arguments)},m.unzip=function(n){for(var t=n&&m.max(n,O).length||0,r=Array(t),e=0;t>e;e++)r[e]=m.pluck(n,e);return r},m.object=function(n,t){for(var r={},e=0,u=O(n);u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},m.findIndex=t(1),m.findLastIndex=t(-1),m.sortedIndex=function(n,t,r,e){r=x(r,e,1);for(var u=r(t),i=0,o=O(n);o>i;){var a=Math.floor((i+o)/2);r(n[a])<u?i=a+1:o=a}return i},m.indexOf=r(1,m.findIndex,m.sortedIndex),m.lastIndexOf=r(-1,m.findLastIndex),m.range=function(n,t,r){null==t&&(t=n||0,n=0),r=r||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=Array(e),i=0;e>i;i++,n+=r)u[i]=n;return u};var E=function(n,t,r,e,u){if(!(e instanceof t))return n.apply(r,u);var i=j(n.prototype),o=n.apply(i,u);return m.isObject(o)?o:i};m.bind=function(n,t){if(g&&n.bind===g)return g.apply(n,l.call(arguments,1));if(!m.isFunction(n))throw new TypeError("Bind must be called on a function");var r=l.call(arguments,2),e=function(){return E(n,e,t,this,r.concat(l.call(arguments)))};return e},m.partial=function(n){var t=l.call(arguments,1),r=function(){for(var e=0,u=t.length,i=Array(u),o=0;u>o;o++)i[o]=t[o]===m?arguments[e++]:t[o];for(;e<arguments.length;)i.push(arguments[e++]);return E(n,r,this,this,i)};return r},m.bindAll=function(n){var t,r,e=arguments.length;if(1>=e)throw new Error("bindAll must be passed function names");for(t=1;e>t;t++)r=arguments[t],n[r]=m.bind(n[r],n);return n},m.memoize=function(n,t){var r=function(e){var u=r.cache,i=""+(t?t.apply(this,arguments):e);return m.has(u,i)||(u[i]=n.apply(this,arguments)),u[i]};return r.cache={},r},m.delay=function(n,t){var r=l.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},m.defer=m.partial(m.delay,m,1),m.throttle=function(n,t,r){var e,u,i,o=null,a=0;r||(r={});var c=function(){a=r.leading===!1?0:m.now(),o=null,i=n.apply(e,u),o||(e=u=null)};return function(){var f=m.now();a||r.leading!==!1||(a=f);var l=t-(f-a);return e=this,u=arguments,0>=l||l>t?(o&&(clearTimeout(o),o=null),a=f,i=n.apply(e,u),o||(e=u=null)):o||r.trailing===!1||(o=setTimeout(c,l)),i}},m.debounce=function(n,t,r){var e,u,i,o,a,c=function(){var f=m.now()-o;t>f&&f>=0?e=setTimeout(c,t-f):(e=null,r||(a=n.apply(i,u),e||(i=u=null)))};return function(){i=this,u=arguments,o=m.now();var f=r&&!e;return e||(e=setTimeout(c,t)),f&&(a=n.apply(i,u),i=u=null),a}},m.wrap=function(n,t){return m.partial(t,n)},m.negate=function(n){return function(){return!n.apply(this,arguments)}},m.compose=function(){var n=arguments,t=n.length-1;return function(){for(var r=t,e=n[t].apply(this,arguments);r--;)e=n[r].call(this,e);return e}},m.after=function(n,t){return function(){return--n<1?t.apply(this,arguments):void 0}},m.before=function(n,t){var r;return function(){return--n>0&&(r=t.apply(this,arguments)),1>=n&&(t=null),r}},m.once=m.partial(m.before,2);var M=!{toString:null}.propertyIsEnumerable("toString"),I=["valueOf","isPrototypeOf","toString","propertyIsEnumerable","hasOwnProperty","toLocaleString"];m.keys=function(n){if(!m.isObject(n))return[];if(v)return v(n);var t=[];for(var r in n)m.has(n,r)&&t.push(r);return M&&e(n,t),t},m.allKeys=function(n){if(!m.isObject(n))return[];var t=[];for(var r in n)t.push(r);return M&&e(n,t),t},m.values=function(n){for(var t=m.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=n[t[u]];return e},m.mapObject=function(n,t,r){t=x(t,r);for(var e,u=m.keys(n),i=u.length,o={},a=0;i>a;a++)e=u[a],o[e]=t(n[e],e,n);return o},m.pairs=function(n){for(var t=m.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=[t[u],n[t[u]]];return e},m.invert=function(n){for(var t={},r=m.keys(n),e=0,u=r.length;u>e;e++)t[n[r[e]]]=r[e];return t},m.functions=m.methods=function(n){var t=[];for(var r in n)m.isFunction(n[r])&&t.push(r);return t.sort()},m.extend=_(m.allKeys),m.extendOwn=m.assign=_(m.keys),m.findKey=function(n,t,r){t=x(t,r);for(var e,u=m.keys(n),i=0,o=u.length;o>i;i++)if(e=u[i],t(n[e],e,n))return e},m.pick=function(n,t,r){var e,u,i={},o=n;if(null==o)return i;m.isFunction(t)?(u=m.allKeys(o),e=b(t,r)):(u=S(arguments,!1,!1,1),e=function(n,t,r){return t in r},o=Object(o));for(var a=0,c=u.length;c>a;a++){var f=u[a],l=o[f];e(l,f,o)&&(i[f]=l)}return i},m.omit=function(n,t,r){if(m.isFunction(t))t=m.negate(t);else{var e=m.map(S(arguments,!1,!1,1),String);t=function(n,t){return!m.contains(e,t)}}return m.pick(n,t,r)},m.defaults=_(m.allKeys,!0),m.create=function(n,t){var r=j(n);return t&&m.extendOwn(r,t),r},m.clone=function(n){return m.isObject(n)?m.isArray(n)?n.slice():m.extend({},n):n},m.tap=function(n,t){return t(n),n},m.isMatch=function(n,t){var r=m.keys(t),e=r.length;if(null==n)return!e;for(var u=Object(n),i=0;e>i;i++){var o=r[i];if(t[o]!==u[o]||!(o in u))return!1}return!0};var N=function(n,t,r,e){if(n===t)return 0!==n||1/n===1/t;if(null==n||null==t)return n===t;n instanceof m&&(n=n._wrapped),t instanceof m&&(t=t._wrapped);var u=s.call(n);if(u!==s.call(t))return!1;switch(u){case"[object RegExp]":case"[object String]":return""+n==""+t;case"[object Number]":return+n!==+n?+t!==+t:0===+n?1/+n===1/t:+n===+t;case"[object Date]":case"[object Boolean]":return+n===+t}var i="[object Array]"===u;if(!i){if("object"!=typeof n||"object"!=typeof t)return!1;var o=n.constructor,a=t.constructor;if(o!==a&&!(m.isFunction(o)&&o instanceof o&&m.isFunction(a)&&a instanceof a)&&"constructor"in n&&"constructor"in t)return!1}r=r||[],e=e||[];for(var c=r.length;c--;)if(r[c]===n)return e[c]===t;if(r.push(n),e.push(t),i){if(c=n.length,c!==t.length)return!1;for(;c--;)if(!N(n[c],t[c],r,e))return!1}else{var f,l=m.keys(n);if(c=l.length,m.keys(t).length!==c)return!1;for(;c--;)if(f=l[c],!m.has(t,f)||!N(n[f],t[f],r,e))return!1}return r.pop(),e.pop(),!0};m.isEqual=function(n,t){return N(n,t)},m.isEmpty=function(n){return null==n?!0:k(n)&&(m.isArray(n)||m.isString(n)||m.isArguments(n))?0===n.length:0===m.keys(n).length},m.isElement=function(n){return!(!n||1!==n.nodeType)},m.isArray=h||function(n){return"[object Array]"===s.call(n)},m.isObject=function(n){var t=typeof n;return"function"===t||"object"===t&&!!n},m.each(["Arguments","Function","String","Number","Date","RegExp","Error"],function(n){m["is"+n]=function(t){return s.call(t)==="[object "+n+"]"}}),m.isArguments(arguments)||(m.isArguments=function(n){return m.has(n,"callee")}),"function"!=typeof/./&&"object"!=typeof Int8Array&&(m.isFunction=function(n){return"function"==typeof n||!1}),m.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},m.isNaN=function(n){return m.isNumber(n)&&n!==+n},m.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"===s.call(n)},m.isNull=function(n){return null===n},m.isUndefined=function(n){return n===void 0},m.has=function(n,t){return null!=n&&p.call(n,t)},m.noConflict=function(){return u._=i,this},m.identity=function(n){return n},m.constant=function(n){return function(){return n}},m.noop=function(){},m.property=w,m.propertyOf=function(n){return null==n?function(){}:function(t){return n[t]}},m.matcher=m.matches=function(n){return n=m.extendOwn({},n),function(t){return m.isMatch(t,n)}},m.times=function(n,t,r){var e=Array(Math.max(0,n));t=b(t,r,1);for(var u=0;n>u;u++)e[u]=t(u);return e},m.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))},m.now=Date.now||function(){return(new Date).getTime()};var B={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},T=m.invert(B),R=function(n){var t=function(t){return n[t]},r="(?:"+m.keys(n).join("|")+")",e=RegExp(r),u=RegExp(r,"g");return function(n){return n=null==n?"":""+n,e.test(n)?n.replace(u,t):n}};m.escape=R(B),m.unescape=R(T),m.result=function(n,t,r){var e=null==n?void 0:n[t];return e===void 0&&(e=r),m.isFunction(e)?e.call(n):e};var q=0;m.uniqueId=function(n){var t=++q+"";return n?n+t:t},m.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var K=/(.)^/,z={"'":"'","\\":"\\","\r":"r","\n":"n","\u2028":"u2028","\u2029":"u2029"},D=/\\|'|\r|\n|\u2028|\u2029/g,L=function(n){return"\\"+z[n]};m.template=function(n,t,r){!t&&r&&(t=r),t=m.defaults({},t,m.templateSettings);var e=RegExp([(t.escape||K).source,(t.interpolate||K).source,(t.evaluate||K).source].join("|")+"|$","g"),u=0,i="__p+='";n.replace(e,function(t,r,e,o,a){return i+=n.slice(u,a).replace(D,L),u=a+t.length,r?i+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'":e?i+="'+\n((__t=("+e+"))==null?'':__t)+\n'":o&&(i+="';\n"+o+"\n__p+='"),t}),i+="';\n",t.variable||(i="with(obj||{}){\n"+i+"}\n"),i="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+i+"return __p;\n";try{var o=new Function(t.variable||"obj","_",i)}catch(a){throw a.source=i,a}var c=function(n){return o.call(this,n,m)},f=t.variable||"obj";return c.source="function("+f+"){\n"+i+"}",c},m.chain=function(n){var t=m(n);return t._chain=!0,t};var P=function(n,t){return n._chain?m(t).chain():t};m.mixin=function(n){m.each(m.functions(n),function(t){var r=m[t]=n[t];m.prototype[t]=function(){var n=[this._wrapped];return f.apply(n,arguments),P(this,r.apply(m,n))}})},m.mixin(m),m.each(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=o[n];m.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!==n&&"splice"!==n||0!==r.length||delete r[0],P(this,r)}}),m.each(["concat","join","slice"],function(n){var t=o[n];m.prototype[n]=function(){return P(this,t.apply(this._wrapped,arguments))}}),m.prototype.value=function(){return this._wrapped},m.prototype.valueOf=m.prototype.toJSON=m.prototype.value,m.prototype.toString=function(){return""+this._wrapped},"function"=="function"&&__webpack_require__(20)&&!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function(){return m}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))}).call(this);
	//# sourceMappingURL=underscore-min.map

/***/ },
/* 20 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;

	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOMharmony */var React = __webpack_require__(1);
	var UserStore = __webpack_require__(15)
	var Actions = __webpack_require__(4);


	function getAllUsers() {
	  return {
	    users: UserStore.getAllUsers()
	  };
	}

	var UsersList = React.createClass({displayName: "UsersList",
		getInitialState: function() {
			return getAllUsers();
		},

		componentDidMount: function() {
	    UserStore.addChangeListener(this._onChange);
	  },

	  componentWillUnmount: function() {
	    UserStore.removeChangeListener(this._onChange);
	  },

	  _onChange: function() {
	  	this.setState(getAllUsers());
	    console.log("userslist: fire state change", this.state.users);
	  }, 

	  render: function(){
	  	var lists = [];
	  	var users = this.state.users||[];
	  	for (var i=0; i<users.length; i++){
	      var highlight = (users[i].isAdmin||users[i].poll) ? "fa fa-check-circle green-color":"fa fa-check-circle hidden"
	  		lists.push(React.createElement("li", {key: users[i].uid}, React.createElement("i", {className: users[i].isAdmin ? 'fa fa-user green-color':'fa fa-user grey-color'}), "  ", users[i].uname, "  ", React.createElement("i", {className: highlight})))
	  	}

	  	return React.createElement("div", null, 
		  	React.createElement("div", {className: "row border-bottom-left"}, 
		      React.createElement("h6", null, "Online users: (", this.state.users.length, ")")
		    ), 
		    React.createElement("div", {className: "user-list-padding"}, 
		      React.createElement("ul", {className: "list-unstyled"}, 
		      	lists
		      )
		    )
	    )
	  }
	})

	module.exports = UsersList;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOMharmony */var React = __webpack_require__(1);

	var TaskBtn = React.createClass({displayName: "TaskBtn",

		handleClick:function(){
			console.log(this.props.onclick);
			this.props.onclick();
			console.log('TaskBtn clicked');
		},
		render: function() {

			return React.createElement("button", {type: "button", className: "btn btn-primary btn-sm", onClick: this.handleClick}, "New Task")		

		}
	})

	module.exports = TaskBtn;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOMharmony */var React = __webpack_require__(1);
	var SubmitBtn = __webpack_require__(3)
	var Actions = __webpack_require__(4);
	var Hub = __webpack_require__(5);
	var Const = __webpack_require__(10);

	var TaskModal = React.createClass({displayName: "TaskModal",
		getInitialState: function() {
			return {enable: false, status: 0, taskName:'', };
		},

		handleSubmit: function(){
			var desc = React.findDOMNode(this.refs.desc).value.trim();
			this.setState({enable: false, status: 1});
			console.log('fire task create action');
			Actions.createTask(this.state.taskName, desc);
		},

		handleTaskName: function(e){
			console.log(e.target.value);
			if (e.target.value.trim().length >= 3 && e.target.value.trim().length<=16){
				this.setState({enable: true, taskName: e.target.value.trim()});
			}else{
				this.setState({enable: false, taskName: e.target.value.trim()});
			}
		},

		componentDidMount: function() {
			var _self = this;
	  	Hub.register(function(action) {
	  		if (action.actionType == Const.CREATE_TASK_SUCCESS){
	  			_self.setState({enable: false, status: 0});
	  			React.findDOMNode(_self.refs.title).value="";
	  			React.findDOMNode(_self.refs.desc).value="";
			  	console.log('change submitbtn status to 0 after create task success');
			  }
	  	})
		},


		render: function(){

			var disabled = this.state.status==1 ? 'disabled':'';
			console.log('re-render task modal with ', this.state.status, this.state.enable);

			return React.createElement("div", {className: "modal fade", id: "newTaskInputModal", tabindex: "-1", role: "dialog", "aria-labelledby": "newTaskInputModalLabel"}, 
	    	React.createElement("div", {className: "modal-dialog", role: "document"}, 
	        React.createElement("div", {className: "modal-content"}, 

	          React.createElement("div", {className: "modal-header"}, 
	            React.createElement("h4", {className: "modal-title", id: "newTaskInputModalLabel"}, "Please input task info")
	          ), 
	          React.createElement("div", {className: "modal-body"}, 
	              React.createElement("div", {className: "form-group"}, 
	                React.createElement("label", {for: "task-name", className: "control-label"}, "Task name:"), 
	                React.createElement("input", {type: "text", ref: "title", className: "form-control", disabled: disabled, onChange: this.handleTaskName})
	              ), 
	              React.createElement("div", {className: "form-group"}, 
	                React.createElement("label", {for: "task-desc", className: "control-label"}, "Task detail:"), 
	                React.createElement("textarea", {ref: "desc", className: "form-control", disabled: disabled})
	              )
	          ), 
	          React.createElement("div", {className: "modal-footer"}, 
	            React.createElement(SubmitBtn, {enable: this.state.enable, onClick: this.handleSubmit, status: this.state.status})
	          )
	        )
	    	)
		  )
		}
	})

	module.exports = TaskModal;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOMharmony */var React = __webpack_require__(1);
	var TaskStore = __webpack_require__(18)
	var Actions = __webpack_require__(4);
	var Task = __webpack_require__(25);

	function getAllTasks() {
	  return {tasks: TaskStore.getAllTasks()};
	}

	var TasksList = React.createClass({displayName: "TasksList",
		getInitialState: function() {
			return getAllTasks();
		},

		componentDidMount: function() {
	    TaskStore.addChangeListener(this._onChange);
	  },

	  componentWillUnmount: function() {
	    TaskStore.removeChangeListener(this._onChange);
	  },

	  _onChange: function() {
	  	console.log("TasksList: fire state change");
	    this.setState(getAllTasks());
	  }, 

	  render: function(){
	  	var lists = [];
	  	var tasks = this.state.tasks||[];
	  	for (var i=0; i< tasks.length; i++){
	  		console.log("setup task:", tasks[i]);
	  		lists.push(React.createElement(Task, {key: tasks[i].taskInfo.tid, task: tasks[i].taskInfo, status: tasks[i].status}))
	  	}

	  	return React.createElement("div", {className: "row"}, lists)
	  }
	})

	module.exports = TasksList;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOMharmony */var React = __webpack_require__(1);
	var TaskStore = __webpack_require__(18)
	var Actions = __webpack_require__(4);
	var SimpleBtn = __webpack_require__(26)
	var SubmitBtn = __webpack_require__(3)
	var Hub = __webpack_require__(5);
	var Const = __webpack_require__(10);

	var Points = [1,2,3,5,8,13,20,40,100];

	var Task = React.createClass({displayName: "Task",
		getInitialState: function() {
			return {curPoint:null, submitStatus:0};
		},

		_handlePointBtnClick: function(val){
			console.log("point changed: ", val);
			if (val>0){
				this.setState({curPoint: parseInt(val)});
			}
		},

		_handleSubmitPoint: function(){
			console.log("submitting point: %s with taskId: %s", this.state.curPoint, this.props.task.tid);
			this.setState({submitStatus:1})
			Actions.submitPoll(this.props.task.tid, this.state.curPoint);
		},

		componentDidMount: function() {
			var _self = this;
	  	Hub.register(function(action) {
	  		if (action.actionType == Const.SUBMIT_POLL_SUCCESS){
	  			_self.setState({curPoint:_self.state.curPoint, submitStatus: 2});
			  	console.log('change SubmitBtn status to 2 after SUBMIT_POLL_SUCCESS');
			  }
	  	})
		},

		_handleClosePoll: function(){
			console.log("closing poll: ", this.props.task.tid);
			this.setState({submitStatus:1})
			Actions.closePoll(this.props.task.tid);
		},

		render: function(){
			var curPoint = parseInt(this.state.curPoint);
			var task = this.props.task;
			var status = this.props.status;
			var bottomArea;

			if (status==0){
				bottomArea = React.createElement("div", {className: "bottom-box"}, React.createElement("p", null, React.createElement(SimpleBtn, {className: "btn btn-warning btn-lg", onClick: this._handleClosePoll, enable: true, label: "Close Poll"})))
			}

			if (status==1){
				var bottomBtns = [];

				for (var i=0; i<Points.length;i++){
					var point = Points[i];
					var highlightBtn = !(curPoint == point);
					bottomBtns.push(React.createElement(SimpleBtn, {key: point, returnVal: point, className:  highlightBtn ? 'btn btn-default btn-lg':'btn btn-info btn-lg', label: point, onClick: this._handlePointBtnClick, enable: true}));	
				}
				bottomBtns.push(React.createElement(SubmitBtn, {className: "btn btn-primary btn-lg", onClick: this._handleSubmitPoint, enable: curPoint ? true:false, status: this.state.submitStatus}))

				bottomArea = React.createElement("div", {className: "bottom-box"}, React.createElement("p", null, bottomBtns))
			}

			if (status==2){
				var bottomBtns = [];

				for (var i=0; i<Points.length;i++){
					var point = Points[i];
					var highlightBtn = !(curPoint == point);
					bottomBtns.push(React.createElement(SimpleBtn, {key: point, returnVal: point, className:  highlightBtn ? 'btn btn-default btn-lg':'btn btn-info btn-lg', label: point, onClick: this._handlePointBtnClick, enable: false}));	
				}
				bottomBtns.push(React.createElement(SubmitBtn, {className: "btn btn-primary btn-lg", onClick: this._handleSubmitPoint, enable:  false, status: this.state.submitStatus}))

				bottomArea = React.createElement("div", {className: "bottom-box"}, React.createElement("p", null, bottomBtns), React.createElement("p", null, React.createElement("code", null, "Please wait for others submitting their points...")))
			}

			if (status==3){
				var users = [];
				var votes = this.props.task.votes;
				var totalPoints = 0;
				for (var i=0; i<votes.length;i++){
					var vote = votes[i];
					users.push(React.createElement("li", {key: vote.uid}, React.createElement("i", {className: "fa fa-user gray-color"}), React.createElement("samp", null, vote.uname, React.createElement("kbd", null, vote.point))));
					totalPoints += vote.point;
				}

				bottomArea = React.createElement("div", {className: "bottom-box"}, React.createElement("ul", {className: "list-inline"}, users), React.createElement("p", null, React.createElement("code", null, "  Avg Point: ", parseInt(totalPoints/votes.length), "  ")))

			}

			return React.createElement("div", {className: "box-row"}, 
	            React.createElement("div", {className: "upper-box"}, 
	              React.createElement("h4", null, task.name), 
	              React.createElement("p", null, task.desc)
	            ), 

	            bottomArea

	         	)

		}
	})

	module.exports = Task;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOMharmony */var React = __webpack_require__(1);


	var SimpleBtn = React.createClass({displayName: "SimpleBtn",

		_handleClick: function(){
			if (this.props.returnVal){
				this.props.onClick(this.props.returnVal)			
			}else{
				this.props.onClick();
			}
			
		},

		render: function(){
			return React.createElement("button", {className: this.props.className, disabled: this.props.enable? '':'disabled', onClick: this._handleClick}, this.props.label)
		}

	});

	module.exports = SimpleBtn;



/***/ }
/******/ ]);
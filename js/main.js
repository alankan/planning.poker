var React = require('react');
var UsernameModal = require('./viewmodels/UsernameModal.jsx');
var TitleBar = require('./viewmodels/TitleBar.jsx')
var $ = require('jquery')
var Hub = require('./dispatcher')
var Const = require('./constant')
var Actions = require('./actions')
var Socket = require('./sockets')
var UserStore = require('./user_store');
var TaskStore = require('./task_store')
var UsersList = require('./viewmodels/UsersList.jsx');
var TaskBtn = require('./viewmodels/TaskBtn.jsx')
var TaskModal = require('./viewmodels/TaskModal.jsx');
var TasksList = require('./viewmodels/TasksList.jsx');


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
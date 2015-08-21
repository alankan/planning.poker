var Hub = require('./dispatcher');
var Const = require('./constant')

var socket = require('./sockets')


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
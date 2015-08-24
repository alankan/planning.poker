var Hub = require('./dispatcher')
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Const = require('./constant');
var _ = require('./underscore-min');


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
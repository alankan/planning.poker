var Hub = require('./dispatcher')
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Const = require('./constant')


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
var koa = require('koa.io');
var staticCache = require('koa-static-cache');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');

var session = require('koa-session')

var app = koa();


app.keys = ['app-session-key']
app.use(session(app));


var port = process.env.PORT || 3000;

app.use(staticCache(path.join(__dirname, 'public'),{
	dynamic: true
}));

var rooms = {};
var users = {};
var tasks = {}
var numUsers = 0;


var decode = function decode(string) {
  var body = new Buffer(string, 'base64').toString('utf8');
  var json = JSON.parse(body);
  return json;
}

app.use(function*(next) {

	console.log('entry path:', this.path)

	if (this.url == '/room/create'){
		roomId = Math.floor((Math.random() * 1000) + 1);
		rooms[roomId] = {users:[],tasks:[]}
		console.log(rooms)
		this.session.roomId = roomId;
		this.session.isAdmin = true;
		if (!this.session.uid){
			this.session.uid = Math.floor(new Date().getTime()/100);
		}

		this.redirect('/room/'+roomId)
		return next;
	}


	console.log("decoder:", app.decode);

	var roomId;
	var results = this.path.match('\/room\/([0-9]*)')
	if (results && results[1]){
		roomId = results[1];
		console.log("room num:", roomId);
		this.session.roomId = roomId;
		if (!this.session.uid){
			this.session.uid = Math.floor(new Date().getTime()/100);
		}
		this.body = fs.createReadStream(path.join(__dirname, 'public/index.html'));
  	this.type = 'html';
  	return next;
	}
	
	this.body = "Please enter correct room id";
	this.type = 'text';
	return next;
});

app.listen(port, function () {
  console.log('Server listening at port %d', port);
});

var getSessionId = function(cookieString, cookieName) {
  var matches = new RegExp('koa:sess=([^;]+);', 'gmi').exec(cookieString);
  return matches[1] ? matches[1] : null;
}

// middleware for connect and disconnect
app.io.use(function* userLeft(next) {
  // on connect
  console.log('connection received!');
  // var sessionId = getSessionId(this.headers.cookie)
  // console.log("sessionId:", sessionId);

  // var sess = decode(sessionId);
  // if (sess.uid) this.uid = sess.uid;

  yield* next;
  // on disconnect

  console.log('user %s [%s] disconnected from room: %s', this.uname, this.uid, this.roomId);

  var roomId = this.roomId;
  var uid = this.uid;

  if (roomId && rooms[roomId]) {


  	var onGoingTasks = _.filter(tasks[roomId], function(task){return !task.finished})

  	for (task of onGoingTasks){
  		task.votes = _.reject(task.votes, {uid:uid});
  		var totalPolled = _.filter(task.votes, function(vote){return vote.point != 0});
  		if (totalPolled && totalPolled.length == task.votes.length){
				notifyTaskClosed(this, task, roomId);
				console.log('after uesr drop', task);
			}
  	}

  	room = rooms[roomId];
  	room.users = _.reject(room.users, {uid:uid});
  	console.log(room);
  	notifyUserChanges(this, roomId);
  }
});


app.io.route('subscribe', function*(next, roomId, userName) {

	console.log('subscribe received');

	room = rooms[roomId];
	// var uid = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
	


	console.log('user: '+userName+'tries join room: '+roomId);

	if (room){
		console.log('room exists')

		var uid = Math.floor(new Date().getTime()/100);

		user = {uname: userName, uid: uid, poll:false};
		if (!room['admin']){
			this.roomAdmin = true
			user.isAdmin = true;
			room['admin'] = user;
		}
		room['users'].push(user);

		this.uname = userName;
		this.roomId = roomId;
		this.uid = uid;

		this.socket.room = 'room_'+roomId;
		this.socket.join('room_'+roomId);

		this.socket.emit('room changed', {users:room['users'], isAdmin:this.roomAdmin});
		console.log('response subscribe with room changed event-->');

		this.broadcast.to('room_'+roomId).emit('user joined', {users:room['users']});
		console.log('<--broadcast user_join_success to others-->');

		console.log(rooms)

	}else{
		console.log('room not exists');
	}
});

app.io.route('createTask', function*(next, taskName, desc){

	console.log('receive createTask: %s,%s with roomId: %s', taskName, desc, this.roomId);
	var tid = Math.floor(new Date().getTime()/1000);
	var roomId = this.roomId;
	if (!tasks[roomId]) tasks[roomId] = [];
	var room = rooms[roomId];
	votes = [];
	for (var i=0; i<room.users.length;i++){
		if (this.uid != room.users[i].uid){
			votes.push({uid: room.users[i].uid, uname: room.users[i].uname, point:0});
			room.users[i].poll = false;
		}
	}

	// this.socket.emit('user status update', {users:room['users']});
	// this.broadcast.to('room_'+roomId).emit('user status update', {users:room['users']});
	// console.log('<--broadcast user status update to all-->');
	notifyUserChanges(this, roomId);

	var curTask = {tid:tid, name:taskName, desc:desc, votes:votes, finished:false};
	tasks[roomId].push(curTask);
	this.socket.emit('task created', {taskInfo:curTask, status:0});
	console.log('response create task with task created event-->');
	this.broadcast.to('room_'+roomId).emit('task created', {taskInfo:curTask, status:1});
	console.log('<--broadcast user_join_success to others-->');
})

app.io.route('submitPoll', function *(next, tid, point){
	console.log('receive submitPoll: %s, from %s with roomId: %s', point, this.uid, this.roomId);
	var roomId = this.roomId;
	var room = rooms[roomId];

	var curTask = _.find(tasks[roomId], function(task){ return task.tid == tid });
	console.log('curTask', curTask);
	var uid = this.uid;
	var vote = _.find(curTask.votes, function(vote){ return vote.uid == uid});
	console.log('vote', vote);
	vote.point = point;

	var curUser = _.find(room['users'], function(user){ return user.uid == uid });
	curUser.poll = true;

	console.log('after update votes', curTask.votes);

	// this.socket.emit('user status update', {users:room['users']});
	// this.broadcast.to('room_'+roomId).emit('user status update', {users:room['users']});
	// console.log('<--broadcast user status update to all-->');

	notifyUserChanges(this, roomId);

	var totalPolled = _.filter(curTask.votes, function(vote){return vote.point != 0});

	if (totalPolled && totalPolled.length == curTask.votes.length){
		notifyTaskClosed(this, curTask, roomId);
	}else{
		this.socket.emit('task update', {taskInfo:curTask, status:2});
		console.log('response submitPoll with task update event-->');
	}
	
})


app.io.route('closingPoll', function *(next, tid){
	console.log('receive closingPoll: %s with roomId: %s', tid, this.roomId);
	var roomId = this.roomId;
	var room = rooms[roomId];
	for (var i=0; i<room.users.length;i++){
		room.users[i].poll = false;
	}

	// this.socket.emit('user status update', {users:room['users']});
	// this.broadcast.to('room_'+roomId).emit('user status update', {users:room['users']});
	// console.log('<--broadcast user status update to all-->');

	notifyUserChanges(this, roomId);

	var curTask = _.find(tasks[roomId], function(task){ return task.tid == tid });
	console.log('curTask', curTask);
	curTask.finished = true;

	// this.socket.emit('all polled', {taskInfo:curTask, status:3});
	// this.broadcast.to('room_'+roomId).emit('all polled', {taskInfo:curTask, status:3});
	// console.log('<--broadcast all polled to all-->');

	notifyTaskClosed(this, curTask, roomId);

})

var notifyUserChanges = function(self, roomId){
	self.socket.emit('user status update', {users:room['users']});
	self.broadcast.to('room_'+roomId).emit('user status update', {users:room['users']});
	console.log('<--broadcast user status update to all-->');
}

var notifyTaskClosed = function(self, task, roomId){
		task.finished = true;
		self.socket.emit('all polled', {taskInfo:task, status:3});
		self.broadcast.to('room_'+roomId).emit('all polled', {taskInfo:task, status:3});
		console.log('<--broadcast all polled to all-->');
}








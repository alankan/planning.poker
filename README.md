# Planning Poker Room


Basic Node.js demo project is used to give students perception of Planning Poker in agile project management, and also leave room for students to practice coding.

Key technical features:

 * Use [Koa.io](https://github.com/koajs/koa.io) which is a generator based flow-control web framework integrated with Socket.io
 * Realtime server browser bidirectional channel via Socket.io
 * Use [React.js](https://facebook.github.io/react/) as frontend view model
 * Use [Flux](https://facebook.github.io/flux/) as frontend event dispatcher
 * Use [Webpack](http://webpack.github.io/) to bundle javascript modules 
 * Use [Bootstrap 3.3.5](http://getbootstrap.com/) as CSS framework

Main functions:
 * User who create the room will automaticlly become task manager of the room and able to create new tasks.
 * Once the new task has been created all users in the same room will receive that task info immediately, and mark the task with points.
 * Once all users (exclude task manager) had given points, the poll results will automaticlly published to every user.
 * User who drop out the room will not affect the poll results to be published.




## Demo

* Use [planning-poker-room.mybluemix.net/room/create](planning-poker-room.mybluemix.net/room/create) to create room for others join.

* Use [planning-poker-room.mybluemix.net/room/*NUM*](planning-poker-room.mybluemix.net/room/) to join.
 Replace *NUM* with actual room number created from previous url to join the room.

## Install

Make sure [Node.js](https://nodejs.org/download/) 0.12.7 or above installed.

Checkout or download this project, <kbd>cd</kbd> into its folder and type following command to install
```
  npm install
```
after installed, use following command to start server:
```
  node --harmony app.js
```

for development, first need to install [webpack](http://webpack.github.io/) and [grunt](http://gruntjs.com), and start webpack to monitor javascript and jsx file changes:
```
  sudo npm install webpack grunt-cli -g
  webpack --progress --colors --watch
```
then open another terminal and use following command to start with server with auto restart:
```
  grunt
```

after server started, open [http://localhost:3000/room/create](http://localhost:3000/room/create)
in your browser to play with.



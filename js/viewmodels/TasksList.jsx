var React = require('react');
var TaskStore = require('../task_store')
var Actions = require('../actions');
var Task = require('./Task.jsx');

function getAllTasks() {
  return {tasks: TaskStore.getAllTasks()};
}

var TasksList = React.createClass({
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
  	for (task of tasks){
  		console.log("setup task:", task);
  		lists.push(<Task key={task.taskInfo.tid} task={task.taskInfo} status={task.status}/>)
  	}

  	return <div className="row">{lists}</div>
  }
})

module.exports = TasksList;
var React = require('react');
var SubmitBtn = require('./SubmitBtn.jsx')
var Actions = require('../actions');
var Hub = require('../dispatcher');
var Const = require('../constant');

var TaskModal = React.createClass({
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

		return <div className="modal fade" id="newTaskInputModal" tabindex="-1" role="dialog" aria-labelledby="newTaskInputModalLabel">
    	<div className="modal-dialog" role="document">
        <div className="modal-content">

          <div className="modal-header">
            <h4 className="modal-title" id="newTaskInputModalLabel">Please input task info</h4>
          </div>
          <div className="modal-body">
              <div className="form-group">
                <label for="task-name" className="control-label">Task name:</label>
                <input type="text" ref="title" className="form-control" disabled={disabled} onChange={this.handleTaskName}></input>
              </div>
              <div className="form-group">
                <label for="task-desc" className="control-label">Task detail:</label>
                <textarea ref="desc" className="form-control" disabled={disabled} ></textarea>
              </div>
          </div>
          <div className="modal-footer">
            <SubmitBtn enable={this.state.enable} onClick={this.handleSubmit} status={this.state.status}/>
          </div>
        </div>
    	</div>
	  </div>
	}
})

module.exports = TaskModal;
var React = require('react');
var SubmitBtn = require('./SubmitBtn.jsx')
var Actions = require('../actions');

var UsernameModal = React.createClass({
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

		return <div className="modal fade" id="userNameInputModal" tabindex="-1" role="dialog" aria-labelledby="userNameInputModalLabel">
    	<div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title" id="userNameInputModalLabel">Please input your name</h4>
          </div>
          <div className="modal-body">
              <div className="form-group">
                <label for="user-name" className="control-label">User name:</label>
                <input type="text" className="form-control" disabled={this.state.submitting ? 'disabled':''} onChange={this.handleUsername}></input>
              </div>
          </div>
          <div className="modal-footer">
            <SubmitBtn enable={this.state.enable} onClick={this.handleSubmit} />
          </div>
        </div>
    	</div>
	  </div>
	}
})

module.exports = UsernameModal;
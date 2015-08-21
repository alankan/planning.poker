var React = require('react');

var TaskBtn = React.createClass({

	handleClick:function(){
		console.log(this.props.onclick);
		this.props.onclick();
		console.log('TaskBtn clicked');
	},
	render: function() {

		return <button type="button" className="btn btn-primary btn-sm" onClick={this.handleClick}>New Task</button>		

	}
})

module.exports = TaskBtn;
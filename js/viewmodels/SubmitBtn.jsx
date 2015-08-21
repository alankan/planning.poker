var React = require('react');
var SubmitBtn = React.createClass({
	getInitialState: function() {
		return {status:this.props.status||0};
	},
	
	_handleClick:function(){
		this.setState({status: 1})
		console.log('SubmitBtn: Clicked, change status to 1');
		this.props.onClick();
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({status: nextProps.status});
	},

	render: function() {
		var className = ''
		var disabled = this.props.enable? '':'disabled';
		console.log("SubmitBtn: status %s enable %s", this.state.status, this.props.enable);
		var label = 'Submit';
		switch (this.state.status){
			case 0:
				className = 'fa fa-circle-o-notch fa-spin hidden';
				break;
			case 1:
				className = 'fa fa-circle-o-notch fa-spin';
				disabled = 'disabled';
				break;
			case 2:
				className = 'fa fa-circle-o-notch fa-spin hidden';
				disabled = 'disabled';
				label = 'Submited';
				break;
		}

		return <button type="button" className="btn btn-primary btn-lg" disabled={disabled} 
			onClick={this._handleClick}>{label} <i className={className}></i></button>		

	}
})

module.exports = SubmitBtn;
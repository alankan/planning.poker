var React = require('react');


var SimpleBtn = React.createClass({

	_handleClick: function(){
		if (this.props.returnVal){
			this.props.onClick(this.props.returnVal)			
		}else{
			this.props.onClick();
		}
		
	},

	render: function(){
		return <button className={this.props.className} disabled={this.props.enable? '':'disabled'} onClick={this._handleClick} >{this.props.label}</button>
	}

});

module.exports = SimpleBtn;

<button class="btn btn-warning btn-lg"> Close Poll </button>
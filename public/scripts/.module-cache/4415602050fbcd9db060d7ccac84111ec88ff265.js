var Title = React.createClass({displayName: "Title",
  render: function() {
    return React.createElement("h2", null, "Planning Poker Room: ", this.props.name);
  }
});

var SubmitBtn = React.createClass({displayName: "SubmitBtn",
	getInitialState: function() {
		return {submitting:false};
	},
	handleClick:function(){
		this.setState({submitting: true})
		console.log('change submitting state');
	},
	render: function() {

		console.log('this.props.enable', this.props.enable);
		var cx = React.addons.classSet;
		var classes = cx({
			'fa': true,
			'fa-circle-o-notch': true,
			'fa-spin': true,
			'hidden': !this.state.submitting
		})

		if (this.props.enable){
			return React.createElement("button", {type: "button", className: "btn btn-primary", onClick: this.handleClick}, "Submit ", React.createElement("i", {className: classes, ref: "spinning"}))
		}else{
			return React.createElement("button", {type: "button", className: "btn btn-primary", disabled: "disabled"}, "Submit")	
		}
		

	}
})

var UsernameModal = React.createClass({displayName: "UsernameModal",
	getInitialState: function() {
		return {enable: false};
	},
	handleSubmit: function(e){

		return;
	},
	handleUsername: function(e){
		console.log(e.target.value);
		if (e.target.value.trim().length >= 3){
			this.setState({enable: true});
		}else{
			this.setState({enable: false});
		}
		console.log(this.state.enable);
	},

	render: function(){

		return React.createElement("div", {className: "modal fade", id: "userNameInputModal", tabindex: "-1", role: "dialog", "aria-labelledby": "userNameInputModalLabel"}, 
    	React.createElement("div", {className: "modal-dialog", role: "document"}, 
        React.createElement("div", {className: "modal-content"}, 
        	React.createElement("form", {onSubmit: this.handleSubmit}, 
          React.createElement("div", {className: "modal-header"}, 
            React.createElement("h4", {className: "modal-title", id: "userNameInputModalLabel"}, "Please input your name")
          ), 
          React.createElement("div", {className: "modal-body"}, 
              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", {for: "user-name", className: "control-label"}, "User name:"), 
                React.createElement("input", {type: "text", className: "form-control", ref: "userName", onChange: this.handleUsername})
              )
          ), 
          React.createElement("div", {className: "modal-footer"}, 
            React.createElement(SubmitBtn, {enable: this.state.enable})
          )
          )
        )
    	)
	  )
	}
})


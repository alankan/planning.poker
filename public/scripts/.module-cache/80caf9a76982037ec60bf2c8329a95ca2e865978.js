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
		React.findDOMNode(this.refs.spinning).class
	},
	render: function() {

		var cx = React.addons.classSet;
		var classes = cx({
			'fa': true,
			'fa-circle-o-notch': true,
			'fa-spin': true,
			'hidden': !this.props.submitting
		})

		return React.createElement("button", {type: "button", id: "submitBtn", className: "btn btn-primary", onClick: this.handleClick}, "Submit ", React.createElement("i", {className: classes, ref: "spinning"}))
	}
})

var UsernameModal = React.createClass({displayName: "UsernameModal",

	handleSubmit: function(e){
		return;
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
                React.createElement("input", {type: "text", className: "form-control", id: "userName"})
              )
          ), 
          React.createElement("div", {className: "modal-footer"}, 
            React.createElement(SubmitBtn, null)
          )
          )
        )
    	)
	  )
	}
})


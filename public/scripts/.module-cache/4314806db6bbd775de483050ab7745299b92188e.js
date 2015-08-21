var Title = React.createClass({displayName: "Title",
  render: function() {
    return React.createElement("h2", null, "Planning Poker Room: ", this.props.name);
  }
});

var UsernameModal = React.createClass({displayName: "UsernameModal",
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
            React.createElement("button", {type: "button", id: "submitBtn", className: "btn btn-primary"}, "Submit ", React.createElement("i", {className: "fa fa-circle-o-notch fa-spin hidden", ref: "spinning"}))
          )
          )
        )
    	)
	  )
	}
})
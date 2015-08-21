var HelloMessage = React.createClass({displayName: "HelloMessage",
  render: function() {
    return React.createElement("h2", null, "Planning Poker Room: ", this.props.name);
  }
});
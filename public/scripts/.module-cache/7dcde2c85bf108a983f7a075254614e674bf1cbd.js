var Title = React.createClass({displayName: "Title",
  render: function() {
    return React.createElement("h2", null, "Planning Poker Room: ", this.props.name);
  }
});
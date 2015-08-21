var React = require('react');

var TitleBar = React.createClass({
  render: function() {
    return <h2>Planning Poker Room: {this.props.name}</h2>;
  }
});

module.exports = TitleBar;
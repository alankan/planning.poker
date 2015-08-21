var React = require('react');
var UserStore = require('../user_store')
var Actions = require('../actions');


function getAllUsers() {
  return {
    users: UserStore.getAllUsers()
  };
}

var UsersList = React.createClass({
	getInitialState: function() {
		return getAllUsers();
	},

	componentDidMount: function() {
    UserStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
  	this.setState(getAllUsers());
    console.log("userslist: fire state change", this.state.users);
  }, 

  render: function(){
  	var lists = [];
  	var users = this.state.users||[];
  	for (var i=0; i<users.length; i++){
      var highlight = (users[i].isAdmin||users[i].poll) ? "fa fa-check-circle green-color":"fa fa-check-circle hidden"
  		lists.push(<li key={users[i].uid}><i className={users[i].isAdmin ? 'fa fa-user green-color':'fa fa-user grey-color'}></i>&nbsp;&nbsp;{users[i].uname}&nbsp;&nbsp;<i className={highlight}></i></li>)
  	}

  	return <div>
	  	<div className="row border-bottom-left">
	      <h6>Online users: ({this.state.users.length})</h6>
	    </div>
	    <div className="user-list-padding">
	      <ul className="list-unstyled">
	      	{lists}
	      </ul>
	    </div>
    </div>
  }
})

module.exports = UsersList;
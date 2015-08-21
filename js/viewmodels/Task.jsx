var React = require('react');
var TaskStore = require('../task_store')
var Actions = require('../actions');
var SimpleBtn = require('./SimpleBtn.jsx')
var SubmitBtn = require('./SubmitBtn.jsx')
var Hub = require('../dispatcher');
var Const = require('../constant');

var Points = [1,2,3,5,8,13,20,40,100];

var Task = React.createClass({
	getInitialState: function() {
		return {curPoint:null, submitStatus:0};
	},

	_handlePointBtnClick: function(val){
		console.log("point changed: ", val);
		if (val>0){
			this.setState({curPoint: parseInt(val)});
		}
	},

	_handleSubmitPoint: function(){
		console.log("submitting point: %s with taskId: %s", this.state.curPoint, this.props.task.tid);
		this.setState({submitStatus:1})
		Actions.submitPoll(this.props.task.tid, this.state.curPoint);
	},

	componentDidMount: function() {
		var _self = this;
  	Hub.register(function(action) {
  		if (action.actionType == Const.SUBMIT_POLL_SUCCESS){
  			_self.setState({curPoint:_self.state.curPoint, submitStatus: 2});
		  	console.log('change SubmitBtn status to 2 after SUBMIT_POLL_SUCCESS');
		  }
  	})
	},

	_handleClosePoll: function(){
		console.log("closing poll: ", this.props.task.tid);
		this.setState({submitStatus:1})
		Actions.closePoll(this.props.task.tid);
	},

	render: function(){
		var curPoint = parseInt(this.state.curPoint);
		var task = this.props.task;
		var status = this.props.status;
		var bottomArea;

		if (status==0){
			bottomArea = <div className="bottom-box"><p><SimpleBtn className="btn btn-warning btn-lg" onClick={this._handleClosePoll} enable={true} label="Close Poll"/></p></div>
		}

		if (status==1){
			var bottomBtns = [];

			for (point of Points){
				var highlightBtn = !(curPoint == point);
				bottomBtns.push(<SimpleBtn key={point} returnVal={point} className={ highlightBtn ? 'btn btn-default btn-lg':'btn btn-info btn-lg'} label={point} onClick={this._handlePointBtnClick} enable={true}/>);	
			}
			bottomBtns.push(<SubmitBtn className="btn btn-primary btn-lg" onClick={this._handleSubmitPoint} enable={curPoint ? true:false} status={this.state.submitStatus}/>)

			bottomArea = <div className="bottom-box"><p>{bottomBtns}</p></div>
		}

		if (status==2){
			var bottomBtns = [];

			for (point of Points){
				var highlightBtn = !(curPoint == point);
				bottomBtns.push(<SimpleBtn key={point} returnVal={point} className={ highlightBtn ? 'btn btn-default btn-lg':'btn btn-info btn-lg'} label={point} onClick={this._handlePointBtnClick} enable={false}/>);	
			}
			bottomBtns.push(<SubmitBtn className="btn btn-primary btn-lg" onClick={this._handleSubmitPoint} enable={ false } status={this.state.submitStatus}/>)

			bottomArea = <div className="bottom-box"><p>{bottomBtns}</p><p><code>Please wait for others submitting their points...</code></p></div>
		}

		if (status==3){
			var users = [];
			var votes = this.props.task.votes;
			var totalPoints = 0;
			for (vote of votes){
				users.push(<li key={vote.uid}><i className="fa fa-user gray-color"></i><samp>{vote.uname}<kbd>{vote.point}</kbd></samp></li>);
				totalPoints += vote.point;
			}

			bottomArea = <div className="bottom-box"><ul className="list-inline">{users}</ul><p><code>  Avg Point: {parseInt(totalPoints/votes.length)}  </code></p></div>

		}

		return <div className="box-row">
            <div className="upper-box">
              <h4>{task.name}</h4>
              <p>{task.desc}</p>
            </div>

            {bottomArea}

         	</div>

	}
})

module.exports = Task;
import React from "react"
import PropTypes from "prop-types"
import Modal from 'react-modal'
import Task from "./Task.jsx"
import InputTaskModal from "./InputTaskModal.jsx"

class Group extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group_members:[] ,
      group_tasks: []
    }
    this.getGroupInfo = this.getGroupInfo.bind(this);
    this.getGroupInfo(props.group.id)
  }


  render () {
    return (
        <div>
          <button onClick={ () => this.getGroupInfo(this.props.group.id)}>
            {this.props.group.name}
          </button>
          {this.state.group_members}
          {this.state.group_tasks.map((task) => {
            return (
                <Task id={task.id} content={task.content} updateTasks={() => this.getGroupInfo(this.props.group.id)}/>
            )
          })}
          <InputTaskModal group_id={this.props.group.id} updateTasks={() => this.getGroupInfo(this.props.group.id)}/>
        </div>

    );
  }

  getGroupInfo(id) {
    fetch("/groups/"+id,{
      method: 'GET'
      }).then(res => res.json())
      .then(
        (result) => {
          var user_list = []
          for(var i in result[0]){
            user_list.push(<a href="">{result[0][i].name} </a>)
          }
          this.setState({
            group_members: user_list
          });


          var task_list = []
          this.setState({
            group_tasks: task_list
          });
          for(var i in result[1]){
            task_list.push(result[1][i])
          }
          this.setState({
            group_tasks: task_list
          });


        }
      )
  }
}


export default Group

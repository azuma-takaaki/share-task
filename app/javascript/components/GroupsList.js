import React from "react"
import PropTypes from "prop-types"
class GroupsList extends React.Component {
  constructor(props) {
    super(props);

  }

  render () {
    return (
      <React.Fragment>
        {this.props.groups.map((group) => {
          return (
            //<p class="users-group"><a href={"/groups/" + group.id }>{group.name}</a></p>
              <Group group={group}/>
          )
        })}
      </React.Fragment>
    );
  }



}

class Group extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group_members:[] ,
      group_tasks: []
    }
    this.handleClick = this.handleClick.bind(this);
  }
  render () {
    return (
        <div>
          <button onClick={ () => this.handleClick(this.props.group.id)}>
            {this.props.group.name}
          </button>
          {this.state.group_members}
          {this.state.group_tasks}
        </div>

    );
  }
  handleClick(id) {
    fetch("/groups/"+id)
      .then(res => res.json())
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
          for(var i in result[1]){
            task_list.push(<p><a href={"/tasks/"+ result[1][i].id +"/edit"}>{result[1][i].content} </a></p>)
          }
          this.setState({
            group_tasks: task_list
          });
        }
      )
  }
}


//return <a href={"/groups/" + {group.id}}>{group.name}</a>;
//reactに組み込まれた型指定方法で， 意図しない型の変数が入らないように指定している
GroupsList.propTypes = {
  groups: PropTypes.string
};

export default GroupsList

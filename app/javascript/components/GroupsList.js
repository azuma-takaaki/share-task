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
        </div>

    );
  }
  handleClick(id) {
    fetch("/groups/"+id)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            group_members: result.name
          });
        }
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
      )
  }
}


//return <a href={"/groups/" + {group.id}}>{group.name}</a>;
//reactに組み込まれた型指定方法で， 意図しない型の変数が入らないように指定している
GroupsList.propTypes = {
  groups: PropTypes.string
};

export default GroupsList

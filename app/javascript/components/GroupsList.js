import React from "react"
import PropTypes from "prop-types"
import Modal from 'react-modal'
import Group from "./Group.jsx"


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


//return <a href={"/groups/" + {group.id}}>{group.name}</a>;
//reactに組み込まれた型指定方法で， 意図しない型の変数が入らないように指定している
GroupsList.propTypes = {
  groups: PropTypes.string
};

export default GroupsList

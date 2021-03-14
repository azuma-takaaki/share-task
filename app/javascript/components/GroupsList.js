import React from "react"
import PropTypes from "prop-types"
class GroupsList extends React.Component {
  render () {
    return (
      <React.Fragment>
        {this.props.groups.map((group) => {
          return <a href="/">{group.name}</a>;
        })}
      </React.Fragment>
    );
  }
}

//reactに組み込まれた型指定方法で， 意図しない型の変数が入らないように指定している
GroupsList.propTypes = {
  groups: PropTypes.string
};

export default GroupsList

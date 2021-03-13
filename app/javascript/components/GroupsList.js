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

GroupsList.propTypes = {
  groups: PropTypes.string
};
export default GroupsList

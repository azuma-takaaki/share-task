import React from "react"
import PropTypes from "prop-types"
class User extends React.Component {
  render () {
    return (
      <React.Fragment>
        <h1>にゃーん　吾輩は　ユーザーです</h1>
        <button onClick={this.props.logout}>ログアウトボタン</button>
      </React.Fragment>
    );
  }
}

export default User

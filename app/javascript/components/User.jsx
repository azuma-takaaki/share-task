import React from "react"
import PropTypes from "prop-types"
import Modal from 'react-modal'
import Catsle from "./Catsle.jsx"

class User extends React.Component {
  render () {
    return (
      <div>
        <h1>{this.props.current_user.name}</h1>
        <button>編集</button>
        <Catsle/>
        <button onClick={this.props.logout}>ログアウトボタン</button>
      </div>
    );
  }
}

export default User

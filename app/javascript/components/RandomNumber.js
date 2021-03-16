import React from "react"
import PropTypes from "prop-types"
class RandomNumber extends React.Component {
  render () {
    return (
      <React.Fragment>
        <div>
          <a onClick={this.handleClick} href = "/render_random_number">ランダムナンバーを取得</a>

        </div>
      </React.Fragment>
    );
  }



  handleClick() {
    alert('Click!!')
  }
}


export default RandomNumber

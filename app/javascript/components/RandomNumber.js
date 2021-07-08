import React from "react"
import PropTypes from "prop-types"
class RandomNumber extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      greeting: ''
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleClick1 = this.handleClick1.bind(this);
  }


  componentDidMount() {
    fetch(this.props.url)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            greeting: result.greeting
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            error
          });
        }
      )
    }



  render () {
    const {error, greeting } = this.state;
    return (
      <div>
        <button onClick={this.handleClick1}>
          num: {this.state.greeting}
          error: {this.state.error}
        </button>
        <a href="/api/v1/hello/name">{this.state.greeting}</a>
        <React.Fragment>
          Greeting: {greeting}
        </React.Fragment>
      </div>
    );
  }

  handleClick() {

    this.setState((state) => {
    // 重要：更新には `this.state` ではなく `state` を使います。
      return { message: Math.floor( Math.random() * 101 ) }
    });

  }
  handleClick1() {
    fetch("/api/v1/hello/name")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            greeting: result.greeting
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            error
          });
        }
      )

  }


}


export default RandomNumber

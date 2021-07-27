import React from "react"
import PropTypes from "prop-types"
import Modal from 'react-modal'
import Group from "./Group.jsx"

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
 }
};

class Top extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input_value: '',
      modal_title: ''
    }
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  openModal(type) {
    var modal_type = ""
    if(type=="signup"){
      modal_type="新規アカウント登録"
    }else if(type=="login"){
      modal_type="ログイン"
    }else{
      modal_type="デフォルト"
    }
    this.setState({modal_title: modal_type});
    this.setState({modalIsOpen: true});
  }
  afterOpenModal() {
    this.subtitle.style.color = '#fff000';
  }
  closeModal() {
    this.setState({modalIsOpen: false});
    this.setState({input_value: ""})
    his.setState({modal_title: ""});
  }

  render () {
    return (
      <div>
        <h1>新規アカウント</h1>
        <button class="btn btn-primary" onClick={()=>this.openModal("signup")}>新規アカウント登録</button>
        <button class="btn btn-outline-success" onClick={()=>this.openModal("login")}>ログイン</button>

        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h2>{this.state.modal_title}</h2>
        </Modal>

      </div>
    );
  }
}

Top.propTypes = {
  message: PropTypes.string
};
export default Top

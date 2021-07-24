import React from "react"
import PropTypes from "prop-types"
import Modal from 'react-modal'

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


class InputTaskModal extends React.Component {
  constructor() {
    super();
    this.state = {
      modalIsOpen: false,
      input_value: ''
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.postData = this.postData.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  openModal() {
    this.setState({modalIsOpen: true});
  }
  afterOpenModal() {
    this.subtitle.style.color = '#fff000';
  }
  closeModal() {
    this.setState({modalIsOpen: false});
  }
  postData(){
    const data = { task: {content: this.state.input_value, group_id: this.props.group_id} };

    const getCsrfToken = () => {
      const metas = document.getElementsByTagName('meta');
      for (let meta of metas) {
          if (meta.getAttribute('name') === 'csrf-token') {
              console.log('csrf-token:', meta.getAttribute('content'));
              return meta.getAttribute('content');
          }
      }
      return '';
    }
      fetch("/tasks", {
        method: 'POST', // or 'PUT'
        headers: {
                  'Content-Type': 'application/json',
                  'X-CSRF-Token': getCsrfToken()
        },
        body: JSON.stringify(data),
      }).then(this.props.updateTasks())
      this.setState({modalIsOpen: false});
      this.setState({input_value: ""});
  }

  handleChange(e){
    this.setState({input_value: e.target.value});
  }



  render() {
    return (
      <div>
        <button class="add-task-button"onClick={this.openModal}>＋task</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h2>新しいタスクを追加</h2>
          <form onSubmit={this.postData}>
            <input type="text" value={this.state.input_value}  onChange={this.handleChange}/>
            <input type="submit" value="Submit" />
          </form>
        </Modal>
      </div>
    );
  }
}
export default InputTaskModal

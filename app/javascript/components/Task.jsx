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

class Task extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      content: props.content,
      input_value: ''
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.deleteData = this.deleteData.bind(this);
    this.updateData = this.updateData.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  openModal() {
    this.setState({modalIsOpen: true});
    let content = this.state.content
    this.setState({input_value: content});
  }
  afterOpenModal() {
    this.subtitle.style.color = '#fff000';
  }
  closeModal() {
    this.setState({modalIsOpen: false});
  }
  deleteData(){

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
      fetch("/tasks/" + this.state.id, {
        method: 'DELETE', // or 'PUT'
        headers: {
                  'Content-Type': 'application/json',
                  'X-CSRF-Token': getCsrfToken()
        },

      }).then(this.props.updateTasks())
      this.setState({input_value: ""});
      closeModal()
  }

  updateData(content){
    const data = { task: {content:this.state.input_value}, id: this.state.id };

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
      fetch("/tasks/" + this.state.id, {
        method: 'PATCH', // or 'PUT'
        headers: {
                  'Content-Type': 'application/json',
                  'X-CSRF-Token': getCsrfToken()
        },
        body: JSON.stringify(data),
      }).then(this.props.updateTasks())
      this.setState({input_value: ""});
      closeModal()
  }

  handleChange(e){
    this.setState({input_value: e.target.value});
  }

  render(){
    return(
      <div id = {this.props.id}>
        <button class='task btn btn-outline-info'onClick={this.openModal}>{this.state.content}</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h2>修正</h2>

          <input type="text" value={this.state.input_value}  onChange={this.handleChange}/>
          <button onClick={this.updateData}>更新</button>
          <button onClick={this.deleteData}>削除</button>
        </Modal>
      </div>
    );
  }
}

export default Task

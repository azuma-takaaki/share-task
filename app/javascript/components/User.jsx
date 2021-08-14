import React from "react"
import PropTypes from "prop-types"
import Modal from 'react-modal'
import Castle from "./Castle.jsx"



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


class User extends React.Component {
  constructor(props) {
    super(props);
    this.props.fetchCastles("user", this.props.current_user.id, false)
    this.state = {
      input_name: ''
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateData = this.updateData.bind(this);
  }
  openModal() {
    this.setState({input_name: this.props.current_user.name})
    this.setState({modalIsOpen: true});
  }
  afterOpenModal() {
    this.subtitle.style.color = '#fff000';
  }
  closeModal() {
    this.setState({modalIsOpen: false});
    this.setState({input_name: this.props.current_user.name});
  }
  handleChange(e){
    this.setState({input_name: e.target.value});
  }

  updateData(content){
    const data = { user: {name:this.state.input_name}};

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
      fetch("/users/" + this.props.user_id, {
        method: 'PATCH', // or 'PUT'
        headers: {
                  'Content-Type': 'application/json',
                  'X-CSRF-Token': getCsrfToken()
        },
        body: JSON.stringify(data),
      }).then(res => res.json())
      .then(
        (result) => {
          this.setState({current_user: result[1]})
          this.setState({input_name: result[1].name});
        }).then(

          this.closeModal()
      )
  }

  render () {

    var castles;
    if(!(this.props.users_castle_list.length==0)){
      castles = this.props.users_castle_list.map((castle) => {
        return (
            <Castle castle_id={castle.id} castle_name={castle.name} tag_class="castle_at_user_page"/>
        )
      })
    }else{
      castles = <h1 class = "massage-castle-is-empty">まだ城を持っていません</h1>
    }

    return (
      <div class="users-wrapper">
        <div class="users-header">
          <img class = "user-icon" src={require("../../assets/images/default/" + this.props.current_user.icon)} />
          <div class="users-page-header-name">{this.props.current_user.name}</div>
          <button class="edit-user-button"onClick={this.openModal}>・・・</button>
        </div>

        {castles}


        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h2>ユーザー情報編集</h2>
          <input type="text" value={this.state.input_name}  onChange={this.handleChange}/>
          <button onClick={this.updateData}>更新</button>
          <p></p>
          <button onClick={this.props.logout}>ログアウト</button>
        </Modal>
      </div>
    );
  }
}

export default User

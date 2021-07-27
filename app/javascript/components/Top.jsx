import React from "react"
import PropTypes from "prop-types"
import Modal from 'react-modal'
import GroupsList from "./GroupsList.jsx"

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
    this.GroupsListRef = React.createRef();
    this.state = {
      logged_in: false,
      user_name: '',
      email:'',
      password:'',
      password_confirm:'',
      group_list: [],
      modal_type: ''
    }
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.signupPost = this.signupPost.bind(this);
    this.loginPost = this.loginPost.bind(this);

  }
  openModal(type) {
    this.setState({modal_type: type});
    this.setState({modalIsOpen: true});
  }
  afterOpenModal() {
    this.subtitle.style.color = '#fff000';
  }
  closeModal() {
    this.setState({modalIsOpen: false});
    this.setState({modal_title: ""});
    this.setState({user_name: ""});
    this.setState({email: ""});
    this.setState({password: ""});
    this.setState({password_confirm: ""});
  }

  handleChange(e){
    this.setState({[e.target.name]: e.target.value})
  }

  signupPost(){
    const data =
      {   user: {
            name: this.state.user_name,
            email: this.state.email,
            password: this.state.password,
            password_confirmation: this.state.password_confirm
          }
      };
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
      fetch("/users", {
        method: 'POST', // or 'PUT'
        headers: {
                  'Content-Type': 'application/json',
                  'X-CSRF-Token': getCsrfToken()
        },
        body: JSON.stringify(data),
      }).then(res => res.json())
      .then(
        (result) => {
          var user_list = []
          for(var i in result[0]){
            user_list.push(result[0][i])
          }
          this.setState({
            group_list: user_list
          });
        })
        this.setState({
          logged_in: true
        });
      this.closeModal()
  }

  loginPost(){
    const data =
      {   session: {
            email: this.state.email,
            password: this.state.password,
          }
      };
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
      fetch("/sessions/login", {
        method: 'POST', // or 'PUT'
        headers: {
                  'Content-Type': 'application/json',
                  'X-CSRF-Token': getCsrfToken()
        },
        body: JSON.stringify(data),
      }).then(res => res.json())
      .then(
        (result) => {
          var group_list = []
          for(var i in result[0]){
            group_list.push(result[0][i])
          }

          this.setState({
            group_list: group_list
          });
          alert(Object.keys(group_list[0]))
        })
        this.setState({
          logged_in: true
        });
        this.GroupsListRef.current.getGroupList();
      this.closeModal()
  }



  render () {
    let modal_content;
    if(this.state.modal_type=="signup") {
        modal_content =
            <div>
              <h2>新規アカウント登録</h2>
              <input name="user_name" type="text" value={this.state.user_name}  onChange={this.handleChange}/>
              <input name="email" type="text" value={this.state.email}  onChange={this.handleChange}/>
              <input name="password" type="text" value={this.state.password}  onChange={this.handleChange}/>
              <input name="password_confirm" type="text" value={this.state.password_confirm}  onChange={this.handleChange}/>
              <button class="btn btn-info" onClick={this.signupPost}>登録</button>
            </div>
    }else if(this.state.modal_type=="login"){
        modal_content =
              <div>
                <h2>ログイン</h2>
                <input name="email" type="text" value={this.state.email}  onChange={this.handleChange}/>
                <input name="password" type="text" value={this.state.password}  onChange={this.handleChange}/>
                <button class="btn btn-info" onClick={this.loginPost}>ログイン</button>
              </div>
    } else {
    }

    return (
      <div>
        {(() => {
          if(this.state.logged_in){
            return(<GroupsList groups={this.state.group_list}/>)
          }else{
            return(
              <div>
              <h1>新規アカウント</h1>
              <button class="btn btn-primary" onClick={()=>this.openModal("signup")}>新規アカウント登録</button>
              <button class="btn btn-outline-success" onClick={()=>this.openModal("login")}>ログイン</button>
              <p></p>

              <Modal
                isOpen={this.state.modalIsOpen}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.closeModal}
                style={customStyles}
                contentLabel="Example Modal"
              >
                {modal_content}

              </Modal>
              </div>
            )
          }
        })()}
      </div>
    );
  }
}

Top.propTypes = {
  message: PropTypes.string
};
export default Top

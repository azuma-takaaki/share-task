import React from "react"
import PropTypes from "prop-types"
import Modal from 'react-modal'
import Header from "./Header.jsx"
import GroupsList from "./GroupsList.jsx"
import Catsle from "./Catsle.jsx"

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
    var is_logged_in = false
    if(!(props.logged_in_user  === null)){
      is_logged_in = true
    }


    var tmp = props.logged_in_user
    this.state = {
      current_user: tmp,
      logged_in: is_logged_in,
      user_name: '',
      email:'',
      password:'',
      password_confirm:'',
      group_list: [],
      modal_type: '',
      main_content: <div></div>,
      error_messages: '',
      success_messages: ''
    }
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.signupPost = this.signupPost.bind(this);
    this.loginPost = this.loginPost.bind(this);
    this.logout = this.logout.bind(this);
    this.setMainContent = this.setMainContent.bind(this);

    if(is_logged_in){
      this.setMainContent()
    }

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
    this.setState({error_messages: ""});
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
          if(result[0] == "アカウント登録できませんでした"){
            var error_massages = []
            for(var i in result[1]){
              error_massages.push(result[1][i])
            }
            this.setState({
              error_messages: error_massages
            })
          }else{
            var user_list = []
            for(var i in result[0]){
              user_list.push(result[0][i])
            }
            this.setState({
              group_list: user_list
            })
            this.setState({
              current_user: result[1]
            })
            this.setState({
              main_content: <div><Header/><GroupsList groups={this.state.group_list} current_user={this.state.current_user} logout={this.logout}/></div>
            })
            this.setState({
              logged_in: true
            })
            this.closeModal()
          }
        })
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
          if(result[0] == "ログインできませんでした"){
            var error_massages = []
            for(var i in result[1]){
              error_massages.push(result[1][i])
            }
            this.setState({
              error_messages: error_massages
            })
          }else{
            var group_list = []
            for(var i in result[0]){
              group_list.push(result[0][i])
            }
            this.setState({
              group_list: group_list
            })
            this.setState({
              current_user: result[1]
            })
            this.setState({
              main_content: <div><Header/><GroupsList groups={this.state.group_list} current_user={this.state.current_user} logout={this.logout}/></div>
            })
            this.setState({
              logged_in: true
            })
            this.closeModal()
          }


        })

  }

  logout(){
      fetch("/users/logout", {
        method: 'GET'
      }).then(
        this.setState({
          logged_in: false
        })
      )
  }

  setMainContent(){
    fetch("/users/" + this.props.logged_in_user.id, {
      method: 'GET'
    }).then(res => res.json())
    .then(
      (result) => {
        var group_list = []
        for(var i in result[0]){
          group_list.push(result[0][i])
        }
        this.setState({
          group_list: group_list
        })
        this.setState({
          current_user: result[1]
        })
        this.setState({
          main_content: <div><Header/><GroupsList groups={this.state.group_list} current_user={this.state.current_user} logout={this.logout}/></div>
        })
      })

  }









  render () {
    let modal_content;
    if(this.state.modal_type=="signup") {
        modal_content =
            <div class = "signup-login-modal">
              <h2>新規アカウント登録</h2>
              <input name="user_name" class="form-control" type="text" placeholder = "name" value={this.state.user_name}  onChange={this.handleChange}/>
              <input name="email" class="form-control" type="text" placeholder = "email" value={this.state.email}  onChange={this.handleChange}/>
              <input name="password" class="form-control" type="password" placeholder = "password" value={this.state.password}  onChange={this.handleChange}/>
              <input name="password_confirm" class="form-control" type="password" placeholder = "password confirm" value={this.state.password_confirm}  onChange={this.handleChange}/>
              <button class="btn btn-info" onClick={this.signupPost}>登録</button>
            </div>
    }else if(this.state.modal_type=="login"){
        modal_content =
              <div class = "signup-login-modal">
                <h2>ログイン</h2>
                <input name="email" class="form-control" type="text" placeholder = "email" value={this.state.email}  onChange={this.handleChange}/>
                <input name="password" class="form-control" type="password" placeholder = "password" value={this.state.password}  onChange={this.handleChange}/>
                <button id="modal-login-button" class="btn btn-info" onClick={this.loginPost}>ログイン</button>
              </div>
    }else {
    }

    let error_flash_content;
    if (!(this.state.error_messages=='')){
      error_flash_content = <div class="alert alert-danger" id="error-flash">

                                { this.state.error_messages.map((error_message) => <li>{error_message}</li>)}
                            </div>
    }
    let success_flash_content;
    if (!(this.state.success_messages=='')){
      success_flash_content = <div class="alert alert-success" id="success-flash">{this.state.success_messages}</div>

    }

    let main_content;
    if (this.state.logged_in&&(!(this.state.logged_in===null))) {
        main_content = <div>
                          {this.state.main_content}
                      </div>;
    } else {
      main_content = <div>
                        <h1 class ="display-1 top-page-title">積み上げ城</h1>
                        <div class = "top-page-content">
                           1日の努力を記録すると<br/>
                           城の壁が1つ積み上がります<br/>
                           あなたの城が完成した時、<br/>
                           現実のあなたのスキルや習慣も、<br/>
                           その城のように高く強固になっていることでしょう。<br/>
                           一歩踏み出してみましょう。<br/>
                           同じ目標を持つお城の建築士たちが<br/>
                           あなたを待っています。<br/>
                          <div></div>
                        </div>
                        <div class="top-page-buttons">
                          <button class="btn btn-primary top-page-singup-button" onClick={()=>this.openModal("signup")}>新規アカウント登録</button>
                          <button class="btn btn-outline-success top-page-login-button" onClick={()=>this.openModal("login")}>ログイン</button>
                        </div>
                        <p></p>

                        <Modal
                          isOpen={this.state.modalIsOpen}
                          onAfterOpen={this.afterOpenModal}
                          onRequestClose={this.closeModal}
                          style={customStyles}
                          contentLabel="Example Modal"
                        >
                          <button class="close-modal　btn-close btn btn-outline-secondary" onClick={this.closeModal}>×</button>
                          {error_flash_content}
                          {modal_content}

                        </Modal>
                      </div>;
    }

    return (
      <div>
        {success_flash_content}
        {main_content}
      </div>
    );
  }
}

Top.propTypes = {
  message: PropTypes.string
};
export default Top

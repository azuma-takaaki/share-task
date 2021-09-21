import React from "react"
import PropTypes from "prop-types"
import Modal from 'react-modal'
import Header from "./Header.jsx"
import GroupsList from "./GroupsList.jsx"
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

//カスタムプロパティを作成
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {
    vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});




class Top extends React.Component {
  constructor(props) {
    super(props);
    this.GroupsListRef = React.createRef();
    let is_logged_in = false
    if(!(props.logged_in_user  === null)){
      is_logged_in = true
    }


    const window_width = window.innerWidth
    let tmp = props.logged_in_user
    this.state = {
      current_user: tmp,
      logged_in: is_logged_in,
      user_name: '',
      email:'',
      password:'',
      password_confirm:'',
      group_list: [],
      modal_type: '',
      error_messages: '',
      success_messages: '',
      progress_percentage: "0",
      animation_point: "0" ,
      window_width: window_width
    }
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.signupPost = this.signupPost.bind(this);
    this.loginPost = this.loginPost.bind(this);
    this.logout = this.logout.bind(this);
    this.setGroupList = this.setGroupList.bind(this);
    this.sleep = this.sleep.bind(this);
    this.updateCurrentUser = this.updateCurrentUser.bind(this);
    this.resizeWindow = this.resizeWindow.bind(this);

  }

  componentDidMount() {
    if(this.state.is_logged_in){
      this.setGroupList()
    }
  }


  setGroupList(){
    let group_list = []
    fetch("/get_group_list",{
      method: 'GET'
      }).then(res => res.json())
      .then(
        (result) => {
          for(let i in result[0]){
            group_list.push(result[0][i])
          }
          this.setState({
            group_list: group_list
          });
        }
      )
  }

  sleep(waitSec) {
      return new Promise(function (resolve) {

          setTimeout(function() { resolve() }, waitSec);

      });
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
    this.setState({progress_percentage: "20"})
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
      .then((result) => {
          if(result[0] == "アカウント登録できませんでした"){
            this.sleep(300).then(() =>{
              this.setState({progress_percentage: "0"})
              let error_massages = []
              for(let i in result[1]){
                error_massages.push(result[1][i])
              }
              this.setState({
                error_messages: error_massages
              })
            })
          }else{
            this.setState({progress_percentage: "100"})
            this.sleep(1000).then(() =>{
              let group_list = []
              for(let i in result[0]){
                group_list.push(result[0][i])
              }
              this.setState({
                group_list: group_list
              })
              this.setState({
                current_user: result[1]
              })
              this.setState({
                logged_in: true
              })
              this.closeModal()
              this.setState({progress_percentage: "0"})
            })
          }
        })
  }

  loginPost(){
    this.setState({progress_percentage: "20"})
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
      .then((result) => {
          if(result[0] == "ログインできませんでした"){
            this.sleep(300).then(() =>{
              this.setState({progress_percentage: "0"})
              let error_massages = []
              for(let i in result[1]){
                error_massages.push(result[1][i])
              }
              this.setState({
                error_messages: error_massages
              })
            })
          }else{
            this.setState({progress_percentage: "100"})
            this.sleep(1000).then(() =>{
              let group_list = []
              for(let i in result[0]){
                group_list.push(result[0][i])
              }
              this.setState({
                group_list: group_list
              })
              this.setState({
                current_user: result[1]
              })
              this.setState({
                logged_in: true
              })
              this.closeModal()
              this.setState({progress_percentage: "0"})
            })
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

  updateCurrentUser(new_current_user){
    this.setState({current_user: new_current_user})
  }

  sleep(waitSec) {
      return new Promise(function (resolve) {
          setTimeout(function() { resolve() }, waitSec);
      });
  }

  resizeWindow(){
    this.setState({window_width: window.innerWidth})
  }



  render () {
    window.addEventListener('resize', this.resizeWindow);

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


    let delay_changing_animation_point_2 = 3500 * window.innerWidth / 1300
    if(this.state.animation_point == 0){
      this.sleep(10).then(() =>{
        let delay_changing_animation_point_2 = 3500
        if(window.innerWidth<470){
          delay_changing_animation_point_2 = 2000
        }else if(window.innerWidth<550){
          delay_changing_animation_point_2 = 2500
        }
        this.setState({animation_point: 1})
        this.sleep(5000).then(() =>{
          this.setState({animation_point: 2})
          this.sleep(1000).then(() =>{
          })
        })
      })
    }

    window.addEventListener('resize', () => {
      let ofset_height = 1;
      document.documentElement.style.setProperty('--ofsetH', `${ofset_height}rem`);
    });
    let login_signup_buttons = <div class="top-page-buttons" style={{"pointer-events": "none","transition-duration": 1.5 + "s", opacity: 0}}>
                                  <button class="btn btn-primary top-page-singup-button" onClick={()=>this.openModal("signup")}>新規アカウント登録</button>
                                  <button class="btn btn-outline-success top-page-login-button" onClick={()=>this.openModal("login")}>ログイン</button>
                                </div>
    let top_page_sentence = "1日の努力を記録すると城の壁が1つ積み上がります。あなたの城が完成した時、現実のあなたのスキルや習慣も、その城のように高く強固になっていることでしょう。一歩踏み出してみましょう。同じ目標を持つお城の建築士たちがあなたを待っています。"
    let top_page_sentence_reserve = "このアプリケーションは筆者がSNSにて今日の積み上げというハッシュタグで学習進捗を報告し合うSNSの文化が素晴らしいと感じ、それにちなんだアプリを作ろうという考えから生まれました。これを書いている2021年9月14日現在、筆者は50日以上毎日欠かさずこのアプリケーションのリポジトリにcommitし続け、コツコツと今日の積み上げを重ねていきました。まさにこのアプリケーション自体が積み上げ城そのものというわけです。このアプリケーションをきっかけにしてプログラミングないし何か新しいチャレンジをする人が1人でも増え、目標を達成するために必要な習慣が1日でも長く継続できることを願います。"
    let top_page_title = "積み上げ城"
    let top_page_elements = []
    let line_number = 1
    let limit_number_of_character = 35
    let rem_px_ratio = 15
    if(window.innerWidth < 35 * rem_px_ratio){
      let new_limit_number_of_character = Math.round(window.innerWidth / rem_px_ratio) - 5
      if(new_limit_number_of_character % 2 == 0){
        new_limit_number_of_character += 1
      }
      limit_number_of_character = new_limit_number_of_character
    }
    const break_number_array = [5, 16, 30, 42, 57, 66, 81, 94, 109, 121]
    if(this.state.animation_point == 0 || this.state.animation_point == 1){
      let margin_of_character_line = (window.innerWidth - limit_number_of_character * rem_px_ratio)/2/rem_px_ratio
      let character_counter = 0
      for(let i=0; i < (top_page_title+top_page_sentence+top_page_sentence_reserve).split('').length; i++){
        if(i < (top_page_title+top_page_sentence).split('').length){
          top_page_elements.push(<span style={{left: (margin_of_character_line + line_number + character_counter -2 ) + "rem", "transition-delay": (character_counter * 0.01 + i * 0.02) * 0.5+ "s"}} class={"top-page-character character-number-" + i + " animation-point-" + this.state.animation_point +  " line-number-" + line_number}>{(top_page_title+top_page_sentence+top_page_sentence_reserve)[i]}</span>)
        }else{
          top_page_elements.push(<span style={{left: (margin_of_character_line + line_number + character_counter -2 ) + "rem", "transition-delay": (character_counter * 0.01 + i * 0.02) * 0.5+ "s"}} class={"top-page-character character-number-" + i + " animation-point-" + this.state.animation_point +  " line-number-" + line_number + " hide-character"}>{(top_page_title+top_page_sentence+top_page_sentence_reserve)[i]}</span>)
        }
        if(limit_number_of_character<=1){
          i += (top_page_title+top_page_sentence+top_page_sentence_reserve).split('').length
        }
        character_counter += 1
        if(character_counter==limit_number_of_character){
          character_counter = 0
          line_number += 1
          limit_number_of_character -= 2
        }
      }
    }else{
      let font_size_of_title = 4
      let font_size_of_character = 1.5
      let margin_of_character_line = font_size_of_character * 0.8
      let title_number = 5
      let margin_of_title  = (window.innerWidth - font_size_of_title * rem_px_ratio * title_number)/2/rem_px_ratio
      let character_counter = 0
      let delay_animation_point_2 = 1
      for(let i=0; i < (top_page_title+top_page_sentence+top_page_sentence_reserve).split('').length; i++){
        if(i < (top_page_title+top_page_sentence).split('').length){
          if(i<break_number_array[0]){
            top_page_elements.push(<span style={{left:((window.innerWidth - break_number_array[0] * rem_px_ratio * font_size_of_title)/2/rem_px_ratio + i * font_size_of_title) + "rem", top: "3rem", "transition-duration": delay_animation_point_2 + "s", "font-size": font_size_of_title+"rem"}} class={"top-page-character character-number-" + i + " animation-point-" + this.state.animation_point +  " line-number-" + line_number}>{(top_page_title+top_page_sentence+top_page_sentence_reserve)[i]}</span>)
          }else if(i<break_number_array[1]){
            top_page_elements.push(<span style={{left: ((window.innerWidth - (break_number_array[1]-break_number_array[0]) * rem_px_ratio * font_size_of_character)/2/rem_px_ratio + (i-break_number_array[0]) * font_size_of_character) + "rem", top: margin_of_character_line * 1 +8 + 1 +"rem", "transition-delay": (character_counter * 0.01 + i * 0.02) * 0.5+ "s"}} class={"top-page-character character-number-" + i + " animation-point-" + this.state.animation_point +  " line-number-" + line_number}>{(top_page_title+top_page_sentence+top_page_sentence_reserve)[i]}</span>)
          }else if(i<break_number_array[2]){
            top_page_elements.push(<span style={{left: ((window.innerWidth - (break_number_array[2]-break_number_array[1]) * rem_px_ratio * font_size_of_character)/2/rem_px_ratio + (i-break_number_array[1]) * font_size_of_character) + "rem", top: margin_of_character_line * 2 +8 + 2 +"rem"　}} class={"top-page-character character-number-" + i + " animation-point-" + this.state.animation_point +  " line-number-" + line_number}>{(top_page_title+top_page_sentence+top_page_sentence_reserve)[i]}</span>)
          }else if(i<break_number_array[3]){
            top_page_elements.push(<span style={{left: ((window.innerWidth - (break_number_array[3]-break_number_array[2]) * rem_px_ratio * font_size_of_character)/2/rem_px_ratio + (i-break_number_array[2]) * font_size_of_character) + "rem", top: margin_of_character_line * 3 +8 + 3 +"rem", "transition-delay": (character_counter * 0.01 + i * 0.02) * 0.5+ "s"}} class={"top-page-character character-number-" + i + " animation-point-" + this.state.animation_point +  " line-number-" + line_number}>{(top_page_title+top_page_sentence+top_page_sentence_reserve)[i]}</span>)
          }else if(i<break_number_array[4]){
            top_page_elements.push(<span style={{left: ((window.innerWidth - (break_number_array[4]-break_number_array[3]) * rem_px_ratio * font_size_of_character)/2/rem_px_ratio + (i-break_number_array[3]) * font_size_of_character) + "rem", top: margin_of_character_line * 4 +8 + 4 +"rem", "transition-delay": (character_counter * 0.01 + i * 0.02) * 0.5+ "s"}} class={"top-page-character character-number-" + i + " animation-point-" + this.state.animation_point +  " line-number-" + line_number}>{(top_page_title+top_page_sentence+top_page_sentence_reserve)[i]}</span>)
          }else if(i<break_number_array[5]){
            top_page_elements.push(<span style={{left: ((window.innerWidth - (break_number_array[5]-break_number_array[4]) * rem_px_ratio * font_size_of_character)/2/rem_px_ratio + (i-break_number_array[4]) * font_size_of_character) + "rem", top: margin_of_character_line * 5 +8 + 5 +"rem", "transition-delay": (character_counter * 0.01 + i * 0.02) * 0.5+ "s"}} class={"top-page-character character-number-" + i + " animation-point-" + this.state.animation_point +  " line-number-" + line_number}>{(top_page_title+top_page_sentence+top_page_sentence_reserve)[i]}</span>)
          }else if(i<break_number_array[6]){
            top_page_elements.push(<span style={{left: ((window.innerWidth - (break_number_array[6]-break_number_array[5]) * rem_px_ratio * font_size_of_character)/2/rem_px_ratio + (i-break_number_array[5]) * font_size_of_character) + "rem", top: margin_of_character_line * 6 +8 + 6 +"rem", "transition-delay": (character_counter * 0.01 + i * 0.02) * 0.5+ "s"}} class={"top-page-character character-number-" + i + " animation-point-" + this.state.animation_point +  " line-number-" + line_number}>{(top_page_title+top_page_sentence+top_page_sentence_reserve)[i]}</span>)
          }else if(i<break_number_array[7]){
            top_page_elements.push(<span style={{left: ((window.innerWidth - (break_number_array[7]-break_number_array[6]) * rem_px_ratio * font_size_of_character)/2/rem_px_ratio + (i-break_number_array[6]) * font_size_of_character) + "rem", top: margin_of_character_line * 7 +8 + 7 +"rem", "transition-delay": (character_counter * 0.01 + i * 0.02) * 0.5+ "s"}} class={"top-page-character character-number-" + i + " animation-point-" + this.state.animation_point +  " line-number-" + line_number}>{(top_page_title+top_page_sentence+top_page_sentence_reserve)[i]}</span>)
          }else if(i<break_number_array[8]){
            top_page_elements.push(<span style={{left: ((window.innerWidth - (break_number_array[8]-break_number_array[7]) * rem_px_ratio * font_size_of_character)/2/rem_px_ratio + (i-break_number_array[7]) * font_size_of_character) + "rem", top: margin_of_character_line * 8 +8 + 8 +"rem", "transition-delay": (character_counter * 0.01 + i * 0.02) * 0.5+ "s"}} class={"top-page-character character-number-" + i + " animation-point-" + this.state.animation_point +  " line-number-" + line_number}>{(top_page_title+top_page_sentence+top_page_sentence_reserve)[i]}</span>)
          }else if(i<break_number_array[9]){
            top_page_elements.push(<span style={{left: ((window.innerWidth - (break_number_array[9]-break_number_array[8]) * rem_px_ratio * font_size_of_character)/2/rem_px_ratio + (i-break_number_array[8]) * font_size_of_character ) + "rem", top: margin_of_character_line * 9 +8 + 9 +"rem", "transition-delay": (character_counter * 0.01 + i * 0.02) * 0.5+ "s"}} class={"top-page-character character-number-" + i + " animation-point-" + this.state.animation_point +  " line-number-" + line_number}>{(top_page_title+top_page_sentence+top_page_sentence_reserve)[i]}</span>)
          }
        }else{
          top_page_elements.push(<span style={{"font-size": 0, left: margin_of_title + (break_number_array[0]+0.2) * font_size_of_title + "rem", top: "4.8rem", "transition-duration": delay_animation_point_2 + "s","transition-delay": "0s", "transition-duration": "1.5s"}} class={"top-page-character character-number-" + i + " animation-point-" + this.state.animation_point +  " line-number-" + line_number + " hide-sentence"}>{(top_page_title+top_page_sentence+top_page_sentence_reserve)[i]}</span>)
        }
        if(limit_number_of_character<=1){
          i += (top_page_title+top_page_sentence+top_page_sentence_reserve).split('').length
        }
        character_counter += 1
        if(character_counter==limit_number_of_character){
          character_counter = 0
          line_number += 1
          limit_number_of_character -= 2
        }
      }

      login_signup_buttons = <div class="top-page-buttons" style={{"transition-duration": 3.5 + "s", opacity: 1}}>
                                  <button class="btn btn-primary top-page-singup-button" onClick={()=>this.openModal("signup")}>新規アカウント登録</button>
                                  <button class="btn btn-outline-success top-page-login-button" onClick={()=>this.openModal("login")}>ログイン</button>
                             </div>
    }


    let main_content;
    if (this.state.logged_in&&(!(this.state.logged_in===null))) {
        main_content = <div>
                          <div><GroupsList groups={this.state.group_list} current_user={this.state.current_user} logout={this.logout} is_logged_in = {this.state.logged_in} updateCurrentUser={this.updateCurrentUser} /></div>
                      </div>;
    } else {
      main_content = <div>
                        <div>
                            {top_page_elements}
                         </div>
                         {login_signup_buttons}
                        <Modal
                          isOpen={this.state.modalIsOpen}
                          onAfterOpen={this.afterOpenModal}
                          onRequestClose={this.closeModal}
                          style={customStyles}
                          contentLabel="Example Modal"
                        >
                          <div class="progress-bar" style={{ width: this.state.progress_percentage + "%"}}></div>
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

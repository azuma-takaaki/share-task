import React from "react"
import PropTypes from "prop-types"
import Modal from 'react-modal'
import Castle from "./Castle.jsx"
import UploadImageCanvas from "./UploadImageCanvas.jsx"
import TestImage from "images/tweet.png"

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
      input_name: '',
      castle_part_price_list: [],
      progress_percentage: "0"
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateData = this.updateData.bind(this);
    this.setCastlePartPriceList = this.setCastlePartPriceList.bind(this);
    this.logout = this.logout.bind(this);
    this.sleep = this.sleep.bind(this);

    this.setCastlePartPriceList()
  }


  setCastlePartPriceList(){
    let castle_part_price_list = []
    fetch("/get_castle_part_price_list",{
      method: 'GET'
      }).then(res => res.json())
      .then(
        (result) => {
          for(let i in result[0]){
            castle_part_price_list.push(result[0][i])
          }
          this.setState({
            castle_part_price_list: castle_part_price_list
          });
        }
      )
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

  updateData(type, image_data){
    this.setState({progress_percentage: "20"})
    let data;
    if(type=="update_user_name"){
      data = { user: {name:this.state.input_name}};
    }else if(type=="update_image"){
      data = { user: {update: "icon", image: image_data}};
    }

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
      .then((result) => {
          this.sleep(300).then(()=>{
            this.props.updateVisibleUser(result[0])
            this.setState({progress_percentage: "100"})
          }).then(()=>{
            this.sleep(1000).then(()=>{
              this.closeModal()
              this.setState({progress_percentage: "0"})
            })
          })
      })
  }

  sleep(waitSec) {
      return new Promise(function (resolve) {
          setTimeout(function() { resolve() }, waitSec);
      });
  }


  logout(){
    this.setState({progress_percentage: "20"})
    this.sleep(300).then(() =>{
      this.setState({progress_percentage: "100"})
      return this.sleep(1000)
    }).then(()=>{
      this.props.logout()
    })
  }

  render () {

    let castles;
    if(!(this.props.users_castle_list.length==0)){
      castles = this.props.users_castle_list.map((castle) => {
        //alert("User: " + castle["models"].length)
        return (
            <Castle castle={castle["castle"]} castle_id={castle["castle"]["castle_id"]} castle_name={castle["castle"]["castle_name"]} castle_models={castle["models"]} castle_reports={castle["reports"]} tag_class="castle_at_user_page" fetchCastles={this.props.fetchCastles} current_user_id={this.props.current_user.id}  castle_part_price_list = {this.state.castle_part_price_list} is_logged_in_user={this.props.is_logged_in_user} twitter_accounts={this.props.twitter_accounts}/>
        )
      })
    }else{
      castles = <h1 class = "massage-castle-is-empty">まだ城を持っていません</h1>
    }

    let edit_user_button = <div></div>
    if(this.props.is_logged_in_user){
      edit_user_button = <button class="btn btn-secondary edit-user-button" onClick={this.openModal}>⋯</button>
    }

    let icon_image;
    try{
      const image_src = location.href + "assets/user_icon/" +  this.props.current_user.icon
      icon_image = <img class = "user-icon" src={image_src} />
    }catch (e) {
      icon_image = <img class = "user-icon" src={require("../../../public/assets/user_icon/icon_0.png")} />
    }


    return (
      <div class="users-wrapper">
        <div class="users-header">¥
        {icon_image}
          <div class="users-page-header-name">{this.props.current_user.name}</div>
          {edit_user_button}
        </div>

        <div class="users-header-spacer"></div>

        {castles}


        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div class="progress-bar" style={{ width: this.state.progress_percentage + "%"}}></div>
          <h2>ユーザー情報編集</h2>
          <input type="text" class="form-control" value={this.state.input_name}  onChange={this.handleChange}/>
          <button class="btn btn-primary" onClick={()=>this.updateData("update_user_name")}>更新</button>
          <p></p>
          <UploadImageCanvas updateData={this.updateData}/>
          <button class="btn btn-secondary" onClick={this.logout}>ログアウト</button>
        </Modal>
      </div>
    );
  }
}

export default User

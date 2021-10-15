import React from "react"
import PropTypes from "prop-types"
import Modal from 'react-modal'
import Group from "./Group.jsx"
import User from "./User.jsx"
import Autosuggest from 'react-autosuggest';
import { push as Menu } from "react-burger-menu";


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





class GroupsList extends React.Component {
  constructor(props) {
    super(props);
    this.GroupRef = React.createRef();
    let arr_visible = []
    props.groups.map((group) => {

       arr_visible[group.id] = false
    })

    let users_castle_list = [];
    users_castle_list[this.props.current_user.id] = []

    let current_user_id = this.props.current_user.id
    let current_user = this.props.current_user

    this.state = {
      group_list: props.groups,
      group_is_visible: arr_visible,
      serched_group_is_visible: [],
      visible_user: current_user,
      visible_user_id: current_user_id,
      input_value: '',
      input_value_search_groups: '',
      menuOpen: false,
      relative_groups_list: [],
      value: '',
      progress_percentage: "0",
      suggestions: [],
      popular_group_list: [],
      error_messages: '',
      groups_castle_list: [],
      users_castle_list: users_castle_list,
      side_menu_icon_image_url: ""
    }
    this.getGroupList = this.getGroupList.bind(this);
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.postData = this.postData.bind(this);
    this.switchDisplay = this.switchDisplay.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.fetchRelativeGroup = this.fetchRelativeGroup.bind(this);
    this.handleChangeSearchGroups = this.handleChangeSearchGroups.bind(this);
    this.fetchCastles = this.fetchCastles.bind(this);
    this.sleep = this.sleep.bind(this);
    this.updateVisibleUser = this.updateVisibleUser.bind(this);
    this.reloadSideMenuIconImage = this.reloadSideMenuIconImage.bind(this);

  }

  componentDidMount(){
    this.reloadSideMenuIconImage()
    fetch("/get_popular_groups")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            suggestions: result[0],
            popular_group_list: result[0]
          });
        })
  }

  reloadSideMenuIconImage(){
    if(this.props.current_user.id!=undefined||this.props.current_user.id!=null){
      fetch("/icon_image/get_image_url?user_id=" + this.props.current_user.id  ,{
        method: 'GET'
      }).then(res => res.json())
        .then(
          (result) => {
            this.setState({
              side_menu_icon_image_url: result[0]
            });
          }
        )
    }
  }

  getGroupList() {
    let group_list = []
    fetch("/get_group_list",{
      method: 'GET'
      }).then(res => res.json())
      .then(
        (result) => {
          let new_visible_group = this.state.group_is_visible
          for(let i in result[0]){
            group_list.push(result[0][i])
            if(!(Object.keys(this.state.group_is_visible).includes(String(result[0][i]["id"])))){
              new_visible_group[result[0][i]["id"]] = false
            }
          }
          this.setState({group_is_visible: new_visible_group})
        }
      ).then(() =>{
        this.setState({
          group_list: group_list
        });
      })
  }
  openModal() {
    this.setState({modalIsOpen: true});
    this.setState({input_value: ""});
  }
  afterOpenModal() {
    this.subtitle.style.color = '#fff000';
  }
  closeModal() {
    this.setState({modalIsOpen: false});
    this.setState({error_messages: ''});
    this.setState({progress_percentage: "0"})
  }
  handleChange(e){
    this.setState({input_value: e.target.value});
  }
  handleChangeSearchGroups(e){
    this.setState({input_value_search_groups: e.target.value}, function() {
        const input_value = this.state.input_value_search_groups.trim().toLowerCase();
        const input_length = input_value.length;
        let new_suggestions = []
        if(!(input_length == 0)){
          for(let i in this.state.relative_groups_list){
            if(this.state.relative_groups_list[i].name.toLowerCase().slice(0, input_length) === input_value){
              new_suggestions.push(this.state.relative_groups_list[i])
            }
          }
        }else{
          new_suggestions = this.state.popular_group_list
        }
        this.setState({
          suggestions: new_suggestions
        })
        this.getGroupList()
        this.fetchRelativeGroup()
    });
  }

  sleep(waitSec) {
      return new Promise(function (resolve) {

          setTimeout(function() { resolve() }, waitSec);

      });
  }

  postData(){

    this.setState({progress_percentage: "20"})
    const data = { group: {name: this.state.input_value} };

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
      fetch("/groups", {
        method: 'POST', // or 'PUT'
        headers: {
                  'Content-Type': 'application/json',
                  'X-CSRF-Token': getCsrfToken()
        },
        body: JSON.stringify(data),
      }).then(res => res.json()).then((result) => {
        if(result[0] == "succeeded in creating a group"){
          this.sleep(300).then(()=>{
            this.setState({progress_percentage: "100"})
            return this.sleep(1000)
          }).then(()=>{
            this.setState({modalIsOpen: false});
            this.setState({input_value: ""});
            this.getGroupList()
            this.fetchRelativeGroup()
            this.closeModal()
          })
        }else if(result[0] == "failed to create a group"){
          this.setState({progress_percentage: "0"})
          let error_massages = []
          for(let i in result[1]){
            error_massages.push(result[1][i])
          }
          this.setState({
            error_messages: error_massages
          })
        }else{
        }
      })
  }
  switchDisplay(type, id){
    let new_visible_group = []
    Object.keys(this.state.group_is_visible).map((key) =>{
      new_visible_group[key] = false
    })

    if(type=="user"){
      this.setState({visible_user_id: id})
      this.setState({serched_group_is_visible: []})
      this.setState({group_is_visible: new_visible_group})
    }else if(type=="group"){
      if(Object.keys(this.state.group_is_visible).includes(String(id))){
        new_visible_group[id] = true
        this.setState({visible_user_id: -1})
        this.setState({group_is_visible: new_visible_group})
        this.setState({serched_group_is_visible: []})
      }else{
        let serched_group_array = [];
        serched_group_array[id] = true
        this.setState({serched_group_is_visible: serched_group_array})
        this.setState({group_is_visible: new_visible_group})
        this.setState({visible_user_id: -1})
      }
    }
  }
  toggleMenu () {
    this.getGroupList()
    this.fetchRelativeGroup()
    this.setState(state => ({menuOpen: !state.menuOpen}))
  }
  closeMenu () {
    this.setState(state => ({menuOpen: false}))
  }
  fetchRelativeGroup(){
    let groups_list = []
    fetch("/groups",{
      method: 'GET'
      }).then(res => res.json())
      .then(
        (result) => {
          groups_list = result[0]
        }
      ).then(()=>{
        this.setState({
          relative_groups_list: groups_list
        });
      })
  }
  fetchCastles(type, id, switchDisplay){
    if(type == "group"){
      let groups_castle_list = this.state.groups_castle_list
      fetch("get_group_castle_list/" + id, {
        method: 'GET'
      }).then(res => res.json())
        .then(
          (result) => {
            groups_castle_list[id] = result[0]
            this.setState({groups_castle_list: groups_castle_list})
          }
        ).then(()=>{
          this.switchDisplay(type, id)
        })
    }else if(type == "user"){
      let users_castle_list = this.state.users_castle_list
      fetch("get_user_castle_list/" + id, {
        method: 'GET'
        }).then(res => res.json())
        .then(
          (result) => {
            users_castle_list[id] = result[0]
            let visible_user = result[1]
            this.setState({visible_user: visible_user})
          }
        ).then(()=>{
          this.setState({users_castle_list: users_castle_list})
          if(switchDisplay){
            this.switchDisplay(type, id)
          }
        })
    }
  }

  updateVisibleUser(new_visible_user){
    this.setState({visible_user: new_visible_user})
    this.props.updateCurrentUser(new_visible_user)
  }











  render () {
    const inputProps = {
        placeholder: 'グループを探す',
        value: this.state.value,
        onChange: this.onChange
    };

    let error_flash_content;
    if(!(this.state.error_messages=='')){
      error_flash_content = <div class="alert alert-danger" id="error-flash">
                                { this.state.error_messages.map((error_message) => <li>{error_message}</li>)}
                            </div>
    }

    let searched_group_number = <div></div>;
    if(this.state.input_value_search_groups == ''){
      searched_group_number = <div class = "searched_group_number">人気のグループ</div>;
    }else{
      searched_group_number = <div class = "searched_group_number">検索結果: {this.state.suggestions.length}件</div>;
    }

    let icon_image;
    try{
      const image_src = location.href + "assets/user_icon/" +  this.props.current_user.icon
      icon_image = <img class = "user-icon" src={this.state.side_menu_icon_image_url} />
    }catch (e) {
      icon_image = <img class = "user-icon" src="assets/user_icon/icon_0.png" />
    }

    return (
      <div>
        <div class="all-group-area-wrapper" id="outer-container">

          <Menu
            isOpen={this.state.menuOpen}
            onClose={ this.closeMenu }
            class="side-menu"
            width={ '30%' }
            pageWrapId={ "page-wrap" }
            outerContainerId={ "outer-container" }
          >
            <div class="side-menu">
              <nav>
                <div class="nav nav-tabs" id="nav-tab" role="tablist">
                  <a class="nav-link active" id="nav-my-group-tab" data-bs-toggle="tab" href="#nav-my-group" role="tab" aria-controls="nav-my-group" aria-selected="true">マイグループ</a>
                  <a class="nav-link" id="nav-search-group-tab" data-bs-toggle="tab" href="#nav-search-group" role="tab" aria-controls="nav-search-group" aria-selected="false">グループを探す</a>
                </div>
              </nav>
              <div class="tab-content" id="nav-tabContent">
                <div class="tab-pane fade show active" id="nav-my-group" role="tabpanel" aria-labelledby="nav-my-group-tab">
                    <div class= "switch-group-button-list">
                      {this.state.group_list.map((group) => {
                        return (
                          <button class="switch-group-button" onClick={() => this.fetchCastles("group", group.id)}>{group.name}</button>
                        )
                      })}
                    </div>
                    <button  class = "btn btn-primary add-group-button" onClick={this.openModal}>＋group</button>

                </div>
                <div class="tab-pane fade" id="nav-search-group" role="tabpanel" aria-labelledby="nav-search-group-tab">
                    <input type="test" class="form-control search-window-at-side-menu" placeholder="グループを探す" value={this.state.input_value_search_groups} onChange={this.handleChangeSearchGroups}/>
                    {searched_group_number}
                    <div class= "result-serch-groups">
                      {this.state.suggestions.map((group) => {
                        return (
                          <button   class="switch-group-button" onClick={() => this.fetchCastles("group", group.id)}>{group.name}</button>
                        )
                      })}
                    </div>
                </div>
              </div>

              <button  class = "btn btn-primary side-menu-user-icon" onClick={() => this.fetchCastles("user", this.props.current_user.id, true)}>
                {icon_image}
                {this.props.current_user.name}
              </button>

            </div>
          </Menu>
          <main id="page-wrap">
            <div class="group-user-wrapper">
              {(() => {
                  if(this.state.menuOpen) {
                      return(<button class="btn side-menu-toggle active" onClick={this.toggleMenu}><span></span><span></span><span></span></button>);
                  } else {
                      return(<button class="btn side-menu-toggle " onClick={this.toggleMenu}><span></span><span></span><span></span></button>);
                  }
              })()}

              {(() => {
                  if(this.state.visible_user_id>0) {
                      let is_logged_in_user;
                      if(this.props.current_user.id == this.state.visible_user_id){
                        is_logged_in_user = true
                      }else{
                        is_logged_in_user = false
                      }
                      return(<User user_id={this.state.visible_user_id} logout={this.props.logout} current_user={this.state.visible_user} users_castle_list={this.state.users_castle_list[this.state.visible_user_id]} fetchCastles={this.fetchCastles} updateVisibleUser={this.updateVisibleUser} is_logged_in_user={is_logged_in_user} twitter_accounts={this.props.twitter_accounts} side_menu_icon_image_url={this.state.side_menu_icon_image_url} reloadSideMenuIconImage={this.reloadSideMenuIconImage}/>);
                  }
              })()}
              {
                this.state.group_list.map((group) => {
                  return (
                      <div>
                        {(this.state.group_is_visible[group.id] && this.state.visible_user_id<0)&& <Group group={group} ref={this.GroupRef} updateGroupList={() => this.getGroupList}  current_user={this.current_user} is_logged_in = {this.props.is_logged_in} castle_list={this.state.groups_castle_list[group.id]} fetchCastles={this.fetchCastles} current_user_id={this.props.current_user.id} /> }
                      </div>
                  )
                })
              }
              {
                this.state.suggestions.map((group) => {
                  return (
                    //<p class="users-group"><a href={"/groups/" + group.id }>{group.name}</a></p>
                      <div>
                        {(this.state.serched_group_is_visible[group.id])&& <Group group={group} ref={this.GroupRef} updateGroupList={() => this.getGroupList}  current_user={this.current_user} is_logged_in = {this.props.is_logged_in}  castle_list={this.state.groups_castle_list[group.id]} fetchCastles={this.fetchCastles} current_user_id={this.props.current_user.id} /> }
                      </div>
                  )
                })
              }


            </div>
          </main>
        </div>


        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div class="progress-bar" style={{ width: this.state.progress_percentage + "%"}}></div>
          {error_flash_content}
          <h2>新しいグループを作成</h2>
          <input type="text" class="form-control" placeholder="新しいグループの名前" value={this.state.input_value}  onChange={this.handleChange}/>
          <button class="btn btn-primary" onClick={this.postData}>グループを作成</button>
        </Modal>
      </div>
    );
  }

}


//return <a href={"/groups/" + {group.id}}>{group.name}</a>;
//reactに組み込まれた型指定方法で， 意図しない型の変数が入らないように指定している
GroupsList.propTypes = {
  groups: PropTypes.string
};

export default GroupsList

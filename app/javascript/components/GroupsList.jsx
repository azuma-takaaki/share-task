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
    var arr_visible = []
     props.groups.map((group) => {
       arr_visible[group.id] = false
     })
    this.state = {
      group_list: props.groups,
      group_is_visible: arr_visible,
      serched_group_is_visible: [],
      user_is_visible: true,
      input_value: '',
      input_value_search_groups: '',
      menuOpen: false,
      relative_groups_list: [],
      value: '',
      suggestions: [],
      error_messages: ''
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
    this.fetchRelativeGroup = this.fetchRelativeGroup.bind(this)
    this.handleChangeSearchGroups = this.handleChangeSearchGroups.bind(this)
  }

  getGroupList() {
    var group_list = []
    fetch("/get_group_list",{
      method: 'GET'
      }).then(res => res.json())
      .then(
        (result) => {
          for(var i in result[0]){
            group_list.push(result[0][i])
          }
        }
      ).then(() =>{
        this.setState({
          group_list: group_list
        });
      })
  }
  openModal() {
    this.setState({modalIsOpen: true});
  }
  afterOpenModal() {
    this.subtitle.style.color = '#fff000';
  }
  closeModal() {
    this.setState({modalIsOpen: false});
    this.setState({error_messages: ''});
  }
  handleChange(e){
    this.setState({input_value: e.target.value});
  }
  handleChangeSearchGroups(e){
    this.setState({input_value_search_groups: e.target.value}, function() {
        const input_value = this.state.input_value_search_groups.trim().toLowerCase();
        const input_length = input_value.length;
        var new_suggestions = []
        if(!(input_length == 0)){
          for(var i in this.state.relative_groups_list){
            if(this.state.relative_groups_list[i].name.toLowerCase().slice(0, input_length) === input_value){
              new_suggestions.push(this.state.relative_groups_list[i])
            }
          }
        }
        this.setState({
          suggestions: new_suggestions
        })
        this.getGroupList()
        this.fetchRelativeGroup()
    });
  }
  postData(){
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
          this.setState({modalIsOpen: false});
          this.setState({input_value: ""});
          closeModal()
        }else if(result[0] == "failed to create a group"){
          var error_massages = []
          for(var i in result[1]){
            error_massages.push(result[1][i])
          }
          this.setState({
            error_messages: error_massages
          })
        }else{
        }
      })
      this.getGroupList()
      this.fetchRelativeGroup()
  }
  switchDisplay(props){
    var new_visible_group = []
    Object.keys(this.state.group_is_visible).map((key) =>{
      new_visible_group[key] = false
    })
    if(props=="show_user"){
      this.setState({user_is_visible: true})
      this.setState({serched_group_is_visible: []})
      this.setState({group_is_visible: new_visible_group})
    }else if(Object.keys(this.state.group_is_visible).includes(String(props))){
      new_visible_group[props] = true
      this.setState({user_is_visible: false})
      this.setState({group_is_visible: new_visible_group})
      this.setState({serched_group_is_visible: []})
    }else{
      var serched_group_array = [];
      serched_group_array[props] = true
      this.setState({serched_group_is_visible: serched_group_array})
      this.setState({group_is_visible: new_visible_group})
      this.setState({user_is_visible: false})
    }
  }
  toggleMenu () {
    this.getGroupList()
    this.fetchRelativeGroup()
    this.setState(state => ({menuOpen: !state.menuOpen}))
    this.GroupRef.current.toggleMenu();
  }
  closeMenu () {
    this.setState(state => ({menuOpen: false}))
    this.GroupRef.current.closeMenu();
  }
  fetchRelativeGroup(){
    var groups_list = []
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











  render () {
    //auto suggest
    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
    placeholder: 'グループを探す',
        value,
        onChange: this.onChange
    };

    let error_flash_content;
    if(!(this.state.error_messages=='')){
      error_flash_content = <div class="alert alert-danger" id="error-flash">
                                { this.state.error_messages.map((error_message) => <li>{error_message}</li>)}
                            </div>
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
                  <a class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">マイグループ</a>
                  <a class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">グループを探す</a>
                </div>
              </nav>
              <div class="tab-content" id="nav-tabContent">
                <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                    <div class= "switch-group-button-list">
                      {this.state.group_list.map((group) => {
                        return (
                          <button   class="switch-group-button" onClick={() => this.switchDisplay(group.id)}>{group.name}</button>
                        )
                      })}
                    </div>
                    <button  class = "btn btn-primary add-group-button" onClick={this.openModal}>＋group</button>

                </div>
                <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                    <input type="test" placeholder="グループを探す" value={this.state.input_value_search_groups} onChange={this.handleChangeSearchGroups}/>
                    <div class= "result-serch-groups">
                      {this.state.suggestions.map((group) => {
                        return (
                          <button   class="switch-group-button" onClick={() => this.switchDisplay(group.id)}>{group.name}</button>
                        )
                      })}
                    </div>
                </div>
              </div>

              <button  class = "btn btn-primary side-menu-user-icon" onClick={() => this.switchDisplay("show_user")}>
                <img class = "user-icon" src={require("../../assets/images/default/" +  this.props.current_user.icon)} />
                {this.props.current_user.name}
              </button>

            </div>
          </Menu>
          <main id="page-wrap">
            <div class="group-wrapper">
              {(() => {
                  if(this.state.menuOpen) {
                      return(<button class="btn btn-info side-menu-toggle" onClick={this.toggleMenu}>＞</button>);
                  } else {
                      return(<button class="btn btn-info side-menu-toggle" onClick={this.toggleMenu}>＜</button>);
                  }
              })()}

              {(() => {
                  if(this.state.user_is_visible) {
                      return(<User logout={this.props.logout} current_user={this.props.current_user} getCurrentUser={this.props.getCurrentUser}/>);
                  }
              })()}
              {
                this.state.group_list.map((group) => {
                  return (
                    //<p class="users-group"><a href={"/groups/" + group.id }>{group.name}</a></p>
                      <div>
                        {(this.state.group_is_visible[group.id] && !this.state.user_is_visible)&& <Group group={group} ref={this.GroupRef} updateGroupList={() => this.getGroupList}  current_user={this.current_user}/> }
                      </div>
                  )
                })
              }
              {
                this.state.suggestions.map((group) => {
                  return (
                    //<p class="users-group"><a href={"/groups/" + group.id }>{group.name}</a></p>
                      <div>
                        {(this.state.serched_group_is_visible[group.id])&& <Group group={group} ref={this.GroupRef} updateGroupList={() => this.getGroupList}  current_user={this.current_user}/> }
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
          {error_flash_content}
          <h2>新しいグループを作成</h2>
          <input type="text" placeholder="新しいグループの名前" value={this.state.input_value}  onChange={this.handleChange}/>
          <button onClick={this.postData}>グループを作成</button>
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

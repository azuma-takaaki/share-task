import React from "react"
import PropTypes from "prop-types"
import Modal from 'react-modal'
import Task from "./Task.jsx"
import InputTaskModal from "./InputTaskModal.jsx"
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

class Group extends React.Component {
  constructor(props) {
    super(props);
    this.InputTaskModalRef = React.createRef();
    this.state = {
      group_name: props.group.name,
      group_id: props.group.id,
      group_members:[] ,
      other_users:[],
      group_tasks: [],
      input_value: '',
      modal_type: '',
      progress_percentage: "0"
    }
    this.getGroupInfo = this.getGroupInfo.bind(this);
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.deleteGroup = this.deleteGroup.bind(this);
    this.updateData = this.updateData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.removeUser = this.removeUser.bind(this);
    this.inviteUser = this.inviteUser.bind(this);
    this.openInputTaskModal = this.openInputTaskModal.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.createCastle = this.createCastle.bind(this);
    this.sleep = this.sleep.bind(this);
  }


  openModal(modal_type) {
    this.getUsers();
    this.setState({modal_type: modal_type});
    this.setState({modalIsOpen: true});
  }
  afterOpenModal() {
    this.subtitle.style.color = '#fff000';
  }
  closeModal() {
    this.setState({modalIsOpen: false});
    this.setState({input_value: ""});
  }
  deleteGroup(){
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
      fetch("/groups/" + this.state.group_id, {
        method: 'DELETE', // or 'PUT'
        headers: {
                  'Content-Type': 'application/json',
                  'X-CSRF-Token': getCsrfToken()
        },

      }).then(this.props.updateGroupList())
      this.props.updateGroupList()
      this.setState({input_value: ""});
      closeModal()
  }
  updateData(){
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

      const data = { group: {name:this.state.input_value}, id: this.state.group_id };

      fetch("/groups/" + this.state.group_id, {
        method: 'PATCH', // or 'PUT'
        headers: {
                  'Content-Type': 'application/json',
                  'X-CSRF-Token': getCsrfToken()
        },
        body: JSON.stringify(data),
      }).then(this.props.updateGroupList())
      this.setState({input_value: ""});
      this.props.updateGroupList()
      closeModal()
  }
  handleChange(e){
    this.setState({input_value: e.target.value});
  }
  getGroupInfo(id) {
    fetch("/groups/"+id,{
      method: 'GET'
      }).then(res => res.json())
      .then(
        (result) => {
          let user_list = []
          for(let i in result[0]){
            user_list.push(result[0][i])
          }
          this.setState({
            group_members: user_list
          });


          let task_list = []
          this.setState({
            group_tasks: task_list
          });
          for(let i in result[1]){
            task_list.push(result[1][i])
          }
          this.setState({
            group_tasks: task_list
          });


        }
      )
  }
  getUsers() {
    fetch("/all_user",{
      method: 'GET'
      }).then(res => res.json())
      .then(
        (result) => {
          let user_list = []
          for(let i in result[0]){
            user_list.push(result[0][i])
          }
          this.setState({
            other_users: user_list
          });
        }
      )
      this.props.updateGroupList()
  }
  inviteUser(user_id){
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
    const data = { group_id: this.state.group_id, user_id: user_id };

    fetch('/group_user',{
      method: 'POST',
      headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': getCsrfToken()
      },
      body: JSON.stringify(data)
    }).then(this.props.updateGroupList())
    this.props.updateGroupList()
    closeModal()
  }
  removeUser(user_id){
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
    const data = { group_id: this.state.group_id, user_id: user_id };

    fetch('/group_user?group_id='+this.state.group_id+'&user_id='+user_id,{
      method: 'DELETE',
      headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': getCsrfToken()
      },
      //body: JSON.stringify(data)
    }).then(this.props.updateGroupList())
    this.props.updateGroupList()
    closeModal()
  }
  openInputTaskModal() {
    this.InputTaskModalRef.current.openModal(); // this.ref名.currentで実体にアクセス
  }
  closeMenu() {
    this.setState(state => ({menuOpen: false}))
  }

  sleep(waitSec) {
      return new Promise(function (resolve) {
          setTimeout(function() { resolve() }, waitSec);
      });
  }

  createCastle() {
    this.setState({progress_percentage: "20"})
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
    const data = { castle: {name: this.state.input_value, group_id: this.state.group_id }};

    fetch('/castles',{
      method: 'POST',
      headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': getCsrfToken()
      },
      body: JSON.stringify(data)
    }).then(res => res.json()).then((result) => {
      this.sleep(300).then(() =>{
        this.setState({progress_percentage: "100"})
        this.sleep(1000).then(()=>{
          this.props.fetchCastles("group", this.props.group.id)
          this.closeModal()
          this.setState({progress_percentage: "0"})
        })
      })
    })
  }

  render () {
    let create_castle_or_task_button;
    if (this.props.is_logged_in) {
      create_castle_or_task_button = <button class="add-castle-button btn btn-primary" onClick={() => this.openModal("create_castle")}>城を建てる</button>
    } else {
      create_castle_or_task_button = <div class="add-task-button-wrapper">
                                      <button class="add-task-button"onClick={this.openInputTaskModal}>＋task</button>
                                    </div>
    }

    let modal_content;
    if(this.state.modal_type=="edit_group"){
      let group_name = this.props.group.name;
      this.setState({input_value: group_name});
      modal_content= <div class="react-modal">
                        <h2>グループを編集</h2>
                        <p></p>
                        <p>グループ名</p>
                        <input type="text" class="form-control" value={this.state.input_value}  onChange={this.handleChange}/>
                        <button class="btn btn-primary" onClick={this.updateData}>グループ名を変更する</button>
                        <p></p>
                        <p>グループメンバー</p>
                        {this.state.group_members.map((group_member)=>{
                          return(
                            <p>
                              <img class = "user-icon" src={require("../../assets/images/default/" + group_member.icon)} />
                              {group_member.name}
                              <button class="btn btn-danger" onClick = {() => this.removeUser(group_member.id)}>退会させる</button>
                            </p>
                          )
                        })}
                        <p></p>
                        <p>メンバーを招待する</p>

                        {this.state.other_users.map((user) => {
                          return (
                            <p>
                              <img class = "user-icon" src={require("../../assets/images/default/" + user.icon)} />
                              {user.name}<button class="btn btn-primary" onClick={() => this.inviteUser(user.id)}>招待する</button>
                            </p>
                          )
                        })}
                        <p></p>
                        <button class="btn btn-danger" onClick={this.deleteGroup}>このグループを削除する</button>
                      </div>
    }else if(this.state.modal_type=="create_castle"){
      modal_content= <div class="react-modal">
                        <div class="progress-bar" style={{ width: this.state.progress_percentage + "%"}}></div>
                        <h2>城を建てる</h2>
                        <p></p>
                        <p>城の名前</p>
                        <input type="text" class="form-control" value={this.state.input_value} placeholder="城の名前(目標)" onChange={this.handleChange}/>
                        <button class="btn btn-primary" class="btn btn-primary post-castle-data-button" onClick={this.createCastle}>城を建てる</button>
                      </div>
    }

    let castles;

    if(!(this.props.castle_list.length==0)){
      castles = this.props.castle_list.map((castle) => {
        return (
            <Castle castle_id={castle["castle"]["castle_id"]} castle_name={castle["castle"]["castle_name"]} castle_models={castle["models"]} castle={castle}user_id = {castle["user"]["user_id"]} user_name={castle["user"]["user_name"]} user_icon={castle["user"]["user_icon"]} tag_class="castle_at_group" fetchCastles={this.props.fetchCastles} group_id ={this.props.group.id}/>
        )
      })
    }else{
      castles = <h1 class = "massage-castle-is-empty">城を建ててください</h1>
    }


    return (
        <div class="group-wrapper">
          <div  class="group-header">
            <div class="group-name">{this.state.group_name}</div>
            <div class="group-members-list">
              {this.state.group_members.map((group_member) => {
                return (
                  <div class = "group-member">
                    <img class = "user-icon" src={require("../../assets/images/default/" + group_member.icon)} />
                    <div>{group_member.name}</div>
                  </div>
                )
              })}
            </div>

            {create_castle_or_task_button}
          </div>

          <div class="group-header-spacer"></div>

          <div>
            {castles}
          </div>

          <InputTaskModal ref={this.InputTaskModalRef} group_id={this.props.group.id} updateTasks={() => this.getGroupInfo(this.props.group.id)}/>

          <div class="task-wrapper">
            {this.state.group_tasks.map((task) => {
              return (
                  <Task id={task.id} content={task.content} updateTasks={() => this.getGroupInfo(this.props.group.id)}/>
              )
            })}
          </div>


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

    );
  }
}


export default Group

import React from "react"
import PropTypes from "prop-types"
import Modal from 'react-modal'
import Task from "./Task.jsx"
import InputTaskModal from "./InputTaskModal.jsx"

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
    this.state = {
      group_name: props.group.name,
      group_id: props.group.id,
      group_members:[] ,
      other_users:[],
      group_tasks: [],
      input_value: ''
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

    this.getGroupInfo(this.props.group.id)
  }

  openModal() {
    this.setState({modalIsOpen: true});
    var group_name = this.props.group.name
    this.setState({input_value: group_name});
    this.getUsers()
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
      this.setState({input_value: ""});
      this.props.updateGroupList()
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
          var user_list = []
          for(var i in result[0]){
            user_list.push(result[0][i])
          }
          this.setState({
            group_members: user_list
          });


          var task_list = []
          this.setState({
            group_tasks: task_list
          });
          for(var i in result[1]){
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
          var user_list = []
          for(var i in result[0]){
            user_list.push(result[0][i])
          }
          this.setState({
            other_users: user_list
          });
        }
      )
      this.props.updateGroupList()
      closeModal()
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




  render () {
    return (
        <div>
          <button onClick={ () => this.getGroupInfo(this.props.group.id)}>
            {this.state.group_name}
          </button>
          <button onClick={ () => this.openModal()}>
            グループを編集
          </button>
          {this.state.group_members.map((group_member) => {
            return (
                <a href="">{group_member.name}</a>
            )
          })}
          {this.state.group_tasks.map((task) => {
            return (
                <Task id={task.id} content={task.content} updateTasks={() => this.getGroupInfo(this.props.group.id)}/>
            )
          })}



          <InputTaskModal group_id={this.props.group.id} updateTasks={() => this.getGroupInfo(this.props.group.id)}/>
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <h2>グループを編集</h2>
            <p></p>
            <p>グループ名</p>
            <input type="text" value={this.state.input_value}  onChange={this.handleChange}/>
            <button onClick={this.updateData}>グループ名を変更する</button>
            <p></p>
            <p>グループメンバー</p>
            {this.state.group_members.map((group_member)=>{
              return(
                <p>
                  {group_member.name}
                  <button onClick = {() => this.removeUser(group_member.id)}>退会させる</button>
                </p>
              )
            })}
            <p></p>
            <p>メンバーを招待する</p>

            {this.state.other_users.map((user) => {
              return (
                <p>{user.name}<button onClick={() => this.inviteUser(user.id)}>招待する</button></p>
              )
            })}
            <p></p>
            <button onClick={this.deleteGroup}>このグループを削除する</button>
          </Modal>

        </div>

    );
  }
}


export default Group

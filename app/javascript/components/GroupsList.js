import React from "react"
import PropTypes from "prop-types"
import Modal from 'react-modal';


class GroupsList extends React.Component {
  constructor(props) {
    super(props);

  }

  render () {
    return (
      <React.Fragment>
        {this.props.groups.map((group) => {
          return (
            //<p class="users-group"><a href={"/groups/" + group.id }>{group.name}</a></p>
              <Group group={group}/>
          )
        })}
      </React.Fragment>
    );
  }

}

class Group extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group_members:[] ,
      group_tasks: []
    }
    this.getGroupInfo = this.getGroupInfo.bind(this);
    this.getGroupInfo(props.group.id)
  }


  render () {
    return (
        <div>
          <button onClick={ () => this.getGroupInfo(this.props.group.id)}>
            {this.props.group.name}
          </button>
          {this.state.group_members}
          {this.state.group_tasks.map((task) => {
            return (
                <Task id={task.id} content={task.content} updateTasks={() => this.getGroupInfo(this.props.group.id)}/>
            )
          })}
          <InputTaskModal group_id={this.props.group.id}/>
        </div>

    );
  }

  getGroupInfo(id) {
    fetch("/groups/"+id,{
      method: 'GET'
      }).then(res => res.json())
      .then(
        (result) => {
          var user_list = []
          for(var i in result[0]){
            user_list.push(<a href="">{result[0][i].name} </a>)
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
}


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


//任意のアプリを設定する　create-react-appなら#root
class InputTaskModal extends React.Component {
  constructor() {
    super();
    this.state = {
      modalIsOpen: false,
      input_value: ''
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.postData = this.postData.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  openModal() {
    this.setState({modalIsOpen: true});
  }
  afterOpenModal() {
    this.subtitle.style.color = '#fff000';
  }
  closeModal() {
    this.setState({modalIsOpen: false});
  }
  postData(){
    const data = { task: {content: this.state.input_value, group_id: this.props.group_id} };

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
      fetch("/tasks", {
        method: 'POST', // or 'PUT'
        headers: {
                  'Content-Type': 'application/json',
                  'X-CSRF-Token': getCsrfToken()
        },
        body: JSON.stringify(data),
      })
      this.setState({modalIsOpen: false});
      this.setState({input_value: ""});
  }

  handleChange(e){
    this.setState({input_value: e.target.value});
  }



  render() {
    return (
      <div>
        <button onClick={this.openModal}>新しいタスクを追加する</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h2>新しいタスクを追加</h2>
          <form onSubmit={this.postData}>
            <input type="text" value={this.state.input_value}  onChange={this.handleChange}/>
            <input type="submit" value="Submit" />
          </form>
        </Modal>
      </div>
    );
  }
}






class Task extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      content: props.content
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.deleteData = this.deleteData.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  openModal() {
    this.setState({modalIsOpen: true});
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

  handleChange(e){
    this.setState({input_value: e.target.value});
  }

  render(){
    return(
      <div id = {this.props.id}>
        <button onClick={this.openModal}>{this.state.content}</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h2>修正</h2>
          <form onSubmit={this.deleteData}>
            <input type="text" value={this.state.input_value}  onChange={this.handleChange}/>
            <input type="submit" value="DELETE" />
          </form>
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

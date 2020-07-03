import React, { Component } from 'react'
import { getUsers, lastUser } from "../../../utils/API"
import PageChanger from "../../shared/PageChanger"
import { Link } from "react-router-dom"

class Users extends Component {
  constructor(props) {
    super()
    this.state = {
      users: [],
      page_number: 1,
      last_user: null,
    }
  }

  async componentDidMount() {
    const users = await getUsers('none', 'none').then(res => res.data)
    const { data } = await lastUser()
    this.setState({ users: users, last_user: data })
  }

  async changePage(direction_reference_id, direction, page_increment) {
    const users = await getUsers(direction_reference_id, direction, this.state.status_filter).then(res => res.data)
    this.setState({ users, page_number: this.state.page_number + page_increment })
  }

  render() {
    let lastPossibleItem = false
    if (this.state.users.length > 0 && this.state.last_user) {
      if (this.state.users[this.state.users.length - 1]._id === this.state.last_user._id) {
        lastPossibleItem = true
      }
    }
    return (
      <div>
        {this.state.users.map((user) => {
          return (<div>
                  <Link to={`/admin/users/${user._id}`}>{user.first_name}</Link>
                </div>)
        })}

        <PageChanger 
          page_number={this.state.page_number} 
          list_items={this.state.users} 
          requestMore={this.changePage} 
          lastPossibleItem={lastPossibleItem} 
        />
      </div>
    )
  }
}

export default Users
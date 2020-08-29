import React, { Component } from 'react'
import { connect } from "react-redux"
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
    const users = await this.props.getUsers('none', 'none').then(res => res.data)
    const { data } = await this.props.lastUser()
    this.setState({ users: users, last_user: data })
  }

  async changePage(direction_reference_id, direction, page_increment) {
    const users = await this.props.getUsers(direction_reference_id, direction, this.state.status_filter).then(res => res.data)
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
      <div style={{ marginTop: "40px" }}>
        <h1 className="underline">Users</h1>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Joined On</th>
            </tr>
          </thead>
          <tbody>
            {this.state.users.map((user, index) => {
              return (
                      <tr className="theme-background-2 color-white">
                        <td key={index} className="padding-s border-radius-xs">
                          <Link to={`/admin/users/${user._id}`}>{user.email.substring(0,20)}{user.email.length > 20 && "..."}</Link>
                        </td>
                        <td key={index} className="padding-s border-radius-xs">
                          {user.joined_on && user.joined_on.split("T")[0]}
                        </td>
                      </tr>
                      )
              }
            )}
          </tbody>
        </table>


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

const actions = { getUsers, lastUser }

export default connect(null, actions)(Users)
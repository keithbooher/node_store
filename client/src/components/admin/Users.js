import React, { Component } from 'react'
import { getUsers, getUser } from "../../utils/API"

class Users extends Component {
  constructor(props) {
    super()
    this.state = {
      users: []
    }
  }

  async componentDidMount() {
    const users = await getUsers('none', 'none')
    this.setState({ users: users.data })
  }

  render() {
    console.log(this.state)
    return (
      <div>
        {this.state.users.map((user) => {
          return (<div>
                  {user.first_name}
                </div>)
        })}
      </div>
    )
  }
}

export default Users
import React, { Component } from 'react'
import { getUsers, lastUser } from "../../../utils/API"
import PageChanger from "../../shared/PageChanger"

class Users extends Component {
  constructor(props) {
    super()
    this.routeParamUserId = props.match.params.id

    this.state = {

    }
  }

  async componentDidMount() {
    console.log(this.routeParamUserId)
  }


  render() {
    return (
      <div>
        
      </div>
    )
  }
}

export default Users
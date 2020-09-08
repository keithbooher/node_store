import React, { Component } from 'react'
import { connect } from "react-redux"
import { getUsers, lastUser, getUserByEmail } from "../../../utils/API"
import PageChanger from "../../shared/PageChanger"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faSyncAlt } from "@fortawesome/free-solid-svg-icons"
import Form from "../../shared/Form"

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

  async handleSearchSubmit() {
    const search_for_user = this.props.form['user_search_form'].values && this.props.form['user_search_form'].values.search_bar

    let { data } = await this.props.getUserByEmail(search_for_user)

    this.setState({ users: [data], page_number: 1 })
  }


  render() {
    let lastPossibleItem = false
    if (this.state.users.length > 0 && this.state.last_user) {
      if (this.state.users[this.state.users.length - 1]._id === this.state.last_user._id) {
        lastPossibleItem = true
      }
    }
    let fontSize = "1em"
    if (!this.props.mobile) {
      fontSize = "20px"
    }
    let searchButton = document.getElementsByClassName("search_button")
    if (searchButton[0] && !this.props.mobile) {
      searchButton[0].style.marginTop = "27px"
    }
    return (
      <div style={{ marginTop: "40px", fontSize }}>
        <h1 className="underline">Users <Link className="inline margin-m-h" to="/admin/users" style={this.props.mobile ? { fontSize: "16px" } : { fontSize: "18px" }} onClick={this.getAllProducts} ><FontAwesomeIcon style={{ marginRight: "5px" }} icon={faSyncAlt} />All</Link></h1>
        <Form 
          onSubmit={(e) => this.handleSearchSubmit(e)}
          submitButtonText={<FontAwesomeIcon icon={faSearch} />}
          searchButton={true}
          formFields={[{ label: 'Search By Email', name: 'search_bar', noValueError: 'You must provide an email' }]}
          form='user_search_form'
        />
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
                          <Link className="hover-color-11" to={`/admin/users/${user._id}`}>{user.email.substring(0,20)}{user.email.length > 20 && "..."}</Link>
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

function mapStateToProps({ mobile, form }) {
  return { mobile, form }
}

const actions = { getUsers, lastUser, getUserByEmail }

export default connect(mapStateToProps, actions)(Users)
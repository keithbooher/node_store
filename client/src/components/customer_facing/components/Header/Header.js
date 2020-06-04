import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import NavAccount from './NavAccount'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import './header.scss'
import { sidebarBoolean } from "../../../../actions"


class Header extends Component {
  constructor(props) {
    super()
    this.sidebar = this.sidebar.bind(this)
    this.state = {

    }
  }
  sidebar() {
    this.props.sidebarBoolean(!this.props.sidebar)
  }
  render() {
    console.log(this.props)
    return (
    <div>
      <div className="flex space-between theme-nav-background-color">
        <div className="flex justify-center align-items-center">
          <FontAwesomeIcon onClick={this.sidebar} className="margin-s-h hover" data-noClose={false} icon={faBars} />
          <Link to='/' className="margin-s-h"><h2 className="margin-none">Node Store</h2></Link>
        </div>
        <ul className="flex" style={{ margin: '0px' }}>
          <NavAccount setCartCookie={this.props.setCartCookie} />
        </ul>
      </div>
    </div>
    )
  }
}


function mapStateToProps({ sidebar }) {
  return { sidebar }
}

const actions = { sidebarBoolean }

export default connect(mapStateToProps, actions)(Header)
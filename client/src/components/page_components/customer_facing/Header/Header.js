import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import NavAccount from './NavAccount'
import Cart from '../Cart'

class Header extends Component {
  render() {
    return (
    <nav>
      <div className="nav-wrapper">
        <Link to='/' className="left brand-logo">Node Store</Link>
        <ul id="nav-mobile" className="right">
          <NavAccount />
        </ul>
      </div>
    </nav>
    )
  }
}

export default Header
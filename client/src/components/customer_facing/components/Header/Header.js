import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import NavAccount from './NavAccount'
import './header.scss'

class Header extends Component {
  render() {
    return (
    <nav>
      <div className="flex" style={{ backgroundColor: "#6f6f6f", justifyContent: 'space-between' }}>
        <Link to='/' className=""><h2 className="">Node Store</h2></Link>
        <ul className="flex" style={{ margin: '0px' }}>
          <NavAccount />
        </ul>
      </div>
    </nav>
    )
  }
}

export default Header
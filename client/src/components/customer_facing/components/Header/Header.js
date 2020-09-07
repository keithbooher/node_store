import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import NavAccount from './NavAccount'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import './header.scss'
import { sidebarBoolean, showHeaderAction, showCartAction } from "../../../../actions"


class Header extends Component {
  constructor(props) {
    super()
    this.sidebar = this.sidebar.bind(this)
    this.scrollTracker = this.scrollTracker.bind(this)
    this.state = {
      offsetTop: 0,
      scrollClass: "top_of_page_nav"
    }
  }

  componentDidMount() {
    const self = this
    const root = document.getElementById("root")
    root.addEventListener('scroll', () => this.scrollTracker(self, root))
  }

  componentWillUnmount() {
    const self = this
    const root = document.getElementById("root")
    root.removeEventListener('scroll', () => this.scrollTracker(self, root))
  }

  scrollTracker(self, root) {
    let scrollClass
    let threshold = 50
    if (!this.props.mobile) {
      threshold = 70
    }
    if (root.scrollTop < threshold && self.state.offsetTop > root.scrollTop || root.scrollTop < threshold && self.state.offsetTop < root.scrollTop) {  
      // if getting really close to the top, assign relative positioning
      scrollClass = this.props.mobile ? "top_of_page_nav" : "top_of_page_nav_desktop"
    }else if (root.scrollTop >= threshold && self.state.offsetTop < root.scrollTop) {
      // hide nav if scrolling down
      // but only after its left the screen
      // fixed position top: -50px
      scrollClass = this.props.mobile ? "scrolling_down_nav" : "scrolling_down_nav_desktop"
      if (this.props.showCart) {
        this.props.showCartAction(false)
      }
    } else if (self.state.offsetTop > root.scrollTop) {
      // show nav if scrolling up
      // fixed position top: 0
      scrollClass = this.props.mobile ? "scrolling_up_nav" : "scrolling_up_nav_desktop"
    } else {
      // apply regular stylings
      scrollClass = this.props.mobile ? "scrolling_up_nav" : "scrolling_up_nav_desktop"
    }
    self.setState({ offsetTop: root.scrollTop })
    this.props.showHeaderAction(scrollClass)
  }

  sidebar() {
    this.props.sidebarBoolean(!this.props.sidebar)
    this.props.showCartAction(false)
  }
  render() {
    return (
    <div className={`${this.props.showHeader} ${this.props.mobile ? "nav" : "desktop_nav" } header_container`}>
      <div className="header_container flex space-between align-items-center theme-background-3 h-100" style={{ minHeight: "50px" }}>
        <div className="header_container flex justify-center align-items-center">
          <FontAwesomeIcon style={ this.props.mobile ? {} : { fontSize: "27px" } } id="sidebar_bars" onClick={this.sidebar} className="margin-s-h hover hover-color-2" icon={faBars} />
          <Link to='/' className="margin-s-h"><h2 style={ this.props.mobile ? {} : { fontSize: "35px" } } className="margin-none">Node Store</h2></Link>
        </div>
        <ul className="flex" style={{ margin: '0px' }}>
          <NavAccount />
        </ul>
      </div>
    </div>
    )
  }
}


function mapStateToProps({ sidebar, showCart, showHeader, mobile }) {
  return { sidebar, showCart, showHeader, mobile }
}

const actions = { sidebarBoolean, showHeaderAction, showCartAction }

export default connect(mapStateToProps, actions)(Header)
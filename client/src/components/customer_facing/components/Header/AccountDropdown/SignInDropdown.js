import React, { Component } from 'react' 
import { connect } from 'react-redux'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faCaretDown } from "@fortawesome/free-solid-svg-icons"
import { showCartAction } from "../../../../../actions"
import "./dropdown.css.scss"

class SignInDropdown extends Component {
  constructor(props) {
    super()
    this.dropRef = React.createRef()
    this.userIconRef = React.createRef()
    this.caratDownRef = React.createRef()

    this.handleClickOutside = this.handleClickOutside.bind(this);

    this.showAccountMenu = this.showAccountMenu.bind(this)
    this.state = {
      open: false
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside(event) {
    const refs = [this.dropRef.current, this.userIconRef.current, this.caratDownRef.current]
    if(refs.includes(event.target) || event.target.tagName === "svg" || event.target.tagName === "path") {
      return
    } else if (this.state.open === true && !this.node.contains(event.target)) {
      this.showAccountMenu()
    }
  }
  
  showAccountMenu() {
    this.props.showCartAction(false)    
    this.setState({ open: !this.state.open })
  }

  render() {
    return (
      <div className="relative" style={{ zIndex: "20" }}>
        <a 
          ref={this.dropRef} 
          onClick={this.showAccountMenu} 
          className="header_list_item flex hover-color-7" 
          style={this.props.mobile ? {} : { fontSize: "25px" }}
        >
          <div style={{ marginRight: "5px" }} ref={this.userIconRef}><FontAwesomeIcon icon={faUser} /></div>
          <div ref={this.caratDownRef}><FontAwesomeIcon icon={faCaretDown} /></div>
        </a>
        {this.state.open === true && 
          <div ref={node => this.node = node} id="cart_container" className="border-radius-bottom st-nav-dropdown-background-color color-white hover-color-7">
            <ul className="text-align-center" style={this.props.mobile ? { minWidth: "180px" } : { minWidth: "270px" }}>
              <li style={this.props.mobile ? {} : { fontSize: "23px" }} className="padding-s account_dropdown_item"><a href="/auth/google">Sign in with Google</a></li>
              <li style={this.props.mobile ? {} : { fontSize: "23px" }} className="padding-s account_dropdown_item"><a href="/auth/facebook">Sign in with Facebook</a></li>
            </ul>
          </div>
        }


      </div>
    )
  }
}

function mapStateToProps({ mobile }) {
  return { mobile }
}

const actions = { showCartAction }

export default connect(mapStateToProps, actions)(SignInDropdown)


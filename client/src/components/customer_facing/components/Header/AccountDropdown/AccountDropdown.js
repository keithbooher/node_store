import React, { Component } from 'react' 
import { connect } from 'react-redux'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faCaretDown } from "@fortawesome/free-solid-svg-icons"
import { showCartAction } from "../../../../../actions"
import "./dropdown.css.scss"

class AccountDropdown extends Component {
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
      <div className="relative">
        <a 
          ref={this.dropRef} 
          onClick={this.showAccountMenu} 
          className="header_list_item flex" 
          style={this.props.mobile ? {} : { fontSize: "25px" }}
        >
          <div className="margin-xs-h" ref={this.userIconRef}><FontAwesomeIcon icon={faUser} /></div>
          <div ref={this.caratDownRef}><FontAwesomeIcon icon={faCaretDown} /></div>
        </a>
        {this.state.open === true && 
          <div ref={node => this.node = node} id="cart_container" className="border-radius-bottom st-nav-dropdown-background-color color-white">
            <ul style={this.props.mobile ? { minWidth: "180px" } : { minWidth: "270px" }}>
              {this.props.elements.map((element, index) => {
                return <li className="account_dropdown_item" style={this.props.mobile ? {} : { fontSize: "20px" }} key={index} onClick={() => this.setState({ open: !this.state.open })}>{element}</li>
              })}
            </ul>
          </div>
        }


      </div>
    )
  }
}

function mapStateToProps({ showCart, mobile }) {
  return { showCart, mobile }
}

const actions = { showCartAction }

export default connect(mapStateToProps, actions)(AccountDropdown)


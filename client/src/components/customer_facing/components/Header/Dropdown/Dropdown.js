import React, { Component } from 'react' 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faCaretDown } from "@fortawesome/free-solid-svg-icons"
import "./dropdown.css.scss"

class Dropdown extends Component {
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
    this.setState({ open: !this.state.open })
  }

  render() {
    return (
      <div className="relative">
        <a ref={this.dropRef} onClick={this.showAccountMenu} className="header_list_item flex">
          <div className="margin-xs-h" ref={this.userIconRef}><FontAwesomeIcon icon={faUser} /></div>
          <div ref={this.caratDownRef}><FontAwesomeIcon icon={faCaretDown} /></div>
        </a>
        {this.state.open === true && 
          <div ref={node => this.node = node} id="cart_container" className="background-color-blue-2 color-white">
            <ul>
              {this.props.elements.map((element, index) => {
                return <li key={index} onClick={() => this.setState({ open: !this.state.open })}>{element}</li>
              })}
            </ul>
          </div>
        }


      </div>
    )
  }
}

export default Dropdown


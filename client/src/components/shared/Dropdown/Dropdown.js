import React, { Component } from 'react' 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser } from "@fortawesome/free-solid-svg-icons"
import { Link } from 'react-router-dom'
import "./dropdown.css.scss"

class Dropdown extends Component {
  constructor(props) {
    super()
    this.setWrapperRef = this.setWrapperRef.bind(this);
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

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.showAccountMenu()
    }
  }
  
  showAccountMenu() {
    this.setState({ open: !this.state.open })
  }

  render() {
    return (
      <div className="relative">
        <Link className="header_list_item">
          <FontAwesomeIcon onClick={this.showAccountMenu} icon={faUser} />
        </Link>
        {this.state.open === true && 
          <div ref={this.setWrapperRef} id="cart_container" className="background-color-blue-2 color-white">
            <ul>
              {this.props.elements.map((element) => {
                return <li onClick={() => this.setState({ open: !this.state.open })}>{element}</li>
              })}
            </ul>
          </div>
        }


      </div>
    )
  }
}

export default Dropdown


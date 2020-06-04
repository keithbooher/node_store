import React, { Component } from 'react'
import { connect } from 'react-redux'
import { sidebarBoolean } from "../../../../actions"
import "./sidebar.scss"

class Sidebar extends Component  {
  constructor(props) {
    super()
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    // find all categories that have been selected to be shown to the customers
    //
    //
    //
    
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside(e) {
    if (this.props.sidebar === true && !this.node.contains(e.target)) {
      this.props.sidebarBoolean(!this.props.sidebar)
    }
  }
  
  render() {
    let sidebar_class
    switch (this.props.sidebar) {
      case true:
        sidebar_class = "sidebar_open"
        break;
    
      case false:
        sidebar_class = "sidebar_close"        
        break;
    
      default:
        sidebar_class = ""
        break;
    }

    return (
      <>
        <div ref={node => this.node = node} className={"sidebar " + sidebar_class}>
          <div style={{ color: "black" }}>
            Sidebar
          </div>
        </div>
      </>
    )
  }
}



function mapStateToProps({ sidebar }) {
  return { sidebar }
}

const actions = { sidebarBoolean }

export default connect(mapStateToProps, actions)(Sidebar)
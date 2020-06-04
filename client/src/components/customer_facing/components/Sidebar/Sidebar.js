import React, { Component } from 'react'
import { connect } from 'react-redux'
import { sidebarBoolean } from "../../../../actions"
import "./sidebar.scss"

class Sidebar extends Component  {
  constructor(props) {
    super()
    this.state = {

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
        <div className={"sidebar " + sidebar_class}>
          <div style={{ marginTop: "100px" }}>
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
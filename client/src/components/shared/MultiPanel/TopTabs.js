import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { capitalizeFirsts } from "../../../utils/helperFunctions"

class TopTabs extends Component  {
  constructor(props) {
    super()
    this.state = {

    }
  }

  renderTabs() {
    return this.props.sections.map((section) => {
      return <NavLink style={{ flexBasis: "25%", textAlign: "center", textDecoration: "underline" }} activeClassName="color-white" exact to={section.path}><h3 data-tab={section} className="tab_section_header margin-none clickable">{capitalizeFirsts(section.tab)}</h3></NavLink>
    })
  }

  
  render() {
    let bg_style = {
      backgroundColor: '#212121'
    }

    return (
      <div style={bg_style} className="flex space-evenly">
        {this.renderTabs()}
      </div>
    )
  }
}

export default TopTabs
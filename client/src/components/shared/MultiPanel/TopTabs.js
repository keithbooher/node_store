import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { capitalizeFirsts } from "../../../utils/helpFunctions"

class TopTabs extends Component  {
  constructor(props) {
    super()
    this.state = {

    }
  }

  renderTabs() {
    let mobileFontSize = '1em'
    if (!this.props.mobile) {
      mobileFontSize = '30px'
    }
    return this.props.sections.map((section, index) => {
      return <NavLink className="" key={index} style={{ fontSize: mobileFontSize, flexBasis: "25%", textAlign: "center", textDecoration: "underline" }} activeClassName="color-white" exact to={section.path}>
                <h3 data-tab={section} className="tab_section_header margin-none hover-color-5">
                  {capitalizeFirsts(section.tab)}
                </h3>
              </NavLink>
    })
  }

  
  render() {

    return (
      <div className="flex space-evenly theme-background-3 padding-s border-radius-s">
        {this.renderTabs()}
      </div>
    )
  }
}


function mapStateToProps({ mobile }) {
  return { mobile }
}

export default connect(mapStateToProps, null)(TopTabs)
import React, { Component } from 'react'
import { capitalizeFirsts } from "../../../utils/helperFunctions"

class TopTabs extends Component  {
  constructor(props) {
    super()
    this.state = {

    }
  }

  renderTabs() {
    return this.props.sections.map((section) => {
      let style = {
        color: section === this.props.chosenTab ?  '#6CB2EB' : 'white',
        backgroundColor: section === this.props.chosenTab ?  'rgb(45,45,45)' : 'rgb(33,33,33)',
        flexBasis: `${100*(1/this.props.sections.length)}%`,
        textAlign: 'center'
      }
      return <h3 data-tab={section} style={style} onClick={() => this.props.chooseTab(section)} className="tab_section_header margin-none clickable">{capitalizeFirsts(section)}</h3>
    })
  }

  
  render() {
    let tabs_container_style = {
      display: 'flex',
      justifyContent: 'space-evenly',
      backgroundColor: '#212121'
    }

    return (
      <div style={ tabs_container_style }>
        {this.renderTabs()}
      </div>
    )
  }
}

export default TopTabs
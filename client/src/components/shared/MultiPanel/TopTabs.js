import React, { Component } from 'react'

class TopTabs extends Component  {
  constructor(props) {
    super()
    this.state = {

    }
  }

  renderTabs() {
    return this.props.sections.map((section) => {
      let style = {
        color: section === this.props.chosenTab ?  'red' : 'black'
      }
      return <h3 data-tab={section} style={style} onClick={() => this.props.chooseTab(section)} className="tab_section_header">{section}</h3>
    })
  }

  
  render() {
    let tabs_container_style = {
      display: 'flex',
      justifyContent: 'space-evenly'
    }

    return (
      <div style={ tabs_container_style }>
        {this.renderTabs()}
      </div>
    )
  }
}

export default TopTabs
import React, { Component } from 'react'
import TopTabs from './TopTabs'
import Panel from './Panel'

// Create a method of passing in the components that you want to the panel series


class MultiStepPanel extends Component  {
  constructor(props) {
    super()
    let sections = props.sections
    this.state = {}
  }

  
  render() {
    return (
      <div id="">
        <TopTabs chosenTab={this.props.chosen_tab} chooseTab={this.props.chooseTab} sections={this.props.sections} />
        {/* Throw in your own components and component logic */}
        {this.props.children}
      </div>
    )
  }
}

export default MultiStepPanel
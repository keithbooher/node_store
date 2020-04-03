import React, { Component } from 'react'
import TopTabs from './TopTabs'
import Panel from './Panel'

// Create a method of passing in the components that you want to the panel series


class MultiStepPanel extends Component  {
  constructor(props) {
    super()
    this.chooseTab = this.chooseTab.bind(this)
    this.state = {
      chosen_tab: props.chosen_tab
    }
  }

  chooseTab(tab_of_choice) {
    this.setState({ chosen_tab: tab_of_choice })
    this.props.chooseTab(tab_of_choice)
  }
  
  render() {
    return (
      <div id="">
        <TopTabs chosenTab={this.state.chosen_tab} chooseTab={this.chooseTab} sections={this.props.sections} />
        {/* Throw in your own components and component logic */}
        {this.props.children}
      </div>
    )
  }
}

export default MultiStepPanel
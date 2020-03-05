import React, { Component } from 'react'
import TopTabs from './TopTabs'
import Panel from './Panel'

// Create a method of passing in the components that you want to the panel series


class MultiStepPanel extends Component  {
  constructor(props) {
    super()
    let sections = props.sections
    this.state = {
      chosen_tab: sections[0]
    }
  }

  chooseTab(tab_of_choice) {
    console.log(tab_of_choice)
    this.setState({ chosen_tab: tab_of_choice })
  }

  
  render() {
    return (
      <div id="">
        <TopTabs chooseTab={this.chooseTab.bind(this)} chosenTab={this.state.chosen_tab} sections={this.props.sections} />
        <Panel sections={this.props.sections} chosenTab={this.state.chosen_tab} />
      </div>
    )
  }
}

export default MultiStepPanel
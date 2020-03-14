import React, { Component } from 'react'
import { connect } from 'react-redux'
import MultiPanel from '../../../page_components/shared/MultiPanel/MultiPanel'

class Account extends Component  {
  constructor(props) {
    super()
    this.chooseTab = this.chooseTab.bind(this)
    this.state = {
      chosen_tab: "details"
    }
  }


  chooseTab(tab_of_choice) {
    console.log(tab_of_choice)
    this.setState({ chosen_tab: tab_of_choice })
  }

  
  render() {
    console.log(this.state)
    const sections = ["details", "address", "other"]
    return (
      <div>
        <h1 style={{ textAlign: 'center' }}>Account</h1>
        <MultiPanel chosen_tab={this.state.chosen_tab} chooseTab={this.chooseTab} sections={sections}>
          <div>
            {this.state.chosen_tab === 'details' ? <div>details panel</div> : ""}
            {this.state.chosen_tab === 'address' ? <div>address panel</div> : ""}
            {this.state.chosen_tab === 'other' ? <div>other panel</div> : ""}
          </div>
        </MultiPanel>
      </div>
    )
  }
}


function mapStateToProps({ auth }) {
  return { auth }
}

export default connect(mapStateToProps, null)(Account)
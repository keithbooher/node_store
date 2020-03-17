import React, { Component } from 'react'
import { connect } from 'react-redux'
import MultiPanel from '../../../page_components/shared/MultiPanel/MultiPanel'
import Details from '../../../page_components/front_end/Account/Details'
import Addresses from '../../../page_components/front_end/Account/Addresses'
import Orders from '../../../page_components/front_end/Account/Orders'
import Reviews from '../../../page_components/front_end/Account/Reviews'
import loadingGif from '../../../../images/pizzaLoading.gif'

class Account extends Component  {
  constructor(props) {
    super()
    this.chooseTab = this.chooseTab.bind(this)
    this.state = {
      chosen_tab: "details"
    }
  }


  chooseTab(tab_of_choice) {
    this.setState({ chosen_tab: tab_of_choice })
  }

  
  render() {
    const sections = ["details", "addresses", "orders", "reviews"]
    return (
      <div>
        <h1 style={{ textAlign: 'center' }}>Account</h1>
        {this.props.auth ? 
          <MultiPanel chosen_tab={this.state.chosen_tab} chooseTab={this.chooseTab} sections={sections}>
            <div>
              {this.state.chosen_tab === 'details' ? <Details auth={this.props.auth} /> : ""}
              {this.state.chosen_tab === 'addresses' ? <Addresses /> : ""}
              {this.state.chosen_tab === 'orders' ? <Orders /> : ""}
              {this.state.chosen_tab === 'reviews' ? <Reviews /> : ""}
            </div>
          </MultiPanel>
        : 
          <img className="loadingGif loadingGifCenterScreen" src={loadingGif} />
        }

      </div>
    )
  }
}


function mapStateToProps({ auth }) {
  return { auth }
}

export default connect(mapStateToProps, null)(Account)
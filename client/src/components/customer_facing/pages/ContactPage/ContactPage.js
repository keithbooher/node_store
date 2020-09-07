import React, { Component } from 'react'
import { connect } from 'react-redux'

class ContactPage extends Component {
  constructor(props) {
    super()
    this.state = {

    }
  }


  render() {
    let containerStyle = {
      padding: ".4em .4em 80px .4em"
    }

    if (!this.props.mobile) {
      containerStyle.width = "80%"
      containerStyle.margin = "0px auto"
      containerStyle.fontSize = "20px"
    }
    return (
      <div style={ containerStyle } className={`${!this.props.mobile && "max-customer-container-width margin-auto-h"}`}>
        <h1>Contact</h1>
        <div className='margin-s-v'>If you have any questions or concerns about please feel free to email <a className="inline" href="mailto:keith.booher@yaoho.com">_______@_____.com</a></div>
        <div className='margin-s-v'>If you notice something is wrong or broken with the site reach out to <a className="inline" href="mailto:keith.booher@yaoho.com">_______@_____.com</a> </div>
      </div>
    )
  }
}

function mapStateToProps({ mobile }) {
  return { mobile }
}

// const actions = { updateUser, dispatchObj }

export default connect(mapStateToProps, null)(ContactPage)
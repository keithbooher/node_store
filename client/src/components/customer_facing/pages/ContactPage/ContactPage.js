import React, { Component } from 'react'
import { connect } from 'react-redux'

class ContactPage extends Component {
  constructor(props) {
    super()
    this.state = {

    }
  }


  render() {

    return (
      <div style={this.props.mobile ? {} : { fontSize: "20px" }}>
        <h1>Contact</h1>
        <div>If you have any questions or concerns please feel free to email <a className="inline" href="mailto:keith.booher@yaoho.com">_______@_____.com</a></div>
      </div>
    )
  }
}

function mapStateToProps({ mobile }) {
  return { mobile }
}

// const actions = { updateUser, dispatchObj }

export default connect(mapStateToProps, null)(ContactPage)
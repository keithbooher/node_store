import React, { Component } from 'react'
import { connect } from 'react-redux'
import { errorAction } from "../../../actions"
import "./error.scss"

class Error extends Component  {
  constructor(props) {
    super()
    this.state = {
    }
  }


  render() {
    if(this.props.error) {
      const self = this
      setTimeout(function(){ self.props.errorAction(null) }, 6000);
    }
    return (
      <div className={`fixed radius-xs background-color-red-4 padding-s ${ !this.props.error ? "opacity-0 z-hide" : "fade-out" }`} style={{ bottom: "5px", left: "5px" }}>
        <h3>{this.props.error && this.props.error.data.message}</h3>
      </div>
    )
  }
}

function mapStateToProps({ error }) {
  return { error }
}

const actions = { errorAction }

export default connect(mapStateToProps, actions)(Error)
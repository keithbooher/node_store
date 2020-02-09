import React, { Component } from 'react'
import { connect } from 'react-redux'
import { allProducts } from '../actions'

class Landing extends Component  {
  constructor({ subject, recipients }, content) {
    super()
    this.state = {
      products: []
    }
  }
  componentWillMount() {
    console.log(this.props.allProducts())
  }

  
  render() {
    return (
      <div>
        <h1>
          Node Store
        </h1>
        Collect Feedback from your users
      </div>
    )
  }
}


function mapStateToProps({ product }) {
  return { product }
}

export default connect(mapStateToProps, {allProducts})(Landing)
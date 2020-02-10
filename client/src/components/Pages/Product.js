import React, { Component } from 'react'
import { connect } from 'react-redux'
import { allProducts } from '../../actions'
import API from "../../utils/API";

class Product extends Component  {
  constructor({ subject, recipients }, content) {
    super()
    this.state = {}
  }
  componentWillMount() {
    
  }
  
  render() {
    return (
      <div>
        <h1>
          Product Page
        </h1>
      </div>
    )
  }
}


function mapStateToProps({ products }) {
  return { products }
}

export default connect(mapStateToProps, {allProducts})(Product)
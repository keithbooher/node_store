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
    // There is an API file that exports a module with functions that contain API calls for use
    API.getCategoryProducts('test_category').then((res) => {
      console.log(res.data)
    })
  }
  
  render() {
    return (
      <div>
        <h1>
          Category Page
        </h1>
      </div>
    )
  }
}


function mapStateToProps({ products }) {
  return { products }
}

export default connect(mapStateToProps, {allProducts})(Product)
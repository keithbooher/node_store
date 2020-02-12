import React, { Component } from 'react'
import { connect } from 'react-redux'
import API from "../../utils/API";

class Product extends Component  {
  constructor(props) {
    super()
    this.state = {}
  }
  componentWillMount() {
    API.getProductInfo('test_product').then((res) => {
      console.log(res.data)
    })
  }
  
  render() {
    console.log(this.props)
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

export default connect(mapStateToProps, null)(Product)
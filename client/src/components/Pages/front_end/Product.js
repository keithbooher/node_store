import React, { Component } from 'react'
import { connect } from 'react-redux'
import API from "../../../utils/API";
import { Link } from 'react-router-dom'
import hf from '../../../utils/HelperFunctions'

class Product extends Component  {
  constructor(props) {
    super()
    this.state = {
        product: {category: {
          category_path_name: "",
          category_name:""
        }}
      }
  }
  componentWillMount() {
    // OR WOULD IT BE FASTER TO FILTER THROUGH THE 'IN STOCK PRODUCTS' THAT RESIDE IN THE STORE STATE?
    API.getProductInfo('test_product').then((res) => {
      this.setState({ product: res.data })
    })
  }

  render_content() {
    let category = this.state.product.category
    return (
      <div>
        <div>Back to <Link to={`/shop/${category.category_path_name}`}>{hf.capitalizeFirsts(category.category_name)}</Link></div>
        <h1>
          Product Page
        </h1>
      </div>
    )
  }
  
  render() {
    return (
      <div>
        {this.render_content()}
      </div>
    )
  }
}


function mapStateToProps({ products }) {
  return { products }
}

export default connect(mapStateToProps, null)(Product)
import React, { Component } from 'react'
import { connect } from 'react-redux'
import API from "../../../utils/API";
import { Link } from 'react-router-dom'
import hf from '../../../utils/HelperFunctions'

class Product extends Component  {
  constructor(props) {
    super()
    this.routeParamCategory = props.match.params.category
    this.routeParamProduct = props.match.params.product
    this.state = {
        product: {}
    }
  }
  componentWillMount() {
    // OR WOULD IT BE FASTER TO FILTER THROUGH THE 'IN STOCK PRODUCTS' THAT RESIDE IN THE STORE STATE?
    API.getProductInfo(this.routeParamProduct).then((res) => {
      console.log(res.data)
      this.setState({ product: res.data })
    })
  }

  render_content() {
    let category = this.state.product.category
    return (
      <div>
        <div>Back to <Link to={`/shop/${this.routeParamCategory}`}>{hf.capitalizeFirsts(category[0].category_name)}</Link></div>
        <h1>
          Product Page
        </h1>
      </div>
    )
  }
  
  render() {
    return (
      <div>
        {Object.keys(this.state.product).length > 0 ? this.render_content() : ""}
      </div>
    )
  }
}


function mapStateToProps({ products }) {
  return { products }
}

export default connect(mapStateToProps, null)(Product)
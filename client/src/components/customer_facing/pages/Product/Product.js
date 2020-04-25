import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getProductInfo,  } from "../../../../utils/API";
import { Link } from 'react-router-dom'
import hf from '../../../../utils/helperFunctions'

class Product extends Component  {
  constructor(props) {
    super()
    this.routeParamCategory = props.match.params.category
    this.routeParamProduct = props.match.params.product
    this.state = {
        product: null
    }
  }
  async componentDidMount() {
    // OR WOULD IT BE FASTER TO FILTER THROUGH THE 'IN STOCK PRODUCTS' THAT RESIDE IN THE STORE STATE?
    let productInfo = await getProductInfo(this.routeParamProduct).then((res) => res.data)
    this.setState({ product: productInfo })
  }

  getMatchingCategoryName(categories) {
    console.log(categories)
    let category_name = categories.filter(category => {
      return category.path_name === this.routeParamCategory
    })
    console.log(category_name)
    return hf.capitalizeFirsts(category_name[0].name)
  }

  render_content() {
    let categories = this.state.product.categories

    return (
      <div>
        <div>Back to <Link to={`/shop/${this.routeParamCategory}`}>{this.getMatchingCategoryName(categories)}</Link></div>
        <h1>
          Product Page
        </h1>
      </div>
    )
  }
  
  render() {
    return (
      <div>
        {this.state.product ? this.render_content() : ""}
      </div>
    )
  }
}


function mapStateToProps({ products }) {
  return { products }
}

export default connect(mapStateToProps, null)(Product)
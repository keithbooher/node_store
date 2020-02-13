import React, { Component } from 'react'
import { connect } from 'react-redux'
import API from "../../../utils/API";
import ProductCard from '../../PageComponents/front_end/ProductCard'
import hf from '../../../utils/HelperFunctions'

class Category extends Component  {
  constructor(props) {
    super()
    this.routeParamCategory = props.match.params.category
    this.state = {products: [], category_data: null}
  }
  async componentDidMount() {
    let category_data = await API.getCategoryData(this.routeParamCategory).then(res => res.data)
    let category_products = await API.getCategoryProducts(this.routeParamCategory).then(res => res.data)
    this.setState({ products: category_products, category_data: category_data })
  }

  renderProductCards() {
    return this.state.products.reverse().map(product => {
      return <ProductCard product={product} category_path_name={this.routeParam}/>
    })
  }
  
  renderAll() {
    return (
      <div>
        <h1>
          {hf.capitalizeFirsts(this.state.category_data.name)}
        </h1>
        <div style={{display: 'flex'}}>
          {this.renderProductCards()}
        </div>
      </div>
    )
  }
  
  render() {
    console.log(this.state)
    return (
      <div>
        {this.state.category_data ? this.renderAll() : ""}
      </div>
    )
  }
}


function mapStateToProps({ products }) {
  return { products }
}

export default connect(mapStateToProps, null)(Category)
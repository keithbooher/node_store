import React, { Component } from 'react'
import { getCategoryProducts } from "../../../../utils/API";
import ProductCard from '../../components/ProductCard'
import { capitalizeFirsts } from '../../../../utils/helperFunctions'
import loadingGif from '../../../../images/pizzaLoading.gif'

class Category extends Component  {
  constructor(props) {
    super()
    this.routeParamCategory = props.match.params.category
    this.state = { 
      products: null,
      category_data: null, 
      current_cat: props.match.params.category 
    }
  }
  async componentDidMount() {
    const category_products = await getCategoryProducts(this.routeParamCategory)
    this.setState({ 
      products: category_products.data.products, 
      category_data: category_products.data.category 
    })
  }
  renderProductCards() {
    return this.state.products.reverse().map(product => {
      return <ProductCard product={product} category_path_name={this.props.match.params.category}/>
    })
  }
  async getProducts() {
    const category_products = await getCategoryProducts(this.props.match.params.category)
    this.setState({ 
      products: category_products.data.products, 
      category_data: category_products.data.category,
      current_cat: this.props.match.params.category 
    })
  }
  
  render() {
    if(this.props.match.params.category !== this.state.current_cat) {
      this.getProducts()
    }
    return (
      <div>
        { this.state.products !== null ?
          <>
            <h1>
              {capitalizeFirsts(this.state.category_data.name)}
            </h1>
            <div className="flex flex-wrap">
              {this.renderProductCards()}
            </div>
          </>
       : <img className="loadingGif" src={loadingGif} /> }
      </div>
    )
  }
}

export default Category
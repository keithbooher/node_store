import React, { Component } from 'react'
import { connect } from 'react-redux'
import './home.css.scss'
import ProductCard from '../../../page_components/front_end/ProductCard'
// pull from actions. create action to make request for adding product-data to the cart

class Home extends Component  {
  constructor(props) {
    super()
    this.state = {
      products: []
    }
  }

  renderProducts() {
    return this.props.products.map(product => {
      return <div key={product._id}><ProductCard user_id={this.props.auth._id} product={product} cart={this.props.cart} category_path_name={product.category[0].category_path_name} /></div>
    })
  }

  
  render() {
    // console.log('home',this.props)
    return (
      <div>
        <h1>
          Node Store
        </h1>
        <div className="product_grid">
          {this.renderProducts()}
        </div>
      </div>
    )
  }
}


function mapStateToProps({ auth, products, cart }) {
  return { auth, products, cart }
}

export default connect(mapStateToProps, null)(Home)
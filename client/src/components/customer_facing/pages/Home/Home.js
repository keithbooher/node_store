import React, { Component } from 'react'
import { connect } from 'react-redux'
import ProductCard from '../../components/ProductCard'
import { addToCart } from '../../../../actions'
import API from '../../../../utils/API'
import './home.css.scss'

// pull from actions. create action to make request for adding product-data to the cart

class Home extends Component  {
  constructor(props) {
    super()
    this.state = {
      products: []
    }
  }

  async componentDidMount() {
    const inStockProducts = await API.allInStockProducts()
    this.setState({ products: inStockProducts.data })
  }

  renderProducts() {
    return this.state.products.map(product => {
      return <><ProductCard addToCart={this.props.addToCart} user={this.props.auth} product={product} cart={this.props.cart} category_path_name={product.category[0].category_path_name} /></>
    })
  }

  
  render() {
    console.log('home',this.props)
    return (
      <div>
        <h1>Node Store</h1>
        <div className="flex">
          {this.state.products.length > 0 ? this.renderProducts() : ""}
        </div>
      </div>
    )
  }
}


function mapStateToProps({ auth, cart }) {
  return { auth, cart }
}

export default connect(mapStateToProps, {addToCart})(Home)
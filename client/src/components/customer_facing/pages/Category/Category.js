import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getCategoryProducts } from "../../../../utils/API"
import ProductCard from '../../components/ProductCard'
import { capitalizeFirsts } from '../../../../utils/helpFunctions'
import loadingGif from '../../../../images/pizzaLoading.gif'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { sidebarBoolean, updateCart, createCart } from "../../../../actions"
import { Link } from "react-router-dom"
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
    const category_products = await this.props.getCategoryProducts(this.routeParamCategory)
    if (category_products.status !== 200) {
      category_products.data = {
        category: null,
        products: []
      }
    }
    this.setState({ 
      products: category_products.data.products.reverse(), 
      category_data: category_products.data.category 
    })
  }
  renderProductCards() {
    // filter products that have 0 inventory IF store zero-inventory rule is true
    let products = this.state.products
    if (!this.props.zeroInventory) {
      products = products.filter((product) => product.inventory_count > 0)
    }
    return products.map((product, index) => {
      return <ProductCard
                key={index}
                product={product} 
                category_path_name={this.props.match.params.category}
                user={this.props.auth}
                createCart={this.props.createCart}
                cart={this.props.cart} 
                updateCart={this.props.updateCart}
              />
    })
  }
  async getProducts() {
    const category_products = await this.props.getCategoryProducts(this.props.match.params.category)
    if (category_products.status !== 200) {
      category_products.data = {
        category: null,
        products: []
      }
    }
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
            <Link className="margin-s-v" onClick={() => this.props.sidebarBoolean(!this.props.sidebar)}><FontAwesomeIcon icon={faArrowLeft} /> Other Categories</Link>
            <h1 style={{ marginTop: "0px" }}>
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


function mapStateToProps({ auth, sidebar, cart, zeroInventory }) {
  return { auth, sidebar, cart, zeroInventory }
}

const actions = { sidebarBoolean, updateCart, createCart, getCategoryProducts }

export default connect(mapStateToProps, actions)(Category)
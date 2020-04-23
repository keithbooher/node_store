import React, { Component } from 'react'
import { allProducts } from '../../../utils/API'
import loadingGif from '../../../images/pizzaLoading.gif'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faPlusCircle, faEdit} from "@fortawesome/free-solid-svg-icons"
class ProductList extends Component {
  constructor(props) {
    super()
    this.state = {
      products: null,
      page_number: 1,
      chosen_product: null
    }
  }
  
  async componentDidMount() {
    const products = await allProducts("none", "none")
    console.log(products)
    this.setState({ products: products.data })
  }

  async changePage(direction) {
    let direction_reference_product_id
    let page_increment
    if (direction === "next") {
      page_increment = 1
      direction_reference_product_id = this.state.products[this.state.products.length - 1]
    } else {
      page_increment = -1
      direction_reference_product_id = this.state.products[0]
    }
    
    const products = await allProducts(direction_reference_product_id._id, direction)
    this.setState({ products: products.data, page_number: this.state.page_number + page_increment })
  }

  productData(product) {
    return  (
      <div style={{ backgroundColor: 'rgb(111, 111, 111)', width: '93%', margin: '0px auto' }}>
        <Link to={`/admin/products/update/${product.path_name}`} > <FontAwesomeIcon icon={faEdit} />Edit</Link>
        <div>Name {product.name}</div>
        <div>Description:  {product.description}</div>
        <div>Inventory Count:  {product.inventory_count}</div>
        <div>Price:  {product.price}</div>
        <div>Display:  {product.display}</div>
      </div>
    )
  }

  setProduct(product) {
    this.setState({ 
      chosen_product: product._id,
    })
  }

  renderProducts() {
    return this.state.products.map((product) => {
      return (
        <div key={product._id}>
          <div className="clickable margin-xs-v color-white" style={{ backgroundColor: 'rgb(45, 45, 45)' }} data-product-tab={product._id} onClick={ () => this.setProduct(product) }>{product._id}----{product.name}</div>
          { this.state.chosen_product === product._id ? this.productData(product) : ""}
        </div>
      )
    })
  }

  render() {
    return (
      <>
        <Link to="/admin/products/add" ><FontAwesomeIcon icon={faPlusCircle} />Add Product</Link>
        {this.state.products !== null ? this.renderProducts() : <img className="loadingGif" src={loadingGif} /> }
        <div className="flex">
          <button onClick={() => this.changePage('previous')} className="bare_button">Previous</button>
          <div className="font-size-1-3">{this.state.page_number}</div>
          <button onClick={() => this.changePage('next')} className="bare_button">Next</button>
        </div>
      </>
    )
  }
}

export default ProductList
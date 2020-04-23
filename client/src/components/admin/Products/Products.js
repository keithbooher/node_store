import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import ProductList from "./ProductList"
import ProductForm from "./ProductForm"
class Products extends Component {
  constructor(props) {
    super()
    this.state = {

    }
  }


  render() {
    return (
      <div id="admin_products_container">
        <Route exact path="/admin/products" component={ProductList} />
        <Route exact path="/admin/products/add" component={ProductForm} />
        <Route path="/admin/products/update" component={ProductForm} />
      </div>
    )
  }
}

export default Products
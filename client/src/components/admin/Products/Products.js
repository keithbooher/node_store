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
        <Route exact path="/admin/products/:id?" component={ProductList} />
        <Route exact path="/admin/products/form/add" component={ProductForm} />
        <Route exact path="/admin/products/form/update/:path_name" component={ProductForm} />
      </div>
    )
  }
}

export default Products
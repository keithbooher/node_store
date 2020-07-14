import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import ProductList from "./ProductList"
import ProductFormCreate from "./ProductFormCreate"
import ProductFormUpdate from "./ProductFormUpdate"
class Products extends Component {
  constructor(props) {
    super()
    this.state = {

    }
  }


  render() {
    return (
      <div id="admin_products_container" style={{ marginTop: "30px" }}>
        <Route exact path="/admin/products/:id?" component={ProductList} />
        <Route exact path="/admin/products/form/add" component={ProductFormCreate} />
        <Route exact path="/admin/products/form/update/:path_name" component={ProductFormUpdate} />
      </div>
    )
  }
}

export default Products
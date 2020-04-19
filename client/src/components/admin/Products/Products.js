import React, { Component } from 'react'
import { allProducts } from '../../../utils/API'
import { Route, Link } from 'react-router-dom'
import loadingGif from '../../../images/pizzaLoading.gif'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faPlusCircle, faTimesCircle} from "@fortawesome/free-solid-svg-icons"
import ProductList from "./ProductList"
import CreateProduct from "./CreateProduct"
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
        <Route exact path="/admin/products/add" component={CreateProduct} />
      </div>
    )
  }
}

export default Products
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reset } from "redux-form";
import { allProducts, getProductbyId, getProductInfo } from '../../../utils/API'
import loadingGif from '../../../images/pizzaLoading.gif'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlusCircle, faEdit, faSyncAlt } from "@fortawesome/free-solid-svg-icons"
import { productSearchField } from "./formFields"
import Form from "../../shared/Form"
import PageChanger from "../../shared/PageChanger"
class ProductList extends Component {
  constructor(props) {
    super()
    this.getAllProducts = this.getAllProducts.bind(this)
    this.changePage = this.changePage.bind(this)
    this.state = {
      products: [],
      page_number: 1,
      chosen_product: null,
    }
  }
  
  async componentDidMount() {
    // When we land we have two scenarios
    // 1.) we land on the page normally
    // 2.) we land after submitting the product admin form
    // Now if we land after submitting the form there will be an ID in the last path value
    ////// We'll use this value to pull up the product in the future search bar
    // If we land normally we just pull all the products and list them...
    let products

    const split_paths = window.location.pathname.split( '/' )
    const path = split_paths[split_paths.length - 1]

    let chosen_product = null
    if (path !== "products") {
      chosen_product = path
      products = await getProductbyId(path)
      products = products.data
      products = [products]
    } else {
      products = await allProducts("none", "none")
      products = products.data
    }

    this.setState({ products: products, chosen_product: chosen_product})
  }

  productData(product) {
    return  (
      <div style={{ backgroundColor: 'rgb(111, 111, 111)', width: '93%', margin: '0px auto' }}>
        <Link to={`/admin/products/form/update/${product.path_name}`} > <FontAwesomeIcon icon={faEdit} />Edit</Link>
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

  async getAllProducts() {
    let products = await allProducts("none", "none")
    this.setState({ products: products.data })
    this.props.dispatch(reset("product_search_form"))
  }

  async handleSearchSubmit(e) {
    e.preventDefault()
    const search_by_prpoduct_name = this.props.form['product_search_form'].values
    let product = await getProductInfo(search_by_prpoduct_name.search_bar)

    this.setState({ products: [product.data], chosen_product: product.data._id })
  }

  async changePage(direction_reference_id, direction) {
    const products = await allProducts(direction_reference_id, direction)
    this.setState({ products: products.data })
  }

  render() {
    return (
      <>
        <Link to="/admin/products" onClick={this.getAllProducts} ><FontAwesomeIcon icon={faSyncAlt} />Get All Products</Link>
        <Form 
          onSubmit={(e) => this.handleSearchSubmit(e)}
          submitButtonText={"Search By Product Name"}
          formFields={productSearchField}
          formId='product_search_form'
          form='product_search_form'
        />
        <Link to="/admin/products/form/add" ><FontAwesomeIcon icon={faPlusCircle} />Add Product</Link>
        {this.state.products.length !== 0 ? this.renderProducts() : <img className="loadingGif" src={loadingGif} /> }
        <PageChanger list_items={this.state.products} requestMore={this.changePage} />
      </>
    )
  }
}


function mapStateToProps({ form }) {
  return { form }
}

export default connect(mapStateToProps, null)(ProductList)

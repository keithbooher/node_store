import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reset } from "redux-form";
import { paginatedProducts, getProductbyId, getProductInfo, updateProduct, lastProduct } from '../../../utils/API'
import loadingGif from '../../../images/pizzaLoading.gif'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlusCircle, faEdit, faSyncAlt, faTrash, faCartArrowDown, faCaretDown } from "@fortawesome/free-solid-svg-icons"
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
      last_product: null
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
      products = await getProductbyId(path).then(res => res.data)
      products = [products]
    } else {
      products = await paginatedProducts("none", "none").then(res => res.data)
    }

    let last_product = await lastProduct().then(res => res.data)

    this.setState({ products, chosen_product, last_product})
  }

  async deleteProduct(product) {
    const prod = product
    prod.deleted_at = Date.now()
    const delete_product = await updateProduct(prod)
    let products = await paginatedProducts(this.state.products[0]._id, "from_here").then(res => res.data)
    let last_product = await lastProduct().then(res => res.data)
    this.setState({ products, chosen_product: null, last_product})
  }

  productData(product) {
    return  (
      <div style={{ backgroundColor: 'rgb(111, 111, 111)', width: '93%', margin: '0px auto' }}>
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
          <div className="padding-s margin-xs-v color-white flex space-between" style={{ backgroundColor: 'rgb(45, 45, 45)' }} data-product-tab={product._id}>
            <div>{product.name}</div>
            <div className="flex">
              <Link className="margin-s-h" to={`/admin/products/form/update/${product.path_name}`} ><FontAwesomeIcon icon={faEdit} /></Link>
              <a><FontAwesomeIcon className="margin-xs-h" onClick={() => this.deleteProduct(product)} icon={faTrash} /></a>
              <a><FontAwesomeIcon className="margin-xs-h" onClick={ () => this.setProduct(product) } icon={faCaretDown} /></a>
            </div>
          </div>
          { this.state.chosen_product === product._id ? this.productData(product) : ""}
        </div>
      )
    })
  }

  async getAllProducts() {
    let products = await paginatedProducts("none", "none").then(res => res.data)
    this.setState({ products, page_number: 1 })
    this.props.dispatch(reset("product_search_form"))
  }

  async handleSearchSubmit(e) {
    e.preventDefault()
    const search_by_prpoduct_name = this.props.form['product_search_form'].values
    let product = await getProductInfo(search_by_prpoduct_name.search_bar).then(res => res.data)

    this.setState({ products: [product], chosen_product: product._id })
  }

  async changePage(direction_reference_id, direction, page_increment) {
    const products = await paginatedProducts(direction_reference_id, direction).then(res => res.data)
    this.setState({ products, page_number: this.state.page_number + page_increment  })
  }

  render() {
    let lastPossibleItem = false
    if (this.state.products.length > 0) {
      if (this.state.products[this.state.products.length - 1]._id === this.state.last_product._id) {
        lastPossibleItem = true
      }
    }
    return (
      <>
        <Link to="/admin/products" onClick={this.getAllProducts} ><FontAwesomeIcon icon={faSyncAlt} />Get All Products</Link>
        <Form 
          onSubmit={(e) => this.handleSearchSubmit(e)}
          submitButtonText={"Search By Product Name"}
          formFields={productSearchField}
          form='product_search_form'
        />
        <Link to="/admin/products/form/add" ><FontAwesomeIcon icon={faPlusCircle} />Add Product</Link>
        {this.state.products.length !== 0 ? this.renderProducts() : <img className="loadingGif" src={loadingGif} /> }
        <PageChanger page_number={this.state.page_number} list_items={this.state.products} requestMore={this.changePage} lastPossibleItem={lastPossibleItem} />
      </>
    )
  }
}


function mapStateToProps({ form }) {
  return { form }
}

export default connect(mapStateToProps, null)(ProductList)

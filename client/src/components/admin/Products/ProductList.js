import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reset } from "redux-form";
import { paginatedProducts, getProductbyId, searchProduct, updateProduct, lastProduct, getAllCategories, lastProductByCategory } from '../../../utils/API'
import { dispatchObj } from '../../../actions'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlusCircle, faEdit, faSyncAlt, faTrash, faCaretDown, faSearch, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { productSearchField } from "./formFields"
import Form from "../../shared/Form"
import PageChanger from "../../shared/PageChanger"
import Key from "../../shared/Key"
class ProductList extends Component {
  constructor(props) {
    super()
    this.getAllProducts = this.getAllProducts.bind(this)
    this.filterProductsByCategory = this.filterProductsByCategory.bind(this)
    this.changePage = this.changePage.bind(this)
    this.state = {
      products: null,
      page_number: 1,
      chosen_product: null,
      last_product: null,
      categoryFilter: "none",
      dropDownField:[
        { 
          label: "Filter", 
          name: "category_filter", 
          typeOfComponent: "dropdown",
          options: [
            {
              default: true,
              value: "None",
              name: "None",
              redux_field: "category_filter"
            }
          ]
        }
      ]
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
      products = await this.props.getProductbyId(path).then(res => res.data)
      products = [products]
    } else {
      products = await this.props.paginatedProducts("none", "none", this.state.categoryFilter).then(res => res.data)
    }

    let last_product = await this.props.lastProduct().then(res => res.data)

    let categories = await this.props.getAllCategories()

    let dropdown = this.state.dropDownField[0]
    
    dropdown.options = categories.data.map((category) => {
      return ({
        default: false,
        value: category._id,
        name: category.name,
        redux_field: "category_filter"
      })
    })

    const none = {
      default: true,
      value: "none",
      name: "none",
      redux_field: "category_filter"
    }

    const all = {
      default: true,
      value: "all",
      name: "all",
      redux_field: "category_filter"
    }

    dropdown.options.push(none)
    dropdown.options.push(all)
    dropdown.options = dropdown.options.reverse()

    this.setState({ products, chosen_product, last_product, dropDownField: [dropdown]  })
  }

  async deleteProduct(product) {
    const prod = product
    prod.deleted_at = Date.now()
    await this.props.updateProduct(prod)
    let products = await this.props.paginatedProducts(this.state.products[0]._id, "from_here", this.state.categoryFilter).then(res => res.data)
    let last_product
    if (this.state.category_filter === "all" || this.state.category_filter === "none") {
      last_product = await this.props.lastProduct().then(res => res.data)
    } else {
      last_product = await this.props.lastProductByCategory().then(res => res.data)
    }
    this.setState({ products, chosen_product: null, last_product})
  }

  productData(product) {
    return  (
      <div className="color-white padding-s theme-background-4" style={{ width: '93%', margin: '0px auto' }}>
        <div className="margin-xs-v"><Key>Name:</Key> {product.name}</div>
        <div className="margin-xs-v"><Key>Description:</Key> {product.description}</div>
        <div className="margin-xs-v"><Key>Inventory Count:</Key> {product.inventory_count}</div>
        <div className="margin-xs-v"><Key>Price:</Key> {product.price}</div>
        <div className="margin-xs-v"><Key>Display:</Key> {product.display ? "true" : "false"}</div>
      </div>
    )
  }

  setProduct(product) {
    let id = product._id
    if (product._id === this.state.chosen_product) {
      id = null
    }
    this.setState({ 
      chosen_product: id,
    })
  }

  renderProducts() {
    return this.state.products.map((product) => {
      return (
        <div key={product._id}>
          <div className="padding-s margin-xs-v color-white flex space-between" style={{ backgroundColor: 'rgb(45, 45, 45)' }} data-product-tab={product._id}>
            <div className="flex">
              <a style={{ marginRight: '5px' }}><FontAwesomeIcon onClick={ () => this.setProduct(product) } icon={faCaretDown} /></a>
              <div>{product.name}</div>
            </div>
            <div className="flex">
              <Link className="margin-s-h" to={`/admin/products/form/update/${product.path_name}`} ><FontAwesomeIcon icon={faEdit} /></Link>
              <a><FontAwesomeIcon className="margin-xs-h" onClick={() => this.deleteProduct(product)} icon={faTrash} /></a>
            </div>
          </div>
          { this.state.chosen_product === product._id ? this.productData(product) : ""}
        </div>
      )
    })
  }

  async getAllProducts() {
    let products = await this.props.paginatedProducts("none", "none", "none").then(res => res.data)
    let last_product = await this.props.lastProduct().then(res => res.data)
    this.setState({ products, page_number: 1, last_product })
    this.props.dispatchObj(reset("product_search_form"))
  }

  async handleSearchSubmit() {
    const search_by_product_name = this.props.form['product_search_form'].values
    let product
    if (search_by_product_name === undefined) {
      this.getAllProducts()
      return
    } else {
      product = [await this.props.searchProduct(search_by_product_name.search_bar).then(res => res.data)]
    }

    this.setState({ products: product, chosen_product: product._id })
  }

  async changePage(direction_reference_id, direction, page_increment) {
    const products = await this.props.paginatedProducts(direction_reference_id, direction, this.state.categoryFilter).then(res => res.data)
    let last_product
    if (this.state.category_filter === "all" || this.state.category_filter === "none") {
      last_product = await this.props.lastProduct().then(res => res.data)
    } else {
      last_product = await this.props.lastProductByCategory().then(res => res.data)
    }
    this.setState({ products, page_number: this.state.page_number + page_increment, last_product })
  }

  async filterProductsByCategory() {
    const dropwdown_values = this.props.form['category_filter_dropdown'].values.category_filter.value
    const { data } = await this.props.paginatedProducts("none", "none", dropwdown_values)
    let last_product
    if (this.state.category_filter === "all" || this.state.category_filter === "none") {
      last_product = await this.props.lastProduct().then(res => res.data)
    } else {
      last_product = await this.props.lastProductByCategory().then(res => res.data)
    }
    this.setState({ categoryFilter: dropwdown_values, products: data, last_product })
  }

  render() {
    let lastPossibleItem = false
    if (this.state.last_product && this.state.products.length > 0) {
      if (this.state.products[this.state.products.length - 1]._id === this.state.last_product._id) {
        lastPossibleItem = true
      }
    }

    let fontSize = "1em"
    if (!this.props.mobile) { 
      fontSize = "20px"
    }
    let searchButton = document.getElementsByClassName("search_button")
    if (searchButton[0]) {
      searchButton[0].style.marginTop = "28px"
    }
    return (
      <div style={{ fontSize }}>
        <Link to="/admin/products/form/add" className="absolute" style={{ top: "5px", right: "5px" }}>Add Product <FontAwesomeIcon icon={faPlusCircle} /></Link>
        <Link to="/admin/products" onClick={this.getAllProducts} ><button className="padding-s"><FontAwesomeIcon style={{ marginRight: "5px" }} icon={faSyncAlt} />All</button></Link>

        <Form
          submitButton={<div/>}
          onChange={this.filterProductsByCategory}
          formFields={this.state.dropDownField}
          form='category_filter_dropdown'
        />

        <Form 
          onSubmit={(e) => this.handleSearchSubmit(e)}
          submitButtonText={<FontAwesomeIcon icon={faSearch} />}
          searchButton={true}
          formFields={productSearchField}
          form='product_search_form'
        />
        
        {this.state.products ? 
          this.state.products.length === 0 ?
            <div>No Product Found</div>
            : 
            <>
              {this.renderProducts()}
              <PageChanger 
                page_number={this.state.page_number} 
                list_items={this.state.products} 
                requestMore={this.changePage} 
                lastPossibleItem={lastPossibleItem} 
              />
            </>
          : <FontAwesomeIcon className="loadingGif loadingGifCenterScreen" icon={faSpinner} spin />
        }
        
      </div>
    )
  }
}


function mapStateToProps({ form, mobile }) {
  return { form, mobile }
}

const actions = { getAllCategories, getProductbyId, searchProduct, paginatedProducts, updateProduct, lastProduct, dispatchObj, lastProductByCategory }

export default connect(mapStateToProps, actions)(ProductList)

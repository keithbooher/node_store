import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reset } from "redux-form";
import { getProductbyId, paginatedProducts, getProductInfo, getAllCategories, updateProduct, lastProductByCategory } from '../../../utils/API'
import loadingGif from '../../../images/pizzaLoading.gif'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faPlusCircle, faArrowCircleLeft, faArrowLeft, faTrash } from "@fortawesome/free-solid-svg-icons"
import Form from "../../shared/Form"
import PageChanger from "../../shared/PageChanger"
import { Link } from 'react-router-dom'

class UpdateRelatedProducts extends Component {
  constructor(props) {
    super()
    this.routeParamID = props.match.params.product_id

    this.filterProductsByCategory = this.filterProductsByCategory.bind(this)
    this.changePage = this.changePage.bind(this)

    this.state = {
      product: null,
      queried_products: null,
      page_number: 1,
      categoryFilter: "All",
      last_possible_product: null,
      dropDownField:[
        { 
          label: "Category Filter", 
          name: "category_filter", 
          typeOfComponent: "dropdown",
          options: [
            {
              default: true,
              value: "All",
              name: "All",
              redux_field: "category_filter"
            }
          ]
        }
      ]
    }
  }

  async componentDidMount() {
    let { data } = await getProductbyId(this.routeParamID)

    let categories = await getAllCategories()

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
      value: "All",
      name: "All",
      redux_field: "category_filter"
    }

    dropdown.options.push(none)
    dropdown.options = dropdown.options.reverse()

    let queried_products = await paginatedProducts("none", "none", "none").then(res => res.data)

    let last_possible_product = await lastProductByCategory("all").then(res => res.data)


    this.setState({ product: data, dropDownField: [dropdown], queried_products, last_possible_product })
  }
  

  async getAllProducts() {
    let queried_products = await paginatedProducts("none", "none", "none").then(res => res.data)
    let last_possible_product = await lastProductByCategory("all").then(res => res.data)
    this.setState({ queried_products, page_number: 1, last_possible_product })
    this.props.dispatch(reset("product_search_form"))
  }

  async handleSearchSubmit() {
    const search_by_product_name = this.props.form['product_search_form'].values
    let queried_products
    if (search_by_product_name === undefined) {
      this.getAllProducts()
      return
    } else {
      queried_products = [await getProductInfo(search_by_product_name.search_bar).then(res => res.data)]
    }

    this.setState({ queried_products })
  }

  async changePage(direction_reference_id, direction, page_increment) {
    const queried_products = await paginatedProducts(direction_reference_id, direction, this.state.categoryFilter).then(res => res.data)
    this.setState({ queried_products, page_number: this.state.page_number + page_increment  })
  }

  async filterProductsByCategory() {
    const dropwdown_values = this.props.form['category_filter_dropdown'].values.category_filter.value
    const { data } = await paginatedProducts("none", "none", dropwdown_values)
    let last_possible_product = await lastProductByCategory(dropwdown_values).then(res => res.data)
    this.setState({ categoryFilter: dropwdown_values, queried_products: data, last_possible_product })
  }

  renderQueriedProducts(products, added) {
    return products.map((product) => {
      return (
        <div className="flex space-between margin-s-v background-color-grey-3 padding-xs align-items-center">
          <div className="flex align-items-center" key={product._id}>
            <div className="flex justify-center" style={{ height: "50px", width: "50px"}}>
              <img src={product.image} style={{ height: "auto", width: "auto", maxHeight: "50px", maxWidth: "50px" }} />
            </div>
            <div className="margin-m-h">Name: {product.name}</div>
          </div>
          {!added && <FontAwesomeIcon className="margin-xs-h" icon={faPlusCircle} onClick={() => this.addToRelatedProducts(product)} />}
          {added && <FontAwesomeIcon className="margin-xs-h" icon={faTrash} onClick={() => this.removeRelatedProduct(product)} />}
        </div>
      )
    })
  }

  async addToRelatedProducts(prod) {
    let product = this.state.product
    product.related_products.push(prod._id)
    const { data } = await updateProduct(product)

    let queried_products = this.state.queried_products.filter((queried_product) => queried_product._id !== prod._id)
  
    this.setState({ product: data, queried_products })
  }

  async removeRelatedProduct(prod) {
    let product = this.state.product
    product.related_products = product.related_products.map((rel_product) => {
      if (rel_product._id === prod._id) {
        return
      }
      return rel_product._id
    }).filter((rel_product) => rel_product !== undefined)

    const { data } = await updateProduct(product)

    this.setState({ product: data })
  }

  render() {
    let lastPossibleItem = false
    if (this.state.queried_products && this.state.queried_products.length > 0) {
      if (this.state.queried_products[this.state.queried_products.length - 1]._id === this.state.last_possible_product._id) {
        lastPossibleItem = true
      }
    }
    return (
      <div style={{ marginTop: "30px" }}>
        {this.state.product && <Link to={`/admin/products/form/update/${this.state.product.path_name}`} ><FontAwesomeIcon icon={faArrowLeft} /> Back</Link>}
        <h2>Selected Related Products</h2>

        {this.state.product && this.state.product.related_products && this.renderQueriedProducts(this.state.product.related_products, true)}

        <hr/>

        <h2>Choose Related Products</h2>

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
          formFields={[
            { label: 'Search For Product By Name', name: 'search_bar', noValueError: 'You must provide an address' },
          ]}
          form='product_search_form'
        />

        {this.state.queried_products && this.state.queried_products.length !== 0 ? this.renderQueriedProducts(this.state.queried_products, false) : "No Products Found" }
        {this.state.queried_products && <PageChanger page_number={this.state.page_number} list_items={this.state.queried_products} requestMore={this.changePage} lastPossibleItem={lastPossibleItem} /> }

      </div>
    )
  }
}

function mapStateToProps({ form }) {
  return { form }
}

export default connect(mapStateToProps, null)(UpdateRelatedProducts)

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faTrash, faPlusCircle, faArrowAltCircleLeft, faSearch } from "@fortawesome/free-solid-svg-icons"
import { reset } from "redux-form";
import { getDiscountCode, updateDiscountCode, paginatedProducts, searchProduct, getAllCategories, lastProductByCategory } from '../../../utils/API'
import { validatePresenceOnAll } from "../../../utils/validations"
import { capitalizeFirsts } from "../../../utils/helpFunctions"
import { dispatchObj } from '../../../actions'
import FormModal from "../../shared/Form/FormModal"
import { Link } from 'react-router-dom'
import Form from "../../shared/Form"
import PageChanger from "../../shared/PageChanger"
import Modal from "../../shared/Modal"
import Key from "../../shared/Key"

class DiscountCodesUpdate extends Component {
  constructor(props) {
    super()
    this.routeParamID = props.match.params.id
    this.handleSubmitUpdate = this.handleSubmitUpdate.bind(this)

    this.filterProductsByCategory = this.filterProductsByCategory.bind(this)
    this.changePage = this.changePage.bind(this)

    this.state = {
      discount: null,
      propertyToEdit: null,
      queried_products: null,
      page_number: 1,
      categoryFilter: "All",
      last_possible_product: null,
      oopsModal: false,
      dropDownField:[
        { 
          label: "Category Filter", 
          name: "category_filter", 
          typeOfComponent: "dropdown",
          options: [
            {
              default: true,
              value: "all",
              name: "All",
              redux_field: "category_filter"
            }
          ]
        }
      ]
    }
  }


  async componentDidMount() {
    const { data } = await this.props.getDiscountCode(this.routeParamID)
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
      value: "all",
      name: "All",
      redux_field: "category_filter"
    }

    dropdown.options.push(none)
    dropdown.options = dropdown.options.reverse()

    let queried_products = await this.props.paginatedProducts("none", "none", "none").then(res => res.data)

    let last_possible_product = await this.props.lastProductByCategory("all").then(res => res.data)

    this.setState({ discount: data, dropDownField: [dropdown], queried_products, last_possible_product })
  }

  async handleSubmitUpdate() {
    const create_discount_values = this.props.form['update_discount_form'].values
    let update_discount_info = this.state.discount
    for (let [key, value] of Object.entries(create_discount_values)) {
      if (key === "depth" || key === "width" || key === "height") {
        update_discount_info.dimensions[key] = parseInt(value)
      } else {
        update_discount_info[key] = value
      }
    }

    let { data } = await this.props.updateDiscountCode(update_discount_info)
    this.props.dispatchObj(reset("update_discount_form"))
    this.setState({ editForm: null, propertyToEdit: null, discount: data })
  }



  showEditModal(property) {
    let discount = this.state.discount
    const form_object = {
      discount,
      onSubmit: this.handleSubmitUpdate,
      cancel: () => {
        this.props.dispatchObj(reset("update_discount_form"))
        this.setState({ editForm: null, propertyToEdit: null })
      },
      submitButtonText: "Update Discount Property",
      formFields: [
        { label: capitalizeFirsts(property), name: property, noValueError: `You must provide a value` },
      ],
      form: "update_discount_form",
      validation: validatePresenceOnAll,
      initialValues: {
          [property]: discount[property]
        }
    }
    this.setState({ editForm: form_object })
  }


  showEditIndicator(propertyToEdit) {
    this.setState({ propertyToEdit })
  }

  
  async getAllProducts() {
    let queried_products = await this.props.paginatedProducts("none", "none", "none").then(res => res.data)
    let last_possible_product = await this.props.lastProductByCategory("all").then(res => res.data)
    this.setState({ queried_products, page_number: 1, last_possible_product })
    this.props.dispatchObj(reset("product_search_form"))
  }

  async handleSearchSubmit() {
    const search_by_product_name = this.props.form['product_search_form'].values
    let queried_products
    if (search_by_product_name === undefined) {
      this.getAllProducts()
      return
    } else {
      queried_products = [await this.props.searchProduct(search_by_product_name.search_bar).then(res => res.data)]
    }

    this.setState({ queried_products })
  }

  async changePage(direction_reference_id, direction, page_increment) {
    const queried_products = await this.props.paginatedProducts(direction_reference_id, direction, this.state.categoryFilter).then(res => res.data)
    this.setState({ queried_products, page_number: this.state.page_number + page_increment  })
  }

  async filterProductsByCategory() {
    const dropwdown_values = this.props.form['category_filter_dropdown'].values.category_filter.value
    const { data } = await this.props.paginatedProducts("none", "none", dropwdown_values)
    let last_possible_product = await this.props.lastProductByCategory(dropwdown_values).then(res => res.data)
    this.setState({ categoryFilter: dropwdown_values, queried_products: data, last_possible_product })
  }

  renderQueriedProducts(products, added) {
    return products.map((product, index) => {
      return (
        <div key={index} className="flex space-between margin-s-v background-color-grey-3 padding-xs align-items-center">
          <div className="flex align-items-center" key={product._id}>
            <div className="flex justify-center" style={{ height: "50px", width: "50px"}}>
              <img src={product.images.i1} style={{ height: "auto", width: "auto", maxHeight: "50px", maxWidth: "50px" }} />
            </div>
            <div className="margin-m-h"><Key>Name:</Key> {product.name}</div>
          </div>
          {!added && <FontAwesomeIcon className="margin-xs-h hover hover-color-2" icon={faPlusCircle} onClick={() => this.addToDiscountedProducts(product)} />}
          {added && <FontAwesomeIcon className="margin-xs-h hover hover-color-2" icon={faTrash} onClick={() => this.removeDiscountedProduct(product)} />}
        </div>
      )
    })
  }

  async addToDiscountedProducts(prod) {
    let discount = this.state.discount
    let already_contained = false

    discount.products.forEach(product => {
      if (product._id === prod._id) {
        already_contained = true
      }
    });

    if (already_contained) {
      this.setState({ oopsModal: true })      
      return
    }
    discount.products.push(prod)

    let queried_products = this.state.queried_products.filter((queried_product) => queried_product._id !== prod._id)

    this.setState({ discount, queried_products })
  }

  async removeDiscountedProduct(prod) {
    let discount = this.state.discount
    discount.products = discount.products.map((product) => {
      if (product._id === prod._id) {
        return
      }
      return product
    }).filter((product) => product !== undefined)

    this.setState({ discount })
  }

  render() {
    let lastPossibleItem = false
    if (this.state.queried_products && this.state.queried_products.length > 0) {
      if (this.state.queried_products[this.state.queried_products.length - 1]._id === this.state.last_possible_product._id) {
        lastPossibleItem = true
      }
    }

    return (
      <div >
        <Link to="/admin/discount-codes" className="absolute flex" style={{ top: "5px", left: "30px" }}>
          <FontAwesomeIcon icon={faArrowAltCircleLeft} />
          <div className="margin-xs-h">Back to discounts</div>
        </Link>
        {this.state.discount && <h1>{this.state.discount.affect_order_total ? "Order Total Discount" : "Product(s) Discount"}</h1>}
        {this.state.discount && 
          <div>
            {this.state.discount.percentage ?            
              <div className="relative margin-s-v theme-background-3 color-white padding-s border-radius-s" style={{ fontSize: "18px" }}>
                <span>Percentage:</span> <a className="inline" onClick={() => this.showEditIndicator("percentage")}>{this.state.discount.percentage ? this.state.discount.percentage + "%"  : "N/A"}</a>
                {this.state.propertyToEdit && this.state.propertyToEdit === "percentage" && 
                    <FontAwesomeIcon 
                      className="margin-s-h hover hover-color-2"
                      icon={faEdit} 
                      onClick={() => this.showEditModal("percentage")} 
                    />
                  }
              </div>
            :            
              <div className="relative margin-s-v theme-background-3 color-white padding-s border-radius-s" style={{ fontSize: "18px" }}>
                <span>Flat Price:</span> <a className="inline" onClick={() => this.showEditIndicator("flat_price")}>{this.state.discount.flat_price ? this.state.discount.flat_price : "N/A"}</a>
                {this.state.propertyToEdit && this.state.propertyToEdit === "flat_price" && 
                    <FontAwesomeIcon 
                      className="margin-s-h hover hover-color-2"
                      icon={faEdit} 
                      onClick={() => this.showEditModal("flat_price")} 
                    />
                  }
              </div>
            }
            {!this.state.discount.affect_order_total && 
              <>
                <h2>Selected Discounted Products</h2>
    
                {this.state.discount.products.length > 0 && this.renderQueriedProducts(this.state.discount.products, true)}
    
                <hr/>
    
                <h2>Choose Discounted Products</h2>
    
                <Form
                  submitButton={<div/>}
                  onChange={this.filterProductsByCategory}
                  formFields={this.state.dropDownField}
                  form='category_filter_dropdown'
                />
        
                <Form 
                  onSubmit={(e) => console.log(e)}
                  submitButtonText={<FontAwesomeIcon icon={faSearch} />}
                  searchButton={true}
                  formFields={[
                    { label: 'Search For Product By Name Or Sku', name: 'search_bar', noValueError: 'You must provide an address' },
                  ]}
                  form='product_search_form'
                />
        
                {this.state.queried_products && this.state.queried_products.length !== 0 ? this.renderQueriedProducts(this.state.queried_products, false) : "No Products Found" }
                {this.state.queried_products && <PageChanger page_number={this.state.page_number} list_items={this.state.queried_products} requestMore={this.changePage} lastPossibleItem={lastPossibleItem} /> }
              </>
            }
          </div>        
        }
        {
          this.state.editForm && 
            <div>
              <FormModal
                onSubmit={this.state.editForm.onSubmit}
                cancel={this.state.editForm.cancel}
                submitButtonText={this.state.editForm.submitButtonText}
                formFields={this.state.editForm.formFields}
                form={this.state.editForm.form}
                validation={this.state.editForm.validation}
                title={"Updating Shipping Property"}
                initialValues={this.state.editForm.initialValues}
              />
            </div>
          }
          {this.state.oopsModal &&
            <Modal cancel={() => this.setState({ oopsModal: false })}>
              <h3>
                You have already selected this item to be a discounted product
              </h3>
            </Modal>
          }
      </div>
    )
  }
}

function mapStateToProps({ mobile, form }) {
  return { mobile, form }
}

const actions = { dispatchObj, getDiscountCode, updateDiscountCode, paginatedProducts, searchProduct, getAllCategories, lastProductByCategory }

export default connect(mapStateToProps, actions)(withRouter(DiscountCodesUpdate))
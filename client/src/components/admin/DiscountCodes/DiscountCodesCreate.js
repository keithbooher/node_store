import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSyncAlt, faSearch, faArrowAltCircleLeft, faCheck, faTimes, faPlusCircle, faTrash, faDollarSign, faPercentage, faShoppingCart, faTasks } from "@fortawesome/free-solid-svg-icons"
import { reset } from "redux-form";
import { getProductbyId, paginatedProducts, searchProduct, getAllCategories, updateProduct, lastProductByCategory, createDiscountCode } from '../../../utils/API'
import { dispatchObj } from '../../../actions'
import Form from "../../shared/Form"
import PageChanger from "../../shared/PageChanger"
import Modal from "../../shared/Modal"
import Key from "../../shared/Key"
import { Link } from 'react-router-dom'
import { capitalizeFirsts } from '../../../utils/helpFunctions'

class DiscountCodesCreate extends Component {
  constructor(props) {
    super()
    this.routeParamID = props.match.params.product_id

    this.filterProductsByCategory = this.filterProductsByCategory.bind(this)
    this.changePage = this.changePage.bind(this)
    this.createDiscount = this.createDiscount.bind(this)
    this.reset = this.reset.bind(this)

    let date = new Date()
    const today = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()

    this.state = {
      discount: {
        percentage: null,
        flat_price: null,
        affect_order_total: null,
        products: [],
        active: false,
        created_at: today,
        discount_code: null
      },
      percent_or_flat: null,
      order_or_products: null,
      queried_products: null,
      all_products: false,
      page_number: 1,
      categoryFilter: "All",
      last_possible_product: null,
      oopsModal: false,
      active: false,
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
      ],
      efffector_value: null
    }
  }


  async componentDidMount() {

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


    this.setState({ dropDownField: [dropdown], queried_products, last_possible_product })
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

  async createDiscount() {
    let discount = this.state.discount

    if (this.state.percent_or_flat === "Percent") {
      let percent = this.state.efffector_value ? this.state.efffector_value.percentage : 0
      discount.percentage = new Number(percent)
    } else {
      let flat_price = this.state.efffector_value ? this.state.efffector_value.flat_price : 0
      discount.flat_price = new Number(flat_price)
    }

    if (this.state.order_or_products === "Products") {
      discount.affect_order_total = false
    } else {
      discount.affect_order_total = true
    }
    discount.discount_code = this.props.form["discount_code_Form"].values ? this.props.form["discount_code_Form"].values.discount_code : ""

    // set product id's
    discount.products = discount.products.map(prod => {
      return prod._id
    })
    
    if (this.state.all_products === "all") {
      discount.apply_to_all_products = true
    } else {
      discount.apply_to_all_products = false
    }

    discount.active = this.state.active

    await this.props.createDiscountCode(discount)
    this.props.history.push(`/admin/discount-codes`)
    this.props.dispatchObj(reset("percent_or_flat_form"))
    this.props.dispatchObj(reset("discount_code_Form"))
  }

  reset() {
    let date = new Date()
    const today = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()

    this.setState({
      discount: {
        percentage: null,
        flat_price: null,
        affect_order_total: null,
        products: [],
        active: false,
        created_at: today,
        discount_code: null
      },
      percent_or_flat: null,
      order_or_products: null,
      queried_products: null,
      page_number: 1,
      categoryFilter: "All",
      last_possible_product: null,
      oopsModal: false,
      active: false,
      all_products: false
    })
    this.props.dispatchObj(reset("percent_or_flat_form"))
    this.props.dispatchObj(reset("discount_code_Form"))
    this.props.dispatchObj(reset("product_search_form"))
  }

  render() {
    let lastPossibleItem = false
    if (this.state.queried_products && this.state.queried_products.length > 0) {
      if (this.state.queried_products[this.state.queried_products.length - 1]._id === this.state.last_possible_product._id) {
        lastPossibleItem = true
      }
    }
    return (
      <div className={`margin-m-v ${!this.props.mobile && "w-70 margin-auto-h"}`}>
        <h1 className="text-align-center">Create a Discount Code</h1>
        <Link to="/admin/discount-codes" className="absolute flex" style={{ top: "5px", left: "30px" }}>
          <FontAwesomeIcon icon={faArrowAltCircleLeft} />
          <div className="margin-xs-h">Back to discounts</div>
        </Link>
        <div className="flex absolute hover hover-color-12" onClick={this.reset} style={{ top: "5px", right: "5px" }}>
          <div className="margin-s-h">Reset</div>
          <FontAwesomeIcon icon={faSyncAlt} />
        </div>
        {!this.state.percent_or_flat ?
          <div className="flex margin-s-v">
            <div onClick={ () => this.setState({ percent_or_flat: "Percent" }) } className="hover w-50 text-align-center theme-background-3 padding-s hover-color-11" style={{ borderRight: "solid 1px lightgrey", borderRadius: "4px 0px 0px 4px" }}>
              <FontAwesomeIcon style={{ fontSize: "30px", marginTop: "5px" }} icon={faPercentage} />
              <h3 className="margin-xs-v">Percentage Off</h3>
            </div>
            <div onClick={ () => this.setState({ percent_or_flat: "Flat" }) } className="hover w-50 text-align-center theme-background-3 padding-s hover-color-11" style={{ borderRadius: "0px 4px 4px 0px" }}>
              <FontAwesomeIcon style={{ fontSize: "30px", marginTop: "5px" }} icon={faDollarSign} />
              <h3 className="margin-xs-v">Dollar Amount Off</h3>
            </div>
          </div>
        :
          <Form 
            submitButton={<div />}
            onChange={(e) => this.setState({ efffector_value: e })}
            formFields={this.state.percent_or_flat === "Percent" ? 
              [
                { label: 'Enter Percentage Off', name: 'percentage', typeOfComponent: "number", noValueError: 'You must provide an address' },
              ]
            :
              [
                { label: 'Enter Flat Price Reduction', name: 'flat_price', typeOfComponent: "number", noValueError: 'You must provide an address' },
              ]
            }
            form='percent_or_flat_form'
          />
        }
        {!this.state.order_or_products ?        
          <div className="flex margin-s-v">
            <div onClick={ () => this.setState({ order_or_products: "Order Total" }) } className="hover w-50 text-align-center theme-background-3 padding-s hover-color-11" style={{ borderRight: "solid 1px lightgrey", borderRadius: "4px 0px 0px 4px" }}>
              <FontAwesomeIcon style={{ fontSize: "30px", marginTop: "5px" }} icon={faShoppingCart} />
              <h3 className="margin-xs-v">Total Cart Price</h3>
            </div>
            <div onClick={ () => this.setState({ order_or_products: "Products" }) } className="hover w-50 text-align-center theme-background-3 padding-s hover-color-11" style={{ borderRadius: "0px 4px 4px 0px" }}>
              <FontAwesomeIcon style={{ fontSize: "30px", marginTop: "5px" }} icon={faTasks} />
              <h3 className="margin-xs-v">Choose Products</h3>
            </div>
          </div>
        :
          this.state.order_or_products !== "Products" && <h3 className="bold">{this.state.order_or_products }</h3>     
        }
        {this.state.order_or_products === "Products" && 
          <>
            {!this.state.all_products ?        
              <div className="flex margin-s-v">
                <div onClick={ () => this.setState({ all_products: "all" }) } className="hover w-50 text-align-center theme-background-3 padding-s hover-color-11" style={{ borderRight: "solid 1px lightgrey", borderRadius: "4px 0px 0px 4px" }}>
                  <FontAwesomeIcon style={{ fontSize: "30px", marginTop: "5px" }} icon={faShoppingCart} />
                  <h3 className="margin-xs-v">Apply to all selected products?</h3>
                </div>
                <div onClick={ () => this.setState({ all_products: "highest" }) } className="hover w-50 text-align-center theme-background-3 padding-s hover-color-11" style={{ borderRadius: "0px 4px 4px 0px" }}>
                  <FontAwesomeIcon style={{ fontSize: "30px", marginTop: "5px" }} icon={faTasks} />
                  <h3 className="margin-xs-v">Apply to the highest priced item in cart?</h3>
                </div>
              </div>
            :
              this.state.all_products !== "highest" ? <h3 className="bold">Apply to the highest priced product available for discount</h3> : <h3 className="bold">Apply to all products marked for discount</h3>
            }

            <h2>Selected Discounted Products</h2>

            {this.state.discount && this.state.discount.products.length > 0 && this.renderQueriedProducts(this.state.discount.products, true)}

            <hr/>

            <h2>Choose Discounted Products</h2>

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
                { label: 'Search For Product By Name Or Sku', name: 'search_bar', noValueError: 'You must provide an address' },
              ]}
              form='product_search_form'
            />
    
            {this.state.queried_products && this.state.queried_products.length !== 0 ? this.renderQueriedProducts(this.state.queried_products, false) : "No Products Found" }
            {this.state.queried_products && <PageChanger page_number={this.state.page_number} list_items={this.state.queried_products} requestMore={this.changePage} lastPossibleItem={lastPossibleItem} /> }
          </>
        }

        <Form 
          onSubmit={(e) => console.log(e)}
          submitButton={<div />}
          formFields={[
            { label: 'Discount Code', name: 'discount_code', noValueError: 'You must provide an address' },
          ]}
          form='discount_code_Form'
        />

        <button onClick={() => this.setState({ active: !this.state.active })} style={this.props.mobile ? { width: "100%" } : { width: "200px"}} className="w-100">Availability {this.state.active ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} /> }</button>

        {this.state.order_or_products && this.props.form["percent_or_flat_form"].values && this.state.percent_or_flat && this.props.form['discount_code_Form'].values &&
          <button className="block margin-m-v" style={this.props.mobile ? { width: "100%", fontSize: "20px" } : { width: "300px", margin: "30px auto", fontSize: "25px" }} onClick={ this.createDiscount }>Create!</button>
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

const actions = { dispatchObj, getProductbyId, paginatedProducts, searchProduct, getAllCategories, updateProduct, lastProductByCategory, createDiscountCode }

export default connect(mapStateToProps, actions)(withRouter(DiscountCodesCreate))
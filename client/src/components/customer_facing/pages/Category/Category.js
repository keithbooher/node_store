import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getCategoryProducts } from "../../../../utils/API"
import ProductCard from '../../components/ProductCard'
import { capitalizeFirsts } from '../../../../utils/helpFunctions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { sidebarBoolean, updateCart, createCart } from "../../../../actions"
import MetaTags from 'react-meta-tags'

class Category extends Component  {
  constructor(props) {
    super()
    this.changePage = this.changePage.bind(this)
    this.routeParamCategory = props.match.params.category
    this.state = { 
      products: null,
      shown_products: [],
      category_data: null, 
      current_cat: props.match.params.category,
      last_product: null,
      page_number: 1,
      search_param: null
    }
  }
  async componentDidMount() {
    const category_products = await this.props.getCategoryProducts(this.routeParamCategory)
    if (category_products.status !== 200) {
      category_products.data = {
        category: null,
        products: [],
        last_product: null
      }
    }

    let products = category_products.data.products
    let shown_products
    let page_number = 1
    if (this.props.location.search) {
      page_number = this.props.location.search.split("=")
      if (page_number[0] === "?page_number") {
        page_number = parseInt(page_number[1])
        let beginning_index = (page_number * 12) - 12
        shown_products = category_products.data.products.slice(beginning_index, beginning_index + 12)
      } else {
        shown_products = category_products.data.products.slice(0, 12)  
      }
    } else {
      shown_products = category_products.data.products.slice(0, 12)
    }

    this.setState({ 
      products: products, 
      shown_products: shown_products,
      category_data: category_products.data.category,
      last_product: category_products.data.products[category_products.data.products.length - 1],
      page_number,
      search_param: this.props.location.search
    })
  }
  renderProductCards() {
    // filter products that have 0 inventory IF store zero-inventory rule is true
    let products = this.state.shown_products
    if (!this.props.zeroInventory) {
      products = products.filter((product) => product.inventory_count > 0)
    }

    return products.map((product, index) => {
      if (product === null) {
        return (<div className="card_desktop"></div>)
      } else{
        return <ProductCard
                  key={index}
                  product={product} 
                  category_path_name={this.props.match.params.category}
                  user={this.props.auth}
                  createCart={this.props.createCart}
                  cart={this.props.cart} 
                  updateCart={this.props.updateCart}
                />
      }
    })
  }

  async getNewCatProducts() {
    let category_products = await this.props.getCategoryProducts(this.props.match.params.category)
    if (category_products.status !== 200) {
      category_products.data = {
        category: null,
        products: []
      }
    }

    const products = category_products.data.products
    let shown_products = category_products.data.products.slice(0, 12)

    this.setState({ 
      products: products, 
      shown_products: shown_products,
      category_data: category_products.data.category,
      current_cat: this.props.match.params.category ,
      page_number: 1
    })
  }

  changePage(direction) {
    let IDs = this.state.products.map(prod => prod._id)
    let current_index
    if (direction === "next") {
      current_index = IDs.indexOf(this.state.shown_products[this.state.shown_products.length - 1]._id)
    } else {
      current_index = IDs.indexOf(this.state.shown_products[0]._id)
    }

    let show_products
    let page_number
    if (direction === "next") {
      show_products = this.state.products.slice(current_index + 1, current_index + 13)
      page_number = this.state.page_number + 1
    } else {
      let start_index = current_index - 13
      if (start_index < 0) {
        start_index = 0
      }
      show_products = this.state.products.slice(start_index, current_index)
      page_number = this.state.page_number - 1
    }

    let search_param = `?page_number=${page_number}`
    this.props.history.push({
      search: search_param
    })

    this.setState({ shown_products: show_products, page_number: page_number, search_param })
  }

  getNewCatProductsWithParams() {
    let page_number = this.props.location.search.split("=")
    let products = this.state.products
    let shown_products = this.state.shown_products
    if (page_number[0] === "?page_number") {
      page_number = parseInt(page_number[1])
      let beginning_index = (page_number * 12) - 12
      shown_products = products.slice(beginning_index, beginning_index + 13)
    } else {
      page_number = 1
      shown_products = products.slice(0, 12)  
    }
    this.setState({ 
      shown_products: shown_products,
      page_number,
      search_param: this.props.location.search
    })
  }
  
  render() {
    console.log(this.state.products)
    if(this.props.match.params.category !== this.state.current_cat) {
      this.getNewCatProducts()
    } else if(this.state.search_param !== null && this.props.location.search !== this.state.search_param) {
      this.getNewCatProductsWithParams()
    }

    let previous_disable = this.state.page_number === 1 ? true : false
    let next_disable = this.state.shown_products.length < 12 ? true :false
    return (
      <div style={{ padding: ".4em .4em 80px .4em", margin: "50px auto" }} className={`${!this.props.mobile && "max-customer-container-width"}`}>
        <MetaTags>
          {this.state.category_data &&
            <>
              <title>{this.state.category_data.meta_title}</title>
              <meta name="description" content={this.state.category_data.meta_description} />
              <meta name="keywords" content={this.state.category_data.meta_keywords} />
            </>
          }
        </MetaTags>

        { this.state.products !== null ?
          <>
            <a style={this.props.mobile ? {} : { fontSize: "20px" }} className="margin-s-v" onClick={() => this.props.sidebarBoolean(!this.props.sidebar)}><FontAwesomeIcon icon={faArrowLeft} /> Other Categories</a>
            <h1 style={{ margin: "0px" }}>
              {capitalizeFirsts(this.state.category_data.name)}
            </h1>
            <div className="flex">
              <button onClick={previous_disable === true ? "" : () => this.changePage('previous')} style={ previous_disable === true ? { color: "lightgrey", cursor: "default" } : { color: "#6CB2EB" }} className="bare_button">Previous</button>
                <div style={{ margin: "10px 5px" }}>{this.state.page_number}</div>
              <button onClick={next_disable === true ? "" : () => this.changePage('next')} style={ next_disable === true ? { color: "lightgrey", cursor: "default" } : { color: "#6CB2EB" }} className="bare_button">Next</button>
            </div>
            <div className={`flex flex-wrap ${this.state.shown_products.length < 3 ? "category_card_container_few" : "category_card_container"}`}>
              {this.renderProductCards()}
            </div>
            <div className="flex">
              <button onClick={previous_disable === true ? "" : () => this.changePage('previous')} style={ previous_disable === true ? { color: "lightgrey", cursor: "default" } : { color: "#6CB2EB" }} className="bare_button font-size-25">Previous</button>
                <div style={{ fontSize: "35px", margin: "0px 5px" }}>{this.state.page_number}</div>
              <button onClick={next_disable === true ? "" : () => this.changePage('next')} style={ next_disable === true ? { color: "lightgrey", cursor: "default" } : { color: "#6CB2EB" }} className="bare_button font-size-25">Next</button>
            </div>
          </>
       : <FontAwesomeIcon icon={faSpinner} className="loadingGif loadingGifCenterScreen" spin /> }
      </div>
    )
  }
}


function mapStateToProps({ auth, sidebar, cart, zeroInventory, mobile }) {
  return { auth, sidebar, cart, zeroInventory, mobile }
}

const actions = { sidebarBoolean, updateCart, createCart, getCategoryProducts }

export default connect(mapStateToProps, actions)(Category)
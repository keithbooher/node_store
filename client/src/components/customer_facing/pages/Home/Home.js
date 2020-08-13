import React, { Component } from 'react'
import { connect } from 'react-redux'
import ProductCard from '../../components/ProductCard'
import { updateCart, createCart } from '../../../../actions'
import { homeProducts, homeBanner } from '../../../../utils/API'
import loadingGif from '../../../../images/pizzaLoading.gif'
import mobile from "is-mobile"
import './home.css.scss'


let isMobile = mobile()


// pull from actions. create action to make request for adding product-data to the cart

class Home extends Component  {
  constructor(props) {
    super()
    this.state = {
      products: [],
      banner: ""
    }
  }

  async componentDidMount() {
    let { data } = await homeProducts()
    let banner_image = await homeBanner(isMobile ? "mobile" : "desktop")
    this.setState({ products: data, banner: banner_image.data })
  }

  renderProducts() {
    return this.state.products.map(product => {
      return <>
              <ProductCard 
                createCart={this.props.createCart}
                updateCart={this.props.updateCart}
                user={this.props.auth} 
                product={product} 
                cart={this.props.cart} 
                category_path_name={product.categories.length > 0 ? product.categories[0].path_name : ""} 
              />
            </>
    })
  }

  
  render() {
    return (
      <div>
        <h1>Node Store</h1>
        <div className="text-align-center margin-l-v">
          {this.state.banner ?
            <img className="w-auto h-auto" style={isMobile ? { maxHeight: "600px", maxWidth: "100%" } : { maxHeight: "600px", maxWidth: "100%", marginBottom: "30px" }} src={this.state.banner.value.image} />
          :
            <img className="loadingGif" src={loadingGif} />
          }
        </div>
        <div className="flex flex-wrap space-evenly home_product_container">
          {this.state.products.length > 0 ? this.renderProducts() : ""}
        </div>
      </div>
    )
  }
}


function mapStateToProps({ auth, cart }) {
  return { auth, cart }
}

export default connect(mapStateToProps, {updateCart, createCart})(Home)
import React, { Component } from 'react'
import { connect } from 'react-redux'
import ProductCard from '../../components/ProductCard'
import { updateCart, createCart } from '../../../../actions'
import { homeProducts, homeBanner } from '../../../../utils/API'
import './home.css.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import MetaTags from 'react-meta-tags'

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
    let { data } = await this.props.homeProducts()
    let banner_image = await this.props.homeBanner(this.props.mobile ? "mobile" : "desktop")
    this.setState({ products: data, banner: banner_image.data })
  }

  renderProducts() {
    let products = this.state.products
    if (products.length % 2 !== 0) {
      products.push(null)
    }
    return products.map(product => {
      if (product === null) {
        return (<div className="card_desktop"></div>)
      } else{
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
      }
    })
  }

  
  render() {
    return (
      <div style={{ padding: "0em 0em 100px 0em" }}>
        <MetaTags>
          <title>Node Store</title>
          <meta name="description" content="Some description." />
          <meta property="og:title" content="MyApp" />
          <meta property="og:image" content="path/to/image.jpg" />
        </MetaTags>

        <div className={`text-align-center`}>
          {this.state.banner ?
            <img className="w-auto h-auto border-radius-s" style={this.props.mobile ? { maxHeight: "600px", maxWidth: "100%" } : { maxHeight: "600px", maxWidth: "1600px", marginBottom: "30px" }} src={this.state.banner.value.image} />
          :
            <FontAwesomeIcon icon={faSpinner} className="loadingGif loadingGifCenterScreen" spin />
          }
        </div>
        <h1 className="text-align-center margin-m-v">Featured Products</h1>
        <div className={`flex flex-wrap justify-center home_product_container ${!this.props.mobile && "max-customer-container-width margin-auto-h"}`}>
          {this.state.products.length > 0 ? this.renderProducts() : ""}
        </div>
      </div>
    )
  }
}


function mapStateToProps({ auth, cart, mobile }) {
  return { auth, cart, mobile }
}

const actions = { updateCart, createCart, homeProducts, homeBanner }

export default connect(mapStateToProps, actions)(Home)
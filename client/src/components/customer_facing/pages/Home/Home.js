import React, { Component } from 'react'
import { connect } from 'react-redux'
import ProductCard from '../../components/ProductCard'
import { updateCart, createCart } from '../../../../actions'
import { homeProducts } from '../../../../utils/API'
import './home.css.scss'

// pull from actions. create action to make request for adding product-data to the cart

class Home extends Component  {
  constructor(props) {
    super()
    this.state = {
      products: []
    }
  }

  async componentDidMount() {
    let { data } = await homeProducts()
    console.log(data)
    if (!this.isEven(data.length)) {
      data.push({
        _id: "",
        name: "",
        // NEVER EVER EVER EVER CHANGE PATH NAME
        path_name: "",
        short_description: "",
        inventory_count: 0,
        price: 0,
        categories: [],
        image: "",
      })
      console.log(data)
    }
    this.setState({ products: data })
  }

  isEven(value){
      if (value%2 == 0)
          return true;
      else
          return false;
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
                category_path_name={product.categories.length > 1 ? product.categories[0].path_name : ""} 
              />
            </>
    })
  }

  
  render() {
    return (
      <div>
        <h1>Node Store</h1>
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
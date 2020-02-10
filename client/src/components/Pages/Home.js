import React, { Component } from 'react'
import { connect } from 'react-redux'
import { allProducts } from '../../actions'
import { Link } from 'react-router-dom'
import API from "../../utils/API";
import '../../stylesheets/homepage.css.scss'

class Home extends Component  {
  constructor({ subject, recipients }, content) {
    super()
    this.state = {
      products: []
    }
  }
  componentWillMount() {
    this.props.allProducts()
    // There is an API file that exports a module with functions that contain API calls for use
    // API.getSomeThing(argument).then((res) => {
    //   console.log(res.data)
    // })
  }

  render_products() {
    return this.props.products.reverse().map(product => {
      return (
        <div>
          <div class="card blue-grey darken-1">
            <div class="card-content white-text">
              <span class="card-title">{product.name}</span>
              <p>{product.description}</p>
            </div>
            <div class="card-action">
              <Link to={`/product/${product._id}`} className="">Go to this product</Link>
            </div>
          </div>
          
        </div>
      )
    })
  }

  
  render() {
    return (
      <div>
        <h1>
          Node Store
        </h1>
        <div className="product_grid">
          {this.render_products()}
        </div>
      </div>
    )
  }
}


function mapStateToProps({ products }) {
  return { products }
}

export default connect(mapStateToProps, {allProducts})(Home)